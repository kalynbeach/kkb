---
name: KKB
description: Shared design system for the KKB monorepo: sharp technical product UI with scoped audio and oscilloscope instrument surfaces.
colors:
  background: "oklch(1 0 0)"
  foreground: "oklch(0.145 0 0)"
  card: "oklch(1 0 0)"
  card-foreground: "oklch(0.145 0 0)"
  popover: "oklch(1 0 0)"
  popover-foreground: "oklch(0.145 0 0)"
  primary: "oklch(0.205 0 0)"
  primary-foreground: "oklch(0.985 0 0)"
  secondary: "oklch(0.97 0 0)"
  secondary-foreground: "oklch(0.205 0 0)"
  muted: "oklch(0.97 0 0)"
  muted-foreground: "oklch(0.556 0 0)"
  accent: "oklch(0.97 0 0)"
  accent-foreground: "oklch(0.205 0 0)"
  border: "oklch(0.922 0 0)"
  input: "oklch(0.922 0 0)"
  ring: "oklch(0.708 0 0)"
  paper-white: "oklch(1 0 0)"
  bench-ink: "oklch(0.145 0 0)"
  instrument-black: "oklch(0.205 0 0)"
  rail-gray: "oklch(0.922 0 0)"
  mute-gray: "oklch(0.556 0 0)"
  panel-white: "oklch(0.985 0 0)"
  panel-graphite: "oklch(0.205 0 0)"
  scope-blue: "oklch(0.768 0.122 252.001)"
  scope-blue-dark: "oklch(0.183 0.05 270.309)"
  destructive: "oklch(0.577 0.245 27.325)"
  destructive-foreground: "oklch(0.985 0 0)"
  chart-1: "oklch(0.809 0.105 251.813)"
  chart-2: "oklch(0.623 0.214 259.815)"
  chart-3: "oklch(0.546 0.245 262.881)"
  chart-4: "oklch(0.488 0.243 264.376)"
  chart-5: "oklch(0.424 0.199 265.638)"
  sidebar: "oklch(0.985 0 0)"
  sidebar-foreground: "oklch(0.145 0 0)"
  sidebar-primary: "oklch(0.205 0 0)"
  sidebar-primary-foreground: "oklch(0.985 0 0)"
  sidebar-accent: "oklch(0.97 0 0)"
  sidebar-accent-foreground: "oklch(0.205 0 0)"
  sidebar-border: "oklch(0.922 0 0)"
  sidebar-ring: "oklch(0.708 0 0)"
  audio-accent: "oklch(0.768 0.122 252.001)"
  audio-panel: "oklch(0.183 0.05 270.309)"
  audio-shell: "oklch(0.652 0.026 264.382)"
  audio-control: "oklch(0.784 0.035 270.937)"
  audio-title: "oklch(0.881 0.024 264.446)"
  audio-meta: "oklch(0.733 0.036 270.889)"
  oscilloscope-trace: "color(srgb 0.03 0.78 0.2)"
  oscilloscope-glow: "color(srgb 0.74 1 0.71)"
  oscilloscope-shoulder: "color(srgb 0.004 0.08 0.018)"
  oscilloscope-floor: "color(srgb 0.42 0.64 0.38)"
typography:
  headline-lg:
    fontFamily: "var(--font-tx-02), ui-monospace, monospace"
    fontSize: "32px"
    fontWeight: 600
    lineHeight: "40px"
    letterSpacing: "-0.02em"
  headline-md:
    fontFamily: "var(--font-tx-02), ui-monospace, monospace"
    fontSize: "24px"
    fontWeight: 600
    lineHeight: "32px"
    letterSpacing: "-0.01em"
  headline-sm:
    fontFamily: "var(--font-tx-02), ui-monospace, monospace"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: "28px"
    letterSpacing: "-0.01em"
  body-lg:
    fontFamily: "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: "28px"
  body-md:
    fontFamily: "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "24px"
  body-sm:
    fontFamily: "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "20px"
  label-md:
    fontFamily: "var(--font-tx-02), ui-monospace, monospace"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: "20px"
  label-sm:
    fontFamily: "var(--font-tx-02), ui-monospace, monospace"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: "16px"
  code-sm:
    fontFamily: "var(--font-tx-02), ui-monospace, monospace"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: "16px"
  body-serif:
    fontFamily: "var(--font-eb-garamond), Georgia, Cambria, 'Times New Roman', Times, serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: "28px"
  accent-mono:
    fontFamily: "var(--font-departure-mono), ui-monospace, monospace"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: "16px"
  audio-label:
    fontFamily: "var(--font-tx-02), ui-monospace, monospace"
    fontSize: "10px"
    fontWeight: 500
    lineHeight: "12px"
    letterSpacing: "0.08em"
rounded:
  none: "0px"
  xs: "1px"
  sm: "2px"
  md: "3px"
  lg: "4px"
  xl: "6px"
  full: "9999px"
spacing:
  unit: "4px"
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  2xl: "32px"
  container-padding: "8px"
  focus-ring: "3px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    height: "36px"
    padding: "0 16px"
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.secondary-foreground}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    height: "36px"
    padding: "0 16px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.foreground}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    height: "36px"
    padding: "0 16px"
  input:
    backgroundColor: "transparent"
    textColor: "{colors.foreground}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    height: "36px"
    padding: "0 12px"
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.card-foreground}"
    rounded: "{rounded.lg}"
    padding: "24px"
  audio-transport-button:
    backgroundColor: "{colors.audio-control}"
    textColor: "{colors.primary}"
    rounded: "{rounded.sm}"
    height: "28px"
    width: "32px"
  oscilloscope-trace:
    backgroundColor: "{colors.oscilloscope-trace}"
    textColor: "{colors.oscilloscope-glow}"
    rounded: "{rounded.none}"
    height: "auto"
---

# Design System: KKB

## 1. Overview

**Creative North Star: "Dynamic Digital Studio"**

KKB is a technical creative monorepo. Its interface should feel precise, calm, sharp, and instrument-like: mostly neutral, structurally simple, optimized for reading code, inspecting demos, controlling audio, and studying graphics experiments.

The default UI language is shadcn-derived and token-driven. It uses the semantic token names from `packages/ui/src/styles/globals.css` (`background`, `foreground`, `card`, `primary`, `muted`, `border`, `ring`, `sidebar`, etc.) so generated design work remains compatible with `@kkb/ui`, Tailwind v4 theme variables, and shadcn/ui component conventions.

KKB's product foundation is hard-edged and technical. Most app surfaces should be nearly square, using 1-4px radii. Larger radii are exceptions for cards, dialogs, badges, avatars, sliders, switches, and specialized instrument controls. The audio presentation layer can be more tactile; the oscilloscope layer can be more luminous. Neither exception should mutate the broader app foundation.

**Key Characteristics:**

- shadcn/ui-compatible semantic tokens remain present for compatibility, while personal studio names (`bench-ink`, `paper-white`, `scope-blue`) carry the design language.
- TX-02 carries headings, labels, code, telemetry, and compact hardware-style UI.
- Geist carries readable prose and body copy.
- Cool audio blues are scoped to audio and waveform surfaces.
- P31 phosphor greens are scoped to oscilloscope traces, glow, and shader-derived visualizations.
- Edges are sharp by default; roundness must be earned.

## 2. Colors

The shared UI palette in `packages/ui/src/styles/globals.css` is neutral-first and expressed as OKLCH CSS variables. The frontmatter keeps shadcn/ui names for compatibility and also keeps the more personal studio names from the new system. Use semantic names when mapping to live components; use studio names when describing the visual identity.

### Primary

- **Bench Ink / Paper White**: The foundational identity pair. Bench Ink is the default text and technical mark color; Paper White is the default app and document surface.
- **Instrument Black / Panel White**: The decisive action and dark-surface pair. `primary` maps to Instrument Black; `primary-foreground` maps to Panel White.
- **Foreground / Background**: shadcn/ui compatibility aliases for Bench Ink and Paper White. Use these names in component code, but do not let the design language collapse into generic token prose.

### Secondary

- **Rail Gray / Mute Gray**: The structural quiet layer for borders, input strokes, secondary copy, descriptions, dormant navigation, and metadata.
- **Secondary, Muted, Accent**: shadcn/ui compatibility aliases for the quiet neutral fills used by secondary actions, hover states, empty areas, and selected tab backgrounds. In this system, `accent` is deliberately neutral; it is not Scope Blue.
- **Sidebar Tokens**: Sidebar roles mirror the shadcn vocabulary and should be used for side navigation, rail layouts, and app shells instead of one-off colors.

### Tertiary

- **Audio Accent**: Cool blue used for waveform progress, buffered ranges, signal status, audio grid lines, and instrument highlights. Do not use it as a general product accent.
- **Oscilloscope Trace**: P31 green from the shader trace (`vec3f(0.03, 0.78, 0.2)`). Use only for oscilloscope traces, glow, phosphor state, and shader-derived visualization UI.
- **Oscilloscope Glow**: The composite shader phosphor tint (`vec3f(0.74, 1.0, 0.71)`) for bloom, hot cores, and luminous trace edges.

### Neutral

- **Card / Popover**: White or near-black semantic surfaces for containers and overlays.
- **Border / Input / Ring**: Quiet structure and accessible focus affordance. Borders define most hierarchy before shadows do.
- **Muted Foreground**: Secondary copy, descriptions, metadata, dormant navigation. Do not use it for primary body text when contrast is weak.

### Named Rules

**The Dual Naming Rule.** Keep both vocabularies alive: shadcn/ui names are the implementation contract; studio names are the design language. Generated code should map `bench-ink` to `foreground`, `paper-white` to `background`, `instrument-black` to `primary`, `rail-gray` to `border/input`, and `mute-gray` to `muted-foreground` rather than deleting either side.

**The Blue-and-Green Scope Rule.** Audio blue belongs to audio and waveform UI. P31 green belongs to oscilloscope traces and shader-derived visualizations. Neither is a general-purpose brand accent.

## 3. Typography

The system uses four type roles: **Geist** for readable continuous sans-serif text, **EB Garamond** for deliberate serif text, **TX-02** for standard monospace UI, and **Departure Mono** for selective lo-fi technical accents.

Use **Geist** through `--font-sans` for body copy, docs prose, descriptions, paragraphs, and other text that benefits from a neutral sans-serif reading rhythm.

Use **EB Garamond** through `--font-serif` for serif text. It is the default KKB serif face, but it should be applied deliberately rather than replacing the sans-serif product baseline.

Use **TX-02** through `--font-mono` for headings, labels, code, technical metadata, timestamps, audio telemetry, oscilloscope readouts, and compact hardware-style UI. The checked-in font file is `TX-02-VF.woff2`, but components should reference the `font-mono` token rather than hard-coding the file name.

Use **Departure Mono** through `--font-mono-secondary` for selective pixel/lo-fi technical treatments. It should not replace TX-02 as the default monospace font; reserve it for specific components or text where the sharper pixel voice is intentional.

Geist Mono is intentionally not part of the KKB type system.

### Hierarchy

- **Headline LG** (TX-02, 600, 32px / 40px, -0.02em): Main technical page headings and catalog titles.
- **Headline MD** (TX-02, 600, 24px / 32px, -0.01em): Section headings and prominent panel headers.
- **Headline SM** (TX-02, 600, 20px / 28px, -0.01em): Card titles, demos, and compact page headings.
- **Body LG / MD / SM** (Geist, 400, 18/16/14px): Prose, descriptions, docs previews, field help, and explanatory UI copy.
- **Label MD / SM** (TX-02, 500, 14/12px): Buttons, tabs, navigation labels, controls, and terse metadata.
- **Code SM** (TX-02, 500, 12px / 16px): Inline technical references and compact code-adjacent labels.
- **Body Serif** (EB Garamond, 18px / 28px): Intentional editorial notes, essays, or long-form design writing.
- **Accent Mono** (Departure Mono, 12px / 16px): Pixel-forward technical accents only.
- **Audio Label** (TX-02, 10px / 12px, 0.08em): Uppercase audio and instrument labels.

### Named Rules

**The TX-02 Heading Rule.** KKB's technical voice uses TX-02 for headings and labels. Do not default product headings back to generic sans unless the surface is prose-heavy.

**The Geist Body Rule.** Long reading belongs to Geist. Mono identifies technical context; it does not replace readable prose.

## 4. Elevation

The general product UI is mostly flat. Hierarchy comes from borders, tonal surfaces, spacing, and focus rings before shadows. Sharp technical surfaces should feel machined, not pillowy.

### Shadow Vocabulary

- **Surface Low** (`shadow-sm`): Use sparingly for floating sidebars, active tab surfaces, popovers, dropdowns, dialogs, and tooltips.
- **Input Low** (`shadow-xs`): Use on outline buttons and fields only where a barely-raised edge improves affordance.
- **Audio Shell** (`0 8px 32px oklch(0 0 0 / 0.5), inset 0 1px 0 oklch(1 0 0 / 0.3)`): Use only for audio instrument chrome.
- **Oscilloscope Glow**: Shader bloom is part of the oscilloscope renderer, not a general CSS card effect.

### Named Rules

**The Flat Product Rule.** A resting product surface should not look lifted. If a shadow does not communicate overlay, active state, or instrument depth, remove it.

## 5. Components

Components are compact, predictable, keyboard-first controls with hard technical edges and visible focus. Compose new work from `@kkb/ui` before inventing app-local patterns.

### Buttons

- **Shape:** Sharp rectangle with a small technical radius (`rounded-md` = 3px). Do not use pill buttons except where the component type requires it.
- **Primary/default:** Dark neutral fill, light text, hover opacity reduction. Use for the main action on a surface.
- **Secondary:** Light neutral fill, dark text. Use for lower-emphasis actions.
- **Outline:** Transparent/background fill with border and subtle shadow. Use when the action should sit with form controls.
- **Ghost:** No resting chrome; show light neutral accent fill on hover. Use for toolbar and navigation actions.
- **Link:** Text-only with underline on hover. Use for navigation, not primary actions.
- **Destructive:** Red fill for destructive actions only.

### Chips

- **Style:** Badges can remain full-pill because their shape communicates label/status, not surface softness.
- **State:** Use badges for status and labels. Do not turn them into decorative stickers.

### Cards / Containers

- **Corner Style:** Nearly square (`rounded-lg` = 4px). Cards should read as panels, not soft marketing tiles.
- **Background:** Cards use semantic `card` and `card-foreground`; audio panels use `.audio-*`; oscilloscope viewports use shader-derived greens.
- **Shadow Strategy:** Cards are bordered first. Use shadows only for overlays or deliberate instrument depth.
- **Border:** One-pixel borders are structural and neutral. No colored side-stripe accents.
- **Internal Padding:** Standard card padding is 24px with header/content/footer slots.

### Inputs / Fields

- **Style:** Transparent or subtle dark input background, one-pixel input border, `rounded-md` = 3px, 36px height, 12px horizontal padding.
- **Focus:** Border shifts to ring color with a visible 3px translucent ring.
- **Error / Disabled:** Invalid fields use destructive border/ring; disabled fields reduce opacity and disable interaction.

### Navigation

- **Style:** Navigation is text-first and compact. Default items use muted foreground; hover and active states move to foreground or sidebar accent.
- **Typography:** TX-02 is appropriate for route indexes, technical nav, and catalog navigation. Use Geist for prose-heavy menus.
- **Mobile:** Collapse structure; do not invent non-standard navigation affordances for flavor.

### Audio Presentation

Audio components may use `.audio-shell`, `.audio-titlebar`, `.audio-panel`, `.audio-transport-button`, scanlines, waveform colors, and glow tokens from `globals.css`. Keep audio-specific blue color and depth decisions inside audio presentation components.

### Oscilloscope Presentation

Oscilloscope surfaces use P31 phosphor greens from the WebGPU shaders: trace green for core lines, phosphor glow for bloom/hot cores, dark green shoulder/floor values for persistence and panel atmosphere. Treat these as renderer/instrument colors, not generic success colors.

## 6. Do's and Don'ts

### Do:

- **Do** preserve shadcn/ui token names and the personal studio color names in frontmatter and generated docs.
- **Do** treat `packages/ui/src/styles/globals.css` as the live token source of truth.
- **Do** pair filled colors with matching foreground tokens, especially `primary` with `primary-foreground`.
- **Do** use the 4px spacing rhythm for component dimensions and layout gaps.
- **Do** use Geist for prose and body copy; use EB Garamond for deliberate serif text; use TX-02 for headings, labels, code, telemetry, audio metadata, and oscilloscope readouts; use Departure Mono only as a selective secondary monospace accent.
- **Do** keep roundness low: 1-4px for most controls and panels, 6px only for larger containers, full radius only for badges/avatars/sliders/switches.
- **Do** use audio blue for audio and waveform state, and P31 green for oscilloscope trace/glow state.

### Don't:

- **Don't** replace either vocabulary with the other: semantic shadcn/ui tokens are required for compatibility, and studio names are required for design intent.
- **Don't** reintroduce Geist Mono; it is not part of the KKB font system.
- **Don't** use the audio blue accent as a general-purpose brand color.
- **Don't** use oscilloscope green as a generic success color.
- **Don't** add shadows where borders, spacing, or tonal contrast are enough.
- **Don't** use rounded soft cards, pillowy inputs, glassmorphism, heavy gradients, or generic glossy SaaS styling.
- **Don't** create app-local UI primitives when an equivalent `@kkb/ui` component or token exists.
