# PR #3 Web Audio Player Fixes Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the five before-merge PR #3 fixes without changing the current conservative audio runtime posture.

**Architecture:** Keep `MediaElementSource` as the audible host path and leave `WebCodecsSource` / `WorkletPCMSource` runtime-gated. Fix the host render path by removing per-frame React state updates, harden engine source probing and teardown, preserve client-side async errors, and make waveform seeking keyboard-accessible.

**Tech Stack:** Bun workspaces, Turborepo, TypeScript 5.9 strict mode, React 19, Next.js 16, Bun test.

---

## Summary

1. Remove high-frequency React state updates from the host player path.
2. Catch and log `canPlay()` and teardown failures without aborting fallback/load flow.
3. Preserve action promise rejections in the client entrypoint.
4. Add keyboard seek support to the waveform slider.
5. Verify the changes with focused tests, typecheck, and lint.

## Implementation Tasks

### Task 1: Refactor the host player render path

**Files:**
- Modify: `apps/web/lib/audio/use-player-store.ts`
- Modify: `apps/web/components/audio/player-client.tsx`
- Modify: `apps/web/components/audio/player-shell.tsx`
- Test: `apps/web/components/audio/__tests__/player-client.test.tsx`
- Test: `apps/web/components/audio/__tests__/player-shell.test.tsx`

- [ ] Subscribe only to the coarse engine snapshot in `usePlayerStore`.
- [ ] Move timeline and buffered-range polling into `PlayerShell` via a local RAF effect.
- [ ] Update dedicated DOM refs for time, duration, waveform/playhead progress, progress bar, and buffer display without triggering per-frame React rerenders.
- [ ] Keep server rendering safe and keep the public `WebPlayer` return shape unchanged.

### Task 2: Harden engine source selection and teardown

**Files:**
- Modify: `packages/audio/src/engine/engine.ts`
- Test: `packages/audio/src/engine/__tests__/engine-recovery.test.ts`

- [ ] Catch per-source `canPlay()` failures, log them with `source.id`, and continue probing later sources.
- [ ] Catch `pause()` and `destroy()` separately in teardown, log failures, and always attempt `destroy()`.
- [ ] Do not add broader lifecycle APIs such as `engine.destroy()` in this pass.

### Task 3: Preserve async action errors in the client

**Files:**
- Modify: `apps/web/components/audio/player-client.tsx`

- [ ] Replace `void` fire-and-forget calls with a shared rejection handler.
- [ ] Log the action name and original error for `loadTrack`, `play`, `pause`, and `seek`.
- [ ] Keep handlers non-blocking and leave UI error display driven by engine snapshot state.

### Task 4: Add waveform keyboard seeking

**Files:**
- Modify: `packages/ui/src/components/audio/waveform.tsx`
- Test: `packages/ui/src/components/audio/__tests__/waveform.test.ts`

- [ ] Add keyboard handling for `ArrowLeft`, `ArrowRight`, `Home`, and `End`.
- [ ] Clamp computed seek targets to `[0, duration]`.
- [ ] No-op when duration is invalid or `onSeek` is absent.
- [ ] Preserve pointer-based seek behavior.

## Verification

- [ ] Run `bun test packages/audio/src/engine/__tests__/engine-recovery.test.ts`
- [ ] Run `bun test packages/ui/src/components/audio`
- [ ] Run `bun test apps/web/components/audio`
- [ ] Run `bun run check-types`
- [ ] Run `bun run format-and-lint`

## Assumptions

1. Scope is limited to the five merge blockers from the revised PR #3 triage.
2. `console.error` is acceptable logging for this pass.
3. Runtime gating for `WebCodecsSource` and `WorkletPCMSource` remains unchanged.
