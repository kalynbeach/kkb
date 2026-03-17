# Repository Guidelines

## Project Structure & Module Organization
This is a Turborepo monorepo using Bun workspaces.

- `apps/web`: Next.js 16 app (port 3000)
- `apps/docs`: Next.js 16 docs site (port 3001)
- `packages/ui`: shared React 19 component library
- `packages/typescript-config`: shared TS configs

Internal packages use the `@kkb/*` namespace and the `workspace:*` protocol.

## Build, Test, and Development Commands
Use Bun for all scripts (no npm/pnpm/yarn).

- `bun install`: install dependencies
- `bun run dev`: start all dev servers
- `bun run build`: build all packages/apps via Turbo
- `bun run check-types`: run TypeScript checks
- `bun run format-and-lint`: run Biome checks (CI)
- `bun run format-and-lint:fix`: run Biome auto-fixes (dev)

Filter to a single workspace when needed:
- `turbo run dev --filter=@kkb/web`
- `turbo run build --filter=@kkb/docs`
- `turbo run check-types --filter=@kkb/ui`

## Coding Style & Naming Conventions
- TypeScript strict mode; avoid `any`.
- Biome is the formatter/linter/import organizer (configured in root `biome.json`).
- React 19 new JSX transform (no explicit React import).
- Use Bun tooling (`bun`, `bunx`) instead of npm/pnpm/yarn/npx.

## Testing Guidelines
No dedicated test runner is configured yet. Validate changes with:
- `bun run format-and-lint`
- `bun run check-types`

If you add tests, include a workspace-level `test` script and wire it into `turbo.json`.

## Commit & Pull Request Guidelines
Commit messages follow a Conventional-style prefix: `feat:`, `refactor:`, `config:`, etc.

Keep commit messages short and imperative.

Pull requests should include:
- concise summary of changes
- affected apps/packages (e.g., `apps/web`, `packages/ui`)
- screenshots for UI changes (web/docs)

## Turborepo Task Conventions
Define task scripts in each workspace package’s `package.json` and register them in `turbo.json`.

- Root `package.json` should delegate via `turbo run <task>` for monorepo tasks.
- Root-only checks may use Turborepo root tasks (`//#task`), as with `format-and-lint` and `format-and-lint:fix`.
