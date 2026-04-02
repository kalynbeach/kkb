# Dogfood Report: `/audio` Page

**Date:** 2026-04-02
**URL:** `http://localhost:3000/audio`
**App:** `@kkb/web`

---

## Resolved In This Pass

### 1. Previous / Next / Stop transport now works

**Files:** `apps/web/lib/audio/controller/player-controller.ts`, `apps/web/components/audio/player-client.tsx`, `apps/web/components/audio/player-shell.tsx`, `packages/ui/src/components/audio/player-controls.tsx`

- `Previous` and `Next` now derive from queue position
- `Stop` is wired through the controller and resets playback to `0`
- Server-render coverage now checks disabled/enabled transport states directly

### 2. Initial waveform slider no longer renders `aria-valuemax="NaN"`

**Files:** `packages/ui/src/components/audio/waveform.tsx`, `apps/web/lib/audio/catalog/static-track-catalog-data.ts`

- Fixture tracks now provide stable `duration: 2`
- `Waveform` now clamps invalid duration input to a safe zero-valued slider contract
- Server-render coverage now checks that invalid durations render `aria-valuemax="0"` instead of `NaN`

### 3. Fake diagnostics removed from the shell

**File:** `apps/web/components/audio/player-shell.tsx`

- Removed hardcoded `128 kbps`
- Removed hardcoded `44 khz`
- Removed the status-derived `stereo` label
- The shell now relies on real source, status, and buffered-state affordances only

---

## Remaining Limitations

### 1. Waveform is still static / decorative

**File:** `packages/ui/src/components/audio/waveform.tsx` (`DEFAULT_BARS`)

Same 32 hardcoded bars rendered for all tracks — not derived from actual audio data. By design (no `waveformUrl` in catalog data), but could be misleading.

### 2. Track diagnostics remain intentionally unavailable

- The player still does not detect real bitrate, sample rate, or channel count
- This pass intentionally removed misleading placeholders instead of inventing approximate values

---

## What Works Well

- Track switching updates title, subtitle (mime type), and status correctly
- Queue-aware transport controls now reflect first/last track boundaries
- Default server render now has stable `0:02` duration metadata from fixture data
- Playlist selection highlighting with accessible `role="listbox"`
- Retro/80s aesthetic is cohesive — gradients, monospace, blue glow effects
- Mobile responsive — player fits 375px viewport with proper truncation
- Status LED color coding (blue=normal, amber=loading, red=error)
- Progress bar and buffering percentage update after metadata loads
- Initial seek slider render is now accessibility-safe
- Clean architecture — external store pattern with `useSyncExternalStore`, DI for testability

---

## Notes

- This refresh is based on the current verified render/test output after the 2026-04-02 audio UX follow-up changes
- Browser-level playback QA is still useful later, but the core regressions in this report now have focused automated coverage
- The player uses a multi-source audio engine: WebCodecs → Worklet → MediaElement → Fallback (HTMLAudioElement)
- The active source is "media-element" as shown in the title bar
