# Oscilloscope Browser Smoke Report

Date: 2026-04-04  
Branch: `feature/oscilloscope-v1`  
Route: `http://localhost:3000/oscilloscope`  
Reviewer: pi coding agent  
Session names: `osc-desktop`, `osc-fake-mono`, `osc-fake-stereo`, `osc-live`, `osc-mobile`

## Purpose

Verify the post-refactor `/oscilloscope` UI in-browser with `agent-browser`, with emphasis on:
- refreshed desktop verification after `feat: refine oscilloscope UI surface`
- mobile-width layout verification
- deterministic fake-mic coverage
- permission-denied and recovery flow verification
- smoke-script resilience after the control-surface refactor

## Environment

- OS: macOS
- Browser engine / provider: local Chrome via `agent-browser 0.24.0`
- `agent-browser` mode: headless
- desktop viewport: `1440x1100` at DPR `2`
- mobile viewport: `390x844` at DPR `3`
- fake mic enabled: yes
- fake mic activation method: query params
  - `?mic=fake-mono`
  - `?mic=fake-stereo`
- real mic available: no usable live input in this run; permission-denied path was exercised instead

## Command log

Primary run:

```bash
./scripts/oscilloscope-agent-browser-smoke.sh
```

Additional verification used for state text checks:

```bash
agent-browser --session osc-review open http://localhost:3000/oscilloscope
agent-browser --session osc-review wait --load networkidle
agent-browser --session osc-review find testid oscilloscope-source-mic click
agent-browser --session osc-review wait 1500
agent-browser --session osc-review get text body
agent-browser --session osc-review find testid oscilloscope-source-oscillators click
agent-browser --session osc-review wait 1000
agent-browser --session osc-review get text body

agent-browser --session osc-facts open 'http://localhost:3000/oscilloscope?mic=fake-mono'
agent-browser --session osc-facts wait --load networkidle
agent-browser --session osc-facts find testid oscilloscope-source-mic click
agent-browser --session osc-facts wait 1200
agent-browser --session osc-facts get text body
agent-browser --session osc-facts find testid oscilloscope-preset-trigger click
agent-browser --session osc-facts wait 300
agent-browser --session osc-facts find testid oscilloscope-preset-lissajous-3-2 click
agent-browser --session osc-facts wait 1200
agent-browser --session osc-facts get text body
```

## Baseline checks

- [x] route loads successfully
- [x] page hydrates without fallback errors
- [x] `<canvas>` is mounted
- [x] controls are present and interactive
- [x] preset switching works
- [x] source switching works
- [x] browser support state is accurate (`WEBGPU` badge shown in supported browser)

### Baseline notes

- initial source: oscillators
- initial preset: Circle
- initial visual impression: calm instrument-surface layout, stage clearly dominant, control cards visually quieter than the canvas
- annotated screenshots confirm stable refs after the refactor:
  - `.artifacts/oscilloscope/desktop-oscillator-default-annotated.png`
  - `.artifacts/oscilloscope/mobile-oscillator-default-annotated.png`

## Verification matrix

| State | Screenshot path | Pass? | Notes |
| --- | --- | --- | --- |
| Desktop oscillator baseline | `.artifacts/oscilloscope/desktop-oscillator-default.png` | Yes | Stage is primary; controls read as companion column. |
| Desktop oscillator figure-eight | `.artifacts/oscilloscope/desktop-oscillator-figure-eight.png` | Yes | Preset switching still works after the UI refactor. |
| Desktop fake mono mic | `.artifacts/oscilloscope/desktop-fake-mono-mic.png` | Yes | Mic mode is preserved and oscillator-only signal controls are hidden. |
| Desktop fake mono + Lissajous 3:2 | `.artifacts/oscilloscope/desktop-fake-mono-lissajous-3-2.png` | Yes | Preset switching preserves mic mode; mic trace remains visually credible. |
| Desktop fake stereo mic | `.artifacts/oscilloscope/desktop-fake-stereo-mic.png` | Yes | Stereo path is visually distinct from fake mono. |
| Desktop live mic permission state | `.artifacts/oscilloscope/desktop-live-mic-state.png` | Partial | Error state exists, but the stage card pushes the status alert low enough that it is not obvious above the fold at this viewport. |
| Desktop recovery to oscillators | `.artifacts/oscilloscope/desktop-live-recovery-oscillators.png` | Yes | Recovery is clean; oscillators and signal controls return. |
| Mobile oscillator baseline | `.artifacts/oscilloscope/mobile-oscillator-default.png` | Yes | Single-column stack reads cleanly; stage remains prominent. |
| Mobile mic permission state | `.artifacts/oscilloscope/mobile-live-mic-state.png` | Yes | Permission-denied alert is clearly visible under the stage on mobile. |

## State text checks

Verified body text after desktop live-mic attempt:
- `Microphone unavailable`
- `Permission denied`

Verified recovery body text:
- `INTERNAL OSCILLATORS ACTIVE`
- `OSCILLATOR A`
- `OSCILLATOR B`

Verified fake-mono mic body text:
- `MIC INPUT ACTIVE`
- `LISSAJOUS 3:2` after preset switch
- oscillator-only signal controls absent in mic mode

## UI / visual findings

### Wins

1. **Desktop hierarchy is materially better after the refactor.**  
   The stage now reads as the primary instrument viewport, while the right column feels quieter and more system-native.

2. **Mobile layout holds up.**  
   The page stacks cleanly into intro → stage → controls, without feeling like a desktop layout simply shrunk down.

3. **Source-aware UI works.**  
   In mic mode, the irrelevant oscillator frequency card disappears, which reduces noise and matches the plan.

4. **Preset switching still preserves mic mode.**  
   Verified in-browser with fake mono input and a preset change to `Lissajous 3:2`.

5. **Fake mono and fake stereo are visually distinct.**  
   Fake mono produces a coherent orbit-like ellipse; fake stereo produces a denser, more rectangular scribble field.

### Follow-up fix

#### Desktop permission/error visibility improved
A small follow-up pass moved alert-style stage states above the square canvas while keeping compact success/idle summaries below it. That keeps `Microphone unavailable / Permission denied` visible above the fold on desktop without making the normal oscillator state louder.

Updated evidence:
- `.artifacts/oscilloscope/desktop-live-mic-state-updated.png`

## Script follow-up

The smoke script was updated during this pass to better match the refactored UI:
- switched from fragile positional refs (`@e1`, `@e2`, `@e3`) to stable `data-testid` selectors
- added a mobile-width verification pass
- saves named artifacts under `.artifacts/oscilloscope/`

## Screenshots and artifacts

- `.artifacts/oscilloscope/desktop-oscillator-default-annotated.png`
- `.artifacts/oscilloscope/desktop-oscillator-default.png`
- `.artifacts/oscilloscope/desktop-oscillator-figure-eight.png`
- `.artifacts/oscilloscope/desktop-fake-mono-default-annotated.png`
- `.artifacts/oscilloscope/desktop-fake-mono-mic.png`
- `.artifacts/oscilloscope/desktop-fake-mono-lissajous-3-2.png`
- `.artifacts/oscilloscope/desktop-fake-stereo-mic.png`
- `.artifacts/oscilloscope/desktop-live-mic-state.png`
- `.artifacts/oscilloscope/desktop-live-recovery-oscillators.png`
- `.artifacts/oscilloscope/mobile-oscillator-default-annotated.png`
- `.artifacts/oscilloscope/mobile-oscillator-default.png`
- `.artifacts/oscilloscope/mobile-live-mic-state.png`

## Summary

Overall result: **pass with one minor desktop follow-up**.

The refactored `/oscilloscope` surface now has current browser evidence for:
- desktop layout
- mobile-width layout
- fake mono mic flow
- fake stereo mic flow
- permission-denied handling
- recovery back to oscillators

The main remaining issue from this pass is that the desktop permission/error alert is less visible than the equivalent mobile state because it falls low within the square stage card.