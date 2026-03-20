# Audio Follow-Up Stack Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the remaining audio follow-up issues `#9`, `#10`, `#11`, and `#12` without reopening settled behavior work from `#5` through `#8`.

**Architecture:** Keep the remaining work in strict order: remove dead runtime abstractions first, then do the shallow runtime-only dedupe, then tighten types on top of the deduped shape, and only then refresh comments/docs to match shipped code. Keep `@kkb/audio` ownership in the runtime layer, keep `apps/web` ownership in catalog/controller integration, and keep `@kkb/ui` isolated from runtime-only cleanup.

**Tech Stack:** Bun, Turbo, TypeScript, React 19, Next.js 16, `bun test`, `tsc`, Biome, GitHub issues.

---

## Scope

- Closed already: `#5`, `#6`, `#7`, `#8`
- Remaining stack: `#9` -> `#10` -> `#11` -> `#12`

## Execution Order

1. `#9` remove dead typed errors
2. `#10` dedupe runtime-only HTML-audio internals
3. `#11` tighten type contracts
4. `#12` refresh comments, diagrams, and stale specs

## Unresolved Questions

- None

## File Map

- `packages/audio/src/contracts/errors.ts`
  Dead typed error hierarchy candidate for deletion in `#9`
- `packages/audio/src/sources/media-element-source.ts`
  One half of the HTML-audio duplication to collapse in `#10`
- `packages/audio/src/sources/fallback-source.ts`
  Other half of the HTML-audio duplication to collapse in `#10`
- `packages/audio/src/sources/audio-source.ts`
  Shared runtime types and `PlaybackEvent` shape touched in `#10` and `#11`
- `packages/audio/src/contracts/types.ts`
  Runtime type tightening target in `#10` and `#11`
- `packages/audio/src/engine/store.ts`
  Runtime snapshot types touched in `#10` and `#11`
- `packages/audio/src/engine/checkpoint.ts`
  Checkpoint type tightening target in `#11`
- `apps/web/lib/audio/create-web-player.ts`
  Host wrapper still carries a local `AudioElementLike`; must align to the canonical runtime type in `#10`
- `apps/web/lib/audio/catalog/track-types.ts`
  Raw vs validated track typing split in `#11`
- `apps/web/lib/audio/catalog/select-track-asset.ts`
  Non-empty asset contract consumer in `#11`
- `apps/web/lib/audio/controller/player-controller.ts`
  Type tightening and comment refresh target in `#11` and `#12`
- `apps/web/components/audio/track-selector.tsx`
  Validated track type consumer in `#11`
- `apps/web/components/audio/player-shell.tsx`
  Comment/doc refresh target in `#12`
- `packages/ui/src/components/audio/player-controls.tsx`
  Shared control ownership comments target in `#12`
- `docs/diagrams/2026-03-10-web-audio-player-architecture.md`
  Must be refreshed in `#12`
- `docs/diagrams/2026-03-10-web-audio-player-flows.md`
  Must be refreshed in `#12`
- `docs/specs/2026-03-12-web-audio-player-track-loading-selection-storage.md`
  Already stale; must be refreshed in `#12`
- `docs/specs/web-audio-player-rfc.md`
  Legacy typed-error taxonomy may need refresh in `#12` after `#9`

### Task 1: Issue `#9` Remove Dead Typed Error Hierarchy

**Files:**
- Modify: `packages/audio/src/contracts/errors.ts`
- Modify: `packages/audio/src/engine/engine.ts` only if imports or mappings still exist
- Modify: `packages/audio/src/sources/media-element-source.ts` only if imports or mappings still exist
- Modify: `packages/audio/src/sources/fallback-source.ts` only if imports or mappings still exist
- Test: `packages/audio/src/engine/__tests__/engine-runtime.test.ts`
- Test: `packages/audio/src/sources/__tests__/media-element-source.test.ts`

- [ ] **Step 1: Confirm there are no live typed-error consumers**
Run: `rg -n "NetworkError|DecodeError|UnsupportedError|UserGestureRequiredError|WorkletError|InterruptionError|contracts/errors" packages apps docs`
Expected: only dead definitions or issue/docs references remain

- [ ] **Step 2: Write the failing test or snapshot expectation only if needed**
Use TDD only if removing the file requires changing a runtime-facing assertion; otherwise skip to deletion because this issue is dead-code cleanup, not behavior change.

- [ ] **Step 3: Delete the dead hierarchy**
Delete `packages/audio/src/contracts/errors.ts` and remove any now-unused imports.

- [ ] **Step 4: Run focused verification**
Run: `bun test packages/audio/src/engine/__tests__/engine-runtime.test.ts packages/audio/src/sources/__tests__/media-element-source.test.ts`
Expected: PASS

- [ ] **Step 5: Run package verification**
Run: `bun run test -- --filter=@kkb/audio`
Run: `bun run check-types -- --filter=@kkb/audio`
Expected: PASS

- [ ] **Step 6: Commit**
Run: `git commit -m "refactor: remove dead audio error types (#9)"`

### Task 2: Issue `#10` Dedupe Runtime-Only HTML-Audio Internals

**Files:**
- Modify: `packages/audio/src/sources/media-element-source.ts`
- Modify: `packages/audio/src/sources/fallback-source.ts`
- Create: `packages/audio/src/sources/media-element-shared.ts`
- Modify: `packages/audio/src/sources/audio-source.ts` only if shared runtime types belong there
- Modify: `packages/audio/src/contracts/types.ts` only if shared runtime types belong there
- Modify: `apps/web/lib/audio/create-web-player.ts`
- Test: `packages/audio/src/sources/__tests__/media-element-source.test.ts`
- Test: `packages/audio/src/sources/__tests__/fallback-source.test.ts`
- Test: `apps/web/lib/audio/__tests__/create-web-player.test.ts`

- [ ] **Step 1: Write the smallest failing regression if extraction changes a shared branch**
Add one regression only if the extraction changes behavior-sensitive code paths. Do not create tests for the helper itself.

- [ ] **Step 2: Extract shallow shared HTML-audio helpers**
Move only duplicated `AudioElementLike` / `MediaErrorLike` and shared load/play/pause/seek/rate/volume/error mapping behavior into `media-element-shared.ts`.
GitHub issue `#10` intentionally excludes presenter-local types such as `AudioPlayerStatus` and `BufferedRange`.

- [ ] **Step 3: Point the web host at the canonical runtime type**
Update `apps/web/lib/audio/create-web-player.ts` to consume the shared `AudioElementLike` instead of keeping a third local copy.

- [ ] **Step 4: Keep source-specific identity local**
Leave `id`, `score`, and any source-specific semantics in the public source factories.

- [ ] **Step 5: Verify focused suites**
Run: `bun test packages/audio/src/sources/__tests__/media-element-source.test.ts packages/audio/src/sources/__tests__/fallback-source.test.ts apps/web/lib/audio/__tests__/create-web-player.test.ts`
Expected: PASS

- [ ] **Step 6: Verify impacted workspaces**
Run: `bun run test -- --filter=@kkb/audio --filter=@kkb/web`
Run: `bun run check-types -- --filter=@kkb/audio --filter=@kkb/web`
Expected: PASS

- [ ] **Step 7: Commit**
Run: `git commit -m "refactor: dedupe audio html sources (#10)"`

### Task 3: Issue `#11` Tighten Type Contracts

**Files:**
- Modify: `packages/audio/src/contracts/types.ts`
- Modify: `packages/audio/src/sources/audio-source.ts`
- Modify: `packages/audio/src/engine/store.ts`
- Modify: `packages/audio/src/engine/checkpoint.ts`
- Modify: `apps/web/lib/audio/catalog/track-types.ts`
- Modify: `apps/web/lib/audio/catalog/static-track-catalog-data.ts`
- Modify: `apps/web/lib/audio/catalog/static-track-catalog.ts`
- Modify: `apps/web/lib/audio/catalog/select-track-asset.ts`
- Modify: `apps/web/lib/audio/catalog/track-catalog.ts` only if validated types need to flow through the catalog boundary
- Modify: `apps/web/lib/audio/controller/player-controller.ts`
- Modify: `apps/web/components/audio/player-client.tsx` if default selection and placeholder flows move to validated track types
- Modify: `apps/web/components/audio/track-selector.tsx`
- Test: `packages/audio/src/contracts/__tests__/codecs.test.ts`
- Test: `packages/audio/src/engine/__tests__/store.test.ts`
- Test: `apps/web/lib/audio/controller/__tests__/player-controller.test.ts`
- Test: `apps/web/lib/audio/catalog/__tests__/select-track-asset.test.ts`
- Test: `apps/web/components/audio/__tests__/player-client.test.tsx` if the validated-type boundary reaches the client shell
- Test: `apps/web/components/audio/__tests__/track-selector.test.tsx`

- [ ] **Step 1: Write the failing type/test assertions first**
Start with non-empty `TrackRecord.assets` and any `readonly` breakage at the call boundaries.

- [ ] **Step 2: Introduce raw vs validated track types**
Keep ingest-time raw tolerance, but make the controller/UI path consume a validated non-empty asset shape.

- [ ] **Step 3: Tighten runtime snapshot types**
Add `readonly` where snapshots and capabilities should not be mutated by consumers.

- [ ] **Step 4: Convert `PlaybackEvent` into a discriminated union**
Do this without forcing optional runtime APIs to exist where they do not belong.

- [ ] **Step 5: Remove casts and simplify**
Use the stronger types to delete branching/casts rather than layering new ones on top.

- [ ] **Step 6: Verify focused suites**
Run: `bun test packages/audio/src/contracts/__tests__/codecs.test.ts packages/audio/src/engine/__tests__/store.test.ts apps/web/lib/audio/controller/__tests__/player-controller.test.ts apps/web/lib/audio/catalog/__tests__/select-track-asset.test.ts apps/web/components/audio/__tests__/track-selector.test.tsx`
Expected: PASS

- [ ] **Step 7: Verify impacted workspaces**
Run: `bun run test -- --filter=@kkb/audio --filter=@kkb/web`
Run: `bun run check-types -- --filter=@kkb/audio --filter=@kkb/web`
Expected: PASS

- [ ] **Step 8: Commit**
Run: `git commit -m "refactor: tighten audio type contracts (#11)"`

### Task 4: Issue `#12` Refresh Comments, Diagrams, And Specs

**Files:**
- Modify: `packages/audio/src/engine/engine.ts`
- Modify: `packages/audio/src/engine/store.ts`
- Modify: `packages/audio/src/sources/audio-source.ts`
- Modify: `apps/web/lib/audio/controller/player-controller.ts`
- Modify: `apps/web/components/audio/player-shell.tsx`
- Modify: `packages/ui/src/components/audio/player-controls.tsx`
- Modify: `docs/diagrams/2026-03-10-web-audio-player-architecture.md`
- Modify: `docs/diagrams/2026-03-10-web-audio-player-flows.md`
- Modify: `docs/specs/2026-03-10-web-audio-player-runbook.md` only if lifecycle/operator text changed
- Modify: `docs/specs/2026-03-12-web-audio-player-track-loading-selection-storage.md`
- Modify: `docs/specs/web-audio-player-rfc.md` if `#9` removed the typed error hierarchy

- [ ] **Step 1: Re-read shipped code after `#9` through `#11`**
Do not edit docs from memory. Re-open the exact runtime/controller files first.

- [ ] **Step 2: Add comments only to non-obvious behavior**
Engine no-ops, throw-plus-store error paths, optimistic seek rules, selection rollback/sequencing, store reference-change contract, decorative shell labels, and rate/volume control ownership in the shared controls layer.

- [ ] **Step 3: Refresh diagrams**
Update architecture and flow diagrams for controller layer, named store transitions, `destroy()`, runtime helpers, and current selection/runtime flow.

- [ ] **Step 4: Refresh stale specs**
Fix the track-loading spec so it describes the current catalog/controller/player shape. If `#9` removed the error hierarchy, remove that taxonomy from the legacy RFC or mark it historical.

- [ ] **Step 5: Run final verification**
Run: `bun run test -- --filter=@kkb/audio --filter=@kkb/web --filter=@kkb/ui`
Run: `bun run check-types -- --filter=@kkb/audio --filter=@kkb/web --filter=@kkb/ui`
Expected: PASS

- [ ] **Step 6: Commit**
Run: `git commit -m "docs: align audio docs with shipped code (#12)"`
