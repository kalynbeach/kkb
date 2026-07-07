---
target: apps/web/app/ui
total_score: 28
p0_count: 0
p1_count: 2
timestamp: 2026-06-22T21-45-50Z
slug: apps-web-app-ui-page-tsx
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Current item, selected rail state, focused search input, and URL state are clear, but search has no result count and demo maturity is not explicit. |
| 2 | Match System / Real World | 3 | The component catalog model is familiar and product-like, but labels such as "All", "covered", and source strings assume too much context. |
| 3 | User Control and Freedom | 3 | Desktop rail, search, and deep links work; compact layouts lose browse control and rely mostly on search. |
| 4 | Consistency and Standards | 3 | Strong @kkb/ui vocabulary and token discipline; preview, category, and focused surfaces still vary in what metadata they expose. |
| 5 | Error Prevention | 2 | Invalid `?item=` silently falls back to preview, and search results do not explain enough before selection. |
| 6 | Recognition Rather Than Recall | 2 | Desktop users can browse by rail, but mobile users need to know what to search for. |
| 7 | Flexibility and Efficiency | 3 | `Cmd+K`, deep links, and related items are useful; source/copy/docs actions are missing. |
| 8 | Aesthetic and Minimalist Design | 3 | The surface is sharp, flat, and on-brand, but the preview wall and rail expose too many equal-weight choices. |
| 9 | Error Recovery | 2 | Demo isolation exists, but the recovery path tells users to inspect the console instead of giving an action. |
| 10 | Help and Documentation | 2 | Source references exist, but usage intent, state coverage, and canonical status are under-explained. |
| **Total** | | **28/40** | **Solid product UI with IA and guidance debt** |

## Anti-Patterns Verdict

**LLM assessment**: This does not read as generic AI SaaS. The UI is square, neutral, compact, token-driven, and credibly aligned with the KKB "instrument-grade" product register. The main residue is not visual gimmickry; it is catalog overexposure. The rail, preview wall, and default search all present large answer sets without enough hierarchy or guidance.

**Deterministic scan**: The detector returned 0 findings for `apps/web/app/ui` and `apps/web/components/ui-catalog`. No gradient text, over-rounded card pattern, side-stripe accent, glass default, or obvious generated-layout trope was detected.

**Visual overlays**: No reliable user-visible overlay is available. Mutable injection was blocked by the browser security policy during the overlay preflight, so `live-server.mjs` was not started and no page overlay was injected. Console logs filtered for `impeccable` returned no messages.

## Overall Impression

The catalog has the right bones: it feels like a real workshop surface rather than a demo dump. The biggest opportunity is to turn it from a dense component museum into an inspection tool that answers: what should I use, why, and how do I carry it into code?

## What's Working

- The visual register is coherent: sharp radii, neutral surfaces, compact type, and restrained color match `PRODUCT.md` and `DESIGN.md`.
- Navigation mechanics are real: URL-addressable items, desktop rail selection, command search, and related items make the surface usable beyond a screenshot.
- Audio color is correctly scoped. The blue instrument treatment stays in audio/waveform contexts instead of becoming a generic brand accent.

## Priority Issues

**[P1] Compact IA collapses into search-only discovery**

**Why it matters**: At mobile width, the rail is hidden and the only visible catalog navigation is the search icon. That is efficient for users who know a component name, but weak for first-time browsing, category scanning, and collaborator review.

**Fix**: Add a compact browse affordance: a category drawer, segmented category switcher, or grouped browse sheet. Keep search for direct jumps, but give mobile users a recognition-based path through Layout, Input, Feedback, Overlay, Menu, Data, Audio, and Utilities.

**Suggested command**: `$impeccable adapt apps/web/app/ui`

**[P1] Search opens as a second giant menu**

**Why it matters**: On empty query, search lists the whole catalog. That duplicates the rail on desktop and becomes a long undifferentiated picker on mobile. It also hides useful metadata: category, source, and why a result matched.

**Fix**: For empty query, show pinned items, current category, and common actions. For typed queries, group results by type/category and show source or category beneath each result. Add a result count and preserve the strong ranking for exact queries like "audio waveform."

**Suggested command**: `$impeccable polish apps/web/app/ui`

**[P2] Preview wall has too many equal-weight specimens**

**Why it matters**: The first viewport is visually clean, but it asks users to parse many small panels with similar weight. It demonstrates breadth, yet it does not establish a primary inspection path.

**Fix**: Make one area dominant, likely the token/type strip plus a "start here" inspection path. Compress secondary specimens into denser rows or tabs. Keep the preview wall useful, but make its hierarchy intentional.

**Suggested command**: `$impeccable layout apps/web/app/ui`

**[P2] Focused pages need stronger usage and recovery affordances**

**Why it matters**: Focused component pages are where the catalog should create trust. They show states, but they do not consistently answer when to use the primitive, how canonical the specimen is, or how to jump from specimen to source/import.

**Fix**: Add a compact header module with "when to use," "source," "copy import," and a state checklist. Replace the `DemoBoundary` recovery copy that points users to the console with retry/open-source actions.

**Suggested command**: `$impeccable harden apps/web/app/ui`

**[P3] Invalid URL state falls back silently**

**Why it matters**: A shared or stale `?item=` link can land on Preview without telling the user the requested item was not found. That undermines collaborator trust.

**Fix**: When `itemFromId` falls back, surface an "Unknown catalog item" notice or normalize the URL back to `/ui`.

**Suggested command**: `$impeccable clarify apps/web/app/ui`

## Persona Red Flags

**Alex, power user**: `Cmd+K` is present and good, but default results are noisy, source paths are not directly actionable, and there is no fast copy-import/open-source action from focused pages.

**Jordan, first-timer**: On mobile, Jordan sees a search icon but no visible category browse path. Labels like "Preview," "All," "covered," and component names assume they already understand the library map.

**Riley, collaborator/reviewer**: Riley can share `?item=` links, but bad item IDs silently fall back. Demo maturity is not obvious, and placeholder specimen copy such as "covered," "ready," and "Run checks" does not distinguish real behavior from illustrative examples.

## Minor Observations

- Browser evidence found no document-level horizontal overflow at `1280x720` or `390x844`.
- Search dialogs were fixed-position and not clipped at desktop or mobile viewport sizes.
- Console warnings/errors were empty during the inspected flows.
- `CatalogNav`, `Section`, `railGroups`, and `groupedItems` appear unused or underused, suggesting an older IA layer may still be hanging around.
- The local Next dev tools bubble overlapped content in one parent screenshot; treat that as dev-only unless it appears in production.

## Questions to Consider

- Is `/ui` meant to be a component museum, or the fastest way to decide which primitive to use?
- If search is the main mobile IA, why does it start with every possible answer?
- What would make a collaborator trust that a specimen is canonical rather than illustrative?
- Should the first screen privilege "inspect the system" or "jump to a known component"?
