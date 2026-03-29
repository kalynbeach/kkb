# Browser Oscilloscope & Cymatics Explorer

> Research and design brief for a WebGPU-powered artistic oscilloscope in the browser, built as part of `@kkb/audio`.

> **Inspiration**: [anthrupad oscilloscope video](https://x.com/anthrupad/status/2036024416686195187)
> — XY mode Lissajous figures, harmonic orbit clusters, tunnel forms, and classic green phosphor CRT glow.

> **Document status**: This is a product and technical research brief, not yet a final implementation spec. It describes the intended user experience, the most likely architecture, known monorepo/platform constraints, and a staged path to a compelling V1.

---

## Table of Contents

1. [Overview](#overview)
2. [V1 Product Scope](#v1-product-scope)
3. [V1 Success Criteria](#v1-success-criteria)
4. [Product Vision & User Experience](#product-vision--user-experience)
5. [Current Monorepo Context & Constraints](#current-monorepo-context--constraints)
6. [Architecture Overview](#architecture-overview)
7. [Core Data Model](#core-data-model)
8. [Signal Sources](#signal-sources)
9. [Display Modes](#display-modes)
10. [Mode-Specific Notes](#mode-specific-notes)
11. [Rendering Architecture](#rendering-architecture)
12. [Phosphor Visual Model](#phosphor-visual-model)
13. [Shader & Packaging Strategy](#shader--packaging-strategy)
14. [Public API Design](#public-api-design)
15. [Browser Host Integration](#browser-host-integration)
16. [Controls & Presets](#controls--presets)
17. [Canvas, Layout & HUD](#canvas-layout--hud)
18. [Package Structure](#package-structure)
19. [Implementation Phases](#implementation-phases)
20. [Risks & Open Questions](#risks--open-questions)
21. [Future Extensions](#future-extensions)

---

## Overview

This project is a **browser-based oscilloscope for artistic exploration**, not a measurement instrument. The goal is to turn audio into geometry with a visual language inspired by vintage CRT oscilloscopes: bright phosphor traces, bloom, persistence, and rich motion.

It should feel like a playable visual instrument:

- Set exact frequency ratios and watch stable Lissajous figures form
- Slightly detune signals and watch those figures rotate and breathe
- Layer related traces into harmonic orbit clouds
- Feed in live mic or line input and explore stereo geometry
- Eventually visualize track playback once the host app exposes a proper tap path

The oscilloscope should live in the runtime layer as a **headless rendering and signal-consumption system**. Browser-only concerns such as permissions, host graph wiring, and React integration should stay outside the core package.

---

## V1 Product Scope

The first shippable version should be intentionally narrow. The fastest path to something compelling is a stable renderer with a great XY mode, not a full mode matrix or a perfect CRT simulation.

### In scope for V1

- WebGPU renderer with support detection
- Internal dual-oscillator source
- Mic input source via host-managed `AnalyserNode`
- XY / Lissajous mode as the primary mode
- Basic phosphor palette and trail persistence
- Minimal bloom or glow pass
- Essential controls for exploration
- Built-in presets
- First demo/wrapper in `apps/web`

### Explicitly deferred from V1

- Track playback visualization from the current audio player stack
- AudioWorklet + `SharedArrayBuffer` PCM transport for the oscilloscope
- Full physically motivated phosphor simulation
- Advanced CRT post-processing stack
- Full URL-state sharing and deep preset exchange
- Chladni / cymatics simulations

### Near-term follow-up after V1

These items are intentionally excluded from the first shippable milestone even though they are likely next in sequence.

- Y-T mode with trigger support
- Harmonic Orbits
- Tunnel / Polar modes
- Spectrum mode
- Host graph work required for track visualization

---

## V1 Success Criteria

A V1 release should be considered successful if it meets the following bar:

- XY mode runs smoothly in supported WebGPU browsers
- internal oscillators produce stable, controllable figures
- mic input works through a host-managed analyser path
- the first demo in `apps/web` exposes essential controls and presets
- unsupported browsers show a clear, deliberate fallback message

---

## Product Vision & User Experience

This oscilloscope is an **expressive canvas for sound and geometry**.

It should invite the user to experiment, not calibrate:

- **Discover structure**: hear a fifth, see a 3:2 figure stabilize
- **See drift**: add slight detune and watch a fixed pattern become living motion
- **Explore stereo**: route left and right channels into XY space and see width, correlation, and motion become shape
- **Feel the medium**: traces should glow, fade, and bloom like phosphor, not like a flat digital graph

The aesthetic target is not perfect historical reproduction. The goal is **perceptual plausibility** and strong visual character: enough CRT influence to feel warm, alive, and luminous, without letting simulation ambitions block shipping.

---

## Current Monorepo Context & Constraints

The design is constrained by the repo that exists today.

### Relevant architectural facts

- `@kkb/audio` is a **headless browser audio runtime**.
- `apps/web` owns **browser orchestration**, route composition, and runtime creation.
- `@kkb/ui` is intentionally kept separate from `@kkb/audio`; it should not be assumed to become the first oscilloscope adapter layer.
- The current audio player stack in `apps/web` primarily uses **media-element-backed playback paths**.
- The current worklet utilities in `@kkb/audio` are **minimal primitives**, not a ready-made PCM-sharing transport for visualization.
- `apps/web` is **not currently configured for COOP/COEP isolation**, so `SharedArrayBuffer`-based transport is not available by default.

### What this means for oscilloscope design

1. The oscilloscope core can live in `@kkb/audio`.
2. The first React wrapper/demo should live in `apps/web`.
3. Mic input is realistic for V1 because it can be host-managed with `AnalyserNode`.
4. Track playback visualization is **not** a cheap extension of the current engine. It requires new host-level graph work.
5. The oscilloscope should consume a generic `SignalProvider`, not engine internals.

---

## Architecture Overview

The system should be split into three layers:

### 1. Oscilloscope core (`@kkb/audio`)

Owns:
- rendering state
- display mode logic
- GPU resources
- phosphor/trail behavior
- signal consumption through a generic interface

Does **not** own:
- browser permissions
- `AudioContext` creation policy
- track playback authority
- React lifecycle

### 2. Browser host (`apps/web`)

Owns:
- canvas mounting
- WebGPU support messaging
- mic permission flow
- any Web Audio graph construction needed for sources
- future graph taps for track playback
- creation of `SignalProvider` instances

### 3. Presentation wrapper (`apps/web` first)

Owns:
- controls
- layout
- presets UI
- config editing
- lifecycle wiring between host resources and oscilloscope core

### Recommended architectural rule

**The oscilloscope should accept a `SignalProvider`; it should not be responsible for constructing one from browser APIs.**

That keeps the runtime package focused and makes host integration explicit.

---

## Core Data Model

The core abstraction should avoid a too-narrow “single point generator” mental model. Some modes are naturally parametric curves; others are frame-window or spectral modes. The abstraction should be **frame-oriented**.

### SignalProvider

A signal provider presents time-domain and frequency-domain data in a consistent shape.

```typescript
type SignalProvider = {
  /** Time-domain samples for channel 0 or 1 */
  getSamples(channel: 0 | 1): Float32Array;
  /** Frequency-domain data for channel 0 or 1 */
  getFrequencyData(channel: 0 | 1): Float32Array;
  /** FFT output width */
  frequencyBinCount: number;
  /** FFT input size */
  fftSize: number;
  /** Audio sample rate in Hz */
  sampleRate: number;
  /** Smoothing factor used for FFT-style providers */
  smoothing: number;
  /** Channel availability */
  channelCount: 1 | 2;
};
```

### Why this interface matters

- Internal oscillators can implement it directly
- Mic input can wrap `AnalyserNode`
- Future track taps can expose the same shape
- The renderer can adapt to provider characteristics instead of assuming every source behaves identically

### DisplayMode

A display mode produces a frame of geometry from the current signal and configuration.

```typescript
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

### FrameGeometry

Different modes may emit different geometry classes.

```typescript
type FrameGeometry =
  | { kind: "points"; points: Float32Array }
  | { kind: "line-strip"; points: Float32Array }
  | { kind: "bins"; values: Float32Array };
```

Notes:
- XY-like modes can emit points or a line strip
- Y-T emits a line strip derived from a triggered window of samples
- Spectrum emits bins rather than trace points
- Future multi-layer modes may emit multiple geometry batches internally, but the frame-oriented model still fits better than a single-point generator

### Coordinate convention

All spatial modes should output normalized coordinates in `[-1, 1]`.
The renderer maps those to clip space. Spectral modes may instead emit normalized magnitudes to be interpreted by a dedicated shader or raster path.

---

## Signal Sources

These sources should all adapt to the same `SignalProvider` contract, but they do not have equal implementation cost.

### 1. Internal Oscillators

This is the best V1 source because it keeps the oscilloscope self-contained.

Recommended capabilities:
- two oscillators, A and B
- frequency as Hz and/or note
- phase offset
- amplitude
- waveform type: sine, square, saw, triangle
- ratio lock to musical intervals
- detune in cents

This source enables the strongest first experience:
- 1:1 + 90° phase = circle
- 2:1 = figure eight
- 3:2 = reference-style Lissajous form
- slight detune = slow pattern rotation

### 2. Mic / Line Input

Mic input is realistic for V1 with clear host boundaries.

Host responsibilities:
- request permission with `navigator.mediaDevices.getUserMedia()`
- create `AudioContext` if needed
- create analyser nodes and any splitters/gain stages
- pass an analyser-backed `SignalProvider` to the oscilloscope

Practical notes:
- stereo line input maps well to XY mode
- mono mic input collapses toward a diagonal in XY mode unless transformed
- gain normalization is useful
- device selection is a host concern, not an oscilloscope-core concern

### 3. Track Playback (Deferred)

Track visualization should be treated as **deferred host-integration work**, not as a near-zero-cost V1 addition.

Why:
- the current audio player in `apps/web` is primarily media-element-backed
- the current engine is a playback/source lifecycle abstraction, not a reusable Web Audio graph owner
- there is not yet a stable host-owned analyser tap point for the active playback path

### Future target shape for track visualization

A likely future host path looks like this:

```text
HTMLMediaElement
  -> MediaElementAudioSourceNode
  -> ChannelSplitterNode / GainNode / AnalyserNode(s)
  -> destination
```

The oscilloscope would then consume analyser-backed data through `SignalProvider`.

**Recommendation**: do not make track playback a V1 dependency. Get the renderer and self-contained signal paths working first.

---

## Display Modes

Not all modes are equally ready. The display modes below are grouped by implementation maturity.

### V1 Primary Mode: XY / Lissajous

Two signals drive X and Y simultaneously.

```text
x(t) = A * sin(fx * t + φx)
y(t) = B * sin(fy * t + φy)
```

Why it is the right first mode:
- it is visually distinctive immediately
- it pairs perfectly with internal oscillators
- it maps naturally to stereo input later
- it strongly supports the “audio as geometry” concept

Key controls:
- oscillator frequencies
- phase
- amplitude
- waveform
- ratio lock
- detune
- trail length

### Phase 2 Mode: Y-T (Time Domain)

The classic oscilloscope waveform view. X is time, Y is amplitude.

Important note: this is **not** just a parametric point generator. It is a frame-window mode:
- choose a recent sample window
- detect a stable trigger point
- map the visible slice across the horizontal span

This mode is highly valuable, but it depends on a stable frame-selection model and trigger logic, so it should follow the base XY renderer.

### Later Mode: Harmonic Orbits

Overlay multiple related XY traces with long persistence.

Recommended V1-compatible strategy for this later mode:
- run several XY-style layers with harmonic offsets in frequency/phase/amplitude
- accumulate long trails
- emphasize bloom and center intensity

Treat 3D projection variants as later experimentation, not the first implementation path.

### Later Mode: Tunnel

A spiral or vortex projection whose radius and depth evolve over time.

Good later candidate because:
- visually striking
- shares many rendering needs with XY
- can be strongly audio-reactive

### Later Mode: Polar

Map time, phase, or periodic structure into angular position and amplitude or magnitude into radius.

This is promising for symmetry-rich signals and visually dense mandala-like forms.

### Later Mode: Spectrum

FFT-derived display of frequency magnitude.

This should share the same canvas and overall phosphor aesthetic, but it should **not** be forced into the same point-history assumptions as XY-style modes.

---

## Mode-Specific Notes

### Triggering for Y-T

Triggering stabilizes the waveform by selecting a repeatable phase-aligned starting point.

Recommended progression:
1. zero-crossing detection
2. Schmitt trigger with hysteresis
3. correlation-based alignment later if needed

### Harmonic Orbits Strategy

Recommended first implementation:
- multi-layer XY
- parameter spread across layers
- long visual persistence
- no fake 3D projection required initially

### Spectrum Notes

FFT output consistency matters.
Providers should either standardize or expose:
- `fftSize`
- `smoothing`
- channel behavior
- linear vs logarithmic bin rendering choice

### Mono input behavior

For XY mode, mono input produces limited geometry by default. If mono mic support feels underwhelming, future options include:
- mono-to-generated hybrid mode
- small decorrelation/widening transform
- explicit UX note that stereo sources are more interesting for XY

---

## Rendering Architecture

The renderer is best understood as **what ships first** versus **what it may evolve into**.

### V1 Rendering Pipeline

Recommended V1 pipeline:

1. CPU reads current signal data from the provider
2. Active display mode generates a frame of geometry
3. Geometry uploads to GPU buffers
4. A render pass draws traces into a render target or directly to screen
5. Optional lightweight glow or bloom pass softens the image
6. Composite to the visible canvas

Why this is the right start:
- fewer moving parts
- easier to debug
- enough to produce a strong visual result
- keeps the renderer architecture open for later compute-heavy upgrades

### V2 Target Pipeline

Once the base renderer is solid, evolve toward a richer phosphor model:

1. compute-driven accumulation/history
2. rasterization to HDR texture
3. multi-scale bloom passes
4. tone mapping and CRT-style post effects
5. velocity-aware brightness and richer decay curves

This is the long-term target, not the initial dependency chain.

### Signal History vs Visual Persistence History

These should be treated as separate concepts.

#### Signal history
Used for:
- frame generation
- trigger detection
- FFT input
- mode calculations

#### Visual persistence history
Used for:
- trails
- phosphor fade
- temporal accumulation
- bloom-friendly density

They do **not** need to share the same buffer model.

#### Downsampling / geometry reduction

If performance requires it later, prefer geometry-aware reduction over blindly discarding raw samples.

Examples:
- fewer points when a trace segment is visually linear
- reduced trail history at lower quality settings
- half-resolution bloom in performance mode

#### WebGPU availability

As of early 2026, WebGPU support is strong enough to justify a WebGPU-first design.

Policy:
- detect support at init
- present a clear unsupported-state UI in the host
- do not maintain a second full Canvas2D renderer unless product requirements change dramatically

---

## Phosphor Visual Model

The goal is **perceptual plausibility**, not exact CRT physics.

### Beam intensity and motion

A useful visual heuristic is that slower-moving regions of the trace appear brighter than fast crossings.

This matters because it gives:
- brighter lobes in stable Lissajous forms
- more convincing orbital clusters
- less flat-looking traces overall

### Persistence / afterglow

The image should not disappear instantly. A trace should:
- appear quickly
- decay noticeably
- leave a lingering low-level glow

A simple exponential or two-stage decay is enough for early versions.

### Bloom / glow

Bright traces should bleed light into nearby pixels.

This gives:
- warmth
- density
- the “hot center” effect in clustered patterns

### Intensity-dependent color shift

Later versions can move from:
- dim green
- bright green
- yellow-green
- near-white highlights

This is a later fidelity enhancement, not required for V1.

---

## Shader & Packaging Strategy

### WGSL strategy

Inline WGSL as TypeScript string literals inside `@kkb/audio`.

Benefits:
- matches the package's source-first style
- no extra bundler transform required
- easy direct imports in Bun/Next/Turbo flows
- simple to version with the runtime code

Example shape:

```typescript
export const traceVertex = /* wgsl */ `
  @vertex fn vs(@builtin(vertex_index) index: u32) -> @builtin(position) vec4f {
    // ...
  }
`;
```

### Caveat

This approach is appropriate while the shader suite remains modest. If shader count or size grows substantially, external organization can be revisited later without changing the public architecture.

---

## Public API Design

The public API should reflect the architectural split: the oscilloscope owns rendering, the host owns browser audio setup.

### Headless runtime API

```typescript
import { createOscilloscope } from "@kkb/audio/oscilloscope";

const scope = createOscilloscope(canvasElement, {
  mode: "xy",
  phosphor: {
    color: "p31-green",
    trailLength: 60,
    bloom: 0.8,
  },
  canvas: {
    aspectRatio: "1:1",
    quality: "quality",
  },
  source: {
    type: "oscillators",
    a: { frequency: 300, waveform: "sine", phase: 0, amplitude: 1 },
    b: { frequency: 200, waveform: "sine", phase: 0, amplitude: 1 },
  },
});

scope.start();
scope.setMode("xy");
scope.updateConfig({ phosphor: { bloom: 1.1 } });
scope.setSignalProvider(provider);
const state = scope.getState();
scope.destroy();
```

### API principles

- `start()` starts the render loop, not browser audio capture
- `setSignalProvider()` attaches an externally created provider
- internal oscillators are the only source type the oscilloscope core should create for itself
- mic setup and future track taps remain host responsibilities

### Host responsibilities

The host should own:
- mic permission and device selection
- `AudioContext` creation policy
- analyser creation
- track player graph wiring
- unsupported-state UI

---

## Browser Host Integration

The first production-facing wrapper should live in `apps/web`.

Why:
- browser-only APIs already live there
- permission flows belong there
- the current audio player integration already lives there
- it avoids creating a new `@kkb/ui` → `@kkb/audio` coupling by default

### Responsibilities for the first wrapper

- manage a `canvas` ref
- instantiate and destroy the oscilloscope runtime
- create/manage the chosen `SignalProvider`
- surface controls and presets
- show unsupported or permission-required states cleanly

### Mic integration path

Likely host path:
- request media stream
- create audio context if needed
- create analyser node(s)
- wrap them in `AnalyserSignalProvider`
- pass provider to oscilloscope

### Future track integration path

Track visualization requires a deliberate host graph owner above or beside the current player wiring. It should not be bolted onto the current runtime by exposing internal engine nodes.

Recommended future architecture:
- host owns the Web Audio graph for analyzable playback
- host passes analyser-backed provider into the oscilloscope
- `@kkb/audio` remains focused on playback runtime and source selection, not visualization taps

---

## Controls & Presets

Controls should be phased so the initial surface stays focused.

### V1 controls

#### Signal controls
- source: oscillators / mic
- oscillator A frequency
- oscillator B frequency
- waveform per oscillator
- phase per oscillator
- amplitude per oscillator
- ratio lock
- detune

#### Display controls
- mode: XY
- trail length
- point density or quality setting
- aspect ratio
- phosphor color preset
- bloom intensity
- background brightness
- grid toggle

### Later controls

- Y-T timebase and trigger controls
- Harmonic Orbit count/spread
- Tunnel rotation/decay/perspective
- Spectrum scale controls
- advanced CRT effect tuning
- URL-state sharing

### Presets

Built-in presets are worth supporting early because they strengthen the exploratory experience.

Good initial presets:
- Circle
- Figure Eight
- Lissajous 3:2
- Breathing Detune
- Stereo XY

URL-encodable preset sharing can follow later.

---

## Canvas, Layout & HUD

### Aspect ratio strategy

V1 should optimize first for **square presentation**, because XY mode is the strongest early mode.

Recommended aspect ratios:
- `1:1` default
- `4:3` optional classic CRT feel
- `16:9` later, especially once Y-T and Spectrum are stronger
- `fill` for responsive host layouts

### Resolution and quality

- render at device pixel ratio where practical
- offer a quality mode toggle
- allow half-resolution bloom in performance mode

### HUD

A minimal phosphor-style overlay can add atmosphere without clutter.

Possible fields:
- active mode
- source type
- current ratio or key frequencies
- elapsed time

This should stay subtle and low-opacity.

### Unsupported states

If WebGPU is unavailable, the host should present a deliberate unsupported state rather than silently degrading.

---

## Package Structure

The oscilloscope core should live under `packages/audio/src/oscilloscope/`.

```text
oscilloscope/
├── index.ts                 # Public entrypoint
├── types.ts                 # Config, shared types
├── signal/
│   ├── signal-provider.ts   # SignalProvider contract
│   ├── oscillator-source.ts # Internal dual-oscillator provider
│   └── analyser-source.ts   # Wraps AnalyserNode-based sources
├── modes/
│   ├── mode.ts              # DisplayMode + FrameGeometry types
│   ├── xy.ts                # XY / Lissajous mode
│   ├── yt.ts                # Y-T mode (later)
│   ├── orbits.ts            # Harmonic Orbits (later)
│   ├── tunnel.ts            # Tunnel (later)
│   ├── polar.ts             # Polar (later)
│   └── spectrum.ts          # Spectrum (later)
├── renderer/
│   ├── pipeline.ts          # WebGPU orchestration
│   ├── buffers.ts           # Geometry + persistence buffers
│   ├── shaders/
│   │   ├── trace.ts         # Core trace shaders
│   │   ├── bloom.ts         # Glow/bloom shaders
│   │   └── composite.ts     # Final composite shaders
│   └── types.ts             # GPU-side layouts and config
├── trigger.ts               # Y-T trigger helpers
└── presets.ts               # Built-in presets
```

### Export strategy

Add a dedicated entry without removing existing package exports:

```json
{
  "exports": {
    "./contracts/*": "./src/contracts/*.ts",
    "./engine/*": "./src/engine/*.ts",
    "./sources/*": "./src/sources/*.ts",
    "./worklet/*": "./src/worklet/*.ts",
    "./metrics/*": "./src/metrics/*.ts",
    "./oscilloscope": "./src/oscilloscope/index.ts",
    "./oscilloscope/*": "./src/oscilloscope/*.ts"
  }
}
```

Consumers should prefer importing from `@kkb/audio/oscilloscope` unless a lower-level internal module is intentionally needed.

### Important package boundary notes

The following do **not** belong in `@kkb/audio` v1:
- React wrapper components
- mic permission UI
- host-specific device selection UI
- track player graph orchestration in `apps/web`

---

## Implementation Phases

### Phase 1: Smallest Viable Renderer

- WebGPU init and support detection
- internal dual-oscillator provider
- XY mode only
- CPU-generated frame geometry uploaded each frame
- simple trail fade
- basic phosphor palette
- lightweight bloom if cheap enough
- first demo in `apps/web`

### Phase 2: Core Expansion

- mic input via analyser-backed provider
- Y-T mode
- zero-crossing trigger
- grid + minimal HUD
- preset save/load (local/basic)
- additional phosphor presets

### Phase 3: More Modes + Host Integration Work

- Harmonic Orbits
- Tunnel
- Polar
- Spectrum
- host-side graph work needed for track visualization
- Schmitt trigger for better Y-T stability

### Phase 4: Fidelity Upgrades

- richer trail behavior
- velocity-sensitive brightness
- improved decay curves
- better bloom stack
- CRT-style post effects
- quality presets

### Phase 5: Precision Audio Path

- AudioWorklet-based sample feed
- `SharedArrayBuffer` transport
- atomics-based ring buffer protocol
- COOP/COEP configuration in host app
- non-isolated fallback path

#### Important note on Phase 5

This worklet path is a fidelity and latency upgrade, not a prerequisite for shipping a compelling product.

It is also **distinct from the current playback-oriented `WorkletPCMSource` abstraction** already present in `@kkb/audio`; the oscilloscope would need its own PCM-sharing transport contract.

---

## Risks & Open Questions

### 1. V1 scope creep

The biggest risk is trying to ship too many modes and too much phosphor fidelity at once.

### 2. Track visualization dependency chain

Track playback visualization depends on host graph work that does not exist yet. This should not block the renderer project.

### 3. Spectrum path divergence

Spectrum may need a somewhat different rendering path than trail-based geometry. That is acceptable, but should be acknowledged early.

### 4. Y-T timing and trigger complexity

Y-T looks conceptually simple but introduces frame-window, trigger, and stabilization concerns that XY does not.

### 5. WebGPU support variance

The product should have a strong unsupported-state story in browsers that lack WebGPU.

### 6. Mono mic UX quality

XY mode is strongest with stereo signals. Mono mic input may need special UX treatment to feel satisfying.

---

## Future Extensions

Not in scope for the oscilloscope itself, but related future directions include:

- **Chladni plate simulation**
- **3D cymatic surfaces**
- **harmonic series explorer**
- **waveform morphing tools**

The signal-provider and host-integration abstractions may carry forward into those efforts, but the renderer assumptions may diverge substantially once the work moves from trace-oriented visualization to field or surface simulation.
