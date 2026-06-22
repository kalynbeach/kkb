# UI Catalog `design/impeccable` Branch Report

**Date:** 2026-06-22
**Branch:** `design/impeccable`
**Scope:** `/ui`, `apps/web/components/ui-catalog`, `docs/plans`

## Purpose

This report summarizes the recent UI study, planning, and implementation work on the
`design/impeccable` branch so the branch can move toward a coherent PR.

The branch is not finished. This is a checkpoint state for a substantial `/ui` catalog
rebuild, not the final architecture. It still needs the planned surface split and a final
route-by-route item-view quality pass before it should be treated as the completed UI
catalog direction.

## Executive summary

The `/ui` catalog has moved from a structurally useful but visually overbuilt catalog
toward a shadcn/create-like `@kkb/ui` inspection workbench.

The most important change is priority: the catalog now treats preview and focused
component specimens as the product surface, while search, rail navigation, source
metadata, and related links are secondary support tools.

The branch currently covers these major outcomes:

- search ranking is deterministic and tested;
- the shell and rail read more like navigation than a dashboard;
- the default preview is a direct component wall instead of a matrix of explanatory
  panels;
- Button, Card, Input, Dialog, Table, audio primitives, and several smaller components
  have focused specimen sheets;
- the Design System page now reads more like a token/specimen reference;
- mobile preserves a preview-first orientation at `390x844`;
- the first known batch of lazy generic item views has been replaced with specific
  specimens.

The main remaining risks are breadth and file shape. Many component item routes are
improved, but the catalog still needs a deliberate audit to ensure every single focused
item route is specific to that component and not a disguised category template. The visual
implementation is also intentionally still concentrated in `catalog-surfaces.tsx` for this
checkpoint; the June 22 plan's split into preview, focused specimen, design-system, and
category modules remains follow-up work.

## Study inputs

### Shadcn/create reference

Primary reference:

```text
https://ui.shadcn.com/create?preset=b1D0enCq&base=base&pointer=true&item=preview
```

The study used shadcn/create as a structural reference, not as a feature checklist.
The useful pattern is:

- compact shell;
- left navigation as support, not content;
- command-first navigation;
- preview wall as the first-class surface;
- focused component views as specimen sheets;
- sparse labels and direct visual comparison.

The branch intentionally does not copy shadcn/create features that are not real KKB
product actions:

- preset generation;
- shuffle controls;
- lock controls;
- Get Code/export workflow;
- embedded docs-site behavior.

### KKB product and design context

The work follows the current KKB product/design direction:

- technical creative workspace;
- instrument-grade clarity;
- neutral-first surfaces;
- TX-02 for compact technical identity;
- Geist for readable prose;
- sharp, border-led structure;
- scoped audio blue and oscilloscope color rather than global decorative color drift;
- shared UI composition before app-local inventions.

The branch keeps `@kkb/ui` as the primitive/component source. It does not migrate
`@kkb/ui` to Base UI and does not change public package exports.

## Planning work

Two plans now describe the branch direction:

- `docs/plans/2026-06-20-ui-catalog-shadcn-create-rebuild.md`
- `docs/plans/2026-06-22-ui-catalog-next-pass.md`

The June 20 plan established the workbench model: URL-backed item selection, command
search, rail navigation, preview/focused/design-system surfaces, and complete public
`@kkb/ui` coverage.

The June 22 plan narrowed the next pass to concrete implementation priorities:

1. fix catalog search ranking/filtering first;
2. simplify the shell and rail;
3. replace the preview panel matrix with a direct component preview wall;
4. rebuild focused pages as component-specific specimen sheets;
5. clean up Design System into token/specimen reference;
6. preserve preview-first mobile behavior.

The June 22 plan also captured the important audit finding that many focused item
routes shared broad category templates. That finding remains the central follow-up
criterion for judging the branch.

## Implementation summary

### Search

A new `catalog-search-index.ts` ranks searchable catalog items with explicit scoring:

- exact label/id match;
- prefix match;
- word match;
- keyword match;
- source path match;
- description match.

The search dialog now uses this ranked flat result list instead of letting category
groups dominate exact component matches.

Targeted tests now assert:

- `button` returns `button`, then `button-group`;
- `input` returns the `Input` component before the `Input` category;
- default search starts with `Preview`, then `Design System`;
- unknown queries return no results.

### Shell and rail

The `/ui` shell is quieter and more navigation-oriented:

- header remains compact;
- rail metadata and decorative noise are reduced;
- `Preview` and `Design System` remain first-class;
- category entries are secondary to component navigation;
- selected item state is clear without turning the rail into a dashboard.

### Preview wall

The default preview no longer reads as a panel taxonomy. It now uses direct component
specimens: controls, forms, navigation, overlays, table/chart, design tokens, and audio
surfaces arranged as a preview wall.

This is still not a perfect final wall, but it is now aligned with the intended mental
model: scan component behavior first, use navigation/search for inventory.

### Focused component views

The branch introduces component-specific specimen routing and metadata so broad duplicate
focused-view signatures are no longer the default.

High-priority pages now have direct specimen sheets:

- Button;
- Button Group;
- Card;
- Input;
- Dialog;
- Table;
- audio waveform/playhead/player controls/composition.

A follow-up pass also replaced the most obvious lazy layout templates:

- Aspect Ratio now shows ratio specimens and a media frame;
- Resizable now shows panel layouts;
- Scroll Area now shows bounded scrolling specimens;
- Separator now shows horizontal and vertical separator states;
- Empty and Item now have focused component-specific examples;
- related links now sit in a quiet footer below the specimen grid.

Additional targeted specimens were added for several feedback, menu, navigation, and data
routes, including Alert, Badge, Command, Code, Kbd, Chart, Carousel, Breadcrumb, Tabs,
Pagination, Dropdown Menu, Context Menu, and Menubar.

### Design System

The Design System surface is now closer to a token/specimen reference:

- color tokens;
- typography;
- radius;
- spacing;
- scoped instrument color;
- terse implementation notes.

It should no longer compete with the catalog taxonomy as the primary way to understand
the component library.

## Verification completed

Targeted checks passed on the branch:

```text
bunx biome check --write apps/web/components/ui-catalog/catalog-surfaces.tsx
bun test apps/web/components/ui-catalog/__tests__/catalog-data.test.ts
bun test apps/web/components/ui-catalog/__tests__/catalog-surface-rendering.test.tsx
bun test apps/web/app/ui/__tests__/page.test.tsx
bun test apps/web/app/ui/__tests__/interactive-demos.test.tsx
bun run check-types --filter=@kkb/web
```

Browser verification was completed against the local dev server at:

```text
http://localhost:3000/
```

Verified desktop routes included:

- `/ui?item=preview`
- `/ui?item=design-system`
- `/ui?item=button`
- `/ui?item=card`
- `/ui?item=input`
- `/ui?item=dialog`
- `/ui?item=table`
- `/ui?item=audio-waveform`
- `/ui?item=aspect-ratio`
- `/ui?item=resizable`
- `/ui?item=scroll-area`
- `/ui?item=separator`

A targeted mobile pass at `390x844` verified that the reported problem routes keep the
first specimen in view, avoid horizontal overflow, and no longer show the old generic
layout template.

## Known remaining gaps

Before opening the PR, or at least before calling the PR complete, run a final focused
item audit across every selectable component route.

The audit should answer:

- does this route show the component itself first?
- does it avoid generic category copy?
- does it avoid broad shared titles like `status stack`, `structured entry`, or
  `visual state` unless those words are genuinely component-specific?
- does it have no broken styles at desktop and `390x844`?
- does the related footer stay below the specimen content?

Likely follow-up work:

- split `catalog-surfaces.tsx`; it is still too large and now carries most of the visual
  specimen implementation;
- continue replacing fallback/category-style focused examples with actual component
  states;
- review light mode separately, not only the default active theme;
- improve open-state specimens for overlay/menu components where static examples are
  still thin;
- verify every public component route with a route-title/specimen-title audit and a
  visual smoke pass;
- decide whether some provider/hook/utility routes should remain compact references
  rather than pretend to be visual components.

## PR framing

A reasonable PR title:

```text
refactor: rebuild ui catalog workbench
```

A useful PR summary:

- rebuilds `/ui` around a shadcn/create-like preview and focused-specimen model;
- adds ranked catalog search with targeted tests;
- simplifies the navigation rail and catalog shell;
- replaces the default preview matrix with direct `@kkb/ui` component specimens;
- upgrades focused item pages for high-impact components and the first broken generic
  layout routes;
- cleans Design System into a token/specimen reference.

The PR should explicitly call out that this is a major direction-setting pass, not the
final exhaustive specimen-quality pass for every component.
