# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
bun install              # install dependencies
bun run dev              # start all dev servers (web:3000, docs:3001)
bun run build            # build all packages
bun run format-and-lint  # biome check (CI)
bun run format-and-lint:fix  # biome auto-fix (dev)
bun run check-types      # typescript check
```

**Filter to specific package:**
```bash
turbo dev --filter=@kkb/web
turbo build --filter=@kkb/docs
```

## Architecture

Turborepo monorepo with Bun as package manager/runtime.

**Workspaces:**
- `apps/web` - Next.js 16 app (port 3000)
- `apps/docs` - Next.js 16 docs site (port 3001)
- `packages/ui` - React 19 component library (shadcn/ui, Tailwind CSS v4, neutral theme)
- `packages/typescript-config` - shared TS configs
- `packages/tailwind-config` - shared Tailwind CSS config

**Dependency flow:**
```
apps/web, apps/docs
    ↓ depends on all three
packages/ui  →  packages/typescript-config
packages/tailwind-config (used by apps directly, not by ui)
```

**Internal package namespace:** `@kkb/*` (use `workspace:*` protocol)

**`@kkb/ui` exports:**
```
./components/*  →  src/components/*.tsx
./hooks/*       →  src/hooks/*.ts
./lib/*         →  src/lib/*.ts
./styles/*.css  →  src/styles/*.css
```

**`@kkb/tailwind-config` exports:** `base.css`, `theme.css`, `postcss` (postcss.config.mjs)

## Configuration Patterns

**Biome:** Single root `biome.json` for linting, formatting, and import organization
- Runs as Turborepo root tasks (`//#format-and-lint`)

**TypeScript:** Strict mode enabled
- `@kkb/typescript-config` exports: `base.json`, `nextjs.json`, `react-library.json`
- Apps extend `nextjs.json`, libraries extend `react-library.json`

## shadcn/ui

Components live in `packages/ui/src/components/`. Add new components:
```bash
cd apps/web && bunx shadcn@latest add <component>  # routes shared components to @kkb/ui
cd packages/ui && bunx shadcn@latest add <component>  # add directly
```

Import in apps:
```tsx
import { Button } from "@kkb/ui/components/button"
import { cn } from "@kkb/ui/lib/utils"
```

- `components.json` exists in `packages/ui`, `apps/web`, and `apps/docs`
- Aliases use `@kkb/ui/` prefix so imports resolve in both the UI package and consuming apps
- CSS theme variables in `packages/ui/src/styles/globals.css` (neutral base, oklch colors, class-based dark mode)
- Dark mode via `next-themes`: `ThemeProvider` wraps app layout, `ModeToggle` dropdown for switching
- Apps import styles via `@import "@kkb/ui/styles/globals.css"` in their `globals.css`

## Code Standards

- TypeScript strict mode - no `any` type
- Bun only - never npm/pnpm/yarn, use `bunx` not `npx`
- React 19 with new JSX transform (no React import needed)
