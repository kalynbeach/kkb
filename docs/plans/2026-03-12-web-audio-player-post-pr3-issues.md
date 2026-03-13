# Web Audio Player: Post-PR #3 Issues

Current milestone follow-up for audio-player work identified during PR #3 review. Each section maps to one GitHub issue, but this doc now tracks only current-scope audio follow-up.

## Scope Rules

- Current milestone covers user-facing bugs, behavior hardening, and tests first.
- Engine API contract: engine methods may throw, and the store must mirror the user-visible error state.
- Behavior and tests must be locked before cleanup refactors.
- Repo-wide Biome drift is out of scope for this doc and should be tracked separately.
- Phase 2 feature work is next milestone and should be tracked separately from post-PR fixes.

## Execution Order

1. Issue 1: lock engine error contract
2. Issue 7: close behavior-critical test gaps needed to protect the contract
3. Issue 5: tighten store/controller state transitions
4. Issue 6: fix controller UX edge cases exposed by the hardened contract
5. Issue 2: align or delete unused typed error hierarchy after contract is stable
6. Issue 3: deduplicate source implementations and shared types after behavior is locked
7. Issue 4: make type-only safety improvements
8. Issue 8: refresh docs/comments/diagrams to match the final design

---

## Current Milestone: Post-PR Fixes

## Issue 1: Engine error contract hardening

**Priority:** `P0`
**Labels:** `audio`, `bug`, `engine`
**Depends on:** None
**Blocks:** Issues 2, 3, 5, 6, 7

Engine methods currently mix silent no-op behavior, weak validation, and opaque runtime errors. This issue defines the contract the rest of the system must follow.

### Decisions

- `play()` and `pause()` may no-op when there is no active source, but that behavior must be explicit, documented, and covered by tests.
- Invalid `seek()` input must throw and store a user-visible error state.
- Constructing the engine with an empty `sources` array must throw immediately.
- Media element failures must map to human-readable messages before they reach the store/UI.
- Runtime paths must not mask the original failure with a secondary error.

### Work

- [ ] Define and document engine method behavior for `play()`, `pause()`, `seek()`, and constructor validation
- [ ] Validate `seek()` input (`NaN`, negative, beyond duration, non-finite)
- [ ] Reject empty `sources` array in the constructor
- [ ] Map `MediaError.code` values to readable messages (`network`, `decode`, `unsupported`, fallback unknown)
- [ ] Guard the `"ended"` path in `handlePlaybackEvent()` so `getTimeline()` cannot hide the real error

### Done when

- [ ] Every invalid input path has one clear outcome: throw and/or explicit no-op per contract
- [ ] Store error state matches thrown runtime/validation failures that should be user-visible
- [ ] Media element errors no longer surface as raw `"code N"` messages
- [ ] Engine behavior is documented well enough for Issue 7 tests and Issue 8 comments

---

## Issue 7: Missing test coverage

**Priority:** `P0`
**Labels:** `audio`, `tests`
**Depends on:** Issue 1 decisions
**Blocks:** Issues 2, 3, 5, 6

These tests lock the intended behavior before structural cleanup.

### Engine

- [ ] `pause()` error handling path
- [ ] `load()` checkpoint reset on track replacement
- [ ] `seek()` without active source (pre-seek before load updates checkpoint/store only)
- [ ] Stale source playback event ignored after source switch
- [ ] `destroy()` lifecycle resets status to `idle` and `sourceId` to `null`

### Controller

- [ ] `selectTrack()` with non-existent track ID
- [ ] `init()` idempotency

### Sources and contracts

- [ ] `selectTrackAsset()` edge cases: `defaultAssetIndex`, null input, empty input
- [ ] `isMediaElementEligibleInput()` and `normalizeMimeType()` with undefined `mimeType`

### UI

- [ ] Presenter `ready` and `paused` status button states

### Done when

- [ ] Every behavior listed above is covered by an explicit test
- [ ] New tests encode the Issue 1 contract, not the pre-fix behavior
- [ ] Refactor issues can proceed without re-deciding runtime behavior

---

## Issue 5: Store and controller state model improvements

**Priority:** `P1`
**Labels:** `audio`, `refactor`, `engine`, `controller`
**Depends on:** Issues 1, 7
**Blocks:** Issue 6

The current `Partial<T>` patch model allows invalid state combinations. This issue tightens state transitions without introducing a heavyweight state machine.

### Decisions

- Keep the flat store shape needed by `useSyncExternalStore`
- Replace generic patching with named atomic transitions for correlated updates
- Remove dead `setRate()` and `setVolume()` behavior unless this milestone also wires them through end-to-end
- Keep separate lifecycle fields unless UI usage proves they can collapse safely

### Work

- [ ] Replace `setState(patch: Partial<PlayerState>)` with named transition functions (`transitionToReady`, `transitionToError`, etc.)
- [ ] Define allowed status transitions and correlated field requirements
- [ ] Remove or fully wire `setRate()` and `setVolume()`; do not leave checkpoint-only writes behind
- [ ] Merge `selectedTrackId`, `selectedTrack`, and `asset` into `selection: { trackId, track, asset } | null`
- [ ] Re-evaluate `catalogStatus` and `restoreStatus` only after checking actual UI dependence

### Done when

- [ ] Invalid partial state combinations are no longer representable through public store/controller APIs
- [ ] Selection data is updated atomically
- [ ] Rate/volume behavior is either real or removed
- [ ] Store shape still works cleanly with `useSyncExternalStore`

---

## Issue 6: Controller UX edge cases

**Priority:** `P1`
**Labels:** `audio`, `bug`, `controller`, `ui`
**Depends on:** Issues 1, 5, 7
**Blocks:** None

Fix UX inconsistencies surfaced by the hardened engine/state model.

### Work

- [ ] Roll back selection state on load failure so playlist UI does not show a false active track
- [ ] Disable controls in the pre-mount placeholder instead of using silent no-op handlers
- [ ] Simplify `usePlayerController()` to return the snapshot directly if that matches all current consumers

### Done when

- [ ] Failed loads leave UI in a coherent, visible error state
- [ ] Placeholder controls are visibly non-interactive
- [ ] Controller hook API matches real consumer usage without redundant wrapping

---

## Cleanup and Refactor: After Behavior Locks

## Issue 2: Integrate or remove typed error hierarchy

**Priority:** `P2`
**Labels:** `audio`, `refactor`, `engine`
**Depends on:** Issues 1, 7
**Blocks:** None

`contracts/errors.ts` currently defines unused error classes. Do not preserve dead abstractions just because they exist.

### Decision

- Prefer integrating the hierarchy only if it materially improves the now-locked error contract
- Otherwise delete `contracts/errors.ts` and reintroduce typed errors later when they are justified by real call sites

### Work

- [ ] Compare the locked Issue 1 contract against the existing error classes
- [ ] Either wire the classes through real throw sites and store mapping, or delete the file
- [ ] Avoid storing both structured and string error forms unless the UI actually needs both

### Done when

- [ ] Error types in the codebase match real runtime behavior
- [ ] No unused error hierarchy remains
- [ ] Error mapping is simpler, not more abstract for its own sake

---

## Issue 3: Deduplicate source implementations and shared types

**Priority:** `P2`
**Labels:** `audio`, `refactor`
**Depends on:** Issues 1, 2, 7
**Blocks:** None

There is real duplication, but this work must happen only after the runtime contract is stable.

### Source duplication

- [ ] Extract shared HTML-audio behavior from `media-element-source.ts` and `fallback-source.ts` only after their public behavior matches
- [ ] If extracting a factory, parameterize only the true differences (`id`, `score`, `load` strategy)

### Type duplication

- [ ] Extract one canonical `AudioElementLike`
- [ ] Extract one canonical `MediaErrorLike`
- [ ] Export a single `AudioPlayerStatus`
- [ ] Export a single `BufferedRange`

### Done when

- [ ] Shared abstractions remove duplication without changing locked behavior
- [ ] Canonical shared types replace copy-pasted local variants
- [ ] No new abstraction is introduced solely to satisfy DRY

---

## Issue 4: Type safety improvements

**Priority:** `P2`
**Labels:** `audio`, `refactor`, `types`
**Depends on:** Issues 1, 3, 7
**Blocks:** None

Type-only tightening that should be safe once behavior and shared contracts settle.

### Work

- [ ] Add `readonly` to snapshot/capability types: `SourceCapabilities`, `TimelineSnapshot`, `PlayerState`, `PlaybackCheckpoint`, `TrackRecord`, `TrackAsset`, `PlayerControllerSnapshot`
- [ ] Convert `PlaybackEvent` into a discriminated union
- [ ] Use a non-empty tuple type for `TrackRecord.assets`

### Explicitly not in scope

- [ ] Do not make `TrackInput.mimeType` required
- [ ] Do not force `subscribePlayback` onto sources that do not meaningfully support it

### Done when

- [ ] Type changes produce no intentional runtime behavior change
- [ ] Engine/controller code becomes simpler because the types encode real invariants
- [ ] Optional APIs remain optional where the runtime model justifies it

---

## Issue 8: Code comments and diagram accuracy

**Priority:** `P2`
**Labels:** `audio`, `docs`
**Depends on:** Issues 1 through 6
**Blocks:** None

Comments and diagrams should explain the final design, not a moving target.

### Comments to add

- [ ] Engine: explain explicit no-op behavior, throw-plus-store error reporting, optimistic seek, stale event guard
- [ ] Store: document the `useSyncExternalStore` reference-change contract
- [ ] Controller: document the `initPromise` and `initialized` double-guard pattern
- [ ] `AudioSource` interface: document lifecycle order (`canPlay` -> `load` -> runtime controls -> `destroy`)
- [ ] Player shell: mark hardcoded metadata labels as decorative

### Diagram fixes

- [ ] Add `destroy()` to engine public methods
- [ ] Add controller layer between `MountedPlayer` and `WebPlayer`
- [ ] Add `unsubscribeFromActiveSource()` and `handleRuntimeError()` to engine private methods
- [ ] Add missing `WebPlayer` members or explicitly mark them as internal escape hatches
- [ ] Add controller to playback interaction flow

### Done when

- [ ] Comments explain non-obvious design choices, not trivial code
- [ ] Diagrams match the shipped architecture
- [ ] New contributors can follow the lifecycle without reverse-engineering the code

---

## Out of Scope for This Doc

### Repo-wide infra follow-up

Track separately from audio follow-up:

- Biome schema version mismatch in `biome.json`
- Existing repo-wide formatting/import violations

### Next milestone: Phase 2 features

Track separately from post-PR fixes:

- Waveform keyboard seeking
- React error boundary on `PlayerClient`
- Volume/rate controls UI
- Persistence layer
- Media Session API
- Queue/playlist logic
- Real WebCodecs demuxer
