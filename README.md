# KKB

> Kalyn Beach's core monorepo.

## Current state

This repo is a Bun-workspace Turborepo with Next.js 16, React 19, TypeScript 6, Tailwind CSS 4, and Biome.

- `apps/web` is the active integration host for audio, oscilloscope, binaural beats, the `@kkb/ui` inventory, and JSON rendering work.
- `apps/docs` is a lightweight docs shell; existing repository documentation remains under `docs/` while the documentation approach described below evolves.
- `packages/audio` contains headless audio playback, Web Audio source, metrics, worklet, oscilloscope runtime, and WebGPU renderer code.
- `packages/ableton` contains Ableton Live extension experiments and related utilities.
- `packages/agents` is the canonical source for KKB agent context, skills, tools, and workflows.
- `packages/ui` contains shared UI primitives, audio presentation pieces, and `json-render` integration.

## Workspace inventory

- `apps/web` (`@kkb/web`) — active Next.js integration app and visual verification host.
- `apps/docs` (`@kkb/docs`) — early-stage Next.js docs shell on port 3001.
- `packages/audio` (`@kkb/audio`) — headless browser audio runtime, source contracts, worklet helpers, metrics, oscilloscope runtime, signal providers, and WebGPU renderer.
- `packages/ableton` (`@kkb/ableton`) — Ableton Live extension experiments, packaged `.ablx` artifacts, and shared Live utilities.
- `packages/agents` (`@kkb/agents`) — canonical KKB agent context, independently addressable skills, package research, and integrity validation.
- `packages/ui` (`@kkb/ui`) — private, source-consumed React UI package with Base UI-backed primitives, shared tokens and hooks, audio presentation, and json-render adapters.
- `packages/typescript-config` (`@kkb/typescript-config`) — shared TypeScript configs used by all workspaces.

## Active web routes

`apps/web` currently exposes:

- `/audio` — audio player demo using `@kkb/audio` runtime and `@kkb/ui` presentation pieces.
- `/binaural-beats` — binaural beat generator backed by app-local Web Audio orchestration.
- `/oscilloscope` — WebGPU oscilloscope demo driven by internal oscillators or live mic input.
- `/ui` — complete `@kkb/ui` component inventory and visual verification workbench, organized around a dense Preview wall and focused component item views.
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

Existing substantive repository docs live under `docs/`:

- `docs/plans/` — implementation plans and follow-up work.
- `docs/specs/` — specs, RFCs, QA matrices, and runbooks.
- `docs/research/` — external research and exploratory notes.
- `docs/reports/` — architecture reviews, codebase reports, and recommendations.
- `docs/diagrams/` — diagrams, generated visual reports, and architecture references.

This layout describes the current repository, not a default requirement to preserve every work artifact. The documentation approach is evolving toward keeping repository context limited to durable, current truth. Active state belongs primarily in the request, session, issue, PR, and diff; generated plans, reports, research, audits, and evidence should remain external reopenable artifacts unless explicitly requested, required by an established repository convention, or essential to a durable product or package contract.

Existing dated documents may preserve useful history without reflecting the latest intent or project state. Start with the current request, source and diff, repository instructions, and directly relevant stable context rather than broadly scanning `docs/` for the newest plan or report. For design-system direction, `docs/design/kkb-design.md` remains the current stable entrypoint; dated plans and reports are implementation history unless a current source explicitly carries them forward.

Package-local documentation is appropriate when a package explicitly owns and maps a durable decision, provenance record, or user-facing contract. Broader README, agent-guideline, and context-document conventions will be revised together as this direction is clarified.

## Architectural boundaries

- `apps/web` owns browser/session orchestration: routes, React lifecycle, `/ui` catalog fixtures, `Audio`, `AudioContext`, `getUserMedia`, URL/hash state, and app-owned demo composition. `/ui` inventories and verifies `@kkb/ui`; it is not a gallery for complete application shells.
- `apps/docs` owns the Next.js docs shell. It does not make repository `docs/` the default store for active work artifacts; existing root documentation remains in place until it is deliberately revised or given an explicit content pipeline.
- `packages/audio` owns headless runtime behavior: playback engine, source contracts, metrics, worklet utilities, oscilloscope runtime, signal providers, XY mode, and renderer code.
- `packages/ableton` owns Ableton Live extension code, vendor SDK/CLI tarball references, extension builds, and `.ablx` packaging.
- `packages/agents` owns canonical KKB agent context, skills, tools, workflows, and future installation and synchronization tooling. Installed harness state remains separate from package source.
- `packages/ui` owns reusable UI primitives, tokens, hooks, and presentation components. Feature/session orchestration and complete route composition stay in apps; promote presentation only after a reusable contract is demonstrated by real consumers.
- `packages/typescript-config` owns shared TypeScript configuration only.

## Notes

- Internal namespace: `@kkb/*` with `workspace:*` dependencies.
- Shared packages are currently consumed from source rather than emitted build artifacts.
- Prefer concise, durable repository context. Do not create or link a deeper repository document when the work is better represented by current source, an active work surface, or an external reopenable artifact.
