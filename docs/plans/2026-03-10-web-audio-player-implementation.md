# Web Audio Player Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a production-ready web audio player around a single `@kkb/audio` package, with engine-owned fallback, a scoped WebCodecs path, and an adapted ElevenLabs-based UI in `apps/web`.

**Architecture:** Keep core runtime logic in `packages/audio`, organized by internal module boundaries instead of multiple workspaces. Put reusable React UI in `packages/ui` and browser-specific composition in `apps/web`. The engine is responsible for source ranking, fallback attempts, retry policy, and checkpoint restore. UI components render state from the engine and issue intents back into it.

**Tech Stack:** Bun workspaces, Turborepo, TypeScript 5.9 strict mode, React 19.2, Next.js 16, Web Audio API, AudioWorklet, Web Workers, WebCodecs, Biome.

---

## Plan Constraints

1. Keep core runtime code in `packages/audio` as `@kkb/audio`.
2. Do not add React dependencies to `@kkb/audio`.
3. Treat the WebCodecs matrix as explicit allowlist behavior, not best-effort experimentation.
4. Use TDD for engine behavior, source selection, recovery policy, and codec gating.
5. Use adapted ElevenLabs UI patterns, but do not use their provider as the playback authority.
6. Root scripts continue to delegate through `turbo run`.

## Task 1: Scaffold `@kkb/audio` and Test Plumbing

**Files:**
- Create: `packages/audio/package.json`
- Create: `packages/audio/tsconfig.json`
- Create: `packages/audio/src/index.ts`
- Create: `packages/audio/src/contracts/index.ts`
- Create: `packages/audio/src/engine/index.ts`
- Create: `packages/audio/src/sources/index.ts`
- Create: `packages/audio/src/worklet/index.ts`
- Create: `packages/audio/src/metrics/index.ts`
- Modify: `package.json`
- Modify: `turbo.json`

**Step 1: Confirm the current task baseline**

Inspect:
1. Root `package.json` scripts
2. `turbo.json` tasks
3. Existing package naming conventions

This is setup work, not behavioral TDD. The first meaningful failing tests begin in Task 2.

**Step 2: Add the new package manifest and TS config**

Add `packages/audio/package.json` with:
1. `name: "@kkb/audio"`
2. `exports` for `.`, `./contracts`, `./engine`, `./sources`, `./worklet`, `./metrics`
3. `scripts` for `check-types` and `test`

Add `packages/audio/tsconfig.json` extending `@kkb/typescript-config/base.json`.

**Step 3: Add root delegation and turbo registration**

Add:
1. `"test": "turbo run test"` to the root `package.json`
2. `"test": { "dependsOn": ["^test"] }` to `turbo.json`

**Step 4: Verify the scaffold**

Run: `turbo run check-types --filter=@kkb/audio`  
Expected: PASS.

Run: `turbo run test --filter=@kkb/audio`  
Expected: PASS with zero tests.

**Step 5: Commit**

```bash
git add package.json turbo.json packages/audio
git commit -m "feat: scaffold @kkb/audio workspace"
```

## Task 2: Define Contracts, Codec Matrix, and Error Taxonomy

**Files:**
- Create: `packages/audio/src/contracts/types.ts`
- Create: `packages/audio/src/contracts/codecs.ts`
- Create: `packages/audio/src/contracts/errors.ts`
- Create: `packages/audio/src/contracts/__tests__/codecs.test.ts`
- Modify: `packages/audio/src/contracts/index.ts`
- Modify: `packages/audio/src/index.ts`

**Step 1: Write the failing codec eligibility test**

Create a test that asserts:
1. `audio/webm; codecs=opus` is WebCodecs-eligible
2. `audio/mp4; codecs=mp4a.40.2` is WebCodecs-eligible
3. `audio/flac` is not WebCodecs-eligible

Run: `bun test packages/audio/src/contracts/__tests__/codecs.test.ts`  
Expected: FAIL because the matrix helpers do not exist.

**Step 2: Implement the contract types**

Define:
1. `TrackInput`
2. `SourceCapabilities`
3. `SourceScoreContext`
4. `TimelineSnapshot`
5. Error classes for network, decode, unsupported, gesture, worklet, and interruption faults

**Step 3: Implement codec matrix helpers**

Add helpers such as:
1. `isWebCodecsEligibleInput(input)`
2. `isMediaElementEligibleInput(input)`
3. `normalizeMimeType(input)`

**Step 4: Verify**

Run: `turbo run test --filter=@kkb/audio`  
Expected: PASS.

Run: `turbo run check-types --filter=@kkb/audio`  
Expected: PASS.

**Step 5: Commit**

```bash
git add packages/audio
git commit -m "feat: add audio runtime contracts and codec matrix"
```

## Task 3: Implement the Player Store and Engine Recovery Loop

**Files:**
- Create: `packages/audio/src/engine/store.ts`
- Create: `packages/audio/src/engine/checkpoint.ts`
- Create: `packages/audio/src/engine/engine.ts`
- Create: `packages/audio/src/engine/__tests__/store.test.ts`
- Create: `packages/audio/src/engine/__tests__/engine-recovery.test.ts`
- Modify: `packages/audio/src/engine/index.ts`

**Step 1: Write the failing recovery test**

Create a test that:
1. Creates two stub sources
2. Forces the first source to fail `load()`
3. Confirms the engine falls back to the second source
4. Confirms the checkpoint time is preserved

Run: `bun test packages/audio/src/engine/__tests__/engine-recovery.test.ts`  
Expected: FAIL because the engine does not yet own fallback logic.

**Step 2: Write the failing store transition test**

Create a test for:
1. `idle -> loading -> ready`
2. `ready -> playing`
3. `playing -> recovering -> playing`

Run: `bun test packages/audio/src/engine/__tests__/store.test.ts`  
Expected: FAIL because the store is not implemented.

**Step 3: Implement minimal store, checkpoint, and engine lifecycle**

Add:
1. A store with snapshot + subscribe behavior
2. Checkpoint read/write helpers
3. Engine methods for `load`, `play`, `pause`, `seek`, `setRate`, `setVolume`
4. Ordered source attempts with failure classification and retry/fallback behavior

**Step 4: Verify**

Run: `turbo run test --filter=@kkb/audio`  
Expected: PASS.

**Step 5: Commit**

```bash
git add packages/audio
git commit -m "feat: add engine store and fallback recovery loop"
```

## Task 4: Implement `MediaElementSource` and `FallbackSource`

**Files:**
- Create: `packages/audio/src/sources/media-element-source.ts`
- Create: `packages/audio/src/sources/fallback-source.ts`
- Create: `packages/audio/src/sources/__tests__/media-element-source.test.ts`
- Create: `packages/audio/src/sources/__tests__/fallback-source.test.ts`
- Modify: `packages/audio/src/sources/index.ts`

**Step 1: Write the failing media-element source test**

Create a test that verifies:
1. `load()` assigns the source URL
2. `play()` delegates to the element
3. `seek()` updates `currentTime`
4. `destroy()` clears the element

Run: `bun test packages/audio/src/sources/__tests__/media-element-source.test.ts`  
Expected: FAIL because the source implementation does not exist.

**Step 2: Write the failing fallback source test**

Create a test that verifies:
1. The fallback source exposes lower score/capabilities than the media-element source
2. It can still load and play a compatible input

Run: `bun test packages/audio/src/sources/__tests__/fallback-source.test.ts`  
Expected: FAIL because the fallback source does not exist.

**Step 3: Implement the two sources**

Important constraints:
1. Keep each source instance isolated
2. Do not share mutable element state between distinct source instances in tests
3. Report capability differences explicitly

**Step 4: Verify**

Run: `turbo run test --filter=@kkb/audio`  
Expected: PASS.

Run: `turbo run check-types --filter=@kkb/audio`  
Expected: PASS.

**Step 5: Commit**

```bash
git add packages/audio
git commit -m "feat: add media element and compatibility sources"
```

## Task 5: Add Worklet Transport and Metrics Foundations

**Files:**
- Create: `packages/audio/src/worklet/postmessage-queue.ts`
- Create: `packages/audio/src/worklet/sab-ring-buffer.ts`
- Create: `packages/audio/src/worklet/register-worklet.ts`
- Create: `packages/audio/src/worklet/__tests__/postmessage-queue.test.ts`
- Create: `packages/audio/src/worklet/__tests__/sab-ring-buffer.test.ts`
- Create: `packages/audio/src/metrics/create-metrics.ts`
- Create: `packages/audio/src/metrics/__tests__/create-metrics.test.ts`
- Create: `apps/web/public/worklets/kkb-audio-processor.js`
- Modify: `packages/audio/src/worklet/index.ts`
- Modify: `packages/audio/src/metrics/index.ts`

**Step 1: Write the failing postMessage queue test**

Verify:
1. Out-of-order stale chunks are ignored
2. Chunks are read in sequence order

Run: `bun test packages/audio/src/worklet/__tests__/postmessage-queue.test.ts`  
Expected: FAIL because the queue is missing.

**Step 2: Write the failing metrics test**

Verify:
1. Underruns increment
2. Fallback attempts increment with source ids
3. Selection reason codes are recorded

Run: `bun test packages/audio/src/metrics/__tests__/create-metrics.test.ts`  
Expected: FAIL because metrics helpers do not exist.

**Step 3: Implement Tier A/Tier B primitives and metrics**

Add:
1. `createChunkQueue`
2. `createSABRingBuffer`
3. Metrics snapshot and increment APIs
4. A browser-ready worklet entry at `apps/web/public/worklets/kkb-audio-processor.js` that matches the processor contract expected by `register-worklet.ts`

**Step 4: Verify**

Run: `turbo run test --filter=@kkb/audio`  
Expected: PASS.

**Step 5: Commit**

```bash
git add packages/audio apps/web/public/worklets
git commit -m "feat: add worklet transport primitives and metrics"
```

## Task 6: Implement `WorkletPCMSource`

**Files:**
- Create: `packages/audio/src/sources/worklet-pcm-source.ts`
- Create: `packages/audio/src/sources/__tests__/worklet-pcm-source.test.ts`
- Modify: `packages/audio/src/sources/index.ts`
- Modify: `packages/audio/src/engine/engine.ts`

**Step 1: Write the failing worklet source test**

Verify:
1. `WorkletPCMSource` reports sample-accurate seek capability
2. `play`, `pause`, and `seek` commands are forwarded over the selected transport
3. The source can expose timeline snapshots needed by the engine

Run: `bun test packages/audio/src/sources/__tests__/worklet-pcm-source.test.ts`  
Expected: FAIL because the source does not exist.

**Step 2: Write the failing engine selection test**

Verify:
1. The engine prefers `WorkletPCMSource` over `FallbackSource` when worklet transport is available and WebCodecs is ineligible
2. The engine falls through cleanly when the worklet path is unavailable

Run: `bun test packages/audio/src/engine/__tests__/engine-recovery.test.ts`  
Expected: FAIL before `WorkletPCMSource` is wired into source ordering.

**Step 3: Implement the source**

Add:
1. Tier A and Tier B transport integration points
2. Capability reporting for sample-accurate seek and gapless behavior
3. Source scoring that keeps it below an eligible WebCodecs path and above compatibility fallback

**Step 4: Verify**

Run: `turbo run test --filter=@kkb/audio`  
Expected: PASS.

Run: `turbo run check-types --filter=@kkb/audio`  
Expected: PASS.

**Step 5: Commit**

```bash
git add packages/audio
git commit -m "feat: add worklet pcm source"
```

## Task 7: Implement `WebCodecsSource` as a Scoped, Gated Path

**Files:**
- Create: `packages/audio/src/sources/webcodecs-source.ts`
- Create: `packages/audio/src/sources/webcodecs-demux.ts`
- Create: `packages/audio/src/sources/__tests__/webcodecs-source.test.ts`
- Create: `packages/audio/src/sources/__tests__/webcodecs-demux.test.ts`
- Modify: `packages/audio/src/sources/index.ts`
- Modify: `packages/audio/src/engine/engine.ts`

**Step 1: Write the failing source gate test**

Verify:
1. `WebCodecsSource` is ineligible when `AudioDecoder` is missing
2. It is ineligible for unsupported mime types
3. It is eligible only when the input is on the declared allowlist

Run: `bun test packages/audio/src/sources/__tests__/webcodecs-source.test.ts`  
Expected: FAIL because the gate and source do not exist.

**Step 2: Write the failing fallback preference test**

Verify:
1. The engine prefers `WebCodecsSource` for allowlisted inputs on supported environments
2. The engine falls back to `MediaElementSource` on WebCodecs init or decode failure

Run: `bun test packages/audio/src/engine/__tests__/engine-recovery.test.ts`  
Expected: FAIL before wiring the new source into selection order.

**Step 3: Implement the minimal supported path**

Add:
1. A demux abstraction restricted to the allowlisted formats
2. Support checks based on browser globals and input type
3. Engine scoring that only favors WebCodecs when it is truly eligible

**Step 4: Verify**

Run: `turbo run test --filter=@kkb/audio`  
Expected: PASS.

Run: `turbo run check-types --filter=@kkb/audio`  
Expected: PASS.

**Step 5: Commit**

```bash
git add packages/audio
git commit -m "feat: add scoped webcodecs source path"
```

## Task 8: Add Reusable UI Components Based on ElevenLabs Patterns

**Files:**
- Create: `packages/ui/src/components/audio/presenter.ts`
- Create: `packages/ui/src/components/audio/__tests__/player-presenter.test.ts`
- Create: `packages/ui/src/components/audio/player-controls.tsx`
- Create: `packages/ui/src/components/audio/waveform.tsx`
- Create: `packages/ui/src/components/audio/playhead.tsx`
- Create: `packages/ui/src/components/audio/index.ts`
- Modify: `packages/ui/package.json`

**Step 1: Write the failing UI view-model test**

Extract and test a pure presenter helper that maps engine state to UI props:
1. Play/pause disabled states
2. Current-time formatting
3. Buffered-range display data

Run: `bun test packages/ui/src/components/audio/__tests__/player-presenter.test.ts`  
Expected: FAIL because the presenter helper does not exist.

**Step 2: Implement repo-owned UI components**

Important constraints:
1. Follow ElevenLabs interaction and composition patterns where useful
2. Do not import or mount ElevenLabs playback providers
3. Accept state and callbacks from the host adapter rather than owning transport state

**Step 3: Export the components from `@kkb/ui`**

Add:
1. Export paths for the new audio components
2. A package-level `"test": "bun test"` script in `packages/ui/package.json`

**Step 4: Verify**

Run: `turbo run check-types --filter=@kkb/ui`  
Expected: PASS.

Run: `turbo run test --filter=@kkb/ui`  
Expected: PASS.

**Step 5: Commit**

```bash
git add packages/ui
git commit -m "feat: add audio ui components based on elevenlabs patterns"
```

## Task 9: Integrate the Player into `apps/web`

**Files:**
- Create: `apps/web/app/audio/page.tsx`
- Create: `apps/web/components/audio/player-shell.tsx`
- Create: `apps/web/components/audio/player-client.tsx`
- Create: `apps/web/lib/audio/create-web-player.ts`
- Create: `apps/web/lib/audio/use-player-store.ts`
- Create: `apps/web/lib/audio/__tests__/create-web-player.test.ts`
- Create: `apps/web/public/audio/test-tone-opus.webm`
- Create: `apps/web/public/audio/test-tone-aac.m4a`
- Modify: `apps/web/package.json`

**Step 1: Write the failing host adapter test**

Verify:
1. `createWebPlayer()` creates the engine
2. It registers the desired source factories
3. It exposes `getSnapshot` and `subscribe` surfaces needed by `useSyncExternalStore`

Run: `bun test apps/web/lib/audio/__tests__/create-web-player.test.ts`  
Expected: FAIL because the host adapter does not exist.

**Step 2: Implement the browser-only player factory**

Important constraints:
1. Create `Audio`, `AudioContext`, and worklet objects only in client code
2. Do not instantiate browser audio primitives in a server component
3. Keep `page.tsx` as a thin route entry that renders a client boundary
4. Resolve the worklet URL from `/worklets/kkb-audio-processor.js`

**Step 3: Wire the shell UI**

Compose:
1. `PlayerControls`
2. `Waveform`
3. Playback metadata
4. Fallback/diagnostic indicators when useful
5. Deterministic local fixtures from `apps/web/public/audio/test-tone-opus.webm` and `apps/web/public/audio/test-tone-aac.m4a`

Also add a package-level `"test": "bun test"` script in `apps/web/package.json`.

**Step 4: Verify**

Run: `turbo run check-types --filter=@kkb/web`  
Expected: PASS.

Run: `turbo run test --filter=@kkb/web`  
Expected: PASS.

Run: `turbo run dev --filter=@kkb/web`  
Expected: `/audio` renders and playback works from a test input.

**Step 5: Commit**

```bash
git add apps/web
git commit -m "feat: integrate web audio player route"
```

## Task 10: Add Docs for Release Gating and Browser Validation

**Files:**
- Create: `docs/specs/2026-03-10-web-audio-player-codec-matrix.md`
- Create: `docs/specs/2026-03-10-web-audio-player-qa-matrix.md`
- Create: `docs/specs/2026-03-10-web-audio-player-runbook.md`
- Modify: `README.md`

**Step 1: Write the codec matrix doc**

Include:
1. Supported mime types
2. Eligible sources by mime type
3. Fallback path when preferred source init fails

**Step 2: Write the QA matrix doc**

Include:
1. Chrome, Firefox, Safari desktop
2. iOS Safari
3. `SAB` enabled and disabled environments
4. WebCodecs eligible and ineligible inputs
5. Cross-origin isolation validation for `SharedArrayBuffer` browser deployment behavior

**Step 3: Write the runbook**

Include:
1. Error taxonomy
2. Fallback debugging workflow
3. Metrics to inspect before filing a runtime bug

**Step 4: Verify**

Run: `bun run format-and-lint`  
Expected: PASS.

Run: `bun run check-types`  
Expected: PASS.

Run: `bun run test`  
Expected: PASS.

**Step 5: Commit**

```bash
git add README.md docs/specs
git commit -m "docs: add audio player validation and operations docs"
```

## Final Verification Gate

Run all:

```bash
bun run format-and-lint
bun run check-types
bun run test
```

Expected:
1. Zero lint, type, and test failures
2. `/audio` works in `apps/web`
3. Forced `WebCodecsSource` init failure falls back to `MediaElementSource`
4. Unsupported mime types bypass WebCodecs and pick a compatible source
5. UI remains bound to engine state rather than an external playback provider
