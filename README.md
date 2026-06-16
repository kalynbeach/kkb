# KKB

> Kalyn Beach's core monorepo.

## Current state

This repo is a Bun-workspace Turborepo with Next.js 16, React 19, TypeScript 6, Tailwind CSS 4, and Biome.

- `apps/web` is the active demo/sandbox host for audio, oscilloscope, binaural beats, shared UI, and JSON rendering work.
- `apps/docs` is a lightweight docs shell; canonical planning and research docs currently live under `docs/`.
- `packages/audio` contains headless audio playback, Web Audio source, metrics, worklet, oscilloscope runtime, and WebGPU renderer code.
- `packages/ableton` contains Ableton Live extension experiments and related utilities.
- `packages/ui` contains shared UI primitives, audio presentation pieces, and `json-render` integration.

## Workspace inventory

- `apps/web` (`@kkb/web`) — active Next.js integration app and visual verification host.
- `apps/docs` (`@kkb/docs`) — early-stage Next.js docs shell on port 3001.
- `packages/audio` (`@kkb/audio`) — headless browser audio runtime, source contracts, worklet helpers, metrics, oscilloscope runtime, signal providers, and WebGPU renderer.
- `packages/ableton` (`@kkb/ableton`) — Ableton Live extension experiments, packaged `.ablx` artifacts, and shared Live utilities.
- `packages/ui` (`@kkb/ui`) — shared React UI package with shadcn-derived primitives, audio UI presentation, and json-render adapters.
- `packages/typescript-config` (`@kkb/typescript-config`) — shared TypeScript configs used by all workspaces.

## Active web routes

`apps/web` currently exposes:

- `/audio` — audio player demo using `@kkb/audio` runtime and `@kkb/ui` presentation pieces.
- `/binaural-beats` — binaural beat generator backed by app-local Web Audio orchestration.
- `/oscilloscope` — WebGPU oscilloscope demo driven by internal oscillators or live mic input.
- `/ui` — curated component catalog and visual verification route for `@kkb/ui`.
- `/json-render` — JSON-driven rendering demos backed by `@kkb/ui/json-render`.

## Quick commands

Use Bun for all direct entrypoint scripts. The root package uses Bun catalogs for shared dependency versions and declares Node `24.x`.

```bash
bun install
bun run dev                  # starts web and docs dev servers through turbo
bun run build                # delegates to turbo; builds workspaces with build scripts
bun run check-types          # delegates to turbo for check-types
bun run test                 # delegates to turbo; runs workspaces with test scripts
bun run format-and-lint      # root Biome check
bun run format-and-lint:fix  # root Biome auto-fix
```

Filter a task to one workspace:

```bash
turbo run dev --filter=@kkb/web
turbo run build --filter=@kkb/docs
turbo run check-types --filter=@kkb/ui
turbo run test --filter=@kkb/audio
```

Ableton extension commands run from `packages/ableton`:

```bash
bun run build:dev  # development extension build
bun run build      # production extension build
bun run package    # production build plus .ablx package
bun start          # build and run the configured extension through extensions-cli
```

Common local URLs:

- `http://localhost:3000` — `@kkb/web`
- `http://localhost:3001` — `@kkb/docs`

## Validation status

The main expected validation loop is:

```bash
bun run check-types
bun run test
bun run format-and-lint
```

`check-types` and `test` are expected to pass. `format-and-lint` may report known warnings in generated/static documentation output or upstream-derived UI primitives; treat newly introduced warnings as regressions.

## Documentation map

Substantive repository docs live under `docs/`:

- `docs/plans/` — implementation plans and follow-up work.
- `docs/specs/` — specs, RFCs, QA matrices, and runbooks.
- `docs/research/` — external research and exploratory notes.
- `docs/reports/` — architecture reviews, codebase reports, and recommendations.
- `docs/diagrams/` — diagrams, generated visual reports, and architecture references.

Start with the latest relevant document in `docs/reports/` or `docs/plans/` before changing architecture, roadmap, or product direction.

## Architectural boundaries

- `apps/web` owns browser/session orchestration: routes, React lifecycle, catalog fixtures, `Audio`, `AudioContext`, `getUserMedia`, URL/hash state, and demo composition.
- `apps/docs` owns the Next.js docs shell; long-form planning, reports, research, specs, and diagrams stay under root `docs/` until the docs app has an explicit content pipeline.
- `packages/audio` owns headless runtime behavior: playback engine, source contracts, metrics, worklet utilities, oscilloscope runtime, signal providers, XY mode, and renderer code.
- `packages/ableton` owns Ableton Live extension code, vendor SDK/CLI tarball references, extension builds, and `.ablx` packaging.
- `packages/ui` owns reusable UI primitives and presentation surfaces; feature/session orchestration usually stays in apps until a reusable contract is clear.
- `packages/typescript-config` owns shared TypeScript configuration only.

## Notes

- Internal namespace: `@kkb/*` with `workspace:*` dependencies.
- Shared packages are currently consumed from source rather than emitted build artifacts.
- Prefer keeping root docs concise and linking into `docs/` for deeper plans, reports, and decisions.
