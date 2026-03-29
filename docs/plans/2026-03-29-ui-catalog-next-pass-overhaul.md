# `/ui` Catalog Next Pass Overhaul Plan

## Status
- Planning document only.
- No implementation work has been done in this pass.
- This plan supersedes the earlier scaffold/demo-island delivery plans as the guide for the next major `/ui` redesign pass.

## Why this pass exists
The current `/ui` route works as an internal verification surface, but it still reads more like a polished component dump than a deliberate showcase. The critique found three primary gaps:

1. **Information architecture overload** — too many cards and choices are visible at once, with weak progressive disclosure.
2. **Generic visual read** — the route still feels too close to a default shadcn catalog.
3. **Internal-facing copy** — labels and descriptions explain implementation details more than user value.

The next pass should turn `/ui` into a route that still supports internal QA, but also starts earning credibility as an eventual external-facing showcase.

## User-approved direction

### Audience
- **Primary now:** internal dev/design collaborators
- **Secondary later:** external evaluators of `@kkb/ui`

### Route purpose
- Slightly verification-first, but **mostly showcase-first**

### Intended tone
- **Utilitarian + polished**
- Quiet, rigorous, trustworthy
- Not flashy, not enterprise-admin bland, not a generic starter-template demo

### Explicit anti-goals
- Do **not** make it feel like a generic shadcn demo
- Do **not** make it feel like an enterprise admin dashboard

### Audio direction for this pass
- **Leave the current audio component styling alone for now**
- The WinAmp-inspired silver/blue theme stays intact in this overhaul
- Future work can introduce multiple audio themes, including a default `@kkb/ui`-native audio theme, but that is **out of scope for this pass**

## Goal
Redesign `http://localhost:3000/ui` from a long, repetitive catalog into a curated, lower-cognitive-load reference route that:
- communicates how to use the page within the first viewport,
- highlights the strongest and most representative patterns first,
- preserves internal verification value,
- differentiates the route from starter-template UI galleries,
- and becomes a stronger foundation for future external sharing.

## Non-goals
- Re-theme the audio UI
- Build a public docs site around the catalog
- Cover every export in `@kkb/ui`
- Add a full playground/configurator for every component
- Rewrite unrelated app routes
- Build the future multi-theme audio system in this same pass

## Success criteria
The pass is successful when:
- A new viewer can understand what `/ui` is for within **5 seconds**
- The first screen gives a clear **start point** and a visible explanation of the route’s purpose
- The route no longer feels like a uniform wall of equal-weight cards
- The page can be scanned section-by-section without feeling overloaded
- Card and section copy explain **what a pattern is for**, not just how it is wired
- Mobile usage feels intentionally adapted rather than desktop content merely stacked
- The current audio demos still render correctly without visual regression

## Recommended command sequence
These are the critique-driven commands for the later implementation pass, in the order that matches the chosen priorities:

1. **`/distill`** — reduce cognitive load, introduce progressive disclosure, and curate what appears first
2. **`/arrange`** — break the repetitive grid and strengthen hierarchy/composition
3. **`/clarify`** — rewrite route, section, and card copy in plain, premium, user-facing language
4. **`/normalize`** — tighten visual cohesion across the non-audio catalog shell while leaving audio styling intact
5. **`/adapt`** — make the mobile route feel intentionally designed for scanning and interruption
6. **`/polish`** — final consistency, spacing, hierarchy, and micro-detail pass

## Chosen overhaul approach
Use a **curated reference-surface** approach rather than an exhaustive gallery or a flashy marketing page.

### Core idea
The route should feel like a thoughtful internal design review surface:
- clear purpose,
- strong prioritization,
- selected examples first,
- deeper inventory only when needed.

### Structural shift
Move from:
- long header
- eight sections
- many equal-weight cards

To:
- purposeful intro/header
- quick orientation / “start here” guidance
- featured patterns or highlights near the top
- full catalog sections below with progressive disclosure
- clearer labeling of interactive vs static vs composition-level examples

## Proposed information architecture

### 1. Intro / Route framing
The first viewport should answer:
- what this route is,
- who it is for,
- how to use it,
- what to inspect first.

Add concise support content such as:
- one-sentence route purpose
- small usage hint (browse by section, inspect featured patterns first, use filters/jump links)
- optional lightweight summary chips (for example: `Primitives`, `Interactive`, `Composition`, `Audio`)

### 2. Featured patterns block
Before the full catalog, show a small set of high-value representatives.
This should not be a KPI dashboard or hero-metrics layout.
It should be a **curated preview** of the strongest patterns on the route.

Likely candidates:
- one layout/system card
- one input or navigation pattern
- one richer interactive demo
- the audio composition demo

Purpose:
- establish taste early
- reduce first-scroll ambiguity
- guide viewers toward what matters most

### 3. Full catalog with progressive disclosure
Keep the section structure, but reduce the amount of same-weight content visible at once.

Per section:
- show a short section intro that explains the role of the section
- surface the 1–3 most useful cards first
- move secondary examples behind a local disclosure pattern when appropriate
- avoid identical “header + equal card grid” treatment for every section

### 4. Better section navigation
The nav should support both:
- browsing for first-timers
- quick jumping for repeat internal users

Candidate improvements:
- keep the left rail on desktop
- make the top of the route more obviously navigable
- add lightweight filtering or quick-jump affordances if they help without bloating the UI
- expose current location and section purpose more clearly

## Visual direction
The route should feel **designed, not decorated**.

### Keep
- calm neutral base
- restrained use of borders and surfaces
- strong readability
- the audio section’s current bespoke styling

### Change
- reduce the “every card gets the same treatment” rhythm
- create stronger top-of-page hierarchy
- allow a few larger, more editorial layout moments
- reduce the starter-template feel of repeated rounded boxes and uniform spacing
- make the route shell feel like a curated product surface rather than a generated inventory

### Do not do
- gradient-text hero gimmicks
- decorative glassmorphism
- generic metrics dashboard blocks
- arbitrary neon/dark-mode spectacle
- over-branding that fights the utilitarian goal

## Copy direction
Rewrite copy so it explains **purpose and usage**, not implementation details.

### Current copy problems
Examples of wording to remove or reduce:
- “verification route”
- “isolated demo islands”
- “server-owned”
- “live app wiring”

### Desired copy qualities
- plain-language
- concise
- useful to both internal and future external viewers
- slightly premium, not marketing-heavy
- focused on when/why to use a pattern

### Content model to introduce
Each card/section should be able to communicate some combination of:
- what it is
- when to use it
- whether it is static, interactive, or composition-level
- whether it is core, advanced, or specialized

This can be handled through consistent badges, metadata labels, or concise helper text.

## Mobile direction
Mobile should not merely be the desktop route stacked vertically.

Key improvements:
- make first-screen orientation more immediate
- reduce the burden of a long horizontal chip row with weak context
- keep primary browsing actions close to the top and easy to revisit
- consider more aggressive progressive disclosure on mobile than desktop
- ensure dense demo cards remain legible and worth scrolling into

## Accessibility and usability requirements
- Maintain visible focus states and keyboard access across all interactive demos
- Ensure anchor navigation remains usable with sticky chrome offsets
- Do not make meaning depend on color alone
- Preserve readable contrast in both themes
- Avoid introducing interactions that require hover-only understanding
- Make section structure and headings more screen-reader legible where practical

## Technical constraints
- Keep the route **RSC-first** where practical
- Keep client islands narrow and explicit
- Do not add route-wide client state without a clear usability benefit
- Prefer small compositional components over giant metadata blobs
- Avoid turning the overhaul into a full data-model rewrite of the catalog unless needed to support curation/filtering

## File map for the overhaul

### Likely files to modify
- `apps/web/app/ui/page.tsx`
- `apps/web/components/ui-catalog/catalog-nav.tsx`
- `apps/web/components/ui-catalog/component-card.tsx`
- `apps/web/components/ui-catalog/section.tsx`
- `apps/web/components/ui-catalog/sections/layout-section.tsx`
- `apps/web/components/ui-catalog/sections/navigation-section.tsx`
- `apps/web/components/ui-catalog/sections/input-section.tsx`
- `apps/web/components/ui-catalog/sections/feedback-section.tsx`
- `apps/web/components/ui-catalog/sections/overlay-section.tsx`
- `apps/web/components/ui-catalog/sections/menu-section.tsx`
- `apps/web/components/ui-catalog/sections/data-section.tsx`
- `apps/web/components/ui-catalog/sections/audio-section.tsx` *(structure/copy only; no audio visual restyle)*
- `apps/web/app/ui/__tests__/page.test.tsx`
- `apps/web/app/ui/__tests__/interactive-demos.test.tsx`

### Likely new files
The exact split can change during implementation, but likely additions include:
- `apps/web/components/ui-catalog/catalog-hero.tsx`
- `apps/web/components/ui-catalog/catalog-overview.tsx`
- `apps/web/components/ui-catalog/section-intro.tsx`
- `apps/web/components/ui-catalog/featured-patterns.tsx`
- `apps/web/components/ui-catalog/catalog-meta.ts` *(if a shared content model becomes useful)*

## Workstreams

### Workstream 1: Reframe the route at the top level
**Objective:** Make the first screen explain the route and reduce ambiguity.

Deliverables:
- clearer page title + supporting copy
- explicit “start here” framing
- stronger header composition
- featured-patterns area or equivalent curated top section

Primary files:
- `apps/web/app/ui/page.tsx`
- new top-level helper components under `apps/web/components/ui-catalog/`

### Workstream 2: Introduce progressive disclosure
**Objective:** Reduce cognitive load without losing useful coverage.

Deliverables:
- section-level prioritization of examples
- selective hiding/collapsing of secondary cards where it improves scanning
- fewer equal-weight decisions at each scroll point

Primary files:
- `apps/web/components/ui-catalog/section.tsx`
- section files under `apps/web/components/ui-catalog/sections/*`

### Workstream 3: Break the repeated card-grid rhythm
**Objective:** Remove the template feel while staying calm and utilitarian.

Deliverables:
- featured cards or varied spans where justified
- stronger hierarchy between section intros and demo surfaces
- fewer nested-card moments where they add noise instead of clarity
- more intentional spacing rhythm across the route

Primary files:
- `component-card.tsx`
- `section.tsx`
- affected section files

### Workstream 4: Rewrite the copy system
**Objective:** Make the route understandable to first-timers and more credible to external viewers.

Deliverables:
- revised route subtitle
- revised section descriptions
- revised card titles/descriptions where needed
- consistent badge/metadata language

Primary files:
- `apps/web/app/ui/page.tsx`
- section files
- possibly shared metadata files if introduced

### Workstream 5: Improve navigation and internal efficiency
**Objective:** Preserve internal usefulness while supporting the new curated structure.

Deliverables:
- stronger active-section behavior/context
- refined left-rail and mobile nav behavior
- optional lightweight filter/search only if it clearly reduces friction without bloating the route

Primary files:
- `catalog-nav.tsx`
- `page.tsx`
- optional new metadata/filter helpers

### Workstream 6: Mobile adaptation
**Objective:** Make mobile feel intentionally adapted.

Deliverables:
- improved first-screen hierarchy on mobile
- more selective disclosure on smaller screens
- reduced horizontal-nav burden where possible
- cleaner vertical rhythm for dense demo cards

Primary files:
- `page.tsx`
- `catalog-nav.tsx`
- `section.tsx`
- section files

### Workstream 7: Verification and regression coverage
**Objective:** Keep the overhaul safe.

Deliverables:
- updated server-render tests for the new structure and key copy
- updated interaction tests where navigation/disclosure changes touch behavior
- manual browser QA on desktop and mobile
- light and dark theme sanity checks

Primary files:
- `apps/web/app/ui/__tests__/page.test.tsx`
- `apps/web/app/ui/__tests__/interactive-demos.test.tsx`

## Suggested implementation phases

### Phase 0 — Baseline and inventory
Before changing layout:
- capture screenshots of current desktop/mobile/light/dark states
- list which cards are “featured”, “secondary”, and “specialized”
- identify any cards that can be removed, merged, or deferred without losing value

### Phase 1 — Top-level shell and content model
- update `page.tsx` structure
- establish new page-level intro/overview/featured areas
- define any shared metadata needed for section ordering, featured status, or labels

### Phase 2 — Section restructuring
- refactor section wrappers and card layout rules
- prioritize section content
- add progressive disclosure patterns where they improve scanability

### Phase 3 — Copy rewrite
- rewrite route, section, and card text
- normalize badge and metadata language
- remove implementation-jargon phrasing

### Phase 4 — Navigation and mobile refinement
- improve rail/top-nav behavior
- add any lightweight quick-jump/filter support if justified
- tighten mobile adaptation

### Phase 5 — QA and polish
- test updates
- browser QA
- light/dark comparison
- final spacing, typography, and alignment pass

## Granular implementation checklist

This checklist is intended for the later overhaul session. It is more implementation-oriented than the planning sections above, but still scoped to this single redesign pass.

### Phase 0 — Baseline and inventory
- [ ] Capture current screenshots for `desktop/light`, `desktop/dark`, `mobile/light`, and `mobile/audio`
- [ ] Save those screenshots in a temp review folder for side-by-side comparison during the overhaul
- [ ] Review `apps/web/app/ui/page.tsx` and list every current section in render order
- [ ] Review each file under `apps/web/components/ui-catalog/sections/*` and inventory current card titles/descriptions
- [ ] Mark each current card as `featured`, `secondary`, or `specialized`
- [ ] Identify cards that can be merged without losing verification value
- [ ] Identify cards that can be hidden behind progressive disclosure without hurting internal QA
- [ ] Confirm that audio cards remain in scope structurally but **not** for visual restyling
- [ ] Review `apps/web/app/ui/__tests__/page.test.tsx` and note which assertions will break after restructuring
- [ ] Review `apps/web/app/ui/__tests__/interactive-demos.test.tsx` and note any nav/disclosure behavior that will need new coverage

### Phase 1 — Top-level shell and route framing
**Primary files:**
- `apps/web/app/ui/page.tsx`
- `apps/web/components/ui-catalog/catalog-hero.tsx` *(new, likely)*
- `apps/web/components/ui-catalog/catalog-overview.tsx` *(new, likely)*
- `apps/web/components/ui-catalog/featured-patterns.tsx` *(new, likely)*
- `apps/web/components/ui-catalog/catalog-meta.ts` *(new, optional)*

- [ ] Decide whether shared route metadata should stay inline in `page.tsx` or move into `catalog-meta.ts`
- [ ] Refactor section metadata so it can support labels like `featured`, `interactive`, `core`, or `specialized` if needed
- [ ] Rewrite the page header content so the route purpose is understandable within the first viewport
- [ ] Add a short “start here” explanation that tells users how to browse the page
- [ ] Add a lightweight overview block or summary chips that explain the catalog at a glance
- [ ] Add a featured-patterns area above the full catalog
- [ ] Choose the featured patterns to surface first (at minimum one system/layout example, one richer interactive example, and the audio composition demo)
- [ ] Make sure the featured area avoids hero-metric/dashboard patterns
- [ ] Keep `ModeToggle` in the chrome, but integrate it more intentionally into the header composition
- [ ] Verify the first viewport now has a clear primary reading order on desktop
- [ ] Verify the first viewport now has a clear primary reading order on mobile

### Phase 2 — Section restructuring and progressive disclosure
**Primary files:**
- `apps/web/components/ui-catalog/section.tsx`
- `apps/web/components/ui-catalog/component-card.tsx`
- `apps/web/components/ui-catalog/sections/layout-section.tsx`
- `apps/web/components/ui-catalog/sections/navigation-section.tsx`
- `apps/web/components/ui-catalog/sections/input-section.tsx`
- `apps/web/components/ui-catalog/sections/feedback-section.tsx`
- `apps/web/components/ui-catalog/sections/overlay-section.tsx`
- `apps/web/components/ui-catalog/sections/menu-section.tsx`
- `apps/web/components/ui-catalog/sections/data-section.tsx`
- `apps/web/components/ui-catalog/sections/audio-section.tsx`

- [ ] Update `section.tsx` so it can support a richer section intro treatment than heading + count + paragraph alone
- [ ] Decide whether section-level disclosure belongs in `section.tsx` or in each section file explicitly
- [ ] For each section, choose the 1–3 cards that should remain visible by default
- [ ] For each section, identify which cards move into secondary/disclosed content
- [ ] Ensure any hidden secondary content still remains reachable without harming discoverability
- [ ] Reduce the number of equally weighted cards visible in the first two scrolls of the page
- [ ] Introduce at least one stronger “featured” card treatment outside the current uniform grid rhythm
- [ ] Revisit `md:col-span-2`/layout-span patterns so emphasis feels intentional rather than incidental
- [ ] Remove or simplify nested-card structures where the nesting adds noise but not meaning
- [ ] Keep internal verification value by preserving representative states even if some are initially collapsed
- [ ] Keep the audio section structurally present and clearly contextualized, but do not restyle its demos

### Phase 3 — Copy rewrite and metadata language
**Primary files:**
- `apps/web/app/ui/page.tsx`
- `apps/web/components/ui-catalog/sections/*`
- `apps/web/components/ui-catalog/catalog-meta.ts` *(if added)*

- [ ] Rewrite the route subtitle to describe the route in user-facing language
- [ ] Remove or replace implementation-heavy phrases like `verification route`, `isolated demo islands`, `server-owned`, and `live app wiring`
- [ ] Rewrite each section description so it explains the section’s role, not just the component category
- [ ] Review every card title for clarity, scannability, and consistency
- [ ] Rewrite card descriptions so they answer “what is this for?” rather than “how is this implemented?”
- [ ] Introduce a consistent metadata vocabulary for labels such as `core`, `interactive`, `static`, `composition`, or `specialized` if those labels are used
- [ ] Make sure badge language is comprehensible to future external viewers, not just current internal contributors
- [ ] Keep the tone utilitarian and polished rather than marketing-heavy or tutorial-heavy
- [ ] Re-read the first screen and confirm it no longer assumes insider context

### Phase 4 — Navigation and internal efficiency improvements
**Primary files:**
- `apps/web/components/ui-catalog/catalog-nav.tsx`
- `apps/web/app/ui/page.tsx`
- optional new helpers under `apps/web/components/ui-catalog/`

- [ ] Review whether the current left rail still works once the page has a featured top section
- [ ] Update the desktop nav so it reflects the new page structure clearly
- [ ] Update the mobile nav so it feels like purposeful guidance rather than a long chip row with weak context
- [ ] Ensure active-section behavior still works with any newly inserted top-of-page content
- [ ] Verify anchor behavior still lands correctly with sticky offsets after layout changes
- [ ] Decide whether a lightweight filter or quick-jump affordance is warranted
- [ ] If adding a filter or quick-jump affordance, keep it narrow and avoid route-wide complexity
- [ ] Preserve a fast browsing path for repeat internal users
- [ ] Avoid adding any navigation pattern that creates new cognitive load just to solve old cognitive load

### Phase 5 — Mobile adaptation
**Primary files:**
- `apps/web/app/ui/page.tsx`
- `apps/web/components/ui-catalog/catalog-nav.tsx`
- `apps/web/components/ui-catalog/section.tsx`
- section files as needed

- [ ] Re-check the first mobile viewport after the new header/overview lands
- [ ] Reduce above-the-fold friction on mobile before the user reaches the first useful content block
- [ ] Adjust section intros and card spacing for one-column reading rhythm
- [ ] Ensure any disclosure patterns are easier—not harder—to use on mobile
- [ ] Keep important navigation and orientation elements close enough to the top for interrupted usage
- [ ] Confirm that dense demo cards remain legible at mobile widths
- [ ] Confirm that the audio cards still present well on mobile without modification to their theme

### Phase 6 — Test updates and regression coverage
**Primary files:**
- `apps/web/app/ui/__tests__/page.test.tsx`
- `apps/web/app/ui/__tests__/interactive-demos.test.tsx`

- [ ] Update server-render tests to reflect the new route framing and featured-content structure
- [ ] Replace brittle assertions that depended on the old equal-weight section layout
- [ ] Add assertions for the new first-screen copy and orientation content
- [ ] Add assertions for any progressive-disclosure markers or section-level reveal affordances
- [ ] Update interaction tests if nav behavior changes due to the new top-level structure
- [ ] Update interaction tests if any section disclosure introduces new client-side behavior
- [ ] Keep audio interaction coverage intact unless behavior intentionally changes

### Phase 7 — Manual QA and polish pass
- [ ] Open `http://localhost:3000/ui` in desktop light mode and compare against the old screenshots
- [ ] Open `http://localhost:3000/ui` in desktop dark mode and compare against the old screenshots
- [ ] Open `http://localhost:3000/ui` on a mobile viewport and review the first two scrolls specifically
- [ ] Verify the first screen now clearly communicates what the route is for
- [ ] Verify the featured content feels curated rather than promotional
- [ ] Verify each section now has a clearer purpose and less equal-weight clutter
- [ ] Verify keyboard navigation and focus states remain visible across interactive demos
- [ ] Verify disclosure patterns are understandable without hover-only cues
- [ ] Verify the audio section still feels intact and visually unchanged
- [ ] Verify light and dark modes both remain coherent after the shell changes
- [ ] Run route-level browser sanity checks on anchors, active nav state, and any new top-level affordances
- [ ] Perform a final pass on spacing, typography, alignment, and badge consistency

## Acceptance checklist
- [ ] The top of the page explains what `/ui` is for without relying on insider knowledge
- [ ] The route has a stronger “start here” path
- [ ] The first 1–2 scrolls feel curated, not dumped
- [ ] The full catalog remains navigable for internal verification use
- [ ] Section copy is plain-language and more user-centered
- [ ] The audio demos remain visually unchanged aside from any shell/copy/context adjustments
- [ ] Mobile feels intentionally structured
- [ ] Desktop and mobile nav both remain usable
- [ ] Light and dark modes both remain coherent
- [ ] No regression in interactive demo behavior

## Risks
- **Over-correcting into marketing mode** — this would undermine the internal-reference use case
- **Adding too much new UI chrome** — could replace one kind of clutter with another
- **Breaking the RSC/client boundary discipline** — especially if filtering/search becomes over-engineered
- **Making audio feel isolated** — the shell should contextualize it better without restyling it yet

## Deferred follow-up ideas
These are intentionally out of scope for this overhaul, but should not be lost:
- Introduce a formal audio theme system with named themes
- Add a default `@kkb/ui`-native audio theme alongside the WinAmp-inspired theme
- Split internal QA affordances from public showcase affordances if `/ui` later becomes external-facing
- Consider a dedicated docs or guidance route if the catalog grows beyond a single-page reference surface

## Recommended starting point for the future implementation session
Start with **Workstream 1 + Workstream 2** together:
1. Reframe the route at the top level
2. Introduce progressive disclosure

That ordering matches the chosen priority stack:
- first reduce information overload,
- then make the route feel more intentional,
- then refine the voice and details.
