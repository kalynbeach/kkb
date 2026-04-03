# Oscilloscope `agent-browser` Smoke Report Template

Date: YYYY-MM-DD  
Branch: `feature/oscilloscope-v1`  
Route: `http://localhost:3000/oscilloscope`  
Reviewer: NAME  
Session name: `osc` or similar

## Purpose

Use this template for browser-based oscilloscope verification with the `agent-browser` skill and the `agent-browser` CLI. This report is intended to capture:
- route hydration and canvas mount behavior
- oscillator preset coverage
- mic-path coverage
- screenshot and screenshot-diff evidence
- permission and recovery flows
- visual-quality findings, especially around phosphor decay, hot-core preservation, glow width, washout, and mic readability

Because the oscilloscope output is canvas-driven, screenshots are the primary verification artifact. Text snapshots are useful for controls and state labels, but not sufficient for renderer validation on their own.

## Preconditions

- local dev server running for `apps/web` on port 3000
- latest branch changes built into the running app
- `agent-browser` installed and available on PATH
- if testing real mic behavior, use headed mode and confirm whether browser media permissions are expected to work in the current environment
- if testing deterministic mic behavior, note the fake-mic or test-mic activation mechanism below

## Environment

- OS: 
- Browser engine / provider: 
- `agent-browser` mode: headed / headless
- viewport: 
- DPR / scale: 
- fake mic enabled: yes / no
- fake mic activation method: 
- real mic available: yes / no

## Command log

Record the exact `agent-browser` commands used for the run.

```bash
agent-browser --session osc close || true
agent-browser --session osc --headed open http://localhost:3000/oscilloscope
agent-browser --session osc wait --load networkidle
agent-browser --session osc screenshot --annotate --screenshot-dir .artifacts/oscilloscope
agent-browser --session osc snapshot -i
```

Additional commands used in this run:

```bash
# paste exact commands here
```

## Baseline checks

- [ ] route loads successfully
- [ ] page hydrates without fallback errors
- [ ] `<canvas>` is mounted
- [ ] controls are present and interactive
- [ ] preset switching works
- [ ] source switching works
- [ ] browser support state is accurate

### Baseline notes

- URL after load:
- support banner text:
- initial preset:
- initial source:
- initial visual impression:

## Oscillator verification matrix

Capture at least one screenshot per state. Add screenshot paths and diff outputs where applicable.

| State | Steps | Screenshot path | Diff path | Pass? | Notes |
| --- | --- | --- | --- | --- | --- |
| Circle preset | Load default or switch to Circle |  |  |  |  |
| Figure Eight preset | Switch preset |  |  |  |  |
| Lissajous 3:2 preset | Switch preset |  |  |  |  |
| Breathing Detune preset | Switch preset |  |  |  |  |
| Low bloom / short trail | Adjust controls |  |  |  |  |
| High bloom / long trail | Adjust controls |  |  |  |  |

### Oscillator quality checklist

- [ ] trace is visible in all presets
- [ ] hot core remains brighter than the halo
- [ ] glow remains soft and reasonably narrow
- [ ] dense presets do not wash out into milky fog
- [ ] long trails visibly decay instead of flattening into background haze
- [ ] control changes produce visible renderer changes

### Oscillator notes

- strongest preset:
- weakest preset:
- washout observations:
- decay observations:
- any obvious regressions:

## Mic verification matrix

Test mic input across all currently shipped visual states. For V1 today, that means the current XY renderer across all presets and relevant control extremes. If additional visual modes were introduced for the run, add rows for them before closing the report.

| State | Input source | Steps | Screenshot path | Diff path | Pass? | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Mic + default preset/state | real / fake | Switch to mic |  |  |  |  |
| Mic + Circle | real / fake | Activate mic path and Circle state |  |  |  |  |
| Mic + Figure Eight | real / fake | Activate mic path and Figure Eight state |  |  |  |  |
| Mic + Lissajous 3:2 | real / fake | Activate mic path and Lissajous 3:2 state |  |  |  |  |
| Mic + Breathing Detune | real / fake | Activate mic path and Breathing Detune state |  |  |  |  |
| Mic + low bloom / short trail | real / fake | Adjust controls |  |  |  |  |
| Mic + high bloom / long trail | real / fake | Adjust controls |  |  |  |  |
| Mono mic path | real / fake | Verify mono handling |  |  |  |  |
| Stereo mic path | real / fake | Verify stereo handling if available |  |  |  |  |

### Mic quality checklist

- [ ] mic mode looks visually credible rather than broken
- [ ] quiet mic input remains visible enough to inspect
- [ ] louder or transient mic input does not explode into washout
- [ ] mono mic input produces a meaningful XY trace
- [ ] stereo mic input behaves distinctly if available
- [ ] mic visuals remain legible across all tested visual states
- [ ] mic switching does not leave stale visuals or broken state behind

### Mic notes

- real or fake mic path used:
- overall mic quality impression:
- mono behavior summary:
- stereo behavior summary:
- quiet input behavior:
- loud/transient input behavior:
- most broken-looking case:
- most improved case:

## Permission and recovery flow verification

| Flow | Expected behavior | Evidence | Pass? | Notes |
| --- | --- | --- | --- | --- |
| Permission denied | UI surfaces readable error state |  |  |  |
| Mic → oscillators recovery | route returns cleanly to oscillator rendering |  |  |  |
| Startup failure fallback, if exercised | readable unsupported / failure state |  |  |  |

### Recovery notes

- permission-denied copy quality:
- recovery quality:
- any stale provider or stale banner issues:

## Screenshots and artifacts

List all saved artifacts from the run.

- annotated baseline:
- oscillator screenshots:
- mic screenshots:
- diff screenshots:
- additional logs or recordings:

## Findings

### Summary

- overall result: pass / partial / fail
- biggest win in this run:
- biggest remaining issue:

### P0

- 

### P1

- 

### P2

- 

### P3

- 

## Recommended next actions

- [ ] 
- [ ] 
- [ ] 

## Final sign-off

- [ ] browser route is stable
- [ ] oscillator presets are visually acceptable
- [ ] mic path is visually acceptable
- [ ] `agent-browser` evidence is attached
- [ ] report links or paths are saved back to the active plan doc if needed
