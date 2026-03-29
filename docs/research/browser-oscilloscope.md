# Browser Oscilloscope & Cymatics Explorer

> Research and design document for an advanced WebGPU-powered oscilloscope
> running in the browser, built as part of the `@kkb/audio` package.

> **Inspiration**: [anthrupad oscilloscope video](https://x.com/anthrupad/status/2036024416686195187)
> — XY mode Lissajous figures, Harmonic Orbits, and Tunnel visual modes
> with classic green phosphor CRT aesthetic.

---

## Vision

A browser-based oscilloscope that serves as an **artistic exploration tool** for
sound, geometry, and cymatics. Not a measurement instrument — an expressive
canvas where audio signals become visual geometry.

Core experiences:
- Watch Lissajous figures form and evolve as frequency ratios shift
- Explore dense orbital clusters of overlapping harmonic traces
- Fall into spiral tunnel vortices driven by audio
- Feed live mic input or loaded tracks and see the stereo field as geometry
- Dial in parameters, save presets, experiment freely

Future direction: extend into Chladni plate simulations and other cymatics
visualizations (separate effort, not in scope here).

---

## Table of Contents

1. [Display Modes](#display-modes)
2. [Rendering Architecture](#rendering-architecture)
3. [Signal Pipeline](#signal-pipeline)
4. [Audio Engine Integration](#audio-engine-integration)
5. [Controls & Interaction](#controls--interaction)
6. [Canvas & Layout](#canvas--layout)
7. [Package Structure](#package-structure)
8. [Implementation Phases](#implementation-phases)

---

## Display Modes

Six display modes, all sharing the same GPU rendering pipeline. Each mode is a
**point generator** — a function mapping time and audio signals to `(x, y)`
screen coordinates. The renderer is mode-agnostic.

### Mode Architecture

```typescript
type PointGenerator = (
  t: number,              // elapsed time in seconds
  signals: SignalProvider, // audio sample data
  params: ModeParams,     // mode-specific parameters
) => { x: number; y: number }; // normalized -1..1

type DisplayMode = {
  id: string;
  name: string;
  generator: PointGenerator;
  params: ModeParamSchema;
};
```

### Y-T (Time Domain)

The classic oscilloscope view. X = time, Y = amplitude.

- Shows waveform shape directly (sine, square, sawtooth, etc.)
- Requires triggering to stabilize display (zero-crossing or Schmitt trigger)
- Best in wide aspect ratios (16:9, 21:9)

### XY (Lissajous)

Two signals drive X and Y axes simultaneously.

```
x(t) = A * sin(f_a * t + φ_a)
y(t) = B * sin(f_b * t + φ_b)
```

- Frequency ratios produce distinct figures: 1:1 → ellipse/circle, 2:1 → figure-8,
  3:2 → the classic pattern from the reference video
- Phase difference rotates/deforms the figure
- With live audio: X = left channel, Y = right channel
- Frequency ratio lock snaps to musical intervals (unison, octave, fifth, fourth,
  major third, etc.)
- Slight detune creates slow phase drift → figure rotates and breathes

### Harmonic Orbits

Multiple simultaneous Lissajous figures overlaid with long persistence, creating
dense orbital clusters.

Two possible implementations:

**Approach A: Multi-layer XY**
Run N oscillator pairs simultaneously, each with harmonically related but
slightly offset parameters (frequency, phase, amplitude). With long trail
persistence (200+ frames), the overlapping traces create the orbital cloud.

```
For each orbit k (k = 0..N-1):
  x_k(t) = A_k * sin(f_x_k * t + φ_x_k)
  y_k(t) = A_k * sin(f_y_k * t + φ_y_k)
```

**Approach B: 3D Lissajous projection**
Generate a 3D Lissajous curve and project it to 2D. The third dimension creates
the depth/orbit effect:

```
x(t) = sin(a * t)
y(t) = sin(b * t + φ) * cos(c * t)
z(t) = cos(b * t + φ) * sin(c * t)

// Project to screen:
x_screen = x / (1 + z * perspective)
y_screen = y / (1 + z * perspective)
```

Visual characteristics:
- Very long trail persistence (200+ frames of history)
- Strong bloom — center blown out white-green, outer traces dim
- Possible slow rotation of the overall cluster

Audio-reactive variant: multiple frequency-band-filtered versions of the stereo
XY signal, overlaid — bass in one orbit, mids in another, highs in another.

### Tunnel

A decaying spiral with perspective projection, creating the illusion of looking
into a vortex.

```
θ(t) = ω * t                       // angle increases with time
r(t) = r_max * e^(-decay * t)      // radius shrinks exponentially

// 3D position on a tilted disk:
x3d = r(t) * cos(θ(t))
y3d = r(t) * sin(θ(t))
z3d = depth * (1 - r(t) / r_max)   // deeper as radius shrinks

// Perspective projection:
x_screen = x3d / (1 + z3d * perspective)
y_screen = y3d / (1 + z3d * perspective)
```

Visual characteristics:
- Logarithmic spiral — each revolution tighter than the last
- Perspective tilt — spiral viewed at angle, creating elliptical outer ring
- Brightness shift — inner core brighter (beam slows as spiral tightens),
  outer ring dimmer (beam moves faster)
- Convergence point offset from center, selling the 3D illusion
- Color shifts from green → yellow → white at the hottest center point

Audio-reactive variant: amplitude modulates spiral decay rate. Louder = wider
spiral, quieter = tighter collapse. Frequency content could modulate rotation
speed or tilt angle.

Controllable parameters: rotation speed, decay rate, perspective strength,
tilt angle.

### Polar

Map audio properties to polar coordinates.

```
angle = phase or time
radius = amplitude or frequency magnitude
```

Produces circular and mandala-like patterns. Natural for visualizing periodic
signals. Can reveal symmetry in audio that XY mode doesn't show.

### Spectrum

FFT-based frequency domain view.

```
x = frequency bin (linear or logarithmic scale)
y = magnitude (dB)
```

Reveals harmonic content and overtone structure. Logarithmic frequency scale
better matches musical perception. Optional peak hold for identifying
fundamental frequencies.

---

## Rendering Architecture

### Why WebGPU

- Handles millions of points per frame (vs ~10K ceiling on Canvas2D)
- Custom shaders for physically-based phosphor simulation
- Compute shaders for bloom and post-processing
- Future-proof — the successor to WebGL
- Starting with WebGPU means the V1 "simple trail" architecture evolves cleanly
  into the physically-accurate phosphor model without rewriting

### The Phosphor Model

Real CRT oscilloscope visual characteristics to simulate:

**Beam intensity = inverse of velocity.** Where the signal changes slowly
(peaks/troughs), the beam lingers and phosphor glows brighter. Where it sweeps
fast (zero crossings), fewer photons → dimmer. This is visible in the reference
video — outer lobes of Lissajous figures are brighter than center crossings.

**Phosphor persistence (afterglow).** P31 phosphor (classic green) has fast
initial decay (~40μs to 10% brightness) but a long low-level afterglow. Creates
the "trail" effect. Each point has an age; brightness follows a decay curve that
drops fast then lingers.

**Bloom/glow.** Bright points bleed light into surrounding pixels. This is the
halo that gives CRT scopes their warmth.

### GPU Pipeline

Four-pass rendering architecture:

**Pass 1: Point accumulation (compute shader)**
- Input: ring buffer of `(x, y, age, velocity)` tuples
- Each audio frame pushes new points, increments age on existing
- Points beyond max age get recycled
- Output: storage buffer of screen-space points with brightness values

**Pass 2: Point rasterization (render pass)**
- Draw points as small quads/sprites
- Fragment shader computes brightness from age + velocity
- Render to HDR texture (not directly to screen — bloom needs it)

**Pass 3: Bloom (compute shader)**
- Downsample the HDR texture
- Gaussian blur at multiple scales
- Composite back → phosphor glow effect

**Pass 4: Tone map + composite (render pass)**
- Map HDR to display range
- Apply phosphor color (green P31, amber P12, blue P11, or custom)
- Optional: CRT curvature distortion, scanlines, vignette

### GPU Buffer Layout

Primary data structure: a ring buffer of samples on the GPU.

```
struct Point {
  x: f32,        // normalized -1..1
  y: f32,        // normalized -1..1
  age: f32,      // 0 = just drawn, increases each frame
  velocity: f32  // sqrt(dx² + dy²) at this point
}
```

Ring buffer size determines trail length. 8K–64K points is a good range.
At 60fps with 800 samples/frame, 48K points gives 60 frames of trail.

### WGSL Shader Strategy

Inline WGSL as TypeScript string constants. Keeps the `@kkb/audio` zero-build-step
convention (raw `.ts` exports, no bundler transforms needed).

```typescript
// Example: shaders/phosphor.ts
export const phosphorVertex = /* wgsl */`
  @vertex fn vs(@builtin(vertex_index) i: u32) -> @builtin(position) vec4f {
    // ...
  }
`;

export const phosphorFragment = /* wgsl */`
  @fragment fn fs(@location(0) age: f32, @location(1) vel: f32) -> @location(0) vec4f {
    let brightness = (1.0 / (1.0 + vel * 4.0)) * exp(-age * decay);
    return vec4f(color * brightness, brightness);
  }
`;
```

- No build tooling changes — it's just TypeScript
- Works with Turbopack, Bun test runner, and direct TS imports
- `/* wgsl */` comment enables syntax highlighting via "WGSL Literal" VS Code extension
- Shaders are small (100–300 lines each) — string constants are fine

### V1 vs V2 Rendering

**V1 (simple trail):**
- Points fade based on age alone (linear or exponential decay)
- Single-pass bloom (one Gaussian blur)
- Flat phosphor color
- Functional and visually appealing

**V2 (physically-accurate phosphor):**
- Velocity-dependent beam intensity
- Multi-timescale decay matching real P31 phosphor curves
- Multi-pass bloom at different scales
- Intensity-dependent color shift (dim green → bright green → yellow → white)
- Optional CRT effects (barrel distortion, scanlines, vignette, noise)

---

## Signal Pipeline

Three signal sources feed a unified interface. The oscilloscope doesn't care
where the signal comes from.

### Unified Signal Interface

```typescript
type SignalProvider = {
  /** Get current time-domain samples for the given channel (0 = L/A, 1 = R/B) */
  getSamples(channel: 0 | 1): Float32Array;
  /** Get frequency-domain magnitude data (dB) for the given channel */
  getFrequencyData(channel: 0 | 1): Float32Array;
  /** Number of FFT bins (frequencyBinCount = fftSize / 2) */
  frequencyBinCount: number;
  /** Audio sample rate in Hz */
  sampleRate: number;
};
```

Time-domain modes (Y-T, XY, Orbits, Tunnel, Polar) use `getSamples()`.
Spectrum mode uses `getFrequencyData()`. Both are part of the core interface
so every source can drive every mode without reimplementing FFT internally.

**FFT parameters that affect Spectrum output:**
- **`fftSize`**: determines frequency resolution. Larger = more bins but higher
  latency. Default 2048 (= 1024 bins, ~23Hz resolution at 48kHz). Should be
  configurable per-provider and match across L/R analysers.
- **Windowing**: `AnalyserNode` applies a Blackman window by default. The
  oscillator source's software FFT should use the same window function for
  consistent output across providers.
- **Smoothing**: `AnalyserNode.smoothingTimeConstant` (default 0.8) applies
  exponential moving average across frames. The oscillator FFT provider should
  implement equivalent smoothing. A provider-level `smoothing` config (0–1)
  keeps this consistent.

Providers that disagree on these parameters will produce visually inconsistent
Spectrum output when switching sources — so the contract should either enforce
defaults or expose them as read-only properties for the renderer to adapt.

For the oscillator source (which has no native FFT), a lightweight FFT
implementation (e.g. radix-2 Cooley-Tukey) computes frequency data from the
generated samples on demand, with matching window and smoothing behavior.

### Source 1: Internal Oscillators

Built-in signal generators for pure exploration.

- Two independent oscillators (for XY mode) with:
  - Frequency (Hz or musical note)
  - Phase offset (0–360°)
  - Amplitude (0–1)
  - Waveform type (sine, square, sawtooth, triangle)
- **Frequency ratio lock** — snap to exact ratios (1:1, 2:1, 3:2, 4:3, 5:4, etc.)
  with musical interval labels (unison, octave, fifth, fourth, major third)
- **Detune knob** (cents) — slight detuning creates slow phase drift, causing
  figures to rotate and evolve over time

This is the purest cymatics exploration mode. Set a 3:2 ratio, watch the figure
form. Shift the phase, watch it morph. Detune slightly, watch it rotate.

### Source 2: Mic / Line Input

Live audio input via `navigator.mediaDevices.getUserMedia({ audio: true })`.

- `ChannelSplitterNode` for independent L/R access
- Mono mic → XY mode produces a diagonal line (not useful). Options:
  - "Mono + generated" mode: mic → Y axis, internal oscillator → X axis
  - Apply stereo widening/decorrelation to mono input
- Stereo line input (audio interface) → full XY capability
- Gain control for input level normalization

### Source 3: Loaded Tracks (via `@kkb/audio` engine)

Tap via consumer-side graph wiring above the engine (see
[Audio Engine Integration](#audio-engine-integration) for the gap analysis and
required refactor).

- Insert AnalyserNode(s) into the audio graph after the source, before destination
- For XY mode: split stereo into two AnalyserNodes via ChannelSplitterNode
- Stereo music in XY mode produces chaotic Lissajous clouds:
  - Bass-heavy tracks → dense center patterns
  - Wide-stereo mixes → broad, sweeping figures
  - Panned instruments → diagonal bias in the figure

### Triggering (Y-T mode)

Stabilizes the time-domain display by detecting a consistent point in the
waveform cycle. Without triggering, the waveform drifts across the screen.

Options (in order of complexity):
1. **Zero-crossing detection** — find where signal crosses zero going upward
2. **Schmitt trigger** — zero-crossing with hysteresis to avoid noise jitter
3. **Correlation-based** — compare current buffer to previous for best alignment
   (most stable, most expensive)

For XY/Lissajous/Orbits/Tunnel modes, triggering is less critical since figures
are inherently stable when frequency ratios are exact.

### Worklet Path (V2) — New Platform Work

For the physically-accurate phosphor model, an AudioWorklet feeding raw PCM
samples via SharedArrayBuffer would give lower latency and sample-level precision
for computing per-sample velocity.

**Current state of `@kkb/audio` worklet infra:**
- `sab-ring-buffer.ts` — minimal SharedArrayBuffer allocator (no atomics-based
  read/write cursors, no stereo framing, no real producer/consumer protocol)
- `register-worklet.ts` — thin wrapper around `audioWorklet.addModule()`
- The app is **not configured for COOP/COEP isolation**, which is required for
  `SharedArrayBuffer` in cross-origin contexts

**What Phase 3 actually requires (new work):**
- Atomics-based lock-free ring buffer with proper read/write cursors
- Stereo-interleaved or dual-channel framing protocol
- A worklet processor that writes PCM samples into the SAB each quantum
- Consumer-side reader that drains samples at render frame rate
- COOP/COEP headers configured on the hosting app (`Cross-Origin-Opener-Policy:
  same-origin`, `Cross-Origin-Embedder-Policy: require-corp`)
- Fallback path for when SAB is unavailable (non-isolated contexts)

V1 uses AnalyserNode (simpler, no isolation requirements). V2 builds the full
worklet pipeline as new platform work.

---

## Audio Engine Integration

The oscilloscope should stay **decoupled from the engine internals** — it
consumes audio signals through the `SignalProvider` interface, not through
engine-specific types. However, connecting the oscilloscope to track playback
requires new API surface that does not exist today.

### Current Engine Boundary (Gap)

The `AudioEngine` class manages source lifecycle (load/play/pause/seek) and
exposes a store-based state model, but it does **not** expose:
- The underlying `AudioContext`
- Source `AudioNode` references
- Any analyser or graph insertion point

The consumer-side code (React hooks or integration layer) that owns the
`AudioContext` and wires sources to the destination is where the tap must live.
But today that wiring is implicit — there is no explicit "graph owner" above
the engine that exposes nodes for tapping.

### Required: Graph Access API

To connect the oscilloscope to track playback, one of these approaches is needed:

**Option A: Engine exposes a tap hook**
Add an optional `getOutputNode(): AudioNode | null` method to `AudioSource` or a
`createAnalyserTap()` method on the engine that returns a `ChannelSplitterNode` +
`AnalyserNode` pair wired to the current source output. This is the smallest
change but couples the oscilloscope concern into the engine API.

**Option B: Graph owner layer**
Introduce an explicit graph orchestrator above the engine that owns the
`AudioContext`, connects engine sources to the destination, and provides
analyser insertion points. The oscilloscope connects to this layer, not the
engine directly. More work but cleaner separation.

**Option C: External wiring at the React/integration layer**
The integration code that creates the `AudioContext` and connects the engine's
source nodes to `ctx.destination` also creates AnalyserNodes and passes them
to the oscilloscope. The engine itself remains unchanged. This works today if
the integration layer already has node-level access, but the current consumer
code may need refactoring to expose those nodes.

**Recommended for V1: Option C.** Refactor the consumer-side integration to
expose the audio graph nodes, wire AnalyserNodes externally, and pass them to
the oscilloscope. Evaluate Options A/B for V2 if the integration becomes
unwieldy.

### Tap Point (Target Architecture)

```
AudioContext (owned by integration layer)
  └── source node → ChannelSplitter → AnalyserNode(L) ─┐
                                     → AnalyserNode(R) ─┤→ destination
                                                        │
                                     Oscilloscope reads ←┘
```

### Adapter Pattern

Each signal source implements `SignalProvider`. The oscilloscope only depends on
this interface:

```typescript
// Wraps Web Audio AnalyserNode for engine/mic sources
class AnalyserSignalProvider implements SignalProvider {
  private bufferL: Float32Array;
  private bufferR: Float32Array;
  private freqBufferL: Float32Array;
  private freqBufferR: Float32Array;

  constructor(
    private analyserL: AnalyserNode,
    private analyserR: AnalyserNode,
  ) {
    this.bufferL = new Float32Array(analyserL.fftSize);
    this.bufferR = new Float32Array(analyserR.fftSize);
    this.freqBufferL = new Float32Array(analyserL.frequencyBinCount);
    this.freqBufferR = new Float32Array(analyserR.frequencyBinCount);
  }

  getSamples(channel: 0 | 1): Float32Array {
    const analyser = channel === 0 ? this.analyserL : this.analyserR;
    const buffer = channel === 0 ? this.bufferL : this.bufferR;
    analyser.getFloatTimeDomainData(buffer);
    return buffer;
  }

  getFrequencyData(channel: 0 | 1): Float32Array {
    const analyser = channel === 0 ? this.analyserL : this.analyserR;
    const buffer = channel === 0 ? this.freqBufferL : this.freqBufferR;
    analyser.getFloatFrequencyData(buffer);
    return buffer;
  }

  get frequencyBinCount(): number {
    return this.analyserL.frequencyBinCount;
  }

  get sampleRate(): number {
    return this.analyserL.context.sampleRate;
  }
}

// Generates samples internally for oscillator source
class OscillatorSignalProvider implements SignalProvider {
  // ... generates sine/square/sawtooth/triangle samples
}
```

---

## Controls & Interaction

Designed as an artistic exploration tool — intuitive, expressive, preset-friendly.

### Signal Controls

| Control | Range | Notes |
|---------|-------|-------|
| Source selector | oscillators / mic / track | Switches SignalProvider |
| Oscillator A frequency | 20Hz–20kHz (or note) | Logarithmic scale |
| Oscillator B frequency | 20Hz–20kHz (or note) | Logarithmic scale |
| Phase offset | 0–360° | Per-oscillator |
| Amplitude | 0–1 | Per-oscillator |
| Waveform | sine / square / saw / triangle | Per-oscillator |
| Ratio lock | 1:1, 2:1, 3:2, 4:3, 5:4... | Musical interval names |
| Detune | ±100 cents | Slow drift when nonzero |
| Input gain | -∞ to +12dB | For mic/track sources |

### Display Controls

| Control | Range | Notes |
|---------|-------|-------|
| Mode | Y-T / XY / Orbits / Tunnel / Polar / Spectrum | Swaps point generator |
| Timebase | 0.1ms–100ms/div | Y-T mode only |
| Vertical gain | 0.1x–10x | Scales Y amplitude |
| Trigger level | -1..1 | Y-T mode, with slope selector |
| Trail length | 1–300 frames | How many frames of history |
| Point density | 256–4096 samples/frame | Points sent to GPU per frame |

### Mode-Specific Controls

**Harmonic Orbits:**
| Control | Range | Notes |
|---------|-------|-------|
| Orbit count | 1–16 | Number of simultaneous layers |
| Spread | 0–1 | How much parameters vary between orbits |
| Rotation speed | 0–10 | Overall cluster rotation rate |

**Tunnel:**
| Control | Range | Notes |
|---------|-------|-------|
| Rotation speed | 0.1–10 | Angular velocity |
| Decay rate | 0.01–1.0 | How quickly spiral tightens |
| Perspective | 0–2 | Depth exaggeration |
| Tilt angle | 0–90° | Viewing angle |

### Visual Controls

| Control | Range | Notes |
|---------|-------|-------|
| Phosphor color | P31 green / P12 amber / P11 blue / custom | Preset or RGB picker |
| Bloom intensity | 0–2 | Glow amount |
| Background brightness | 0–0.1 | Pure black to subtle dark gray |
| Grid | on/off | Major divisions overlay |
| Grid opacity | 0–0.5 | Subtle by default |
| CRT effects | off / subtle / full | Curvature, vignette, scanlines |

### Preset System

- **Save/load** parameter snapshots (all controls serialized to JSON)
- **Built-in presets**:
  - "Lissajous 3:2" — clean ratio, default phase
  - "Circle" — 1:1 ratio, 90° phase offset
  - "Figure Eight" — 2:1 ratio
  - "Orbit Cloud" — Harmonic Orbits with 8 layers, high spread
  - "Deep Tunnel" — Tunnel with slow decay, strong perspective
  - "Breathing" — 3:2 ratio with slight detune for slow rotation
  - "Stereo Field" — track source, XY mode, medium trail
- **URL-encodable state** — share a preset as a link

---

## Canvas & Layout

### Aspect Ratio Options

| Preset | Ratio | Best for |
|--------|-------|----------|
| **Square** (default) | 1:1 | XY, Polar, Orbits |
| **CRT** | 4:3 | Classic oscilloscope feel |
| **Wide** | 16:9 | Y-T, Spectrum, Tunnel |
| **Ultra** | 21:9 | Cinematic tunnel/spectrum |
| **Fill** | container | Responsive, fills parent element |

The canvas renders at the selected resolution. The UI container letterboxes or
pillarboxes as needed to maintain the chosen ratio.

### Resolution

- Render at device pixel ratio (e.g. 2x on Retina) for crisp points
- Bloom passes can run at half resolution for performance
- Expose a quality setting: "performance" (1x, half-res bloom) vs "quality"
  (2x, full-res bloom)

### HUD Overlay

Minimal heads-up display matching the reference video aesthetic:
- Top-left: mode name (e.g. `XY MODE | LISSAJOUS 3:2`)
- Top-right: elapsed time (`t=31.0s`)
- Bottom-left: source info, key parameters
- Monospace font, phosphor-matched color, low opacity

---

## Package Structure

Located within `packages/audio/src/oscilloscope/`:

```
oscilloscope/
├── types.ts                 # Core types: OscilloscopeConfig, DisplayMode,
│                            #   PhosphorSettings, SignalProvider, ModeParams, etc.
├── signal/
│   ├── signal-provider.ts   # SignalProvider interface
│   ├── oscillator-source.ts # Internal dual-oscillator generator
│   └── analyser-source.ts   # AnalyserNode wrapper (mic + track)
├── modes/
│   ├── mode.ts              # DisplayMode interface, PointGenerator type
│   ├── yt.ts                # Y-T time domain mode
│   ├── xy.ts                # XY / Lissajous mode
│   ├── orbits.ts            # Harmonic Orbits mode
│   ├── tunnel.ts            # Tunnel / vortex mode
│   ├── polar.ts             # Polar mode
│   └── spectrum.ts          # Spectrum (FFT) mode
├── trigger.ts               # Zero-crossing / Schmitt trigger logic
├── renderer/
│   ├── types.ts             # GPU buffer layouts, pipeline config
│   ├── shaders/
│   │   ├── point.ts         # Point accumulation compute shader (WGSL)
│   │   ├── phosphor.ts      # Phosphor brightness + decay shader (WGSL)
│   │   ├── bloom.ts         # Multi-pass bloom compute shader (WGSL)
│   │   └── composite.ts     # Tone mapping + CRT effects shader (WGSL)
│   ├── ring-buffer.ts       # GPU ring buffer management
│   └── pipeline.ts          # WebGPU pipeline orchestration
├── presets.ts               # Built-in parameter presets
└── index.ts                 # Public API: createOscilloscope(canvas, config)
```

### Exports

Add the oscilloscope entry to the **existing** exports map in
`packages/audio/package.json` (do not replace the other entries):

```json
{
  "exports": {
    "./contracts/*": "./src/contracts/*.ts",
    "./engine/*": "./src/engine/*.ts",
    "./sources/*": "./src/sources/*.ts",
    "./worklet/*": "./src/worklet/*.ts",
    "./metrics/*": "./src/metrics/*.ts",
    "./oscilloscope/*": "./src/oscilloscope/*.ts"
  }
}
```

### Public API

```typescript
import { createOscilloscope } from "@kkb/audio/oscilloscope/index";

const scope = createOscilloscope(canvasElement, {
  mode: "xy",
  phosphor: { color: "p31-green", trailLength: 60, bloom: 1.0 },
  canvas: { aspectRatio: "1:1" },
  source: {
    type: "oscillators",
    a: { frequency: 300, waveform: "sine", phase: 0, amplitude: 1 },
    b: { frequency: 200, waveform: "sine", phase: 0, amplitude: 1 },
  },
});

scope.start();                       // begin render loop + audio
scope.setMode("tunnel");             // switch display mode
scope.setFrequency("a", 440);        // update oscillator
scope.setSource({ type: "mic" });    // switch to mic input
scope.loadPreset("orbit-cloud");     // apply preset
scope.getState();                    // serialize current config
scope.destroy();                     // teardown GPU + audio resources
```

### React Integration

The React wrapper lives in `apps/web` or `packages/ui`, not in the audio package:

```tsx
<Oscilloscope
  mode="xy"
  source={{ type: "oscillators", a: { frequency: 300 }, b: { frequency: 200 } }}
  phosphor={{ color: "p31-green" }}
  aspectRatio="1:1"
  className="w-full max-w-[800px]"
/>
```

Manages canvas ref, config state, and lifecycle (start/destroy on mount/unmount).

---

## Implementation Phases

### Phase 1: Foundation

Core rendering + internal oscillators. Proof of concept.

- [ ] WebGPU device initialization and capability detection
- [ ] GPU ring buffer for point storage
- [ ] Basic point rasterization shader (age-based fade, flat color)
- [ ] Single-pass bloom
- [ ] Internal dual-oscillator signal source
- [ ] XY (Lissajous) mode point generator
- [ ] Y-T mode point generator with zero-crossing trigger
- [ ] `createOscilloscope()` public API
- [ ] Grid overlay and HUD
- [ ] Canvas aspect ratio options (1:1, 4:3, 16:9)
- [ ] Basic phosphor color selection (P31 green, P12 amber, P11 blue)

### Phase 2: All Modes + Audio Sources

Complete the mode set and connect real audio.

- [ ] Harmonic Orbits mode
- [ ] Tunnel mode
- [ ] Polar mode
- [ ] Spectrum mode (FFT integration)
- [ ] AnalyserNode-based signal provider (for mic and track sources)
- [ ] Refactor consumer-side audio integration to expose graph nodes (Option C
      prerequisite for track source — see Audio Engine Integration section)
- [ ] Mic input source with channel splitter
- [ ] Track source integration via AnalyserNode tap on audio graph
- [ ] Schmitt trigger (improved Y-T stability)
- [ ] Mode-specific parameter controls
- [ ] Preset system (save/load/built-in presets)
- [ ] URL-encodable state

### Phase 3: Physically-Accurate Phosphor

Upgrade rendering fidelity.

- [ ] Velocity-dependent beam intensity
- [ ] Multi-timescale phosphor decay curves (P31 fast + slow components)
- [ ] Intensity-dependent color shift (dim green → bright → yellow → white)
- [ ] Multi-pass bloom at different scales
- [ ] AudioWorklet + SAB signal path for sample-level precision
- [ ] CRT effects (barrel distortion, scanlines, vignette, noise)
- [ ] Quality presets (performance vs quality)

### Phase 4: React Component + Polish

Ship it as a usable component.

- [ ] `<Oscilloscope />` React component
- [ ] Touch/gesture controls for mobile
- [ ] Keyboard shortcuts for mode switching, parameter nudging
- [ ] WebGPU fallback detection (graceful error when unsupported)
- [ ] Performance profiling and optimization
- [ ] Documentation and usage examples

---

## Key Technical Notes

### Frame Rate Coupling

The renderer runs at monitor refresh rate via `requestAnimationFrame` (60–144fps).
Audio data accumulates between frames. At 48kHz sample rate and 60fps, ~800
samples arrive per frame — 800 points for XY mode, which is reasonable. With
a 60-frame trail at 800 points/frame = 48K total points, well within WebGPU's
comfort zone.

### Downsampling

Not needed for V1. If performance requires it later, strategies include:
- Skip every Nth sample (simple, loses high-frequency detail)
- Lanczos or sinc interpolation (preserves quality)
- Adaptive: fewer points when signal is linear, more at transitions

### WebGPU Availability

As of early 2026, WebGPU is supported in Chrome, Edge, and Safari. Firefox
support is still in progress. The oscilloscope should detect capability at init
and fail gracefully with a clear message when unsupported. A Canvas2D fallback
is not planned — the visual fidelity gap is too large and maintaining two
renderers doubles the work.

### Coordinate System

All modes output normalized coordinates in the range `[-1, 1]` for both axes.
The vertex shader maps these to clip space. The grid overlay is drawn in the
same coordinate system with divisions at regular intervals.

---

## Future: Cymatics Extensions

Not in scope for the oscilloscope, but the signal pipeline and rendering
infrastructure lay the groundwork for:

- **Chladni plate simulator** — model 2D vibrating membrane driven by audio,
  show nodal lines where "sand" accumulates. Solve the 2D wave equation on GPU
  via compute shaders. Visualize as height map or particle system.
- **3D cymatic surfaces** — height map driven by FFT data. WebGPU mesh rendering.
- **Harmonic series explorer** — visualize overtones and how they combine.
  Interactive additive synthesis with visual feedback.
- **Waveform morphing** — continuously blend between waveform shapes, see how
  the visual (Lissajous, spectrum, etc.) changes in real time.
