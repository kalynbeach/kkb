# Audio UX Follow-Up Gaps Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the still-live `/audio` UX and accessibility gaps left after issues `#5` through `#12`, without reopening the runtime hardening work that already shipped.

**Architecture:** Keep the fixes split by concern: first fix known catalog/waveform accessibility problems, then add real transport semantics through the controller/UI boundary, and only then clean up decorative diagnostics so the shell stops implying metadata it does not actually know. Runtime behavior stays owned by the existing `PlayerController` plus `WebPlayer` surface; this plan should not introduce speculative audio-analysis features.

**Tech Stack:** Bun, Turbo, Next.js 16, React 19, TypeScript, `@kkb/audio`, `@kkb/ui`

---

## Source

- `docs/reports/dogfood-audio-page.md`

## Scope

- In scope:
  duration metadata + waveform accessibility fix,
  previous / next / stop transport support,
  removal or downgrade of fake diagnostics in the shell,
  tests/docs refresh for the shipped UX
- Out of scope:
  waveform analysis generation,
  real bitrate/sample-rate/channel detection,
  WebCodecs/worklet runtime expansion

## Unresolved Questions

- None. Assume fake diagnostics should be hidden or neutralized until real data exists.

## File Map

- Modify: `apps/web/lib/audio/catalog/static-track-catalog-data.ts`
  Add stable fixture durations for initial render.
- Modify: `packages/ui/src/components/audio/waveform.tsx`
  Guard ARIA slider values against invalid duration input.
- Modify: `packages/ui/src/components/audio/player-controls.tsx`
  Add transport props and disabled-state behavior for previous / stop / next.
- Modify: `apps/web/lib/audio/controller/player-controller.ts`
  Add queue-aware transport commands and snapshot hints for UI enablement.
- Modify: `apps/web/lib/audio/use-player-controller.ts`
  Only if the controller snapshot shape change requires hook-side type updates.
- Modify: `apps/web/components/audio/player-client.tsx`
  Wire new controller actions and disabled-state props into `PlayerShell`.
- Modify: `apps/web/components/audio/player-shell.tsx`
  Consume new transport props and remove misleading decorative diagnostics.
- Test: `packages/ui/src/components/audio/__tests__/waveform.test.ts`
- Test: `apps/web/lib/audio/controller/__tests__/player-controller.test.ts`
- Test: `apps/web/components/audio/__tests__/player-shell.test.tsx`
- Test: `apps/web/components/audio/__tests__/player-client.test.tsx`
- Modify: `docs/reports/dogfood-audio-page.md`
  Refresh or mark resolved items after fixes land.

### Task 1: Fix Initial Duration And Waveform Accessibility

**Files:**
- Modify: `apps/web/lib/audio/catalog/static-track-catalog-data.ts`
- Modify: `packages/ui/src/components/audio/waveform.tsx`
- Test: `packages/ui/src/components/audio/__tests__/waveform.test.ts`
- Test: `apps/web/components/audio/__tests__/player-client.test.tsx`

- [ ] **Step 1: Write the failing tests first**
Add:
  a waveform server-render test that rejects `aria-valuemax="NaN"` when duration is invalid,
  a player-client/server-render assertion that default catalog metadata exposes stable duration labels from fixture data

- [ ] **Step 2: Run focused tests to confirm failure**
Run: `bun test packages/ui/src/components/audio/__tests__/waveform.test.ts apps/web/components/audio/__tests__/player-client.test.tsx`
Expected: FAIL

- [ ] **Step 3: Add fixture durations**
Set `duration` on both static test tracks in `static-track-catalog-data.ts`.

- [ ] **Step 4: Guard waveform ARIA values**
Clamp invalid or non-finite duration to a safe zero-valued slider contract in `waveform.tsx`.

- [ ] **Step 5: Re-run focused tests**
Run: `bun test packages/ui/src/components/audio/__tests__/waveform.test.ts apps/web/components/audio/__tests__/player-client.test.tsx`
Expected: PASS

### Task 2: Add Previous / Stop / Next Transport Semantics

**Files:**
- Modify: `apps/web/lib/audio/controller/player-controller.ts`
- Modify: `apps/web/components/audio/player-client.tsx`
- Modify: `apps/web/components/audio/player-shell.tsx`
- Modify: `packages/ui/src/components/audio/player-controls.tsx`
- Test: `apps/web/lib/audio/controller/__tests__/player-controller.test.ts`
- Test: `apps/web/components/audio/__tests__/player-shell.test.tsx`

- [ ] **Step 1: Write the failing controller tests first**
Add coverage for:
  previous/next selecting adjacent tracks,
  previous disabled on first track,
  next disabled on last track,
  stop delegating to pause plus seek-to-zero, or to a dedicated stop flow if the player surface grows one

- [ ] **Step 2: Run the focused controller suite**
Run: `bun test apps/web/lib/audio/controller/__tests__/player-controller.test.ts`
Expected: FAIL

- [ ] **Step 3: Extend the controller API**
Add:
  `previous()`,
  `next()`,
  `stop()`,
  snapshot booleans or equivalent queue-position signals for UI disabled states

- [ ] **Step 4: Keep queue semantics simple**
Use `queueTrackIds` plus current selection index.
Assume:
  previous on first track stays disabled,
  next on last track stays disabled,
  no wrap-around behavior,
  stop pauses playback and resets time to `0`

- [ ] **Step 5: Wire the UI**
Plumb concrete transport props through `player-client.tsx` and `player-shell.tsx`:
  `canSelectPrevious`,
  `canSelectNext`,
  `onPrevious`,
  `onStop`,
  `onNext`
Then enable the transport buttons in `player-controls.tsx` from controller state instead of hardcoding them disabled.

- [ ] **Step 6: Add shell render assertions**
Verify button labels/disabled states and stop-transport rendering in `player-shell.test.tsx`.

- [ ] **Step 7: Re-run focused suites**
Run: `bun test apps/web/lib/audio/controller/__tests__/player-controller.test.ts apps/web/components/audio/__tests__/player-shell.test.tsx`
Expected: PASS

### Task 3: Remove Misleading Diagnostics From The Shell

**Files:**
- Modify: `apps/web/components/audio/player-shell.tsx`
- Test: `apps/web/components/audio/__tests__/player-shell.test.tsx`

- [ ] **Step 1: Write the failing shell assertions first**
Add assertions that the shell no longer claims hardcoded `128`, `44`, or status-derived `stereo` metadata when no real diagnostics exist.

- [ ] **Step 2: Run the shell suite to confirm failure**
Run: `bun test apps/web/components/audio/__tests__/player-shell.test.tsx`
Expected: FAIL

- [ ] **Step 3: Replace fake diagnostics with neutral UI**
Remove the fake `kbps`, `khz`, and `stereo` claims instead of inventing a replacement diagnostics row in this pass. Keep the shell visually balanced using the existing real source/status/buffered affordances that already exist elsewhere in the component.

- [ ] **Step 4: Re-run the shell suite**
Run: `bun test apps/web/components/audio/__tests__/player-shell.test.tsx`
Expected: PASS

### Task 4: Refresh Dogfood Report And Run Final Verification

**Files:**
- Modify: `docs/reports/dogfood-audio-page.md`
- Reference: `docs/specs/2026-03-10-web-audio-player-qa-matrix.md`

- [ ] **Step 1: Re-read the current audio page after code changes**
Do not mark items resolved from memory. Re-open the route or re-check current render output first.

- [ ] **Step 2: Update the dogfood report**
Mark resolved items, remove stale claims, and note any remaining intentionally deferred limitations such as static waveform bars.

- [ ] **Step 3: Run focused verification**
Run: `bun test packages/ui/src/components/audio/__tests__/waveform.test.ts apps/web/lib/audio/controller/__tests__/player-controller.test.ts apps/web/components/audio/__tests__/player-shell.test.tsx apps/web/components/audio/__tests__/player-client.test.tsx`
Expected: PASS

- [ ] **Step 4: Run workspace verification**
Run: `turbo run test --filter=@kkb/ui --filter=@kkb/web`
Run: `turbo run check-types --filter=@kkb/ui --filter=@kkb/web`
Expected: PASS

- [ ] **Step 5: Commit**
Run: `git add apps/web/components/audio apps/web/lib/audio packages/ui/src/components/audio docs/reports/dogfood-audio-page.md docs/plans/2026-03-20-audio-ux-follow-up-gaps.md`
Run: `git commit -m "fix: close audio ux follow-up gaps"`
