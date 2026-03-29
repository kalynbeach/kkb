# @kkb/ui Preset Migration Report

> Preset: `b3XotzR0pG` — [shadcn/create link](https://ui.shadcn.com/create?base=base&preset=b3XotzR0pG)
> Date: 2026-03-28

## Goal

Refactor `@kkb/ui` to adopt the `b3XotzR0pG` preset as the foundation, migrating from Radix primitives to Base UI primitives and adopting the `base-mira` style.

---

## Current State

| Field | Value |
|-------|-------|
| Style | `new-york` |
| Base | `radix` |
| Icon library | `lucide` |
| Menu color | `null` |
| Menu accent | `null` |
| Tailwind | v4 |
| CSS file | `src/styles/globals.css` |
| Installed components | 57 |

### Custom additions (not from shadcn)

- **~80 `--audio-*` CSS custom properties** across `:root` and `.dark` (shell, titlebar, panel, waveform, control, status tokens)
- **`--color-audio-*` mappings** in `@theme inline` block
- **`@layer components`** block with `.audio-shell`, `.audio-subshell`, `.audio-titlebar`, `.audio-panel`, `.audio-scanlines`, `.audio-buffered-segment`, `.audio-transport-button` classes
- **`--font-mono`** mapped to `var(--font-berkeley-mono)` (custom font)
- **`@source "../components"`** directive
- **Marquee keyframe** animation
- **`--animate-marquee`** theme variable
- **`--font-sans`** mapped to `var(--font-geist-sans)`

---

## Target State (Preset `b3XotzR0pG`)

| Field | Value |
|-------|-------|
| Style | `base-mira` |
| Base | `base` (Base UI) |
| Icon library | `phosphor` |
| Menu color | `default-translucent` |
| Menu accent | `subtle` |
| Base color | `neutral` |

---

## Config Differences

| Setting | Current | Preset | Impact |
|---------|---------|--------|--------|
| **style** | `new-york` | `base-mira` | Component visual treatment changes |
| **base** | `radix` | `base` | All component source code changes (different primitive APIs) |
| **iconLibrary** | `lucide` | `phosphor` | All icon imports change (`lucide-react` -> `@phosphor-icons/react`) |
| **menuColor** | `null` | `default-translucent` | Menu/dropdown appearance |
| **menuAccent** | `null` | `subtle` | Menu item accent treatment |

---

## CSS Token Differences

### Structural changes

| Area | Current | Preset |
|------|---------|--------|
| `@custom-variant dark` | `(&:where(.dark, .dark *))` | `(&:is(.dark *))` |
| `@theme inline` fonts | `--font-sans`, `--font-mono` (Berkeley Mono) | `--font-mono` (circular), `--font-heading` (new) |
| `@layer base html` | not set | `@apply font-mono` (mono-first typography) |
| `--destructive-foreground` | defined (`oklch(0.985 0 0)`) | **removed** |
| `@source` | `@source "../components"` | not present |
| Marquee keyframe | present | not present |

### Token value changes

#### Charts (light and dark)

| Token | Current | Preset |
|-------|---------|--------|
| `--chart-1` | `oklch(0.809 0.105 251.813)` (blue) | `oklch(0.87 0 0)` (gray) |
| `--chart-2` | `oklch(0.623 0.214 259.815)` (blue) | `oklch(0.556 0 0)` (gray) |
| `--chart-3` | `oklch(0.546 0.245 262.881)` (blue) | `oklch(0.439 0 0)` (gray) |
| `--chart-4` | `oklch(0.488 0.243 264.376)` (blue) | `oklch(0.371 0 0)` (gray) |
| `--chart-5` | `oklch(0.424 0.199 265.638)` (blue) | `oklch(0.269 0 0)` (gray) |

All other core tokens (background, foreground, primary, secondary, muted, accent, card, popover, border, input, ring, sidebar) are **identical** between current and preset.

---

## Migration Steps

### 1. Backup custom CSS

Before any changes, extract and preserve:
- All `--audio-*` custom properties (`:root` and `.dark`)
- All `--color-audio-*` mappings from `@theme inline`
- Entire `@layer components` block (audio component styles)
- `@source "../components"` directive
- Marquee keyframe and `--animate-marquee` variable
- Custom font mappings (`--font-sans` -> Geist Sans, `--font-mono` -> Berkeley Mono)

### 2. Apply preset

Run from `packages/ui`:
```bash
bunx --bun shadcn@latest init --preset b3XotzR0pG --base base --force --no-reinstall
```
This updates `components.json` and `globals.css` without touching installed components.

### 3. Restore custom CSS

Re-add to `globals.css`:
- `@source "../components"` after imports
- Custom font mappings in `@theme inline` (keep `--font-heading` from preset, restore `--font-sans` and Berkeley Mono `--font-mono`)
- All `--audio-*` tokens in `:root` and `.dark`
- All `--color-audio-*` in `@theme inline`
- Marquee keyframe and `--animate-marquee`
- `@layer components` audio styles

### 4. Migrate icon library

Replace all `lucide-react` imports with `@phosphor-icons/react` equivalents across:
- `packages/ui/src/components/`
- `apps/web/` (any direct icon usage)
- `apps/docs/` (any direct icon usage)

Install: `bun add @phosphor-icons/react`
Remove: `bun remove lucide-react`

### 5. Reinstall all 57 components from Base UI registry

Components must be re-added from the `base` registry since the primitive library changes from Radix to Base UI. Run:
```bash
bunx --bun shadcn@latest add --all --overwrite
```

Review each component for local customizations that need preserving. For components with local edits, use `--dry-run` and `--diff` to smart-merge.

**Current installed components:**
accordion, alert-dialog, alert, aspect-ratio, avatar, badge, breadcrumb, button-group, button, calendar, card, carousel, chart, checkbox, collapsible, combobox, command, context-menu, dialog, direction, drawer, dropdown-menu, empty, field, form, hover-card, input-group, input-otp, input, item, kbd, label, menubar, native-select, navigation-menu, pagination, popover, progress, radio-group, resizable, scroll-area, select, separator, sheet, sidebar, skeleton, slider, sonner, spinner, switch, table, tabs, textarea, toggle-group, toggle, tooltip

### 6. API migration (Radix -> Base UI)

Key API differences to address across all component consumers:

| Pattern | Radix | Base UI |
|---------|-------|---------|
| Custom trigger | `asChild` prop | `render` prop |
| Select items | `SelectItem` inside `SelectGroup` | same structure, different internals |
| ToggleGroup | Radix `ToggleGroup` API | Base UI `ToggleGroup` API |
| Slider | Radix `Slider` | Base UI `Slider` |
| Accordion | Radix `Accordion` | Base UI `Accordion` |

Audit all component usage in `apps/web` and `apps/docs` for Radix-specific patterns.

### 7. Font decisions

Decide:
- Keep Berkeley Mono as `--font-mono` or adopt preset's default? -> Keep Berkeley Mono.
- Keep Geist Sans as `--font-sans` or drop it? -> Keep Geist Sans (for now).
- Adopt `--font-heading` — which font? -> Berkeley Mono.
- Apply `font-mono` to `html` (preset default) or keep current approach? -> Keep current approach.

### 8. Chart color decision

Decide: keep current blue/purple chart palette or adopt preset's monochrome grayscale? -> Adopt the preset's monochrome greyscale.

---

## Risk Areas

- **Component API breakage**: Radix -> Base UI changes prop APIs. All component consumers need audit.
- **Icon mismatch**: Not all Lucide icons have 1:1 Phosphor equivalents. Need icon mapping table.
- **Custom audio components**: Heavy use of custom CSS layers — must not be clobbered during migration.
- **Downstream apps**: `apps/web` and `apps/docs` both consume `@kkb/ui` — changes propagate immediately.
- **57 components**: Large surface area for the reinstall. Budget time for review.
