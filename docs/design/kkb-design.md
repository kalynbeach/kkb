# KKB Design

## Design Intent

The initial KKB design system is a foundation to build upon and iterate on, not a single finished aesthetic. `@kkb/ui` provides the shared building blocks for that system across the monorepo.

KKB should feel like a canvas for technical and creative work. The foundation needs enough consistency to make KKB recognizable while leaving room to explore and incorporate:

- Audio systems and audio-reactive interfaces
- Shaders, WebGPU, and 3D visuals such as Three.js scenes
- High-quality, purposeful animation
- Generative and procedural graphics
- Sigils, advanced symbols, and a distinct KKB visual vocabulary
- Rich diagrams, data visualizations, and interactive technical artifacts

The system should make ambitious visual experiments safe to pursue without allowing individual surfaces to fragment into unrelated products.

## Core Visual Language and Theme Expression

KKB separates its stable core visual language from its variable theme expression.

### Core visual language

The following should remain consistent across themes by default, especially during the initial development of the system:

- Typography families, roles, scale, and hierarchy
- Radius-none structural geometry, borders, control dimensions, and grid logic
- Spacing and density rhythm
- Component anatomy and interaction behavior
- Phosphor utility icons, custom KKB sigils and symbols, and their distinct semantic roles
- Focus, selection, disabled, loading, success, warning, and error semantics
- Foundational motion language
- Accessibility and reduced-motion requirements

These elements create a recognizable KKB identity regardless of the active theme or color mode.

Structural surfaces and ordinary controls use `radius-none`. Rounded geometry is permitted only when the shape itself communicates identity or mechanical behavior, and only on the functional part that requires it. The approved exceptions are:

- avatars
- badges and chips
- radio indicators
- slider, switch, progress, and scroll tracks and thumbs
- drawer drag handles
- circular knobs, dials, and indicators whose mechanical model is inherently round

These exceptions do not authorize rounded containers, fields, ordinary buttons, menu items, overlays, or decorative softening. Any new shared exception must pass the same functional test and be added to this list before adoption.

### Theme expression

Themes should primarily change the atmosphere of KKB rather than redesign its structure. Theme-level variation may include:

- Complete light and dark color palettes
- Surface tones, borders, contrast, and material character
- Data-visualization and domain-specific palettes
- Procedural textures and atmospheric treatments
- Shader color ramps, noise, glow, persistence, and compositing parameters
- Subtle motion differences such as ambient intensity or easing character
- Restrained shifts in warmth, sharpness, depth, and energy

A theme should feel like a different atmosphere within the same product and component system. The initial foundation deliberately limits atmosphere to one curated light/dark pair; additional theme worlds remain future work.

Typography, geometry, or symbology may eventually vary in explicitly experimental themes, but these are exceptions rather than ordinary theme behavior.

## Universal Light and Dark Modes

Light and dark modes are universal capabilities of the KKB design system, not properties assigned to particular kinds of surfaces.

- Every KKB theme should provide complete light and dark modes.
- Light and dark modes should be deliberately curated counterparts, not mechanical inversions.
- Reports, tools, editorial pages, instrument surfaces, and immersive experiences should all be able to use either mode.
- Surface purpose and color mode are independent axes: an operational, editorial, expressive, instrument-like, or immersive surface can be light or dark.
- Components should consume semantic roles rather than theme-specific color values.
- Dynamic media should define light, dark, reduced-motion, meaningful static, responsive, and accessible representations.

A useful model is:

> **KKB identity = stable visual language + selectable atmosphere + surface-specific composition**

## Design-System Layers

The KKB design system can be understood as a set of related layers:

1. **Semantic foundation** — paired light/dark color roles, typography, spacing, borders, elevation, focus, state, accessibility, and motion contracts.
2. **Shared primitives** — theme-aware buttons, fields, panels, navigation, overlays, typography, and other reusable `@kkb/ui` building blocks.
3. **Composition systems** — indexes, report layouts, instrument shells, figure frames, provenance rails, catalogs, and other recurring arrangements.
4. **Dynamic media systems** — audio-reactive interfaces, shaders, WebGPU, Three.js, generative graphics, and their static or reduced-motion representations.
5. **Symbolic identity** — Phosphor provides the initial utility-icon vocabulary; custom KKB sigils, diagrams, glyph systems, and technical marks remain a separate identity layer.
6. **Theme worlds** — distinct visual atmospheres built on the shared semantic and component contracts, each with intentionally designed light and dark modes.

## Working Principles for `@kkb/ui`

- Shared components should consume semantic tokens and remain unaware of specific theme names.
- Theme switching should not move controls, change component APIs, replace symbols, or materially alter information hierarchy.
- Compact visible controls may use larger invisible hit regions to preserve the visual language while meeting accessibility requirements.
- Dynamic visuals must define light, dark, reduced-motion, meaningful static, responsive, and accessible representations rather than merely disappearing or relying on one mode.
- Complex visualizations need responsive reflow, a summarized mobile form, a stacked representation, or an explicitly labeled local scroller; they must not widen the page.
- Shared figure, metric, provenance, status, symbol, and visualization patterns should live in `@kkb/ui` when their contracts are reusable.
- Current neutral-first colors and domain-specific accent rules should be understood as properties of the initial theme unless intentionally elevated into system-wide semantic contracts.
- Generic success and warning states use paired semantic fill/foreground roles in both modes; visible copy or iconography carries meaning alongside color.
- Overlay components use the semantic scrim role rather than embedding atmosphere-specific black values.
- The foundation should constrain semantics, interaction quality, and coherence while leaving substantial room for future visual exploration.

## Ratified Initial Foundation

- Phosphor is the initial utility-icon foundation. It is distinct from future custom KKB sigils, symbols, diagrams, and identity marks.
- Full migration of shared primitives from Radix UI to Base UI is approved near-term work. The existing Base UI Combobox is the current foothold, not a reason to defer the broader migration.
- The radius-none contract and approved Base UI sequence supersede the earlier subtle 1–3px structural-radius direction and the earlier plan to evaluate primitive migration only after composition work. Dated reports and plans remain historical records rather than current authority.
- JSON-render remains an experimental repository capability but is outside the active design-system roadmap.

## Current Implementation and Roadmap Status

> Snapshot recorded 2026-07-30 before #73 implementation began. This section captures implementation and sequencing evidence at that point in time; the design contracts above remain authoritative if repository status changes.

### Foundation state

- `main` was clean and synchronized with `origin/main` at `efbcd35` (`feat(ui): implement initial theme contract (#72)`), with no open pull requests.
- The latest CI run passed type checking, tests, and Biome checks.
- Recent work established the product and design direction, hardened accessibility, cleared repository lint diagnostics, ratified the initial foundation through #71, and implemented its shared theme contract through #72.
- The shared foundation now demonstrates radius-none structural geometry, paired semantic light and dark roles, documented functional rounding exceptions, semantic status foregrounds, overlay scrims, and an expanded `/ui` acceptance surface.
- The foundation is implemented, but the broader migration is not complete. The snapshot contained 34 Radix-importing source files, 35 Lucide-importing source files, one Base UI consumer, and no Phosphor imports.

### Known follow-up concerns

- `DESIGN.md` still contains obsolete implementation-status prose assigning radius and Card work to the now-closed #72. That generated design record should be corrected when it is next synchronized.
- CI does not currently run production builds. A manual `bun run build` passed during this review, but build regressions are not CI-visible.
- Desktop and mobile browser verification for #72 is recorded in the issue acceptance criteria, but the repository does not retain a durable browser artifact or automated supported-route matrix for that verification.
- #77 spans most shared primitives and is the highest-risk foundation migration. It should proceed in bounded batches that preserve tests, type checks, production builds, formatting, and representative browser behavior after each batch.
- #82 describes documentation elements such as code, tables, and callouts that the current lightweight docs shell does not yet contain. Those criteria should remain conditional on existing content unless introducing those elements is explicitly brought into scope.
- The current `#78 → #79 → #80` route-adoption sequence may be more serialized than necessary. After #78 proves the shared route pattern, #79 and #80 could potentially proceed independently, while #80 remains separately blocked by #37.

### Recommended near-term sequence

1. Complete #73 first. It is the sole unblocked root of the active design-system roadmap and establishes reusable Phosphor conventions before the Base UI migration.
2. Before #77, make production-build evidence part of the migration safety contract, either through CI or an explicitly recorded per-batch validation requirement.
3. #37 may proceed independently alongside #73. It corrects the audio seek surface and clears a later blocker for #80 without expanding the design-system foundation scope.
4. Complete #77 in bounded primitive batches, then complete the residual Phosphor migration in #74 before beginning broad composition or route adoption.
5. After #74, #75 and #82 can proceed independently. After #75, #76 and #83 can proceed independently. Route-level adoption follows those shared composition proofs, with #78 as the first complete route.
6. Before final adoption and acceptance work, enumerate the supported route matrix explicitly. `/json-render` remains outside this roadmap.

## Utility Icon Conventions

Phosphor is the shared utility-icon vocabulary. The #73 acceptance slice applies it to the top-level `/ui` workbench navigation, search, and mode glyphs while Lucide remains temporarily available inside unmigrated primitives, components, and routes.

- Use the regular Phosphor weight by default. Bold or fill weights are reserved for cases where increased emphasis or a filled state has semantic value, and weight must never be the only state signal.
- Use 16px icons in ordinary buttons, fields, compact navigation, and inline actions; 12px icons for subordinate separators or dense metadata; and 20px icons for roomier catalog, search, or standalone utility contexts. Larger sizes require an explicitly illustrative or instrument-specific role.
- Keep icons optically centered in a square box and aligned by their container. Do not use negative margins, arbitrary stroke overrides, or per-icon transforms to force alignment. Button and component sizing rules should own icon dimensions where available.
- Icons inherit `currentColor` from semantic foreground roles. Domain colors are allowed only when the icon communicates that domain; interaction, selection, success, warning, and error meaning must not rely on icon color alone. Light and dark modes preserve the same glyph, size, and weight.
- Icon-only controls require an accessible name on the interactive element and a visible focus treatment. Icons that accompany visible copy, repeat a parent label, separate metadata, or otherwise add no independent meaning are explicitly hidden from assistive technology.
- Familiar utility icons and future KKB sigils remain separate vocabularies. Do not replace a conventional action or navigation symbol with an identity mark unless the new symbol has a documented, learnable semantic role.
- During the staged migration, new or migrated acceptance-surface icons use Phosphor while untouched Lucide consumers remain stable. #74 owns the residual monorepo sweep and removal of Lucide.

## Inspiration

- [Stencil](https://stencil.so/)
  - [Blog — Stencil](https://stencil.so/blog)
    - [You only need the frontier model for one single edit — Stencil](https://stencil.so/blog/prewalk)
    - [Snapcompact: SoTA compaction — instant, local, free. Pick 3 — Stencil](https://stencil.so/blog/snapcompact)
    - [We improved 15 LLMs at coding in one afternoon. Only the harness changed. — Stencil](https://stencil.so/blog/the-harness-problem)
- [Notebook — Tom](https://monotykamary.com/blog/)
  - [I gave Pi one tool — Tom](https://monotykamary.com/posts/i-gave-pi-one-tool/)

I absolutely love the designs, styles, and overall aesthetics of the sites (and their pages) linked above; these are actually super in-line with my vision for the initial `kkb` design system and for its styles across the `@kkb/ui` component library (and the `kkb` monorepo in general).

Specific aspects that I love:
- The colors, typography, sizes/scale, and spacing
- The graphics (especially the Stencil home page art)
- The diagrams, graphs, and interactive elements

## Inspiration Review Synthesis

The most valuable lessons from the inspiration are structural rather than dependent on their current dark appearance.

### Stencil

- The home page shows how procedural media can become part of a visual identity without relying on a conventional marketing hero.
- The blog index demonstrates a dense, flat, ruled alternative to repetitive card grids.
- The Prewalk article demonstrates a strong editorial rhythm: claim, headline metrics, purpose-built evidence, interpretation, and methodology.
- The Snapcompact article demonstrates coordinated interactive figures in which controls update plots, specimens, and telemetry together.
- The harness article provides a particularly strong experiment-report structure: result, key deltas, interactive comparison, mechanism, methodology, and implications.

### Tom's Notebook

- The notebook index treats technical work as a maintained object with epistemic status such as “still testing,” “not sure yet,” and “settled, for now.”
- Revision dates and source locations connect editorial work to its implementation and history.
- The long-form article uses a consistent figure anatomy, a reading column with provenance context, and diagram forms chosen for the information being explained.
- Its motion is explanatory rather than decorative and resolves to meaningful static states when reduced motion is requested.

### Lessons to carry forward

- Transfer the role separation, evidence hierarchy, spacing, rails, and diagram craft rather than copying exact fonts or palettes.
- Use color sparingly until it communicates state, data, or domain meaning.
- Let borders, spacing, and tonal contrast establish hierarchy before shadows.
- Treat diagrams as part of the argument, not as decorative dashboard widgets.
- Structure experiments as a testable story: thesis, measurements, visualization, interpretation, and implementation artifact.
- Preserve provenance through status, revision information, package or repository ownership, and links to relevant artifacts.
- Use expressive procedural media without allowing it to replace navigation, product meaning, or accessibility.

The reference implementations also expose problems KKB should avoid:

- Low-contrast metadata and visualization microcopy
- Desktop figures and tables that widen or clip the mobile document
- Horizontal scroll regions without clear affordances or keyboard access
- Selection conveyed only through color or without semantic pressed state
- Hover-only data exploration
- Touch targets that are visually compact and physically undersized
- Canvas or shader content without accessible alternatives
