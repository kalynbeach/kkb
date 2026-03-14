# Audio Issue Remediation Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close GitHub issues `#5` through `#12` for the `@kkb/audio` web audio player without mixing behavior fixes, refactors, and docs updates out of dependency order.

**Architecture:** Lock runtime behavior in `packages/audio` first, then encode that behavior in tests across `packages/audio`, `apps/web`, and `packages/ui`, then tighten state modeling in the app controller, and only then do cleanup refactors and docs refresh. Keep engine ownership in `@kkb/audio`, keep catalog/controller concerns in `apps/web`, and avoid behavior changes during refactor-only issues.

**Tech Stack:** Bun, Turbo, TypeScript, React 19, Next.js 16, `bun test`, `tsc`, Biome.

---

## Scope

- GitHub issue `#5`: harden engine error contract
- GitHub issue `#6`: add missing test coverage
- GitHub issue `#7`: store and controller state model improvements
- GitHub issue `#8`: controller UX edge cases
- GitHub issue `#9`: integrate or remove typed error hierarchy
- GitHub issue `#10`: deduplicate source implementations and shared types
- GitHub issue `#11`: type safety improvements
- GitHub issue `#12`: code comments and diagram accuracy

## Execution Order

1. `#5` engine contract
2. `#6` tests that lock contract
3. `#7` store/controller transitions
4. `#8` UX fixes on top of new state model
5. `#9` typed error decision
6. `#10` source/type dedupe
7. `#11` type tightening
8. `#12` docs/comments/diagrams

## Resolved Decisions

- `#10`: do not add new `@kkb/*` monorepo package dependencies just to dedupe types; keep `@kkb/ui` isolated from `@kkb/audio`.
- `#9`: delete typed errors if they are dead after the `#5` contract pass.
- `#7`: wire `rate` and `volume` end-to-end in the same milestone instead of leaving checkpoint-only state.
- Asset typing policy: raw catalog input stays tolerant, while validated runtime `TrackRecord` becomes non-empty in `#11`.

## Chunk 1: Runtime Contract And Coverage

### Task 1: Issue `#5` Harden engine error contract

**Files:**
- Modify: `packages/audio/src/engine/engine.ts`
- Modify: `packages/audio/src/sources/media-element-source.ts`
- Modify: `packages/audio/src/sources/fallback-source.ts`
- Modify: `packages/audio/src/contracts/errors.ts` only if needed for a real error mapping
- Test: `packages/audio/src/engine/__tests__/engine-runtime.test.ts`
- Test: `packages/audio/src/engine/__tests__/engine-recovery.test.ts`
- Test: `packages/audio/src/sources/__tests__/media-element-source.test.ts`
- Test: `packages/audio/src/sources/__tests__/fallback-source.test.ts`

- [ ] Define the exact engine contract in code comments first: constructor with empty `sources` throws, `play()` and `pause()` explicit no-op with no source, invalid `seek()` throws and mirrors store error, runtime failures preserve original error.
- [ ] Add constructor validation in `AudioEngine` before any source use.
- [ ] Add `seek()` validation for `NaN`, negative, non-finite, and beyond-duration values when duration is known; keep pre-load optimistic seek only for valid values.
- [ ] Change runtime error handling so store error text matches the thrown error for load, play, pause, and seek failures.
- [ ] Fix `"ended"` playback handling so `source.getTimeline()` or `source.seek(0)` cannot mask the original runtime failure path.
- [ ] Replace raw media-element `"code N"` messages with readable messages for network, decode, unsupported, and unknown cases in both HTML-audio-backed source implementations.
- [ ] Run targeted tests while iterating:
Run: `bun test packages/audio/src/engine/__tests__/engine-runtime.test.ts packages/audio/src/engine/__tests__/engine-recovery.test.ts packages/audio/src/sources/__tests__/media-element-source.test.ts packages/audio/src/sources/__tests__/fallback-source.test.ts`
Expected: failing assertions move to the new contract, then pass.
- [ ] Verify workspace health for touched package:
Run: `bun run test -- --filter=@kkb/audio`
Run: `bun run check-types -- --filter=@kkb/audio`
- [ ] Commit:
Run: `git commit -m "fix: harden audio engine error contract"`

### Task 2: Issue `#6` Add missing test coverage

**Files:**
- Modify: `packages/audio/src/engine/__tests__/engine-runtime.test.ts`
- Modify: `packages/audio/src/engine/__tests__/engine-recovery.test.ts`
- Modify: `packages/audio/src/engine/__tests__/store.test.ts`
- Modify: `packages/audio/src/contracts/__tests__/codecs.test.ts`
- Modify: `packages/audio/src/sources/__tests__/media-element-source.test.ts`
- Modify: `packages/audio/src/sources/__tests__/fallback-source.test.ts`
- Modify: `apps/web/lib/audio/controller/__tests__/player-controller.test.ts`
- Create: `apps/web/lib/audio/catalog/__tests__/select-track-asset.test.ts`
- Modify: `apps/web/lib/audio/__tests__/create-web-player.test.ts`
- Modify: `apps/web/components/audio/__tests__/track-selector.test.tsx`
- Modify: `packages/ui/src/components/audio/__tests__/player-presenter.test.ts`

- [ ] Add engine tests for `pause()` error handling, checkpoint reset on track replacement, valid pre-load seek behavior, stale playback event ignore, and `destroy()` resetting runtime snapshot.
- [ ] Add controller tests for non-existent `selectTrack()` IDs and idempotent `init()`.
- [ ] Add raw-boundary tests for `selectTrackAsset()` null input, empty assets, and `defaultAssetIndex` fallbacks so malformed catalog data stays handled before the later validated-type pass.
- [ ] Add source tests for undefined `mimeType` handling in media-element eligibility and mime normalization helpers.
- [ ] Add presenter/UI tests for `ready` and `paused` button states.
- [ ] Keep new assertions aligned to the `#5` contract, not to current incidental behavior.
- [ ] Verify just the changed suites first:
Run: `bun test packages/audio/src/engine/__tests__/engine-runtime.test.ts apps/web/lib/audio/controller/__tests__/player-controller.test.ts packages/ui/src/components/audio/__tests__/player-presenter.test.ts`
Expected: all new coverage passes.
- [ ] Verify full impacted workspaces:
Run: `bun run test -- --filter=@kkb/audio --filter=@kkb/web --filter=@kkb/ui`
Run: `bun run check-types -- --filter=@kkb/audio --filter=@kkb/web --filter=@kkb/ui`
- [ ] Commit:
Run: `git commit -m "test: lock audio runtime and controller behavior"`

## Chunk 2: State Model And UX

### Task 3: Issue `#7` Tighten state transitions and wire rate/volume

**Files:**
- Modify: `packages/audio/src/engine/store.ts`
- Modify: `packages/audio/src/engine/engine.ts`
- Modify: `packages/audio/src/engine/checkpoint.ts`
- Modify: `packages/audio/src/sources/audio-source.ts`
- Modify: `packages/audio/src/sources/media-element-source.ts`
- Modify: `packages/audio/src/sources/fallback-source.ts`
- Modify: `packages/audio/src/sources/worklet-pcm-source.ts`
- Modify: `packages/audio/src/sources/webcodecs-source.ts`
- Modify: `apps/web/lib/audio/controller/player-controller.ts`
- Modify: `apps/web/lib/audio/use-player-controller.ts`
- Modify: `apps/web/components/audio/player-shell.tsx`
- Modify: `apps/web/components/audio/player-client.tsx`
- Modify: `apps/web/lib/audio/create-web-player.ts` only if runtime snapshot types need export cleanup
- Modify: `packages/ui/src/components/audio/player-controls.tsx`
- Test: `packages/audio/src/engine/__tests__/store.test.ts`
- Test: `packages/audio/src/engine/__tests__/engine-runtime.test.ts`
- Test: `packages/audio/src/engine/__tests__/store-subscribe.test.ts`
- Test: `packages/audio/src/sources/__tests__/media-element-source.test.ts`
- Test: `packages/audio/src/sources/__tests__/fallback-source.test.ts`
- Test: `packages/audio/src/sources/__tests__/worklet-pcm-source.test.ts`
- Test: `packages/audio/src/sources/__tests__/webcodecs-source.test.ts`
- Test: `apps/web/lib/audio/controller/__tests__/player-controller.test.ts`
- Test: `apps/web/lib/audio/__tests__/create-web-player.test.ts`
- Test: `apps/web/components/audio/__tests__/player-client.test.tsx`
- Test: `apps/web/components/audio/__tests__/player-shell.test.tsx`

- [ ] Replace generic `setState(patch: Partial<PlayerState>)` with named transitions that encode allowed correlated updates and still produce new object references for `useSyncExternalStore`.
- [ ] Keep engine snapshot flat, but stop exposing impossible combinations such as mismatched status, source, error, and selection data.
- [ ] In controller state, replace `selectedTrackId`, `selectedTrack`, and `asset` with one atomic `selection` object or `null`.
- [ ] Extend the runtime contract so `rate` and `volume` are real engine state, not checkpoint-only writes. Add the minimum source interface needed for HTML-audio-backed sources first, and define fallback behavior for sources that cannot support one or both controls yet.
- [ ] Surface `rate` and `volume` through controller snapshot and actions, then add minimal UI controls in the player shell so the feature is truly end-to-end.
- [ ] Re-check whether `catalogStatus` and `restoreStatus` are both still needed after transition helpers exist; collapse only if all current UI consumers still read cleanly.
- [ ] Update tests to validate allowed transitions, selection atomicity, and subscription behavior.
- [ ] Add tests for `rate` and `volume` persistence across load, source switch, and destroy flows, plus UI/controller interaction coverage for the new controls.
- [ ] Keep Task 3 self-contained: update `player-client` and its tests in the same change so the new snapshot shape ships with its main consumer.
- [ ] Verify impacted suites:
Run: `bun test packages/audio/src/engine/__tests__/store.test.ts packages/audio/src/engine/__tests__/engine-runtime.test.ts packages/audio/src/engine/__tests__/store-subscribe.test.ts packages/audio/src/sources/__tests__/media-element-source.test.ts packages/audio/src/sources/__tests__/fallback-source.test.ts packages/audio/src/sources/__tests__/worklet-pcm-source.test.ts packages/audio/src/sources/__tests__/webcodecs-source.test.ts apps/web/lib/audio/controller/__tests__/player-controller.test.ts apps/web/lib/audio/__tests__/create-web-player.test.ts apps/web/components/audio/__tests__/player-client.test.tsx apps/web/components/audio/__tests__/player-shell.test.tsx`
Expected: no invalid partial-state combinations remain.
- [ ] Verify impacted workspaces:
Run: `bun run test -- --filter=@kkb/audio --filter=@kkb/web`
Run: `bun run check-types -- --filter=@kkb/audio --filter=@kkb/web`
- [ ] Commit:
Run: `git commit -m "feat: wire audio rate and volume controls"`

### Task 4: Issue `#8` Fix controller UX edge cases

**Files:**
- Modify: `apps/web/lib/audio/controller/player-controller.ts`
- Modify: `apps/web/lib/audio/use-player-controller.ts`
- Modify: `apps/web/components/audio/player-client.tsx`
- Modify: `apps/web/components/audio/player-shell.tsx`
- Modify: `apps/web/components/audio/track-selector.tsx`
- Test: `apps/web/lib/audio/controller/__tests__/player-controller.test.ts`
- Test: `apps/web/components/audio/__tests__/player-client.test.tsx`
- Test: `apps/web/components/audio/__tests__/player-shell.test.tsx`
- Test: `apps/web/components/audio/__tests__/track-selector.test.tsx`

- [ ] Make failed track loads roll selection back to the last confirmed playable selection instead of leaving false active UI state.
- [ ] Replace pre-mount no-op handlers with visibly disabled controls in the placeholder shell.
- [ ] Simplify `usePlayerController()` to return the snapshot directly if no current consumer needs the wrapper object.
- [ ] Update UI tests for disabled placeholder controls, load-failure rollback, and hook API consumption.
- [ ] Verify impacted suites:
Run: `bun test apps/web/lib/audio/controller/__tests__/player-controller.test.ts apps/web/components/audio/__tests__/player-shell.test.tsx apps/web/components/audio/__tests__/track-selector.test.tsx`
Expected: failed-load and pre-mount UI states stay coherent.
- [ ] Verify workspace health:
Run: `bun run test -- --filter=@kkb/web --filter=@kkb/ui`
Run: `bun run check-types -- --filter=@kkb/web --filter=@kkb/ui`
- [ ] Commit:
Run: `git commit -m "fix: clean up audio controller UX edge cases"`

## Chunk 3: Cleanup After Behavior Locks

### Task 5: Issue `#9` Integrate or remove typed error hierarchy

**Files:**
- Modify: `packages/audio/src/contracts/errors.ts`
- Modify: `packages/audio/src/engine/engine.ts`
- Modify: `packages/audio/src/sources/media-element-source.ts`
- Modify: `packages/audio/src/sources/fallback-source.ts`
- Test: `packages/audio/src/engine/__tests__/engine-runtime.test.ts`
- Test: `packages/audio/src/sources/__tests__/media-element-source.test.ts`

- [ ] Audit whether `NetworkError`, `DecodeError`, `UnsupportedError`, and related classes improve any real throw site after `#5`.
- [ ] If they are still dead after that audit, delete `contracts/errors.ts` and remove imports/usages entirely. That is the expected outcome.
- [ ] If they do, wire them through only where the UI or controller benefits from structured error semantics; do not keep both redundant string and object error shapes without a consumer.
- [ ] Verify contract behavior still matches issue `#5`.
- [ ] Verify impacted package:
Run: `bun run test -- --filter=@kkb/audio`
Run: `bun run check-types -- --filter=@kkb/audio`
- [ ] Commit:
Run: `git commit -m "refactor: simplify audio error hierarchy"`

### Task 6: Issue `#10` Deduplicate source implementations and shared types

**Files:**
- Modify: `packages/audio/src/sources/media-element-source.ts`
- Modify: `packages/audio/src/sources/fallback-source.ts`
- Create: `packages/audio/src/sources/media-element-shared.ts`
- Modify: `packages/audio/src/sources/audio-source.ts`
- Modify: `packages/audio/src/contracts/types.ts`
- Modify: `packages/audio/src/engine/store.ts`
- Modify: `apps/web/lib/audio/create-web-player.ts`
- Test: `packages/audio/src/sources/__tests__/media-element-source.test.ts`
- Test: `packages/audio/src/sources/__tests__/fallback-source.test.ts`
- Test: `apps/web/lib/audio/__tests__/create-web-player.test.ts`

- [ ] Extract only the shared HTML-audio behavior that is already behaviorally identical after `#5`; keep source `id`, score, and load strategy as the only parameters.
- [ ] Keep `@kkb/ui` isolated from `@kkb/audio`; do not add new monorepo package dependencies to satisfy DRY.
- [ ] Extract canonical shared types for `AudioElementLike` and `MediaErrorLike` inside the audio/runtime layer only. Leave presenter-local `AudioPlayerStatus` and `BufferedRange` alone in this milestone.
- [ ] Keep the abstraction shallow; if a helper starts encoding divergent behavior, stop and keep the duplication.
- [ ] Verify no user-visible behavior changes with source-level tests and web-player integration tests.
- [ ] Verify impacted workspaces:
Run: `bun run test -- --filter=@kkb/audio --filter=@kkb/web`
Run: `bun run check-types -- --filter=@kkb/audio --filter=@kkb/web`
- [ ] Commit:
Run: `git commit -m "refactor: dedupe audio source internals"`

### Task 7: Issue `#11` Tighten type safety

**Files:**
- Modify: `packages/audio/src/contracts/types.ts`
- Modify: `packages/audio/src/sources/audio-source.ts`
- Modify: `packages/audio/src/engine/store.ts`
- Modify: `packages/audio/src/engine/checkpoint.ts`
- Modify: `apps/web/lib/audio/catalog/track-types.ts`
- Modify: `apps/web/lib/audio/catalog/static-track-catalog-data.ts`
- Modify: `apps/web/lib/audio/catalog/static-track-catalog.ts`
- Modify: `apps/web/lib/audio/catalog/select-track-asset.ts`
- Modify: `apps/web/lib/audio/controller/player-controller.ts`
- Modify: `apps/web/components/audio/track-selector.tsx`
- Test: `packages/audio/src/contracts/__tests__/codecs.test.ts`
- Test: `packages/audio/src/engine/__tests__/store.test.ts`
- Test: `apps/web/lib/audio/controller/__tests__/player-controller.test.ts`
- Test: `apps/web/lib/audio/catalog/__tests__/select-track-asset.test.ts`
- Test: `apps/web/components/audio/__tests__/track-selector.test.tsx`

- [ ] Add `readonly` to snapshot and capability types that should be immutable at call boundaries.
- [ ] Convert `PlaybackEvent` to a discriminated union without forcing unsupported optional source APIs into existence.
- [ ] Introduce a validated non-empty track type at the catalog/controller boundary. If needed, rename the current raw shape so `TrackRecord` becomes the validated type and malformed raw input remains explicit at ingest time.
- [ ] Change validated `TrackRecord.assets` to a non-empty tuple, then update catalog fixtures, selector helpers, and UI tests accordingly.
- [ ] Use the stronger types to simplify controller and engine logic instead of adding casts.
- [ ] Verify type-only changes do not alter runtime behavior.
- [ ] Verify impacted workspaces:
Run: `bun run test -- --filter=@kkb/audio --filter=@kkb/web`
Run: `bun run check-types -- --filter=@kkb/audio --filter=@kkb/web`
- [ ] Commit:
Run: `git commit -m "refactor: tighten audio type contracts"`

## Chunk 4: Docs And Final Verification

### Task 8: Issue `#12` Refresh comments and diagrams

**Files:**
- Modify: `packages/audio/src/engine/engine.ts`
- Modify: `packages/audio/src/engine/store.ts`
- Modify: `packages/audio/src/sources/audio-source.ts`
- Modify: `apps/web/lib/audio/controller/player-controller.ts`
- Modify: `apps/web/components/audio/player-shell.tsx`
- Modify: `docs/diagrams/2026-03-10-web-audio-player-architecture.md`
- Modify: `docs/diagrams/2026-03-10-web-audio-player-flows.md`
- Modify: `docs/specs/2026-03-10-web-audio-player-runbook.md` only if operator-facing lifecycle text changed materially
- Modify: `docs/specs/2026-03-12-web-audio-player-track-loading-selection-storage.md` if `selection`, `volume`, or `rate` semantics changed

- [ ] Add comments only where behavior is non-obvious: engine no-ops, throw-plus-store error paths, optimistic seek rules, stale event guard, store reference-change contract, controller init guards, `AudioSource` lifecycle order, decorative player-shell labels.
- [ ] Update diagrams to include `destroy()`, controller layer, runtime helpers, and any internal-only members that need explicit labeling.
- [ ] Re-read docs against shipped code after `#5` through `#11`; docs should describe what exists, not what was planned earlier.
- [ ] Verify docs render cleanly and referenced names match code.
- [ ] Run final repo verification:
Run: `bun run test -- --filter=@kkb/audio --filter=@kkb/web --filter=@kkb/ui`
Run: `bun run check-types -- --filter=@kkb/audio --filter=@kkb/web --filter=@kkb/ui`
Run: `bun run format-and-lint`
- [ ] Commit:
Run: `git commit -m "docs: align audio docs with shipped behavior"`

## Exit Criteria

- Issues `#5` through `#8` are closed with behavior changes and coverage merged in dependency order.
- Issues `#9` through `#11` change internals and types without re-opening behavior questions.
- Issue `#12` reflects the code that shipped after all prior tasks.
- Final verification passes with Bun/Turbo commands only.
