# @kkb/ui

Shared UI primitives, tokens, hooks, and presentation components for the KKB monorepo.

## Consumer setup

Import the package stylesheet once from the consuming app's global stylesheet:

```css
@import "@kkb/ui/styles/globals.css";
```

Install the shared color-mode provider at the app root. KKB uses one Light/Dark/System mode axis:

```tsx
import { ThemeProvider } from "@kkb/ui/components/theme-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}
```

Add `suppressHydrationWarning` to the root `<html>` element when using `next-themes` with server rendering.

## Font variables

The live stylesheet expects these variables on an ancestor of the app content:

- `--font-geist-sans` — readable body copy
- `--font-tx-02` — technical headings, labels, and code
- `--font-mekzantine` — primary serif accent
- `--font-eb-garamond` — secondary serif accent
- `--font-departure-mono` — secondary mono accent

Consumers own font loading and provide the variables through their framework's font integration. The stylesheet includes system fallbacks, but the KKB typography contract requires the intended font files.

## Utility icons

Phosphor is the shared utility-icon vocabulary. Use regular weight by default and let component anatomy own standard sizing: 16px for ordinary controls and inline actions, 12px for subordinate separators or dense metadata, and 20px for roomier catalog or standalone utility contexts. Icons inherit semantic `currentColor`; do not use color or weight as the only state signal. Prefer per-icon `@phosphor-icons/react/dist/csr/*` imports in client components and matching `dist/ssr/*` imports in server components so builds do not traverse the complete icon catalog.

Icon-only controls need an accessible name on the interactive element. Mark icons as hidden from assistive technology when they repeat visible copy, a parent label, or purely structural meaning. Lucide remains installed only for unmigrated consumers until the repository-wide migration is complete.

`components.json` records Phosphor as the intended generator vocabulary, but current Radix-based shadcn registry previews may still emit Lucide imports. Review every generated diff and normalize migrated files to these conventions; #77 owns the Base UI generator foundation and #74 owns final Lucide removal.

## Imports

Import components and utilities through explicit package subpaths:

```tsx
import { Button } from "@kkb/ui/components/button";
import { Waveform } from "@kkb/ui/components/audio/waveform";
import { cn } from "@kkb/ui/lib/utils";
```

Public areas currently include:

- `@kkb/ui/components/*` — shared primitives and presentation components
- `@kkb/ui/hooks/*` — shared React hooks
- `@kkb/ui/lib/*` — shared utilities
- `@kkb/ui/styles/globals.css` — Tailwind source, semantic tokens, and shared styles
- `@kkb/ui/json-render*` — experimental integration; not part of the current design-system hardening scope

`packages/ui/src/styles/globals.css` is the live token source. The initial theme publishes paired `success` / `success-foreground` and `warning` / `warning-foreground` roles plus a semantic `scrim` for overlays. Structural radii resolve to `0`; full rounding is reserved for the functional exceptions documented in the design contract.

See [`../../docs/design/kkb-design.md`](../../docs/design/kkb-design.md) for normative design intent.
