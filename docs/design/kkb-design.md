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
3. **Composition systems** — recurring arrangements such as indexes, report layouts, figure frames, provenance rails, catalogs, and instrument presentation, but only after real consumers demonstrate a stable reusable contract.
4. **Dynamic media systems** — audio-reactive interfaces, shaders, WebGPU, Three.js, generative graphics, and their static or reduced-motion representations.
5. **Symbolic identity** — Phosphor provides the initial utility-icon vocabulary; custom KKB sigils, diagrams, glyph systems, and technical marks remain a separate identity layer.
6. **Theme worlds** — distinct visual atmospheres built on the shared semantic and component contracts, each with intentionally designed light and dark modes.

## Working Principles for `@kkb/ui`

- Shared components should consume semantic tokens and remain unaware of specific theme names.
- Theme switching should not move controls, change component APIs, replace symbols, or materially alter information hierarchy.
- Compact visible controls may use larger invisible hit regions to preserve the visual language while meeting accessibility requirements.
- Dynamic visuals must define light, dark, reduced-motion, meaningful static, responsive, and accessible representations rather than merely disappearing or relying on one mode.
- Complex visualizations need responsive reflow, a summarized mobile form, a stacked representation, or an explicitly labeled local scroller; they must not widen the page.
- Shared figure, metric, provenance, status, symbol, and visualization patterns should live in `@kkb/ui` when real consumers demonstrate reusable component-level contracts.
- Complete route composition, experiment/session behavior, and workshop indexing remain app-owned. Do not manufacture complete experiment or instrument shells solely to populate the `/ui` catalog.
- Current neutral-first colors and domain-specific accent rules should be understood as properties of the initial theme unless intentionally elevated into system-wide semantic contracts.
- Generic success and warning states use paired semantic fill/foreground roles in both modes; visible copy or iconography carries meaning alongside color.
- Overlay components use the semantic scrim role rather than embedding atmosphere-specific black values.
- The foundation should constrain semantics, interaction quality, and coherence while leaving substantial room for future visual exploration.

## Ratified Initial Foundation

- Phosphor is the initial utility-icon foundation. It is distinct from future custom KKB sigils, symbols, diagrams, and identity marks.
- Owned shared primitives use Base UI, with native implementations where Base has no matching primitive. Composition uses Base `render`; retained Radix packages are transitive dependencies of out-of-scope integrations.
- The radius-none contract and approved Base UI sequence supersede the earlier subtle 1–3px structural-radius direction and the earlier plan to evaluate primitive migration only after composition work. Dated reports and plans remain historical records rather than current authority.
- JSON-render remains an experimental repository capability but is outside the active design-system roadmap.
- The web app's `/ui` route is the complete `@kkb/ui` component inventory and visual acceptance workbench. It follows the [shadcn/create Preview and focused-item model](https://ui.shadcn.com/create?preset=b1D0enCq&base=base&item=preview); it is not a docs site, workshop index, or gallery of complete application shells.

## Current Implementation and Roadmap Status

### Foundation state

- The radius-none, paired-mode, semantic-token, scrim, and Phosphor contracts are implemented across the owned shared foundation and application consumers.
- Issue #77 migrated all owned Radix-backed primitives to Base UI or the approved native implementations. Owned source no longer imports the direct `radix-ui` package.
- Issue #74 completed the owned Lucide-to-Phosphor migration and removed direct Lucide declarations from workspace manifests and the root catalog.
- `components.json` uses shadcn's `base-vega` reference metadata because the locked shadcn release does not publish a Base `new-york` registry. This metadata does not apply the Vega preset or replace KKB tokens and presentation.
- Base-specific composition, event details, state attributes, positioning variables, and menu click semantics are reflected in owned consumers.
- Radix remains transitively through `@json-render/shadcn`, `cmdk`, and `vaul`; Lucide remains transitively through `@json-render/shadcn`. Those integrations are outside the active design-system roadmap.
- Issue #86 completes the `/ui` catalog acceptance surface: URL-backed Preview, design-system, category, visual-component, and supporting-export views now have package-surface parity coverage, exhaustive focused specimens, and explicit Preview coverage metadata.
- The catalog registry explicitly separates supported visual components from providers, hooks, presenters, theme constants, and experimental integrations. JSON-render remains searchable but secondary and outside visual inventory acceptance.
- Catalog charts use the shared chart foundation with one named image semantic, no nested keyboard stop, and an equivalent value table. Audio swatches use paired, mode-safe foreground roles.
- Dark destructive roles use a lighter destructive surface/text value with a dark paired foreground so both inline invalid-state text and destructive fills meet WCAG AA.

### Known follow-up concerns

- CI does not currently run production builds, so build evidence remains a manual acceptance requirement.
- `/ui` product metadata remains intentionally curated in one typed registry, while tests derive the supported public component surface from package exports and matching source files to prevent silent inventory drift.
- #82 criteria for documentation elements remain conditional until those elements exist in the docs shell.
- Final route adoption should retain an explicit supported-route matrix; `/json-render` remains outside this roadmap.

### Recommended near-term sequence

1. Continue documentation and route-level adoption independently. Keep complete route composition app-owned, and promote presentation into `@kkb/ui` only after real consumers demonstrate a reusable seam.
2. Keep dynamic-media work bound to the paired-mode, reduced-motion, meaningful-static, accessibility, and no-document-overflow contracts.
3. Preserve the owned-import and direct-dependency boundaries while out-of-scope integrations retain their transitive dependencies.
4. Run the final cross-route design-system acceptance pass through issue #84 after its route-adoption dependencies are complete.

## Utility Icon Conventions

Phosphor is the shared utility-icon vocabulary across owned shared components and application consumers. Issue #73 established the acceptance surface, and #74 completed the remaining owned migration and direct Lucide removal.

- Use the regular Phosphor weight by default. Bold or fill weights are reserved for cases where increased emphasis or a filled state has semantic value, and weight must never be the only state signal.
- Use 16px icons in ordinary buttons, fields, compact navigation, and inline actions; 12px icons for subordinate separators or dense metadata; and 20px icons for roomier catalog, search, or standalone utility contexts. Larger sizes require an explicitly illustrative or instrument-specific role.
- Keep icons optically centered in a square box and aligned by their container. Do not use negative margins, arbitrary stroke overrides, or per-icon transforms to force alignment. Button and component sizing rules should own icon dimensions where available.
- Icons inherit `currentColor` from semantic foreground roles. Domain colors are allowed only when the icon communicates that domain; interaction, selection, success, warning, and error meaning must not rely on icon color alone. Light and dark modes preserve the same glyph, size, and weight.
- Icon-only controls require an accessible name on the interactive element and a visible focus treatment. Icons that accompany visible copy, repeat a parent label, separate metadata, or otherwise add no independent meaning are explicitly hidden from assistive technology.
- Familiar utility icons and future KKB sigils remain separate vocabularies. Do not replace a conventional action or navigation symbol with an identity mark unless the new symbol has a documented, learnable semantic role.
- Owned icon consumers use direct per-icon Phosphor entry points. Transitive Lucide retained by out-of-scope integrations does not define the KKB utility vocabulary.

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
