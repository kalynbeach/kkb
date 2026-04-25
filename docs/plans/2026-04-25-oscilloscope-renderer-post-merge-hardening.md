# Oscilloscope Renderer Post-merge Hardening Plan

**Date:** 2026-04-25  
**Issue:** #30 `audio: harden oscilloscope renderer post-merge`  
**Status:** Proposed implementation plan

## Summary

Issue #30 should be a narrow hardening pass on the existing WebGPU oscilloscope renderer. The goal is not to improve visual fidelity yet and not to start playback integration. The goal is to remove one known per-frame allocation, make renderer cleanup ownership explicit, and leave the renderer in a safer state before #46, #31, and #34.

Primary target:

- `packages/audio/src/oscilloscope/renderer/pipeline.ts`

Expected output:

- cached composite bind group keyed to the current history texture view
- explicit cleanup decision for `renderer.destroy()` and `GPUDevice.destroy()`
- focused tests or documented rationale where practical
- no product-surface changes

## Context

The oscilloscope V1 work established the right ownership boundary:

- `@kkb/audio` owns the headless oscilloscope runtime, signal contracts, mode geometry, and WebGPU renderer.
- `apps/web` owns browser orchestration, permissions, route state, mic setup, and future playback-analysis wiring.
- `@kkb/ui` is not involved in the oscilloscope renderer path.

The active renderer now uses a single history texture path and composites that texture to the swapchain. The main small debt in `pipeline.ts` is that `drawFrame()` creates a new composite bind group every frame:

```ts
const historyView = history.createView();
const compositeBindGroup = device.createBindGroup({
  layout: compositePipeline.getBindGroupLayout(0),
  entries: [
    { binding: 0, resource: historyView },
    { binding: 1, resource: sampler },
    { binding: 2, resource: { buffer: uniformBuffer } },
  ],
});
```

The bind group only needs to change when the history texture/view changes, which currently happens on initial creation and resize. Caching it should reduce unnecessary per-frame churn without changing renderer behavior.

## Non-goals

Do not include any of the following in this issue:

- renderer persistence/glow tuning from #34
- playback analyser or track visualization work from #31
- oscilloscope session extraction from #46
- new display modes, trigger logic, or CRT effects
- app route UI changes
- package export reshaping
- broad WebGPU abstraction or helper extraction

## Implementation plan

### Step 1 — Introduce a cached history render target record

Replace the independent `historyTexture` state with a small record that keeps the texture, view, and composite bind group together.

Suggested shape:

```ts
type HistoryTarget = {
  texture: GPUTexture;
  view: GPUTextureView;
  compositeBindGroup: GPUBindGroup;
};
```

Implementation details:

- Keep `historyPrimed` separate, because it represents whether the current target has been cleared/initialized.
- Create the `GPUTextureView` once per history texture.
- Create the composite bind group once per history texture view.
- Use the cached `historyTarget.view` for both:
  - the history render pass color attachment
  - the composite shader texture binding
- Rebuild the full target only when the canvas-backed history texture changes.

### Step 2 — Rebuild only on initialization and resize

Refactor `rebuildHistoryTexture()` into something like `rebuildHistoryTarget()`:

```ts
const createHistoryTarget = (): HistoryTarget => {
  const texture = createHistoryTexture();
  const view = texture.createView();
  const compositeBindGroup = device.createBindGroup({
    layout: compositeBindGroupLayout,
    entries: [
      { binding: 0, resource: view },
      { binding: 1, resource: sampler },
      { binding: 2, resource: { buffer: uniformBuffer } },
    ],
  });

  return { texture, view, compositeBindGroup };
};
```

Notes:

- Store `const compositeBindGroupLayout = compositePipeline.getBindGroupLayout(0)` once near pipeline creation.
- Destroy the previous target texture before replacing the target.
- Set `historyPrimed = false` whenever the target is rebuilt.
- Avoid destroying the cached `GPUTextureView` directly; WebGPU texture views do not expose a destroy method. Destroying the texture is the cleanup boundary.

### Step 3 — Use the cached bind group in `drawFrame()`

Update `drawFrame()` to require the current target:

```ts
const historyTarget = currentHistoryTarget;
if (!historyTarget) {
  throw new Error("Oscilloscope history target is not initialized.");
}
```

Then replace per-frame creation with cached resources:

- history pass view: `historyTarget.view`
- composite pass bind group: `historyTarget.compositeBindGroup`

This should eliminate all per-frame `device.createBindGroup()` calls in `drawFrame()`.

### Step 4 — Make cleanup ownership explicit

Current `destroy()` destroys only the history texture and clears local state. Issue #30 asks for an explicit decision around renderer/device teardown.

Recommended decision:

> `renderer.destroy()` should destroy renderer-owned GPU resources, including the history texture, but should not call `device.destroy()` unless the renderer is deliberately the exclusive device owner and tests/docs establish that contract.

Rationale:

- The renderer currently creates its own device, so destroying the device is technically possible.
- However, `GPUDevice.destroy()` is a broad operation that invalidates all resources from that device and can make future reuse assumptions brittle if the renderer later accepts an injected/shared device.
- The safer near-term contract is: `destroy()` releases explicit renderer-owned resources and stops future draws; device lifetime remains an implementation detail unless a later resource-management issue makes device ownership explicit.
- This avoids overcommitting to a device-destroy behavior before the renderer/session boundaries settle.

Implementation:

- Add a short comment in `destroy()` documenting the decision.
- Destroy the current history texture through a helper such as `destroyHistoryTarget()`.
- Set the target to `null` and `historyPrimed = false`.
- Do not call `device.destroy()` in this issue.

Optional defensive addition:

- Track a `destroyed` boolean and make `drawFrame()` throw a readable error after destroy.
- Only add this if it stays small and does not require broad runtime changes.

### Step 5 — Add focused test coverage if practical

The renderer currently has unit coverage for uniforms but not for WebGPU pipeline resource churn. A focused test is useful if it can be added without building a large fake WebGPU harness.

Preferred test target:

- `packages/audio/src/oscilloscope/renderer/__tests__/pipeline.test.ts`

Useful assertions:

1. Initial renderer creation creates one composite bind group for the initial history target.
2. Multiple `drawFrame()` calls without resize do not create additional composite bind groups.
3. `resize()` to a new backing size rebuilds the history target and creates one additional composite bind group.
4. `destroy()` destroys the current history texture.
5. `destroy()` does not call `device.destroy()`; this locks in the explicit cleanup decision.

If the fake WebGPU harness becomes too large, prefer a smaller code comment plus existing runtime tests over a brittle test. Do not let the test harness become the real work.

## Suggested code-level sketch

Approximate structure inside `createWebGpuRenderer()`:

```ts
const compositeBindGroupLayout = compositePipeline.getBindGroupLayout(0);

type HistoryTarget = {
  texture: GPUTexture;
  view: GPUTextureView;
  compositeBindGroup: GPUBindGroup;
};

let historyTarget: HistoryTarget | null = null;
let historyPrimed = false;

const createHistoryTarget = (): HistoryTarget => {
  const texture = createHistoryTexture();
  const view = texture.createView();
  const compositeBindGroup = device.createBindGroup({
    layout: compositeBindGroupLayout,
    entries: [
      { binding: 0, resource: view },
      { binding: 1, resource: sampler },
      { binding: 2, resource: { buffer: uniformBuffer } },
    ],
  });

  return { texture, view, compositeBindGroup };
};

const destroyHistoryTarget = () => {
  historyTarget?.texture.destroy();
  historyTarget = null;
  historyPrimed = false;
};

const rebuildHistoryTarget = () => {
  destroyHistoryTarget();
  historyTarget = createHistoryTarget();
};
```

Then in `drawFrame()`:

```ts
const history = historyTarget;
if (!history) {
  throw new Error("Oscilloscope history target is not initialized.");
}

// use history.view in the history pass
// use history.compositeBindGroup in the screen pass
```

## Validation plan

Run targeted checks first:

```bash
bun run test -- --filter=@kkb/audio --filter=@kkb/web
bun run check-types -- --filter=@kkb/audio --filter=@kkb/web
```

Then run repo-level validation:

```bash
bun run test
bun run check-types
bun run format-and-lint
```

Known lint baseline to watch:

- `bun run format-and-lint` currently reports pre-existing warnings in:
  - `docs/diagrams/2026-04-23-kkb-audio-report.html`
  - `packages/ui/src/components/sidebar.tsx`

Do not broaden #30 to fix those warnings unless explicitly requested.

## Browser verification

Because this changes WebGPU resource lifetime, do a short browser smoke after automated checks if time permits:

1. Start the web app:

   ```bash
   turbo run dev --filter=@kkb/web
   ```

2. Visit `http://localhost:3000/oscilloscope`.
3. Confirm the trace renders.
4. Change visual controls that cause repeated frames.
5. Resize the browser window to force history target rebuild.
6. Switch between oscillator and mic/fake mic modes if convenient.
7. Confirm there are no WebGPU bind-group or destroyed-resource errors in the console.

## Acceptance criteria mapping

Issue #30 criterion | Plan coverage
--- | ---
No per-frame composite bind-group churn remains | Cache `HistoryTarget.compositeBindGroup` and reuse it across frames
Renderer cleanup behavior is explicit | Document no `device.destroy()` decision and destroy renderer-owned texture resources
Focused tests only where directly needed | Add pipeline resource-churn tests only if the fake harness stays small
Keep scope narrow | No #31/#34/#46 work, no UI changes
Targeted checks pass | Run audio/web tests and type-checks, then repo checks

## Risks and mitigations

### Risk: cached view becomes stale after resize

Mitigation:

- Rebuild the whole `HistoryTarget` whenever the canvas backing size changes.
- Always read the current target from `historyTarget` inside `drawFrame()`.

### Risk: test harness overfits fake WebGPU behavior

Mitigation:

- Keep tests at the level of resource creation counts and destroy calls.
- Avoid simulating shader/pipeline correctness.
- If the harness gets large, prefer manual browser verification and a concise code comment.

### Risk: not calling `device.destroy()` leaks resources

Mitigation:

- The renderer explicitly destroys its owned history texture.
- Buffers, pipelines, bind groups, and shader modules are device-owned and do not have individual destroy methods in the same way textures/buffers do.
- Revisit device ownership in a future issue if the renderer begins accepting injected devices or if browser profiling shows retained resources.

## Recommended commit scope

One implementation commit should be enough:

- `refactor(audio): cache oscilloscope composite bind group`

If tests require a separate substantial fake WebGPU harness, split into:

1. `test(audio): cover oscilloscope renderer resource reuse`
2. `refactor(audio): cache oscilloscope composite bind group`
