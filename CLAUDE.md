# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
bun install              # install dependencies
bun run dev              # start all dev servers (web:3000, docs:3001)
bun run build            # build all packages
bun run lint             # eslint (max 0 warnings)
bun run check-types      # typescript check
bun run format           # prettier format
```

**Filter to specific package:**
```bash
turbo dev --filter=@kkb/web
turbo build --filter=@kkb/docs
turbo lint --filter=@kkb/ui
```

## Architecture

Turborepo monorepo with Bun as package manager/runtime.

**Workspaces:**
- `apps/web` - Next.js 16 app (port 3000)
- `apps/docs` - Next.js 16 docs site (port 3001)
- `packages/ui` - React 19 component library
- `packages/eslint-config` - shared ESLint configs
- `packages/typescript-config` - shared TS configs

**Dependency flow:**
```
apps/web, apps/docs
    ↓
packages/ui
    ↓
packages/eslint-config, packages/typescript-config
```

**Internal package namespace:** `@kkb/*` (use `workspace:*` protocol)

## Configuration Patterns

**ESLint:** Flat config format (ESLint 9.x)
- `@kkb/eslint-config` exports: base, `/next-js`, `/react-internal`
- Apps use `next-js`, UI package uses `react-internal`

**TypeScript:** Strict mode enabled
- `@kkb/typescript-config` exports: `base.json`, `nextjs.json`, `react-library.json`
- Apps extend `nextjs.json`, libraries extend `react-library.json`

## Code Standards

- TypeScript strict mode - no `any` type
- Bun only - never npm/pnpm/yarn, use `bunx` not `npx`
- React 19 with new JSX transform (no React import needed)
- Turbo plugin validates env vars (`turbo/no-undeclared-env-vars`)
