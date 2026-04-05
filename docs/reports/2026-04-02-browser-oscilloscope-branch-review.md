# Browser Oscilloscope Branch Review

Date: 2026-04-02  
Branch: `feature/oscilloscope-v1`

## Reviewed inputs

- `docs/research/browser-oscilloscope.md`
- `docs/research/2026-03-28-browser-oscilloscope-review.md`
- `docs/plans/2026-04-02-browser-oscilloscope-v1.md`
- branch commits:
  - `efd5896` `feat: add oscilloscope package surface`
  - `00f6702` `feat: add oscilloscope signal and xy mode`
  - `9de293d` `feat: add oscilloscope runtime and renderer`
  - `41718f7` `feat: add oscilloscope web demo and mic input`
  - `8770713` `fix: stabilize oscilloscope wiring and remove barrel exports`

## Executive summary

This branch is a strong **architectural V1 foundation** for the browser oscilloscope.

It successfully establishes the intended repo boundaries:
- the oscilloscope core lives in `packages/audio`
- browser-only orchestration lives in `apps/web`
- signal intake is abstracted behind `SignalProvider`
- XY mode, internal oscillators, mic input, WebGPU support detection, and the first demo route all exist

The largest remaining gap is **renderer quality**. The original ping-pong persistence/composite path proved unstable in-browser, so the active renderer was simplified to a direct WebGPU trace baseline. That makes the route visibly functional again, but it does not yet meet the visual phosphor/persistence bar described in the research brief.

## Progress against the implementation plan

| Task | Status | Notes |
| --- | --- | --- |
| Task 1: package surface and support helper | Complete | Implemented, but the barrel entrypoint was later intentionally removed in favor of direct subpath imports. |
| Task 2: signal contract and oscillator source | Complete | Matches the planned host/runtime split well. |
| Task 3: analyser-backed provider | Complete | Supports host-owned mic integration. |
| Task 4: XY frame geometry generation | Complete | Includes required mono-to-both-axes behavior. |
| Task 5: headless runtime and renderer | Partial | Runtime/controller is in good shape; renderer exists but the original persistence/composite design is not the active path. |
| Task 6: web route and client shell | Complete | `/oscilloscope` exists, renders, and recovered from the hydration bug. |
| Task 7: host-owned mic setup | Complete | Mic source switching, teardown, and stale rejection behavior are covered by tests. |
| Task 8: final verification and smoke pass | Partial | Automated tests and type-checks pass; renderer-quality review and final visual smoke pass remain open. |

## What the branch gets right

### 1. Package boundaries align with the research and review docs

The branch follows the most important architectural recommendation from the research review:
- `@kkb/audio` stays headless
- `apps/web` owns browser permissions and host wiring
- the oscilloscope accepts a provider instead of owning browser audio setup

That is the right long-term shape.

### 2. The abstraction model is better than the earliest research draft

The implementation uses:
- `SignalProvider`
- `DisplayMode`
- `FrameGeometry`

That matches the review document's recommendation to prefer a frame/batch-oriented model rather than a too-narrow point generator.

### 3. Scope stayed disciplined

The branch correctly avoids pulling in:
- track playback visualization
- Y-T mode and trigger logic
- additional display modes
- AudioWorklet / `SharedArrayBuffer` transport work
- oscilloscope wrappers in `@kkb/ui`

This keeps the work focused on a realistic first slice.

### 4. The route is resilient in the ways that mattered most

The branch fixed a real SSR/client mismatch in `/oscilloscope` by making the initial support state hydration-safe and deferring WebGPU support detection to the client.

### 5. Mic handling is in the correct ownership layer

`apps/web/lib/oscilloscope/create-mic-provider.ts` is the right place for stream acquisition and `AnalyserNode` wiring.

## Deviations from the original plan

### 1. No barrel export

The original plan assumed:
- `packages/audio/src/oscilloscope/index.ts`
- `@kkb/audio/oscilloscope`

The branch intentionally removed that surface. Current imports use direct subpaths such as:
- `@kkb/audio/oscilloscope/runtime`
- `@kkb/audio/oscilloscope/support`
- `@kkb/audio/oscilloscope/presets`
- `@kkb/audio/oscilloscope/types`

This is a deliberate branch-level decision and should now be treated as the intended API shape.

### 2. The active renderer is simpler than planned

The original V1 plan called for a ping-pong history pipeline with basic persistence and composite/glow.

The branch attempted that path, but the implementation hit in-browser instability and visual failure modes, including wash-to-white behavior and invalid WebGPU bind-group errors. The active renderer now draws the trace directly to the swapchain target instead of using the original persistence/composite path.

This was the right stabilization move, but it means the branch is currently below the research brief's intended visual bar.

## Current verification state

Passing:
- `bun run test -- --filter=@kkb/audio --filter=@kkb/web`
- `bun run check-types -- --filter=@kkb/audio --filter=@kkb/web`
- `bun run format-and-lint`

Manual state:
- `/oscilloscope` now renders visible geometry again
- controls, preset switching, and mic switching are functional
- the rendering still looks visually janky compared with the desired phosphor/persistence target

## Known follow-up work

### Renderer-quality follow-up

This is the main remaining milestone.

Recommended focus:
1. reintroduce persistence with a simpler, validated history path
2. restore composite/glow only after the history path is proven stable
3. tune trace intensity, blend behavior, and decay deliberately with browser validation after each step
4. remove or replace any stale persistence scaffolding that no longer serves the chosen pipeline

### Cleanup follow-up

- keep docs synchronized with the no-barrel export decision
- decide whether the dormant composite shader/path remains as a near-term experiment or should be trimmed until renderer follow-up work resumes
- perform one final manual browser smoke pass once renderer quality work lands

## Recommended next steps

### Immediate
- treat the branch as a stable structural baseline, not a finished visual oscilloscope
- keep the current route/demo available for continued iteration
- avoid broadening scope into track taps, extra modes, or CRT polish features until the renderer baseline is solid

### Next dedicated work slice
- open a focused renderer-quality task
- work only on persistence/composite fidelity and browser validation
- stop once the oscilloscope is visually credible and stable, rather than expanding feature scope

## Bottom line

The branch has already accomplished the hard structural part of the project:
- the package boundaries are correct
- the core abstractions are in place
- the route exists
- the demo works at a baseline level

The next step is not more architecture work. It is a narrow, dedicated rendering-quality pass that turns the current visible baseline into the phosphor-style oscilloscope the research documents originally described.
