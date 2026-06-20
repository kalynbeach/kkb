# UI catalog shadcn/create rebuild plan

Date: 2026-06-20

## 1. Feature summary

Rebuild `apps/web/app/ui/page.tsx` as a functional KKB UI catalog modeled after `ui.shadcn.com/create`, but repurposed as a showcase for the complete `@kkb/ui` component library and KKB design system. The page is for Kalyn and collaborators reviewing, validating, and reusing the UI system, not for generating presets or exporting config.

The current page should move away from sectioned documentation/marketing structure and toward a dense, searchable, component-preview workbench.

## 2. Primary user action

Find and inspect any `@kkb/ui` export quickly: either scan the full preview surface or search/navigate to a focused component view with richer examples.

## 3. Design direction

- **Color strategy:** Restrained. Use the existing KKB tokens, with high-contrast paneling and border-driven structure. No forced dark-only treatment.
- **Theme scene sentence:** Kalyn is reviewing a component library in a focused development workspace, sometimes in bright daytime and sometimes late at night, so the catalog must feel equally intentional in light and dark mode.
- **Anchor references:**
  - `ui.shadcn.com/create` for topology, search behavior, preview/focused item model.
  - `b1D0enCq` preset screenshots for hard-edged, radius-none/near-none, high-contrast component staging.
  - KKB `PRODUCT.md` / `DESIGN.md` for TX-02/Geist typography, sharp technical surfaces, scoped audio/oscilloscope color, and shared-token discipline.

Typography should not copy the reference. Use KKB's mono/product voice: TX-02 for headings, labels, metadata, nav, and component names; Geist for readable explanations.

## 4. Scope

- **Fidelity:** production-ready direction, not a sketch.
- **Breadth:** the whole `/ui` catalog surface.
- **Interactivity:** shipped-quality interactive catalog shell with search, navigation, overview, focused component views, and theme support.
- **Time intent:** reshape the page correctly first; polish can follow after implementation once the structure matches intent.

## 5. Layout strategy

The page should use a shadcn/create-like workbench layout:

- **Top app/header strip**
  - home/back affordance
  - page title or compact route identity
  - global catalog search trigger
  - theme toggle
  - possibly component count / library source metadata, but secondary

- **Left rail**
  - persistent category/component navigation
  - first item: `Preview`
  - dedicated `Design System` / `Tokens` category
  - categories like Layout, Navigation, Input, Feedback, Overlay, Menu, Data, Audio, JSON Render if applicable
  - no preset-generator controls, no “Get Code”, no “Shuffle”, no fake preset actions

- **Main bordered preview canvas**
  - `Preview` mode: dense multi-column overview of all components, closer to the reference mosaic than a documentation page
  - focused component mode: variants/examples for one selected component, using the Card reference screenshot's structure as the mental model
  - examples should feel like live component states arranged on an inspection bench, not marketing cards

- **Responsive behavior**
  - desktop: left rail + large canvas
  - tablet/mobile: nav collapses into a search/category selector or sheet; preview remains usable without horizontal page overflow
  - search remains the fastest path on all sizes

Visual hierarchy should come from borders, tonal surfaces, spacing, and type weight. Avoid large soft cards, generic shadows, gradients, or hero-stat framing.

## 6. Key states

- **Preview default**
  - shows all exported components at least once
  - dense but scannable
  - grouped enough to orient, not sectioned into long documentation blocks

- **Focused component view**
  - selected component name, source/import path, category, and examples
  - important components get richer composed examples
  - smaller primitives get compact but real demos

- **Design System / Tokens view**
  - colors, typography, radius, spacing, elevation, audio tokens, oscilloscope tokens
  - use live KKB tokens rather than duplicated literal colors where possible

- **Search closed**
  - catalog is browsable via rail and preview

- **Search open**
  - command-style overlay
  - background dim/blur like the reference, but accessible and theme-aware
  - list includes `Preview`, `Design System`, categories, and every component
  - current item indicated
  - keyboard navigation required

- **No search results**
  - terse empty state: “No component found.” plus hint to try category/source terms

- **Loading**
  - likely not needed if all data is local/static; if dynamic imports are introduced, use skeleton panels, not centered spinners

- **Error**
  - if a demo cannot render, isolate failure inside that demo cell with a compact error panel so the catalog remains usable

- **Theme states**
  - light and dark must both be first-class
  - no visual assumptions that only work on dark backgrounds

## 7. Interaction model

- URL-backed selected item:
  - preferred: `?item=preview`, `?item=button`, `?item=design-system`
  - direct linking to component views should work
- Left rail item click updates selected item and URL.
- Search trigger opens a command dialog.
- Typing filters by component name, category, export path, and keywords.
- Selecting a search result closes the dialog and navigates to the selected view.
- `Escape` closes search.
- Keyboard navigation in search should use the existing `@kkb/ui` command primitives.
- Hover/focus states should be clear but restrained.
- Scroll behavior should preserve orientation; focused views should start at top of canvas.

Motion should be minimal and stateful: search overlay open/close, hover/focus, and maybe view transition crossfade. Respect reduced motion.

## 8. Content requirements

### Catalog inventory

Must include every exported UI component under `packages/ui/src/components`, including:

- accordion, alert-dialog, alert, aspect-ratio, avatar, badge, breadcrumb
- button, button-group
- calendar, carousel, chart
- checkbox, code, collapsible, combobox, command
- context-menu, dialog, drawer, dropdown-menu
- empty, field, form, hover-card
- input, input-group, input-otp, item, kbd, label
- menubar, mode-toggle, native-select, navigation-menu
- pagination, popover, progress, radio-group, resizable
- scroll-area, select, separator, sheet, sidebar
- skeleton, slider, sonner, spinner, switch
- table, tabs, textarea, toggle, toggle-group, tooltip
- audio components: player-controls, playhead, waveform, plus full audio composition/presenter where appropriate

Also account for non-component exports where they belong:

- hooks: `use-mobile` can be documented in a utility/hooks category, not forced into visual preview
- `json-render` exports should get a catalog/example surface if they are part of `@kkb/ui`'s public library story

### Copy style

- Use compact technical labels.
- Avoid marketing claims.
- Prefer source-oriented metadata:
  - `@kkb/ui/components/button`
  - “Input”
  - “4 examples”
  - “interactive”
- Descriptions should explain what the component is for and what states are demonstrated.

### Demo content

Important components should have composed examples:

- Button / Button Group / Toggle Group: toolbar/action clusters
- Form / Field / Input / Select / Checkbox / Radio / Switch: realistic settings form
- Dialog / Sheet / Drawer / Popover / Dropdown / Command: interaction demos with controlled state
- Table / Chart / Pagination: compact data/workbench views
- Sidebar / Navigation Menu / Breadcrumb / Tabs: navigation shell examples
- Audio: full player and lower-level audio primitives
- Tokens: live swatches and typography/radius/spacing specimens

No lazy one-off controls if an `@kkb/ui` primitive exists.

## 9. Recommended references for implementation

During implementation, use:

- `reference/craft.md` if proceeding with end-to-end build.
- `reference/layout.md` for the shell/canvas/rail topology.
- `reference/harden.md` for keyboard access, responsive behavior, errors, and edge cases.
- `reference/audit.md` after implementation for accessibility, responsive, and interaction checks.
- `reference/polish.md` once the catalog structure is correct.

## 10. Open questions

None blocking. The key direction is confirmed enough:

- component/category navigation, with design tokens as their own category/view
- light and dark support using existing KKB tokens
- complete `@kkb/ui` export coverage
- richer composed demos for important components
- shadcn/create layout/search model, not preset-generation behavior

## 11. Implementation status and follow-up notes

A first implementation pass now exists in `apps/web/components/ui-catalog/catalog-workbench.tsx`, with `apps/web/app/ui/page.tsx` reduced to a Suspense wrapper around the client workbench. It establishes the core architecture: URL-backed `?item=` selection, command search, persistent catalog rail, preview/focused/category/design-system views, and full public export inventory coverage.

This pass is only a structural baseline. It is not visually final. Browser review showed the catalog is still materially off from the intended shadcn/create reference and needs another substantial design pass before it should be considered aligned.

### Current known design issues

- The catalog still feels too visually busy and bloated compared with the shadcn/create reference. The surface needs stronger restraint: fewer labels, fewer icons, less explanatory copy, and less wrapper chrome around examples.
- The Preview view is closer after cleanup, but still misses the reference's clean preview-wall quality. It should feel like a dense component mosaic, not a metadata catalog.
- Individual component views are still too wrapped in generic specimen panels. The desired model is closer to the shadcn/create Card view: a few clean examples laid out plainly, showing variants and realistic use cases without excess explanation.
- Many examples still read as placeholder/demo scaffolding rather than definitive component documentation. Important components need intentionally composed examples; minor components need minimal, direct variant coverage.
- The left rail now scrolls independently, but the overall rail density, grouping, active states, and footer counters still need refinement. It should feel like navigation, not a dashboard/sidebar widget.
- The design-system view is directionally acceptable, but still needs cleanup and a more deliberate token/specimen hierarchy.
- The page currently supports light and dark mode, but both themes need visual QA for contrast, density, and alignment against the KKB design system.
- The implementation should be reviewed for mobile/tablet behavior. The current pass focused on desktop workbench structure first.

### Current known technical issues / risks

- The workbench is a large client component. It should be split into smaller catalog data, shell, search, preview, and example modules before the next major iteration.
- Category and component inventory is manually declared. This is acceptable for the first pass, but coverage can drift unless tests or generation are added.
- Some focused examples still reuse broad category examples, so selecting different components in the same family can show overly similar content.
- The chart preview avoids a direct `recharts` app import for dependency hygiene, but the real `@kkb/ui` chart component still needs a focused example that does not require `@kkb/web` to import transitive dependencies directly.
- Page tests were updated to account for the Suspense/client workbench boundary. A future DOM/App Router harness would provide stronger route-level coverage than server string rendering.

### Next pass goals

1. Rework Preview to more closely match the shadcn/create preview wall: direct live components, minimal headers, no metadata-heavy framing.
2. Rework focused component views to show only variants and 1-2 composed examples, with minimal page chrome.
3. Simplify the rail: tighter grouping, cleaner active state, fewer decorative icons/counters.
4. Split `catalog-workbench.tsx` into smaller modules and move catalog data out of the view file.
5. Add targeted tests for `?item=` routing, search selection, category views, and scroll containment.
