# Plan 004: Add characterization tests for `BinauralBeatsClient`

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 704eeb9..HEAD -- apps/web/components/binaural-beats apps/web/lib/binaural-beats`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: LOW
- **Depends on**: plans/003-strict-test-scripts.md
- **Category**: tests
- **Planned at**: commit `704eeb9`, 2026-07-15 (reconciled)

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
- **Live baseline**: the component and binaural library are unchanged from `bff3b6b`; `@kkb/web` now has 96 passing tests across 18 files at `704eeb9` because unrelated suites grew.
- React 19 JSX transform — no default React import. TypeScript strict — no `any`.

## Commands you will need

| Purpose | Command | Expected on success |
|---------|---------|---------------------|
| New suite only | `cd apps/web && bun test binaural-beats-client` | all new tests pass |
| Workspace tests | `turbo run test --filter=@kkb/web --force` | exit 0, count grows from 96 |
| Typecheck | `bun run check-types` | exit 0 |
| Lint | `bun run format-and-lint` | exit 0 |
| Live route | `turbo run dev --filter=@kkb/web` | web app available at `http://localhost:3000` |

## Suggested executor toolkit

- Use Codex's Browser plugin for the Step 5 interaction and visible-state
  checks on `/binaural-beats`.
- Use Codex's Computer Use plugin only when a native browser/audio surface is
  not exposed through Browser. Follow its action-time confirmation rules; do
  not use either plugin as a substitute for the automated characterization
  suite.

## Scope

**In scope** (the only files you should modify/create):
- `apps/web/components/binaural-beats/binaural-beats-client.tsx` — ONLY the minimal injection-prop change in Step 1; no behavior changes.
- `apps/web/components/binaural-beats/__tests__/binaural-beats-client.test.tsx` (create)
- `plans/README.md` (status row update)

**Out of scope** (do NOT touch):
- `apps/web/lib/binaural-beats/*` — already tested; any change there invalidates this plan's excerpts.
- `apps/web/components/oscilloscope/__tests__/oscilloscope-client.test.tsx` — read-only exemplar.
- Refactoring `BinauralBeatsClient` (splitting, renaming state, "improving" the race guards) — characterization means pinning current behavior, not changing it.
- Any styling, shadcn composition, icon, or accessibility cleanup beyond what the tests observe — this PR is a behavior-safety net, not a UI remediation.

## Git workflow

- Branch: `codex/plan-004-binaural-client-tests`
- Worktree (explicitly operator-authorized for this queue): create a dedicated worktree for this branch from updated `main` after Plan 003 is merged; do not switch the primary `main` checkout.
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
const createEngineHarness = () => {
  const calls: {
    destroyed: number;
    played: BinauralBeatConfig[];
    stopped: number;
    updated: BinauralBeatConfig[];
  } = {
    destroyed: 0,
    played: [],
    stopped: 0,
    updated: [],
  };
  let failNextPlay: Error | null = null;
  let failNextStop: Error | null = null;
  let nextPlayPromise: Promise<void> | null = null;
  let nextStopPromise: Promise<void> | null = null;
  const engine: BinauralBeatEngine = {
    destroy: () => {
      calls.destroyed += 1;
    },
    play: async (config) => {
      if (failNextPlay) {
        const error = failNextPlay;
        failNextPlay = null;
        throw error;
      }

      calls.played.push(config);
      const pending = nextPlayPromise;
      nextPlayPromise = null;

      if (pending) {
        await pending;
      }
    },
    stop: async () => {
      calls.stopped += 1;

      if (failNextStop) {
        const error = failNextStop;
        failNextStop = null;
        throw error;
      }

      const pending = nextStopPromise;
      nextStopPromise = null;

      if (pending) {
        await pending;
      }
    },
    update: (config) => {
      calls.updated.push(config);
    },
  };

  return {
    calls,
    engine,
    setFailNextPlay: (error: Error) => {
      failNextPlay = error;
    },
    setFailNextStop: (error: Error) => {
      failNextStop = error;
    },
    setNextPlayPromise: (promise: Promise<void>) => {
      nextPlayPromise = promise;
    },
    setNextStopPromise: (promise: Promise<void>) => {
      nextStopPromise = promise;
    },
  };
};
```

The harness is not itself the component prop: it returns the engine plus observation controls. In each test, create it once and inject an explicit factory adapter:

```tsx
const harness = createEngineHarness();
const createEngine = mock(() => harness.engine);

await renderIntoDomAsync(
  environment,
  <BinauralBeatsClient createEngine={createEngine} />,
);
```

Use `harness.calls` and the four `setFailNext*`/`setNext*Promise` controls for assertions and deferred or rejected operations. The engine-lifecycle case must render without `StrictMode`, assert `createEngine` was called once, then unmount and assert `harness.calls.destroyed === 1`. Tests that intentionally exercise React's development-only double-effect probe are out of scope.

**Verify**: `cd apps/web && bun test binaural-beats-client` → scaffold's first trivial test (component renders a Play button) passes.

### Step 3: Write the characterization cases

Cover, at minimum (use `data-testid` sliders / button text / `role="alert"` to observe):

1. **Engine lifecycle** — mount creates exactly one engine; unmount calls `destroy()` once.
2. **Hash hydration** — with `location.hash = "#preset=alpha"` before render, the alpha preset button has `aria-pressed="true"` and the displayed beat frequency matches the alpha preset's `beatFrequencyHz`.
3. **No hash** — no preset selected (`aria-pressed="true"` on zero preset buttons); config equals defaults.
4. **Preset selection** — clicking a preset button updates the beat display and calls `history.replaceState` with a hash containing `preset=<id>` (spy on `window.history.replaceState`).
5. **Play happy path** — use `setNextPlayPromise(deferred.promise)`, click Play, and confirm `engine.play` records one current sanitized config while the promise is pending; the button is disabled and reads Starting. Resolve the promise inside `act`, then confirm the button reads Stop.
6. **Deferred stop** — first reach the playing state, then use `setNextStopPromise(deferred.promise)` and click Stop. While the promise is pending, assert `engine.stop` was called once, the button is disabled, and its label is Stopping. Resolve inside `act`, then assert the button is enabled and reads Play.
7. **Stop failure recovery** — first reach the playing state, call `setFailNextStop(new Error("stop blocked"))`, and click Stop. Assert `calls.stopped === 1`, `role="alert"` shows "stop blocked", and the button recovers to an enabled Play state with neither Starting nor Stopping left behind.
8. **Play failure** — `setFailNextPlay(new Error("blocked"))`; click Play → `role="alert"` shows "blocked", button re-enabled reading Play, `calls.played` empty.
9. **Live update** — while playing, change a slider/input value → `engine.update` called with the sanitized config; while stopped, changing config calls `update` zero times.

**Verify**: `cd apps/web && bun test binaural-beats-client` → 9+ tests pass.

### Step 4: Full verification loop

**Verify**: `bun run check-types && turbo run test --filter=@kkb/web --force && bun run format-and-lint` → all exit 0; `@kkb/web` test count ≥ 105 (96 reconciled baseline + at least 9 new tests).

### Step 5: Run a live Browser smoke check

Start `turbo run dev --filter=@kkb/web`, then use Codex's Browser plugin to open
`http://localhost:3000/binaural-beats`. Verify that selecting Alpha updates the
pressed preset and URL hash, Play transitions to Stop after starting, and Stop
returns to Play without a visible alert. Capture the route state or screenshot
for the PR verification summary. Use Computer Use only if a native audio/browser
surface needed for this check is not available through Browser.

**Verify**: the route remains interactive with no new console or visible error.
If the environment blocks audio startup, record the exact alert and environment
limitation in the PR instead of changing component behavior; the automated
deferred/rejection tests remain mandatory and must still pass.

## Test plan

The steps above ARE the test plan. Structural pattern: `oscilloscope-client.test.tsx`. All new cases live in one file; each drives the component through the DOM (clicks, input events) rather than calling internals.

## Done criteria

- [ ] `binaural-beats-client.tsx` diff is limited to the `createEngine` prop seam
- [ ] New suite exists with ≥9 behavior tests, including deferred-stop and stop-rejection recovery, all passing via `turbo run test --filter=@kkb/web --force`
- [ ] `bun run check-types` and `bun run format-and-lint` exit 0
- [ ] Step 5 Browser smoke evidence and any environment limitation are recorded in the PR verification summary
- [ ] No files outside the in-scope list modified (`git status`)
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report back (do not improvise) if:

- The excerpted behavior (state flags, hash format `#preset=<id>`, `data-testid` patterns) doesn't match the live component — drift; re-plan rather than adapt silently.
- Radix `Slider` doesn't emit `onValueChange` under happy-dom event dispatch after a reasonable attempt — fall back to the numeric `Input` (`#binaural-<key>`) for case 9 and note it; if neither works, STOP.
- You find yourself wanting to change component behavior to make a test pass — that inverts characterization; report the friction instead.

## Maintenance notes

- These tests intentionally pin current behavior, including quirks (e.g. `setIsPlaying(false)` before `await engine.stop()`); a future refactor that changes such ordering should update tests knowingly, not accidentally.
- If a `BinauralSession` extraction ever happens (mirroring the oscilloscope session direction in `docs/reports/2026-04-23-codebase-architecture-deepening-candidates.md`), this suite is the safety net — land it first.
- Reviewer: scrutinize that the component diff is seam-only.
