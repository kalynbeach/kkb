# Browser Oscilloscope Review

Reviewed document: `docs/research/browser-oscilloscope.md`
Date: 2026-03-28

## Summary

`browser-oscilloscope.md` is a strong research/design document with a clear artistic vision, good technical instincts, and strong alignment with the monorepo's general preference for keeping `@kkb/audio` headless and browser-runtime-focused.

The biggest gap is that the document is stronger as a product/research brief than as an implementation-ready spec. In particular, it slightly underestimates how different the proposed oscilloscope signal/tap architecture is from the audio stack that exists in the repo today.

## Repo context consulted

- `packages/audio/package.json`
- `packages/audio/src/engine/engine.ts`
- `packages/audio/src/sources/audio-source.ts`
- `packages/audio/src/sources/media-element-shared.ts`
- `packages/audio/src/sources/media-element-source.ts`
- `packages/audio/src/sources/fallback-source.ts`
- `packages/audio/src/sources/webcodecs-source.ts`
- `packages/audio/src/sources/worklet-pcm-source.ts`
- `packages/audio/src/worklet/sab-ring-buffer.ts`
- `packages/audio/src/worklet/register-worklet.ts`
- `apps/web/lib/audio/create-web-player.ts`
- `apps/web/next.config.js`
- `docs/reports/2026-03-28-monorepo-architecture-map.md`
- `docs/specs/2026-03-10-web-audio-player-rfc.md`
- `docs/plans/2026-03-13-audio-issue-remediation.md`

## What is strong

### 1. Clear, compelling product vision

The document knows what it wants to be: not a lab instrument, but an expressive audio-geometry tool. That keeps the mode set coherent and gives the whole proposal a strong identity.

### 2. Package placement mostly fits the repo

Putting the headless oscilloscope core in `packages/audio/src/oscilloscope/` is consistent with the current shape of `@kkb/audio` as a source-first runtime package with subpath exports.

### 3. Honest worklet/SAB gap analysis

The document accurately reflects the current state of the repo:

- `sab-ring-buffer.ts` is only a minimal allocator
- `register-worklet.ts` is a thin wrapper around `audioWorklet.addModule()`
- `apps/web` is not configured for COOP/COEP today

That honesty is a major strength.

### 4. Good separation between V1 and V2 rendering fidelity

The distinction between a simple, visually satisfying trail renderer and a later physically motivated phosphor model is exactly the right approach.

## Main concerns

### 1. Track integration is harder than the document currently implies

This is the biggest issue.

The document correctly notes that the engine does not expose graph taps. But the larger problem is that the active playback path in the repo is not really a reusable Web Audio graph owner today.

In `apps/web/lib/audio/create-web-player.ts`, the host primarily creates:

- `MediaElementSource`
- `FallbackSource`
- opt-in stubs for `WorkletPCMSource`
- opt-in stubs for `WebCodecsSource`

And `packages/audio/src/sources/media-element-shared.ts` shows that the practical active sources are HTML media element wrappers, not analyzable `AudioNode` graphs.

So the document's recommendation to use consumer-side graph wiring as the V1 track path is optimistic. In many cases there are no meaningful graph nodes to expose yet.

### 2. `PointGenerator` is too narrow as the core abstraction

The current abstraction:

```ts
type PointGenerator = (
  t: number,
  signals: SignalProvider,
  params: ModeParams,
) => { x: number; y: number };
```

works well for XY-like parametric modes, but less well for:

- Y-T mode with triggering/window selection
- Spectrum mode
- multi-band or layered modes
- any mode that wants to emit batched geometry rather than one logical point at a time

A frame/batch geometry abstraction would be more honest and extensible.

### 3. React wrapper location is too loose

The document says the React wrapper can live in `apps/web` or `packages/ui`.

That should be tightened.

The repo's existing docs and architecture strongly suggest:

- `@kkb/audio` remains headless
- `@kkb/ui` stays isolated from `@kkb/audio`
- browser-only integration concerns belong in `apps/web`

So the first wrapper/demo should live in `apps/web`, not be casually routed through `packages/ui`.

### 4. Phase 1 scope is too large

Current Phase 1 includes:

- WebGPU init
- GPU ring buffer
- rasterization shader
- bloom
- internal oscillators
- XY mode
- Y-T mode with trigger
- public API
- grid/HUD
- aspect ratios
- phosphor presets

That is too much for a first shippable milestone.

### 5. Public API mixes visualization and audio ownership

The proposed API suggests the oscilloscope owns both rendering and audio lifecycle:

```ts
scope.start(); // begin render loop + audio
scope.setSource({ type: "mic" });
```

That does not fit especially well with the current repo boundaries, where playback authority and browser-only orchestration belong outside presentation code.

A cleaner model would have the oscilloscope own:

- canvas lifecycle
- GPU resources
- render loop
- visualization config

And the host own:

- mic permission
- audio context lifecycle
- track playback lifecycle
- `SignalProvider` creation

## Section-by-section redline recommendations

## 1. Title / framing

### Keep

- The title
- The inspiration link
- The artistic framing

### Change

Add a sentence near the top clarifying that this is a research/design brief rather than a fully implementation-ready spec.

Suggested addition:

> This document is a product and technical research brief, not yet a final implementation spec. It identifies likely architecture, known platform gaps, and a staged path to a V1.

## 2. Vision

### Keep

- The audio-as-geometry framing
- The distinction between oscilloscope work and future cymatics work

### Change

Make the realistic V1 explicit.

Suggested addition:

> V1 scope: internal oscillators + mic input + WebGPU rendering, with track playback visualization deferred until the web host exposes a stable tap/analyser path.

## 3. Display Modes

### 3a. Mode Architecture

### Issue

The current single-point generator abstraction is too narrow.

### Recommended change

Replace it with a frame or batch geometry model.

Suggested direction:

```ts
type FrameGeometry =
  | { kind: "points"; points: Float32Array }
  | { kind: "line-strip"; points: Float32Array }
  | { kind: "bins"; values: Float32Array };

type DisplayMode = {
  id: string;
  name: string;
  generateFrame(input: {
    time: number;
    signals: SignalProvider;
    params: ModeParams;
    viewport: { width: number; height: number };
  }): FrameGeometry;
  params: ModeParamSchema;
};
```

This would support XY, Y-T, Spectrum, and future layered modes more cleanly.

### 3b. Y-T mode

### Keep

- Triggering discussion
- Zero crossing / Schmitt / correlation progression

### Change

Clarify that Y-T is not just a parametric point generator. It selects a stable frame window, finds a trigger index, and maps a buffer slice across the visible width.

Suggested addition:

> Y-T mode is a frame-window mode rather than a pure parametric curve mode: it chooses a stable slice of recent samples, then maps that slice across the visible X range.

### 3c. Harmonic Orbits

### Keep

Most of the content.

### Change

Make multi-layer XY the explicit V1 path and treat 3D Lissajous projection as later exploration.

Suggested wording:

> Recommended V1: multi-layer XY with parameter spread and long persistence. 3D Lissajous projection is promising but should be treated as a later enhancement once the core renderer is stable.

### 3d. Spectrum

### Change

Acknowledge that Spectrum is structurally different from trail-based modes.

Suggested addition:

> Spectrum mode should be treated as a separate geometry/render path sharing the same canvas and post-processing stack, but not necessarily the same point-history model.

## 4. Rendering Architecture

### 4a. Why WebGPU

### Keep

The overall argument.

### Change

Soften hard numerical comparisons unless benchmarked. Prefer language like:

> WebGPU is better suited than Canvas2D for sustained high-density traces, bloom, and future physically based phosphor effects.

### 4b. The Phosphor Model

### Keep

This is one of the strongest sections in the document.

### Change

Clarify that the goal is perceptual plausibility rather than strict physical simulation.

Suggested addition:

> The goal is perceptual plausibility rather than exact CRT physical simulation.

### 4c. GPU Pipeline

### Issue

The four-pass design is a good target but reads too committed for V1.

### Change

Split this into:

- V1 actual pipeline
- V2 target pipeline

Suggested framing:

**V1**
1. CPU generates frame geometry
2. GPU render pass draws points or lines into a texture
3. optional lightweight bloom
4. composite to screen

**V2**
1. compute-driven accumulation/history
2. rasterization to HDR target
3. multi-scale bloom
4. tone map + CRT effects

### 4d. Buffer model

Clarify that sample history and visual persistence history are not necessarily the same buffer.

Suggested addition:

> The renderer should distinguish between recent input samples used to generate the current frame and retained visual history used to simulate persistence. These do not have to share the same buffer structure.

## 5. WGSL Shader Strategy

### Keep

The inline WGSL strategy is well aligned with the repo's source-first packaging.

### Change

Add a small caveat that if shader count or size grows significantly, external organization can be revisited later.

## 6. Signal Pipeline

### 6a. Unified Signal Interface

### Keep

The `SignalProvider` abstraction is a good foundation.

### Change

Expose the provider characteristics the renderer already depends on conceptually.

Suggested direction:

```ts
type SignalProvider = {
  getSamples(channel: 0 | 1): Float32Array;
  getFrequencyData(channel: 0 | 1): Float32Array;
  frequencyBinCount: number;
  sampleRate: number;
  fftSize: number;
  smoothing: number;
  channelCount: 1 | 2;
};
```

### 6b. Internal oscillators

### Keep

This section is strong.

### Change

Explicitly call internal oscillators the best V1 source because they avoid host graph dependencies.

### 6c. Mic / line input

### Keep

The section is good overall.

### Change

Add a boundary note that permissions, device selection, and user-gesture handling belong in the host layer rather than the oscilloscope core.

### 6d. Loaded tracks

### Issue

This section currently understates the amount of host integration work required.

### Recommended rewrite

State more clearly that track playback visualization is blocked on host graph architecture work, not just on a small engine hook.

Suggested direction:

- Current active track paths are media-element backed
- There is not yet a stable host-owned Web Audio graph with exposed nodes
- A future track visualization path likely requires:
  - `HTMLMediaElement`
  - `MediaElementAudioSourceNode`
  - analyser nodes and/or channel splitters
  - destination
- This is host integration work, likely in `apps/web`, rather than a small `AudioEngine` extension

Suggested wording:

> Track playback visualization is not a near-zero-cost extension of the current engine. The practical browser host path today is media-element-backed playback, not a reusable Web Audio graph with exposed nodes. Supporting track visualization therefore requires new host-level graph ownership and analyser insertion, likely in `apps/web`, before the oscilloscope can treat track playback as a stable `SignalProvider`.

## 7. Triggering

### Keep

Good content.

### Change

Move it closer to Y-T mode because it is mode-specific behavior rather than a general signal source topic.

## 8. Worklet Path (V2)

### Keep

This section is accurate and grounded.

### Change

Add two clarifications:

1. This path is a fidelity/latency upgrade, not required to ship a compelling V1.
2. It is distinct from the current playback-oriented `WorkletPCMSource` abstraction already present in the repo.

Suggested addition:

> The AudioWorklet + SAB path is a fidelity and latency upgrade, not a prerequisite for shipping a compelling V1.

And:

> This proposed oscilloscope worklet path is distinct from the current playback-oriented `WorkletPCMSource` abstraction in `@kkb/audio`; it would require a new PCM-sharing transport contract.

## 9. Audio Engine Integration

### Issue

The section correctly identifies a gap but still leans too much toward engine-adjacent integration.

### Change

Make host-owned graph integration the primary recommendation.

Suggested revised recommendation:

> Recommended architecture: keep `@kkb/audio` focused on playback runtime and define oscilloscope integration at the browser host layer. The host should own any Web Audio graph required for analyser taps and pass a `SignalProvider` into the oscilloscope, rather than teaching `AudioEngine` to expose internal nodes.

This aligns better with the repo's current architecture.

## 10. Adapter Pattern

### Keep

Good direction.

### Change

Clarify that `AnalyserSignalProvider` is most realistic for:

- mic input in V1
- future host-owned graph taps

rather than implying engine playback and mic input are equivalent integration cases today.

## 11. Controls & Interaction

### Keep

The control inventory is thoughtful.

### Change

Tag controls by phase so the initial product surface stays manageable.

Suggested V1 control set:

- source selector: oscillators / mic
- mode: XY, maybe Y-T
- oscillator frequency A/B
- phase
- amplitude
- waveform
- ratio lock
- trail length
- phosphor color
- bloom intensity
- grid

Defer track source controls, URL state, and more advanced display controls.

## 12. Preset System

### Keep

Worth having.

### Change

Keep built-in presets in scope earlier if desired, but move URL-encoded sharing later.

## 13. Canvas & Layout

### Keep

Good section overall.

### Change

Explicitly prioritize square presentation for V1, since the strongest early modes are XY-oriented.

Suggested addition:

> V1 should optimize first for square presentation, with wider aspect ratios added once Y-T and Spectrum are mature.

## 14. Package Structure

### Keep

Placing the headless core under `packages/audio/src/oscilloscope/` is reasonable.

### Change

Add a note that several important integration concerns do not belong in `@kkb/audio`, including:

- mic permission orchestration
- browser host graph wiring for track taps
- the first React wrapper/demo

## 15. Exports

### Keep

Adding `./oscilloscope/*` is consistent with current `@kkb/audio` exports.

### Change

Prefer a cleaner import path than `@kkb/audio/oscilloscope/index` if possible.

Suggested target:

```ts
import { createOscilloscope } from "@kkb/audio/oscilloscope";
```

## 16. Public API

### Issue

The API currently mixes rendering ownership with audio ownership.

### Change

Shift the API so the oscilloscope accepts a provider rather than owning browser audio setup.

Suggested direction:

```ts
const scope = createOscilloscope(canvasElement, config);
scope.setSignalProvider(provider);
scope.start();
scope.updateConfig(partial);
scope.destroy();
```

That keeps browser permissions and playback control in the host layer.

## 17. React Integration

### Change

Recommend `apps/web` only for the first wrapper/demo.

Suggested rewrite:

> The first React wrapper/demo should live in `apps/web`, where browser-only concerns such as permissions, canvas mounting, and host audio integration already belong. A shared adapter can be considered later if the repo chooses to introduce an explicit UI/runtime bridge.

## 18. Implementation Phases

### Issue

Phase 1 is too large.

### Recommended re-scope

#### Phase 1: Smallest viable renderer
- WebGPU init + support detection
- internal oscillators
- XY mode only
- CPU-generated frame geometry uploaded each frame
- simple trail fade
- one phosphor palette
- minimal public API
- demo in `apps/web`

#### Phase 2: Core expansion
- Y-T mode with trigger
- mic input via analyser provider
- grid/HUD
- more phosphor presets
- basic preset save/load

#### Phase 3: Extended modes + host integration
- Harmonic Orbits
- Tunnel
- Polar
- Spectrum
- host graph refactor for track visualization

#### Phase 4: Fidelity upgrades
- better bloom
- velocity-based intensity
- multi-timescale phosphor decay
- CRT effects
- quality modes

#### Phase 5: Worklet/SAB precision path
- SAB transport
- AudioWorklet PCM sharing
- COOP/COEP host configuration
- fallback behavior in non-isolated contexts

## 19. Key Technical Notes

### Frame rate coupling

### Keep

Good framing.

### Change

Add that display geometry generation should explicitly decouple visible point density from raw audio sample rate.

### Downsampling

### Change

Consider broadening the concept to geometry reduction rather than sample-only downsampling, since not every mode is raw waveform rendering.

### WebGPU availability

### Keep

Good note and good call not to maintain a Canvas2D fallback.

### Change

Add a note that the host should present a clear unsupported-state UI if no fallback renderer is planned.

## 20. Future: Cymatics Extensions

### Keep

Good future-looking section.

### Change

Add one sentence separating reusable investments from non-reusable ones.

Suggested addition:

> The signal-provider and host-integration abstractions may carry forward into future cymatics work, but the renderer assumptions for Chladni or surface simulation may diverge substantially from the oscilloscope's trace-oriented pipeline.

## Highest-priority edits if only a few changes are made

If only a small revision pass happens, the highest-value edits are:

1. Replace `PointGenerator` with a frame or batch geometry abstraction
2. Rewrite track-source integration as blocked on host graph work
3. Make host-layer graph ownership the recommended integration architecture
4. Restrict the first React wrapper to `apps/web`
5. Shrink Phase 1 to XY + internal oscillators + minimal renderer

## Final assessment

As a research document, this is very good. As an implementation spec, it still needs a tighter relationship to the repo's current audio architecture and a stricter V1 scope.

The main improvement is not to change its ambition, but to make the dependency chain more truthful:

- internal oscillators are the easiest and strongest V1 source
- mic input is feasible with a host-managed analyser path
- track visualization requires more host-level graph work than the current draft suggests
- the core rendering abstraction should be frame/batch-oriented rather than single-point-oriented
