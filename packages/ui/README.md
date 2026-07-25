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

`packages/ui/src/styles/globals.css` is the live token source. See [`../../docs/design/kkb-design.md`](../../docs/design/kkb-design.md) for normative design intent.
