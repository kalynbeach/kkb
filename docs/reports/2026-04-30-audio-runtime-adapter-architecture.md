# Audio Runtime Adapter Architecture

**Date:** 2026-04-30  
**Status:** Preferred architecture direction  
**Scope:** Ground-up architecture for reusable audio playback, visualization, React adapters, and the `@kkb/web` demo app

## Summary

The preferred architecture is **two runtimes plus thin adapters**:

```text
playback runtime
visualization runtime
React lifecycle adapters
presentation UI
demo app
```

This keeps the architecture deep where behavior is complex, and shallow where code should only adapt or present state.

The target is not to split packages first. The target is to define stable runtime/session module boundaries first, then let package boundaries follow once imports and tests prove the shape.

## Architecture Principles

1. Deep runtime modules own audio behavior.
2. React modules own lifecycle and subscriptions only.
3. UI modules are dumb presentation.
4. Demo app owns routes, copy, fixtures, and URL decisions.
5. Playback and visualization remain independent products.
6. Package splits happen after stable module interfaces exist.
7. Avoid generalized plugin systems, broad core packages, and prebuilt UI products until real pressure appears.

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
    sources/
      media-element-source.ts
      fallback-source.ts
      webcodecs-source.ts
      worklet-source.ts
    analysis/
      playback-analysis-tap.ts

  visualization/
    create-visualization-runtime.ts
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
      use-mic-provider.ts
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
runtime.destroy();
```

It owns:

- source construction defaults
- source selection
- fallback and recovery
- transport state
- timeline state
- buffered range normalization
- load/play/pause/seek semantics
- optional analysis tap

Callers should not know which source is active unless the runtime exposes it as diagnostic state.

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
- config defaults and validation

It should not know playback internals.

## Playback To Visualization Integration

Playback must not import visualization.

Preferred seam:

```text
playback runtime
  exposes analysis tap

visualization
  adapts analysis tap into signal provider

consumer
  composes them
```

This supports track playback visualization without coupling the playback product to the oscilloscope product.

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

- runtime creation and teardown
- `useSyncExternalStore` subscription
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

- canvas/runtime lifecycle
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

Reusable mic graph setup belongs with visualization adapters.

It should own:

- `getUserMedia`
- `AudioContext`
- `MediaStreamAudioSourceNode`
- analyser setup
- stereo/mono normalization
- stream track teardown
- context close

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

## What Not To Build Yet

- No physical package split first.
- No `audio-core` package until duplication proves it.
- No context/provider layer unless multiple distant components need the same session.
- No prebuilt complete player UI package.
- No generalized plugin system.
- No premature WebCodecs abstraction beyond one source adapter.
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

1. Rename/deepen `createWebPlayer` into `createPlaybackRuntime`.
2. Move player controller behavior into a headless playback session.
3. Add `usePlaybackSession` as a thin React adapter.
4. Extract oscilloscope lifecycle from `OscilloscopeClient` into `useOscilloscopeSession`.
5. Move reusable mic graph setup behind an injectable visualization signal provider.
6. Define playback analysis tap and visualization signal-provider adapter.
7. Add stable package entrypoints.
8. Split packages only after imports prove the dependency direction.

## Success Criteria

- `@kkb/web` reads like an integration demo.
- Playback behavior is testable without React.
- Visualization behavior is testable without React.
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
