# KKB

> Kalyn Beach's core monorepo

## Overview

Turborepo monorepo built with Bun, Next.js 16, React 19, TypeScript 5.9, Biome, and Tailwind CSS v4.

## Workspaces

### Apps

- `apps/web` (`@kkb/web`) — Next.js 16 app (port 3000)
- `apps/docs` (`@kkb/docs`) — Next.js 16 docs site (port 3001)
- _Planned:_ `admin`, `cli`, `registry`

### Packages

- `packages/audio` (`@kkb/audio`) — core audio runtime (engine, sources, worklet transport, metrics)
- `packages/ui` (`@kkb/ui`) — React 19 component library (shadcn/ui, json-render, audio presenter)
- `packages/typescript-config` (`@kkb/typescript-config`) — shared TypeScript configs
- `packages/tailwind-config` (`@kkb/tailwind-config`) — shared Tailwind CSS v4 config
- _Planned:_ `ai`, `workflows`

## Development

```bash
bun install                    # install dependencies
bun run dev                    # start all dev servers (web:3000, docs:3001)
bun run build                  # build all packages
bun run format-and-lint        # biome check (CI)
bun run format-and-lint:fix    # biome auto-fix (dev)
bun run check-types            # typescript check
bun run test                   # workspace tests
```

Filter to a specific workspace:

```bash
turbo dev --filter=@kkb/web
turbo build --filter=@kkb/docs
turbo test --filter=@kkb/audio
```

## Architecture

Internal package namespace: `@kkb/*` (use `workspace:*` protocol)

Dependency flow:

```
apps/web ──→ packages/ui, packages/audio
apps/docs ─→ packages/ui
                ↓
packages/typescript-config, packages/tailwind-config
```

## TODOs

- [x] Add and configure Biome, remove ESLint and Prettier
- [x] Add and configure Tailwind CSS v4 with shared config package
- [x] Add and setup shadcn/ui in `@kkb/ui`
- [x] Update `@kkb/ui` directory naming and structure
- [x] Add and setup [json-render](https://github.com/vercel-labs/json-render) in `@kkb/ui`
