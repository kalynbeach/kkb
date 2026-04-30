# Audio Package Architecture Vision

**Date:** 2026-04-29  
**Status:** Architecture discussion notes  
**Scope:** Future package architecture for reusable audio modules and the `@kkb/web` demo app

## Context

The current repo has audio behavior split between `packages/audio` and `apps/web`. Earlier architecture notes framed `apps/web` as the owner of browser/session orchestration, with `packages/audio` owning headless playback and oscilloscope runtime behavior.

The desired direction is different: the audio modules should become reusable npm-installable packages that can be used from any browser project, library, or React app. In that model, `@kkb/web` should be treated as a demo app, not as an integral owner of audio architecture.

## Revised ownership principle

```text
audio packages
  own reusable audio behavior and reusable browser/React integration

@kkb/web
  owns demo content, routes, copy, page layout, and deployment
```

This means deep audio/session modules should move out of `apps/web` and into publishable packages. Browser behavior is not automatically app-owned; for an npm audio library, reusable browser behavior is part of the product.

## Proposed package shape

### `@kkb/audio-core`

Small shared foundation package.

Owns:

- asset descriptors
- timeline and range types
- lifecycle/disposable primitives
- observable/store primitive, if needed
- normalized audio errors
- clock/scheduler abstractions, if shared by multiple packages

Constraints:

- Keep this package strict and small.
- Do not let it become a junk drawer.
- A type-only core package can be useful, but it has limited **depth** unless it captures real invariants shared by multiple audio packages.

### `@kkb/audio-player`

Framework-agnostic playback package.

Owns:

- playback runtime
- media element playback adapter
- source selection, fallback, and recovery
- timeline and buffered range normalization
- transport state
- load/play/pause/seek semantics
- playback analysis capability, if relevant

This package should be installable in any browser app without React.

Its public interface should be product-shaped, for example:

```text
createPlaybackRuntime(...)
runtime.load(asset)
runtime.play()
runtime.pause()
runtime.seek(time)
runtime.subscribe(...)
runtime.destroy()
```

Callers should not need to know:

- which playback adapter is active
- how fallback scoring works
- where buffered ranges are read from
- which browser resources exist internally
- how checkpoint/recovery behavior is implemented

### `@kkb/audio-visualization`

Framework-agnostic visualization package.

Owns:

- signal runtime
- oscillator signal provider
- analyser signal provider
- playback-analysis signal provider
- XY/frame generation
- oscilloscope renderer
- WebGPU renderer implementation
- visualization config validation/defaults

This package is browser-oriented, but not React-oriented.

The important seam is:

```text
playback runtime -> analysis tap -> signal provider -> visualization runtime -> oscilloscope renderer
```

That allows the audio player and oscilloscope to integrate without making visualization know playback internals.

### `@kkb/audio-react`

React adapters for playback.

Owns:

- `usePlaybackRuntime`
- `usePlaybackSession`
- optional provider/context modules, only if they add real **depth**
- React lifecycle handling
- observation cadence
- playback view-model derivation

This is where reusable versions of the current `player-controller`, `use-player-controller`, and much of `player-client` behavior should move if the behavior is not demo-specific.

### `@kkb/audio-visualization-react`

React adapters for oscilloscope and visualization.

Owns:

- `useOscilloscopeSession`
- renderer lifecycle integration
- source switching lifecycle
- generic mic permission lifecycle, if reusable enough
- stale async source request cancellation
- preset application
- optional URL/hash persistence adapter, if designed as configurable behavior rather than hardcoded demo behavior

This is where reusable parts of the current `oscilloscope-client.tsx` behavior should move.

## What remains in `@kkb/web`

`@kkb/web` should own demo-specific concerns only:

- Next.js routes
- page layout and copy
- demo catalog fixtures
- demo-specific URL shape
- demo-specific defaults
- integration examples
- deployment concerns

Example shape:

```text
apps/web/app/audio/page.tsx
  imports demo catalog
  renders page chrome
  passes assets/options to @kkb/audio-react

apps/web/app/oscilloscope/page.tsx
  renders demo page
  chooses initial config/presets
  passes options to @kkb/audio-visualization-react

apps/web/lib/audio/catalog/*
  demo fixtures only
```

`@kkb/web` should not own:

- playback runtime creation
- source construction
- transport state
- timeline polling
- buffered range normalization
- player controller logic
- oscilloscope runtime lifecycle
- mic cancellation races
- signal provider switching
- renderer lifecycle

## Browser concerns: reusable vs demo-specific

There are two categories of browser concerns.

### Reusable browser audio concerns

These belong in audio packages:

- `HTMLAudioElement`
- `AudioContext`
- `AnalyserNode`
- `MediaStream`
- WebGPU canvas rendering
- media permission lifecycle patterns
- source adapter fallback/recovery
- timeline/buffered normalization

### Demo app browser concerns

These stay in `@kkb/web`:

- Next.js route composition
- page copy
- demo catalog
- demo-specific hash/query params
- visual shell and layout
- deployment/runtime hosting

## React package strategy

Keep React separate from the framework-agnostic runtime packages:

```text
@kkb/audio-player                    framework-agnostic playback runtime
@kkb/audio-visualization             framework-agnostic signal/rendering runtime
@kkb/audio-react                     React playback bindings
@kkb/audio-visualization-react       React visualization bindings
```

This provides **leverage**:

- vanilla browser apps can use the runtimes
- React apps can use hooks/session adapters
- `@kkb/web` is just one consumer

It also improves **locality**:

- React lifecycle bugs live in React adapter packages
- audio behavior bugs live in runtime packages
- demo bugs live in `@kkb/web`

## Dependency direction

Preferred dependency graph:

```text
@kkb/audio-core
  ↑
  ├── @kkb/audio-player
  ├── @kkb/audio-visualization
  ├── @kkb/audio-react
  └── @kkb/audio-visualization-react

@kkb/audio-react
  -> @kkb/audio-player

@kkb/audio-visualization-react
  -> @kkb/audio-visualization
  -> optionally @kkb/audio-player types/capabilities through core-level seams

@kkb/web
  -> @kkb/audio-player
  -> @kkb/audio-visualization
  -> @kkb/audio-react
  -> @kkb/audio-visualization-react
  -> @kkb/ui
```

Avoid direct hard coupling like:

```text
@kkb/audio-player -> @kkb/audio-visualization
```

Prefer composition through app code or through shared core-level types/capabilities:

```text
@kkb/audio-player exposes analysis capability
@kkb/audio-visualization adapts analysis capability into a signal provider
consumer composes them
```

## Design warning

A package is an expensive **seam**. Splitting packages too early can freeze shallow interfaces.

Before physically splitting packages, first identify and deepen the modules that should become package interfaces:

```text
@kkb/audio-player
  createPlaybackRuntime()

@kkb/audio-react
  usePlaybackSession()

@kkb/audio-visualization
  createOscilloscopeRuntime()
  createSignalProvider()

@kkb/audio-visualization-react
  useOscilloscopeSession()
```

The package split should be the packaging consequence of stable deep modules, not the first architectural move.

## Likely end state

```text
@kkb/web
  demo routes
  demo catalog
  demo page layout
  integration examples

@kkb/ui
  generic presentation primitives
  optional reusable audio presentation surfaces

@kkb/audio-core
  shared primitives and invariants

@kkb/audio-player
  playback runtime

@kkb/audio-react
  playback hooks/session adapters

@kkb/audio-visualization
  signal and renderer runtime

@kkb/audio-visualization-react
  oscilloscope hooks/session adapters
```

## Open design questions

1. Should `@kkb/audio-core` exist immediately, or only after duplication appears between player and visualization packages?
2. Should React packages export only hooks, or also prebuilt headless/controller modules?
3. Should `@kkb/ui` keep audio presentation components, or should audio-specific UI move closer to `@kkb/audio-react`?
4. How much mic permission lifecycle is generic enough for `@kkb/audio-visualization-react` versus demo-specific?
5. Should URL/hash persistence be included as an optional React adapter or remain fully app-owned?
6. What is the minimal stable playback analysis capability that avoids coupling player and visualization packages?

## Recommendation

Move toward the package split, but sequence it carefully:

1. Design deep runtime and React-session module interfaces in the current codebase.
2. Move reusable browser and React audio behavior out of `@kkb/web`.
3. Keep demo-only content and route concerns in `@kkb/web`.
4. Split packages once the deep modules and dependency direction are proven by imports and tests.
