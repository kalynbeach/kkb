# Browser Oscilloscope V1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the first browser oscilloscope as a dedicated `apps/web` demo backed by a headless `@kkb/audio/oscilloscope` runtime, using WebGPU rendering, internal oscillators, mic input, and XY mode only.

**Architecture:** Keep the oscilloscope core in `packages/audio` and keep browser-only concerns in `apps/web`. The core owns signal contracts, XY frame generation, the render loop, and the WebGPU pipeline; the web app owns canvas mounting, WebGPU support messaging, mic permission flow, and the first control surface.

**Tech Stack:** Bun, Turborepo, TypeScript 6, React 19, Next.js 16, WebGPU, Web Audio API, `bun:test`, `happy-dom`, Biome.

## Status Update (2026-04-03)

This plan is partially implemented on `feature/oscilloscope-v1`.

### Completed implementation slices
- package-level oscilloscope types, presets, support detection, signal providers, XY mode, runtime, and tests
- first `apps/web` oscilloscope route, shell, controls, preset switching, support fallback, mic integration, and home-page link
- mono mic behavior duplicates into both axes
- hydration mismatch fix for the `/oscilloscope` route
- barrel export removal in favor of direct `@kkb/audio/oscilloscope/*` imports
- renderer-quality follow-up started: the direct-to-swapchain trace baseline has been replaced with a simpler single-history-texture renderer that fades accumulated phosphor, redraws the trace into HDR history, and composites a lightweight glow pass back to the screen
- renderer uniform plumbing has been aligned across `uniforms.ts`, `pipeline.ts`, and the active WGSL shaders so trace, fade, and composite passes now share one explicit uniform contract; the trace pass also binds its own uniform bind group correctly in-browser
- renderer uniform mapping now has focused unit coverage in `packages/audio/src/oscilloscope/renderer/__tests__/uniforms.test.ts`
- the next renderer-quality slice is underway on top of that baseline: composite glow has been narrowed to reduce milky detune washout, and the fade curve now keeps long trails visibly decaying instead of flattening dense motion into a fogged background
- `apps/web/components/oscilloscope/oscilloscope-client.tsx` now hardens startup failures in two additional ways: synchronous `createScope(...)` exceptions are converted into the same readable fallback state as async `scope.start()` failures, and the default oscilloscope runtime is loaded lazily instead of being imported eagerly at module evaluation time
- startup-failure UI is now less misleading: when renderer startup fails, the status banner mirrors the renderer failure reason instead of claiming the internal oscillators are active

### Current branch deviations from the original plan
- the `@kkb/audio/oscilloscope` barrel entrypoint and `packages/audio/src/oscilloscope/index.ts` were intentionally removed; consumers now use direct subpath imports
- the original ping-pong persistence/composite renderer path proved unstable in-browser; the current renderer direction is now a simpler single-history fade/composite pipeline rather than the original ping-pong design
- `agent-browser` verification is now working again when exercised against `http://localhost:3000/oscilloscope` after the dev-server restart; the route hydrates, mounts the `<canvas>`, and runs the WebGPU renderer in fresh sessions

### Verification status
- `bun run test -- --filter=@kkb/audio --filter=@kkb/web`: passing
- `bun run check-types -- --filter=@kkb/audio --filter=@kkb/web`: passing
- `bun run format-and-lint`: currently failing because Biome would reformat `packages/audio/src/oscilloscope/renderer/uniforms.ts`; there is also one existing non-blocking warning in `packages/ui/src/components/sidebar.tsx`
- `agent-browser` review on `http://localhost:3000/oscilloscope`: passing for oscillator-mode smoke coverage; the route hydrates, mounts the canvas, and the renderer produces frame-to-frame pixel diffs in screenshots
- `agent-browser` mic-mode review: browser media permission is denied in this headless environment, but the UI surfaces `Permission denied` and cleanly recovers when switching back to oscillators

## Next Slice Execution Plan (2026-04-03)

### Goal
Make mic input visually credible in the browser, continue tuning the phosphor renderer against live and deterministic input, and add a repeatable browser-verification loop using the `agent-browser` skill and the `agent-browser` CLI.

### Scope for this slice

#### In scope
- mic-input signal conditioning and XY presentation quality
- phosphor renderer tuning for both oscillator presets and mic input
- browser-based verification with `agent-browser`
- mic testing across all currently shipped visual states in the browser; for V1 today that means XY mode across all presets and relevant control extremes, and any additional visual modes introduced during this slice must also be covered
- a lightweight checked-in browser smoke script, checklist, or both
- formatter and doc cleanup directly related to this oscilloscope work

#### Out of scope
- new oscilloscope display families beyond current V1 scope unless explicitly added as part of the same renderer/mic verification effort
- track playback visualization
- Y-T / trigger logic
- CRT simulation
- `@kkb/ui` abstraction work for oscilloscope wrappers

### Why this is the right next slice
The architecture work is already in place. The biggest remaining quality gap is that mic input visuals still look poor, borderline broken, and the current renderer tuning has been validated more heavily against oscillator presets than against live mic behavior. The next slice should therefore optimize for mic readability first, then finish a repeatable `agent-browser` verification loop that exercises both oscillator and mic paths in-browser.

### Concrete execution plan

#### 1. Clean the baseline first

**Files:**
- `packages/audio/src/oscilloscope/renderer/uniforms.ts`
- `docs/plans/2026-04-02-browser-oscilloscope-v1.md`
- optionally `docs/reports/2026-04-02-browser-oscilloscope-branch-review.md`

**Tasks:**
- fix the current formatter failure in `packages/audio/src/oscilloscope/renderer/uniforms.ts`
- rerun:
  - `bun run format-and-lint`
  - `bun run test -- --filter=@kkb/audio --filter=@kkb/web`
  - `bun run check-types -- --filter=@kkb/audio --filter=@kkb/web`
- update docs so they reflect the current active single-history renderer rather than the older direct-to-swapchain checkpoint description

**Acceptance:**
- formatter passes
- docs no longer describe stale renderer architecture as current

#### 2. Fix mic input visuals before more glow polish

**Files:**
- `apps/web/lib/oscilloscope/create-mic-provider.ts`
- `packages/audio/src/oscilloscope/signal/analyser-source.ts`
- `packages/audio/src/oscilloscope/modes/xy.ts`
- `packages/audio/src/oscilloscope/runtime.ts`
- `packages/audio/src/oscilloscope/types.ts` only if a minimal new config or source flag is required

**Tasks:**
- inspect whether current mic samples are too quiet, too noisy, poorly centered, or visually collapsed in XY
- improve mic-specific signal conditioning with the smallest possible change set, such as:
  - centering / DC offset rejection if needed
  - light gain normalization or simple auto-gain for mic input if needed
  - revisiting analyser smoothing or related settings if they hurt responsiveness
- specifically re-evaluate the current mono-mic-to-both-axes duplication behavior; if that is the main reason the trace collapses into a weak diagonal or blob, replace it with a minimal XY-friendly derived second axis for mono mic input
- keep this fix targeted to the mic path rather than widening scope into a larger mode system

**Acceptance:**
- mic mode no longer looks broken for common speech/noise input
- mono mic input produces a visually meaningful XY trace
- oscillator visuals do not regress

#### 3. Tune the renderer against mic input, not just oscillator presets

**Files:**
- `packages/audio/src/oscilloscope/renderer/uniforms.ts`
- `packages/audio/src/oscilloscope/renderer/shaders/trace.ts`
- `packages/audio/src/oscilloscope/renderer/shaders/fade.ts`
- `packages/audio/src/oscilloscope/renderer/shaders/composite.ts`
- `packages/audio/src/oscilloscope/renderer/pipeline.ts`

**Tasks:**
- tune the renderer for these visual goals:
  - preserve a hot, bright core
  - keep the glow soft and narrow
  - avoid milky washout on dense motion
  - keep long trails visibly decaying
  - make mic input feel alive instead of fogged or dead
- validate tuning against all of the following cases:
  - stable oscillator preset
  - detuned / dense oscillator preset
  - live mic input
  - quiet mic input
  - louder or transient mic input

**Acceptance:**
- no white or foggy washout under dense presets
- no dead or overly dim trace under mic input
- trails remain visible without burying the current motion

#### 4. Add a browser-verification harness using `agent-browser`

Use the `agent-browser` skill and the `agent-browser` CLI for all browser-based testing and verification in this slice. Because the oscilloscope output is canvas-driven, screenshots are the source of truth; text snapshots alone are not sufficient.

**Recommended work:**
- add one lightweight, checked-in verification artifact:
  - a script in `scripts/`, and/or
  - a checklist/report in `docs/`
- prefer `agent-browser screenshot`, `agent-browser screenshot --annotate`, and `agent-browser diff screenshot` for visual verification

**Suggested files:**
- `scripts/oscilloscope-agent-browser-smoke.sh`
- `docs/reports/2026-04-03-oscilloscope-browser-smoke.md`
- `docs/reports/2026-04-03-oscilloscope-agent-browser-smoke-template.md` (checked-in template for future smoke runs)

**Acceptance:**
- a future worker can rerun the oscilloscope browser smoke flow without reconstructing the steps from memory

#### 5. Ensure mic is testable with `agent-browser` across all visual modes / states

Real hardware mic automation is often flaky or unavailable in headless environments, so this slice should add a deterministic browser-test path for the mic visualization flow.

**Recommended approach:**
- add a dev/test-only fake mic path that still exercises the same browser mic visualization path
- make it triggerable by a query param, dev-only toggle, or test-only override in the mic provider layer
- keep it out of user-facing product scope

**Why this matters:**
- without a deterministic fake mic feed, mic verification will remain difficult to compare from run to run
- this is especially important because mic visuals currently look borderline broken and need repeatable before/after browser review

**Acceptance:**
- `agent-browser` can drive and verify the mic path in a repeatable way
- mic behavior can be captured in screenshots and diffs without depending solely on real hardware permissions

### Browser verification matrix for this slice

Use `agent-browser` to cover all currently shipped visual states. For V1 today, that means the current XY renderer across all presets and relevant control extremes; if any new visual mode is introduced during this slice, it must be added to the same matrix before the slice is considered complete.

#### Oscillator states
- Circle preset
- Figure Eight preset
- Lissajous 3:2 preset
- Breathing Detune preset

#### Mic states
Test mic input across the same browser-visible states wherever applicable, plus:
- low bloom / short trail
- high bloom / long trail
- mono mic path
- stereo mic path if available
- permission-denied flow
- switch mic → oscillators recovery flow

### Suggested `agent-browser` workflow

Assuming local development on `http://localhost:3000/oscilloscope`:

```bash
agent-browser --session osc close || true
agent-browser --session osc --headed open http://localhost:3000/oscilloscope
agent-browser --session osc wait --load networkidle
agent-browser --session osc screenshot --annotate --screenshot-dir .artifacts/oscilloscope
agent-browser --session osc snapshot -i
```

For each preset / mic state:
1. select the preset or source
2. wait briefly for stabilization
3. take a screenshot
4. optionally diff against a baseline screenshot
5. record whether the trace is visible, centered, not washed out, and not collapsed into a broken-looking line or blob

Example pattern:

```bash
agent-browser --session osc screenshot state-01.png
agent-browser --session osc wait 1000
agent-browser --session osc screenshot state-02.png
agent-browser --session osc diff screenshot --baseline state-01.png
```

For mic verification:
- if a deterministic fake mic path exists, activate mic mode and run the same screenshot loop across all presets / states
- if real mic access is available in headed mode, keep one real-mic smoke pass, but do not rely on that as the only automated verification path

### Deliverables for this slice
- mic visuals improved
- renderer tuned against both oscillators and mic input
- a checked-in `agent-browser` verification workflow
- mic tested across all currently shipped visual modes / states and across any additional visual mode introduced during this slice
- docs updated to reflect the current renderer and verification flow
- all checks green:
  - `bun run format-and-lint`
  - `bun run test -- --filter=@kkb/audio --filter=@kkb/web`
  - `bun run check-types -- --filter=@kkb/audio --filter=@kkb/web`

### Definition of done
- mic mode no longer looks broken
- mono mic input produces a meaningful XY visualization
- oscillator presets still look good
- renderer retains hot core + visible decay without milky washout
- browser validation is reproducible with `agent-browser`
- mic path is tested across all shipped visual modes / states in browser automation
- docs reflect current behavior

## Next Slice Checkbox Plan (2026-04-03)

- [ ] Fix the formatter failure in `packages/audio/src/oscilloscope/renderer/uniforms.ts`
- [ ] Rerun `bun run format-and-lint`
- [ ] Rerun `bun run test -- --filter=@kkb/audio --filter=@kkb/web`
- [ ] Rerun `bun run check-types -- --filter=@kkb/audio --filter=@kkb/web`
- [ ] Update oscilloscope docs so they describe the current single-history fade/trace/composite renderer accurately
- [ ] Audit the current mic path in `apps/web/lib/oscilloscope/create-mic-provider.ts` and `packages/audio/src/oscilloscope/signal/analyser-source.ts` for level, noise, centering, and smoothing issues
- [ ] Decide whether mono mic duplication into both axes is the main cause of the poor visuals
- [ ] If mono duplication is the problem, implement a minimal XY-friendly derived second-axis strategy for mono mic input
- [ ] Add the smallest mic-specific conditioning needed to make speech/noise visually meaningful without regressing oscillator rendering
- [ ] Validate the mic-path changes against common speech/noise behavior in-browser
- [ ] Retune `renderer/uniforms.ts` and the active WGSL shaders against both oscillator presets and mic input
- [ ] Verify that dense oscillator presets no longer wash out into a milky fog
- [ ] Verify that mic input remains visible and lively rather than dead, dim, or smeared
- [ ] Add a lightweight checked-in `agent-browser` smoke artifact (`scripts/` script, `docs/` checklist/report, or both)
- [ ] Use the `agent-browser` skill and `agent-browser` CLI for browser verification instead of relying only on local visual inspection
- [ ] Add or expose a deterministic fake-mic / test-mic path suitable for browser automation if real mic permissions are not reliable in headless runs
- [ ] Run `agent-browser` verification for all oscillator presets
- [ ] Run `agent-browser` verification for mic mode across all currently shipped visual states in XY mode
- [ ] If any new visual mode is introduced during this slice, add it to the same `agent-browser` verification matrix before finishing
- [ ] Capture screenshots and screenshot diffs for before/after comparison during the tuning pass
- [ ] Verify the permission-denied mic flow in-browser
- [ ] Verify switching from mic back to oscillators recovers cleanly in-browser
- [ ] Update this plan with the latest verification results and any branch-level decisions

---

## Scope Lock

### In scope
- `@kkb/audio/oscilloscope/*` direct subpath exports (no barrel entrypoint)
- WebGPU support detection helper
- internal dual-oscillator source
- analyser-backed external provider wrapper
- XY / Lissajous mode only
- initial WebGPU phosphor renderer using a single accumulated history texture plus lightweight composite glow, with further visual tuning still treated as follow-up work
- `apps/web/app/oscilloscope/page.tsx`
- oscillator controls, preset picker, source switch, unsupported-state UI
- mic input via host-owned `AudioContext` + `AnalyserNode`

### Out of scope
- track playback visualization
- Y-T mode and trigger logic
- Harmonic Orbits / Tunnel / Polar / Spectrum
- `SharedArrayBuffer` / oscilloscope worklet transport
- `@kkb/ui` package expansion for oscilloscope wrappers
- deep link sharing / URL state
- physically exact CRT simulation

## File Map

### `packages/audio`
- `packages/audio/package.json`
  Add `./oscilloscope/*` direct subpath exports without a barrel export.
- `packages/audio/src/oscilloscope/runtime.ts`
  Headless controller that owns config, render loop, provider attachment, and cleanup.
- `packages/audio/src/oscilloscope/types.ts`
  Shared oscilloscope config, update, preset, and controller types.
- `packages/audio/src/oscilloscope/support.ts`
  WebGPU support detection used by the host before runtime start.
- `packages/audio/src/oscilloscope/presets.ts`
  Built-in V1 oscillator presets.
- `packages/audio/src/oscilloscope/signal/signal-provider.ts`
  Generic signal contract used by all sources.
- `packages/audio/src/oscilloscope/signal/oscillator-source.ts`
  Internal dual-oscillator provider plus config update support.
- `packages/audio/src/oscilloscope/signal/analyser-source.ts`
  Adapter that wraps host-created analysers as a `SignalProvider`.
- `packages/audio/src/oscilloscope/modes/mode.ts`
  `DisplayMode`, `FrameGeometry`, and mode input types.
- `packages/audio/src/oscilloscope/modes/xy.ts`
  V1 XY geometry generation.
- `packages/audio/src/oscilloscope/renderer/types.ts`
  Renderer interface and GPU resource type declarations.
- `packages/audio/src/oscilloscope/renderer/pipeline.ts`
  WebGPU init plus the active single-history phosphor renderer: fade accumulated history, redraw the trace into HDR history, then composite a lightweight glow pass to screen.
- `packages/audio/src/oscilloscope/renderer/uniforms.ts`
  Pure helpers that derive safe renderer uniform values from oscilloscope config.
- `packages/audio/src/oscilloscope/renderer/shaders/trace.ts`
  WGSL trace shader strings tuned for additive phosphor accumulation.
- `packages/audio/src/oscilloscope/renderer/shaders/fade.ts`
  WGSL fullscreen fade shader used to decay the accumulated history texture.
- `packages/audio/src/oscilloscope/renderer/shaders/composite.ts`
  WGSL fullscreen composite shader used by the active glow/composite pass.
- `packages/audio/src/oscilloscope/__tests__/support.test.ts`
  Support detection tests.
- `packages/audio/src/oscilloscope/renderer/__tests__/uniforms.test.ts`
  Renderer-uniform mapping and packing tests.
- `packages/audio/src/oscilloscope/signal/__tests__/oscillator-source.test.ts`
  Oscillator provider tests.
- `packages/audio/src/oscilloscope/signal/__tests__/analyser-source.test.ts`
  Analyser provider tests.
- `packages/audio/src/oscilloscope/modes/__tests__/xy.test.ts`
  XY mode geometry tests.
- `packages/audio/src/oscilloscope/__tests__/runtime.test.ts`
  Runtime lifecycle tests with a fake renderer.

### `apps/web`
- `apps/web/app/oscilloscope/page.tsx`
  Dedicated server route that mounts the client shell.
- `apps/web/components/oscilloscope/oscilloscope-client.tsx`
  Client owner for runtime lifecycle, preset state, source switching, and mic attach/detach; now lazy-loads the default oscilloscope runtime and converts both sync and async startup failures into the same fallback UI.
- `apps/web/components/oscilloscope/oscilloscope-shell.tsx`
  Presentational shell: canvas, support state, and mic status banner, with startup failures mirrored in the banner instead of misleading source-active copy.
- `apps/web/components/oscilloscope/oscilloscope-controls.tsx`
  Pure control surface for presets, source toggle, and oscillator/phosphor settings.
- `apps/web/lib/oscilloscope/create-mic-provider.ts`
  Host-only mic setup that returns an analyser-backed provider and teardown handle.
- `apps/web/lib/oscilloscope/__tests__/create-mic-provider.test.ts`
  Mic provider factory tests.
- `apps/web/components/oscilloscope/__tests__/oscilloscope-client.test.tsx`
  Server-render safety plus runtime-startup failure coverage for the client component.
- `apps/web/app/oscilloscope/__tests__/page.test.tsx`
  Route render test for page copy and controls.
- `apps/web/app/page.tsx`
  Add the new `/oscilloscope` entry to the home nav.

---

### Task 1: Add the oscilloscope package surface and support helper

**Files:**
- Modify: `packages/audio/package.json`
- Create: `packages/audio/src/oscilloscope/index.ts`
- Create: `packages/audio/src/oscilloscope/types.ts`
- Create: `packages/audio/src/oscilloscope/support.ts`
- Create: `packages/audio/src/oscilloscope/presets.ts`
- Test: `packages/audio/src/oscilloscope/__tests__/support.test.ts`

- [ ] **Step 1: Write the failing support helper test**

```ts
import { describe, expect, test } from "bun:test";

import { getOscilloscopeSupport } from "../support";

describe("getOscilloscopeSupport", () => {
  test("returns unsupported when navigator.gpu is missing", () => {
    expect(getOscilloscopeSupport({ navigator: {} })).toEqual({
      reason: "WebGPU is not available in this browser.",
      supported: false,
    });
  });

  test("returns supported when navigator.gpu exists", () => {
    expect(
      getOscilloscopeSupport({
        navigator: { gpu: {} },
      }),
    ).toEqual({
      reason: null,
      supported: true,
    });
  });
});
```

- [ ] **Step 2: Run the focused test to confirm it fails**

Run: `bun test packages/audio/src/oscilloscope/__tests__/support.test.ts`
Expected: FAIL with module-not-found errors for `../support`

- [ ] **Step 3: Create the shared oscilloscope types**

```ts
import type { SignalProvider } from "./signal/signal-provider";

export type OscilloscopeModeId = "xy";
export type OscilloscopeWaveform = "sine" | "square" | "saw" | "triangle";
export type OscilloscopeAspectRatio = "1:1" | "4:3";
export type OscilloscopeQuality = "quality" | "performance";
export type OscilloscopeSourceKind = "oscillators" | "mic";
export type OscilloscopePhosphorColor = "p31-green";
export type OscilloscopeRatioLock = "free" | "1:1" | "2:1" | "3:2";

export type OscillatorConfig = {
  amplitude: number;
  detuneCents: number;
  frequency: number;
  phase: number;
  waveform: OscilloscopeWaveform;
};

export type OscilloscopeConfig = {
  canvas: {
    aspectRatio: OscilloscopeAspectRatio;
    background: number;
    quality: OscilloscopeQuality;
  };
  mode: OscilloscopeModeId;
  phosphor: {
    bloom: number;
    color: OscilloscopePhosphorColor;
    trailLength: number;
  };
  source: {
    a: OscillatorConfig;
    b: OscillatorConfig;
    ratioLock: OscilloscopeRatioLock;
    type: OscilloscopeSourceKind;
  };
};

export type OscilloscopeConfigUpdate = {
  canvas?: Partial<OscilloscopeConfig["canvas"]>;
  mode?: OscilloscopeModeId;
  phosphor?: Partial<OscilloscopeConfig["phosphor"]>;
  source?: {
    a?: Partial<OscillatorConfig>;
    b?: Partial<OscillatorConfig>;
    ratioLock?: OscilloscopeRatioLock;
    type?: OscilloscopeSourceKind;
  };
};

export type OscilloscopeSupport = {
  reason: string | null;
  supported: boolean;
};

export type OscilloscopePreset = {
  config: OscilloscopeConfig;
  id: string;
  name: string;
};

export type OscilloscopeController = {
  destroy(): void;
  getState(): { config: OscilloscopeConfig; provider: SignalProvider | null; running: boolean };
  setSignalProvider(provider: SignalProvider | null): void; // null clears any host override and falls back to the internal oscillator provider
  start(): Promise<void>;
  stop(): void;
  updateConfig(update: OscilloscopeConfigUpdate): void;
};
```

- [ ] **Step 4: Create the support helper and preset registry**

```ts
import type { OscilloscopeSupport } from "./types";

type SupportEnv = {
  navigator?: {
    gpu?: unknown;
  };
};

export const getOscilloscopeSupport = (
  env: SupportEnv = globalThis as SupportEnv,
): OscilloscopeSupport => {
  if (!env.navigator?.gpu) {
    return {
      reason: "WebGPU is not available in this browser.",
      supported: false,
    };
  }

  return {
    reason: null,
    supported: true,
  };
};
```

Treat this helper as a preflight only. `navigator.gpu` can still be present while `requestAdapter()`, `requestDevice()`, or `canvas.getContext("webgpu")` fail later, so the client owner must convert `scope.start()` failures into the same user-visible fallback state instead of only logging them.

```ts
import type { OscilloscopePreset } from "./types";

export const OSCILLOSCOPE_PRESETS: OscilloscopePreset[] = [
  {
    id: "circle",
    name: "Circle",
    config: {
      mode: "xy",
      canvas: { aspectRatio: "1:1", background: 0.02, quality: "quality" },
      phosphor: { bloom: 0.75, color: "p31-green", trailLength: 64 },
      source: {
        type: "oscillators",
        ratioLock: "1:1",
        a: { amplitude: 1, detuneCents: 0, frequency: 220, phase: 1.5707963267948966, waveform: "sine" },
        b: { amplitude: 1, detuneCents: 0, frequency: 220, phase: 0, waveform: "sine" },
      },
    },
  },
  {
    id: "figure-eight",
    name: "Figure Eight",
    config: {
      mode: "xy",
      canvas: { aspectRatio: "1:1", background: 0.02, quality: "quality" },
      phosphor: { bloom: 0.8, color: "p31-green", trailLength: 72 },
      source: {
        type: "oscillators",
        ratioLock: "2:1",
        a: { amplitude: 1, detuneCents: 0, frequency: 220, phase: 0, waveform: "sine" },
        b: { amplitude: 1, detuneCents: 0, frequency: 110, phase: 0, waveform: "sine" },
      },
    },
  },
  {
    id: "lissajous-3-2",
    name: "Lissajous 3:2",
    config: {
      mode: "xy",
      canvas: { aspectRatio: "1:1", background: 0.02, quality: "quality" },
      phosphor: { bloom: 0.85, color: "p31-green", trailLength: 84 },
      source: {
        type: "oscillators",
        ratioLock: "3:2",
        a: { amplitude: 1, detuneCents: 0, frequency: 300, phase: 0, waveform: "sine" },
        b: { amplitude: 1, detuneCents: 0, frequency: 200, phase: 0, waveform: "sine" },
      },
    },
  },
  {
    id: "breathing-detune",
    name: "Breathing Detune",
    config: {
      mode: "xy",
      canvas: { aspectRatio: "1:1", background: 0.02, quality: "quality" },
      phosphor: { bloom: 0.9, color: "p31-green", trailLength: 96 },
      source: {
        type: "oscillators",
        ratioLock: "1:1",
        a: { amplitude: 1, detuneCents: 3, frequency: 220, phase: 1.5707963267948966, waveform: "sine" },
        b: { amplitude: 1, detuneCents: 0, frequency: 220, phase: 0, waveform: "sine" },
      },
    },
  },
];
```

```ts
export { OSCILLOSCOPE_PRESETS } from "./presets";
export { createOscilloscope } from "./runtime";
export { getOscilloscopeSupport } from "./support";
export type {
  OscilloscopeConfig,
  OscilloscopeConfigUpdate,
  OscilloscopeController,
  OscilloscopePreset,
  OscilloscopeSupport,
} from "./types";
```

- [ ] **Step 5: Add the package exports**

```json
{
  "name": "@kkb/audio",
  "version": "0.0.0",
  "private": true,
  "type": "module",
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

- [ ] **Step 6: Run focused verification**

Run: `bun test packages/audio/src/oscilloscope/__tests__/support.test.ts`
Expected: PASS

Run: `bun run check-types -- --filter=@kkb/audio`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add packages/audio/package.json packages/audio/src/oscilloscope
git commit -m "feat: add oscilloscope package surface"
```

### Task 2: Implement the `SignalProvider` contract and internal oscillator source

**Files:**
- Create: `packages/audio/src/oscilloscope/signal/signal-provider.ts`
- Create: `packages/audio/src/oscilloscope/signal/oscillator-source.ts`
- Test: `packages/audio/src/oscilloscope/signal/__tests__/oscillator-source.test.ts`

- [ ] **Step 1: Write the failing oscillator provider tests**

```ts
import { describe, expect, test } from "bun:test";

import { createOscillatorSignalProvider } from "../oscillator-source";

describe("createOscillatorSignalProvider", () => {
  test("generates independent channel buffers from oscillator A and B", () => {
    const provider = createOscillatorSignalProvider(
      {
        ratioLock: "free",
        type: "oscillators",
        a: { amplitude: 1, detuneCents: 0, frequency: 100, phase: 0, waveform: "sine" },
        b: { amplitude: 0.5, detuneCents: 0, frequency: 50, phase: 0, waveform: "triangle" },
      },
      {
        clock: () => 1,
        fftSize: 8,
        sampleRate: 8,
      },
    );

    const left = provider.getSamples(0);
    const right = provider.getSamples(1);

    expect(left).toHaveLength(8);
    expect(right).toHaveLength(8);
    expect(Array.from(left)).not.toEqual(Array.from(right));
  });

  test("applies config updates without replacing the provider instance", () => {
    const provider = createOscillatorSignalProvider(
      {
        ratioLock: "free",
        type: "oscillators",
        a: { amplitude: 1, detuneCents: 0, frequency: 100, phase: 0, waveform: "sine" },
        b: { amplitude: 1, detuneCents: 0, frequency: 100, phase: 0, waveform: "sine" },
      },
      {
        clock: () => 1,
        fftSize: 8,
        sampleRate: 8,
      },
    );

    const before = Array.from(provider.getSamples(0));

    provider.update({
      a: { frequency: 200 },
    });

    const after = Array.from(provider.getSamples(0));

    expect(after).not.toEqual(before);
  });
});
```

- [ ] **Step 2: Run the focused test to confirm it fails**

Run: `bun test packages/audio/src/oscilloscope/signal/__tests__/oscillator-source.test.ts`
Expected: FAIL with module-not-found errors for `../oscillator-source`

- [ ] **Step 3: Add the signal contract**

```ts
export type SignalProvider = {
  channelCount: 1 | 2;
  fftSize: number;
  frequencyBinCount: number;
  sampleRate: number;
  smoothing: number;
  getFrequencyData(channel: 0 | 1): Float32Array;
  getSamples(channel: 0 | 1): Float32Array;
};
```

- [ ] **Step 4: Implement the oscillator-backed provider**

```ts
import type { OscilloscopeConfig } from "../types";
import type { SignalProvider } from "./signal-provider";

type OscillatorSourceConfig = OscilloscopeConfig["source"];

type CreateOscillatorSignalProviderOptions = {
  clock?: () => number;
  fftSize?: number;
  sampleRate?: number;
};

export type OscillatorSignalProvider = SignalProvider & {
  update(update: Partial<OscillatorSourceConfig>): void;
};

const toPhaseOffset = (phase: number) => phase / (Math.PI * 2);

const sampleWave = (waveform: OscillatorSourceConfig["a"]["waveform"], phase: number) => {
  const wrapped = phase - Math.floor(phase);

  switch (waveform) {
    case "square":
      return wrapped < 0.5 ? 1 : -1;
    case "saw":
      return wrapped * 2 - 1;
    case "triangle":
      return 1 - 4 * Math.abs(wrapped - 0.5);
    case "sine":
    default:
      return Math.sin(wrapped * Math.PI * 2);
  }
};

const mergeSourceConfig = (
  current: OscillatorSourceConfig,
  update: Partial<OscillatorSourceConfig>,
): OscillatorSourceConfig => ({
  ...current,
  ...update,
  a: { ...current.a, ...update.a },
  b: { ...current.b, ...update.b },
});

export const createOscillatorSignalProvider = (
  initialConfig: OscillatorSourceConfig,
  options: CreateOscillatorSignalProviderOptions = {},
): OscillatorSignalProvider => {
  let config = initialConfig;
  const sampleRate = options.sampleRate ?? 48_000;
  const fftSize = options.fftSize ?? 1024;
  const clock = options.clock ?? (() => performance.now() / 1000);
  const emptyFrequencyData = new Float32Array(fftSize / 2);

  const buildSamples = (oscillator: OscillatorSourceConfig["a"]) => {
    const samples = new Float32Array(fftSize);
    const now = clock();
    const detuneMultiplier = Math.pow(2, oscillator.detuneCents / 1200);
    const frequency = oscillator.frequency * detuneMultiplier;

    for (let index = 0; index < fftSize; index += 1) {
      const time = now - (fftSize - 1 - index) / sampleRate;
      const phase = time * frequency + toPhaseOffset(oscillator.phase);
      samples[index] = sampleWave(oscillator.waveform, phase) * oscillator.amplitude;
    }

    return samples;
  };

  return {
    channelCount: 2,
    fftSize,
    frequencyBinCount: emptyFrequencyData.length,
    sampleRate,
    smoothing: 0,
    getFrequencyData: () => emptyFrequencyData,
    getSamples: (channel) => buildSamples(channel === 0 ? config.a : config.b),
    update: (update) => {
      config = mergeSourceConfig(config, update);
    },
  };
};
```

- [ ] **Step 5: Run focused verification**

Run: `bun test packages/audio/src/oscilloscope/signal/__tests__/oscillator-source.test.ts`
Expected: PASS

Run: `bun run check-types -- --filter=@kkb/audio`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add packages/audio/src/oscilloscope/signal
git commit -m "feat: add oscilloscope oscillator provider"
```

### Task 3: Implement the analyser-backed provider adapter

**Files:**
- Create: `packages/audio/src/oscilloscope/signal/analyser-source.ts`
- Test: `packages/audio/src/oscilloscope/signal/__tests__/analyser-source.test.ts`

- [ ] **Step 1: Write the failing analyser provider test**

```ts
import { describe, expect, test } from "bun:test";

import { createAnalyserSignalProvider } from "../analyser-source";

describe("createAnalyserSignalProvider", () => {
  test("reads time-domain and frequency-domain data from the provided analysers", () => {
    const left = {
      fftSize: 8,
      frequencyBinCount: 4,
      smoothingTimeConstant: 0.4,
      getFloatFrequencyData: (target: Float32Array) => target.set([-80, -60, -40, -20]),
      getFloatTimeDomainData: (target: Float32Array) => target.set([0, 0.25, 0.5, 0.75, 0, -0.25, -0.5, -0.75]),
    };
    const right = {
      fftSize: 8,
      frequencyBinCount: 4,
      smoothingTimeConstant: 0.4,
      getFloatFrequencyData: (target: Float32Array) => target.set([-70, -55, -35, -15]),
      getFloatTimeDomainData: (target: Float32Array) => target.set([0, -0.25, -0.5, -0.75, 0, 0.25, 0.5, 0.75]),
    };

    const provider = createAnalyserSignalProvider({ left, right, sampleRate: 48_000 });

    expect(Array.from(provider.getSamples(0))).toEqual([0, 0.25, 0.5, 0.75, 0, -0.25, -0.5, -0.75]);
    expect(Array.from(provider.getSamples(1))).toEqual([0, -0.25, -0.5, -0.75, 0, 0.25, 0.5, 0.75]);
    expect(Array.from(provider.getFrequencyData(0))).toEqual([-80, -60, -40, -20]);
  });
});
```

- [ ] **Step 2: Run the focused test to confirm it fails**

Run: `bun test packages/audio/src/oscilloscope/signal/__tests__/analyser-source.test.ts`
Expected: FAIL with module-not-found errors for `../analyser-source`

- [ ] **Step 3: Implement the analyser adapter**

```ts
import type { SignalProvider } from "./signal-provider";

export type AnalyserLike = {
  fftSize: number;
  frequencyBinCount: number;
  smoothingTimeConstant: number;
  getFloatFrequencyData(target: Float32Array): void;
  getFloatTimeDomainData(target: Float32Array): void;
};

export const createAnalyserSignalProvider = ({
  left,
  right,
  sampleRate,
}: {
  left: AnalyserLike;
  right?: AnalyserLike;
  sampleRate: number;
}): SignalProvider => ({
  channelCount: right ? 2 : 1,
  fftSize: left.fftSize,
  frequencyBinCount: left.frequencyBinCount,
  sampleRate,
  smoothing: left.smoothingTimeConstant,
  getFrequencyData: (channel) => {
    const analyser = channel === 0 || !right ? left : right;
    const buffer = new Float32Array(analyser.frequencyBinCount);
    analyser.getFloatFrequencyData(buffer);
    return buffer;
  },
  getSamples: (channel) => {
    const analyser = channel === 0 || !right ? left : right;
    const buffer = new Float32Array(analyser.fftSize);
    analyser.getFloatTimeDomainData(buffer);
    return buffer;
  },
});
```

- [ ] **Step 4: Run focused verification**

Run: `bun test packages/audio/src/oscilloscope/signal/__tests__/analyser-source.test.ts`
Expected: PASS

Run: `bun run check-types -- --filter=@kkb/audio`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add packages/audio/src/oscilloscope/signal/analyser-source.ts packages/audio/src/oscilloscope/signal/__tests__/analyser-source.test.ts
git commit -m "feat: add oscilloscope analyser provider"
```

### Task 4: Implement XY frame geometry generation

**Files:**
- Create: `packages/audio/src/oscilloscope/modes/mode.ts`
- Create: `packages/audio/src/oscilloscope/modes/xy.ts`
- Test: `packages/audio/src/oscilloscope/modes/__tests__/xy.test.ts`

- [ ] **Step 1: Write the failing XY mode tests**

```ts
import { describe, expect, test } from "bun:test";

import { createXyMode } from "../xy";
import type { SignalProvider } from "../../signal/signal-provider";

const provider: SignalProvider = {
  channelCount: 2,
  fftSize: 4,
  frequencyBinCount: 2,
  sampleRate: 48_000,
  smoothing: 0,
  getFrequencyData: () => new Float32Array([0, 0]),
  getSamples: (channel) =>
    channel === 0 ? new Float32Array([-1, -0.5, 0.5, 1]) : new Float32Array([1, 0.5, -0.5, -1]),
};

describe("createXyMode", () => {
  test("builds a clipped line-strip from left/right sample pairs", () => {
    const geometry = createXyMode().generateFrame({
      time: 0,
      signals: provider,
      params: { gain: 1, sampleCount: 4 },
      viewport: { height: 512, width: 512 },
    });

    expect(geometry.kind).toBe("line-strip");
    expect(Array.from(geometry.points)).toEqual([-1, 1, -0.5, 0.5, 0.5, -0.5, 1, -1]);
  });

  test("duplicates mono samples into both axes", () => {
    const monoProvider: SignalProvider = {
      ...provider,
      channelCount: 1,
      getSamples: () => new Float32Array([-1, -0.25, 0.25, 1]),
    };

    const geometry = createXyMode().generateFrame({
      time: 0,
      signals: monoProvider,
      params: { gain: 1, sampleCount: 4 },
      viewport: { height: 512, width: 512 },
    });

    expect(Array.from(geometry.points)).toEqual([-1, -1, -0.25, -0.25, 0.25, 0.25, 1, 1]);
  });
});
```

- [ ] **Step 2: Run the focused test to confirm it fails**

Run: `bun test packages/audio/src/oscilloscope/modes/__tests__/xy.test.ts`
Expected: FAIL with module-not-found errors for `../xy`

- [ ] **Step 3: Add the mode contracts**

```ts
import type { SignalProvider } from "../signal/signal-provider";

export type FrameGeometry = {
  kind: "line-strip";
  points: Float32Array;
};

export type DisplayMode<TParams> = {
  generateFrame(input: {
    params: TParams;
    signals: SignalProvider;
    time: number;
    viewport: { height: number; width: number };
  }): FrameGeometry;
  id: string;
  name: string;
};

export type XyModeParams = {
  gain: number;
  sampleCount: number;
};
```

- [ ] **Step 4: Implement the XY mode**

```ts
import type { DisplayMode, FrameGeometry, XyModeParams } from "./mode";

const clamp = (value: number) => Math.max(-1, Math.min(1, value));

export const createXyMode = (): DisplayMode<XyModeParams> => ({
  id: "xy",
  name: "XY",
  generateFrame: ({ params, signals }): FrameGeometry => {
    const left = signals.getSamples(0);
    const right = signals.channelCount === 2 ? signals.getSamples(1) : left;
    const sampleCount = Math.min(params.sampleCount, left.length, right.length);
    const points = new Float32Array(sampleCount * 2);

    for (let index = 0; index < sampleCount; index += 1) {
      points[index * 2] = clamp(left[index] * params.gain);
      points[index * 2 + 1] = clamp(right[index] * params.gain);
    }

    return {
      kind: "line-strip",
      points,
    };
  },
});
```

- [ ] **Step 5: Run focused verification**

Run: `bun test packages/audio/src/oscilloscope/modes/__tests__/xy.test.ts`
Expected: PASS

Run: `bun run check-types -- --filter=@kkb/audio`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add packages/audio/src/oscilloscope/modes
git commit -m "feat: add oscilloscope xy mode"
```

### Task 5: Implement the headless runtime controller and WebGPU renderer

**Files:**
- Create: `packages/audio/src/oscilloscope/runtime.ts`
- Create: `packages/audio/src/oscilloscope/renderer/types.ts`
- Create: `packages/audio/src/oscilloscope/renderer/pipeline.ts`
- Create: `packages/audio/src/oscilloscope/renderer/shaders/trace.ts`
- Create: `packages/audio/src/oscilloscope/renderer/shaders/composite.ts`
- Test: `packages/audio/src/oscilloscope/__tests__/runtime.test.ts`
- Modify: `packages/audio/src/oscilloscope/index.ts`

- [ ] **Step 1: Write the failing runtime lifecycle test**

```ts
import { describe, expect, test } from "bun:test";

import { createOscilloscope } from "../runtime";
import type { SignalProvider } from "../signal/signal-provider";

const provider: SignalProvider = {
  channelCount: 2,
  fftSize: 4,
  frequencyBinCount: 2,
  sampleRate: 48_000,
  smoothing: 0,
  getFrequencyData: () => new Float32Array([0, 0]),
  getSamples: () => new Float32Array([0, 0.25, -0.25, 0]),
};

describe("createOscilloscope", () => {
  test("starts once, attaches providers, and tears down the renderer", async () => {
    const drawCalls: number[] = [];
    const canvas = { clientHeight: 320, clientWidth: 320, height: 320, width: 320 } as HTMLCanvasElement;

    const scope = createOscilloscope(canvas, {
      canvas: { aspectRatio: "1:1", background: 0.02, quality: "quality" },
      mode: "xy",
      phosphor: { bloom: 0.75, color: "p31-green", trailLength: 64 },
      source: {
        type: "oscillators",
        ratioLock: "1:1",
        a: { amplitude: 1, detuneCents: 0, frequency: 220, phase: 0, waveform: "sine" },
        b: { amplitude: 1, detuneCents: 0, frequency: 220, phase: 0, waveform: "sine" },
      },
    }, {
      createRenderer: async () => ({
        destroy: () => {
          drawCalls.push(-1);
        },
        drawFrame: (geometry) => {
          drawCalls.push(geometry.points.length);
        },
        resize: () => {},
      }),
      now: () => 1,
      requestFrame: () => 1,
      cancelFrame: () => {},
    });

    scope.setSignalProvider(provider);
    scope.setSignalProvider(null);
    await scope.start();
    scope.stop();
    scope.destroy();

    expect(drawCalls[0]).toBe(8);
    expect(drawCalls.at(-1)).toBe(-1);
  });
});
```

- [ ] **Step 2: Run the focused test to confirm it fails**

Run: `bun test packages/audio/src/oscilloscope/__tests__/runtime.test.ts`
Expected: FAIL with module-not-found errors for `../runtime`

- [ ] **Step 3: Add the renderer interface and WGSL shader strings**

```ts
import type { FrameGeometry } from "../modes/mode";
import type { OscilloscopeConfig } from "../types";

export type OscilloscopeRenderer = {
  destroy(): void;
  drawFrame(geometry: FrameGeometry, config: OscilloscopeConfig): void;
  resize(width: number, height: number, devicePixelRatio: number): void;
};
```

```ts
export const TRACE_SHADER = /* wgsl */ `
struct VertexOut {
  @builtin(position) position: vec4f,
};

@vertex
fn vs(@location(0) point: vec2f) -> VertexOut {
  var out: VertexOut;
  out.position = vec4f(point.x, point.y, 0.0, 1.0);
  return out;
}

@fragment
fn fs() -> @location(0) vec4f {
  return vec4f(0.45, 1.0, 0.62, 0.9);
}
`;
```

```ts
export const COMPOSITE_SHADER = /* wgsl */ `
@group(0) @binding(0) var historyTexture: texture_2d<f32>;
@group(0) @binding(1) var historySampler: sampler;

struct CompositeUniforms {
  decay: f32,
  bloom: f32,
  background: f32,
  padding: f32,
};

@group(0) @binding(2) var<uniform> uniforms: CompositeUniforms;

struct VertexOut {
  @builtin(position) position: vec4f,
  @location(0) uv: vec2f,
};

@vertex
fn vs(@builtin(vertex_index) index: u32) -> VertexOut {
  var positions = array<vec2f, 3>(
    vec2f(-1.0, -3.0),
    vec2f(3.0, 1.0),
    vec2f(-1.0, 1.0),
  );
  var uvs = array<vec2f, 3>(
    vec2f(0.0, 2.0),
    vec2f(2.0, 0.0),
    vec2f(0.0, 0.0),
  );

  var out: VertexOut;
  out.position = vec4f(positions[index], 0.0, 1.0);
  out.uv = uvs[index];
  return out;
}

@fragment
fn fs(input: VertexOut) -> @location(0) vec4f {
  let history = textureSample(historyTexture, historySampler, input.uv);
  let faded = history.rgb * uniforms.decay;
  let glow = faded * (1.0 + uniforms.bloom * 0.35);
  return vec4f(max(glow, vec3f(uniforms.background)), 1.0);
}
`;
```

- [ ] **Step 4: Implement the ping-pong renderer**

```ts
import type { FrameGeometry } from "../modes/mode";
import type { OscilloscopeConfig } from "../types";
import type { OscilloscopeRenderer } from "./types";
import { COMPOSITE_SHADER } from "./shaders/composite";
import { TRACE_SHADER } from "./shaders/trace";

const HISTORY_FORMAT: GPUTextureFormat = "rgba16float";
const HISTORY_USAGE = GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING;

export const createWebGpuRenderer = async (
  canvas: HTMLCanvasElement,
): Promise<OscilloscopeRenderer> => {
  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) {
    throw new Error("Unable to acquire a WebGPU adapter.");
  }

  const device = await adapter.requestDevice();
  const context = canvas.getContext("webgpu");
  if (!context) {
    throw new Error("Unable to acquire a WebGPU canvas context.");
  }

  const format = navigator.gpu.getPreferredCanvasFormat();
  context.configure({ alphaMode: "opaque", device, format });

  const sampler = device.createSampler({ magFilter: "linear", minFilter: "linear" });
  const uniformBuffer = device.createBuffer({
    size: 16,
    usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.UNIFORM,
  });
  const vertexBuffer = device.createBuffer({
    size: 8192 * Float32Array.BYTES_PER_ELEMENT,
    usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.VERTEX,
  });

  const traceModule = device.createShaderModule({ code: TRACE_SHADER });
  const compositeModule = device.createShaderModule({ code: COMPOSITE_SHADER });

  const tracePipeline = device.createRenderPipeline({
    layout: "auto",
    vertex: {
      module: traceModule,
      entryPoint: "vs",
      buffers: [
        {
          arrayStride: 8,
          attributes: [{ format: "float32x2", offset: 0, shaderLocation: 0 }],
        },
      ],
    },
    fragment: {
      module: traceModule,
      entryPoint: "fs",
      targets: [{ format: "rgba16float", blend: { color: { srcFactor: "one", dstFactor: "one", operation: "add" }, alpha: { srcFactor: "one", dstFactor: "one-minus-src-alpha", operation: "add" } } }],
    },
    primitive: { topology: "line-strip" },
  });

  const historyCompositePipeline = device.createRenderPipeline({
    layout: "auto",
    vertex: { module: compositeModule, entryPoint: "vs" },
    fragment: {
      module: compositeModule,
      entryPoint: "fs",
      targets: [{ format: HISTORY_FORMAT }],
    },
    primitive: { topology: "triangle-list" },
  });

  const screenCompositePipeline = device.createRenderPipeline({
    layout: "auto",
    vertex: { module: compositeModule, entryPoint: "vs" },
    fragment: {
      module: compositeModule,
      entryPoint: "fs",
      targets: [{ format }],
    },
    primitive: { topology: "triangle-list" },
  });

  let size = { width: Math.max(1, canvas.width), height: Math.max(1, canvas.height) };
  let readIndex = 0;
  let writeIndex = 1;

  const createHistoryTexture = () =>
    device.createTexture({
      format: HISTORY_FORMAT,
      size,
      usage: HISTORY_USAGE,
    });

  let histories = [createHistoryTexture(), createHistoryTexture()];

  const recreateHistories = () => {
    histories.forEach((texture) => texture.destroy());
    histories = [createHistoryTexture(), createHistoryTexture()];
    readIndex = 0;
    writeIndex = 1;
  };

  const resize = (width: number, height: number, dpr: number) => {
    const nextWidth = Math.max(1, Math.floor(width * dpr));
    const nextHeight = Math.max(1, Math.floor(height * dpr));

    if (canvas.width === nextWidth && canvas.height === nextHeight) {
      return;
    }

    canvas.width = nextWidth;
    canvas.height = nextHeight;
    size = { width: nextWidth, height: nextHeight };
    recreateHistories();
  };

  const drawFrame = (geometry: FrameGeometry, config: OscilloscopeConfig) => {
    const uniforms = new Float32Array([
      Math.max(0.85, 1 - config.phosphor.trailLength / 512),
      config.phosphor.bloom,
      config.canvas.background,
      0,
    ]);

    device.queue.writeBuffer(uniformBuffer, 0, uniforms);
    device.queue.writeBuffer(vertexBuffer, 0, geometry.points);

    const encoder = device.createCommandEncoder();
    const historyView = histories[writeIndex].createView();
    const previousHistoryView = histories[readIndex].createView();
    const currentTextureView = context.getCurrentTexture().createView();

    const historyBindGroup = device.createBindGroup({
      layout: historyCompositePipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: previousHistoryView },
        { binding: 1, resource: sampler },
        { binding: 2, resource: { buffer: uniformBuffer } },
      ],
    });

    const historyPass = encoder.beginRenderPass({
      colorAttachments: [
        {
          view: historyView,
          loadOp: "clear",
          clearValue: { r: 0, g: 0, b: 0, a: 1 },
          storeOp: "store",
        },
      ],
    });
    historyPass.setPipeline(historyCompositePipeline);
    historyPass.setBindGroup(0, historyBindGroup);
    historyPass.draw(3);
    historyPass.setPipeline(tracePipeline);
    historyPass.setVertexBuffer(0, vertexBuffer);
    historyPass.draw(geometry.points.length / 2);
    historyPass.end();

    const screenBindGroup = device.createBindGroup({
      layout: screenCompositePipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: historyView },
        { binding: 1, resource: sampler },
        { binding: 2, resource: { buffer: uniformBuffer } },
      ],
    });

    const screenPass = encoder.beginRenderPass({
      colorAttachments: [
        {
          view: currentTextureView,
          loadOp: "clear",
          clearValue: { r: config.canvas.background, g: config.canvas.background, b: config.canvas.background, a: 1 },
          storeOp: "store",
        },
      ],
    });
    screenPass.setPipeline(screenCompositePipeline);
    screenPass.setBindGroup(0, screenBindGroup);
    screenPass.draw(3);
    screenPass.end();

    device.queue.submit([encoder.finish()]);
    readIndex = writeIndex;
    writeIndex = writeIndex === 0 ? 1 : 0;
  };

  return {
    destroy: () => {
      histories.forEach((texture) => texture.destroy());
    },
    drawFrame,
    resize,
  };
};
```

- [ ] **Step 5: Implement the headless controller**

```ts
import { createXyMode } from "./modes/xy";
import { createOscillatorSignalProvider } from "./signal/oscillator-source";
import type { SignalProvider } from "./signal/signal-provider";
import type {
  OscilloscopeConfig,
  OscilloscopeConfigUpdate,
  OscilloscopeController,
} from "./types";
import { createWebGpuRenderer } from "./renderer/pipeline";
import type { OscilloscopeRenderer } from "./renderer/types";

type RuntimeOptions = {
  cancelFrame?: (handle: number) => void;
  createRenderer?: (canvas: HTMLCanvasElement) => Promise<OscilloscopeRenderer>;
  now?: () => number;
  requestFrame?: (callback: FrameRequestCallback) => number;
};

const mergeConfig = (current: OscilloscopeConfig, update: OscilloscopeConfigUpdate): OscilloscopeConfig => ({
  ...current,
  ...update,
  canvas: { ...current.canvas, ...update.canvas },
  phosphor: { ...current.phosphor, ...update.phosphor },
  source: {
    ...current.source,
    ...update.source,
    a: { ...current.source.a, ...update.source?.a },
    b: { ...current.source.b, ...update.source?.b },
  },
});

export const createOscilloscope = (
  canvas: HTMLCanvasElement,
  initialConfig: OscilloscopeConfig,
  options: RuntimeOptions = {},
): OscilloscopeController => {
  const createRenderer = options.createRenderer ?? createWebGpuRenderer;
  const requestFrame = options.requestFrame ?? requestAnimationFrame;
  const cancelFrame = options.cancelFrame ?? cancelAnimationFrame;
  const now = options.now ?? (() => performance.now() / 1000);

  let config = initialConfig;
  let running = false;
  let frameHandle = 0;
  let renderer: OscilloscopeRenderer | null = null;
  let internalProvider: SignalProvider | null = createOscillatorSignalProvider(config.source);
  let providerOverride: SignalProvider | null = null;
  const xyMode = createXyMode();

  const getActiveProvider = () => providerOverride ?? internalProvider;

  const tick = () => {
    const activeProvider = getActiveProvider();
    if (!running || !renderer || !activeProvider) {
      return;
    }

    renderer.resize(canvas.clientWidth, canvas.clientHeight, window.devicePixelRatio || 1);
    const geometry = xyMode.generateFrame({
      time: now(),
      signals: activeProvider,
      params: { gain: 1, sampleCount: Math.max(256, config.phosphor.trailLength * 8) },
      viewport: { height: canvas.height, width: canvas.width },
    });
    renderer.drawFrame(geometry, config);
    frameHandle = requestFrame(tick);
  };

  return {
    destroy: () => {
      running = false;
      cancelFrame(frameHandle);
      renderer?.destroy();
      renderer = null;
      providerOverride = null;
      internalProvider = null;
    },
    getState: () => ({ config, provider: getActiveProvider(), running }),
    setSignalProvider: (nextProvider) => {
      providerOverride = nextProvider;
    },
    start: async () => {
      if (running) {
        return;
      }

      renderer ??= await createRenderer(canvas);
      running = true;
      tick();
    },
    stop: () => {
      running = false;
      cancelFrame(frameHandle);
    },
    updateConfig: (update) => {
      config = mergeConfig(config, update);
      if (internalProvider && "update" in internalProvider && typeof internalProvider.update === "function") {
        internalProvider.update(config.source);
      }
    },
  };
};
```

- [ ] **Step 6: Run focused verification**

Run: `bun test packages/audio/src/oscilloscope/__tests__/runtime.test.ts`
Expected: PASS

Run: `bun run check-types -- --filter=@kkb/audio`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add packages/audio/src/oscilloscope
git commit -m "feat: add oscilloscope runtime and renderer"
```

### Task 6: Add the first `apps/web` oscilloscope route and client shell

**Files:**
- Create: `apps/web/app/oscilloscope/page.tsx`
- Create: `apps/web/components/oscilloscope/oscilloscope-client.tsx`
- Create: `apps/web/components/oscilloscope/oscilloscope-shell.tsx`
- Create: `apps/web/components/oscilloscope/oscilloscope-controls.tsx`
- Create: `apps/web/components/oscilloscope/__tests__/oscilloscope-client.test.tsx`
- Create: `apps/web/app/oscilloscope/__tests__/page.test.tsx`
- Modify: `apps/web/app/page.tsx`

- [ ] **Step 1: Write the failing server-render safety test for the client component**

```ts
import { describe, expect, mock, test } from "bun:test";
import { renderToString } from "react-dom/server";

import { OscilloscopeClient } from "../oscilloscope-client";

describe("OscilloscopeClient", () => {
  test("does not create the browser runtime during server render", () => {
    const createScope = mock(() => {
      throw new Error("browser runtime should not start during server render");
    });

    expect(() => renderToString(<OscilloscopeClient createScope={createScope} />)).not.toThrow();
    expect(createScope).not.toHaveBeenCalled();
  });
});
```

Also add a client-render test in this same file that changes a control value and asserts `createScope(...)` is still called exactly once while `scope.updateConfig(...)` receives the new settings. That guards the intended headless-runtime lifecycle.

Also add a startup-failure test that makes `scope.start()` reject and asserts the shell swaps from the canvas to a readable fallback message instead of leaving a blank viewport.

- [ ] **Step 2: Write the failing route render test**

```ts
import { describe, expect, test } from "bun:test";
import { renderToString } from "react-dom/server";

import OscilloscopePage from "../page";

describe("/oscilloscope page", () => {
  test("renders the oscilloscope shell and essential controls", () => {
    const html = renderToString(<OscilloscopePage />).replaceAll("<!-- -->", "");

    expect(html).toContain("Browser Oscilloscope");
    expect(html).toContain("Circle");
    expect(html).toContain("Source");
    expect(html).toContain("Oscillators");
    expect(html).toContain("Mic");
  });
});
```

- [ ] **Step 3: Add the route page and presentational shell**

```tsx
import { OscilloscopeClient } from "@/components/oscilloscope/oscilloscope-client";

export default function OscilloscopePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#0e1a11_0%,#071009_48%,#030806_100%)] px-4 py-10 text-white">
      <OscilloscopeClient />
    </main>
  );
}
```

```tsx
import type { OscilloscopeConfig, OscilloscopeSupport } from "@kkb/audio/oscilloscope";
import type { RefObject } from "react";

import { OscilloscopeControls } from "./oscilloscope-controls";

type OscilloscopeShellProps = {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  config: OscilloscopeConfig;
  micStatus: "idle" | "requesting" | "ready" | "error";
  micError: string | null;
  onConfigChange: (config: Partial<OscilloscopeConfig>) => void;
  onPresetChange: (presetId: string) => void;
  onSourceChange: (source: OscilloscopeConfig["source"]["type"]) => void;
  support: OscilloscopeSupport;
};

export function OscilloscopeShell({
  canvasRef,
  config,
  micStatus,
  micError,
  onConfigChange,
  onPresetChange,
  onSourceChange,
  support,
}: OscilloscopeShellProps) {
  return (
    <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
      <section className="rounded-3xl border border-emerald-500/20 bg-black/50 p-5 shadow-[0_0_80px_rgba(0,255,128,0.08)]">
        <div className="mb-4 flex items-center justify-between font-mono text-xs uppercase tracking-[0.2em] text-emerald-300/80">
          <span>Browser Oscilloscope</span>
          <span>{support.supported ? config.mode : "unsupported"}</span>
        </div>
        <div className="aspect-square overflow-hidden rounded-2xl border border-emerald-500/20 bg-[#020604]">
          {support.supported ? (
            <canvas ref={canvasRef} className="h-full w-full" />
          ) : (
            <div className="flex h-full items-center justify-center px-8 text-center text-sm text-emerald-100/70">
              {support.reason}
            </div>
          )}
        </div>
        <div className="mt-4 font-mono text-xs text-emerald-200/70">
          {config.source.type === "mic"
            ? micStatus === "error"
              ? micError
              : micStatus === "ready"
                ? "Mic input active"
                : micStatus === "requesting"
                  ? "Requesting mic permission"
                  : "Mic input idle"
            : "Internal oscillators active"}
        </div>
      </section>

      <OscilloscopeControls
        config={config}
        onConfigChange={onConfigChange}
        onPresetChange={onPresetChange}
        onSourceChange={onSourceChange}
      />
    </div>
  );
}
```

- [ ] **Step 4: Add the pure controls component**

```tsx
import { OSCILLOSCOPE_PRESETS, type OscilloscopeConfig } from "@kkb/audio/oscilloscope";

type OscilloscopeControlsProps = {
  config: OscilloscopeConfig;
  onConfigChange: (config: Partial<OscilloscopeConfig>) => void;
  onPresetChange: (presetId: string) => void;
  onSourceChange: (source: OscilloscopeConfig["source"]["type"]) => void;
};

export function OscilloscopeControls({
  config,
  onConfigChange,
  onPresetChange,
  onSourceChange,
}: OscilloscopeControlsProps) {
  return (
    <aside className="rounded-3xl border border-emerald-500/20 bg-black/40 p-5 text-emerald-50">
      <div className="space-y-5">
        <div>
          <label className="mb-2 block font-mono text-xs uppercase tracking-[0.2em] text-emerald-300/80">
            Preset
          </label>
          <select
            className="w-full rounded-xl border border-emerald-500/20 bg-[#071009] px-3 py-2 text-sm"
            defaultValue={OSCILLOSCOPE_PRESETS[0]?.id}
            onChange={(event) => onPresetChange(event.target.value)}
          >
            {OSCILLOSCOPE_PRESETS.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block font-mono text-xs uppercase tracking-[0.2em] text-emerald-300/80">
            Source
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button className="rounded-xl border border-emerald-500/20 px-3 py-2 text-sm" onClick={() => onSourceChange("oscillators")} type="button">
              Oscillators
            </button>
            <button className="rounded-xl border border-emerald-500/20 px-3 py-2 text-sm" onClick={() => onSourceChange("mic")} type="button">
              Mic
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm">
            <span className="mb-1 block font-mono text-xs uppercase tracking-[0.18em] text-emerald-300/70">A Freq</span>
            <input
              className="w-full rounded-xl border border-emerald-500/20 bg-[#071009] px-3 py-2"
              type="number"
              value={config.source.a.frequency}
              onChange={(event) =>
                onConfigChange({
                  source: { ...config.source, a: { ...config.source.a, frequency: Number(event.target.value) } },
                })
              }
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-mono text-xs uppercase tracking-[0.18em] text-emerald-300/70">B Freq</span>
            <input
              className="w-full rounded-xl border border-emerald-500/20 bg-[#071009] px-3 py-2"
              type="number"
              value={config.source.b.frequency}
              onChange={(event) =>
                onConfigChange({
                  source: { ...config.source, b: { ...config.source.b, frequency: Number(event.target.value) } },
                })
              }
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-mono text-xs uppercase tracking-[0.18em] text-emerald-300/70">Trail</span>
            <input
              className="w-full"
              type="range"
              min="16"
              max="128"
              step="1"
              value={config.phosphor.trailLength}
              onChange={(event) =>
                onConfigChange({
                  phosphor: { ...config.phosphor, trailLength: Number(event.target.value) },
                })
              }
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-mono text-xs uppercase tracking-[0.18em] text-emerald-300/70">Bloom</span>
            <input
              className="w-full"
              type="range"
              min="0"
              max="1.5"
              step="0.05"
              value={config.phosphor.bloom}
              onChange={(event) =>
                onConfigChange({
                  phosphor: { ...config.phosphor, bloom: Number(event.target.value) },
                })
              }
            />
          </label>
        </div>
      </div>
    </aside>
  );
}
```

- [ ] **Step 5: Add the client owner and home-page link**

```tsx
"use client";

import {
  createOscilloscope,
  getOscilloscopeSupport,
  OSCILLOSCOPE_PRESETS,
  type OscilloscopeConfig,
} from "@kkb/audio/oscilloscope";
import { useEffect, useMemo, useRef, useState } from "react";

import { OscilloscopeShell } from "./oscilloscope-shell";

type OscilloscopeClientProps = {
  createScope?: typeof createOscilloscope;
};

const mergeConfig = (current: OscilloscopeConfig, next: Partial<OscilloscopeConfig>): OscilloscopeConfig => ({
  ...current,
  ...next,
  canvas: { ...current.canvas, ...next.canvas },
  phosphor: { ...current.phosphor, ...next.phosphor },
  source: {
    ...current.source,
    ...next.source,
    a: { ...current.source.a, ...next.source?.a },
    b: { ...current.source.b, ...next.source?.b },
  },
});

export function OscilloscopeClient({ createScope = createOscilloscope }: OscilloscopeClientProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scopeRef = useRef<ReturnType<typeof createOscilloscope> | null>(null);
  const baseSupport = useMemo(() => getOscilloscopeSupport(), []);
  const [support, setSupport] = useState(baseSupport);
  const [config, setConfig] = useState<OscilloscopeConfig>(OSCILLOSCOPE_PRESETS[0].config);

  useEffect(() => {
    if (!support.supported || !canvasRef.current) {
      return;
    }

    const scope = createScope(canvasRef.current, config);
    let destroyed = false;
    const destroyScope = () => {
      if (destroyed) {
        return;
      }

      destroyed = true;
      scope.destroy();
      if (scopeRef.current === scope) {
        scopeRef.current = null;
      }
    };

    scopeRef.current = scope;
    scope.start().catch((error) => {
      if (destroyed) {
        return;
      }

      console.error("[oscilloscope] start failed", error);
      setSupport({
        reason: error instanceof Error ? `Unable to start WebGPU renderer: ${error.message}` : "Unable to start WebGPU renderer in this browser.",
        supported: false,
      });
      destroyScope();
    });

    return () => {
      destroyScope();
    };
  }, [createScope, support.supported]);

  useEffect(() => {
    scopeRef.current?.updateConfig(config);
  }, [config]);

  return (
    <OscilloscopeShell
      canvasRef={canvasRef}
      config={config}
      micError={null}
      micStatus="idle"
      onConfigChange={(next) => setConfig((current) => mergeConfig(current, next))}
      onPresetChange={(presetId) => {
        const preset = OSCILLOSCOPE_PRESETS.find((item) => item.id === presetId);
        if (preset) {
          setConfig(preset.config);
        }
      }}
      onSourceChange={(source) =>
        setConfig((current) => ({
          ...current,
          source: { ...current.source, type: source },
        }))
      }
      support={support}
    />
  );
}
```

```tsx
<Link
  href="/oscilloscope"
  className="font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
>
  oscilloscope
</Link>
```

- [ ] **Step 6: Run focused verification**

Run: `bun test apps/web/components/oscilloscope/__tests__/oscilloscope-client.test.tsx apps/web/app/oscilloscope/__tests__/page.test.tsx`
Expected: PASS

Run: `bun run check-types -- --filter=@kkb/web`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add apps/web/app/oscilloscope apps/web/components/oscilloscope apps/web/app/page.tsx
git commit -m "feat: add oscilloscope web demo shell"
```

### Task 7: Add host-owned mic setup and wire the client source switch

**Files:**
- Create: `apps/web/lib/oscilloscope/create-mic-provider.ts`
- Create: `apps/web/lib/oscilloscope/__tests__/create-mic-provider.test.ts`
- Modify: `apps/web/components/oscilloscope/oscilloscope-client.tsx`

- [ ] **Step 1: Write the failing mic provider test**

```ts
import { describe, expect, test } from "bun:test";

import { createMicProvider } from "../create-mic-provider";

describe("createMicProvider", () => {
  test("requests a stream, builds analysers, and returns a teardown handle", async () => {
    let stopped = 0;
    const stream = {
      getTracks: () => [
        {
          stop: () => {
            stopped += 1;
          },
        },
      ],
    };

    const analyser = () => ({
      fftSize: 1024,
      frequencyBinCount: 512,
      smoothingTimeConstant: 0.5,
      getFloatFrequencyData: (_target: Float32Array) => {},
      getFloatTimeDomainData: (_target: Float32Array) => {},
      disconnect: () => {},
    });

    const audioContext = {
      sampleRate: 48_000,
      close: async () => {},
      createAnalyser: analyser,
      createChannelSplitter: () => ({ connect: () => {}, disconnect: () => {} }),
      createMediaStreamSource: () => ({ connect: () => {}, disconnect: () => {} }),
    };

    const result = await createMicProvider({
      createAudioContext: () => audioContext as unknown as AudioContext,
      getUserMedia: async () => stream as unknown as MediaStream,
    });

    expect(result.provider.channelCount).toBe(2);
    await result.destroy();
    expect(stopped).toBe(1);
  });
});
```

- [ ] **Step 2: Run the focused test to confirm it fails**

Run: `bun test apps/web/lib/oscilloscope/__tests__/create-mic-provider.test.ts`
Expected: FAIL with module-not-found errors for `../create-mic-provider`

- [ ] **Step 3: Implement the host mic provider factory**

```ts
import { createAnalyserSignalProvider } from "@kkb/audio/oscilloscope/signal/analyser-source";

export const createMicProvider = async ({
  createAudioContext = () => new AudioContext(),
  getUserMedia = (constraints: MediaStreamConstraints) =>
    navigator.mediaDevices.getUserMedia(constraints),
}: {
  createAudioContext?: () => AudioContext;
  getUserMedia?: (constraints: MediaStreamConstraints) => Promise<MediaStream>;
}) => {
  const stream = await getUserMedia({
    audio: {
      autoGainControl: false,
      channelCount: 2,
      echoCancellation: false,
      noiseSuppression: false,
    },
  });

  const audioContext = createAudioContext();
  const source = audioContext.createMediaStreamSource(stream);
  const splitter = audioContext.createChannelSplitter(2);
  const left = audioContext.createAnalyser();
  const right = audioContext.createAnalyser();

  left.fftSize = 1024;
  left.smoothingTimeConstant = 0.45;
  right.fftSize = 1024;
  right.smoothingTimeConstant = 0.45;

  source.connect(splitter);
  splitter.connect(left, 0);
  splitter.connect(right, 1);

  return {
    destroy: async () => {
      source.disconnect();
      splitter.disconnect();
      left.disconnect();
      right.disconnect();
      stream.getTracks().forEach((track) => track.stop());
      await audioContext.close();
    },
    provider: createAnalyserSignalProvider({
      left,
      right,
      sampleRate: audioContext.sampleRate,
    }),
  };
};
```

- [ ] **Step 4: Wire the source switch in the client component**

```tsx
import { createMicProvider } from "@/lib/oscilloscope/create-mic-provider";

const micRuntimeRef = useRef<null | { destroy(): Promise<void> }>(null);
const scopeRef = useRef<ReturnType<typeof createOscilloscope> | null>(null);
const [micError, setMicError] = useState<string | null>(null);
const [micStatus, setMicStatus] = useState<"idle" | "requesting" | "ready" | "error">("idle");

useEffect(() => {
  if (!support.supported || !canvasRef.current) {
    return;
  }

  const scope = createScope(canvasRef.current, config);
  let destroyed = false;
  const destroyScope = () => {
    if (destroyed) {
      return;
    }

    destroyed = true;
    const runtime = micRuntimeRef.current;
    micRuntimeRef.current = null;
    scope.destroy();
    if (scopeRef.current === scope) {
      scopeRef.current = null;
    }
    runtime?.destroy().catch((error) => {
      console.error("[oscilloscope] mic destroy failed", error);
    });
  };

  scopeRef.current = scope;
  scope.start().catch((error) => {
    if (destroyed) {
      return;
    }

    console.error("[oscilloscope] start failed", error);
    setSupport({
      reason: error instanceof Error ? `Unable to start WebGPU renderer: ${error.message}` : "Unable to start WebGPU renderer in this browser.",
      supported: false,
    });
    destroyScope();
  });

  return () => {
    destroyScope();
  };
}, [createScope, support.supported]);

useEffect(() => {
  scopeRef.current?.updateConfig(config);
}, [config]);

useEffect(() => {
  const scope = scopeRef.current;
  if (!scope) {
    return;
  }

  if (config.source.type !== "mic") {
    const runtime = micRuntimeRef.current;
    micRuntimeRef.current = null;
    scope.setSignalProvider(null);
    setMicError(null);
    setMicStatus("idle");
    runtime?.destroy().catch((error) => {
      console.error("[oscilloscope] mic destroy failed", error);
    });
    return;
  }

  let cancelled = false;
  setMicError(null);
  setMicStatus("requesting");

  createMicProvider()
    .then((runtime) => {
      if (cancelled) {
        runtime.destroy().catch(() => {});
        return;
      }

      const previousRuntime = micRuntimeRef.current;
      micRuntimeRef.current = runtime;
      previousRuntime?.destroy().catch(() => {});
      scope.setSignalProvider(runtime.provider);
      setMicStatus("ready");
    })
    .catch((error: unknown) => {
      if (cancelled) {
        return;
      }

      scope.setSignalProvider(null);
      setMicError(error instanceof Error ? error.message : "Unable to access microphone.");
      setMicStatus("error");
    });

  return () => {
    cancelled = true;
  };
}, [config.source.type]);
```

Also extend `oscilloscope-client.test.tsx` to switch `oscillators → mic → oscillators` and assert the same scope instance survives while the mic cleanup path restores the internal provider via `scope.setSignalProvider(null)`.

Also add a stale-rejection test that switches away from mic before `createMicProvider()` rejects and verifies the cancelled request does not overwrite the oscillator UI with `micStatus="error"`.

- [ ] **Step 5: Run focused verification**

Run: `bun test apps/web/lib/oscilloscope/__tests__/create-mic-provider.test.ts apps/web/components/oscilloscope/__tests__/oscilloscope-client.test.tsx`
Expected: PASS

Run: `bun run check-types -- --filter=@kkb/web --filter=@kkb/audio`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add apps/web/lib/oscilloscope apps/web/components/oscilloscope/oscilloscope-client.tsx
git commit -m "feat: add oscilloscope mic input"
```

### Task 8: Run full verification and do the manual smoke pass

**Files:**
- Modify: no new code
- Verify: `packages/audio`, `apps/web`

- [ ] **Step 1: Run the audio workspace tests**

Run: `bun run test -- --filter=@kkb/audio`
Expected: PASS

- [ ] **Step 2: Run the web workspace tests**

Run: `bun run test -- --filter=@kkb/web`
Expected: PASS

- [ ] **Step 3: Run the impacted type checks**

Run: `bun run check-types -- --filter=@kkb/audio --filter=@kkb/web`
Expected: PASS

- [ ] **Step 4: Run formatting and linting**

Run: `bun run format-and-lint`
Expected: PASS

- [ ] **Step 5: Run the app locally and do the smoke checklist**

Run: `turbo run dev --filter=@kkb/web`

Manual checklist:
- Open `http://localhost:3000/oscilloscope`
- Confirm the page loads with a square canvas and visible controls
- Confirm `Circle`, `Figure Eight`, `Lissajous 3:2`, and `Breathing Detune` all change the figure
- Confirm unsupported browsers show `WebGPU is not available in this browser.`
- Confirm switching to `Mic` prompts for permission
- Confirm denying permission shows a readable error state
- Confirm allowing permission switches the banner to `Mic input active`
- Confirm navigating away tears down the route without console errors

- [ ] **Step 6: Commit the verified V1**

```bash
git add -A
git commit -m "feat: ship browser oscilloscope v1"
```

---

## Notes For The Implementer

- Keep `track playback` out of this branch even if it feels close. The current player path is still media-element-first and should not be entangled with the oscilloscope V1 ship.
- If the WebGPU pipeline is noisier than expected, keep the ping-pong history path and simplify only the composite math. Do not replace the renderer with Canvas2D.
- If the mic effect in mono is underwhelming, ship it anyway with honest UX copy. Do not widen scope into decorrelation transforms in this branch.
- Keep `renderer.resize(...)` idempotent inside the renderer/runtime layer. It should compare the backing canvas size and only destroy/recreate the history textures when width or height actually changes, never on every animation frame.

## Success Criteria Recap

- `/oscilloscope` exists in `apps/web`
- internal oscillator presets render in supported WebGPU browsers
- mic input works through host-managed analysers
- unsupported browsers show a deliberate fallback message
- `@kkb/audio` stays headless and reusable
- no track-player graph work is pulled into the initial branch

Plan complete and saved to `docs/plans/2026-04-02-browser-oscilloscope-v1.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
