# UI Audit: Tailwind CSS & shadcn/ui

Audit of the KKB monorepo's Tailwind CSS styles and shadcn/ui configuration across `packages/ui/`, `apps/web/`, and `apps/docs/`.

Date: 2026-03-16

---

## Resolved Since Initial Audit

- **Dark selector fixed** — `packages/ui/src/styles/globals.css` now uses Tailwind v4's recommended `@custom-variant dark (&:where(.dark, .dark *));` pattern.
- **Unused Tailwind package removed** — `@kkb/tailwind-config` has been deleted from the monorepo, app manifests no longer reference it, and shared styles now live solely in `@kkb/ui/styles/globals.css`.

---

## 1. LOW — Root `package.json` Dependency Hygiene

The root `package.json` has a `dependencies` block that mixes tooling deps with library deps:

```json
"dependencies": {
  "@base-ui/react": "^1.3.0",
  "@json-render/core": "^0.13.0",
  "@json-render/react": "^0.13.0",
  "@json-render/shadcn": "^0.13.0",
  "@tailwindcss/postcss": "^4.2.1",
  "lucide-react": "^0.577.0",
  "postcss": "^8.5.8",
  "react-day-picker": "^9.14.0",
  "react-resizable-panels": "^4.7.2",
  "tailwindcss": "^4.2.1"
}
```

Some of these are tooling (`@tailwindcss/postcss`, `postcss`, `tailwindcss`) that could be `devDependencies`, while others are library deps (`@base-ui/react`, `lucide-react`, etc.) that arguably belong in the packages that use them. Turborepo best practice is for root to only contain workspace tooling (turbo, biome, typescript).

There's also version drift — root has `tailwindcss@^4.2.1` while `@kkb/ui` has `^4.1.0`. Bun hoists so this works, but it's worth cleaning up for clarity.

**Note:** This is intentionally deferred for now. A later pass should likely pair this cleanup with adopting Bun catalogs for shared dependency version management.

---

## 2. MEDIUM — Font Files Duplicated Across Apps

Three identical font files exist in both apps:

```
apps/web/app/fonts/GeistVF.woff        ← duplicate
apps/web/app/fonts/GeistMonoVF.woff    ← duplicate
apps/web/app/fonts/TX-02-VF.woff2      ← duplicate
apps/docs/app/fonts/GeistVF.woff       ← duplicate
apps/docs/app/fonts/GeistMonoVF.woff   ← duplicate
apps/docs/app/fonts/TX-02-VF.woff2     ← duplicate
```

**Options:**

- Move font files to `packages/ui/src/fonts/` and export them, if `next/font/local` can consume package-relative assets without introducing Next.js or Turborepo issues
- Or accept the duplication since `next/font/local` requires file-relative paths (Next.js constraint)

The root layouts (`apps/web/app/layout.tsx` and `apps/docs/app/layout.tsx`) are also nearly identical — same font loading, same ThemeProvider setup. Only metadata differs (`apps/web/app/layout.tsx:20`, `apps/docs/app/layout.tsx:20`). Consider extracting a shared layout component from `@kkb/ui`.

---

## 3. MEDIUM — Audio Components Use Hardcoded Colors, Bypass Theme System

Both `packages/ui/src/components/audio/` and `apps/web/components/audio/` use extensive raw hex/rgba values:

```tsx
// player-controls.tsx:37
"border-[#b0b8d0] bg-[linear-gradient(180deg,#d0d8ee_0%,#b0b8d0_40%,...)]"
"fill-[#48507a] text-[#48507a]"

// player-shell.tsx:181 (apps/web)
"bg-[linear-gradient(180deg,#b8c0d0_0%,#9098a8_8%,...)]"
"text-[#78b8ff] drop-shadow-[0_0_10px_rgba(120,184,255,0.5)]"

// waveform.tsx:195, track-selector.tsx:25
"bg-[rgba(120,184,255,0.06)]"
// ... 30+ more hardcoded color values
```

These components won't respond to light/dark theme switching. If this is intentional (always-dark audio player), document it. If not, extract these as theme variables (e.g., `--audio-primary`, `--audio-glow`, etc.) in globals.css.

**Recommended direction:** treat the current WinAmp-inspired look as the first named audio theme, backed by audio-specific CSS variables. That keeps the current styling intact while creating a path toward a broader audio theming system later.

---

## 4. LOW — `components.json` Consistency & Latest Format

All three `components.json` files are consistent (style: `"new-york"`, rsc: true, baseColor: `"neutral"`, iconLibrary: `"lucide"`). This is good.

Notes:

- `"new-york"` is valid but shadcn now also offers `"radix-nova"` as a newer style option
- The `tailwind.config` field is correctly set to `""` for Tailwind v4
- The shadcn docs now use `@workspace/ui/` as the canonical alias prefix for monorepos, but `@kkb/ui/` works identically and is fine

---

## 5. LOW — `@layer base` Pattern Still Works But Worth Noting

```css
@layer base {
  * { @apply border-border; }
  body { @apply bg-background text-foreground; }
}
```

This is the standard shadcn pattern and still works in Tailwind v4. The `* { @apply border-border; }` applies border-color to every element — standard tradeoff for consistent borders.

---

## 6. INFO — What's Working Well

- **Dark variant setup** — now uses Tailwind v4's recommended `:where(.dark, .dark *)` pattern
- **OKLCH color space** — modern, perceptually uniform, great for dark mode contrast
- **`@theme inline` usage** — correct pattern for runtime CSS variable resolution
- **Single shared style entrypoint** — both apps import `@kkb/ui/styles/globals.css`; no parallel Tailwind theme package remains
- **`data-slot` attributes** — present on 53/59 component `.tsx` files (328 occurrences). Missing from `code.tsx`, `direction.tsx`, `mode-toggle.tsx`, `sonner.tsx`, `spinner.tsx`, `theme-provider.tsx` — these are wrappers or non-visual components where `data-slot` is less critical
- **`React.ComponentProps` pattern** (no `forwardRef`) — matches latest shadcn/ui conventions
- **CVA variants** — type-safe, consistent variant patterns across components
- **`@source "../components"`** — correctly tells Tailwind to scan UI package components
- **`@source` for json-render** — `apps/web/app/json-render/globals.css` correctly adds `@source` for the `@json-render/shadcn` package
- **PostCSS config** — minimal, correct `@tailwindcss/postcss` plugin setup in both apps
- **Biome CSS parser** — configured with `tailwindDirectives: true` in `biome.json:17`
- **ThemeProvider setup** — correct `attribute="class"`, `defaultTheme="system"`, `enableSystem`, `disableTransitionOnChange`

---

## Summary: Recommended Actions

| Priority | Action | Effort |
|---|---|---|
| **Medium** | Decide whether font assets/layout plumbing can move into `@kkb/ui` without Next.js issues | 30 min |
| **Medium** | Define audio theme tokens and promote the current WinAmp-inspired styling into the first named audio theme | varies |
| **Low** | Clean up root `package.json` dependency placement and version drift, likely alongside Bun catalogs adoption | 30 min |
