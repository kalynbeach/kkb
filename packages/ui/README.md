# @kkb/ui

Private, source-consumed UI workspace for the KKB monorepo. It provides shared primitives, semantic tokens, hooks, and reusable presentation components; it is not published as a standalone external package.

## Package contract

`@kkb/ui` owns reusable interface foundations with stable component-level contracts. Apps own routes, browser and session orchestration, feature data, and complete product composition. Keep feature-specific composition app-local until real consumers demonstrate a reusable presentation seam; do not add complete experiment or instrument shells merely to create a `/ui` specimen.

The normative design contract is [`../../docs/design/kkb-design.md`](../../docs/design/kkb-design.md). The live semantic token source is `src/styles/globals.css`.

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

Icon-only controls need an accessible name on the interactive element. Mark icons as hidden from assistive technology when they repeat visible copy, a parent label, or purely structural meaning. Owned shared components and application consumers use Phosphor; direct Lucide declarations have been removed. Out-of-scope integrations may retain Lucide transitively without changing the KKB utility-icon contract.

`components.json` records Phosphor as the generator vocabulary. It uses `base-vega` only as shadcn's Base UI reference metadata because the locked CLI does not publish a Base `new-york` registry; KKB tokens and presentation remain authoritative. Review every generated diff rather than overwriting local sources.

## Primitive foundation

Owned shared primitives use `@base-ui/react`. Composition uses Base UI's `render` prop instead of Radix `asChild`; callers should pass a single render element and provide its content as the component's children.

```tsx
<Button render={<a href="/ui" />}>Open workbench</Button>
```

KKB keeps its public compound names while mapping behavior to Base UI: `HoverCard` uses Preview Card, menu families use Menu, and `Sheet` remains Dialog behavior. `AspectRatio` and `Label` are native CSS/HTML implementations. Controlled callbacks keep their established first values and expose Base event details as the second argument; Slider remains `number[]`, and single-value ToggleGroup remains a string.

`PopoverAnchor` was removed in this migration. Base UI 1.6.0 has no Popover Anchor part, and KKB does not provide a compatibility adapter; use the trigger or the Positioner `anchor` contract supported by Base UI instead. Repository source checks confirmed there are no owned `PopoverAnchor` callers.

The lockfile still contains transitive Radix packages owned by `@json-render/shadcn`, `cmdk`, and `vaul`. These are not shared primitive dependencies and remain outside the migration scope.

## Imports

Import components and utilities through explicit package subpaths:

```tsx
import { Button } from "@kkb/ui/components/button";
import { Waveform } from "@kkb/ui/components/audio/waveform";
import { createPlayerPresenter } from "@kkb/ui/components/audio/presenter";
import { AUDIO_SCANLINES_CLASS_NAME } from "@kkb/ui/components/audio/theme";
import { useIsMobile } from "@kkb/ui/hooks/use-mobile";
import { cn } from "@kkb/ui/lib/utils";
```

Public areas currently include:

- `@kkb/ui/components/*` — shared primitives and reusable presentation components, including audio component paths
- `@kkb/ui/components/audio/presenter` — headless audio presentation-state derivation
- `@kkb/ui/components/audio/theme` — scoped audio-theme contract
- `@kkb/ui/hooks/*` — shared React hooks
- `@kkb/ui/lib/*` — shared utilities
- `@kkb/ui/styles/*.css` — Tailwind source, semantic tokens, and shared styles
- `@kkb/ui/json-render`, `/catalog`, and `/registry` — experimental adapter integration outside the active design-system roadmap

`packages/ui/src/styles/globals.css` is the live token source. The initial theme publishes paired `success` / `success-foreground` and `warning` / `warning-foreground` roles plus a semantic `scrim` for overlays. Structural radii resolve to `0`; full rounding is reserved for the functional exceptions documented in the design contract.

## Inventory and verification surfaces

The web app's [`/ui`](http://localhost:3000/ui) route is the complete component inventory and visual acceptance workbench for this package. Its default Preview is a dense wall of live components; focused `?item=` views show each component's own variants and states. Catalog tests derive the supported component surface from this package's export map and matching source files, while the catalog registry explicitly keeps providers, hooks, presenters, theme constants, and experimental integrations secondary to visual components. The route follows the established [shadcn/create inspection model](https://ui.shadcn.com/create?preset=b1D0enCq&base=base&item=preview) and must not become a workshop index, docs site, or gallery of complete application shells.

[`/json-render`](http://localhost:3000/json-render) is a separate adapter demo surface. Its presence does not place JSON-render inside the active design-system roadmap.

Do not duplicate the complete inventory in this README. Use `package.json` for public export families and `/ui` for visual coverage.
