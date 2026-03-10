# Web Audio Player RFC

Status: Proposed  
Last Updated: 2026-03-10  
Owner: KKB  
Audience: `packages/audio`, `packages/ui`, `apps/web`, and future audio-capable hosts

## 1. Context

The existing research established the right high-level direction:

1. Audio-critical logic must live outside React renders.
2. Runtime fallback is mandatory, especially for Safari/iOS and non-`SAB` environments.
3. The product target is unusually high: near-term delivery with high fidelity and high performance, not a basic `<audio>` wrapper.

This RFC updates the earlier draft in three ways:

1. Consolidates the core runtime into a single package: `packages/audio` (`@kkb/audio`).
2. Makes engine-owned fallback and recovery a first-class requirement.
3. Includes v1 UI integration based on ElevenLabs audio components, but only as adapted UI primitives, not as the playback state authority.

## 2. Problem

We need a production-grade audio player for the web app that:

1. Prefers the highest-fidelity viable playback path at runtime.
2. Degrades safely when a preferred path fails or is unsupported.
3. Preserves a clean boundary between audio runtime logic and React UI.
4. Ships in this monorepo without premature package fragmentation.

## 3. Goals

1. Build one core audio package with clear internal module boundaries.
2. Support capability-based source ranking with engine-owned fallback attempts.
3. Deliver a v1 UI using adapted ElevenLabs-inspired player and waveform components.
4. Keep `apps/web` as a host adapter, not the place where playback policy lives.
5. Define measurable performance and reliability targets.

## 4. Non-Goals for V1

1. DRM.
2. DAW-style nonlinear editing.
3. Multi-room sync.
4. Arbitrary codec/container support.
5. Adaptive streaming manifests (`HLS`, `DASH`) in the first implementation.
6. Using ElevenLabs' playback provider as the source of truth for transport state.

## 5. Package Architecture

Create a single core package:

1. `packages/audio` (`@kkb/audio`)

Keep UI and host code outside that package:

1. `packages/ui` holds reusable React UI components.
2. `apps/web` wires browser-specific adapters, route composition, and demo/integration surfaces.

### 5.1 Why One Package Now

`@kkb/audio` is the right starting point because:

1. The engine, sources, worklet protocol, and metrics will change together early on.
2. A single package reduces workspace churn while the runtime contract is still unstable.
3. We can preserve future split points through subpath exports and folder boundaries.

If the codebase later proves stable enough to split, the likely seams are:

1. `@kkb/audio/engine`
2. `@kkb/audio/sources`
3. `@kkb/audio/worklet`

## 6. Internal Module Boundaries in `@kkb/audio`

The package should remain physically unified but logically segmented:

1. `src/contracts/*`
2. `src/engine/*`
3. `src/sources/*`
4. `src/worklet/*`
5. `src/metrics/*`

Recommended exports:

```json
{
  "name": "@kkb/audio",
  "exports": {
    ".": "./src/index.ts",
    "./contracts": "./src/contracts/index.ts",
    "./engine": "./src/engine/index.ts",
    "./sources": "./src/sources/index.ts",
    "./worklet": "./src/worklet/index.ts",
    "./metrics": "./src/metrics/index.ts"
  }
}
```

React hooks and components do not belong in `@kkb/audio`.

## 7. Core Runtime Model

### 7.1 Engine Owns Selection, Fallback, and Recovery

The engine is the only layer allowed to:

1. Rank candidate sources.
2. Attempt source initialization.
3. Classify failures.
4. Retry transient operations.
5. Fail over to the next source.
6. Restore playback checkpoint after recovery.

Hosts may provide:

1. Environment facts.
2. Source factories.
3. Worklet URL resolution.
4. Persistence hooks.
5. Analytics sinks.

Hosts may not implement their own source fallback policy.

### 7.2 Minimal Engine Responsibilities

1. Transport state machine.
2. Source lifecycle.
3. Timeline snapshotting.
4. Recovery orchestration.
5. Diagnostics emission.

### 7.3 Engine Checkpoint

The engine must preserve enough state to resume after source or graph reconstruction:

1. `trackId`
2. `currentTime`
3. `playing`
4. `rate`
5. `volume`
6. `loop`
7. Normalization mode
8. Last selected source id

## 8. Source Strategy

The runtime architecture includes four source types inside `@kkb/audio`:

1. `WebCodecsSource`
2. `MediaElementSource`
3. `WorkletPCMSource`
4. `FallbackSource`

### 8.1 Selection Policy

Selection is capability-driven, not hard-coded by source name:

1. Filter by `canPlay(input)`.
2. Filter by explicit eligibility constraints.
3. Sort by `score(context)`.
4. Attempt `load`.
5. On failure, classify and continue down the ordered list.

Rollout order:

1. Phase 1 ships `MediaElementSource` and `FallbackSource`
2. Phase 2 adds `WorkletPCMSource`
3. Phase 3 adds `WebCodecsSource`

### 8.2 Runtime Preference

Once all planned source types are implemented, the preferred path is:

1. `WebCodecsSource` for explicitly supported codec/container inputs on verified browsers.
2. `MediaElementSource` when native media pipeline is more reliable or the input falls outside the WebCodecs matrix.
3. `WorkletPCMSource` for custom PCM transport and editor-like paths.
4. `FallbackSource` for minimal compatibility mode.

This means `WebCodecsSource` is a near-term deliverable, but not a blind default. It is only eligible when the format, demux path, and browser support are known-good.

## 9. V1 Input Matrix

V1 must declare its supported input matrix up front.

### 9.1 In Scope for V1

1. HTTP or local-file playback of `audio/webm; codecs=opus`
2. HTTP or local-file playback of `audio/mp4` / `audio/m4a; codecs=mp4a.40.2`
3. Optional lab-only `wav` / PCM inputs for validation and tooling

### 9.2 Out of Scope for Initial WebCodecs Path

1. `FLAC`
2. Adaptive streaming manifests
3. Unbounded codec/container combinations
4. Browser-specific demux exceptions without test coverage

If a track is outside the declared matrix, the engine must prefer `MediaElementSource` or `FallbackSource` instead of attempting speculative WebCodecs playback.

## 10. Data Plane

`WorkletPCMSource` and related worklet transport must support two production tiers:

1. Tier A: `SharedArrayBuffer` ring buffer
2. Tier B: `postMessage` chunk transport

Tier B is required for production compatibility. Lack of `COOP/COEP` is degraded efficiency, not hard failure.

### 10.1 Initial Worklet Asset Strategy

For the initial Next.js host integration:

1. `@kkb/audio` owns the processor contract and registration helper.
2. `apps/web` serves a browser-ready worklet file from `public/worklets/kkb-audio-processor.js`.
3. The web host passes `/worklets/kkb-audio-processor.js` into the audio runtime as the worklet module URL.
4. Automatic asset emission can be added later, but v1 should use this explicit static-asset path to avoid bundler ambiguity.

## 11. UI Integration Policy

V1 includes ElevenLabs-based UI integration, but with a strict boundary:

1. Use ElevenLabs component structure and interaction patterns as the UI foundation.
2. Adapt or vendor the relevant pieces into repo-owned components.
3. Bind those components to `@kkb/audio` engine state and actions.
4. Do not make `AudioPlayerProvider` or an `HTMLAudioElement` ref the global playback authority.

### 11.1 Practical UI Shape

Recommended v1 UI composition:

1. `packages/ui/src/components/audio/player-controls.tsx`
2. `packages/ui/src/components/audio/waveform.tsx`
3. `packages/ui/src/components/audio/playhead.tsx`
4. `apps/web/components/audio/player-shell.tsx`

The waveform and scrubber interactions should be informed by the ElevenLabs waveform model, but driven by:

1. `duration`
2. `currentTime`
3. `bufferedRanges`
4. `onSeek`
5. Diagnostics state when useful

## 12. React and Host Integration

1. React reads coarse engine state through `useSyncExternalStore`.
2. High-frequency time reads stay outside React state.
3. `apps/web` owns browser-only lifecycle and client boundaries.
4. Audio objects such as `AudioContext`, `Audio`, and worklet loading must be created in client components or client-only factories.
5. Initial integration should use deterministic local audio fixtures from `apps/web/public/audio/*` for development and verification.

The App Router integration must not instantiate `new Audio()` inside a server component render path.

## 13. Observability and SLOs

Required diagnostics:

1. Source selection attempts and reason codes
2. Fallback count by source pair
3. Decode/init latency histograms
4. Buffer-ahead telemetry
5. Underrun counters
6. Worklet tier in use

GA target SLOs:

1. Audio underruns under 0.1% of active playback minutes on supported desktop browsers
2. Play-to-audible median under 150ms after warmed load for cached inputs
3. In-buffer seek-to-audible p95 under 250ms
4. Recovery success above 99% for transient network and initialization faults within retry budget

## 14. Rollout Phases

### Phase 1: Core Compatibility Path

1. Scaffold `@kkb/audio`
2. Implement contracts, store, engine lifecycle, and checkpoint recovery
3. Implement `MediaElementSource` and `FallbackSource`
4. Ship basic web-host integration and adapted UI shell

### Phase 2: Worklet Transport

1. Add worklet protocol and Tier B transport
2. Add Tier A `SAB` path
3. Add underrun instrumentation and recovery hooks

### Phase 3: WebCodecs Path

1. Add supported demux path
2. Gate `WebCodecsSource` by explicit matrix
3. Prefer WebCodecs only on verified platforms

### Phase 4: Fidelity and Release Hardening

1. Add normalization modes and loudness metadata
2. Improve gapless behavior
3. Add QA matrix, codec matrix, and runbook

## 15. Risks and Mitigations

1. WebCodecs/demux complexity
Mitigation: keep the v1 matrix narrow and test-backed.

2. UI/provider boundary confusion from ElevenLabs examples
Mitigation: vendor or adapt the UI pieces, but keep engine state in `@kkb/audio`.

3. Safari/iOS instability
Mitigation: explicit compatibility gates and mandatory engine fallback.

4. Single-package sprawl
Mitigation: enforce internal folders and subpath exports from day one.

## 16. Decision Summary

This RFC adopts a single-package core audio runtime in `@kkb/audio`, with engine-owned source selection and fallback, a scoped near-term WebCodecs path, and an adapted ElevenLabs-based UI in v1. The design optimizes for high fidelity without pretending that compatibility is optional, and it keeps React UI separate from playback authority.
