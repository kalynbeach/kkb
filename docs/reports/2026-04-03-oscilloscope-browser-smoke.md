# Oscilloscope Browser Smoke Report

Date: 2026-04-03  
Branch: `feature/oscilloscope-v1`  
Route: `http://localhost:3000/oscilloscope`

## Goal

Verify the current oscilloscope route in-browser with the `agent-browser` CLI, with emphasis on:
- deterministic mic-path coverage
- mic visuals across all currently shipped visual states in XY mode
- permission-denied and recovery flows

## Environment

- local Next dev server on port 3000
- browser automation via the Bun-installed `agent-browser` CLI
- viewport: `1440x1100` at DPR `2`
- deterministic mic verification via query params:
  - `?mic=fake-mono`
  - `?mic=fake-stereo`

## Summary

This smoke pass confirms that the new deterministic mic path makes browser verification practical and that mono mic visuals are now materially better than the previous collapse-to-diagonal behavior.

A repeatable smoke script now exists at `scripts/oscilloscope-agent-browser-smoke.sh`.

Key outcomes:
- fake mono mic now produces a meaningful, centered XY shape instead of a broken-looking simple diagonal duplication
- fake mono mic was checked across all current preset states in XY mode
- fake stereo path was verified separately
- real mic permission denial still surfaces cleanly in-browser
- switching back from mic to oscillators still recovers cleanly

## Verified states

### Oscillator baseline
- Circle preset
- evidence: `.artifacts/oscilloscope/oscillator-circle.png`

### Fake mono mic states
- Circle
  - `.artifacts/oscilloscope/mic-fake-mono-circle.png`
- Figure Eight
  - `.artifacts/oscilloscope/mic-fake-mono-figure-eight.png`
- Lissajous 3:2
  - `.artifacts/oscilloscope/mic-fake-mono-lissajous-3-2.png`
- Breathing Detune
  - `.artifacts/oscilloscope/mic-fake-mono-breathing-detune.png`

### Fake stereo mic state
- Circle
  - `.artifacts/oscilloscope/mic-fake-stereo-circle.png`

### Live mic permission / recovery
- permission denied
  - `.artifacts/oscilloscope/mic-permission-denied.png`
- switch back to oscillators recovery
  - `.artifacts/oscilloscope/mic-recovery-oscillators.png`

## Findings

### 1. Mono mic visuals improved substantially
The deterministic fake-mono path produces a coherent elliptical / orbit-like XY pattern with visible internal motion. This is a clear improvement over the earlier mono-to-both-axes collapse that would tend to read as a weak diagonal or borderline broken line.

### 2. Mic verification is now repeatable
The fake mic query-param path makes it possible to verify the mic rendering flow with browser automation rather than depending on real hardware availability or permission behavior.

### 3. Preset switching can now preserve mic mode
The oscilloscope client now preserves the active source type when applying a preset, so switching presets while mic mode is active no longer kicks the route back to oscillators. That makes both manual use and `agent-browser` verification cleaner.

### 4. Fake stereo path is distinct from fake mono
The fake stereo path produces a denser central scribble / field rather than the fake mono orbit shape, which is enough to confirm that the stereo path is distinct and active.

### 5. Permission and recovery flows still look correct
In the live-mic flow, the route moved through `Requesting mic permission`, then surfaced `Permission denied`, and recovered cleanly when switching back to oscillators.

## Remaining visual caveats

These screenshots are good enough to confirm the mic-path improvement, but there is still renderer-quality work left:
- the mic halo/background can still read a little foggy in denser cases
- the fake stereo result is credible, but still visually rough rather than especially elegant
- the renderer is improved, but not yet at an obviously finished phosphor-quality bar

## Bottom line

The branch now has:
- deterministic `agent-browser` mic coverage
- mono mic visuals that no longer look broken
- browser-verified coverage for all currently shipped preset states in XY mode
- browser-verified permission-denied and recovery behavior

That is enough to continue the next renderer-quality tuning pass with much better feedback loops.
