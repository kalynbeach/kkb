# Dogfood Report: `/audio` Page

**Date:** 2026-04-02

**Updated:** 2026-08-17
**URL:** `http://localhost:3000/audio`
**App:** `@kkb/web`

---

## Resolved In This Pass

### 1. Previous / Next / Stop transport now works

**Files:** `apps/web/lib/audio/controller/player-controller.ts`, `apps/web/components/audio/player-client.tsx`, `apps/web/components/audio/player-shell.tsx`, `packages/ui/src/components/audio/player-controls.tsx`

- `Previous` and `Next` now derive from queue position
- `Stop` is wired through the controller and resets playback to `0`
- Server-render coverage now checks disabled/enabled transport states directly

### 2. Initial seek timeline no longer renders `aria-valuemax="NaN"`

**Files:** `packages/ui/src/components/audio/seek-timeline.tsx`, `apps/web/lib/audio/catalog/static-track-catalog-data.ts`

- Fixture tracks now provide stable `duration: 2`
- `SeekTimeline` now exposes invalid duration input as an unavailable image without range attributes
- Server-render coverage checks that invalid durations do not expose slider focusability or invalid numeric values

### 3. Fake diagnostics removed from the shell

**File:** `apps/web/components/audio/player-shell.tsx`

- Removed hardcoded `128 kbps`
- Removed hardcoded `44 khz`
- Removed the status-derived `stereo` label
- The shell now relies on real source, status, and buffered-state affordances only

### 4. Static waveform replaced with an explicit seek timeline

**Files:** `packages/ui/src/components/audio/seek-timeline.tsx`, `apps/web/components/ui-catalog/demos/audio-demo.tsx`

- Removed the identical hardcoded amplitude bars shown for every track
- Replaced them with a uniform time ruler that does not imply track-derived analysis
- Preserved buffered ranges, played progress, the playhead, pointer seeking, keyboard seeking, and slider semantics
- Updated the `/ui` specimen to describe the control as a seek timeline

---

## Remaining Limitations

### 1. Track diagnostics remain intentionally unavailable

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
- Initial seek timeline render is accessibility-safe
- Clean architecture — external store pattern with `useSyncExternalStore`, DI for testability

---

## Notes

- This report was refreshed against the current render, focused tests, and `/audio` and `/ui` browser output on 2026-08-17
- Pointer and keyboard seeking were browser-checked on `/audio`; the focused `/ui` specimen was checked at desktop and mobile widths
- The player uses a multi-source audio engine: WebCodecs → Worklet → MediaElement → Fallback (HTMLAudioElement)
- The active source is "media-element" as shown in the title bar
