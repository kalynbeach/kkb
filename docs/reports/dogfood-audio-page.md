# Dogfood Report: `/audio` Page

**Date:** 2026-03-16
**URL:** `http://localhost:3000/audio`
**App:** `@kkb/web`

---

## Bugs

### 1. Previous / Next / Stop buttons permanently disabled

**Files:** `packages/ui/src/components/audio/player-controls.tsx:60,80,84`

All three transport buttons are hardcoded `disabled` with no props or callbacks wired up:

```tsx
<TransportButton disabled label="Previous">
<TransportButton disabled label="Stop">
<TransportButton disabled label="Next">
```

- Previous/Next should enable based on track position in playlist (track 1 of 2 → Next enabled; track 2 of 2 → Previous enabled)
- Stop has no `onStop` callback plumbed through the component tree
- **Impact:** Confusing — users see controls that can never be activated

### 2. `aria-valuemax="NaN"` on Seek slider at initial render

**File:** `packages/ui/src/components/audio/waveform.tsx:174`

Before audio metadata loads, `duration` propagates as `NaN` through the chain:

```
snapshot.runtime.duration (NaN) → player-shell → waveform → aria-valuemax={Math.round(NaN)} = NaN
```

- Root cause: `TrackRecord.duration` is not specified in `static-track-catalog-data.ts`, and the audio engine reports `NaN` until the `<audio>` element loads metadata
- After Play is clicked (triggering metadata load), the value corrects to `"2"`
- **Impact:** Accessibility — screen readers see an invalid slider range on page load

### 3. Track catalog missing `duration` field

**File:** `apps/web/lib/audio/catalog/static-track-catalog-data.ts`

`TrackRecord` type supports `duration?: number` but neither track entry specifies it. Contributes to the NaN issue above and the "0:00" duration display before playback.

**Fix:** Add `duration: 2` to both track entries.

---

## UX Issues

### 4. KBPS / KHZ values are hardcoded

**File:** `apps/web/components/audio/player-shell.tsx:217,224`

Always shows "128 kbps" and "44 khz" regardless of actual codec/bitrate. The Opus track likely has different properties.

### 5. Waveform is static / decorative

**File:** `packages/ui/src/components/audio/waveform.tsx` (`DEFAULT_BARS`)

Same 32 hardcoded bars rendered for all tracks — not derived from actual audio data. By design (no `waveformUrl` in catalog data), but could be misleading.

### 6. "stereo" indicator is status-based, not data-based

**File:** `apps/web/components/audio/player-shell.tsx:331-332`

Shows "stereo" when `status === "playing"`, "—" otherwise. Doesn't detect actual channel count.

---

## What Works Well

- Track switching updates title, subtitle (mime type), and status correctly
- Playlist selection highlighting with accessible `role="listbox"`
- Retro/80s aesthetic is cohesive — gradients, monospace, blue glow effects
- Mobile responsive — player fits 375px viewport with proper truncation
- Status LED color coding (blue=normal, amber=loading, red=error)
- Progress bar and buffering percentage update after metadata loads
- Clean architecture — external store pattern with `useSyncExternalStore`, DI for testability

---

## Screenshots

Captured during testing (not committed):

- `/tmp/audio-page-initial.png` — initial state
- `/tmp/audio-playing.png` — after play attempt
- `/tmp/audio-track2.png` — after switching to track 2
- `/tmp/audio-mobile.png` — 375x812 mobile viewport
- `/tmp/audio-focus.png` — keyboard focus state

---

## Notes

- Audio playback could not be fully tested due to headless Chrome's autoplay policy blocking audio
- The "PAUSED" status after clicking Play is expected behavior in headless environments
- The player uses a multi-source audio engine: WebCodecs → Worklet → MediaElement → Fallback (HTMLAudioElement)
- The active source is "media-element" as shown in the title bar
