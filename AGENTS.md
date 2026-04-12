# Repository Guidelines

## Project Structure
This repo is a Bun-workspace Turborepo.

- `apps/web`: active demo/sandbox app on Next.js 16 (port 3000).
- `apps/docs`: early docs shell on Next.js 16 (port 3001).
- `packages/audio`: headless browser audio runtime consumed by web.
- `packages/ui`: shared UI package with json-render + audio presenter surfaces.
- `packages/typescript-config`: shared TypeScript config package.

## Build, validation, and dev commands
- Use Bun for scripts (`bun`, not npm/pnpm/yarn).
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

## Docs and planning
- Before touching architecture, roadmap, or design docs, inspect `docs/` for the latest plans/specs/research/reports/diagrams.
- Prefer referencing current docs in place of remembering stale paths or filenames.
- Treat roadmap items as future work, not as active workspace inventory.

## Standards for contributions
- TypeScript strict mode; avoid `any`-typed declarations.
- Biome is repo formatter/linter/import organizer (`biome.json`).
- Use the React 19 new JSX transform; no default React import.
- Prefer `bun` and `bunx`; use `bun pm` for package metadata/inspection instead of `bunx npm`.
- Keep edits scoped and concise to the task at hand.

## Testing notes
- Run targeted checks at root and workspace level:
  - `bun run format-and-lint`
  - `bun run check-types`
  - `bun run test` (runs through turbo where supported)
- Add/extend workspace `test` scripts when introducing new testable behavior.

## Commit / PR defaults
- Conventional commit messages (`feat:`, `refactor:`, `config:`…).
- Prefer a concise imperative subject plus a short body when context or rationale matters.
