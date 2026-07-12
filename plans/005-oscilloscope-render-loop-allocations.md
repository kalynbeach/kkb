# Plan 005: Eliminate per-frame Float32Array allocations in the oscilloscope render loop

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat bff3b6b..HEAD -- packages/audio/src/oscilloscope`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: MED
- **Depends on**: none (001 recommended first; the existing oscilloscope suites are the safety net)
- **Category**: perf
- **Planned at**: commit `bff3b6b`, 2026-07-11

## Why this matters

The oscilloscope render tick runs at requestAnimationFrame cadence (~60 fps) in `packages/audio/src/oscilloscope/runtime.ts:63-96`. Each tick currently allocates 3–6 short-lived `Float32Array`s — XY geometry, packed uniforms, and per-channel sample buffers (worst on the live-mic mono path, which also `slice()`s during conditioning and allocates a derived-stereo buffer). That is continuous minor-GC pressure inside a latency-sensitive graphics loop, producing periodic frame-time spikes. All of these buffers have fixed maximum sizes known at construction time (`fftSize` = 1024, `MAX_TRACE_POINTS` = 4096, uniforms = 8 floats), so they can be allocated once per provider/mode/renderer and overwritten in place. The GPU consumes each buffer synchronously (`device.queue.writeBuffer` copies immediately, `pipeline.ts:222-223`), which makes reuse safe *within* a frame — the one real hazard is cross-channel aliasing, called out explicitly below.

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

## Commands you will need

| Purpose | Command | Expected on success |
|---------|---------|---------------------|
| Audio tests | `turbo run test --filter=@kkb/audio --force` | exit 0, all pass |
| Full loop | `bun run check-types && bun run test && bun run format-and-lint` | all exit 0 |

## Scope

**In scope** (the only files you should modify):
- `packages/audio/src/oscilloscope/modes/xy.ts`
- `packages/audio/src/oscilloscope/renderer/uniforms.ts`
- `packages/audio/src/oscilloscope/renderer/pipeline.ts` (only the `packRendererUniforms` call site)
- `packages/audio/src/oscilloscope/signal/analyser-source.ts`
- `packages/audio/src/oscilloscope/signal/oscillator-source.ts`
- `packages/audio/src/oscilloscope/signal/signal-provider.ts` (doc comment only)
- The corresponding `__tests__` files for reuse assertions
- `plans/README.md` (status row update)

**Out of scope** (do NOT touch):
- `runtime.ts` — the tick's structure and `EMPTY_GEOMETRY` are fine as-is.
- Renderer `destroy()` / device lifetime in `pipeline.ts:277-283` — a documented decision (`docs/plans/2026-04-25-oscilloscope-renderer-post-merge-hardening.md`); leave it alone.
- The derived-stereo conditioning math (`analyser-source.ts:79-95`) — the double normalization is intentional; only its allocations change.
- `apps/web` oscilloscope components; WGSL shaders; `getFrequencyData` allocation (called from UI code paths, not the render tick — leave it).

## Git workflow

- Branch: `advisor/005-scope-render-allocations`
- Commit per module (xy, uniforms, analyser, oscillator), messages like `perf: reuse xy mode point buffer across frames`
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Document the buffer-ownership contract

In `signal-provider.ts`, add a doc comment on `getSamples`: the returned buffer is owned by the provider and its contents are stable until the next `getSamples` call **for the same channel**; a call for the *other* channel must never mutate it; callers must copy if they retain it across frames. (This is the contract the rest of the plan implements; channel 0 and channel 1 results must remain simultaneously valid because `modes/xy.ts:9-10` holds both while building geometry.)

**Verify**: `bun run check-types` → exit 0.

### Step 2: Reuse the XY points buffer

In `xy.ts`, move the allocation to the factory: `createXyMode` allocates one `Float32Array(MAX_POINTS * 2)` (define `const MAX_XY_POINTS = 4096;` locally — it mirrors `MAX_TRACE_POINTS` in `runtime.ts:24-25`), fills the first `sampleCount * 2` slots each `generateFrame`, and returns `{ kind: "line-strip", points: buffer.subarray(0, sampleCount * 2) }`.

**Verify**: `turbo run test --filter=@kkb/audio --force` → `xy.test.ts` and `runtime.test.ts` pass unchanged.

### Step 3: Reuse the uniforms array

In `uniforms.ts`, change `packRendererUniforms(values, target?: Float32Array)` — write the 8 floats into `target` when provided (return it), else allocate as today. In `pipeline.ts`, allocate one `const uniformScratch = new Float32Array(8);` inside `createWebGpuRenderer` and pass it at the `:208` call site.

**Verify**: `turbo run test --filter=@kkb/audio --force` → `uniforms.test.ts` and `pipeline.test.ts` pass.

### Step 4: Reuse oscillator sample buffers

In `oscillator-source.ts`: allocate two persistent buffers (`leftBuffer`, `rightBuffer`, each `Float32Array(fftSize)`) in the factory. Change `buildSamples(oscillator, now, target)` to fill `target` in place and return it. `readFrameSamples` fills `leftBuffer`/`rightBuffer` instead of allocating; keep the `frameSamples`/`servedChannels` bookkeeping exactly as-is (it already prevents mid-frame regeneration).

**Verify**: `turbo run test --filter=@kkb/audio --force` → `oscillator-source.test.ts` passes, including the `update` and single-clock-call cases.

### Step 5: Reuse analyser buffers — the aliasing-sensitive step

In `analyser-source.ts`, give the provider factory four persistent buffers sized `left.fftSize`:

- `rawScratch` — target for `getFloatTimeDomainData` reads (both channels may share it: it is fully consumed before each return).
- `channel0Out` — conditioned output for channel 0. Written ONLY by `getSamples(0)`.
- `channel1Out` — conditioned/derived output for channel 1. Written ONLY by `getSamples(1)`.
- `derivedScratch` — intermediate scratch for `getSamples(1)`'s mono path (holds the conditioned mono read the derivation consumes).

Rework the helpers to an out-parameter style: `readAnalyserSamples(analyser, rawScratch)`; `conditionSampleBuffer(input, out, conditioning)` copies `input` into `out` (replacing `input.slice()`), zero-fills `out` on the silence path (replacing `:60`), and returns `out` — it must tolerate `input === out` (copy is then a no-op; centering and gain already operate index-by-index in place); `deriveStereoBuffer(input, out)` keeps the identical math but writes into `out`, and `input` must be a **different** buffer than `out` (the math at `:86-91` reads earlier indices — `index - 1`, `index - delay` — which in-place writing would corrupt).

Wire `getSamples` so each channel writes only its own output buffer:

- **Channel 0** (all modes): read into `rawScratch`, condition `rawScratch → channel0Out`, return `channel0Out`.
- **Channel 1, true stereo**: read `right` into `rawScratch`, condition `rawScratch → channel1Out`, return `channel1Out`.
- **Channel 1, mono derived-stereo**: read `left` into `rawScratch`, condition `rawScratch → derivedScratch`, derive `derivedScratch → channel1Out`, then condition `channel1Out` in place (`input === out`). Return `channel1Out`. This reproduces the current numeric semantics exactly — today's `getSamples(1)` also performs its own fresh read + conditioning before deriving (`:121-129`) — while **never touching `channel0Out`**, which the Step 1 contract forbids.
- Duplicate-mono (`channelCount` 1): `xy.ts` reuses `left` for both axes and never calls `getSamples(1)`, so `channel1Out`/`derivedScratch` sit unused there — fine.

**Verify**: `turbo run test --filter=@kkb/audio --force` → `analyser-source.test.ts` passes unchanged, especially the derived-stereo difference assertion (`:52-60`).

### Step 6: Add reuse-guard tests

Add to the existing suites:
- `oscillator-source.test.ts`: `getSamples(0)` returns the **same array instance** across two frames (after both channels served), and channel 0/channel 1 instances differ.
- `analyser-source.test.ts`: same-instance across calls per channel; channel 0 and channel 1 instances differ in derived-stereo mode; and an aliasing guard that compares the **live channel-0 reference** against a snapshot copied *before* the cross-channel call — the copy must happen first, then the mutation-suspect call, then re-read the live buffer:

  ```ts
  const left = provider.getSamples(0);
  const before = Array.from(left);   // snapshot BEFORE the cross-channel call
  provider.getSamples(1);            // must not mutate the channel-0 buffer
  expect(Array.from(left)).toEqual(before); // re-reads the live buffer's contents
  ```

  (A snapshot alone proves nothing — it's the post-call re-read of the same live reference that detects corruption.)
- `xy.test.ts`: two consecutive `generateFrame` calls return geometry backed by the same underlying buffer (`points.buffer === previous.points.buffer`) with correct values on the second frame.

**Verify**: `turbo run test --filter=@kkb/audio --force` → all pass, including the new cases.

### Step 7: Full verification loop

**Verify**: `bun run check-types && bun run test && bun run format-and-lint` → all exit 0.

## Test plan

Covered by Steps 2–6: every touched module's existing suite must pass unchanged (they snapshot values via `Array.from`, so they also prove numeric behavior is identical), plus the new reuse/aliasing guards in Step 6. Structural pattern: the existing tests in the same `__tests__` directories.

## Done criteria

- [ ] `grep -n "new Float32Array" packages/audio/src/oscilloscope/modes/xy.ts packages/audio/src/oscilloscope/renderer/uniforms.ts packages/audio/src/oscilloscope/signal/analyser-source.ts packages/audio/src/oscilloscope/signal/oscillator-source.ts` shows allocations only in factory/setup scope (none inside `generateFrame`, `getSamples`, `buildSamples` bodies, `conditionSampleBuffer`, `deriveStereoBuffer`, or `packRendererUniforms` when a target is passed)
- [ ] `turbo run test --filter=@kkb/audio --force` exits 0 with the Step 6 tests present
- [ ] `bun run check-types`, `bun run test`, `bun run format-and-lint` all exit 0
- [ ] No files outside the in-scope list modified (`git status`)
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report back (do not improvise) if:

- Any existing test's *expected values* would need to change — numeric behavior must be identical; a value change means an aliasing or ordering bug in the rework, not a test to update.
- You find a consumer that retains `getSamples`/`generateFrame` results across frames (search `getSamples(` and `generateFrame(` across `packages/audio` and `apps/web` first) — the reuse contract would break it.
- `fftSize` turns out to be mutable after provider construction anywhere (it is not, per current code — analysers are configured once in `apps/web/lib/oscilloscope/create-mic-provider.ts:127-128,154-155`).

## Maintenance notes

- The buffer-ownership contract (Step 1 doc comment) is now load-bearing: any new `SignalProvider` implementation or consumer must honor it; reviewers should check for retained references.
- If a second display mode is added alongside XY, it needs its own persistent geometry buffer — do not share the XY buffer across modes.
- Deferred intentionally: `getFrequencyData` allocations (not on the render tick) and any GPU-side/shader optimization.
