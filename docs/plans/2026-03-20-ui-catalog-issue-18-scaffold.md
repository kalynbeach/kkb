# `/ui` Catalog Issue `#18` Implementation Plan

## Status
- Closed on 2026-03-21.
- `apps/web/app/ui/page.tsx` stayed as the route entry.
- Shared scaffold components ultimately landed under `apps/web/components/ui-catalog/*` after the route shipped.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship issue `#18` by adding the initial `/ui` route scaffold, shared catalog layout primitives, and a home-page entrypoint without pulling section implementation into the same change.

**Architecture:** Keep `apps/web/app/ui/page.tsx` server-owned and make `catalog-nav.tsx` the primary client boundary for active-section tracking and mobile/desktop nav behavior. Shared shell components should stay narrow and reusable by later section files from issues `#21`, `#19`, and `#20`, with centralized section metadata instead of per-file copies.

**Tech Stack:** Bun, Turbo, Next.js 16 App Router, React 19, TypeScript, Tailwind v4, `@kkb/ui`

---

## Scope

- In scope: issue `#18` only
- Out of scope: section content from `#21`, interactive demo islands from `#19`, audio demos/final verification from `#20`

## Unresolved Questions

- None

## File Map

- Create: `apps/web/app/ui/page.tsx`
  Server route entry. Owns page-level layout, section registry, and shared shell composition.
- Create: `apps/web/components/ui-catalog/catalog-nav.tsx`
  Client nav for active-section tracking, anchor highlighting, and mobile horizontal nav behavior.
- Create: `apps/web/components/ui-catalog/component-card.tsx`
  Shared card shell that can wrap both server-rendered examples and later client demo islands.
- Create: `apps/web/components/ui-catalog/section.tsx`
  Shared section wrapper with heading, anchor target, count badge, and responsive card layout.
- Modify: `apps/web/app/page.tsx`
  Add `/ui` entry link from the home route.
- Reference: `apps/web/app/audio/page.tsx`
  Existing route style and app-level page conventions.
- Reference: `packages/ui/src/components/mode-toggle.tsx`
  Existing chrome control that belongs in the `/ui` page header, not in catalog content.

### Task 1: Lock Shared Section Metadata And Route Skeleton

**Files:**
- Create: `apps/web/app/ui/page.tsx`
- Reference: `docs/plans/2026-03-19-ui-component-catalog.md`

- [ ] **Step 1: Write the failing route smoke test or render assertion only if needed**
Add a server-render assertion only if this repo already uses one for route scaffolds; otherwise keep `#18` focused on implementation plus build verification.

- [ ] **Step 2: Define the section registry in the server page**
Create one shared metadata array in `page.tsx` with ids and labels for:
  `layout`,
  `navigation`,
  `input`,
  `feedback`,
  `overlay`,
  `menu`,
  `data`,
  `audio`

- [ ] **Step 3: Build the page shell**
Add:
  back link to `/`,
  page title/subtitle,
  `ModeToggle`,
  responsive two-column layout with sticky desktop nav rail and scrollable content area,
  mobile top nav slot for the client nav component

- [ ] **Step 4: Add placeholder section assembly**
Render one `Section` per metadata entry with temporary empty-state copy so `#21` and `#20` can fill content later without rewriting the scaffold.

- [ ] **Step 5: Run route build verification**
Run: `turbo run build --filter=@kkb/web`
Expected: PASS

### Task 2: Build Shared Section And Card Primitives

**Files:**
- Create: `apps/web/components/ui-catalog/component-card.tsx`
- Create: `apps/web/components/ui-catalog/section.tsx`
- Reference: `packages/ui/src/components/card.tsx`
- Reference: `packages/ui/src/components/empty.tsx`

- [ ] **Step 1: Add a failing server-render assertion only if the shell API is non-obvious**
Prefer lightweight implementation over test-only churn if these are pure presentational wrappers.

- [ ] **Step 2: Implement `component-card.tsx`**
Support:
  title,
  optional description,
  optional className,
  children slot,
  no client-only hooks,
  safe rendering inside server or client trees

- [ ] **Step 3: Implement `section.tsx`**
Support:
  section id,
  title,
  optional description,
  item count,
  children slot,
  anchor-friendly heading structure,
  responsive card grid spacing,
  `scroll-margin-top` so anchor jumps land cleanly below the page chrome on desktop and mobile

- [ ] **Step 4: Replace placeholder raw markup in `page.tsx` with the shared wrappers**
Keep the section shell ownership server-rendered.

- [ ] **Step 5: Run targeted type verification**
Run: `bun run check-types -- --filter=@kkb/web`
Expected: PASS

### Task 3: Build Client Nav As The Only Required Client Boundary

**Files:**
- Create: `apps/web/components/ui-catalog/catalog-nav.tsx`
- Modify: `apps/web/app/ui/page.tsx`

- [ ] **Step 1: Write the smallest failing behavior test only if nav state logic becomes hard to reason about**
If no current client test harness exists for this route yet, skip to implementation and rely on browser verification plus type/build checks.

- [ ] **Step 2: Implement active-section tracking**
Use browser APIs to:
  observe visible sections,
  set the active section id,
  render desktop and mobile nav from the same metadata input,
  keep the nav component isolated from section content

- [ ] **Step 3: Implement desktop + mobile nav variants**
Desktop:
  sticky left rail,
  vertical list,
  active section highlight

Mobile:
  horizontal scroll row,
  same anchors,
  overflow-safe pill styling

- [ ] **Step 4: Wire the nav into `page.tsx`**
Pass only serializable metadata and avoid lifting whole sections into the client tree.

- [ ] **Step 5: Run local browser smoke verification**
Run: `bun run dev`
Then manually verify:
  `/ui` loads,
  desktop sticky nav works,
  mobile nav scrolls horizontally,
  anchor clicks jump to the right section,
  active highlight changes while scrolling

### Task 4: Link `/ui` From Home And Close The Scaffold Issue Cleanly

**Files:**
- Modify: `apps/web/app/page.tsx`
- Reference: `apps/web/app/ui/page.tsx`

- [ ] **Step 1: Add the `/ui` link to the home nav**
Keep the current minimal home-route style.

- [ ] **Step 2: Verify the route relationship**
Confirm `/` links to `/ui` and `/ui` links back to `/`.

- [ ] **Step 3: Run final issue-`#18` verification**
Run: `bun run check-types -- --filter=@kkb/web`
Run: `bun run format-and-lint`
Run: `turbo run build --filter=@kkb/web`
Expected: PASS

- [ ] **Step 4: Commit**
Run: `git add apps/web/app/page.tsx apps/web/app/ui docs/plans/2026-03-20-ui-catalog-issue-18-scaffold.md`
Run: `git commit -m "feat: scaffold ui catalog route (#18)"`
