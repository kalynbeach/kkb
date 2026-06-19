---
target: apps/web home page
total_score: 20
p0_count: 0
p1_count: 2
timestamp: 2026-06-19T23-29-46Z
slug: apps-web-app-page-tsx
---
#### Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | The home page gives no active location, section grouping, or signal about what kind of workspace the user is entering. |
| 2 | Match System / Real World | 2 | Labels are technically familiar to the repo owner, but `binaural`, `ui`, and `json-render` are unexplained for collaborators. |
| 3 | User Control and Freedom | 3 | The surface is simple link navigation; browser back works, but there is no recovery or orientation once a route choice is wrong. |
| 4 | Consistency and Standards | 3 | Typography and neutral palette align with KKB tokens; the homepage is much thinner than the richer instrument/demo surfaces it points to. |
| 5 | Error Prevention | 2 | No destructive actions exist, but the nav does not prevent wrong turns because route purpose and readiness are unclear. |
| 6 | Recognition Rather Than Recall | 2 | All options are visible, but users must remember or infer what each route contains. |
| 7 | Flexibility and Efficiency | 2 | Keyboard tabbing works; there is no search, recent route, grouped navigation, or power-user path. |
| 8 | Aesthetic and Minimalist Design | 2 | Minimal, but under-composed: the center cluster feels like a placeholder rather than an intentional studio index. |
| 9 | Error Recovery | 1 | There are no inline cues for broken, experimental, or in-progress destinations and no path help from the index itself. |
| 10 | Help and Documentation | 1 | No contextual explanation or docs entry point appears on the home page. |
| **Total** | | **20/40** | **Acceptable, but significant improvements needed before collaborators are well served.** |

#### Anti-Patterns Verdict

**Start here.** This does not look like generic gradient-card AI slop. It has the opposite problem: it looks like an untouched scaffold.

**LLM assessment**: The page avoids the common banned patterns: no gradient text, glass cards, hero metrics, soft-card grids, tiny eyebrow scaffolding, or decorative stripes. The minimal TX-02-like center lockup is on-brand in isolation, but the design currently stops at “five links in a row.” It does not yet communicate the KKB promise: a coherent technical creative workshop with audio, oscilloscope, UI, and rendering experiments.

**Deterministic scan**: `detect.mjs --json apps/web/app/page.tsx` returned `[]`. No automated slop findings were reported.

**Visual overlays**: No reliable user-visible overlay is available. Mutable browser injection failed in this agent-browser session: setting `document.title` and appending a script did not persist, so the live overlay path was skipped by rule. Browser evidence used snapshot and screenshots instead.

#### Overall Impression

The homepage is quiet, sharp, and token-compatible, but too low-information to function as a product home. It is an index, not a landing surface. The biggest opportunity is to turn it into a compact studio map: still restrained, still technical, but with enough hierarchy and route context that first-time collaborators can choose confidently.

#### What's Working

1. **No generic SaaS decoration.** The page is not over-designed. It respects the product register and avoids the usual AI visual tells.
2. **Typography direction matches the system.** Mono heading and labels align with the KKB design system’s TX-02 technical voice.
3. **Keyboard focus exists.** Tabbing reaches the links and the native focus outline is visible on `audio`, so the basic keyboard path is not hidden.

#### Priority Issues

**[P1] The navigation likely overflows on narrow screens**
- **Why it matters**: The nav is `flex gap-6` with no wrapping. The five link labels plus 24px gaps are wider than a 320px viewport, especially inside `p-8`. A distracted mobile user will see clipped or horizontally scrolling navigation.
- **Fix**: Use `flex flex-wrap justify-center gap-x-4 gap-y-3` or a two-column/mobile stacked structure. Preserve the compact technical rhythm, but make the target list structurally responsive.
- **Suggested command**: `$impeccable adapt apps/web/app/page.tsx`

**[P1] Route choices are unexplained**
- **Why it matters**: The homepage asks the user to choose between five technical nouns with no descriptors, readiness states, or primary path. Collaborators who are not already inside the repo have to guess what `json-render`, `ui`, or `binaural` means.
- **Fix**: Add one compact line of product context under `KKB`, then add short route descriptions or grouped labels: audio/instrument, visualization, UI system, rendering. Keep it dense; do not turn it into marketing cards.
- **Suggested command**: `$impeccable clarify apps/web/app/page.tsx`

**[P2] The page has no visual hierarchy beyond the logo**
- **Why it matters**: Everything after `KKB` has equal weight. The surface does not guide the user toward the most important or currently active experiment.
- **Fix**: Introduce a deliberate “current workbench” or “primary surface” affordance, such as one emphasized route row with a terse status, then secondary route links below. Use borders/spacing rather than shadows or cards.
- **Suggested command**: `$impeccable layout apps/web/app/page.tsx`

**[P2] Touch targets and hover/focus states feel underbuilt**
- **Why it matters**: The links are 14px text with no padding. Desktop precision is fine, but mobile taps and keyboard focus feel fragile. The target area is text-only, not instrument-grade control.
- **Fix**: Give links a small consistent hit area (`min-h-10`, horizontal padding, subtle hover/focus background) while keeping the square technical radius from the design system.
- **Suggested command**: `$impeccable audit apps/web/app/page.tsx`

**[P2] The homepage underuses KKB’s own identity**
- **Why it matters**: KKB’s brand is “technical, rhythmic, detailed, beautiful, bold.” This page is technical and restrained, but not rhythmic, detailed, or especially confident. It undersells the stronger audio and oscilloscope work behind it.
- **Fix**: Add a compact workshop index treatment: route metadata, status chips, package ownership hints, or a thin instrument-like rail. Use neutral structure first; reserve audio blue/oscilloscope green only for scoped route hints if needed.
- **Suggested command**: `$impeccable bolder apps/web/app/page.tsx`

#### Persona Red Flags

**Alex (Power User)**: The five links are fast to scan, but there is no “recent,” “active,” or “primary” route. Alex can tab through links, but there are no accelerators, route grouping, or a command/search affordance if the index grows.

**Jordan (First-Timer)**: Jordan sees `KKB` and five lowercase labels. There is no explanation that this is a technical creative workspace, no indication which route is most useful, and no help text for jargon-heavy destinations like `json-render`.

**Sam (Accessibility-Dependent User)**: Links are semantic and focusable, which is good. The weak point is target size and structure: text-only links with no landmarks beyond `nav` make the page accessible but not especially forgiving at high zoom or touch-equivalent input.

**Collaborator Reviewer (Project-specific)**: A peer opening a shared demo needs to know where the active experiment lives. The current home page does not distinguish production-ish demos from early experiments, so review effort starts with route guessing.

#### Minor Observations

- The Next.js dev tools floating button appears in the screenshot and competes visually during development; ignore for production critique.
- Lowercase labels fit the technical voice, but `binaural` may be too abbreviated compared with route name `/binaural-beats`.
- `min-h-svh` centers the cluster elegantly, but a pure center lockup can feel empty on larger displays without a small amount of contextual structure.
- Contrast appears acceptable for `text-muted-foreground` on white, but the small mono labels are visually light; do not make them any quieter.

#### Questions to Consider

- What should a collaborator understand in the first five seconds: “this is Kalyn’s workspace,” “pick a demo,” or “go to the active experiment”?
- Is the homepage meant to be a permanent studio index, or just a temporary route switcher during early development?
- Which route deserves primary emphasis today: `audio`, `oscilloscope`, or the shared `ui` system?
- Should experiment readiness be visible on the home page, or intentionally hidden until each route?
