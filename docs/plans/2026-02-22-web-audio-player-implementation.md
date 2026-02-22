# Web Audio Player Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a production-ready, framework-agnostic web audio player system in this monorepo, aligned to the RFC and shipped in phases with measurable quality gates.

**Architecture:** Create four new packages (`@kkb/audio-engine`, `@kkb/audio-sources`, `@kkb/audio-worklet`, `@kkb/audio-ui-react`), integrate them into `apps/web`, and implement capability-based source selection with resilient fallback (`WebCodecs` -> `MediaElement` -> `WorkletPCM` -> compatibility mode). Keep audio-critical logic outside React renders and outside Next-specific APIs.

**Tech Stack:** Bun workspaces, Turborepo, TypeScript 5.9 strict mode, React 19.2, Next.js 16, Web Audio API, AudioWorklet, Web Workers, WebCodecs (gated), Biome.

---

## Plan Constraints

1. Use `@turborepo` guidance: package-level scripts first, root scripts only delegate with `turbo run`.
2. Use TDD for core behavior: write failing tests first, then minimal implementation.
3. Keep all shared packages framework-agnostic; no `next/*` imports outside `apps/*`.
4. Add small commits per task with conventional commit messages.
5. Run `bun run format-and-lint` and `bun run check-types` before final merge.

## Task 1: Scaffold Audio Packages and Task Plumbing

**Files:**
- Create: `packages/audio-engine/package.json`
- Create: `packages/audio-engine/tsconfig.json`
- Create: `packages/audio-engine/src/index.ts`
- Create: `packages/audio-sources/package.json`
- Create: `packages/audio-sources/tsconfig.json`
- Create: `packages/audio-sources/src/index.ts`
- Create: `packages/audio-worklet/package.json`
- Create: `packages/audio-worklet/tsconfig.json`
- Create: `packages/audio-worklet/src/index.ts`
- Create: `packages/audio-ui-react/package.json`
- Create: `packages/audio-ui-react/tsconfig.json`
- Create: `packages/audio-ui-react/src/index.ts`
- Modify: `package.json`
- Modify: `turbo.json`

**Step 1: Create a failing baseline**

Run: `bun run test`  
Expected: FAIL with missing `test` script in root `package.json`.

**Step 2: Add package manifests and TS config**

```json
{
  "name": "@kkb/audio-engine",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "exports": {
    ".": "./src/index.ts"
  },
  "scripts": {
    "build": "tsc --noEmit",
    "check-types": "tsc --noEmit",
    "test": "bun test"
  },
  "devDependencies": {
    "@kkb/typescript-config": "workspace:*",
    "typescript": "^5.9.3"
  }
}
```

```json
{
  "extends": "@kkb/typescript-config/react-library.json",
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

```ts
export {};
```

Repeat this pattern for `@kkb/audio-sources`, `@kkb/audio-worklet`, and `@kkb/audio-ui-react` (React package keeps `react` and `react-dom` dependencies).

**Step 3: Wire root scripts and Turbo tasks**

```json
{
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "test": "turbo run test",
    "format-and-lint": "biome check .",
    "format-and-lint:fix": "biome check --write .",
    "check-types": "turbo run check-types"
  }
}
```

```json
{
  "tasks": {
    "build": { "dependsOn": ["^build"], "inputs": ["$TURBO_DEFAULT$", ".env*"], "outputs": [".next/**", "!.next/cache/**"] },
    "check-types": { "dependsOn": ["^check-types"] },
    "test": { "dependsOn": ["^test"] },
    "dev": { "cache": false, "persistent": true },
    "//#format-and-lint": {},
    "//#format-and-lint:fix": { "cache": false }
  }
}
```

**Step 4: Verify scaffolding**

Run: `bun run check-types`  
Expected: PASS for existing and new workspaces.

Run: `bun run test`  
Expected: PASS (no tests yet, zero-test pass in each package).

**Step 5: Commit**

```bash
git add package.json turbo.json packages/audio-engine packages/audio-sources packages/audio-worklet packages/audio-ui-react
git commit -m "feat: scaffold audio workspaces and turbo test task"
```

## Task 2: Implement Engine Contracts and Store

**Files:**
- Create: `packages/audio-engine/src/types.ts`
- Create: `packages/audio-engine/src/errors.ts`
- Create: `packages/audio-engine/src/store.ts`
- Create: `packages/audio-engine/src/engine.ts`
- Create: `packages/audio-engine/src/__tests__/engine-store.test.ts`
- Modify: `packages/audio-engine/src/index.ts`

**Step 1: Write failing tests for store transitions**

```ts
import { describe, expect, test } from "bun:test";
import { createPlayerStore } from "../store";

describe("player store", () => {
  test("transitions idle -> loading -> ready", () => {
    const store = createPlayerStore();
    store.setState({ status: "loading" });
    store.setState({ status: "ready", duration: 120 });
    expect(store.getState().status).toBe("ready");
    expect(store.getState().duration).toBe(120);
  });
});
```

Run: `bun test packages/audio-engine/src/__tests__/engine-store.test.ts`  
Expected: FAIL because `createPlayerStore` is not implemented.

**Step 2: Implement minimal types and store**

```ts
export type PlayerStatus = "idle" | "loading" | "ready" | "playing" | "paused" | "error";

export type PlayerState = {
  status: PlayerStatus;
  currentTime: number;
  duration: number;
  sourceId: string | null;
  error: string | null;
};
```

```ts
const initialState: PlayerState = {
  status: "idle",
  currentTime: 0,
  duration: 0,
  sourceId: null,
  error: null,
};

export const createPlayerStore = () => {
  let state = initialState;
  const listeners = new Set<() => void>();

  return {
    getState: () => state,
    setState: (patch: Partial<PlayerState>) => {
      state = { ...state, ...patch };
      listeners.forEach((fn) => fn());
    },
    subscribe: (fn: () => void) => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
  };
};
```

**Step 3: Implement engine shell with exported interfaces**

```ts
export class AudioEngine {
  private store = createPlayerStore();
  getState() {
    return this.store.getState();
  }
  subscribe(listener: () => void) {
    return this.store.subscribe(listener);
  }
}
```

**Step 4: Verify**

Run: `turbo run test --filter=@kkb/audio-engine`  
Expected: PASS.

Run: `turbo run check-types --filter=@kkb/audio-engine`  
Expected: PASS.

**Step 5: Commit**

```bash
git add packages/audio-engine
git commit -m "feat: add audio engine contracts and state store"
```

## Task 3: Implement Source Interface, Scoring, and Fallback Chain

**Files:**
- Create: `packages/audio-engine/src/source.ts`
- Create: `packages/audio-engine/src/source-selector.ts`
- Create: `packages/audio-engine/src/recovery-policy.ts`
- Create: `packages/audio-engine/src/__tests__/source-selector.test.ts`
- Modify: `packages/audio-engine/src/index.ts`

**Step 1: Write failing tests for deterministic source selection**

```ts
import { describe, expect, test } from "bun:test";
import { selectSource } from "../source-selector";

test("picks highest scoring playable source", async () => {
  const selected = await selectSource(
    [{ id: "a", canPlay: async () => true, score: () => 10 }, { id: "b", canPlay: async () => true, score: () => 30 }],
    {} as never,
    {} as never,
  );
  expect(selected?.id).toBe("b");
});
```

Run: `bun test packages/audio-engine/src/__tests__/source-selector.test.ts`  
Expected: FAIL because `selectSource` does not exist.

**Step 2: Implement source interfaces and selector**

```ts
export type GaplessCapability = true | false | "best-effort";

export type SourceCapabilities = {
  streaming: boolean;
  sampleAccurateSeek: boolean;
  gapless: GaplessCapability;
  loudnessMetadata: boolean;
  requiresUserGesture: boolean;
  requiresSAB: boolean;
};
```

```ts
export const selectSource = async (sources: AudioSource[], input: TrackInput, ctx: SourceScoreContext) => {
  const playable: AudioSource[] = [];
  for (const source of sources) {
    if (await source.canPlay(input)) {
      playable.push(source);
    }
  }
  return playable.sort((a, b) => b.score(ctx) - a.score(ctx))[0] ?? null;
};
```

**Step 3: Implement minimal recovery policy**

```ts
export const shouldRetry = (attempt: number, maxAttempts: number) => attempt < maxAttempts;

export const backoffMs = (attempt: number, baseMs = 250) =>
  Math.min(baseMs * 2 ** attempt, 5_000);
```

**Step 4: Verify**

Run: `turbo run test --filter=@kkb/audio-engine`  
Expected: PASS.

**Step 5: Commit**

```bash
git add packages/audio-engine
git commit -m "feat: add source contracts, ranking, and recovery primitives"
```

## Task 4: Add MediaElement and Compatibility Sources

**Files:**
- Create: `packages/audio-sources/src/media-element-source.ts`
- Create: `packages/audio-sources/src/fallback-source.ts`
- Create: `packages/audio-sources/src/__tests__/media-element-source.test.ts`
- Create: `packages/audio-sources/src/__tests__/fallback-source.test.ts`
- Modify: `packages/audio-sources/src/index.ts`
- Modify: `packages/audio-sources/package.json`

**Step 1: Write failing tests for load/play/pause contract**

```ts
import { describe, expect, test } from "bun:test";
import { createFallbackSource } from "../fallback-source";

test("fallback source controls media element", async () => {
  const calls: string[] = [];
  const source = createFallbackSource({
    play: async () => calls.push("play"),
    pause: () => calls.push("pause"),
  } as never);
  await source.play();
  source.pause();
  expect(calls).toEqual(["play", "pause"]);
});
```

Run: `bun test packages/audio-sources/src/__tests__/fallback-source.test.ts`  
Expected: FAIL because source factories are not implemented.

**Step 2: Implement fallback source**

```ts
export const createFallbackSource = (el: HTMLAudioElement): AudioSource => ({
  id: "fallback",
  capabilities: {
    streaming: true,
    sampleAccurateSeek: false,
    gapless: "best-effort",
    loudnessMetadata: false,
    requiresUserGesture: true,
    requiresSAB: false,
  },
  canPlay: async () => true,
  score: () => 1,
  load: async (input) => {
    el.src = input.src;
  },
  play: async () => {
    await el.play();
  },
  pause: () => {
    el.pause();
    return Promise.resolve();
  },
  seek: async (seconds) => {
    el.currentTime = seconds;
  },
  getTimeline: () => ({ currentTime: el.currentTime, duration: el.duration }),
  destroy: async () => {
    el.removeAttribute("src");
    el.load();
  },
});
```

**Step 3: Implement media element source with higher score and same interface**

```ts
export const createMediaElementSource = (el: HTMLAudioElement): AudioSource => ({
  id: "media-element",
  capabilities: {
    streaming: true,
    sampleAccurateSeek: false,
    gapless: "best-effort",
    loudnessMetadata: false,
    requiresUserGesture: true,
    requiresSAB: false,
  },
  canPlay: async (input) => el.canPlayType(input.mimeType ?? "") !== "",
  score: () => 70,
  // load/play/pause/seek/getTimeline/destroy same shape as fallback
});
```

**Step 4: Verify**

Run: `turbo run test --filter=@kkb/audio-sources`  
Expected: PASS.

Run: `turbo run check-types --filter=@kkb/audio-sources`  
Expected: PASS.

**Step 5: Commit**

```bash
git add packages/audio-sources
git commit -m "feat: add media element and compatibility audio sources"
```

## Task 5: Build React Adapter Package (`@kkb/audio-ui-react`)

**Files:**
- Create: `packages/audio-ui-react/src/player-context.tsx`
- Create: `packages/audio-ui-react/src/use-player.ts`
- Create: `packages/audio-ui-react/src/components/player-controls.tsx`
- Create: `packages/audio-ui-react/src/__tests__/use-player-store.test.ts`
- Modify: `packages/audio-ui-react/src/index.ts`
- Modify: `packages/audio-ui-react/package.json`

**Step 1: Write failing test for external store subscription behavior**

```ts
import { describe, expect, test } from "bun:test";
import { createViewModel } from "../use-player";

test("view model exposes stable state snapshot", () => {
  const vm = createViewModel({ getState: () => ({ status: "idle" }) } as never);
  expect(vm.getSnapshot().status).toBe("idle");
});
```

Run: `bun test packages/audio-ui-react/src/__tests__/use-player-store.test.ts`  
Expected: FAIL because `createViewModel` does not exist.

**Step 2: Implement context and hook around `useSyncExternalStore`**

```ts
export function usePlayer() {
  const engine = useContext(PlayerContext);
  if (!engine) throw new Error("PlayerProvider is missing");
  const state = useSyncExternalStore(engine.subscribe, engine.getState, engine.getState);
  return { state, actions: engine.actions };
}
```

**Step 3: Implement minimal controls component**

```tsx
export function PlayerControls() {
  const { state, actions } = usePlayer();
  return (
    <div>
      <button onClick={() => actions.play()} disabled={state.status === "playing"}>Play</button>
      <button onClick={() => actions.pause()} disabled={state.status !== "playing"}>Pause</button>
    </div>
  );
}
```

**Step 4: Verify**

Run: `turbo run test --filter=@kkb/audio-ui-react`  
Expected: PASS.

Run: `turbo run check-types --filter=@kkb/audio-ui-react`  
Expected: PASS.

**Step 5: Commit**

```bash
git add packages/audio-ui-react
git commit -m "feat: add framework-agnostic react player adapter package"
```

## Task 6: Integrate MVP Player into `apps/web`

**Files:**
- Create: `apps/web/app/audio/page.tsx`
- Create: `apps/web/components/audio/player-shell.tsx`
- Create: `apps/web/lib/audio/create-web-player.ts`
- Create: `apps/web/lib/audio/__tests__/create-web-player.test.ts`
- Modify: `apps/web/package.json`

**Step 1: Write failing integration test for host adapter composition**

```ts
import { describe, expect, test } from "bun:test";
import { createWebPlayer } from "../create-web-player";

test("wires engine and sources into one player instance", () => {
  const player = createWebPlayer();
  expect(player).toHaveProperty("engine");
  expect(player).toHaveProperty("sources");
});
```

Run: `bun test apps/web/lib/audio/__tests__/create-web-player.test.ts`  
Expected: FAIL because `createWebPlayer` does not exist.

**Step 2: Implement host adapter**

```ts
export const createWebPlayer = () => {
  const audio = new Audio();
  const mediaElementSource = createMediaElementSource(audio);
  const fallbackSource = createFallbackSource(audio);
  const engine = new AudioEngine({ sources: [mediaElementSource, fallbackSource] });
  return { engine, sources: [mediaElementSource, fallbackSource] };
};
```

**Step 3: Add `/audio` page with provider + controls**

```tsx
export default function AudioPage() {
  const { engine } = createWebPlayer();
  return (
    <PlayerProvider engine={engine}>
      <PlayerControls />
    </PlayerProvider>
  );
}
```

**Step 4: Verify**

Run: `turbo run check-types --filter=@kkb/web`  
Expected: PASS.

Run: `bun run dev --filter=@kkb/web`  
Expected: app boots and `/audio` renders controls.

**Step 5: Commit**

```bash
git add apps/web
git commit -m "feat: integrate audio player mvp route in web app"
```

## Task 7: Add AudioWorklet Package and Tier B (`postMessage`) Transport

**Files:**
- Create: `packages/audio-worklet/src/processor.ts`
- Create: `packages/audio-worklet/src/register-worklet.ts`
- Create: `packages/audio-worklet/src/postmessage-queue.ts`
- Create: `packages/audio-worklet/src/__tests__/postmessage-queue.test.ts`
- Create: `packages/audio-sources/src/worklet-pcm-source.ts`
- Create: `packages/audio-sources/src/__tests__/worklet-pcm-source.test.ts`
- Modify: `packages/audio-worklet/src/index.ts`
- Modify: `packages/audio-sources/src/index.ts`

**Step 1: Write failing tests for queue sequencing**

```ts
import { describe, expect, test } from "bun:test";
import { createChunkQueue } from "../postmessage-queue";

test("drops stale chunks by sequence id", () => {
  const q = createChunkQueue();
  q.push({ seq: 2, frames: 128 });
  q.push({ seq: 1, frames: 128 });
  expect(q.read().seq).toBe(2);
});
```

Run: `bun test packages/audio-worklet/src/__tests__/postmessage-queue.test.ts`  
Expected: FAIL because queue utility is missing.

**Step 2: Implement queue and processor skeleton**

```ts
export const createChunkQueue = () => {
  let maxSeq = -1;
  const items: Chunk[] = [];
  return {
    push: (chunk: Chunk) => {
      if (chunk.seq < maxSeq) return;
      maxSeq = chunk.seq;
      items.push(chunk);
    },
    read: () => items.shift(),
  };
};
```

**Step 3: Implement `WorkletPCMSource` with Tier B transport**

```ts
export const createWorkletPCMSource = (port: MessagePort): AudioSource => ({
  id: "worklet-pcm",
  capabilities: { streaming: true, sampleAccurateSeek: true, gapless: true, loudnessMetadata: false, requiresUserGesture: true, requiresSAB: false },
  canPlay: async () => true,
  score: () => 50,
  load: async () => Promise.resolve(),
  play: async () => port.postMessage({ type: "play" }),
  pause: async () => port.postMessage({ type: "pause" }),
  seek: async (seconds) => port.postMessage({ type: "seek", seconds }),
  getTimeline: () => ({ currentTime: 0, duration: 0 }),
  destroy: async () => Promise.resolve(),
});
```

**Step 4: Verify**

Run: `turbo run test --filter=@kkb/audio-worklet --filter=@kkb/audio-sources`  
Expected: PASS.

**Step 5: Commit**

```bash
git add packages/audio-worklet packages/audio-sources
git commit -m "feat: add worklet transport with postmessage queue path"
```

## Task 8: Add SAB Tier, WebCodecs Source Gate, and Observability Hooks

**Files:**
- Create: `packages/audio-worklet/src/sab-ring-buffer.ts`
- Create: `packages/audio-worklet/src/__tests__/sab-ring-buffer.test.ts`
- Create: `packages/audio-sources/src/webcodecs-source.ts`
- Create: `packages/audio-sources/src/__tests__/webcodecs-source.test.ts`
- Create: `packages/audio-engine/src/metrics.ts`
- Create: `packages/audio-engine/src/__tests__/metrics.test.ts`
- Modify: `packages/audio-engine/src/engine.ts`
- Modify: `packages/audio-sources/src/index.ts`

**Step 1: Write failing tests for capability gating and metric counters**

```ts
import { expect, test } from "bun:test";
import { supportsWebCodecsSource } from "../webcodecs-source";

test("returns false when AudioDecoder is unavailable", () => {
  expect(supportsWebCodecsSource({ AudioDecoder: undefined } as never)).toBe(false);
});
```

```ts
import { expect, test } from "bun:test";
import { createMetrics } from "../metrics";

test("increments underrun count", () => {
  const metrics = createMetrics();
  metrics.incrementUnderrun();
  expect(metrics.snapshot().underruns).toBe(1);
});
```

Run: `turbo run test --filter=@kkb/audio-engine --filter=@kkb/audio-sources --filter=@kkb/audio-worklet`  
Expected: FAIL before implementation.

**Step 2: Implement SAB ring buffer and WebCodecs support gate**

```ts
export const supportsWebCodecsSource = (globalLike: { AudioDecoder?: unknown }) =>
  typeof globalLike.AudioDecoder !== "undefined";
```

```ts
export const createSABRingBuffer = (capacityFrames: number) => {
  const sab = new SharedArrayBuffer(capacityFrames * 4);
  return { sab, capacityFrames };
};
```

**Step 3: Implement metrics collector and wire into engine events**

```ts
export const createMetrics = () => {
  let underruns = 0;
  return {
    incrementUnderrun: () => underruns++,
    snapshot: () => ({ underruns }),
  };
};
```

**Step 4: Verify full workspace gates**

Run: `bun run format-and-lint`  
Expected: PASS.

Run: `bun run check-types`  
Expected: PASS.

Run: `bun run test`  
Expected: PASS.

**Step 5: Commit**

```bash
git add packages/audio-engine packages/audio-sources packages/audio-worklet
git commit -m "feat: add sab tier primitives, webcodecs gating, and player metrics"
```

## Task 9: Final Integration, Docs, and Release Checklist

**Files:**
- Modify: `README.md`
- Modify: `docs/specs/web-audio-player-rfc.md`
- Create: `docs/specs/web-audio-player-codec-matrix.md`
- Create: `docs/specs/web-audio-player-qa-matrix.md`
- Create: `docs/specs/web-audio-player-runbook.md`

**Step 1: Write failing validation checklist test (docs presence check)**

```ts
import { existsSync } from "node:fs";
import { expect, test } from "bun:test";

test("audio player spec docs are present", () => {
  expect(existsSync("docs/specs/web-audio-player-codec-matrix.md")).toBe(true);
  expect(existsSync("docs/specs/web-audio-player-qa-matrix.md")).toBe(true);
});
```

Run: `bun test apps/web/lib/audio/__tests__/docs-presence.test.ts`  
Expected: FAIL until docs are created.

**Step 2: Add operational docs**

Add codec matrix with:
1. Container/codec combinations by source type.
2. Browser support expectations.
3. Fallback target per failure mode.

Add QA matrix with:
1. Desktop Chrome/Firefox/Safari.
2. iOS Safari.
3. SAB enabled/disabled environments.

Add runbook with:
1. Error taxonomy and operator response.
2. Metrics thresholds and debug workflow.

**Step 3: Update root README with new audio workspaces**

```md
- `packages/audio-engine` (`@kkb/audio-engine`) — core transport, source selection, recovery, metrics
- `packages/audio-sources` (`@kkb/audio-sources`) — pluggable source implementations
- `packages/audio-worklet` (`@kkb/audio-worklet`) — worklet processors and data-plane utilities
- `packages/audio-ui-react` (`@kkb/audio-ui-react`) — framework-agnostic React adapter/components
```

**Step 4: Verify**

Run: `bun run format-and-lint`  
Expected: PASS.

Run: `bun run check-types`  
Expected: PASS.

Run: `bun run test`  
Expected: PASS.

**Step 5: Commit**

```bash
git add README.md docs/specs
git commit -m "docs: add audio player codec matrix qa matrix and runbook"
```

## Final Verification Gate (Before PR)

Run all:

```bash
bun run format-and-lint
bun run check-types
bun run test
```

Expected:
1. Zero lint/type/test failures.
2. `apps/web` `/audio` route operational in dev server.
3. Source fallback path verified by forcing preferred source initialization failure.

## PR Checklist

1. Include summary of architecture delivered vs RFC.
2. List affected packages/apps explicitly.
3. Include screenshots/video of `/audio` route UI and debug metrics overlay.
4. Include known gaps (for example, restricted WebCodecs demux matrix in initial release).
