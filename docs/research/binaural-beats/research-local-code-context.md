# Code Context

## Files Retrieved
1. `docs/research/2026-04-23-web-audio-tech-2026.md` (lines 5-35, 45-63, 67-128, 150-172, 738-760) - current local research guidance for modern Web Audio architecture.
2. `packages/audio/src/oscilloscope/types.ts` (lines 1-64) - existing oscillator config/types for two-channel signal generation.
3. `packages/audio/src/oscilloscope/signal/oscillator-source.ts` (lines 1-105) - deterministic two-channel oscillator sample provider used for oscilloscope visualization, not audible output.
4. `packages/audio/src/contracts/types.ts` (lines 1-24) - audio source capability and COOP/COEP context model.
5. `packages/audio/src/sources/audio-source.ts` (lines 1-35) - source lifecycle contract used by the player engine.
6. `packages/audio/src/sources/worklet-pcm-source.ts` (lines 1-50) - placeholder Worklet PCM `AudioSource` with command transport but no DSP/output pipeline.
7. `packages/audio/src/worklet/register-worklet.ts` (lines 1-9) - minimal AudioWorklet module registration helper.
8. `packages/audio/src/worklet/sab-ring-buffer.ts` (lines 1-4) - minimal SAB allocation helper; no Atomics/read-write protocol yet.
9. `apps/web/public/worklets/kkb-audio-processor.js` (lines 1-7) - stub AudioWorkletProcessor that returns true and outputs no audio.
10. `apps/web/lib/audio/create-web-player.ts` (lines 1-122) - host integration point wiring fallback/media/worklet/webcodecs sources into `AudioEngine`.
11. `apps/web/components/audio/player-client.tsx` (lines 1-145) - React client owner for web player/controller lifecycle and UI callbacks.
12. `packages/ui/src/components/audio/player-controls.tsx` (lines 1-135) - reusable playback controls: play/pause/rate/volume only.
13. `packages/ui/src/components/audio/waveform.tsx` (lines 1-170) - static-bar waveform/seek surface; no generated-tone visualization.
14. Tests inspected: `packages/audio/src/sources/__tests__/worklet-pcm-source.test.ts`, `packages/audio/src/worklet/__tests__/sab-ring-buffer.test.ts`, `apps/web/lib/audio/__tests__/create-web-player.test.ts` - existing unit coverage around source facades and stubs.

## Key Code

Research constraints from `docs/research/2026-04-23-web-audio-tech-2026.md`:

- Modern path is `React / editor UI` + Workers + SAB/ring buffers feeding `AudioWorkletProcessor`, with DSP isolated from UI (lines 5-35).
- Use `AudioContext.currentTime` as the stable timeline and prefer `AudioParam` automation for musical controls (lines 48-55).
- AudioWorklet render quantum is historically 128 frames; avoid assuming it is permanently fixed (lines 60-63).
- Worklet `process()` should preallocate, avoid per-block object churn, avoid fast `postMessage()` automation, and treat render code as real-time critical (lines 107-128).
- SAB requires secure context/cross-origin isolation; likely headers are COOP `same-origin` and COEP `require-corp` (lines 162-170).

Existing oscillator model:

```ts
// packages/audio/src/oscilloscope/types.ts:11-17
export type OscillatorConfig = {
  amplitude: number;
  detuneCents: number;
  frequency: number;
  phase: number;
  waveform: OscilloscopeWaveform;
};
```

`createOscillatorSignalProvider` builds left/right `Float32Array` buffers from `config.a` and `config.b` using sine/square/saw/triangle sampling, detune, phase, amplitude, and an injected clock/sampleRate (`packages/audio/src/oscilloscope/signal/oscillator-source.ts:43-105`). This is useful for tests/math and visualization but is not connected to an audible Web Audio graph.

Player/source contract:

```ts
// packages/audio/src/sources/audio-source.ts:21-35
// Sources follow a strict lifecycle: canPlay -> load -> runtime controls -> destroy.
export type AudioSource = { ... play(); pause(); seek(); setRate(); setVolume(); ... };
```

`createWorkletPCMSource` currently advertises sample-accurate/gapless capabilities and forwards play/pause/seek to a simple transport (`packages/audio/src/sources/worklet-pcm-source.ts:14-49`). It does not register a real worklet, construct `AudioContext`, expose `AudioParam`s, generate samples, or connect output.

`apps/web/lib/audio/create-web-player.ts:50-82` is the web host seam. It creates media/fallback/worklet/webcodecs sources; the worklet source is disabled unless `enableWorkletPCM` is passed and has a no-op `postMessage` transport (`lines 56-60`).

## Architecture

- Ownership boundary is clear: `apps/web` owns browser/session orchestration and React lifecycle; `packages/audio` owns headless runtime/contracts/sources/oscilloscope signal providers; `packages/ui` owns presentation-only controls.
- There are two separate audio-adjacent flows today:
  - `/audio` player flow: `PlayerClient` -> `createPlayerController` -> `createWebPlayer` -> `AudioEngine` -> selected `AudioSource`.
  - oscilloscope signal flow: `OscilloscopeConfig` -> `createOscillatorSignalProvider`/analyser provider -> WebGPU oscilloscope runtime. It generates visual sample buffers only.
- Binaural beats/brainwave entrainment would likely need a new audible synthesis source or route rather than reusing the visual-only oscillator provider directly. The provider math can inform parameter names and deterministic tests.
- `packages/ui` has existing audio controls for transport/rate/volume and a static waveform. It has no reusable tone/entrainment parameter controls (carrier Hz, beat Hz, duration, ramp/envelope, channel balance, safety/volume warnings).
- No app headers or host config for COOP/COEP were found in `apps`; docs explicitly call this out as required before SAB production use.

## Existing Patterns / Constraints / Tests

- Strict TS contracts; avoid `any` and keep browser host details out of `packages/audio` unless abstracted.
- Source lifecycle is `canPlay -> load -> runtime controls -> destroy`.
- Tests use `bun:test` and dependency injection/stubs for browser-like APIs.
- Relevant existing tests:
  - `packages/audio/src/oscilloscope/signal/__tests__/oscillator-source.test.ts` covers deterministic independent channel sample buffers.
  - `packages/audio/src/sources/__tests__/worklet-pcm-source.test.ts` covers command forwarding and facade behavior.
  - `packages/audio/src/worklet/__tests__/sab-ring-buffer.test.ts` only verifies allocation.
  - `apps/web/lib/audio/__tests__/create-web-player.test.ts` verifies source wiring and worklet source opt-in behavior.
- Current worklet asset is a no-op processor. Any entrainment implementation using AudioWorklet will need real processor code plus registration and node creation in the web host.
- AudioParam automation is preferred over frequent messages for frequency/gain changes.

## Likely Affected Files

- `packages/audio/src/sources/*` - add a synthesis/entrainment `AudioSource` or extend worklet source contract.
- `packages/audio/src/worklet/*` - implement real processor registration/transport helpers; possibly add non-SAB and SAB tiers later.
- `apps/web/public/worklets/kkb-audio-processor.js` or a new specific processor asset - audible stereo oscillator/beat generation.
- `apps/web/lib/audio/create-web-player.ts` - wire the new source/transport and host `AudioContext` creation.
- `apps/web/components/audio/*` or a new app route/component - host controls for entrainment parameters and lifecycle.
- `packages/ui/src/components/audio/*` - only if controls should be reusable; otherwise keep feature-specific UI in `apps/web` built from `@kkb/ui` primitives.
- Tests near `packages/audio/src/sources/__tests__`, `packages/audio/src/worklet/__tests__`, and `apps/web/lib/audio/__tests__`.

## Confidence Level

High for current repository structure, ownership boundaries, existing Web Audio/worklet stubs, and UI/player seams. Medium for exact implementation path because the requested feature shape is not specified: standalone tone generator route vs integrated `AudioSource` in the existing player vs oscilloscope-linked demo.

## Gaps / Open Questions

- No existing audible oscillator or binaural beat generator.
- No real AudioWorklet output pipeline; no AudioParam descriptors; no `AudioContext` ownership for synth output.
- No COOP/COEP config in `apps`, so SAB/wasm-thread paths are not ready by default.
- No safety/product requirements: allowed frequency ranges, max gain, fade in/out, session duration, medical disclaimer, accessibility defaults.
- Need decision whether initial implementation should be raw Web Audio nodes (`OscillatorNode` + `ChannelMergerNode` + `GainNode`) for simple binaural beats, or AudioWorklet for future DSP extensibility. Research favors AudioWorklet for custom DSP, but built-in nodes may be simpler and sample-accurate enough for two sine oscillators.

## Start Here

Open `docs/research/2026-04-23-web-audio-tech-2026.md` first for architecture constraints, then `apps/web/lib/audio/create-web-player.ts` to see the host integration seam. If building a standalone entrainment demo, start with a new host-owned app route/component and keep DSP/control abstractions in `packages/audio` only after the reusable contract is clear.

## Recommended Next Step

Define the first slice: a minimal safe binaural beat generator with carrier frequency, beat frequency, volume, play/stop, and fade envelope. Prefer a host-owned prototype using built-in Web Audio nodes first unless the requirement explicitly needs custom DSP; add deterministic math/unit tests in `packages/audio` if extracting a reusable entrainment engine.
