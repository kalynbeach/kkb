# Codebase Architecture Deepening Candidates

**Date:** 2026-04-23  
**Repo:** `kkb`  
**Status:** Updated after validation exploration  
**Purpose:** Capture module-deepening opportunities found during architecture exploration, validate them against the current monorepo, and recommend which candidate to explore next.

## Summary

This exploration surfaced several places where behavior is split across shallow modules, making concepts harder to navigate and tests more likely to target internal seams rather than stable boundaries.

A follow-up validation pass confirmed that the candidate list is directionally sound, but the priority and grouping should be adjusted:

1. **Oscilloscope client/session orchestration** is the strongest deepening candidate.
2. **Web audio player session boundary** remains high value, and should absorb the audio UI presentation split.
3. **Audio source selection + media-element source family** is valid, but should be reframed around the browser playback runtime facade in `apps/web`, not around `AudioEngine` itself.
4. **Oscilloscope signal pipeline** is real but less urgent because it is already fairly cohesive and testable.
5. **JSON render catalog + registry adapter** is valid shallow duplication, but lower architectural payoff.

The strongest validated architectural friction is around audio/oscilloscope integration, where host React orchestration, package runtime code, and browser-only lifecycle concerns intersect.

## Validation evidence

The validation pass checked current docs, package exports, import usage, file size, and test shape.

Important supporting docs:

- `docs/diagrams/2026-04-23-audio-implementation-reference.md`
- `docs/plans/2026-04-05-browser-oscilloscope-track-playback-spike.md`
- `docs/reports/2026-03-28-monorepo-architecture-map.md`

The implementation reference confirms the relevant ownership boundaries:

- `apps/web` owns browser orchestration for audio playback: `Audio()`, static catalog, controller state, route/component lifecycle, and UI actions.
- `apps/web` owns oscilloscope browser orchestration: `getUserMedia`, `AudioContext`, mic teardown, canvas refs, support state, hash persistence, and React controls.
- `@kkb/audio` owns the headless engine, source contracts, source selection, store/checkpoint, signal providers, XY geometry, oscilloscope runtime, and WebGPU renderer.
- `@kkb/ui` owns shared player presentation pieces used by the web audio page: controls, waveform, presenter, and theme classes.

The oscilloscope playback spike plan also reinforces that future playback visualization should add a **host-owned playback analysis seam** rather than moving browser graph ownership into `@kkb/audio`.

## Revised recommendation

Explore **Candidate 3: Oscilloscope client/session orchestration** next.

It has the clearest evidence of shallow-module friction:

- `apps/web/components/oscilloscope/oscilloscope-client.tsx` is a large React component that also acts as a session state machine.
- `apps/web/components/oscilloscope/__tests__/oscilloscope-client.test.tsx` is an even larger behavior-focused test file that is effectively testing hidden session orchestration through React.
- The bugs most likely to occur here are lifecycle/race bugs at seams: lazy runtime loading, mic permission promises, stale source switches, support fallback, hash restore, and teardown.

A deeper `OscilloscopeSession`-style module would give the codebase a smaller React interface and a clearer boundary for tests.

## Candidate 1: Web audio player session boundary

### Validation status

**Validated, high value.**  
This remains a strong candidate, but the original Candidate 6 should be folded into it because the audio UI presentation split is one symptom of the larger player session boundary problem.

### Cluster

- `apps/web/components/audio/player-client.tsx`
- `apps/web/lib/audio/controller/player-controller.ts`
- `apps/web/lib/audio/use-player-controller.ts`
- `apps/web/lib/audio/create-web-player.ts`
- `apps/web/lib/audio/catalog/*`
- `apps/web/components/audio/player-shell.tsx`
- `packages/ui/src/components/audio/player-controls.tsx`
- `packages/ui/src/components/audio/waveform.tsx`
- `packages/ui/src/components/audio/playhead.tsx`
- `packages/ui/src/components/audio/presenter.ts`
- `packages/ui/src/components/audio/theme.ts`

### Why they’re coupled

- `PlayerClient` owns catalog creation, player creation, controller creation, lifecycle, default selection fallback, and UI wiring.
- `player-controller.ts` owns queue state and selected asset state, but depends on catalog shape and player runtime behavior.
- `PlayerShell` depends on `WebPlayer` for imperative live timeline/buffered range reads while also receiving coarse controller snapshot props.
- `PlayerShell` reaches into `Waveform` via refs for live timeline and buffered range mutation, while `Waveform` and `createPlayerPresenter` live in `@kkb/ui`.
- Understanding “what is the audio player?” requires bouncing between React lifecycle, catalog, controller, runtime factory, shared UI presenter code, and imperative DOM sync.

### Validation findings

The strongest signal is that there are two live state paths:

1. snapshot state through `createPlayerController`
2. imperative live reads through `WebPlayer.getTimeline()` / `WebPlayer.getBufferedRanges()` in `PlayerShell`

Current tests exercise the seams separately:

- `apps/web/components/audio/__tests__/player-client.test.tsx`
- `apps/web/components/audio/__tests__/player-shell.test.tsx`
- `apps/web/lib/audio/controller/__tests__/player-controller.test.ts`
- `apps/web/lib/audio/__tests__/create-web-player.test.ts`
- `packages/ui/src/components/audio/__tests__/player-presenter.test.ts`
- `packages/ui/src/components/audio/__tests__/waveform.test.ts`

A deeper player session module would let tests assert user-observable behavior across these seams.

### Dependency category

**Local-substitutable**

The browser audio element can already be substituted with test doubles via `createMediaElement` / `createFallbackElement`. A deeper module could be tested against fake catalog + fake player/audio elements.

### Test impact

Could replace many shallow integration-ish tests:

- `apps/web/components/audio/__tests__/player-client.test.tsx`
- `apps/web/lib/audio/controller/__tests__/player-controller.test.ts`
- parts of `apps/web/lib/audio/__tests__/create-web-player.test.ts`
- parts of `apps/web/components/audio/__tests__/player-shell.test.tsx`
- parts of `packages/ui/src/components/audio/__tests__/player-presenter.test.ts`
- parts of `packages/ui/src/components/audio/__tests__/waveform.test.ts`

Boundary tests would verify full session behavior:

- boot loads default track
- selection changes update runtime and queue flags
- failed loads restore prior selection
- destroy cancels in-flight work
- transport controls preserve snapshot consistency
- live timeline and buffered range updates stay coherent
- seek interactions flow through one session boundary

## Candidate 2: Browser playback runtime facade

### Validation status

**Partially validated; reframed.**  
The original candidate focused on audio source selection and the media-element source family. The validation pass found that `AudioEngine` is already a reasonably deep module with substantial tests. The better deepening target is the browser-facing runtime facade in `apps/web/lib/audio/create-web-player.ts`.

### Cluster

- `apps/web/lib/audio/create-web-player.ts`
- `packages/audio/src/engine/engine.ts`
- `packages/audio/src/sources/audio-source.ts`
- `packages/audio/src/sources/media-element-shared.ts`
- `packages/audio/src/sources/media-element-source.ts`
- `packages/audio/src/sources/fallback-source.ts`
- `packages/audio/src/sources/webcodecs-source.ts`
- `packages/audio/src/sources/worklet-pcm-source.ts`

### Why they’re coupled

- `AudioEngine` ranks sources, handles recovery, checkpoint restoration, playback event wiring, and source teardown.
- `createWebPlayer` knows which browser sources exist, how to construct them, and how to recover source-specific buffered ranges/timelines.
- `media-element-source.ts` and `fallback-source.ts` are nearly identical shallow wrappers over `media-element-shared.ts`; their real behavior only makes sense when viewed through host construction and engine scoring/fallback order.
- Adding host-only capabilities, such as future playback analyser taps, currently points back to `createWebPlayer` because it owns media elements and source instances.

### Validation findings

`AudioEngine` is not the main shallow-module problem. It already hides a large implementation behind a small interface and has robust tests:

- `packages/audio/src/engine/__tests__/engine-recovery.test.ts`
- `packages/audio/src/engine/__tests__/engine-runtime.test.ts`
- `packages/audio/src/engine/__tests__/store.test.ts`
- `packages/audio/src/engine/__tests__/store-subscribe.test.ts`

The friction is more clearly in the host facade:

- `createWebPlayer` owns browser element construction.
- It creates engine sources.
- It exposes player controls.
- It exposes timeline and buffered range helpers.
- It is the natural place future host-only playback analysis availability would be surfaced.

This candidate is especially relevant before or during the planned playback analyser spike.

### Dependency category

**Local-substitutable**

Source behavior can be exercised with in-memory source fakes and fake media elements. No true external service boundary is involved.

### Test impact

Could replace/lift shallow source and host facade tests:

- parts of `packages/audio/src/sources/__tests__/media-element-source.test.ts`
- parts of `packages/audio/src/sources/__tests__/fallback-source.test.ts`
- parts of `apps/web/lib/audio/__tests__/create-web-player.test.ts`

Boundary tests would target “browser playback runtime facade chooses, owns, and exposes playback capabilities” rather than each tiny source wrapper.

Potential boundary behaviors:

- constructs media-element/fallback/worklet/webcodecs candidates
- delegates playback to the engine
- reports timeline and buffered ranges from the active source
- reports graph/analyser-tap availability without leaking raw browser nodes up the tree
- tears down active browser resources safely

## Candidate 3: Oscilloscope client/session orchestration

### Validation status

**Validated, strongest candidate.**  
This is the best candidate to explore next.

### Cluster

- `apps/web/components/oscilloscope/oscilloscope-client.tsx`
- `apps/web/components/oscilloscope/oscilloscope-shell.tsx`
- `apps/web/components/oscilloscope/oscilloscope-controls.tsx`
- `apps/web/lib/oscilloscope/create-mic-provider.ts`
- `packages/audio/src/oscilloscope/runtime.ts`
- `packages/audio/src/oscilloscope/config.ts`
- `packages/audio/src/oscilloscope/presets.ts`
- `packages/audio/src/oscilloscope/support.ts`

### Why they’re coupled

`OscilloscopeClient` currently owns a lot:

- support detection
- dynamic runtime import
- scope lifecycle
- mic runtime lifecycle
- source switching
- stale async mic request cancellation
- hash read/write persistence
- hash value clamping
- preset application
- keyboard shortcuts
- startup error handling

The React component is effectively an oscilloscope session manager plus view adapter. Bugs are likely to hide in sequencing: source changes while async mic permission is pending, support flips to unsupported, scope startup fails, lazy runtime loading resolves after state changes, hash config loads after initial render, etc.

### Validation findings

The file/test shape strongly supports this candidate:

- `apps/web/components/oscilloscope/oscilloscope-client.tsx` is large and stateful.
- `apps/web/components/oscilloscope/__tests__/oscilloscope-client.test.tsx` is larger and tests session behavior through React.

Current tests are already expressing a hidden session state machine:

- no browser runtime during server render
- one scope instance stays alive while controls push config updates
- readable fallback when runtime startup fails
- readable fallback when construction/import fails
- latest source state replays after lazy scope loading resolves
- fake mic mode is derived from the URL
- hash-restored values are clamped to safe bounds
- mic mode survives preset switching
- oscillator-only controls hide in mic mode
- stale mic rejection is ignored after switching back to oscillators
- mic attach/detach reuses the same scope and cleans up host provider resources

Those are not primarily UI rendering concerns. They are session lifecycle concerns.

### Dependency category

**Local-substitutable**

WebGPU renderer and mic provider are already injectable. Tests can use fake scope, fake renderer, fake mic provider, fake clock/window.

### Test impact

Could replace/centralize:

- `apps/web/components/oscilloscope/__tests__/oscilloscope-client.test.tsx`
- parts of `apps/web/lib/oscilloscope/__tests__/create-mic-provider.test.ts`
- parts of `packages/audio/src/oscilloscope/__tests__/runtime.test.ts`

Boundary tests would verify session behavior:

- start/stop lifecycle
- lazy runtime loading races
- mic source request cancellation
- stale async mic runtimes are destroyed
- preset/hash/config updates stay consistent
- startup failures clean up resources
- source type changes update both config and provider state predictably

## Candidate 4: Oscilloscope signal pipeline

### Validation status

**Partially validated, but lower urgency.**  
The coupling is real, but this area is already relatively cohesive and testable compared with the session orchestration layer above it.

### Cluster

- `packages/audio/src/oscilloscope/runtime.ts`
- `packages/audio/src/oscilloscope/signal/signal-provider.ts`
- `packages/audio/src/oscilloscope/signal/analyser-source.ts`
- `packages/audio/src/oscilloscope/signal/oscillator-source.ts`
- `packages/audio/src/oscilloscope/modes/xy.ts`
- `apps/web/lib/oscilloscope/create-mic-provider.ts`

### Why they’re coupled

- `SignalProvider` looks small, but it hides multiple concerns:
  - analyser reads
  - stereo/mono derivation
  - sample conditioning
  - oscillator generation
  - XY frame generation
  - runtime source selection
- `runtime.ts` chooses the active provider, while `xy.ts` knows how to interpret channels, and `create-mic-provider.ts` knows how analyser topology maps into provider behavior.
- Testing isolated helpers is useful, but the meaningful product behavior is “given this source, generate this frame geometry.”

### Validation findings

Existing tests are small and targeted:

- `packages/audio/src/oscilloscope/signal/__tests__/analyser-source.test.ts`
- `packages/audio/src/oscilloscope/signal/__tests__/oscillator-source.test.ts`
- `packages/audio/src/oscilloscope/modes/__tests__/xy.test.ts`
- `packages/audio/src/oscilloscope/__tests__/runtime.test.ts`

This may become more important when adding playback-backed signal providers, but the current larger friction sits above it in host session orchestration and host-owned provider lifecycle.

### Dependency category

**In-process** for oscillator/analyser/XY transformation; **Local-substitutable** when including mic `AudioContext` setup.

The signal transformation itself is pure/in-memory. Browser mic setup needs fake `AudioContext` / fake `MediaStream`.

### Test impact

Could replace/lift:

- `packages/audio/src/oscilloscope/signal/__tests__/analyser-source.test.ts`
- `packages/audio/src/oscilloscope/signal/__tests__/oscillator-source.test.ts`
- `packages/audio/src/oscilloscope/modes/__tests__/xy.test.ts`
- parts of `packages/audio/src/oscilloscope/__tests__/runtime.test.ts`

Boundary tests would assert observable frame geometry from common signal sources, rather than testing each tiny conversion in isolation.

## Candidate 5: JSON render catalog + registry adapter

### Validation status

**Validated, but small.**  
This is a real shallow-module smell, but it has lower architectural payoff than the audio/oscilloscope candidates.

### Cluster

- `packages/ui/src/json-render/catalog.ts`
- `packages/ui/src/json-render/registry.ts`
- `packages/ui/src/json-render/index.ts`
- `apps/web/app/json-render/demo.tsx`
- `apps/web/app/json-render/examples.ts`

### Why they’re coupled

- `catalog.ts` and `registry.ts` duplicate the same component list in parallel.
- Any component added to one must be mirrored in the other.
- `apps/web` examples directly depend on the exact exported adapter shape.
- This is a small but clear shallow-module smell: two files expose implementation detail rather than one deeper “KKB JSON renderer” adapter.

### Validation findings

The duplication is real, but the files are small and isolated. This likely wants a small adapter factory or single component-map source, not a major deep-module refactor.

### Dependency category

**True external**

This wraps external `@json-render/*` packages. A deeper internal adapter should treat those as external dependencies and mock/test at the adapter boundary.

### Test impact

There do not appear to be many direct tests here today.

New boundary tests could verify:

- every catalog component has a registry implementation
- the provider/renderer pair can render known specs
- examples only consume the internal adapter contract, not upstream package details

## Candidate 6: Audio UI presentation split between app and shared package

### Validation status

**Validated, but folded into Candidate 1.**  
This is real friction, but it is best treated as part of the broader web audio player session boundary.

### Cluster

- `apps/web/components/audio/player-shell.tsx`
- `packages/ui/src/components/audio/player-controls.tsx`
- `packages/ui/src/components/audio/waveform.tsx`
- `packages/ui/src/components/audio/playhead.tsx`
- `packages/ui/src/components/audio/presenter.ts`
- `packages/ui/src/components/audio/theme.ts`

### Why they’re coupled

- `@kkb/ui` owns controls, waveform, presenter, and theme primitives.
- `apps/web` still owns the composed player shell, live timeline polling, buffered DOM synchronization, status/footer rendering, and error display.
- The boundary between “shared audio UI” and “web app composition” is somewhat arbitrary now.
- The imperative live timeline path in `PlayerShell` is especially coupled to `Waveform` internals via refs.

### Validation findings

The ref-based connection between `PlayerShell` and `Waveform` is a clear smell, but extracting this alone would not address the larger split between controller snapshot state and imperative runtime reads.

Treat this as a design constraint when exploring Candidate 1.

### Dependency category

**In-process**

Mostly React rendering + pure presenter logic. The `WebPlayer` dependency can be replaced by a small in-memory fake.

### Test impact

Could replace/lift:

- `apps/web/components/audio/__tests__/player-shell.test.tsx`
- `packages/ui/src/components/audio/__tests__/player-presenter.test.ts`
- `packages/ui/src/components/audio/__tests__/waveform.test.ts`

Boundary tests would verify the composed audio player UI contract:

- display status
- live timeline polling
- buffered range rendering
- seek interactions
- control disabled states

## Final ranked shortlist

### 1. Oscilloscope session controller

Extract or define a deeper session orchestration boundary out of `OscilloscopeClient`.

Best when the goal is to reduce lifecycle/race bugs and continue current oscilloscope momentum.

### 2. Web audio player session

Deepen around controller + runtime + live timeline + UI composition.

Best when the goal is to make `/audio` easier to evolve and test as a product surface.

### 3. Browser playback runtime facade

Deepen `createWebPlayer` / source construction / active source host inspection.

Best when preparing for the playback analyser tap and future track-backed oscilloscope source.

## Recommended next step

Proceed with **Candidate 3 from the original list: Oscilloscope client/session orchestration**.

Before designing interfaces, frame the problem around a hidden session state machine:

- one React component currently owns browser support, lazy runtime loading, scope lifecycle, mic runtime lifecycle, URL persistence, presets, source switching, and failures
- the desired module should hide async lifecycle/race handling
- React should mostly render session state and dispatch user intents
- tests should move from component-driven seam tests to boundary tests against the session interface
