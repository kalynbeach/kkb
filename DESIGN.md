---
version: alpha
name: KKB
description: Shared design system for the KKB monorepo.
colors:
  background: "#ffffff"
  foreground: "#171717"
  card: "#ffffff"
  card-foreground: "#171717"
  popover: "#ffffff"
  popover-foreground: "#171717"
  primary: "#343434"
  primary-foreground: "#fafafa"
  secondary: "#f5f5f5"
  secondary-foreground: "#343434"
  muted: "#f5f5f5"
  muted-foreground: "#737373"
  accent: "#f5f5f5"
  accent-foreground: "#343434"
  border: "#e5e5e5"
  input: "#e5e5e5"
  ring: "#a1a1a1"
  destructive: "#e7000b"
  destructive-foreground: "#fafafa"
  audio-accent: "#8bbff4"
  audio-panel: "#101224"
  audio-shell: "#a1a6b5"
  audio-control: "#c7cbd4"
typography:
  headline-lg:
    fontFamily: TX-02
    fontSize: 32px
    fontWeight: 600
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: TX-02
    fontSize: 24px
    fontWeight: 600
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: TX-02
    fontSize: 20px
    fontWeight: 600
    lineHeight: 28px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: 400
    lineHeight: 28px
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: 400
    lineHeight: 24px
  body-sm:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
  label-md:
    fontFamily: TX-02
    fontSize: 14px
    fontWeight: 500
    lineHeight: 20px
  label-sm:
    fontFamily: TX-02
    fontSize: 12px
    fontWeight: 500
    lineHeight: 16px
  code-sm:
    fontFamily: TX-02
    fontSize: 12px
    fontWeight: 500
    lineHeight: 16px
  audio-label:
    fontFamily: TX-02
    fontSize: 10px
    fontWeight: 500
    lineHeight: 12px
    letterSpacing: 0.08em
rounded:
  none: 0px
  xs: 0.125rem
  sm: 0.27rem
  md: 0.36rem
  lg: 0.45rem
  xl: 0.63rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  2xl: 32px
  container-padding: 8px
  focus-ring: 3px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    height: 36px
    padding: 16px
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.secondary-foreground}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    height: 36px
    padding: 16px
  button-ghost:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    height: 36px
    padding: 16px
  input:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    height: 36px
    padding: 12px
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.card-foreground}"
    rounded: "{rounded.xl}"
    padding: 24px
  audio-transport-button:
    backgroundColor: "{colors.audio-control}"
    textColor: "{colors.primary}"
    rounded: "{rounded.sm}"
    height: 28px
    width: 32px
---

# KKB Design System

## Overview

KKB is a technical creative monorepo. Its interface should feel precise, calm, and instrument-like: mostly neutral, structurally simple, and optimized for reading code, inspecting demos, and controlling audio/graphics experiments.

The default UI language is shadcn-derived and token-driven. It favors high-contrast monochrome surfaces, compact controls, clear focus states, and restrained motion. The audio presentation layer is intentionally more tactile: layered panels, cool blue accents, scanlines, inset shadows, and small monospace labels evoke hardware and oscilloscope interfaces without changing the broader app foundation.

## Colors

The shared UI palette in `packages/ui/src/styles/globals.css` is neutral-first and expressed in CSS as OKLCH variables. The frontmatter tokens above provide sRGB hex equivalents for DESIGN.md consumers.

- **Background / foreground:** White and near-black form the base reading surface for apps, docs, and catalogs.
- **Primary:** A dark neutral used for the most important action or selected state. Pair it with `primary-foreground`, not with body text colors.
- **Secondary, muted, and accent:** Very light neutrals provide hover states, secondary actions, empty areas, and subtle grouping.
- **Border, input, and ring:** Quiet grays define component structure and accessible focus affordances without adding color noise.
- **Destructive:** Red is reserved for destructive or invalid states.
- **Audio accent:** Cool blue is scoped to audio and signal-visualization UI. Do not use it as a general product accent unless the surface is explicitly audio, waveform, or oscilloscope related.

Dark mode mirrors the same semantic roles: backgrounds become near-black, cards move one step lighter, primary actions invert to light-on-dark, and borders use translucent white.

## Typography

The system uses two primary type roles: **Geist** for readable continuous text and **TX-02** for structural, technical, and interface chrome.

Use **Geist** through `--font-sans` for body copy, docs prose, descriptions, paragraphs, and other text that benefits from a neutral sans-serif reading rhythm.

Use **TX-02** through `--font-mono` for headings, labels, code, technical metadata, timestamps, audio telemetry, and compact hardware-style UI. The checked-in font file is `TX-02-VF.woff2`, but components should reference the `font-mono` token rather than hard-coding the file name.

Keep type compact but readable:

- Headlines use TX-02, semibold weight, and slight negative tracking for a precise technical voice.
- Body text uses Geist at normal weight with comfortable line height.
- Labels use TX-02 at medium weight; keep them concise and sentence case unless the component is explicitly instrument-like.
- Audio labels may use uppercase, small type, and wider tracking for a control-panel feel.

## Layout & Spacing

The layout model is fluid and contextual. Apps own page composition, while `@kkb/ui` provides reusable primitives with compact, predictable internal spacing.

- Use a **4px base unit**. Prefer Tailwind spacing that lands on 4px increments.
- Default controls are compact: 36px high for standard buttons and inputs, 32px for small controls, and 24px for extra-small icon controls.
- Group related content with cards, panels, or bordered regions before adding new color treatments.
- Keep page-level layouts responsive and avoid fixed-width assumptions except for deliberate max-width reading columns or demo canvases.
- Preserve safe-area and viewport breathing room around immersive demos such as audio and oscilloscope routes.

## Elevation & Depth

The general product UI is mostly flat. Hierarchy comes from borders, tonal surfaces, spacing, and focus rings before shadows.

Use small shadows only when a component floats above the page, such as popovers, dropdowns, dialogs, tooltips, and sidebars. Cards may use subtle `shadow-sm`; avoid heavy marketing-style depth on standard app surfaces.

Audio components are the exception. They use gradient layers, inset shadows, scanlines, glows, and beveled controls to create a hardware-inspired surface. Keep those effects scoped to `.audio-*` classes and audio-specific components.

## Shapes

The shape language is softly machined rather than pillowy. Most components use `rounded-md` from the shared `--radius` scale. Cards and dialogs can be slightly larger; checkboxes, menu items, and compact controls can be smaller.

Use full radii only for avatars, badges, sliders, switches, and circular controls. Avoid mixing sharp rectangles with heavily rounded cards in the same view unless the contrast communicates an intentional hierarchy.

## Components

### Buttons

Buttons follow the shared `buttonVariants` contract:

- **Primary/default:** Dark neutral fill, light text, hover opacity reduction. Use for the main action on a surface.
- **Secondary:** Light neutral fill, dark text. Use for lower-emphasis actions.
- **Outline:** Transparent/background fill with border and subtle shadow. Use when the action should sit with form controls.
- **Ghost:** No resting chrome; show light accent fill on hover. Use for toolbar and navigation actions.
- **Link:** Text-only with underline on hover. Use for navigation, not primary actions.
- **Destructive:** Red fill for destructive actions only.

All buttons need visible keyboard focus via the ring token and must preserve disabled opacity and pointer behavior.

### Inputs and form controls

Inputs, textareas, selects, comboboxes, checkboxes, radios, sliders, and switches should use semantic tokens from `globals.css`: `background`, `foreground`, `input`, `ring`, `muted-foreground`, `destructive`, and their foreground pairs.

Do not introduce app-local form colors when existing semantic tokens cover the state. Invalid states should combine destructive border/ring treatment with readable helper text.

### Cards, popovers, and dialogs

Cards are bordered, rounded, and lightly shadowed. Popovers, dropdowns, hover cards, select menus, tooltips, dialogs, and sheets use the popover/background semantic tokens and small shadows to separate them from the page.

Prefer direct content hierarchy inside these containers: heading, supporting text, controls. Avoid decorative wrappers unless they improve comprehension.

### Audio presentation

Audio components may use `.audio-shell`, `.audio-titlebar`, `.audio-panel`, `.audio-transport-button`, scanlines, waveform colors, and glow tokens from `globals.css`.

Keep audio-specific color and depth decisions inside `packages/ui` audio presentation components. Host apps should compose the audio UI rather than duplicating its gradient or waveform styles.

## Do's and Don'ts

- Do treat `packages/ui/src/styles/globals.css` as the source of truth for live CSS variables.
- Do keep DESIGN.md frontmatter tokens in hex so Google DESIGN.md consumers can parse them.
- Do pair filled colors with their matching foreground tokens, especially `primary` with `primary-foreground`.
- Do use the 4px spacing rhythm for component dimensions and layout gaps.
- Do use Geist for prose and body copy; use TX-02 for headings, labels, code, telemetry, and audio metadata.
- Don't use the audio blue accent as a general-purpose brand color.
- Don't add shadows where borders, spacing, or tonal contrast are enough.
- Don't hard-code OKLCH values in components when a semantic CSS variable already exists.
- Don't create app-local UI primitives when an equivalent `@kkb/ui` component or token exists.
