# Base UI primitive migration record

Date: 2026-07-30
Issue: [#77](https://github.com/kalynbeach/kkb/issues/77)

## Generator baseline

The migration used the repository-locked tools and packages:

- `@base-ui/react` 1.6.0
- shadcn 4.13.1
- registry retrieval: 2026-07-30T05:50:41Z
- fetched items: the Batch 0 reference set plus every migrated shared primitive
- concatenated registry-response SHA-256: `28b5fae00a0fc58c7d8c4e289aae2fbaba17eaaaf16718f3fb48023b736ab145`

shadcn 4.13.1 does not support a top-level `base` key in `components.json`. It derives the primitive base from the style prefix. Its `base-new-york` registry is not published, so both workspace configs use `style: "base-vega"`. This is generator/reference metadata only: the Vega preset was not applied, component files were not overwritten by the CLI, and KKB tokens, radius-none geometry, typography, dimensions, and semantic presentation remain authoritative.

`shadcn info` reports Base + Phosphor, and dry runs resolve `@base-ui/react`. Registry sources were inspected with `view`, `--dry-run`, and `--view`; local sources were reconciled explicitly.

## Interface conventions

- Composition uses Base UI `render`; migrated public interfaces do not expose `asChild`.
- Boolean-first open callbacks and Base event details flow through Base roots.
- Select and RadioGroup retain string values. Single ToggleGroup retains a string, multiple ToggleGroup retains `string[]`, and Slider retains `number[]`; Base event details are the second callback argument.
- AspectRatio uses native CSS `aspect-ratio`, and Label uses a native `<label>`.
- `PopoverAnchor` was removed because Base UI 1.6.0 has no Popover Anchor part. No compatibility adapter was added, and source verification found no owned caller; consumers must use the Base trigger or Positioner `anchor` contract.
- Sheet remains a Dialog presentation, HoverCard maps to Preview Card, and DropdownMenu/ContextMenu/Menubar map to Base Menu.
- Base presence attributes (`data-open`, `data-checked`, `data-active`, `data-pressed`) and unprefixed positioning variables replace Radix state and `--radix-*` contracts.
- Touched primitive icons use direct Phosphor imports. #74 still owns untouched Lucide consumers.

## Retained transitive Radix owners

No workspace manifest directly depends on `radix-ui`. Bun ownership traces retain Radix only through:

- `@json-render/shadcn@0.19.0` → `radix-ui@1.4.3` and its component packages;
- `cmdk@1.1.1` → `@radix-ui/react-dialog` and supporting focus/portal packages;
- `vaul@1.1.2` → `@radix-ui/react-dialog` and supporting packages.

These packages remain intentional because JSON-render, Command, and Drawer rewrites are outside #77.

## Verification contract

The implementation is accepted only with frozen installation, repository type checks, tests, builds, Biome, source/dependency searches, and representative real-browser checks. Happy-dom interaction tests cover fast regression behavior but do not replace browser verification of focus, dismissal, keyboard traversal, scroll locking, portals, and floating positioning.

## Automated verification

The reviewed repair passed the `@kkb/ui` and `@kkb/web` type checks, both workspace test suites, the repository Biome check, and the `@kkb/web` production build. Focused tests cover AlertDialog action dismissal and handler composition, Accordion collapse policy, range Slider SSR inputs and catalog-consumer names, Separator semantics, vertical Tabs, shared Toggle variants, DropdownMenu open/select/close behavior, NavigationMenu viewport anatomy, Select and RadioGroup string callbacks, single and multiple ToggleGroup values, and the Form label/description render relationship.

## Browser verification

Recorded 2026-07-30T06:46:47Z by the parent coding agent with Google Chrome 150.0.7871.187 on macOS 26.5.2.

- Desktop, 1440×900, light and dark: `/ui` and the docs landing page rendered without document overflow. The docs Home and GitHub links retained their text and destinations.
- Mobile, 390×844, light and dark: `/ui`, `/audio`, `/binaural-beats`, and `/oscilloscope` matched the viewport width without document overflow.
- AlertDialog: Delete opened the modal, initial focus moved to Cancel, the action dismissed the modal, body scroll locking cleared, and focus returned to Delete capture.
- Select: the Base listbox opened, ArrowDown and Enter selected Focused, the popup closed, and focus returned to the trigger.
- DropdownMenu: pointer opening, End traversal, Escape dismissal, and delayed focus restoration to the trigger passed.
- Popover: the open popup exposed `role="dialog"` with a valid `aria-labelledby` relationship to `PopoverTitle`. A focused WCAG 2 A/AA axe scan reported zero violations; incomplete results were limited to Base focus guards and the out-of-scope Drawer trigger.
- Slider: every focused Slider range input exposed an accessible name. ArrowRight changed the Binaural Beats Carrier input from 400 to 401 and synchronized the visible `401 Hz` value.
- NavigationMenu: opening Catalog rendered the Base content and viewport target with expanded trigger state.

The broad `/ui` axe scan also surfaced pre-existing catalog-demo findings outside #77: an unlabeled chart container, an audio swatch contrast failure, and overlap-sensitive contrast checks. The migrated unnamed Select trigger found during that scan was corrected with an explicit `Preview mode` label.
