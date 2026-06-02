# Repository Guidelines

## Project structure

This repo is a Bun-workspace Turborepo.

- `apps/web`: active Next.js 16 integration app and demo/sandbox host on port 3000.
- `apps/docs`: early docs shell on Next.js 16 on port 3001.
- `packages/audio`: headless browser audio playback and oscilloscope runtime package.
- `packages/ui`: shared UI package with primitives, audio presentation, and json-render surfaces.
- `packages/typescript-config`: shared TypeScript config package.
- `docs/`: canonical local plans, specs, research, reports, and diagrams.

For human orientation and current route inventory, start with `README.md`. For detailed architectural context, inspect the latest relevant files under `docs/` instead of relying on memory.

## Build, validation, and dev commands

Use Bun for scripts (`bun`, not npm/pnpm/yarn).

- Turbo-backed root scripts:
  - `bun run dev`
  - `bun run build` (turbo; only workspaces with `build` scripts today)
  - `bun run check-types` (turbo)
  - `bun run test` (turbo; only workspaces with `test` scripts today)
- Direct root scripts:
  - `bun run format-and-lint`
  - `bun run format-and-lint:fix`
- Filtered runs use the same style:
  - `turbo run dev --filter=@kkb/web`
  - `turbo run build --filter=@kkb/docs`
  - `turbo run test --filter=@kkb/audio`

## Agent skills

`AGENTS.md` is the primary agent guidance file for this project. Treat `CLAUDE.md` as legacy Claude Code guidance unless explicitly asked to update it.

### Issue tracker

Issues are tracked in GitHub Issues for `kalynbeach/kkb` using the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Triage uses the default five-label vocabulary: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, and `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

This repo uses a single-context domain docs layout. See `docs/agents/domain.md`.

## Documentation and progressive disclosure

Keep `AGENTS.md` concise and durable. Prefer progressive disclosure:

1. Use `README.md` for current workspace and route orientation.
2. Use `docs/` for local plans, reports, architecture notes, specs, research, and diagrams.
3. Use package/app `README.md` files for workspace-local context when present.
4. Use upstream documentation on the web for external libraries and framework APIs when local context is insufficient.

Before touching architecture, roadmap, or design docs, inspect `docs/` for the latest related material. Prefer linking to existing docs over duplicating long explanations in root guidance.

## Architectural ownership

- `apps/web` owns browser/session orchestration: routes, React lifecycle, demo composition, static fixtures, media elements, mic access, URL/hash state, and other host-only browser seams.
- `packages/audio` owns headless runtime behavior: audio engine, source contracts, metrics, worklet utilities, oscilloscope runtime, signal providers, XY mode, and renderer internals.
- `packages/ui` owns reusable UI primitives and presentation-only surfaces. Keep feature/session orchestration in apps unless a reusable UI contract is clear.
- `packages/typescript-config` owns shared TypeScript configuration only.

Do not move browser host ownership into `@kkb/audio`, or feature/session orchestration into `@kkb/ui`, without an explicit architecture decision documented under `docs/`.

## Standards for contributions

- TypeScript strict mode; avoid `any`-typed declarations.
- Biome is repo formatter/linter/import organizer (`biome.json`).
- Use the React 19 new JSX transform; no default React import.
- Prefer `bun` and `bunx`; use `bun pm` for package metadata/inspection instead of `bunx npm`.
- Keep edits scoped and concise to the task at hand.
- Do not preserve backward compatibility unless explicitly requested.

## UI defaults

- Treat `@kkb/ui` as the default base for shared styles, components, hooks, and utilities.
- Before creating app-local UI primitives, hooks, or reusable styling patterns, inspect `packages/ui` and prefer composing existing `@kkb/ui` building blocks.
- App-local UI is appropriate for genuinely feature-specific composition and presentation layers, but it should be built on `@kkb/ui` where practical.

## Testing notes

Run targeted checks at root and workspace level as appropriate:

- `bun run format-and-lint`
- `bun run check-types`
- `bun run test` (runs through turbo where supported)

Add or extend workspace `test` scripts when introducing new testable behavior. Treat newly introduced lint warnings as regressions, even if existing warnings are present elsewhere.

## Commit / PR defaults

- Conventional commit messages (`feat:`, `refactor:`, `config:`…).
- Prefer a concise imperative subject plus a short body when context or rationale matters.
- Before committing, run the most relevant targeted checks and review pending changes.
