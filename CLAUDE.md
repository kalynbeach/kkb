# CLAUDE.md

## Build & Development Commands

```bash
bun install              # install dependencies
bun run dev              # start all dev servers (web:3000, docs:3001)
bun run build            # build all packages
bun run format-and-lint  # biome check (CI)
bun run format-and-lint:fix  # biome auto-fix (dev)
bun run check-types      # typescript check
```

### Filter to specific package

```bash
turbo dev --filter=@kkb/web
turbo build --filter=@kkb/docs
```

## Code Standards

- TypeScript strict mode - no `any` type
- Bun only - never npm/pnpm/yarn, use `bunx` not `npx`
- React 19 with new JSX transform (no React import needed)

## shadcn/ui

- Explore the shadcn/ui docs when needed: https://ui.shadcn.com/llms.txt
- UI components live in `packages/ui/src/components/`.
- `components.json` exists in `packages/ui`, `apps/web`, and `apps/docs`
- Aliases use `@kkb/ui/` prefix so imports resolve in both the UI package and consuming apps
- CSS theme variables in `packages/ui/src/styles/globals.css` (neutral base, oklch colors, class-based dark mode)
- Dark mode via `next-themes`: `ThemeProvider` wraps app layout, `ModeToggle` dropdown for switching
- Apps import styles via `@import "@kkb/ui/styles/globals.css"` in their `globals.css`

### Add new components

```bash
cd apps/web && bunx shadcn@latest add component  # routes shared components to @kkb/ui
cd packages/ui && bunx shadcn@latest add <component>  # add directly
```

### Import in apps

```tsx
import { Button } from "@kkb/ui/components/button";
import { cn } from "@kkb/ui/lib/utils";
```
