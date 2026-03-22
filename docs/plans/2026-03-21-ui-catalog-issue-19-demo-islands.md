# `/ui` Catalog Issue `#19` Demo Islands Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close issue `#19` by replacing the remaining non-audio `/ui` placeholders with isolated client demo islands and by backfilling the interactive primitives still missing from the shipped core sections.

**Architecture:** Keep `apps/web/app/ui/page.tsx` and every section file server-owned. Add small, explicit client demo files under `apps/web/app/ui/_components/demos/` for the interaction-heavy primitives only, then compose them from server section files via `ComponentCard`. Do not pull `audio` into this change; issue `#20` still owns audio demos, route-wide browser QA, and final signoff.

**Tech Stack:** Bun, Turbo, Next.js 16 App Router, React 19, TypeScript, Tailwind v4, `@kkb/ui`

---

## Scope

- In scope: issue `#19` only
- Out of scope: audio cards/composition demo from `#20`, route-wide final browser QA from `#20`, unrelated `/ui` or app-layout cleanup

## Unresolved Questions

- None

## File Map

- Create: `apps/web/app/ui/_components/demos/overlay-demo.tsx`
  Client-only demos for dialog-family and hover-triggered overlay primitives.
- Create: `apps/web/app/ui/_components/demos/menu-demo.tsx`
  Client-only demos for dropdown, context, and menubar patterns.
- Create: `apps/web/app/ui/_components/demos/command-demo.tsx`
  Client-only command palette demo with local open state and local item data.
- Create: `apps/web/app/ui/_components/demos/carousel-demo.tsx`
  Client-only carousel card content with local slide data.
- Create: `apps/web/app/ui/_components/demos/resizable-demo.tsx`
  Client-only resizable panel demo for the layout section.
- Create: `apps/web/app/ui/_components/demos/navigation-menu-demo.tsx`
  Client-only `NavigationMenu` demo for the navigation section.
- Create: `apps/web/app/ui/_components/demos/select-calendar-demo.tsx`
  Client-only `Select` and `Calendar` demos for the input section.
- Create: `apps/web/app/ui/_components/sections/overlay-section.tsx`
  Server section composing overlay cards around the overlay demos.
- Create: `apps/web/app/ui/_components/sections/menu-section.tsx`
  Server section composing menu cards around the menu and command demos.
- Create: `apps/web/app/ui/_components/sections/data-section.tsx`
  Server section for carousel plus any lightweight static data-display cards needed to remove the placeholder.
- Modify: `apps/web/app/ui/_components/sections/layout-section.tsx`
  Add the resizable demo card and update item count export if card count changes.
- Modify: `apps/web/app/ui/_components/sections/navigation-section.tsx`
  Add the `NavigationMenu` demo card and update item count export if card count changes.
- Modify: `apps/web/app/ui/_components/sections/input-section.tsx`
  Replace or extend the current native-only selection coverage with `Select` and `Calendar` using a client island, then update item count export as needed.
- Modify: `apps/web/app/ui/page.tsx`
  Swap overlay/menu/data placeholders for the new section files and keep audio deferred.
- Modify: `apps/web/app/ui/__tests__/page.test.tsx`
  Refresh route render assertions so the test tracks the shipped `#19` cards instead of the old placeholder state.

## Task 1: Lock `#19` Boundaries In The Route Test

**Files:**
- Modify: `apps/web/app/ui/__tests__/page.test.tsx`
- Reference: `docs/plans/2026-03-19-ui-component-catalog.md`
- Reference: GitHub issue `#19`

- [ ] **Step 1: Write the failing route render assertions first**
Add or replace assertions in `apps/web/app/ui/__tests__/page.test.tsx` so they prove:
  non-audio placeholders are gone for `overlay`, `menu`, and `data`,
  representative `#19` card titles render,
  `audio` stays deferred in this issue.

- [ ] **Step 2: Run the focused route test**
Run: `bun test apps/web/app/ui/__tests__/page.test.tsx`
Expected: FAIL

- [ ] **Step 3: Leave route-shell wiring for the section-creation tasks**
Do not touch `page.tsx` in this task. Real `OverlaySection`, `MenuSection`, and `DataSection` imports land in Tasks 3 and 4 alongside the new section files and count exports.

- [ ] **Step 4: Re-run the focused route test**
Run: `bun test apps/web/app/ui/__tests__/page.test.tsx`
Expected: still FAIL until Tasks 2 through 4 are implemented

## Task 2: Backfill Missing Interactive Primitives In Shipped Core Sections

**Files:**
- Create: `apps/web/app/ui/_components/demos/resizable-demo.tsx`
- Create: `apps/web/app/ui/_components/demos/navigation-menu-demo.tsx`
- Create: `apps/web/app/ui/_components/demos/select-calendar-demo.tsx`
- Modify: `apps/web/app/ui/_components/sections/layout-section.tsx`
- Modify: `apps/web/app/ui/_components/sections/navigation-section.tsx`
- Modify: `apps/web/app/ui/_components/sections/input-section.tsx`
- Modify: `apps/web/app/ui/__tests__/page.test.tsx`
- Reference: `packages/ui/src/components/resizable.tsx`
- Reference: `packages/ui/src/components/navigation-menu.tsx`
- Reference: `packages/ui/src/components/select.tsx`
- Reference: `packages/ui/src/components/calendar.tsx`

- [ ] **Step 1: Add the smallest failing assertions for the omitted primitives**
Extend `page.test.tsx` so it expects representative titles for:
  a resizable demo card in `layout`,
  a navigation-menu card in `navigation`,
  a select/calendar card in `input`.

- [ ] **Step 2: Run the focused route test**
Run: `bun test apps/web/app/ui/__tests__/page.test.tsx`
Expected: FAIL

- [ ] **Step 3: Implement `resizable-demo.tsx`**
Create one explicit client demo component using `ResizablePanelGroup`, `ResizablePanel`, and `ResizableHandle` with local static content only.
Keep the API explicit; do not add generic variant booleans.

- [ ] **Step 4: Implement `navigation-menu-demo.tsx`**
Create one explicit client demo component showing a compact `NavigationMenu` with a small local content map and no server data dependency.

- [ ] **Step 5: Implement `select-calendar-demo.tsx`**
Create one client file with explicit demo exports for:
  a `Select` surface with a few options,
  a small single-date `Calendar` surface.
Keep local state inside the demo file; do not lift it into the section.

- [ ] **Step 6: Compose the new demo cards from the server sections**
Update `layout-section.tsx`, `navigation-section.tsx`, and `input-section.tsx` to import the new demos and render them inside `ComponentCard` wrappers.
Update each section’s exported item-count constant to match the real post-`#19` card total.

- [ ] **Step 7: Re-run the focused route test**
Run: `bun test apps/web/app/ui/__tests__/page.test.tsx`
Expected: still FAIL until overlay/menu/data sections land

## Task 3: Add Overlay Demo Islands And Server Section

**Files:**
- Create: `apps/web/app/ui/_components/demos/overlay-demo.tsx`
- Create: `apps/web/app/ui/_components/sections/overlay-section.tsx`
- Modify: `apps/web/app/ui/page.tsx`
- Modify: `apps/web/app/ui/__tests__/page.test.tsx`
- Reference: `packages/ui/src/components/dialog.tsx`
- Reference: `packages/ui/src/components/alert-dialog.tsx`
- Reference: `packages/ui/src/components/sheet.tsx`
- Reference: `packages/ui/src/components/drawer.tsx`
- Reference: `packages/ui/src/components/popover.tsx`
- Reference: `packages/ui/src/components/hover-card.tsx`
- Reference: `packages/ui/src/components/tooltip.tsx`

- [ ] **Step 1: Expand the failing route assertions**
Add expectations for representative overlay card titles so the route test proves the placeholder is replaced by real overlay content.

- [ ] **Step 2: Run the focused route test**
Run: `bun test apps/web/app/ui/__tests__/page.test.tsx`
Expected: FAIL

- [ ] **Step 3: Implement `overlay-demo.tsx` with explicit exports**
Create named demo exports for the overlay families that need local state.
Recommended grouping:
  dialog + sheet,
  alert-dialog + drawer,
  popover + hover-card + tooltip.
Keep triggers, copy, and local state inside this client file.

- [ ] **Step 4: Implement `overlay-section.tsx` as a server section**
Wrap each demo export in `ComponentCard` with short explanatory copy.
Do not convert the whole section file to a client component.

- [ ] **Step 5: Wire the real overlay section into `page.tsx`**
Replace the old `SectionPlaceholder` branch for `overlay` with `OverlaySection`.
Update the page-level imported count source to the section export.

- [ ] **Step 6: Re-run the focused route test**
Run: `bun test apps/web/app/ui/__tests__/page.test.tsx`
Expected: still FAIL until menu/data sections land

## Task 4: Add Menu And Data Demo Islands And Remove The Last Non-Audio Placeholders

**Files:**
- Create: `apps/web/app/ui/_components/demos/menu-demo.tsx`
- Create: `apps/web/app/ui/_components/demos/command-demo.tsx`
- Create: `apps/web/app/ui/_components/demos/carousel-demo.tsx`
- Create: `apps/web/app/ui/_components/sections/menu-section.tsx`
- Create: `apps/web/app/ui/_components/sections/data-section.tsx`
- Modify: `apps/web/app/ui/page.tsx`
- Modify: `apps/web/app/ui/__tests__/page.test.tsx`
- Reference: `packages/ui/src/components/dropdown-menu.tsx`
- Reference: `packages/ui/src/components/context-menu.tsx`
- Reference: `packages/ui/src/components/menubar.tsx`
- Reference: `packages/ui/src/components/command.tsx`
- Reference: `packages/ui/src/components/carousel.tsx`
- Reference: `packages/ui/src/components/table.tsx`
- Reference: `packages/ui/src/components/code.tsx`
- Reference: `packages/ui/src/components/kbd.tsx`

- [ ] **Step 1: Finish the failing route assertions**
Add expectations for representative menu and data card titles, and confirm the page no longer renders placeholder copy for `menu` or `data`.

- [ ] **Step 2: Run the focused route test**
Run: `bun test apps/web/app/ui/__tests__/page.test.tsx`
Expected: FAIL

- [ ] **Step 3: Implement `menu-demo.tsx`**
Create explicit client demo exports for dropdown-menu, context-menu, and menubar.
Keep local trigger state and mock menu item data inside this file.

- [ ] **Step 4: Implement `command-demo.tsx`**
Create one client command-palette demo with:
  local `open` state,
  local grouped command items,
  no route-level keyboard shortcut wiring in this issue.

- [ ] **Step 5: Implement `carousel-demo.tsx`**
Create one client carousel demo with local slide data only.
Keep it narrow; no autoplay, no remote assets, no extra controller layer.

- [ ] **Step 6: Implement `menu-section.tsx`**
Render the menu and command demos in server-owned `ComponentCard` wrappers and export the final card count.

- [ ] **Step 7: Implement `data-section.tsx`**
Render the carousel demo plus any small static `Table`, `Code`, and `Kbd` cards needed to retire the placeholder without expanding scope into more client state than necessary.

- [ ] **Step 8: Wire the real menu and data sections into `page.tsx`**
Replace the old placeholder branches for `menu` and `data`.
Import their count exports into the section-count map.

- [ ] **Step 9: Re-run the focused route test**
Run: `bun test apps/web/app/ui/__tests__/page.test.tsx`
Expected: PASS

## Task 5: Verify `#19` Without Stealing `#20`

**Files:**
- Modify: `apps/web/app/ui/page.tsx`
- Modify: `apps/web/app/ui/_components/sections/*.tsx`
- Modify: `apps/web/app/ui/_components/demos/*.tsx`
- Modify: `apps/web/app/ui/__tests__/page.test.tsx`

- [ ] **Step 1: Run focused route coverage**
Run: `bun test apps/web/app/ui/__tests__/page.test.tsx`
Expected: PASS

- [ ] **Step 2: Run filtered type checks**
Run: `bun run check-types -- --filter=@kkb/web`
Expected: PASS

- [ ] **Step 3: Run filtered build verification**
Run: `turbo run build --filter=@kkb/web`
Expected: PASS

- [ ] **Step 4: Do a narrow browser sanity pass only for new demo islands**
Run: `bun run dev`
Then verify:
  overlay triggers open and close correctly,
  menu and command demos stay isolated,
  carousel navigation works,
  existing nav anchors still work,
  `audio` still shows as deferred for `#20`.

- [ ] **Step 5: Commit**
Run: `git add apps/web/app/ui docs/plans/2026-03-21-ui-catalog-issue-19-demo-islands.md`
Run: `git commit -m "feat: add ui catalog demo islands (#19)"`
