# Web Audio Player Phase 1 Track Catalog Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the hard-coded demo track with a static track catalog and host-side controller that select tracks by `trackId` while preserving engine-owned backend selection.

**Architecture:** Keep `packages/audio` unchanged for transport, source ranking, and fallback. Add a static catalog and `PlayerController` in `apps/web`. The controller composes `WebPlayer`, resolves `TrackRecord` to `TrackInput`, and exposes one subscribed snapshot that merges app-level catalog/selection state with engine runtime state. Render a simple selector in the web host without introducing persistence in this phase.

**Tech Stack:** Bun workspaces, Turborepo, TypeScript 5.9 strict mode, React 19, Next.js 16, Bun test, `useSyncExternalStore`.

---

## Scope

1. Add `TrackRecord`, `TrackAsset`, catalog interfaces, and a static in-repo catalog.
2. Add a host-side `PlayerController` that wraps `WebPlayer`.
3. Replace hard-coded `defaultTrack` loading in `PlayerClient` with `trackId`-based selection.
4. Add a simple track selector UI for the static catalog.
5. Keep `packages/audio` source selection and runtime recovery behavior unchanged.
6. Do not add `localStorage`, IndexedDB, Media Session, queueing, or remote catalog fetching in this phase.

## Chunk 1: Static Catalog and Controller

### Task 1: Define track types and a static catalog

**Files:**
- Create: `apps/web/lib/audio/catalog/track-types.ts`
- Create: `apps/web/lib/audio/catalog/track-catalog.ts`
- Create: `apps/web/lib/audio/catalog/static-track-catalog-data.ts`
- Create: `apps/web/lib/audio/catalog/static-track-catalog.ts`
- Test: `apps/web/lib/audio/catalog/__tests__/static-track-catalog.test.ts`

- [ ] **Step 1: Write the failing catalog test**

Create a test that asserts:
1. the static catalog returns the existing AAC and Opus fixtures as stable `trackId` records
2. `getTrack(id)` returns the correct `TrackRecord`
3. the catalog exposes a deterministic default track id

Run: `bun test apps/web/lib/audio/catalog/__tests__/static-track-catalog.test.ts`
Expected: FAIL because the catalog modules do not exist yet.

- [ ] **Step 2: Implement the catalog types and static data**

Add:
1. `TrackId`, `TrackAsset`, and `TrackRecord` in `track-types.ts`
2. a `TrackCatalog` interface with `listTracks()`, `getTrack(trackId)`, and `getDefaultTrackId()`
3. `static-track-catalog-data.ts` with at least the current AAC and Opus fixture entries, using stable IDs:
   - `test-tone-aac`
   - `test-tone-opus`
4. `static-track-catalog.ts` that serves deterministic records from the static data module

Implementation constraints:
1. Use `mimeType` as the required asset discriminator
2. keep `codec` optional metadata only
3. keep track ids stable and human-readable

- [ ] **Step 3: Run the catalog test to verify it passes**

Run: `bun test apps/web/lib/audio/catalog/__tests__/static-track-catalog.test.ts`
Expected: PASS.

- [ ] **Step 4: Commit the catalog slice**

```bash
git add apps/web/lib/audio/catalog
git commit -m "feat: add static web audio track catalog"
```

### Task 2: Add the host-side player controller

**Files:**
- Create: `apps/web/lib/audio/controller/player-controller.ts`
- Test: `apps/web/lib/audio/controller/__tests__/player-controller.test.ts`

- [ ] **Step 1: Write the failing controller test**

Create a test with a fake catalog and fake `WebPlayer` that verifies:
1. `init()` selects the catalog default track id
2. `selectTrack(trackId)` resolves a `TrackRecord` to the expected `TrackInput`
3. the controller calls `player.loadTrack(...)`
4. `getSnapshot()` composes `selectedTrackId`, `selectedTrack`, chosen asset, and the engine runtime snapshot
5. `play()`, `pause()`, and `seek()` delegate to the wrapped player

Run: `bun test apps/web/lib/audio/controller/__tests__/player-controller.test.ts`
Expected: FAIL because the controller does not exist.

Test double note:
1. treat `WebPlayer` as a duck-typed dependency in controller tests
2. mock only the subset required by the controller: `getSnapshot`, `subscribe`, `loadTrack`, `play`, `pause`, `seek`, and `destroy`
3. do not couple the test to the full concrete return value of `createWebPlayer()`

- [ ] **Step 2: Implement the controller**

Add:
1. a `PlayerControllerSnapshot` type matching the revised spec
2. `createPlayerController({ player, catalog })`
3. subscription behavior that mirrors `useSyncExternalStore` expectations
4. `init()` that loads the catalog default track through the wrapped `WebPlayer` and behaves idempotently
5. `selectTrack(trackId)` that resolves the track, picks a deterministic asset, and calls `player.loadTrack`
6. snapshot updates that merge controller-owned fields with `player.getSnapshot()`

Implementation constraints:
1. do not reimplement engine source selection in the controller
2. do not add persistence in this phase
3. keep the controller as composition around `WebPlayer`, not a replacement for it
4. for rapid successive selections, treat the newest selection as authoritative and rely on the current engine replacement-load behavior unless a real race condition appears during implementation

- [ ] **Step 3: Run the controller test to verify it passes**

Run: `bun test apps/web/lib/audio/controller/__tests__/player-controller.test.ts`
Expected: PASS.

- [ ] **Step 4: Commit the controller slice**

```bash
git add apps/web/lib/audio/controller
git commit -m "feat: add web audio player controller"
```

### Task 3: Wire `PlayerClient` to the controller and remove hard-coded loading

**Files:**
- Create: `apps/web/lib/audio/use-player-controller.ts`
- Modify: `apps/web/components/audio/player-client.tsx`
- Test: `apps/web/components/audio/__tests__/player-client.test.tsx`

- [ ] **Step 1: Write the failing integration test**

Extend `player-client.test.tsx` to verify:
1. server rendering still does not instantiate browser audio objects
2. the client entrypoint no longer calls `player.loadTrack(player.defaultTrack)` directly
3. controller initialization is the path that triggers the first track load

Run: `bun test apps/web/components/audio/__tests__/player-client.test.tsx`
Expected: FAIL because the client still hard-codes `defaultTrack`.

- [ ] **Step 2: Implement controller wiring**

Add:
1. `use-player-controller.ts` using `useSyncExternalStore`
2. controller creation in `PlayerClient` only after the `WebPlayer` instance exists
3. controller-driven initial load in place of `player.defaultTrack`
4. `PlayerShell` props sourced from controller snapshot runtime state

Implementation constraints:
1. keep the concrete `player` instance available to `PlayerShell` for timeline and buffered-range reads
2. preserve the existing async rejection logging for load, play, pause, seek, and destroy
3. do not remove `createWebPlayer()` or move engine logic into React
4. create and initialize the controller in the same client lifecycle that creates the player, or in a directly dependent follow-up effect, so the controller never exists without a player

- [ ] **Step 3: Run the client tests**

Run: `bun test apps/web/components/audio/__tests__/player-client.test.tsx`
Expected: PASS.

- [ ] **Step 4: Commit the host wiring slice**

```bash
git add apps/web/components/audio apps/web/lib/audio
git commit -m "refactor: drive web audio player from controller state"
```

### Task 4: Add a basic track selector UI

**Files:**
- Create: `apps/web/components/audio/track-selector.tsx`
- Test: `apps/web/components/audio/__tests__/track-selector.test.tsx`
- Modify: `apps/web/components/audio/player-client.tsx`

- [ ] **Step 1: Write the failing selector test**

Create a test that verifies:
1. all catalog tracks render as selectable options
2. the selected option reflects `selectedTrackId`
3. changing selection calls the provided `onSelectTrack(trackId)` handler

Run: `bun test apps/web/components/audio/__tests__/track-selector.test.tsx`
Expected: FAIL because the selector component does not exist.

- [ ] **Step 2: Implement the selector and host rendering**

Add:
1. a minimal accessible track selector component
2. rendering of the selector above or beside the existing `PlayerShell`
3. controller-backed `onSelectTrack` wiring in `PlayerClient`

Implementation constraints:
1. keep the UI intentionally simple in this phase
2. do not bake queue or playlist behavior into the selector
3. preserve the existing player shell visual treatment

- [ ] **Step 3: Run the selector test**

Run: `bun test apps/web/components/audio/__tests__/track-selector.test.tsx`
Expected: PASS.

- [ ] **Step 4: Commit the selector slice**

```bash
git add apps/web/components/audio
git commit -m "feat: add web audio track selector"
```

### Task 5: Verify the full Phase 1 slice

**Files:**
- Verify only: `apps/web/components/audio/*`
- Verify only: `apps/web/lib/audio/*`

- [ ] **Step 1: Run focused tests**

Run: `bun test apps/web/lib/audio/catalog apps/web/lib/audio/controller apps/web/components/audio`
Expected: PASS.

- [ ] **Step 2: Run typecheck**

Run: `bun run check-types`
Expected: PASS.

- [ ] **Step 3: Run formatting and lint checks**

Run: `bun run format-and-lint`
Expected: PASS.

- [ ] **Step 4: Review behavior manually**

Run: `bunx turbo run dev --filter=@kkb/web`
Expected: the `/audio` page renders a selector, loads the default catalog track through the controller, and switching tracks reloads the player without changing engine-owned backend selection behavior.
Note: local-only verification step; not a CI gate.

- [ ] **Step 5: Commit any final cleanups**

```bash
git add apps/web docs/specs docs/plans
git commit -m "feat: add phase 1 web audio track selection"
```

## Notes for Implementation

1. Keep `packages/audio` untouched unless a failing host integration test proves a real API gap.
2. If controller composition needs one small addition to `WebPlayer`, document the reason before changing the factory surface.
3. Defer persistence immediately if it starts to distort the controller API. That belongs to Phase 2.
