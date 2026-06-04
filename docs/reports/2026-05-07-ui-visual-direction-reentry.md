# UI Visual Direction Re-entry

**Date:** 2026-05-07  
**Repo:** `kkb`  
**Scope:** `packages/ui`, `apps/web`, `apps/docs`, and current app UI routes

## Purpose

This report captures the current UI re-entry context and the emerging visual direction for the `kkb` monorepo. It exists so future work can continue from the latest docs, issues, local session history, and the newly clarified shadcn/ui preset target instead of rediscovering the same context.

## Executive summary

The current global UI across `@kkb/ui`, `@kkb/web`, and route-specific feature UIs does not match the desired visual direction.

The desired direction is based on the shadcn/ui preset shown in the reference screenshot:

`/Users/kalynbeach/Desktop/Screenshot 2026-05-07 at 6.33.32 PM.png`

The screenshot is a shadcn/ui Create page using preset code:

```text
b1D0enCq
```

Decoded preset values:

```json
{
  "style": "mira",
  "baseColor": "neutral",
  "theme": "neutral",
  "chartColor": "neutral",
  "radius": "none",
  "font": "geist-mono",
  "fontHeading": "inherit",
  "iconLibrary": "phosphor",
  "menuColor": "default",
  "menuAccent": "subtle"
}
```

High-level visual target:

- monochrome / neutral-first
- dark, dense, utilitarian application surfaces
- hard edges / no radius
- mono typography as a strong identity layer
- subdued borders and low-chroma panels
- restrained contrast, no decorative gradients by default
- functional dashboard/instrument feel rather than generic glossy dark mode

Current repo state differs materially from this:

- `packages/ui/components.json` uses `style: "new-york"`.
- `packages/ui` is currently Radix-based, while the screenshot URL uses `base=base`.
- `packages/ui/components.json` uses `iconLibrary: "lucide"`, not Phosphor.
- `packages/ui/src/styles/globals.css` sets `--radius: 0.45rem`, not `none`.
- App routes use many route-local raw color classes, alpha whites, custom gradients, and one-off panel systems.
- `/audio`, `/oscilloscope`, `/binaural-beats`, `/ui`, `/json-render`, and the home page do not yet feel like one coherent product family.

## Current source-of-truth docs

Start with these files when resuming UI work.

### Global orientation

- `README.md`
  - Current workspace and route inventory.
  - Confirms `packages/ui`, `/ui`, `/audio`, `/oscilloscope`, `/json-render`, and `/binaural-beats`.
  - Current package boundary: `packages/ui` owns reusable primitives and presentation surfaces; app orchestration stays in apps.

- `AGENTS.md`
  - Durable project guidance.
  - Important UI rule: treat `@kkb/ui` as the default base for shared styles, components, hooks, and utilities.
  - Before creating app-local reusable primitives, inspect `packages/ui` and prefer composing existing `@kkb/ui` building blocks.

- `DESIGN.md`
  - Current design system guide.
  - Currently documents Geist for prose/body copy and TX-02 for headings, labels, code, metadata, telemetry, and hardware-style UI.
  - Needs refinement to make the Mira neutral preset direction explicit.

- `packages/ui/README.md`
  - Very thin today.
  - This aligns with open issue #43: document `@kkb/ui` package surface and contribution rules.

### UI catalog and `@kkb/ui`

- `docs/plans/2026-03-19-ui-component-catalog.md`
- `docs/plans/2026-03-20-ui-catalog-issue-18-scaffold.md`
- `docs/plans/2026-03-21-ui-catalog-issue-19-demo-islands.md`
- `docs/plans/2026-03-29-ui-catalog-next-pass-overhaul.md`
- `docs/reports/2026-03-28-ui-package-preset-migration.md`
- `docs/specs/ui-audit-tailwind-shadcn.md`

### Audio and oscilloscope UI

- `docs/reports/dogfood-audio-page.md`
- `docs/plans/2026-03-20-audio-ux-follow-up-gaps.md`
- `docs/reports/2026-03-28-monorepo-prioritized-next-steps.md`
- `docs/plans/2026-04-04-browser-oscilloscope-ui-refactor.md`
- `docs/reports/2026-04-04-oscilloscope-design-critique.md`
- `docs/reports/2026-04-04-oscilloscope-browser-smoke.md`
- `docs/reports/2026-04-21-project-reentry-recommendation.md`
- `docs/reports/2026-04-30-audio-runtime-adapter-architecture.md`

Important boundary from `docs/reports/2026-04-30-audio-runtime-adapter-architecture.md`:

`@kkb/ui` should remain presentation-only.

Good fit for `@kkb/ui`:

- player controls
- playhead
- waveform surface
- badges/status presentation
- layout primitives

Avoid for now:

- full audio player product
- runtime/session ownership
- catalog ownership
- URL persistence

### Binaural beats MVP

The newly merged `/binaural-beats` work is now part of the UI landscape.

Relevant docs:

- `docs/plans/2026-05-01-binaural-beats-mvp.md`
- `docs/research/binaural-beats/`

Relevant implementation files:

- `apps/web/app/binaural-beats/page.tsx`
- `apps/web/components/binaural-beats/binaural-beats-client.tsx`
- `apps/web/lib/binaural-beats/create-binaural-beat-engine.ts`
- `apps/web/lib/binaural-beats/binaural-beat-config.ts`

Relevant commits:

- `14fde8b feat: add binaural beats MVP`
- `232fa62 fix: harden binaural beats teardown`
- `1f74d23 fix: harden binaural beat playback lifecycle`

Current UI shape:

- App-local route UI, not extracted to `@kkb/ui`.
- Composes existing `@kkb/ui` primitives:
  - `Button`
  - `Field`, `FieldContent`, `FieldGroup`, `FieldLabel`
  - `Input`
  - `Slider`
- Adds feature-specific presentation:
  - stereo tone session hero panel
  - left/right channel visual markers
  - numeric + slider controls for carrier, beat, volume, fade
  - play/stop button with `Starting` / `Stopping` states
  - safety guidance panel
  - `aria-live` playback status

Boundary implication:

- The current app-local placement is correct for an experiment.
- If this UI pattern recurs, extraction candidates are smaller pieces, not the whole screen:
  - number + slider control
  - audio safety notice presentation
  - tone/session status display
  - dense instrument panel layout primitives

## Relevant open GitHub issues

Current UI-related open issues discovered during re-entry:

- #16 `ui: deduplicate font files and shared layout across apps`
- #32 `ui: overhaul /ui into a curated reference surface`
- #35 `ui: evaluate @kkb/ui preset migration to Base UI and base-mira`
- #37 `audio: replace decorative waveform bars with track-aware waveform data or explicit decorative treatment`
- #38 `audio: add browser smoke coverage for /audio playback flows`
- #39 `audio: define a named audio theme system in @kkb/ui`
- #42 `test(ui): add public import and render smoke coverage for @kkb/ui primitives`
- #43 `docs(ui): document @kkb/ui package surface and contribution rules`
- #44 `ui: define the @kkb/ui json-render support contract`
- #45 `refactor(ui): audit app-local UI patterns for promotion into @kkb/ui`
- #49 `refactor(ui): derive json-render catalog and registry from one component map`

Issue #35 is now especially important because the desired reference screenshot is explicitly the Mira neutral preset direction.

## Local session history worth knowing

Local Pi session logs for this repo live under:

```text
/Users/kalynbeach/.pi/agent/sessions/--Users-kalynbeach-dev-kb-kkb--/
```

Relevant sessions:

- `2026-04-03T18-56-49-413Z_f27b6a1b-4385-457a-a69c-62522c1fef3d.jsonl`
  - Oscilloscope browser verification planning.
  - User emphasized `agent-browser` for browser-based testing and mic verification across all visual states.

- `2026-04-23T23-37-05-685Z_019dbcb4-4b94-72e9-914a-84d9974ffefa.jsonl`
  - Generated actionable GitHub issues from docs, TODOs, and recent work.
  - Created UI follow-up issues including #42, #43, #44, #45, and #49.

- `2026-04-26T23-28-27-565Z_019dcc1f-77ac-7788-842c-8036308159f6.jsonl`
  - Initial `DESIGN.md` work against the Google DESIGN.md spec.
  - Aligned design tokens with `packages/ui/src/styles/globals.css`.

- `2026-04-28T22-43-22-678Z_019dd642-e9b6-7653-888b-7b8f43d8ff56.jsonl`
  - Typography intent update.
  - TX-02 became the mono/technical UI font; Geist remained body/prose.

- `2026-05-01T05-05-16-631Z_019de1ed-4556-768d-b566-4a74e6bd8e19.jsonl`
  - Audio runtime adapter architecture was revised.
  - User requested visual diagram colors use `--audio-*` tokens from `packages/ui/src/styles/globals.css`.

- `2026-05-01T07-29-44-813Z_019de271-896a-74cf-b904-495ba0bab095.jsonl`
  - Binaural beats research and MVP plan were created.

- `2026-05-03T03-58-12-676Z_019debfc-96c4-7090-be9a-bc17d2fa1f42.jsonl`
  - Binaural beats MVP code review and commit.

- `2026-05-03T06-26-59-797Z_019dec84-ce55-751a-805c-abbefaaba0bc.jsonl`
  - Adversarial review and hardening of binaural beat teardown.

- `2026-05-07T19-00-23-476Z_019e03cf-ff33-741d-933b-e141ac433bba.jsonl`
  - PR review fixes for binaural beat playback lifecycle.

## Current visual mismatch

The repo currently has several competing local design systems:

1. **Default shadcn/new-york primitives** in `@kkb/ui`.
2. **Audio-player-specific chrome** with `--audio-*` tokens and skeuomorphic/instrument styling.
3. **Oscilloscope-specific studio-minimal dark surface** from the April critique/refactor work.
4. **Binaural beats route-local dark gradient panels** with raw `white/*`, `sky`, and `amber` Tailwind classes.
5. **UI catalog route patterns** that are useful for verification but not yet a canonical reference surface.
6. **JSON-render demos** that likely need a clearer support contract and visual baseline.

This causes the monorepo to feel fragmented even though the package boundaries are improving.

The desired Mira neutral reference suggests these corrections:

- remove most rounded-card softness
- reduce ornamental gradients
- reduce feature-specific color drift
- move toward neutral surfaces and borders
- make mono typography feel intentional, not incidental
- use semantic tokens instead of raw route-local color classes
- make `/ui` a reference surface for the actual desired KKB look, not just a component zoo

## Recommended implementation strategy

Do not immediately rewrite every route or overwrite all shadcn components.

Use a staged plan.

### Stage 1 — Canonize the visual direction

Goal: make the target explicit before changing code broadly.

Tasks:

- Update `DESIGN.md` to name `b1D0enCq` / Mira neutral as the visual baseline.
- Document the design principles:
  - neutral monochrome by default
  - hard edges / no radius
  - mono-forward UI
  - subdued borders
  - low-chroma surfaces
  - dense application/instrument feel
- Clarify how TX-02 and Geist relate to the preset's Geist Mono value.
  - Current repo intent uses TX-02 as the technical mono identity.
  - The screenshot preset uses Geist Mono.
  - Decision: keep TX-02 as the standard KKB monospace font, remove Geist Mono, add Departure Mono only as a selective secondary lo-fi technical monospace accent, and add EB Garamond as the default serif face.
- Add the screenshot/preset as a reference in docs.

### Stage 2 — Global token alignment

Goal: make the app baseline closer to Mira neutral without broad component churn.

Tasks:

- Update `packages/ui/src/styles/globals.css` semantic tokens.
- Set `--radius: 0` or an equivalent no-radius baseline.
- Align dark theme surfaces, cards, popovers, inputs, borders, rings, and muted colors to the Mira neutral target.
- Keep audio-specific `--audio-*` tokens but review whether they should be quieter and better aligned with the neutral system.
- Update `DESIGN.md` frontmatter values after token changes.

### Stage 3 — Route audit and de-localization

Goal: remove one-off visual systems from app routes.

Routes to audit:

- `apps/web/app/page.tsx`
- `apps/web/app/ui/page.tsx`
- `apps/web/app/audio/page.tsx`
- `apps/web/app/oscilloscope/page.tsx`
- `apps/web/app/binaural-beats/page.tsx`
- `apps/web/app/json-render/page.tsx`

Look for:

- raw `bg-black`, `text-white`, `white/*`, `sky-*`, `amber-*`, and route-specific gradients
- rounded panels that conflict with the no-radius direction
- app-local button/card/input styling that should be semantic or component-driven
- repeated layout primitives that should move to `@kkb/ui`

### Stage 4 — `/ui` becomes the canonical reference surface

Goal: make `/ui` show the desired KKB look.

This aligns with issue #32.

Tasks:

- Reframe `/ui` from broad component catalog to curated visual reference surface.
- Include examples for:
  - dense cards
  - forms
  - tables/lists
  - audio controls
  - instrument panels
  - route shells
  - empty/error/loading states
- Use it for browser visual verification.

### Stage 5 — Decide component migration depth

There are two viable paths.

#### Option A — Light migration

Keep current Radix components and restyle them toward Mira neutral.

Pros:

- smaller immediate change
- less API churn
- faster route polish
- safer for current consumers

Cons:

- may not fully match the screenshot
- component internals remain `new-york`-derived
- Phosphor/Base UI alignment remains incomplete

#### Option B — Full preset migration

Migrate `@kkb/ui` from current `new-york` / Radix / Lucide setup toward Mira neutral / Base UI / Phosphor.

Pros:

- closest to the screenshot
- resolves issue #35 directly
- creates a cleaner future baseline

Cons:

- broad component API churn
- downstream app audit required
- installed component surface is large
- existing custom audio components and local changes need careful preservation

If choosing Option B, first revisit:

- `docs/reports/2026-03-28-ui-package-preset-migration.md`
- `packages/ui/components.json`
- shadcn CLI preset migration workflow

Do not run broad overwrite commands without explicit user approval.

## First recommended slice

Smallest high-leverage slice:

1. Update `DESIGN.md` with the Mira neutral preset direction.
2. Update `packages/ui/src/styles/globals.css` global radius and semantic tokens toward the preset.
3. Update one route, probably `/binaural-beats` or `/ui`, as a visual proof point.
4. Run targeted type/lint checks.
5. Browser-verify with `agent-browser` at the exact local route.

Why `/binaural-beats` is a good proof point:

- It is newly merged and fresh in memory.
- It has clear app-local UI that currently diverges from the target.
- It uses existing `@kkb/ui` primitives but still has raw route-local visual styling.
- It is self-contained enough to refactor without destabilizing audio player or oscilloscope work.

Why `/ui` is also a good proof point:

- It should become the canonical reference surface.
- It exposes many primitives and patterns.
- It supports broader visual regression review.

## Verification expectations

For UI work, use:

- targeted type checks, usually `bun run check-types --filter=@kkb/ui` and/or `bun run check-types --filter=@kkb/web`
- targeted tests where relevant
- `bun run format-and-lint` or focused `bunx biome check <changed-files>` when appropriate
- browser verification with `agent-browser` for exact local routes

For browser verification, prefer short, concrete route checks:

- `localhost:3000/ui`
- `localhost:3000/binaural-beats`
- `localhost:3000/audio`
- `localhost:3000/oscilloscope`

Capture visual findings in a report if the change is broad or subjective.

## Decisions still open

1. **Font decision**
   - Should KKB follow the preset exactly with Geist Mono, or keep TX-02 as the KKB mono identity? Keep TX-02 as the standard KKB mono identity, remove Geist Mono, add Departure Mono as a selective secondary monospace accent, keep Geist as the default sans-serif, and add EB Garamond as the default serif face.

2. **Icon decision**
   - Should `@kkb/ui` migrate from Lucide to Phosphor? Yes.
   - If yes, should this happen with a full component migration or only as route/component usage is touched? Full component migration.

3. **Primitive base decision**
   - Should `@kkb/ui` move from Radix to Base UI to match the screenshot URL? Yes.
   - Or should the screenshot be treated as visual inspiration while retaining Radix? No.

4. **Radius decision**
   - Is `radius: none` truly global, including audio and oscilloscope surfaces, or should specialized instrument surfaces keep small radii? Global radius should be `none`.

5. **Audio visual system decision**
   - Should `--audio-*` remain a distinct sub-theme, or be folded closer to the global Mira neutral tokens? Remain a distinct sub-theme.

6. **Route modernization order**
   - Which route should be the first canonical proof point: `/ui`, `/binaural-beats`, `/audio`, or `/oscilloscope`? `/ui`.

## Working conclusion

The current repo has strong building blocks and improving architecture, but the visual system is fragmented. The newly clarified direction is not generic dark mode; it is a specific Mira neutral, no-radius, mono-forward, dense application UI language.

The next work should make that direction explicit in docs and tokens, then prove it on one route before attempting a full `@kkb/ui` component migration.
