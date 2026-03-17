# KKB

> Kalyn Beach's core monorepo

## Current state

- Monorepo scaffold managed with Bun + Turborepo + Next.js 16 + React 19.
- `apps/docs` is still a lightweight shell, while substantive project docs already live under `docs/` and core feature work is currently centered in `apps/web`.

## Workspace inventory

- `apps/web` (`@kkb/web`) — Demo/sandbox host for `@kkb/audio` and `@kkb/ui` feature work.
- `apps/docs` (`@kkb/docs`) — Early-stage docs shell / placeholder docs app.
- `packages/audio` (`@kkb/audio`) — Headless browser audio runtime used by `apps/web`.
- `packages/ui` (`@kkb/ui`) — Shared React UI library plus json-render and audio presentation surfaces.
- `packages/typescript-config` (`@kkb/typescript-config`) — Shared TypeScript configs used by all workspaces.

## Quick commands

Use Bun for all direct entrypoint scripts.

```bash
bun install
bun run dev                  # starts web and docs dev servers
bun run build                # delegates to turbo; builds only workspaces with build scripts
bun run check-types           # delegates to turbo for check-types
bun run test                 # delegates to turbo; runs only workspaces with test scripts
bun run format-and-lint       # root Biome check
bun run format-and-lint:fix   # root Biome auto-fix
```

Filter a task to one workspace:

```bash
turbo run dev --filter=@kkb/web
turbo run build --filter=@kkb/docs
turbo run check-types --filter=@kkb/ui
```

## Notes

- Internal namespace: `@kkb/*` with `workspace:*` dependencies.
- Project docs live under `docs/` for plans, specs, research, reports, and diagrams.
- For quick orientation, `apps/web/app/page.tsx` is the current demo entry and `apps/docs/app/page.tsx` is the docs shell.

## Roadmap / future

- Add and refine docs content beyond the current shell.
- Expand `@kkb/audio` capabilities and surface-level examples in web demos.
- Add new apps (for example: `admin`, `cli`, `registry`) as needed.
