---
target: apps/web ui page
total_score: 24
p0_count: 0
p1_count: 2
timestamp: 2026-06-19T23-57-38Z
slug: apps-web-app-ui-page-tsx
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Active section state is clear; individual demo state/status is uneven. |
| 2 | Match System / Real World | 3 | Catalog mental model is familiar, but placeholder/progress copy blurs what is complete vs planned. |
| 3 | User Control and Freedom | 3 | Anchored navigation and standard controls work; no obvious reset/escape affordances for interactive demo state. |
| 4 | Consistency and Standards | 2 | Card vocabulary is consistent at the shell level, but nested cards, mixed radii, and demo chrome drift from the sharp KKB system. |
| 5 | Error Prevention | 2 | Demo controls are safe, but destructive/archive/demo actions are presented without enough consequence framing. |
| 6 | Recognition Rather Than Recall | 3 | Sections and component names are visible; some demos rely on unlabeled preview context. |
| 7 | Flexibility and Efficiency | 2 | Sticky rail and anchors help; no filter/search, compact mode, or quick path through the large catalog. |
| 8 | Aesthetic and Minimalist Design | 2 | Clear baseline, but repeated equal-weight card grids flatten hierarchy and produce a generic component-gallery feel. |
| 9 | Error Recovery | 2 | Standard components likely recover, but the catalog surface does not expose recovery guidance for failed/disabled/demo states. |
| 10 | Help and Documentation | 2 | Intro and section descriptions help, but usage intent/code links/status guidance are missing. |
| **Total** | | **24/40** | **Acceptable: solid foundation, significant hierarchy and catalog-utility improvements needed.** |

## Anti-Patterns Verdict

**LLM assessment**: This does not look like a disposable AI mockup. It has a real product-system foundation: restrained color, sharp neutral surfaces, sticky local navigation, and actual `@kkb/ui` components. The weak point is not gloss; it is generic catalog composition. The page leans on repeated same-sized cards with header/body separators, nested bordered panels, and quiet gray descriptions until almost every section has the same visual weight. For KKB's instrument-grade identity, it needs more decisive grouping, status, and inspection affordances.

**Deterministic scan**: CLI scan of `apps/web/app/ui/page.tsx` and `apps/web/components/ui-catalog` returned `[]`. Browser overlay scan reported **61 anti-pattern findings** on the live page: mostly `nested-cards`, plus `line-length`, `cramped-padding`, `text-overflow`, `gpt-thin-border-wide-shadow`, and `all-caps-body`. The strongest true positives are nested-card density and a few overflow/cramped demo surfaces. The likely false positives are some nested cards that intentionally demonstrate Card primitives, but even those still make the catalog read heavier than necessary.

**Visual overlays**: Detector overlays were injected into the live `[Human]` tab at `http://localhost:3000/ui`; console output reported 61 findings. The live-server used for detector injection was stopped after the scan.

## Overall Impression

The UI page is competent and useful, but it currently feels more like a shadcn demo inventory than a KKB workshop instrument. The biggest opportunity is to turn the catalog from a repeated card wall into an inspection surface: clearer completion state, better section rhythm, less nesting, and stronger mapping from component demo to real product usage.

## What's Working

1. **The global shell is disciplined.** The top header, left rail, anchored sections, and restrained palette fit the product register and avoid the glossy SaaS traps.
2. **Component coverage is broad and real.** The page exercises navigation, input, feedback, overlay, menu, data, and audio primitives rather than showing static screenshots.
3. **Accessibility foundations are mostly present.** Landmarks, headings, visible link/button text, `aria-current`, and standard component semantics are visible in the accessibility snapshot.

## Priority Issues

### [P1] The page is a wall of equal-weight component cards

**Why it matters**: The primary task is inspection, but every component competes for equal attention. Users cannot quickly tell what is stable, what is newly added, what needs review, or which demos are most important.

**Fix**: Add an inspection-oriented hierarchy: a compact catalog status strip at the top, section-level completion/status metadata, and one featured/wide demo only where it teaches a composition. Collapse lower-priority examples into tighter rows or tabs instead of identical cards.

**Suggested command**: `$impeccable layout apps/web/app/ui/page.tsx`

### [P1] Nested card patterns undermine the sharp product system

**Why it matters**: KKB's design system says panels should be machined and flat. Many demos place bordered cards inside bordered cards inside a bordered catalog card. The detector flagged this repeatedly, and the screenshots show the result: heavy edges, high visual noise, and less confidence in the design language.

**Fix**: Keep `ComponentCard` as the outer frame, then make demos use unboxed rows, split panes, inset tables, or tonal bands. When demonstrating `Card` itself, isolate it as a single deliberate exception and label why it is nested.

**Suggested command**: `$impeccable polish apps/web/components/ui-catalog/sections`

### [P2] Typography is readable but not fully aligned with the KKB type voice

**Why it matters**: DESIGN.md says TX-02 carries headings, labels, telemetry, and compact hardware-style UI. The page uses a mostly generic sans hierarchy, so it loses some of the technical workshop character that should distinguish KKB from a generic component catalog.

**Fix**: Apply the system voice selectively: h1/h2 and catalog rail labels should use the mono heading vocabulary; keep Geist for descriptions. Avoid uppercase tracking as a default section scaffold, but use TX-02 for concise status/count/readout elements.

**Suggested command**: `$impeccable typeset apps/web/app/ui/page.tsx`

### [P2] Catalog utility is underdeveloped for power users

**Why it matters**: Once the catalog grows, a sticky section rail is not enough. A reviewer or implementer needs to find a component, inspect states, and understand readiness quickly.

**Fix**: Add a lightweight component filter/search, status chips per section or card, and optional anchors/code references for source files. Keep it product-dense, not decorative.

**Suggested command**: `$impeccable harden apps/web/app/ui/page.tsx`

### [P3] Some demo surfaces have cramped or overflow-prone internals

**Why it matters**: A catalog page should prove component resilience. Text overflow and cramped padding inside the demos signal that the primitives may fail under real content.

**Fix**: Audit the specific demo cards flagged by the browser detector, especially resizable panels, aspect-ratio content, and dense metadata rows. Add min-width handling, better wrapping, and explicit compact-state treatment.

**Suggested command**: `$impeccable audit apps/web/app/ui/page.tsx`

## Persona Red Flags

**Alex (Power User)**: Alex can use the left rail, but cannot search for a component, jump to a source file, filter to changed/new components, or quickly identify unstable demos. The catalog works as a scrollable showcase, not yet as a fast implementation tool.

**Sam (Accessibility-Dependent User)**: The heading/landmark structure is decent, but the page contains a very large number of focusable controls from every demo at once. Keyboard traversal through the whole catalog is long and noisy. Demo controls need stronger grouping, and nonessential interactive demos may need preview/activate patterns.

**Kalyn / collaborator reviewer**: A collaborator can see what components exist, but not why each one matters, whether it is ready, or where to edit it. The page does not yet communicate the workshop workflow: component provenance, state coverage, and validation status.

## Minor Observations

- The intro says "full audio player composition" but does not warn that audio controls appear twice in the accessibility tree.
- `Sections` in the left rail uses the tiny uppercase tracked pattern; it is tolerable once, but KKB could use a more instrument-like label/readout treatment.
- The mobile horizontal section nav is practical, but likely becomes a long chip strip as sections grow.
- The Next.js dev tools button appears in screenshots and snapshots; it should be ignored for product critique but can pollute QA impressions.
- The mode toggle is accessible by label, but visually floats alone; it could align better with catalog status/actions.

## Questions to Consider

- What should a reviewer know in the first 10 seconds: component coverage, readiness, or visual quality?
- Which components deserve full card demos, and which should be compact state rows?
- Should this page optimize for browsing the design system, verifying regressions, or helping agents choose the right primitive?
