# Plan: `/ui` Visual Component Catalog

## Status
- Shipped via `#17` on 2026-03-22/2026-03-23.
- Route entry still lives at `apps/web/app/ui/page.tsx`.
- Shared catalog components landed under `apps/web/components/ui-catalog/*`, not the earlier `apps/web/app/ui/_components/*` scaffold paths.

## Goal
Add a `/ui` route to `@kkb/web` that presents a curated visual catalog of user-facing, demoable primitives from `@kkb/ui`, plus one app-level audio composition demo using the existing `PlayerClient` / `PlayerShell` stack.

## Architecture
- Build the route as a server-rendered App Router page with server-owned layout, section wrappers, and small client islands only where interaction is required.
- Keep page structure, section metadata, and non-interactive chrome server-owned. Many catalog entries are already client components in `@kkb/ui`; render those directly where needed, but avoid promoting whole sections to client trees unless necessary.
- Use dynamic imports selectively for heavy client demos only. Do not lazy-load every section.

## Scope

### In scope
- User-facing demoable primitives from `@kkb/ui`
- Sticky left nav on desktop
- Horizontal scrollable top nav on mobile
- Section anchors + active-section highlighting
- Audio primitives demos
- One full audio composition demo to show how the audio primitives compose in app code

### Out of scope
- Non-demoable infra exports
- Heavy setup components for now: Sidebar, Form, Chart, Sonner/Toaster
- Exhaustive coverage of every exported module in `@kkb/ui`

## Decisions
- Treat this as a curated catalog, not an exhaustive export inventory.
- Prefer one page with small client islands over eight fully client-rendered sections.
- Keep `ComponentCard` and `Section` usable from both server-rendered sections and client demo islands.
- Audio section includes both primitives from `@kkb/ui/components/audio/*` and one app-level composition card built from the existing `apps/web/components/audio/player-client.tsx` + `apps/web/components/audio/player-shell.tsx` stack, or a thin dedicated wrapper around that wiring.
- `ModeToggle` belongs in page chrome, not as a catalog entry.

## Skill Use

### Required during implementation
- [`writing-plans`](/Users/kalynbeach/.agents/skills/writing-plans/SKILL.md) for plan execution discipline
- [`vercel-react-best-practices`](/Users/kalynbeach/.agents/skills/vercel-react-best-practices/SKILL.md)
  - Favor RSC-first structure
  - Minimize props serialized into client islands
  - Use `next/dynamic` only for genuinely heavy interactive demos
  - Avoid unnecessary client boundaries and bundle growth
- [`vercel-composition-patterns`](/Users/kalynbeach/.agents/skills/vercel-composition-patterns/SKILL.md)
  - Avoid boolean-prop sprawl in catalog scaffolding
  - Prefer explicit demo components over generic `mode` props
  - Keep compound demo structures clear for components like Resizable, Table, Carousel, Command, NavigationMenu

### Required during review
- [`web-design-guidelines`](/Users/kalynbeach/.agents/skills/web-design-guidelines/SKILL.md)
  - Fetch latest guidelines at review time
  - Review the new `/ui` route files before signoff

### Likely useful design skills
- [`arrange`](/Users/kalynbeach/.agents/skills/arrange/SKILL.md)
- [`typeset`](/Users/kalynbeach/.agents/skills/typeset/SKILL.md)
- [`polish`](/Users/kalynbeach/.agents/skills/polish/SKILL.md)
- [`critique`](/Users/kalynbeach/.agents/skills/critique/SKILL.md)
- [`animate`](/Users/kalynbeach/.agents/skills/animate/SKILL.md)

## File Structure
```
apps/web/app/ui/
  page.tsx                              # Server page; owns layout + section assembly

apps/web/components/ui-catalog/
  catalog-nav.tsx                       # "use client" — sticky nav + active section tracking
  component-card.tsx                    # Shared card shell; safe to render from server or client trees
  section.tsx                           # Server section wrapper
  sections/
    layout-section.tsx                  # Server section
    navigation-section.tsx              # Server section
    input-section.tsx                   # Server section
    feedback-section.tsx                # Server section
    overlay-section.tsx                 # Server section
    menu-section.tsx                    # Server section
    data-section.tsx                    # Server section
    audio-section.tsx                   # Server section
  demos/
    overlay-demo.tsx                    # "use client"
    menu-demo.tsx                       # "use client"
    carousel-demo.tsx                   # "use client"
    command-demo.tsx                    # "use client"
    resizable-demo.tsx                  # "use client"
    navigation-menu-demo.tsx            # "use client"
    select-calendar-demo.tsx            # "use client"
    audio-demo.tsx                      # "use client"

Modified:
  apps/web/app/page.tsx                 # Add /ui nav link
```

## Page Layout
```
┌────────────────────────────────────────────────────────────┐
│ header: ← Home   UI Components   curated primitives [Mode] │
├────────────┬───────────────────────────────────────────────┤
│ sticky nav │ scrollable main content                       │
│            │                                               │
│ Layout     │ <Section id="layout">                         │
│ Navigation │   [Card] [Card] [Card]                        │
│ Input      │                                               │
│ Feedback   │ <Section id="navigation">                     │
│ Overlay    │   [Card] [Card]                               │
│ Menu       │                                               │
│ Data       │ ...                                           │
│ Audio      │                                               │
└────────────┴───────────────────────────────────────────────┘

Mobile: sidebar hidden, top horizontal pill nav shown instead
```

## Catalog Contents

### Layout
- Card
- AspectRatio
- Separator
- ResizablePanelGroup + ResizablePanel + ResizableHandle
- ScrollArea
- Item + ItemGroup
- Empty

### Navigation
- Tabs
- Accordion
- Collapsible
- Breadcrumb
- Pagination
- NavigationMenu

### Input / Forms
- Button
- ButtonGroup
- Input
- InputGroup
- InputOTP
- Textarea
- Checkbox
- RadioGroup
- Switch
- Toggle
- ToggleGroup
- Select
- NativeSelect
- Slider
- Calendar

### Feedback
- Alert
- Badge
- Progress
- Skeleton
- Spinner

### Overlay / Dialog
- Dialog
- AlertDialog
- Sheet
- Drawer
- Popover
- HoverCard
- Tooltip

### Menu
- DropdownMenu
- ContextMenu
- Menubar
- Command

### Data Display
- Table
- Code
- Kbd
- Carousel

### Audio
- Waveform
- Playhead
- PlayerControls
- Full audio composition demo

## Explicit Exclusions
- Sidebar
- Form
- Chart
- Sonner / Toaster
- Label
- Field
- Combobox
- Avatar
- ThemeProvider
- Direction
- ModeToggle as catalog content
- Audio helper-only exports (`presenter`, `theme`)

## Demo Rules
- Prefer representative states over exhaustive variant matrices.
- One card per primitive or tightly related primitive group.
- Keep demos narrow and readable. Do not build mini playgrounds.
- For compound APIs, create explicit demo components instead of adding generic boolean switches.
- For portal/overlay components, use a local trigger button and minimal internal state.
- For client demos, keep data local and serializable. Avoid passing large config objects from the server page.

### Audio demo rules
- Primitive cards may use a lightweight themed wrapper with audio CSS vars/classes.
- Do not wrap `PlayerShell` in another `.audio-shell`; `PlayerShell` already owns that chrome.
- Use `apps/web/components/audio/player-client.tsx` as the primary composition reference and `apps/web/components/audio/player-shell.tsx` as the shell-level reference.
- Prefer a dedicated `audio-composition-demo.tsx` client component with real wiring over a fake static `PlayerShell` mock.

## Implementation Steps

### Step 1: Create shared scaffolding
Create:
- `apps/web/app/ui/page.tsx`
- `apps/web/components/ui-catalog/catalog-nav.tsx`
- `apps/web/components/ui-catalog/component-card.tsx`
- `apps/web/components/ui-catalog/section.tsx`

Requirements:
- `page.tsx` stays server-rendered
- `catalog-nav.tsx` is the primary client boundary for active-section tracking
- `component-card.tsx` must be safe to render inside both server sections and client demos
- `section.tsx` owns heading, anchor id, count badge, spacing, and card grid

### Step 2: Add server section files
Create one server section file per category under `apps/web/components/ui-catalog/sections/`.

Requirements:
- Each section imports only the demos/components it needs
- Page/section ownership stays server-rendered
- Static cards stay server-rendered where practical
- Cards that render client components from `@kkb/ui` may do so directly without promoting the whole section to a client file
- Heavier or stateful demos delegate to small client demo components only when required
- Keep section files focused; no shared mega-config object for every demo

### Step 3: Add targeted client demo islands
Create only the client demos needed for interaction-heavy components.

Expected client islands:
- overlay demos
- menu demos
- command demo
- carousel demo
- any resizable/select/calendar/navigation-menu demo that proves awkward in a server-only card
- full audio composition demo

Guidance:
- Use `next/dynamic` only for the heaviest client demos
- Do not dynamic-import every section
- Keep each client island self-contained and explicit

### Step 4: Assemble page layout
In `apps/web/app/ui/page.tsx`:
- Add header with back link, title, supporting copy, `ModeToggle`
- Define catalog section metadata in one place
- Render desktop two-column layout and mobile top-nav variant
- Pass small, serializable category metadata to `CatalogNav`

### Step 5: Add home page entry
Modify `apps/web/app/page.tsx` to add `/ui`, matching existing nav styling.

### Step 6: Validate behavior and quality
Run:
- `bun run check-types`
- `bun run format-and-lint`
- `turbo run build --filter=@kkb/web`

Browser verification:
1. Open `localhost:3000/ui`
2. Verify all intended sections render
3. Verify desktop sticky nav and mobile horizontal nav
4. Verify anchor scrolling + active section state
5. Verify section headings account for sticky-header offset via `scroll-margin-top` or equivalent
6. Verify `ModeToggle` works
7. Verify keyboard navigation, visible focus states, and aria labels on nav + interactive demos
8. Spot-check overlay/menu demos
9. Verify audio primitive cards render with correct theme treatment
10. Verify the full audio composition demo uses real wiring and does not double-wrap shell chrome
11. Verify mobile overflow is controlled and horizontal nav remains usable
12. Spot-check reduced-motion behavior if motion is added

Review pass:
- Use [`web-design-guidelines`](/Users/kalynbeach/.agents/skills/web-design-guidelines/SKILL.md) on the new `/ui` route files before final signoff

## Key Files to Reference
- `packages/ui/package.json`
- `packages/ui/src/components/*.tsx`
- `packages/ui/src/components/audio/*.tsx`
- `packages/ui/src/styles/globals.css`
- `packages/ui/src/components/mode-toggle.tsx`
- `apps/web/app/layout.tsx`
- `apps/web/app/page.tsx`
- `apps/web/app/json-render/page.tsx`
- `apps/web/components/audio/player-shell.tsx`
- `apps/web/components/audio/player-client.tsx`

## Parallelization Strategy
- Step 1 sequential
- Step 2 can split by section across agents
- Step 3 can split by demo-island ownership across agents
- Step 4 sequential integration
- Step 6 after local dev server is running

## Unresolved Questions
- None
