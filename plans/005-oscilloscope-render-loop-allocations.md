# Plan 005: Reuse typed-array buffers in the oscilloscope render loop

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 704eeb9..HEAD -- packages/audio/src/oscilloscope`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: MED
- **Depends on**: plans/004-binaural-beats-client-tests.md (operational sequence; no code dependency)
- **Category**: perf
- **Planned at**: commit `704eeb9`, 2026-07-15 (reconciled)

## Why this matters

The oscilloscope render tick runs at requestAnimationFrame cadence (~60 fps) in `packages/audio/src/oscilloscope/runtime.ts:63-96`. Each tick currently allocates four typed arrays on the oscillator path, six on true-stereo mic input with conditioning, and up to eight on derived-stereo mono input: XY geometry, packed uniforms, analyser reads and conditioning copies, derived-stereo output, or oscillator channel buffers. The code therefore creates recurring garbage in a latency-sensitive loop, although no browser profile currently proves a visible frame-time spike. This plan must collect comparable before/after browser evidence and must describe the outcome as allocation reduction—not a demonstrated frame-rate improvement—unless that evidence supports the stronger claim.

These buffers have fixed maximum sizes known at construction time (`fftSize` = 1024 in the app, trace budget = 4096 points, uniforms = 8 floats), so their backing storage can be allocated once and overwritten. The GPU consumes each buffer synchronously (`device.queue.writeBuffer` copies immediately, `pipeline.ts:222-223`), which makes reuse safe *within* a frame—the main correctness hazard is cross-channel aliasing, called out explicitly below.

## Current state

Allocation sites, per frame:

- `packages/audio/src/oscilloscope/modes/xy.ts:12` — `const points = new Float32Array(sampleCount * 2);` in `generateFrame` (called once per tick from `runtime.ts:77`; `sampleCount` ≤ `MAX_TRACE_POINTS` = 4096, clamped at `runtime.ts:82-85`).
- `packages/audio/src/oscilloscope/renderer/uniforms.ts:52-62` — `packRendererUniforms` returns `new Float32Array([ ...8 values ])`; called once per `drawFrame` at `pipeline.ts:208`, written to the GPU at `pipeline.ts:222`.
- `packages/audio/src/oscilloscope/signal/analyser-source.ts` (live/fake mic path):
  - `:23-27` `readAnalyserSamples` — `new Float32Array(analyser.fftSize)` per call; `getSamples` is called once per channel per tick.
  - `:37` `conditionSampleBuffer` — `const output = input.slice();` per call, and `:60` allocates a zeroed array on the silence path.
  - `:83` `deriveStereoBuffer` — `new Float32Array(input.length)` per call (mono derived-stereo path), then conditions the derived buffer again (`:94`, intentional renormalization — do not change the math).
- `packages/audio/src/oscilloscope/signal/oscillator-source.ts:61-73` — `buildSamples` allocates `new Float32Array(fftSize)` per channel per frame refresh (`readFrameSamples`, `:75-91`, already caches per-frame via `servedChannels` bookkeeping — keep that logic).

Consumers and their assumptions:

- `runtime.ts:74-89` — `xyMode.generateFrame({ signals: activeProvider, ... })` then `renderer.drawFrame(geometry, config, deltaSeconds)`. Geometry is consumed synchronously within the tick.
- `xy.ts:9-10` — `const left = signals.getSamples(0); const right = signals.channelCount === 2 ? signals.getSamples(1) : left;` — **left must still hold channel-0 data while channel 1 is being produced**. This is the aliasing hazard: channel 0 and channel 1 must never share an output buffer.
- `pipeline.ts:218-223` — `drawFrame` may `subarray` the points and immediately copies both uniforms and points into GPU buffers via `writeBuffer`. Nothing retains the arrays after `drawFrame` returns.
- `runtime.ts:24-25` and `renderer/pipeline.ts:24` independently define the same 8192-float renderer budget; `runtime.ts` derives its 4096-point cap from that value. A third mode-local literal would deepen this drift risk, so this plan centralizes the existing limit before `xy.ts` uses it.
- `packages/audio/src/oscilloscope/signal/signal-provider.ts` — the `SignalProvider` contract (9 lines):

```ts
export type SignalProvider = {
  channelCount: 1 | 2;
  fftSize: number;
  frequencyBinCount: number;
  sampleRate: number;
  smoothing: number;
  getFrequencyData(channel: 0 | 1): Float32Array;
  getSamples(channel: 0 | 1): Float32Array;
};
```

Existing tests (the safety net — they copy via `Array.from(...)` before asserting, so buffer reuse does not break them, but re-read them before editing):
- `signal/__tests__/analyser-source.test.ts` (incl. `:52-60` asserting derived-stereo channels differ)
- `signal/__tests__/oscillator-source.test.ts` (incl. `:44-52` asserting new values after `update`, `:74-77` asserting one clock call per frame)
- `modes/__tests__/xy.test.ts`, `renderer/__tests__/uniforms.test.ts`, `renderer/__tests__/pipeline.test.ts`, `__tests__/runtime.test.ts`

Conventions: TypeScript strict, no `any`; arrow-function factories returning object literals (see the excerpts); Biome formatting; conventional commits.

Live drift check: none of the in-scope oscilloscope files changed between `bff3b6b` and `704eeb9`; the excerpts and allocation sites above remain current.

## Commands you will need

| Purpose | Command | Expected on success |
|---------|---------|---------------------|
| Audio tests | `turbo run test --filter=@kkb/audio --force` | exit 0, all pass |
| Full loop | `bun run check-types && bun run test && bun run format-and-lint` | all exit 0 |
| Live route | `turbo run dev --filter=@kkb/web` | web app available at `http://localhost:3000` |

## Suggested executor toolkit

- Use Codex's Browser plugin for `/oscilloscope` interaction, visible-state
  checks, screenshots, and console inspection in Steps 1 and 8.
- Use Codex's Computer Use plugin for a native browser DevTools Performance or
  Memory profile when Browser does not expose allocation profiling. Follow its
  action-time confirmation requirements.
- Browser/Computer Use evidence supplements the automated tests and structural
  assertion; it never replaces them.

## Scope

**In scope** (the only files you should modify):
- `packages/audio/src/oscilloscope/limits.ts` (create; leaf constants module)
- `packages/audio/src/oscilloscope/runtime.ts` (replace local renderer-limit constants with imports only)
- `packages/audio/src/oscilloscope/modes/xy.ts`
- `packages/audio/src/oscilloscope/renderer/uniforms.ts`
- `packages/audio/src/oscilloscope/renderer/pipeline.ts` (shared-limit import plus the `packRendererUniforms` call site)
- `packages/audio/src/oscilloscope/signal/analyser-source.ts`
- `packages/audio/src/oscilloscope/signal/oscillator-source.ts`
- `packages/audio/src/oscilloscope/signal/signal-provider.ts` (doc comment only)
- `packages/audio/src/oscilloscope/modes/__tests__/xy.test.ts`
- `packages/audio/src/oscilloscope/renderer/__tests__/pipeline.test.ts`
- `packages/audio/src/oscilloscope/renderer/__tests__/uniforms.test.ts`
- `packages/audio/src/oscilloscope/signal/__tests__/analyser-source.test.ts`
- `packages/audio/src/oscilloscope/signal/__tests__/oscillator-source.test.ts`
- `plans/README.md` (status row update)

**Out of scope** (do NOT touch):
- The `runtime.ts` tick structure and `EMPTY_GEOMETRY` — only replace its local renderer-limit declarations with imports from `limits.ts`.
- Renderer `destroy()` / device lifetime in `pipeline.ts:277-283` — a documented decision (`docs/plans/2026-04-25-oscilloscope-renderer-post-merge-hardening.md`); leave it alone.
- The derived-stereo conditioning math (`analyser-source.ts:79-95`) — the double normalization is intentional; only its allocations change.
- `apps/web` oscilloscope components; WGSL shaders; `getFrequencyData` allocation (called from UI code paths, not the render tick — leave it).

## Git workflow

- Branch: `codex/plan-005-scope-render-allocations`
- Worktree (explicitly operator-authorized for this queue): create a dedicated worktree for this branch from updated `main` after Plan 004 is merged; do not switch the primary `main` checkout.
- Commit per logical unit (shared limits/xy, uniforms, analyser, oscillator), messages like `perf: reuse xy mode point buffer across frames`
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Capture the live baseline before editing

Start `turbo run dev --filter=@kkb/web` from the untouched plan branch. Use
Codex's Browser plugin to open `http://localhost:3000/oscilloscope`, leave the
default oscillator source running for a 5-second warm-up, and then capture a
15-second steady-state observation. Use Computer Use with a native browser's
DevTools Performance or Memory allocation profiler if Browser cannot expose
allocation data.

Record in working notes for the eventual PR verification summary:

- commit SHA, route, source mode/configuration, warm-up and capture durations;
- whether repeated `Float32Array` allocations can be attributed to `xy.ts`,
  `uniforms.ts`, or `oscillator-source.ts` through source maps;
- minor-GC count, frame/long-task summary, and steady-state heap trend when the
  selected profiler exposes them; and
- a screenshot or profiler capture reference.

The oscillator profile is mandatory. A second mic/derived-stereo capture is
useful but optional if microphone permission or stable input is unavailable;
record that limitation rather than changing application behavior.

**Verify**: a reproducible baseline configuration and capture are recorded
before any source edit. If neither Browser nor Computer Use can expose a usable
live route/profiler after reasonable setup, STOP and report the tooling blocker.

### Step 2: Document the buffer-ownership contract

In `signal-provider.ts`, add a doc comment on `getSamples`: the returned buffer is owned by the provider and its contents are stable until the next `getSamples` call **for the same channel**; a call for the *other* channel must never mutate it; callers must copy if they retain it across frames. (This is the contract the rest of the plan implements; channel 0 and channel 1 results must remain simultaneously valid because `modes/xy.ts:9-10` holds both while building geometry.)

**Verify**: `bun run check-types` → exit 0.

### Step 3: Centralize the renderer limit and reuse the XY points buffer

Create `packages/audio/src/oscilloscope/limits.ts` as a leaf module with no imports. Export `MAX_VERTEX_FLOATS = 8192` and `MAX_TRACE_POINTS = MAX_VERTEX_FLOATS / 2`. Remove the duplicate local declarations from `runtime.ts` and `renderer/pipeline.ts` and import the appropriate shared constant in each file. This is a constant-ownership change only; do not alter the runtime clamp or GPU buffer behavior.

In `xy.ts`, import `MAX_TRACE_POINTS` and move backing-buffer allocation to the factory: `createXyMode` allocates one `Float32Array(MAX_TRACE_POINTS * 2)`. Do not introduce a mode-local 4096/8192 limit.

Inside `generateFrame`:

- Clamp `sampleCount` with `Math.min(MAX_TRACE_POINTS, params.sampleCount, left.length, right.length)` so direct callers cannot write past the fixed buffer even though the runtime already caps its input.
- Fill only the first `sampleCount * 2` floats.
- Cache the `buffer.subarray(0, sampleCount * 2)` view and recreate that view only when its length changes. Do not create a new subarray view on every steady-state frame.
- Return the cached active view in the geometry object. Reusing the backing buffer and cached view means previous geometry contents are live and may change on the next frame; that ownership rule must be covered by tests and maintenance notes.

**Verify**: `rg -n '\b(8192|8_192|4096|4_096)\b|^(export )?const MAX_[A-Z0-9_]*(VERTEX|TRACE|POINT)' packages/audio/src/oscilloscope -g '*.ts' -g '!**/__tests__/**'` → prints only the two exports in `limits.ts`; `turbo run test --filter=@kkb/audio --force` → `xy.test.ts`, `runtime.test.ts`, and `pipeline.test.ts` pass, including the existing 4096-point runtime cap.

### Step 4: Reuse the uniforms array

In `uniforms.ts`, change `packRendererUniforms(values, target: Float32Array)` so the target is required. Write the 8 floats into the target and return the same instance; do not preserve the allocating one-argument form because the only production caller is updated in this plan. Reject a target shorter than 8 floats with a clear error. In `pipeline.ts`, allocate one `const uniformScratch = new Float32Array(8);` inside `createWebGpuRenderer` and pass it at the `:208` call site.

Update `uniforms.test.ts` to provide a target and assert both packed values and identity (`payload === target`). Extend `renderer/__tests__/pipeline.test.ts`'s fake queue to record the exact `data` argument passed to each `writeBuffer` call. Draw two frames and assert that the first and third writes (the two eight-float uniform payloads; vertex writes are second and fourth) are the **same `Float32Array` instance**. This test must fail if `drawFrame` allocates a fresh uniform array per call.

**Verify**: `turbo run test --filter=@kkb/audio --force` → `uniforms.test.ts` and `pipeline.test.ts` pass.

### Step 5: Reuse oscillator sample buffers

In `oscillator-source.ts`: allocate two persistent buffers (`leftBuffer`, `rightBuffer`, each `Float32Array(fftSize)`) in the factory. Change `buildSamples(oscillator, now, target)` to fill `target` in place and return it. `readFrameSamples` fills `leftBuffer`/`rightBuffer` instead of allocating; keep the `frameSamples`/`servedChannels` bookkeeping exactly as-is (it already prevents mid-frame regeneration).

**Verify**: `turbo run test --filter=@kkb/audio --force` → `oscillator-source.test.ts` passes, including the `update` and single-clock-call cases.

### Step 6: Reuse analyser buffers — the aliasing-sensitive step

In `analyser-source.ts`, give the provider factory four persistent buffers sized `left.fftSize`:

- `rawScratch` — target for `getFloatTimeDomainData` reads (both channels may share it: it is fully consumed before each return).
- `channel0Out` — conditioned output for channel 0. Written ONLY by `getSamples(0)`.
- `channel1Out` — conditioned/derived output for channel 1. Written ONLY by `getSamples(1)`.
- `derivedScratch` — intermediate scratch for `getSamples(1)`'s mono path (holds the conditioned mono read the derivation consumes).

Rework the helpers to an out-parameter style: `readAnalyserSamples(analyser, rawScratch)`; `conditionSampleBuffer(input, out, conditioning)` copies `input` into `out` (replacing `input.slice()`), zero-fills `out` on the silence path (replacing `:60`), and returns `out` — it must tolerate `input === out` (copy is then a no-op; centering and gain already operate index-by-index in place); `deriveStereoBuffer(input, out)` keeps the identical math but writes into `out`, and `input` must be a **different** buffer than `out` (the math at `:86-91` reads earlier indices — `index - 1`, `index - delay` — which in-place writing would corrupt).

Even when `sampleConditioning` is absent, `conditionSampleBuffer` must copy `input` into the channel-specific output and return that output. Returning the shared `rawScratch` would let a later cross-channel read mutate a previously returned channel buffer.

Wire `getSamples` so each channel writes only its own output buffer:

- **Channel 0** (all modes): read into `rawScratch`, condition `rawScratch → channel0Out`, return `channel0Out`.
- **Channel 1, true stereo**: read `right` into `rawScratch`, condition `rawScratch → channel1Out`, return `channel1Out`.
- **Channel 1, mono derived-stereo**: read `left` into `rawScratch`, condition `rawScratch → derivedScratch`, derive `derivedScratch → channel1Out`, then condition `channel1Out` in place (`input === out`). Return `channel1Out`. This reproduces the current numeric semantics exactly — today's `getSamples(1)` also performs its own fresh read + conditioning before deriving (`:121-129`) — while **never touching `channel0Out`**, which the Step 2 contract forbids.
- Duplicate-mono (`channelCount` 1): `xy.ts` reuses `left` for both axes and never calls `getSamples(1)`, so `channel1Out`/`derivedScratch` sit unused there — fine.

**Verify**: `turbo run test --filter=@kkb/audio --force` → `analyser-source.test.ts` passes unchanged, especially the derived-stereo difference assertion (`:52-60`).

### Step 7: Add reuse-guard tests

Add to the existing suites:
- `oscillator-source.test.ts`: `getSamples(0)` returns the **same array instance** across two frames (after both channels served), and channel 0/channel 1 instances differ.
- `analyser-source.test.ts`: same-instance across calls per channel both without conditioning and in derived-stereo mode; channel 0 and channel 1 instances differ; and an aliasing guard that compares the **live channel-0 reference** against a snapshot copied *before* the cross-channel call — the copy must happen first, then the mutation-suspect call, then re-read the live buffer:

  ```ts
  const left = provider.getSamples(0);
  const before = Array.from(left);   // snapshot BEFORE the cross-channel call
  provider.getSamples(1);            // must not mutate the channel-0 buffer
  expect(Array.from(left)).toEqual(before); // re-reads the live buffer's contents
  ```

  (A snapshot alone proves nothing — it is the post-call re-read of the same live reference that detects corruption.)
- `xy.test.ts`: two consecutive calls with the same sample count return the same `points` view instance with correct values on the second frame; a separate oversized direct call clamps the result to 4096 points / 8192 floats.
- `uniforms.test.ts`: `packRendererUniforms(values, target)` returns the exact provided target, writes all eight expected values, and rejects a target shorter than eight floats.
- `pipeline.test.ts`: the uniform `writeBuffer` payload from two consecutive `drawFrame` calls is the same eight-float array instance.

**Verify**: `turbo run test --filter=@kkb/audio --force` → all pass, including the new cases.

Run this structural assertion from the repo root. It fails if backing-buffer construction remains in the hot sections or analyser conditioning still uses `.slice()`:

```bash
bun -e '
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(path, "utf8");
const sliceFrom = (source, marker, name) => {
  const index = source.indexOf(marker);
  if (index < 0) throw new Error(`missing marker: ${name}`);
  return source.slice(index);
};
const assertNoAllocation = (source, name) => {
  if (/new Float32Array|\.slice\(/.test(source)) {
    throw new Error(`hot-path allocation remains: ${name}`);
  }
};

const xy = read("packages/audio/src/oscilloscope/modes/xy.ts");
const pipeline = read("packages/audio/src/oscilloscope/renderer/pipeline.ts");
const uniforms = read("packages/audio/src/oscilloscope/renderer/uniforms.ts");
const analyser = read("packages/audio/src/oscilloscope/signal/analyser-source.ts");
const oscillator = read("packages/audio/src/oscilloscope/signal/oscillator-source.ts");

assertNoAllocation(sliceFrom(xy, "generateFrame:", "xy.generateFrame"), "xy.generateFrame");
assertNoAllocation(
  sliceFrom(uniforms, "export const packRendererUniforms", "packRendererUniforms"),
  "packRendererUniforms",
);
assertNoAllocation(sliceFrom(pipeline, "const drawFrame", "pipeline.drawFrame"), "pipeline.drawFrame");
const analyserFactory = analyser.indexOf("export const createAnalyserSignalProvider");
if (analyserFactory < 0) throw new Error("missing analyser provider factory");
assertNoAllocation(analyser.slice(0, analyserFactory), "analyser helpers");
assertNoAllocation(sliceFrom(analyser, "getSamples:", "analyser.getSamples"), "analyser.getSamples");
assertNoAllocation(
  sliceFrom(oscillator, "const buildSamples", "oscillator.buildSamples"),
  "oscillator.buildSamples",
);
console.log("ok");
'
```

**Verify**: prints `ok` and exits 0. The same-count XY identity test is the separate machine-checkable guard that its permitted cached `subarray` view is not recreated every frame.

### Step 8: Repeat the live profile and functional smoke check

Using the same route, source mode/configuration, warm-up, capture duration, and
profiler from Step 1, repeat the capture after the automated reuse tests pass.
Use Browser to verify the oscilloscope still renders and responds to controls
without a visible or console error; use Computer Use for the same native
DevTools surface used by the baseline.

Compare and record the before/after allocation attribution, minor-GC count,
frame/long-task summary, and heap trend in the PR verification summary. The
required performance claim is narrow: the named steady-state typed-array
allocation sites have been structurally removed. GC/frame improvements may be
reported only if the comparable capture supports them. No visible improvement
is required for acceptance, but a clear functional, frame-time, or memory
regression is a STOP condition.

**Verify**: comparable before/after evidence is recorded; the live route has no
new visible/console error; and any stronger performance claim is supported by
the capture rather than inferred from source structure.

### Step 9: Full verification loop

**Verify**: `bun run check-types && bun run test && bun run format-and-lint` → all exit 0.

## Test plan

Covered by Steps 3–7: every touched module's existing value expectations must pass unchanged, plus the new reuse, clamping, shared-limit, target-identity, and aliasing guards in Step 7. Structural pattern: the existing tests in the same `__tests__` directories. Steps 1 and 8 add comparable live-browser evidence without replacing those deterministic checks.

## Done criteria

- [ ] Reuse tests prove stable identities for XY views, the pipeline's uniform write payload, oscillator channels, and analyser channels; the XY direct-call test proves the 4096-point clamp
- [ ] The Step 3 production-source `rg` assertion shows `limits.ts` as the only renderer-limit declaration/literal source; runtime, renderer, and XY mode import it rather than using alternate constants or inline 4096/8192 literals
- [ ] The Step 7 structural assertion prints `ok`, proving no backing-buffer construction remains in the named hot sections and no analyser helper retains a `.slice()` conditioning copy
- [ ] `turbo run test --filter=@kkb/audio --force` exits 0 with the Step 7 tests present
- [ ] Comparable Step 1/Step 8 Browser/Computer Use profile evidence is recorded in the PR, with no unsupported claim of visible frame or GC improvement
- [ ] `bun run check-types`, `bun run test`, `bun run format-and-lint` all exit 0
- [ ] No files outside the in-scope list modified (`git status`)
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report back (do not improvise) if:

- Any existing test's *expected values* would need to change — numeric behavior must be identical; a value change means an aliasing or ordering bug in the rework, not a test to update.
- You find a consumer that retains `getSamples`/`generateFrame` results across frames (search `getSamples(` and `generateFrame(` across `packages/audio` and `apps/web` first) — the reuse contract would break it.
- `fftSize` turns out to be mutable after provider construction anywhere (it is not, per current code — analysers are configured once in `apps/web/lib/oscilloscope/create-mic-provider.ts:127-128,154-155`).
- A true-stereo provider supplies different left/right `fftSize` values. Current production and test analysers use matching sizes; mismatched sizes require a separate contract decision rather than improvising buffer lengths here.
- The post-change live profile shows a clear functional, frame-time, sustained-heap, or GC regression under the same configuration; keep the evidence and report it instead of claiming success from structural checks alone.

## Maintenance notes

- The buffer-ownership contract (Step 2 doc comment) is now load-bearing: any new `SignalProvider` implementation or consumer must honor it; reviewers should check for retained references.
- XY geometry points are likewise owned by the mode and live only until its next `generateFrame` call; callers retaining a frame must copy it.
- `limits.ts` owns the shared renderer capacity; any future budget change must update that module and retain the runtime/renderer/XY tests that exercise the cap.
- If a second display mode is added alongside XY, it needs its own persistent geometry buffer — do not share the XY buffer across modes.
- Deferred intentionally: `getFrequencyData` allocations (not on the render tick) and any GPU-side/shader optimization.
