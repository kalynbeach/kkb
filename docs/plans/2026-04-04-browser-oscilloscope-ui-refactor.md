# Browser Oscilloscope UI Refactor Plan

Date: 2026-04-04  
Status: Proposed next slice  
Latest browser verification: `docs/reports/2026-04-04-oscilloscope-browser-smoke.md`  
Scope: `/oscilloscope` UI/UX refactor only  
Primary targets:
- `apps/web/app/oscilloscope/page.tsx`
- `apps/web/components/oscilloscope/oscilloscope-shell.tsx`
- `apps/web/components/oscilloscope/oscilloscope-controls.tsx`
- optional new focused subcomponents under `apps/web/components/oscilloscope/`

---

## Summary

Refactor `/oscilloscope` so it feels like a polished instrument surface inside the `kkb` design system:

- use `packages/ui/src/components/*` by default
- keep the current green ambient glow
- shift the page from a quick custom control panel to a calm, structured, trustworthy demo surface
- improve clarity, grouping, and source-aware UX
- avoid scope expansion into new oscilloscope features

Given the design context in `.impeccable.md`, the right direction is:

> quiet, premium, engineering-first instrument panel  
> restrained layout, clear hierarchy, crisp controls, minimal decorative noise

---

## Required skills and review workflow

This slice should explicitly use the available project and platform skills during implementation and review.

### Required implementation guidance
- Use the `shadcn` skill when selecting and composing `@kkb/ui` primitives and following `FieldGroup` / `Field` / `Card` composition rules.
- Use `vercel-react-best-practices` while refactoring React components to preserve good client-boundary, render, and bundle patterns.
- Use `vercel-composition-patterns` when splitting `oscilloscope-shell.tsx` and `oscilloscope-controls.tsx` into smaller subcomponents so the result is compositional rather than boolean-prop-heavy.
- Use `next-best-practices` when touching `apps/web/app/oscilloscope/page.tsx` and any App Router boundaries.
- Use `web-design-guidelines` during the final review pass to check the resulting UI against accessibility, hierarchy, interaction, and overall web interface quality expectations.

### Required browser review / verification workflow
- Use the `agent-browser` skill and the `agent-browser` CLI for browser review and verification of `/oscilloscope`.
- Do not rely on code inspection alone for this slice; the page must be reviewed in-browser after the refactor.
- Use `agent-browser` screenshots and annotated screenshots as the source of truth for layout, state handling, and responsive behavior.
- Reuse the existing oscilloscope browser-smoke workflow and extend it as needed for the new UI states.

### Suggested verification coverage for this UI slice
- default oscillator state on `/oscilloscope`
- mic mode active via deterministic fake mic query params
- unsupported-state UI if reproducible in test/dev
- permission-denied and recovery flows where possible
- desktop viewport review
- mobile-width viewport review

---

## Design context alignment

From `.impeccable.md`:

- primary audience: internal dev/design collaborators
- personality: utilitarian, polished, trustworthy
- aesthetic direction: clean, structured, quiet UI with premium restraint
- anti-references: generic demo pages, boilerplate AI component galleries, corporate admin dashboards

This means the oscilloscope page should not become louder, more neon, or more decorative than the renderer itself. The oscilloscope stage can retain the atmospheric green glow, but the surrounding UI should feel more system-native and measured.

---

## Problems to fix

### Current issues
1. Controls are mostly raw HTML primitives.
2. The page hierarchy is weak:
   - stage and controls are separated spatially
   - but not conceptually
3. Source state is unclear:
   - mic and oscillator modes do not strongly reshape the UI
4. Control grouping is too flat:
   - preset, source, signal, and visual settings feel same-level
5. The UI styling is too custom and too ad hoc:
   - not enough leverage from `@kkb/ui`
6. It does not yet feel like a reusable, reviewable product surface.

---

## UX goals

### Primary goals
- make the canvas feel primary
- make the controls feel system-native
- make the current source state obvious
- reduce irrelevant controls in context
- improve scanability and confidence

### Secondary goals
- better mobile and tablet layout
- better unsupported, mic-error, and mic-requesting states
- cleaner semantic structure for tests and future extension

---

## Non-goals

This slice should not include:

- new oscilloscope modes
- renderer tuning beyond tiny support changes required by the UI
- track playback visualization
- deep preset authoring
- URL state / sharing
- advanced animation polish
- expansion of the oscilloscope into `@kkb/ui` as a reusable package surface

This is a page-level UI/UX refactor, not a product-scope expansion.

---

## Recommended information architecture

## Desktop layout
Use a 2-column layout:

### Left: Stage
Primary canvas presentation:
- title
- mode/status badges
- source badge
- canvas card
- live status line or alert under the stage

### Right: Controls
A vertical stack of cards:
1. Source
2. Preset
3. Signal (oscillator-specific)
4. Visual
5. optional later: Advanced

This gives the stage clear priority while making controls easier to scan.

## Mobile layout
Single-column stack:
1. page intro
2. stage card
3. status alert
4. controls cards

If needed later:
- use `Collapsible` for advanced controls on smaller screens

---

## Recommended component mapping

Replace current raw UI with `@kkb/ui` primitives wherever possible.

| Current need | Use from `packages/ui` |
| --- | --- |
| outer surface panels | `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent` |
| preset picker | `Select`, `SelectTrigger`, `SelectContent`, `SelectGroup`, `SelectItem`, `SelectValue` |
| source switch | `ToggleGroup`, `ToggleGroupItem` |
| field layout | `FieldGroup`, `Field`, `FieldLabel`, `FieldDescription`, `FieldContent` |
| frequency inputs | `Input` |
| trail / bloom | `Slider` |
| status / errors | `Alert`, `AlertTitle`, `AlertDescription` |
| small state chips | `Badge` |
| section dividers | `Separator` |
| square canvas framing | `AspectRatio` |
| optional mobile overflow | `ScrollArea` |
| optional advanced section | `Collapsible` |

### Styling rule
Use the design system for:
- structure
- interaction
- typography rhythm
- focus states
- status treatments

Use custom route styling only for:
- page background glow
- oscilloscope-specific stage framing
- subtle phosphor accenting

The green glow should stay. Most controls should stop being bespoke emerald widgets.

---

## Proposed component structure

### Keep as state/runtime owner
- `apps/web/components/oscilloscope/oscilloscope-client.tsx`

This should continue to own:
- state
- runtime lifecycle
- mic provider lifecycle
- preset application behavior

### Refactor heavily
- `apps/web/components/oscilloscope/oscilloscope-shell.tsx`
- `apps/web/components/oscilloscope/oscilloscope-controls.tsx`
- `apps/web/app/oscilloscope/page.tsx`

### Suggested split
At minimum, split stage from controls. A fuller version can introduce:

- `oscilloscope-page-header.tsx`
- `oscilloscope-stage-card.tsx`
- `oscilloscope-status-alert.tsx`
- `oscilloscope-controls.tsx`
- `oscilloscope-source-card.tsx`
- `oscilloscope-preset-card.tsx`
- `oscilloscope-signal-card.tsx`
- `oscilloscope-visual-card.tsx`

A staged implementation can begin with only:
- `oscilloscope-shell.tsx`
- `oscilloscope-controls.tsx`

and extract subcomponents only once the new structure is stable.

---

## Page-level design plan

## A. Page shell
### Current
`page.tsx` is a full-screen background with the client mounted.

### Refactor
Add a restrained page intro above the main grid:
- eyebrow or route label
- title
- one-sentence explanation

Suggested tone:
- calm
- technical
- not marketing-heavy

Example copy direction:
- title: `Browser Oscilloscope`
- description: `WebGPU XY signal explorer for internal oscillator and mic sources.`

Use cards for stage and control groups, but not for the whole page intro.

---

## B. Stage card
This should feel like the product’s centerpiece.

### Structure
- `CardHeader`
  - title: Browser Oscilloscope
  - description: XY mode / live signal geometry
  - action area with badges:
    - mode badge
    - source badge
    - support status badge
- `CardContent`
  - square stage via `AspectRatio`
  - canvas inside a dark framed surface
  - below it: status alert or compact status line

### Visual treatment
Keep:
- dark stage
- green glow around the viewer
- subtle border

Reduce:
- emerald text everywhere
- “all elements are glowing” look

Controls should be calmer than the stage.

---

## C. Status handling
Replace the current plain status line with clearer patterns.

### Supported + oscillators
Compact neutral status:
- `Internal oscillators active`

### Supported + mic requesting
`Alert`:
- title: `Requesting microphone`
- description: `Waiting for browser permission.`

### Supported + mic ready
Subtle success-style info alert or compact info block:
- `Mic input active`

### Supported + mic error
`Alert` with clear surfaced message:
- `Permission denied`
- or the runtime-provided error text

### Unsupported
Use the stage area for the unsupported message and an alert beneath it if needed.

---

## Controls redesign

## Card 1: Source
Purpose: choose what drives the oscilloscope.

Use:
- `Card`
- `ToggleGroup`
- `FieldDescription`

Contents:
- label: Source
- toggle:
  - Oscillators
  - Mic
- short description beneath based on current source

Examples:
- Oscillators: `Use the built-in dual oscillator for stable XY figures.`
- Mic: `Use live or fake mic input through an analyser-backed signal path.`

## Card 2: Preset
Purpose: quick visual starting points.

Use:
- `Card`
- `Field`
- `Select`

Contents:
- preset select
- helper text:
  - `Presets update oscillator and visual settings while preserving the active source.`

That helper text matters because it matches current branch behavior.

## Card 3: Signal
Purpose: only show relevant signal controls.

### When source = oscillators
Show:
- A frequency
- B frequency

Use:
- `FieldGroup`
- `Field`
- `Input`

### When source = mic
Hide this card entirely, or replace it with a small informational block:
- `Signal settings are driven by live mic input.`

Recommended default:
- hide oscillator controls in mic mode rather than showing a disabled form

## Card 4: Visual
Show:
- Trail length
- Bloom

Use:
- `FieldGroup`
- `Slider`
- visible numeric value labels

Important UX improvement:
- show numeric/current values beside sliders
- do not rely on slider position alone

Example labels:
- Trail — `64`
- Bloom — `0.75`

---

## Progressive disclosure decisions

## For the first pass
Keep the control surface intentionally small.

Visible by default:
- Source
- Preset
- Signal or input-state card
- Visual

## Defer
- waveform type
- phase
- detune
- quality / background
- grid / HUD toggles

These can be introduced later in an `Advanced` `Collapsible` section.

This keeps the page intentional instead of reading like a dump of everything configurable.

---

## Visual styling guidance

## Keep
- page radial background glow
- dark oscilloscope stage
- subtle phosphor feel

## Change
- move most text/states to semantic design-system tones
- reduce heavy emerald usage in controls
- reserve green accent primarily for:
  - stage
  - status emphasis
  - active source/mode badge
  - small highlights

## Desired feel
- viewer = atmospheric
- controls = calm and precise

That contrast should improve the page substantially.

---

## File-by-file implementation plan

## `apps/web/app/oscilloscope/page.tsx`
Refactor into:
- page background
- intro/header block
- container with more deliberate width and spacing

### Likely changes
- add a small intro section above the main oscilloscope surface
- constrain content width more intentionally
- ensure the stage/control grid has enough breathing room

## `apps/web/components/oscilloscope/oscilloscope-shell.tsx`
Refactor heavily:
- split stage from controls
- use `Card`, `Badge`, `Alert`, `AspectRatio`
- move status handling into clearer UI patterns

### Likely responsibilities after refactor
- compose the main stage card
- render status messaging beneath or within stage context
- place controls in a companion column

## `apps/web/components/oscilloscope/oscilloscope-controls.tsx`
Rewrite around:
- `FieldGroup`
- `Field`
- `Select`
- `ToggleGroup`
- `Input`
- `Slider`
- `Separator`

### Likely responsibilities after refactor
- group controls by intent, not by raw implementation
- render source-aware sections
- expose numeric labels for slider values

## Optional new files
As needed during refactor:
- `oscilloscope-stage-card.tsx`
- `oscilloscope-status-alert.tsx`
- `oscilloscope-source-card.tsx`
- `oscilloscope-preset-card.tsx`
- `oscilloscope-signal-card.tsx`
- `oscilloscope-visual-card.tsx`

---

## Concrete execution plan

The execution plan below is intended to be followed in order. It is biased toward preserving runtime behavior while improving the page surface.

## Phase 0 — baseline capture and scope lock

### Goals
- lock the scope to UI/UX only
- confirm current behavior to avoid accidental regressions

### Tasks
- [ ] Re-read current oscilloscope UI files:
  - `apps/web/app/oscilloscope/page.tsx`
  - `apps/web/components/oscilloscope/oscilloscope-shell.tsx`
  - `apps/web/components/oscilloscope/oscilloscope-controls.tsx`
- [ ] Reconfirm the available `@kkb/ui` primitives that should be used:
  - `card`
  - `select`
  - `toggle-group`
  - `field`
  - `input`
  - `slider`
  - `alert`
  - `badge`
  - `separator`
  - `aspect-ratio`
  - optional `scroll-area` / `collapsible`
- [ ] Keep runtime behavior unchanged:
  - preset switching still preserves active source
  - mic attach/detach behavior remains unchanged
  - unsupported and startup-failure fallback still render correctly
- [ ] Decide before implementation:
  - hide oscillator controls in mic mode
  - do not add advanced controls in this pass

### Acceptance
- clear scope lock: this is a UI/UX refactor, not a feature pass

---

## Phase 1 — page shell and hierarchy

### Files
- `apps/web/app/oscilloscope/page.tsx`
- `apps/web/components/oscilloscope/oscilloscope-shell.tsx`

### Tasks
- [ ] Add a restrained page intro above the oscilloscope surface
- [ ] Improve page spacing and container width
- [ ] Preserve the current radial glow background
- [ ] Make the stage the clear visual anchor
- [ ] Ensure the layout stacks cleanly on mobile and splits into stage + controls on larger screens

### Implementation notes
- intro should not become a hero section
- keep copy concise and technical
- left align text; avoid centered landing-page composition

### Acceptance
- stage reads as primary
- page feels intentionally composed, not like a bare route wrapper

---

## Phase 2 — stage card redesign

### Files
- `apps/web/components/oscilloscope/oscilloscope-shell.tsx`
- optionally `apps/web/components/oscilloscope/oscilloscope-stage-card.tsx`

### Tasks
- [ ] Replace the custom stage wrapper with a `Card`
- [ ] Use `CardHeader`, `CardTitle`, `CardDescription`, and `CardContent`
- [ ] Add compact status badges for:
  - mode
  - source
  - support state
- [ ] Wrap the canvas in `AspectRatio`
- [ ] Keep a dark stage surface with subtle green ambient framing
- [ ] Improve the unsupported-state presentation inside the stage

### Implementation notes
- use semantic badge variants rather than custom badge-like spans
- keep the stage visually richer than the controls
- avoid over-styling the surrounding text

### Acceptance
- the stage looks like a deliberate instrument viewport
- unsupported and normal states both feel designed

---

## Phase 3 — status and error UX

### Files
- `apps/web/components/oscilloscope/oscilloscope-shell.tsx`
- optionally `apps/web/components/oscilloscope/oscilloscope-status-alert.tsx`

### Tasks
- [ ] Replace the current single-line status area with `Alert`-based states where appropriate
- [ ] Support these explicit states:
  - unsupported
  - oscillators active
  - mic requesting
  - mic ready
  - mic error
- [ ] Make startup failure reasons feel trustworthy and readable
- [ ] Keep mic status messaging near the stage instead of burying it in controls

### Acceptance
- the current state is understandable at a glance
- permission and failure states feel intentional rather than incidental

---

## Phase 4 — control surface migration to `@kkb/ui`

### Files
- `apps/web/components/oscilloscope/oscilloscope-controls.tsx`
- optional extracted control-card files

### Tasks
- [ ] Replace raw preset `<select>` with `Select`
- [ ] Replace source buttons with `ToggleGroup`
- [ ] Replace raw frequency inputs with `Input`
- [ ] Replace raw range inputs with `Slider`
- [ ] Use `FieldGroup`, `Field`, `FieldLabel`, `FieldDescription`, `FieldContent` throughout
- [ ] Wrap each control group in `Card`
- [ ] Add `Separator` only where it genuinely improves scanning

### Implementation notes
- follow the `FieldGroup` + `Field` pattern instead of `div` + label stacks
- use `SelectGroup` and `SelectItem` correctly
- use `ToggleGroup` for the 2-option source switch
- prefer calm semantic colors over emerald-heavy custom overrides

### Acceptance
- no raw `select`, source button cluster, or custom range-input styling remains in the main control surface
- controls look like a native part of the monorepo design system

---

## Phase 5 — source-aware UX

### Files
- `apps/web/components/oscilloscope/oscilloscope-controls.tsx`
- possibly `apps/web/components/oscilloscope/oscilloscope-shell.tsx`

### Tasks
- [ ] Hide oscillator-only signal controls when source = `mic`
- [ ] If needed, replace them with a small informational note rather than a disabled form
- [ ] Keep visual controls available for both sources
- [ ] Keep preset selection available in both modes
- [ ] Preserve current behavior where preset switching does not force the source back to oscillators

### Recommended decision
- hide oscillator controls entirely in mic mode for this pass

### Acceptance
- mic mode no longer shows irrelevant controls without explanation
- the page adapts meaningfully when source changes

---

## Phase 6 — visual polish and responsive refinement

### Files
- `apps/web/app/oscilloscope/page.tsx`
- `apps/web/components/oscilloscope/oscilloscope-shell.tsx`
- `apps/web/components/oscilloscope/oscilloscope-controls.tsx`

### Tasks
- [ ] Tune spacing, alignment, and card rhythm
- [ ] Ensure the stage card remains dominant on large screens
- [ ] Ensure control cards do not become cramped on smaller screens
- [ ] Add `ScrollArea` only if the control column becomes too tall in constrained layouts
- [ ] Consider `Collapsible` only if mobile density becomes a real issue

### Acceptance
- layout feels calm and balanced on desktop
- mobile layout feels adapted, not merely shrunk

---

## Phase 7 — tests and verification

### Files
- `apps/web/app/oscilloscope/__tests__/page.test.tsx`
- `apps/web/components/oscilloscope/__tests__/oscilloscope-client.test.tsx`
- optional new UI-focused tests if extracted components justify them

### Tasks
- [ ] Update route test expectations for revised copy and headings
- [ ] Ensure runtime behavior tests still pass unchanged
- [ ] Add focused UI assertions if helpful, such as:
  - source toggle renders correctly
  - preset select renders current preset
  - signal controls are hidden in mic mode
  - mic error states render readable copy
- [ ] Run:
  - `bun run test -- --filter=@kkb/audio --filter=@kkb/web`
  - `bun run check-types -- --filter=@kkb/audio --filter=@kkb/web`
  - `bun run format-and-lint`

### Acceptance
- tests reflect the new structure without weakening behavior coverage
- all targeted checks pass

---

## Tight implementation checklist for an agent / coding pass

The checklist below is intentionally tighter than the phase plan above. A worker should be able to execute it in order without reconstructing the task from prose.

### Pre-flight
- [ ] Read these files fully before editing:
  - `apps/web/app/oscilloscope/page.tsx`
  - `apps/web/components/oscilloscope/oscilloscope-shell.tsx`
  - `apps/web/components/oscilloscope/oscilloscope-controls.tsx`
  - `apps/web/components/oscilloscope/oscilloscope-client.tsx`
  - `apps/web/app/oscilloscope/__tests__/page.test.tsx`
  - `apps/web/components/oscilloscope/__tests__/oscilloscope-client.test.tsx`
- [ ] Re-read the relevant UI primitives before composing new markup:
  - `packages/ui/src/components/card.tsx`
  - `packages/ui/src/components/select.tsx`
  - `packages/ui/src/components/toggle-group.tsx`
  - `packages/ui/src/components/field.tsx`
  - `packages/ui/src/components/input.tsx`
  - `packages/ui/src/components/slider.tsx`
  - `packages/ui/src/components/alert.tsx`
  - `packages/ui/src/components/badge.tsx`
  - `packages/ui/src/components/aspect-ratio.tsx`
  - optional `packages/ui/src/components/scroll-area.tsx`
- [ ] Follow these skills while implementing:
  - `shadcn`
  - `vercel-react-best-practices`
  - `vercel-composition-patterns`
  - `next-best-practices`
- [ ] Reserve `web-design-guidelines` for the end-of-slice review.
- [ ] Reserve `agent-browser` for browser verification before considering the slice complete.

### Step 1 — refactor `page.tsx`
- [ ] Add a compact page intro above the oscilloscope surface.
- [ ] Keep the current radial background glow.
- [ ] Improve container width, top spacing, and section rhythm.
- [ ] Keep the page as simple App Router markup; do not move client-only logic into `page.tsx`.

### Step 2 — refactor the stage shell in `oscilloscope-shell.tsx`
- [ ] Replace the current custom stage wrapper with `Card` composition.
- [ ] Add `CardHeader`, `CardTitle`, `CardDescription`, and `CardContent`.
- [ ] Add compact badges for current mode, source, and support state.
- [ ] Wrap the canvas surface in `AspectRatio`.
- [ ] Preserve the dark stage and green ambient framing.
- [ ] Remove excess emerald text styling from surrounding shell copy.

### Step 3 — redesign status handling in `oscilloscope-shell.tsx`
- [ ] Replace the single plain status line with clearer status UI.
- [ ] Use `Alert` where status needs stronger emphasis:
  - unsupported
  - mic requesting
  - mic error
- [ ] Keep oscillator-active and mic-ready states compact and calm.
- [ ] Ensure renderer startup failure copy still surfaces clearly.

### Step 4 — rewrite `oscilloscope-controls.tsx` with `@kkb/ui`
- [ ] Replace raw preset select with `Select`.
- [ ] Replace source buttons with `ToggleGroup`.
- [ ] Replace numeric controls with `Input`.
- [ ] Replace range controls with `Slider`.
- [ ] Use `FieldGroup` + `Field` + `FieldLabel` + `FieldDescription` + `FieldContent` throughout.
- [ ] Group controls into cards in this order:
  1. Source
  2. Preset
  3. Signal
  4. Visual
- [ ] Add visible value labels for trail and bloom.
- [ ] Avoid introducing new controls in this pass.

### Step 5 — make controls source-aware
- [ ] Hide oscillator-only signal controls when source = `mic`.
- [ ] Keep preset and visual controls available in both modes.
- [ ] Preserve current preset-switching behavior that keeps the active source intact.
- [ ] If any explanatory note is needed in mic mode, keep it terse and secondary.

### Step 6 — optional extraction pass
- [ ] If `oscilloscope-shell.tsx` becomes unwieldy, extract stage/status subcomponents.
- [ ] If `oscilloscope-controls.tsx` becomes unwieldy, extract source/preset/signal/visual cards.
- [ ] Use composition, not prop proliferation, when extracting.
- [ ] Do not create a deep component tree unless it meaningfully improves readability.

### Step 7 — test updates
- [ ] Update `apps/web/app/oscilloscope/__tests__/page.test.tsx` for any copy or structure changes.
- [ ] Preserve existing behavior assertions in `apps/web/components/oscilloscope/__tests__/oscilloscope-client.test.tsx`.
- [ ] Add focused assertions only if they test meaningful UI behavior, such as:
  - source toggle presence
  - preset select presence
  - mic-mode hiding of oscillator controls
  - readable error state copy

### Step 8 — code validation
- [ ] Run `bun run test -- --filter=@kkb/audio --filter=@kkb/web`
- [ ] Run `bun run check-types -- --filter=@kkb/audio --filter=@kkb/web`
- [ ] Run `bun run format-and-lint`
- [ ] Fix any oscilloscope-related failures before browser review.

### Step 9 — browser verification with `agent-browser`
- [ ] Use the `agent-browser` skill and CLI to review `/oscilloscope` in-browser.
- [ ] Capture at least one annotated screenshot of the default oscillator UI.
- [ ] Verify the new layout at a desktop viewport.
- [ ] Verify the new layout at a mobile-width viewport.
- [ ] Verify fake mic mode using existing deterministic query params.
- [ ] Verify that source switching still works visually.
- [ ] Verify that preset switching still preserves mic mode.
- [ ] Verify mic error / permission-denied flow if reproducible in the environment.
- [ ] Save screenshots or note artifacts in the relevant report/update.

### Step 10 — final review pass
- [ ] Run a final `web-design-guidelines` review on the oscilloscope page/components.
- [ ] Check for:
  - hierarchy clarity
  - focus state quality
  - readable control labeling
  - responsive layout integrity
  - unnecessary visual noise
- [ ] Update this plan or a follow-up report with any notable decisions or tradeoffs.

### Tight definition of done
- [ ] `/oscilloscope` visibly uses `@kkb/ui` primitives as its primary UI building blocks.
- [ ] The stage is visually primary and the controls feel calmer and more system-native.
- [ ] Mic mode no longer shows irrelevant oscillator controls.
- [ ] Status and failure states are easier to understand.
- [ ] Tests, types, and lint checks pass.
- [ ] Browser review has been completed with `agent-browser`.

---

## Suggested import set for the refactor

These are the primary `@kkb/ui` imports likely needed.

### Page / shell
- `@kkb/ui/components/card`
- `@kkb/ui/components/badge`
- `@kkb/ui/components/alert`
- `@kkb/ui/components/aspect-ratio`
- `@kkb/ui/components/separator`

### Controls
- `@kkb/ui/components/card`
- `@kkb/ui/components/select`
- `@kkb/ui/components/toggle-group`
- `@kkb/ui/components/field`
- `@kkb/ui/components/input`
- `@kkb/ui/components/slider`
- `@kkb/ui/components/badge`
- optional `@kkb/ui/components/scroll-area`
- optional `@kkb/ui/components/collapsible`

---

## Proposed copy direction

Copy should stay concise and technical.

### Page intro
- eyebrow: `Audio experiments`
- title: `Browser Oscilloscope`
- description: `Inspect XY signal geometry from internal oscillators or analyser-backed mic input.`

### Stage card description
- `WebGPU-rendered XY view with phosphor persistence.`

### Source descriptions
- oscillators: `Use the built-in dual oscillator for stable figures and preset exploration.`
- mic: `Use analyser-backed live or fake mic input to drive the XY trace.`

### Visual helper copy
- trail: `Controls persistence and apparent motion memory.`
- bloom: `Controls glow intensity around the active trace.`

---

## Risks and guardrails

## Risks
1. Over-styling the page and losing the calm design-system feel.
2. Accidentally changing runtime behavior while refactoring component structure.
3. Making the page too card-heavy or too panelized.
4. Using emerald accents so aggressively that the controls compete with the stage.

## Guardrails
- prefer semantic design-system styling first
- reserve atmospheric treatment for the stage
- keep copy short
- avoid nesting cards inside cards
- do not add controls just because the new UI makes it easy

---

## Definition of done

This refactor is done when:

- `/oscilloscope` primarily uses `@kkb/ui` components for its visible UI
- the page feels like a coherent product surface, not a custom prototype
- the stage is visually primary
- controls are grouped by intent
- mic vs oscillator mode changes the UI meaningfully
- unsupported and mic-error states are clearly presented
- current behavior is preserved
- targeted tests and checks pass

---

## Recommended first implementation slice

If implemented incrementally, do this order:

1. `page.tsx` header and layout cleanup
2. `oscilloscope-shell.tsx` stage card + status treatment
3. `oscilloscope-controls.tsx` migration to design-system controls
4. source-aware visibility for signal controls
5. responsive polish and test cleanup

This should provide the biggest immediate UX gain with minimal behavioral risk.
