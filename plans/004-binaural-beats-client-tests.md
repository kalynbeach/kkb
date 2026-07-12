# Plan 004: Add characterization tests for `BinauralBeatsClient`

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat bff3b6b..HEAD -- apps/web/components/binaural-beats apps/web/lib/binaural-beats`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: LOW
- **Depends on**: none (003 recommended first so the new suite can't silently vanish)
- **Category**: tests
- **Planned at**: commit `bff3b6b`, 2026-07-11

## Why this matters

`apps/web/components/binaural-beats/binaural-beats-client.tsx` (405 lines) is the most stateful, highest-churn UI in the app — 7 `useState` hooks, engine create/teardown, URL-hash preset hydration, start/stop race guards (`isStarting`/`isStopping`), and error recovery — with **zero tests**. Git history shows 7 commits touching it. Only the pure lib beneath it (`apps/web/lib/binaural-beats/`) is tested. Meanwhile the analogous `OscilloscopeClient` has a 653-line behavior suite. This plan adds a characterization suite pinning today's behavior so future edits (and any later refactor) regress loudly.

## Current state

- `apps/web/components/binaural-beats/binaural-beats-client.tsx` — the component under test. Key behavior, as of `bff3b6b`:
  - Engine lifecycle (`:135-142`): on mount, `createBinauralBeatEngine()` → `setEngine(...)`; cleanup calls `nextEngine.destroy()`.
  - Hash hydration (`:144-153`): on mount, `getBinauralBeatPresetFromHash(window.location.hash)`; when it resolves, `setSelectedPresetId(preset.id)` and applies the preset to config.
  - Live update (`:155-159`): `useEffect` — when `isPlaying`, `engine?.update(config)` on config change.
  - Preset selection (`:208-222`): `selectPreset` applies the preset and writes the hash via `window.history.replaceState(null, "", getHashWithBinauralBeatPreset(window.location.hash, preset.id))`.
  - Playback toggle (`:224-251`): async `togglePlayback` — when playing: sets `isStopping`, clears `isPlaying`, awaits `engine.stop()`; when stopped: sets `isStarting`, awaits `engine.play(config)`, then sets `isPlaying`. On throw: clears all three flags and sets `error` (rendered with `role="alert"`, `:293-300`).
  - Play button (`:306-322`): disabled while `!engine || isStarting || isStopping`; label cycles Play/Starting/Stop/Stopping.
  - Sliders carry `data-testid={"binaural-" + configKey + "-slider"}`; numeric inputs have `id={"binaural-" + configKey}` (`:67,83,97`).
  - The component currently takes **no props** — the engine module is imported directly (`:26-29`). Step 1 adds an injection seam.
- `apps/web/lib/binaural-beats/create-binaural-beat-engine.ts` — exports `type BinauralBeatEngine = { destroy: () => void; play: (config) => Promise<void>; stop: () => Promise<void>; update: (config) => void }` and `createBinauralBeatEngine`.
- `apps/web/lib/binaural-beats/binaural-beat-presets.ts` — hash format is a URL-search-params fragment: `#preset=<id>`; preset ids are `delta | theta | alpha | beta | gamma`. Helpers: `getBinauralBeatPresetFromHash`, `getHashWithBinauralBeatPreset`.
- `apps/web/lib/binaural-beats/binaural-beat-config.ts` — `DEFAULT_BINAURAL_BEAT_CONFIG`, `BINAURAL_BEAT_LIMITS`, `sanitizeBinauralBeatConfig`, `getBinauralBeatFrequencies`.

Conventions to match:
- **Test harness exemplar**: `apps/web/components/oscilloscope/__tests__/oscilloscope-client.test.tsx`. It builds a happy-dom `Window`, installs a list of globals (`document`, `window`, `navigator`, `HTMLElement`, event constructors, …) onto `globalThis`, renders with `react-dom/client` `createRoot` inside `act`, and restores globals in cleanup. Read that file first and reuse its DOM-environment helper structure (copy the helper into the new test file; do not import across test files).
- **Injection-prop convention**: `OscilloscopeClient` takes optional factory props (`oscilloscope-client.tsx:24-28`: `createMicProvider?`, `createScope?`, `loadCreateScope?`) defaulting to the real implementations. Mirror this.
- React 19 JSX transform — no default React import. TypeScript strict — no `any`.

## Commands you will need

| Purpose | Command | Expected on success |
|---------|---------|---------------------|
| New suite only | `cd apps/web && bun test binaural-beats-client` | all new tests pass |
| Workspace tests | `turbo run test --filter=@kkb/web --force` | exit 0, count grows from 93 |
| Typecheck | `bun run check-types` | exit 0 |
| Lint | `bun run format-and-lint` | exit 0 |

## Scope

**In scope** (the only files you should modify/create):
- `apps/web/components/binaural-beats/binaural-beats-client.tsx` — ONLY the minimal injection-prop change in Step 1; no behavior changes.
- `apps/web/components/binaural-beats/__tests__/binaural-beats-client.test.tsx` (create)
- `plans/README.md` (status row update)

**Out of scope** (do NOT touch):
- `apps/web/lib/binaural-beats/*` — already tested; any change there invalidates this plan's excerpts.
- `apps/web/components/oscilloscope/__tests__/oscilloscope-client.test.tsx` — read-only exemplar.
- Refactoring `BinauralBeatsClient` (splitting, renaming state, "improving" the race guards) — characterization means pinning current behavior, not changing it.

## Git workflow

- Branch: `advisor/004-binaural-client-tests`
- Commits: one for the injection prop, one for the suite; messages like `test: add binaural beats client characterization suite`
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Add an engine-factory injection prop

In `binaural-beats-client.tsx`, following the `OscilloscopeClientProps` convention:

```tsx
type BinauralBeatsClientProps = {
  createEngine?: typeof createBinauralBeatEngine;
};

export function BinauralBeatsClient({
  createEngine = createBinauralBeatEngine,
}: BinauralBeatsClientProps = {}) {
```

and change the mount effect (`:135-142`) to call `createEngine()` instead of `createBinauralBeatEngine()`. Add `createEngine` to that effect's dependency array. Nothing else changes.

**Verify**: `bun run check-types` → exit 0. `git diff --stat apps/web/components/binaural-beats/binaural-beats-client.tsx` → roughly ±10 lines.

### Step 2: Build the test scaffold

Create `apps/web/components/binaural-beats/__tests__/binaural-beats-client.test.tsx`, modeled on the oscilloscope suite's DOM helper. Additionally:

- Reset `window.location.hash` per test (set it on the happy-dom window before render for hydration cases).
- Stub engine factory:

```tsx
const createEngineStub = () => {
  const calls: { destroyed: number; played: BinauralBeatConfig[]; stopped: number; updated: BinauralBeatConfig[] } = {
    destroyed: 0, played: [], stopped: 0, updated: [],
  };
  let failNextPlay: Error | null = null;
  const engine: BinauralBeatEngine = {
    destroy: () => { calls.destroyed += 1; },
    play: async (config) => { if (failNextPlay) { const e = failNextPlay; failNextPlay = null; throw e; } calls.played.push(config); },
    stop: async () => { calls.stopped += 1; },
    update: (config) => { calls.updated.push(config); },
  };
  return { calls, engine, setFailNextPlay: (e: Error) => { failNextPlay = e; } };
};
```

**Verify**: `cd apps/web && bun test binaural-beats-client` → scaffold's first trivial test (component renders a Play button) passes.

### Step 3: Write the characterization cases

Cover, at minimum (use `data-testid` sliders / button text / `role="alert"` to observe):

1. **Engine lifecycle** — mount creates exactly one engine; unmount calls `destroy()` once.
2. **Hash hydration** — with `location.hash = "#preset=alpha"` before render, the alpha preset button has `aria-pressed="true"` and the displayed beat frequency matches the alpha preset's `beatFrequencyHz`.
3. **No hash** — no preset selected (`aria-pressed="true"` on zero preset buttons); config equals defaults.
4. **Preset selection** — clicking a preset button updates the beat display and calls `history.replaceState` with a hash containing `preset=<id>` (spy on `window.history.replaceState`).
5. **Play happy path** — click Play → `engine.play` called once with current (sanitized) config → button reads Stop; while the `play` promise is pending, button is disabled and reads Starting (drive with a deferred promise, resolve inside `act`).
6. **Stop** — with playback active, click Stop → `engine.stop` called; button returns to Play.
7. **Play failure** — `setFailNextPlay(new Error("blocked"))`; click Play → `role="alert"` shows "blocked", button re-enabled reading Play, `calls.played` empty.
8. **Live update** — while playing, change a slider/input value → `engine.update` called with the sanitized config; while stopped, changing config calls `update` zero times.

**Verify**: `cd apps/web && bun test binaural-beats-client` → 8+ tests pass.

### Step 4: Full verification loop

**Verify**: `bun run check-types && turbo run test --filter=@kkb/web --force && bun run format-and-lint` → all exit 0; `@kkb/web` test count ≥ 101.

## Test plan

The steps above ARE the test plan. Structural pattern: `oscilloscope-client.test.tsx`. All new cases live in one file; each drives the component through the DOM (clicks, input events) rather than calling internals.

## Done criteria

- [ ] `binaural-beats-client.tsx` diff is limited to the `createEngine` prop seam
- [ ] New suite exists with ≥8 behavior tests, all passing via `turbo run test --filter=@kkb/web --force`
- [ ] `bun run check-types` and `bun run format-and-lint` exit 0
- [ ] No files outside the in-scope list modified (`git status`)
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report back (do not improvise) if:

- The excerpted behavior (state flags, hash format `#preset=<id>`, `data-testid` patterns) doesn't match the live component — drift; re-plan rather than adapt silently.
- Radix `Slider` doesn't emit `onValueChange` under happy-dom event dispatch after a reasonable attempt — fall back to the numeric `Input` (`#binaural-<key>`) for case 8 and note it; if neither works, STOP.
- You find yourself wanting to change component behavior to make a test pass — that inverts characterization; report the friction instead.

## Maintenance notes

- These tests intentionally pin current behavior, including quirks (e.g. `setIsPlaying(false)` before `await engine.stop()`); a future refactor that changes such ordering should update tests knowingly, not accidentally.
- If a `BinauralSession` extraction ever happens (mirroring the oscilloscope session direction in `docs/reports/2026-04-23-codebase-architecture-deepening-candidates.md`), this suite is the safety net — land it first.
- Reviewer: scrutinize that the component diff is seam-only.
