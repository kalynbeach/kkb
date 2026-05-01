# Audio Runtime Adapter Architecture

**Date:** 2026-04-30  
**Status:** Preferred architecture direction  
**Scope:** Ground-up architecture for reusable audio playback, visualization, React adapters, and the `@kkb/web` demo app

## Summary

The preferred architecture is **two runtimes, framework-agnostic session/controllers, and thin adapters**:

```text
playback runtime
playback session/controller
visualization runtime
visualization browser providers/controllers
React lifecycle adapters
presentation UI
demo app
```

This keeps the architecture deep where behavior is complex, and shallow where code should only adapt or present state. React hooks should subscribe to and dispose framework-agnostic objects; they should not become the place where transport, source, selection, cancellation, mic graph, or renderer state machines live.

The target is not to split packages first. The target is to define stable runtime/session/resource module boundaries first, then let package boundaries follow once imports and tests prove the shape.

## Adoption Note

This report intentionally revises the current ownership model in `AGENTS.md`, which says `apps/web` owns browser/session orchestration and mic access. If this direction is adopted, the durable repo guidance should be updated to say:

- `apps/web` owns demo orchestration: routes, layouts, copy, fixtures, URL/hash/query state, and integration examples.
- `packages/audio` owns reusable browser audio orchestration: playback source selection, transport semantics, reusable session controllers, visualization lifecycle, mic graph setup, analysis taps, and renderer/runtime resource management.
- React modules in `packages/audio` own lifecycle/subscription adapters only.
- `packages/ui` remains presentation-only.

Until that guidance is updated, this report should be treated as a proposed architecture pivot rather than an implementation mandate.

## Architecture Principles

1. Deep runtime modules own low-level audio behavior.
2. Framework-agnostic session/controllers own reusable state machines, command ordering, cancellation, and resource disposal.
3. React modules own lifecycle and subscriptions only.
4. UI modules are dumb presentation.
5. Demo app owns routes, copy, fixtures, and URL decisions.
6. Playback and visualization remain independent products.
7. Package splits happen after stable module interfaces exist.
8. Avoid generalized plugin systems, broad core packages, and prebuilt UI products until real pressure appears.
9. Browser APIs must be lazy: no `window`, `Audio`, `navigator`, WebGPU, DOM, or media element access at module import time.

## Preferred Module Shape

```text
audio/
  core/
    disposable.ts
    observable.ts
    errors.ts
    timeline.ts

  playback/
    create-playback-runtime.ts
    create-playback-session.ts
    command-queue.ts
    sources/
      media-element-source.ts
      fallback-source.ts
      webcodecs-source.ts
      worklet-source.ts
    analysis/
      playback-analysis-tap.ts

  visualization/
    create-visualization-runtime.ts
    create-oscilloscope-session.ts
    browser/
      create-mic-signal-provider.ts
      audio-context-owner.ts
    signal/
      oscillator-provider.ts
      analyser-provider.ts
      playback-analysis-provider.ts
    renderer/
      webgpu-renderer.ts
    oscilloscope/
      xy-mode.ts
      presets.ts
      config.ts

  react/
    playback/
      use-playback-runtime.ts
      use-playback-session.ts
    visualization/
      use-oscilloscope-session.ts
```

This shape can live inside the current `packages/audio` package while interfaces stabilize. Physical package splits are optional later.

## Runtime Public APIs

### Playback

The playback runtime should be framework-agnostic and usable from any browser app.

```ts
const runtime = createPlaybackRuntime({
  sources: createBrowserPlaybackSources(),
});

await runtime.load(asset);
await runtime.play();
await runtime.pause();
await runtime.seek(42);
runtime.subscribe(listener);
await runtime.destroy();
```

It owns:

- source construction defaults
- source selection
- load-time fallback
- transport state
- timeline state
- buffered range normalization
- load/play/pause/seek semantics
- optional analysis tap

It should not promise mid-playback recovery unless that behavior is explicitly designed, tested, and represented in the error model. Load-time fallback and runtime recovery are separate features.

Callers should not know which source is active unless the runtime exposes it as diagnostic state.

### Playback Session / Controller

The playback session is framework-agnostic and sits above the runtime.

```ts
const session = createPlaybackSession({
  assets,
  createRuntime,
});

await session.selectAsset(assetId);
await session.play();
await session.pause();
session.subscribe(listener);
await session.destroy();
```

It owns reusable app-like playback behavior:

- selected asset state
- asset loading state
- command serialization
- stale async cancellation
- derived session view model
- user-facing playback state transitions
- runtime creation and replacement policy
- runtime disposal policy

It does not own:

- React lifecycle
- demo catalog contents
- URL/hash/query state
- page layout or copy

The React hook should wrap this controller; it should not be the controller.

### Visualization

The visualization runtime should also be framework-agnostic.

```ts
const scope = await createVisualizationRuntime(canvas, config);

scope.setSignalProvider(provider);
scope.updateConfig(nextConfig);
scope.start();
scope.stop();
scope.destroy();
```

It owns:

- signal provider contract
- oscillator provider
- analyser provider
- playback-analysis provider
- XY frame generation
- renderer lifecycle
- WebGPU renderer
- WebGPU support, adapter/device loss, and renderer startup failure semantics
- config defaults and validation

It should not know playback internals.

### Visualization Browser Providers / Controllers

Reusable browser source setup belongs in framework-agnostic visualization modules, not React hooks.

```ts
const micProvider = await createMicSignalProvider({
  audioContext,
  constraints,
});

scope.setSignalProvider(micProvider);
```

These modules own reusable browser audio graph behavior such as mic setup, analyser nodes, media stream teardown, audio context ownership policy, and normalization. React owns only when to create, subscribe, swap, and dispose them.

## Playback To Visualization Integration

Playback must not import visualization.

Preferred seam:

```text
playback runtime
  exposes analysis tap

visualization
  adapts analysis tap into signal provider

consumer/session layer
  composes them
```

This supports track playback visualization without coupling the playback product to the oscilloscope product.

The seam must specify:

- sample rate
- clock source and timestamp semantics
- channel count and channel layout
- buffer ownership and allocation policy
- latency expectations
- behavior when the active playback source cannot expose analysis
- teardown behavior when playback source changes

The visualization runtime should consume a signal-provider abstraction, not playback runtime internals.

## React Adapter Design

React code should be thin lifecycle code over the framework-agnostic runtimes.

### Playback React

```ts
const session = usePlaybackSession({
  assets,
  createRuntime,
});
```

Owns:

- session/controller creation and teardown
- `useSyncExternalStore` subscription
- forwarding user commands to the session/controller

The framework-agnostic playback session/controller owns:

- selected asset/session state
- stale async cancellation
- derived view model

Does not own:

- source internals
- timeline polling internals
- UI rendering
- demo catalog content

### Visualization React

```ts
const scope = useOscilloscopeSession({
  canvasRef,
  initialConfig,
  createRuntime,
  createSignalProvider,
});
```

Owns:

- canvas/runtime/session lifecycle
- `useSyncExternalStore` subscription where needed
- forwarding user commands to the visualization session/controller

The framework-agnostic visualization runtime/session owns:

- renderer startup failure handling
- mic/source switching lifecycle
- stale async source request cancellation
- subscription/state adapter for UI

Does not own:

- hardcoded demo query params
- hardcoded hash persistence
- page copy
- page layout

## Mic Provider

Reusable mic graph setup belongs with framework-agnostic visualization browser modules, not React-specific adapters.

It should own:

- `getUserMedia`
- `AudioContext` creation or explicit reuse policy
- `MediaStreamAudioSourceNode`
- analyser setup
- stereo/mono normalization
- stream track teardown
- context close or release policy
- permission denial and device-change error reporting

Demo-only behavior stays outside:

- `?mic=fake-mono`
- `?mic=fake-stereo`
- local smoke-test URL conventions

Those can be injected as test/demo signal providers.

## UI Package Boundary

`@kkb/ui` should remain presentation-only.

Good fit:

- player controls
- playhead
- waveform surface
- badges/status presentation
- layout primitives

Avoid for now:

- full audio player product
- runtime/session ownership
- catalog ownership
- URL persistence

Audio-specific presentation can stay in `@kkb/ui` unless there is strong product pressure for a complete audio UI package.

## Demo App Boundary

`@kkb/web` should become a consumer.

It owns:

- Next.js routes
- demo page layout
- page copy
- fixture catalog
- demo defaults
- demo URL/hash/query decisions
- integration examples
- deployment concerns

It should not own:

- playback runtime creation details
- source construction details
- transport state
- buffered range normalization
- player session state machine
- oscilloscope runtime lifecycle
- mic cancellation races
- renderer lifecycle

## Runtime Contracts To Define Before Implementation

Before moving behavior out of `apps/web`, define these contracts in code comments, types, and tests:

- Command model: how `load`, `play`, `pause`, `seek`, source switches, and `destroy` serialize or cancel each other.
- Disposal model: whether `destroy` is async, idempotent, and allowed while commands are pending.
- Error model: typed errors for unsupported source, decode failure, autoplay rejection, permission denial, WebGPU/device loss, CORS/fetch failure, and unexpected runtime faults.
- Diagnostic model: source selection, fallback reason, renderer backend, browser capability decisions, and analysis support.
- Browser resource ownership: `AudioContext`, media elements, worklet module URLs, WebCodecs objects, media streams, animation frames, and GPU devices.
- Autoplay/user gesture policy: which commands can reject and how sessions surface the rejection.
- Import safety: all browser access must happen inside constructors/functions called in the browser, not at module import time.
- Analysis contract: sample rate, clock, channels, buffer ownership, latency, allocation policy, and unsupported-source behavior.

## What Not To Build Yet

- No physical package split first.
- No `audio-core` package until duplication proves it.
- No context/provider layer unless multiple distant components need the same session.
- No prebuilt complete player UI package.
- No generalized plugin system.
- No premature WebCodecs abstraction beyond one source adapter.
- No mid-playback recovery API until the semantics are specified and tested.
- No app-specific URL persistence inside audio packages.

## Package Strategy

Start with module boundaries inside `packages/audio`.

Potential later packages:

```text
@kkb/audio-player
@kkb/audio-visualization
@kkb/audio-react
@kkb/audio-visualization-react
@kkb/audio-core
```

Only create `@kkb/audio-core` after at least two packages share real invariants, not just types.

## Implementation Order

1. Adopt this ownership pivot explicitly by updating durable repo guidance after review.
2. Define runtime contracts for commands, disposal, errors, diagnostics, resources, import safety, and analysis taps.
3. Rename/deepen `createWebPlayer` into `createPlaybackRuntime` only after the command/disposal contracts are clear.
4. Move player controller behavior into a framework-agnostic playback session.
5. Add `usePlaybackSession` as a thin React adapter over that session.
6. Extract oscilloscope lifecycle from `OscilloscopeClient` into a framework-agnostic visualization session/runtime.
7. Move reusable mic graph setup behind an injectable framework-agnostic visualization signal provider.
8. Define playback analysis tap and visualization signal-provider adapter.
9. Add stable package entrypoints.
10. Split packages only after imports prove the dependency direction.

## Success Criteria

- `@kkb/web` reads like an integration demo.
- Playback behavior is testable without React.
- Playback session/controller behavior is testable without React.
- Visualization behavior is testable without React.
- Mic graph setup is reusable without React.
- React tests focus on lifecycle and adapter behavior.
- UI tests focus on presentation.
- Playback visualization works through an analysis-tap seam.
- No package exists only to hold shallow types.

## Relationship To Prior Vision

This refines `docs/reports/2026-04-29-audio-package-architecture-vision.md`.

It is also intended to supersede the current README and implementation-reference ownership model once this direction is adopted.

The previous report correctly moved ownership toward reusable audio packages. This report tightens the design:

- prioritize module depth over package count
- treat playback and visualization as the two core products
- keep React thin
- keep UI presentation-only
- delay `audio-core`
- avoid unnecessary package and provider complexity
