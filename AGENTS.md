# Repository Guidelines

## Project Structure & Module Organization
This is a Turborepo monorepo using Bun workspaces.

- `apps/web`: Next.js 16 app (port 3000)
- `apps/docs`: Next.js 16 docs site (port 3001)
- `packages/ui`: shared React 19 component library
- `packages/eslint-config`: shared ESLint flat configs
- `packages/typescript-config`: shared TS configs

Internal packages use the `@kkb/*` namespace and the `workspace:*` protocol.

## Build, Test, and Development Commands
Use Bun for all scripts (no npm/pnpm/yarn).

- `bun install`: install dependencies
- `bun run dev`: start all dev servers
- `bun run build`: build all packages/apps via Turbo
- `bun run lint`: run ESLint with max 0 warnings
- `bun run check-types`: run TypeScript checks
- `bun run format`: format `ts/tsx/md` with Prettier

Filter to a single workspace when needed:

- `turbo dev --filter=@kkb/web`
- `turbo build --filter=@kkb/docs`
- `turbo lint --filter=@kkb/ui`

## Coding Style & Naming Conventions
- TypeScript strict mode; avoid `any`.
- ESLint 9 flat config from `@kkb/eslint-config` (apps use `next-js`, UI uses `react-internal`).
- Prettier is the formatter of record (`bun run format`).
- React 19 new JSX transform (no explicit React import).

## Testing Guidelines
No dedicated test runner is configured yet. Validate changes with:

- `bun run lint`
- `bun run check-types`

If you add tests, include a workspace-level `test` script and wire it into `turbo.json`.

## Commit & Pull Request Guidelines
Commit messages follow a Conventional-style prefix: `feat:`, `refactor:`, `config:`. Keep them short and imperative.

Pull requests should include:

- concise summary of changes
- affected apps/packages (e.g., `apps/web`, `packages/ui`)
- screenshots for UI changes (web/docs)

## Turborepo Task Conventions
Define task scripts in each package’s `package.json` and register them in `turbo.json`. The root `package.json` should only delegate via `turbo run <task>`.
