# Web Audio Player RFC

Status: Proposed  
Last Updated: 2026-02-22  
Owner: KKB  
Audience: `apps/web`, `apps/docs`, future audio-focused apps, and shared `packages/*`

## 1. Context

The monorepo is currently a clean Turborepo + Bun baseline:

1. `apps/web` and `apps/docs` are Next.js 16 apps on React 19.2.
2. Shared UI lives in `@kkb/ui`.
3. Shared TS config lives in `@kkb/typescript-config`, and shared UI styles live in `@kkb/ui`.
4. Workspace tasks are currently `dev`, `build`, and `check-types` (plus root-only lint tasks).
5. No dedicated test runner/task is wired in Turborepo yet.

The current research direction in `docs/research/web-audio-player.md` is strong but still transcript-like and not implementation-oriented. This RFC converts that research into concrete architecture and rollout decisions for this repo.

## 2. Problem

We need to build a production-quality web audio player that is:

1. High-fidelity (sample-accurate transport where possible, robust gapless behavior, consistent level handling).
2. Glitch-resistant under real UI/network load.
3. Portable across hosts (Next.js now, other React hosts later) without coupling core audio packages to Next.
4. Resilient to browser capability differences, especially Safari/iOS constraints and non-SAB environments.

## 3. Goals

1. Define a single engine API with pluggable source implementations.
2. Support ranked playback strategies with runtime fallback.
3. Keep React UI framework-agnostic and reusable across hosts.
4. Define measurable reliability/performance targets.
5. Fit into existing Bun + Turborepo package/task conventions.

## 4. Non-Goals (Initial RFC Scope)

1. DRM integration.
2. DAW-grade nonlinear editing.
3. Multi-room sync.
4. Full DSP suite (advanced EQ/compression plugins).
5. Native app wrappers.

## 5. Proposed Monorepo Architecture

Create four audio-focused packages and keep host specifics in apps:

1. `packages/audio-engine` (`@kkb/audio-engine`)
2. `packages/audio-sources` (`@kkb/audio-sources`)
3. `packages/audio-worklet` (`@kkb/audio-worklet`)
4. `packages/audio-ui-react` (`@kkb/audio-ui-react`)

Host integration stays in `apps/web` (and future hosts). No package in `packages/*` may import `next/*`.

### 5.1 Package Responsibilities

`@kkb/audio-engine`
1. Transport and timeline state machine.
2. Source lifecycle and capability-based source selection.
3. Event bus, diagnostics, and recovery orchestration.
4. Audio graph coordination interfaces (not host asset plumbing).

`@kkb/audio-sources`
1. `MediaElementSource` for broad compatibility and streaming ergonomics.
2. `WorkletPCMSource` for custom PCM transport.
3. `WebCodecsSource` as preferred high-control decode path when supported.
4. `FallbackSource` for direct `<audio>` compatibility mode.

`@kkb/audio-worklet`
1. AudioWorklet processor(s).
2. Shared data-plane protocol (`SAB` tier and `postMessage` tier).
3. Host-facing resolver API for processor URLs.

`@kkb/audio-ui-react`
1. `usePlayer()` and UI components.
2. `useSyncExternalStore` integration for coarse player state.
3. High-frequency visual hooks that read time directly from engine per animation frame.

## 6. Core Interfaces

### 6.1 Source Capability Contract

Every source reports capabilities and implements a common control surface:

```ts
type GaplessCapability = true | false | "best-effort";

type SourceCapabilities = {
  streaming: boolean;
  sampleAccurateSeek: boolean;
  gapless: GaplessCapability;
  loudnessMetadata: boolean;
  requiresUserGesture: boolean;
  requiresSAB: boolean;
};

type SourceScoreContext = {
  userAgent: string;
  coopCoepEnabled: boolean;
  networkType?: string;
  lowPowerModeLikely: boolean;
};

interface AudioSource {
  readonly id: string;
  readonly capabilities: SourceCapabilities;
  canPlay(input: TrackInput): Promise<boolean>;
  score(ctx: SourceScoreContext): number;
  load(input: TrackInput): Promise<void>;
  play(): Promise<void>;
  pause(): Promise<void>;
  seek(seconds: number): Promise<void>;
  getTimeline(): TimelineSnapshot;
  destroy(): Promise<void>;
}
```

### 6.2 Deterministic Selection and Fallback

Selection algorithm:

1. Filter sources by `canPlay`.
2. Sort by `score(ctx)` descending.
3. Try load/play in order.
4. On failure, classify error and move to next source.
5. Persist last-known-good source per browser family as hint, not hard pin.

Fallback is not an edge case; it is a first-class runtime path.

## 7. Playback Strategy Policy

Priority in normal environments:

1. `WebCodecsSource` when format + demux + worker pipeline are supported.
2. `MediaElementSource` when codec/container support or platform stability is better via native media pipeline.
3. `WorkletPCMSource` when custom decode/PCM flow is needed.
4. `FallbackSource` for minimal compatibility mode.

Design note: `WebCodecsSource` depends on demux strategy and format constraints. The initial implementation must explicitly declare supported container/codec combinations.

## 8. Audio Data Plane Tiers

Tier A (`SAB`):
1. Shared ring buffer.
2. Lowest overhead and lowest jitter path.

Tier B (`postMessage`):
1. Timestamped chunk queue.
2. Sequence numbers + frame counts for loss detection/resync.
3. Larger chunk cadence to reduce messaging overhead.

Tier B is required, not optional, so lack of `COOP/COEP` is degraded performance rather than hard failure.

## 9. Error and Recovery Model

### 9.1 Error Taxonomy

1. `NetworkError`
2. `DecodeError`
3. `WorkletError`
4. `UnsupportedError`
5. `UserGestureRequiredError`
6. `InterruptionError` (visibility/session/audio-route interruptions)

### 9.2 Recovery Policy

1. Retry transient network errors with bounded exponential backoff + jitter.
2. Move down source fallback chain on unrecoverable decode/init errors.
3. Rebuild audio graph on worklet/context faults.
4. Restore transport checkpoint (`trackId`, `time`, `rate`, `volume`, `loop`, normalization mode).
5. Resume with short fade-in to avoid click artifacts.

## 10. Platform Compatibility Policy

Safari/iOS receives explicit capability gates:

1. User gesture unlock flow is mandatory.
2. `createMediaElementSource()` failures trigger compatibility mode fallback.
3. Gapless is treated as capability-driven (`true`, `false`, `best-effort`) and not assumed.
4. Background/interruption transitions are explicit state transitions, not implicit side effects.

## 11. React 19.2 and Host Integration

1. Engine state is external; React subscribes via `useSyncExternalStore`.
2. High-frequency values (`currentTime`) are not stored in React state.
3. UI-triggered expensive updates use `startTransition`.
4. `@kkb/audio-ui-react` exports framework-agnostic React components/hooks only.
5. Host apps provide environment adapters (worklet URL resolution, optional analytics hooks, storage policy).

## 12. Observability and SLOs

Minimum player SLOs for GA target:

1. Audio underrun rate under 0.1% of active playback minutes on supported desktop browsers.
2. Play-to-audible median under 150ms after warmed load for cached segments.
3. Seek-to-audible p95 under 250ms for in-buffer seeks.
4. Recovery success over 99% for transient network failures within retry budget.

Required diagnostics:

1. Underrun counters.
2. Decode latency histograms.
3. Buffer-ahead telemetry over time.
4. Source selection/fallback reason codes.
5. Worklet tier (`SAB` vs `postMessage`) per session.

## 13. Turborepo Task and Package Conventions

Follow existing repo conventions:

1. Add scripts in each new package `package.json` (`check-types`, `build`, and `test` once tests exist).
2. Register matching tasks in root `turbo.json`.
3. Keep root scripts delegating with `turbo run <task>`.
4. Use `workspace:*` for internal dependencies.

No audio package should rely on root-only bespoke scripts.

## 14. Phased Rollout

### Phase 1: Foundation

1. Scaffold `@kkb/audio-engine`, `@kkb/audio-sources`, `@kkb/audio-worklet`, `@kkb/audio-ui-react`.
2. Implement engine state/events and deterministic source selection.
3. Implement `MediaElementSource` and `FallbackSource`.
4. Integrate minimal player shell in `apps/web`.

Exit criteria:
1. End-to-end playback and seek in `apps/web`.
2. Compatibility mode fallback works on forced source-init failure.

### Phase 2: Worklet Transport

1. Add `WorkletPCMSource`.
2. Implement Tier A/Tier B data-plane paths.
3. Add underrun/delay diagnostics and recovery hooks.

Exit criteria:
1. Stable playback under synthetic main-thread load tests.
2. Tier fallback is automatic and transparent.

### Phase 3: WebCodecs Path

1. Add worker decode pipeline and supported demux path.
2. Add capability scoring preference for WebCodecs where stable.
3. Add source fallback from WebCodecs decode failures.

Exit criteria:
1. Deterministic source selection outcomes by capability profile.
2. WebCodecs path shows equal or better seek/jitter metrics vs alternatives on supported browsers.

### Phase 4: Fidelity and UX

1. Add normalization modes and loudness metadata flow.
2. Add gapless best-effort strategy improvements.
3. Add richer diagnostics HUD and release quality gates.

## 15. Risks and Mitigations

1. Demux complexity for WebCodecs.
Mitigation: constrain supported codec/container matrix initially and expand incrementally.

2. Safari/iOS instability and policy variance.
Mitigation: explicit compatibility profile + tested fallback chain.

3. SAB deployment constraints.
Mitigation: Tier B must be production-capable, not debug-only.

4. Scope creep during “best possible” push.
Mitigation: enforce phased exits and non-goals.

## 16. Open Questions

1. Which codec/container matrix is in-scope for Phase 3?
2. Should normalization defaults be track-based or album-based for playlist contexts?
3. What long-term test stack should be adopted for audio package unit/integration testing in this monorepo?
4. Do we want a dedicated `apps/audio-lab` host for profiling and compatibility validation?

## 17. Decision Summary

This RFC adopts a single-engine, pluggable-source architecture with deterministic capability-based selection and mandatory fallback paths, packaged as framework-agnostic shared workspaces for this Turborepo. It prioritizes compatibility first, then high-fidelity control paths, while keeping performance and resilience measurable with explicit SLOs.
