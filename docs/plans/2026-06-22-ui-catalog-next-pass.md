# UI catalog next-pass implementation plan

Date: 2026-06-22

## 1. Purpose

Rework `/ui` from a structurally correct but overbuilt catalog into a clean, shadcn/create-like `@kkb/ui` inspection workbench.

The current route has the right shell pieces: URL-backed `?item=`, command search, desktop rail, preview view, focused item views, category views, and complete public inventory. The next pass should not add more features. It should remove noise, improve search, and make the preview and focused item surfaces visually match the intended model.

## 2. Primary user action

Find and inspect any `@kkb/ui` export quickly.

The user should be able to:

1. Scan the default preview and understand the component system at a glance.
2. Press `Cmd/Ctrl+K`, type a component name, and land on the right item immediately.
3. Open a focused component page and see real variants/examples for that component without prose-heavy framing.

## 3. Design direction

- **Color strategy:** Restrained. Use existing KKB tokens in both light and dark mode.
- **Scene sentence:** Kalyn is reviewing a component library in a focused development workspace, sometimes in bright daytime and sometimes late at night, so the catalog must work in both themes without becoming dark-only.
- **References:** shadcn/create topology and search behavior; shadcn/create focused Button/Card specimen sheets; KKB `PRODUCT.md` and `DESIGN.md` for TX-02/Geist, sharp neutral surfaces, and scoped audio color.
- **Primary shadcn/create reference:** `https://ui.shadcn.com/create?preset=b1D0enCq&base=base&pointer=true&item=preview`

The reference is structural, not literal. Do not copy shadcn preset generation, shuffle, lock controls, or Get Code behavior.

## 4. Scope

### In scope

- `/ui` shell refinement.
- Preview wall rebuild.
- Focused component specimen rebuild.
- Search ranking/filtering rebuild.
- Rail simplification.
- Design-system view cleanup.
- Mobile and tablet behavior.
- Targeted tests for catalog data, search, focused route coverage, and server-renderable route shell.

### Out of scope

- Migrating `@kkb/ui` primitives to Base UI.
- Changing package public exports.
- Replacing KKB design tokens.
- Adding code export, preset generation, shuffle, lock, or theme-builder controls.
- Creating a docs site inside `/ui`.
- Rewriting unrelated app routes.
- Broad visual redesign of audio, oscilloscope, or json-render routes.

## 5. Evidence from audit

- The default local preview is a gridded admin/catalog matrix with eleven titled panels: Actions, Fields, Navigation, Data, Feedback, Overlays, Menus, Layout, Audio, Design tokens, and Export wall.
- The shadcn/create preview is a single large preview canvas where direct component specimens carry the meaning.
- Local command search technically works, but typing `button` leaves unrelated categories/results visible and does not rank exact component matches first.
- Browser route audit found no blank item routes, but most focused pages reuse broad category templates:
  - 14 input routes share `Settings form | Structured entry`.
  - 8 data/json routes share `Table, code, keyboard | Chart and carousel`.
  - 7 overlay routes share `Modal family | Contextual overlay`.
  - 7 layout routes share `Panel primitives | Aspect ratio`.
  - 7 feedback routes share `Status stack | Error state`.
  - 4 action routes share `Variants and sizes | Toolbar`.
- Mobile currently collapses into a long one-column dump rather than preserving a preview-first workbench.

## 6. Target file layout

Keep `apps/web/app/ui/page.tsx` as the route wrapper.

Refactor `apps/web/components/ui-catalog/` toward these responsibilities:

- `catalog-workbench.tsx`: shell only; header, selected item state, scroll reset, route updates.
- `catalog-data.ts`: item inventory and metadata only.
- `catalog-search.tsx`: command dialog UI plus ranked search result rendering.
- `catalog-rail.tsx`: quiet desktop navigation.
- `catalog-surfaces.tsx`: temporary router surface only if needed, but split most visual code out.
- `preview-wall.tsx`: default preview mosaic.
- `focused-specimens.tsx`: focused item page layout and specimen routing.
- `specimens/`: component-family or component-specific specimen modules.
- `design-system-surface.tsx`: token/type/radius/spacing view.
- `category-surface.tsx`: optional category landing views, kept secondary.

Do not keep adding large visual sections to `catalog-surfaces.tsx`; it is already the choke point.

## 7. Implementation work order

### Phase 1 - Search first

Goal: make navigation trustworthy before redesigning content.

Tasks:

- Build a small search index from `allSelectableItems`.
- Flatten the result list by default: `Preview`, `Design System`, then component/category/utility items.
- Use grouping only if it improves scanning; do not let category groups dominate exact results.
- Implement explicit ranking:
  - exact label or id match
  - label/id prefix match
  - label/id word match
  - keyword match
  - source path match
- For query `button`, results must start with `Button`, then `Button Group`.
- For query `input`, distinguish `Input` component from `Input category`.
- Keep no-result text terse: `No component found.`
- Add tests for ranking and selection behavior at the data/helper level.

Acceptance:

- `Cmd/Ctrl+K` opens search.
- `Escape` closes search.
- Selecting a result updates `?item=` and closes search.
- Search does not show unrelated categories above exact component results.

### Phase 2 - Shell and rail simplification

Goal: make the route feel like a workbench shell, not a dashboard.

Tasks:

- Keep the header compact: back/home affordance, route identity, search trigger, theme toggle.
- Remove or reduce decorative chrome in the rail:
  - no category icons unless they materially improve scanning
  - no lane badges like `core` or `bay`
  - no per-category counts unless visually quiet
- Keep `Preview` and `Design System` as first-class rail entries.
- Make categories clearly secondary to components.
- Preserve independent main content scroll.
- Ensure active state is obvious but not high-noise.

Acceptance:

- Rail reads as navigation only.
- The selected item is clear.
- No metadata badges compete with item names.

### Phase 3 - Preview wall rebuild

Goal: replace the current panel matrix with a direct component mosaic.

Tasks:

- Remove the top `Preview / 68 exports / Inspect tokens` header from the canvas or reduce it to a minimal caption outside the specimen wall.
- Replace `PreviewPanel` sections with a staged preview mosaic.
- Use direct, mixed component specimens rather than documentation sections.
- Keep labels sparse: small captions are allowed; repeated panel headers are not.
- Prioritize the first desktop viewport:
  - token/type strip
  - button/action variants
  - compact form cluster
  - menu/overlay controls
  - data/table/chart card
  - navigation strip
  - audio waveform/transport slice
- Move the full export inventory out of the dominant default path. If retained, make it a quiet lower section or rely on search/rail for full inventory.

Acceptance:

- The first viewport reads as a preview canvas, not an index.
- The wall shows real `@kkb/ui` components directly.
- There is much less explanatory text than the current preview.
- The preview remains usable in light and dark mode.

### Phase 4 - Focused component specimen rebuild

Goal: make each focused page a component-specific specimen sheet.

Tasks:

- Replace the current `FocusedMetadata` footer with minimal metadata.
- Keep source/import path secondary, not visually dominant.
- Remove generic `intent` prose from the main page path.
- Keep related links secondary and compact if retained.
- Define specimen coverage by component, not broad category bucket.
- Start with high-impact components:
  - Button: variants, sizes, icon left/right, icon-only, disabled/loading/invalid, realistic action row.
  - Card: default/small, edge-to-edge content, custom spacing, action/footer examples.
  - Input: plain, placeholder, disabled, invalid, with label/help text.
  - Select/Combobox/Command: closed/open examples and search states.
  - Dialog/Sheet/Drawer/Popover/Tooltip: one clear trigger plus opened state where practical.
  - Table/Chart/Kbd/Code: compact data specimens without fake catalog copy.
  - Sidebar/Tabs/Breadcrumb/Navigation Menu: route/navigation specimens.
  - Audio: waveform, playhead, controls, and one composed player specimen using scoped audio tokens.
- For smaller primitives, keep pages minimal but specific: show variants/states and one realistic example.
- Utilities such as providers/hooks should not pretend to be visual components; use a compact utility reference surface.

Acceptance:

- No large groups of unrelated item routes share the same two specimen titles.
- Focused Button and Card pages visibly resemble specimen sheets rather than docs articles.
- Every public component has at least one relevant focused specimen.
- Component pages contain less filler copy than today.

### Phase 5 - Design-system view cleanup

Goal: make tokens inspectable without turning the page into a taxonomy document.

Tasks:

- Keep color, typography, radius, spacing, and scoped audio/oscilloscope color.
- Remove the full category map from the primary view or move it below the fold.
- Make swatches larger and clearer.
- Show light/dark behavior where feasible.
- Keep implementation notes terse and secondary.

Acceptance:

- The view reads as a token/specimen reference.
- It does not compete with the catalog navigation taxonomy.

### Phase 6 - Responsive behavior

Goal: preserve the workbench model on small screens.

Tasks:

- Mobile first viewport should show header plus preview canvas, not a long Actions/Fields pile.
- Replace desktop rail with search-first navigation and possibly a compact item selector.
- Avoid page-level horizontal overflow.
- Make focused specimen pages stack cleanly.
- Keep tap targets and focus states usable.

Acceptance:

- `390x844` preview starts with a meaningful preview canvas.
- Search remains the fastest way to navigate.
- No text or controls are clipped in the first mobile viewport.

### Phase 7 - Verification

Run targeted checks after implementation:

- `bun test apps/web/components/ui-catalog/__tests__/catalog-data.test.ts`
- `bun test apps/web/components/ui-catalog/__tests__/catalog-surface-rendering.test.tsx`
- `bun test apps/web/app/ui/__tests__/page.test.tsx`
- `bun test apps/web/app/ui/__tests__/interactive-demos.test.tsx`
- `bun run check-types --filter=@kkb/web`
- Browser verification at:
  - `http://localhost:3000/ui?item=preview`
  - `http://localhost:3000/ui?item=design-system`
  - `http://localhost:3000/ui?item=button`
  - `http://localhost:3000/ui?item=card`
  - `http://localhost:3000/ui?item=input`
  - `http://localhost:3000/ui?item=dialog`
  - `http://localhost:3000/ui?item=table`
  - `http://localhost:3000/ui?item=audio-waveform`
- Browser verification at desktop and `390x844`.

Also rerun the route audit pattern from the investigation: collect each `?item=` route's heading and specimen titles, then confirm duplicate specimen signatures are intentional and limited.

## 8. Testing additions

Add or update tests for:

- Search scoring:
  - `button` returns `Button`, `Button Group` first.
  - `input` returns `Input` before `Input category`.
  - unknown queries return no results.
- Catalog route coverage:
  - every selectable component id renders focused specimen headings.
  - broad duplicate rendered specimen signatures are not the default outcome.
- Shell behavior:
  - fallback still renders during server string rendering.
  - `Preview` and `Design System` remain stable ids.

Keep tests targeted. Do not build a full browser E2E suite in this pass unless a specific interaction cannot be covered otherwise.

## 9. Definition of done

This pass is done when:

- `/ui?item=preview` visually reads as a clean component wall.
- Search ranking matches the reference behavior for obvious component queries.
- Focused component routes show component-specific specimens instead of broad category templates.
- The rail is quieter and navigation-only.
- The design-system view is a token/specimen reference, not a category explainer.
- Mobile preserves preview-first orientation.
- Targeted tests and type checks pass.
- Browser screenshots of local preview, button, card, design-system, and mobile preview show the intended reduction in chrome and filler.

## 10. Suggested implementation sequence

1. Search helpers and tests.
2. Surface file split with no visual behavior change.
3. New preview wall.
4. New focused specimen layout.
5. High-impact component specimens.
6. Utility and minor component specimens.
7. Rail and design-system cleanup.
8. Mobile pass.
9. Tests, type checks, browser QA.

Do not start by tweaking colors or spacing inside the current panel matrix. The structure is the problem.
