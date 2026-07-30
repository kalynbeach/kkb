# Base UI primitive migration plan

Date: 2026-07-29
Issue: [#77 — refactor(ui): migrate shared primitives from Radix to Base UI](https://github.com/kalynbeach/kkb/issues/77)
Status: ready for implementation

## 1. Objective

Migrate the owned `@kkb/ui` primitive foundation from `radix-ui` to `@base-ui/react` without redesigning KKB, introducing Radix compatibility layers, or combining the work with the later monorepo-wide Phosphor sweep.

The migration is complete when:

- shadcn generation in `packages/ui` and `apps/web` targets Base UI and Phosphor;
- owned source no longer imports the direct `radix-ui` package;
- the direct `radix-ui` dependency and root catalog entry are removed;
- affected consumers use intentional Base UI interfaces such as `render`, Base event details, and Base state attributes;
- KKB geometry, semantic tokens, component anatomy, accessibility, and public component names remain coherent;
- focused tests, type checks, production builds, Biome, and representative browser checks pass for every batch and for the final repository state.

## 2. Current evidence

At `debab0e`:

- 34 files under `packages/ui/src/components` import from `radix-ui`.
- `packages/ui/src/components/combobox.tsx` is the sole owned Base UI primitive implementation.
- `packages/ui/package.json` declares `@base-ui/react ^1.6.0`, `radix-ui`, and shadcn `^4.13.1`.
- `packages/ui/components.json` and `apps/web/components.json` select Phosphor but do not declare `"base": "base"`, so shadcn still resolves Radix templates.
- The installed modules are stale relative to the lockfile: local `@base-ui/react` is 1.5.0 and local shadcn is 4.11.0, while `bun.lock` resolves Base UI 1.6.0 and shadcn 4.13.1.
- Owned consumers rely on Radix-derived interfaces: `asChild`, compound parts, controlled `open` and `value` callbacks, portals, positioning props, Radix state attributes, and `--radix-*` positioning variables.
- Current interaction coverage is concentrated in `apps/web/app/ui/__tests__/interactive-demos.test.tsx` under happy-dom. Real-browser focus, dismissal, keyboard traversal, scroll locking, and floating positioning are not automated.
- `@json-render/shadcn` owns a separate Radix-backed renderer and retains transitive Radix and Lucide dependencies. `cmdk` and `vaul` also retain Radix subpackages for Command and Drawer behavior. JSON-render is outside the active design-system roadmap, but it is not the only possible transitive owner.

## 3. Fixed decisions

### Preserve KKB, not Radix compatibility

- Keep intentional KKB component names, variants, `data-slot` hooks, semantic tokens, radius-none geometry, and accessible behavior.
- Replace `asChild` with the Base/shadcn `render` composition model in migrated interfaces and update all owned consumers in the same batch.
- Do not carry both `asChild` and `render`, add a Slot compatibility adapter, or preserve Radix-derived prop types merely to reduce migration edits.
- Use generated Base templates as reference implementations, not overwrite sources. Reconcile each file manually so KKB classes and behavior remain deliberate.

### Keep the visual contract stable

- Do not apply the historical `base-mira` preset or reset `globals.css`.
- Keep the current `new-york` style metadata, KKB semantic tokens, typography, component dimensions, and approved functional-roundness exceptions.
- Migrate icons in touched primitive files to Phosphor using the conventions established by #73. Leave untouched Lucide consumers to #74.

### Use explicit non-Base implementations where Base has no matching primitive

- Replace `AspectRatio` with a small native CSS `aspect-ratio` implementation retaining the KKB component name and `ratio` contract.
- Replace the shared Radix `Label` wrapper with a styled native `<label>`. Use Base Field parts only where a field module actually benefits from them.
- Keep `Sheet` as a presentation over Base Dialog. Do not change it to Drawer semantics.
- Map KKB `HoverCard` to Base `PreviewCard`, and KKB `DropdownMenu` to Base `Menu`.
- Keep `Form` as the existing React Hook Form integration. Replace its Slot/Label seams without rewriting the module around a second form abstraction.

### Bound external and transitive scope

- Do not rewrite `@json-render/shadcn`, `cmdk`, or `vaul`, or attempt to remove their justified transitive Radix packages in #77. Record an exhaustive owner inventory rather than attributing all residual Radix code to JSON-render.
- Do not add a browser-test framework or CI build job in this issue. Record the existing production build and representative browser checklist for every batch. CI build coverage can remain a separate change.
- Do not redesign routes, component interfaces unrelated to Base migration, or audio/oscilloscope behavior.

### Interface migration contract

Batch 0 must verify the exact Base UI 1.6.0 types and fetched shadcn 4.13.1 templates, then correct this contract before source migration if either differs:

- **Composition:** replace `asChild` with Base/shadcn `render`; remove Radix Slot prop types and update owned callers atomically. Do not expose both props.
- **Open state:** retain caller-used `open`, `defaultOpen`, and boolean-first `onOpenChange`; expose the Base event-details argument rather than suppressing it. Remove unsupported Radix-only root props.
- **Value state:** retain caller-used first values—string for Select/RadioGroup/ToggleGroup and `number[]` for Slider—while exposing Base event details. App adapters may translate Base details only at an app-owned seam; shared components do not emit parallel Radix-shaped callbacks.
- **Checked/pressed state:** expose Base Checkbox, Switch, and Toggle values and event details. Update field selectors and callers to the emitted Base attributes.
- **Menus:** replace Radix `onSelect` and trigger composition with the actual Base Menu click/selection interfaces. Update owned consumers in the menu sub-batch; do not translate both event models.
- **Positioning:** keep KKB/shadcn convenience props such as `side`, `align`, and offsets only where the Base wrapper intentionally routes them to a Positioner. Remove Radix `position`, collision, CSS-variable, or data-state contracts that Base does not support.
- **Compound names:** keep intentional KKB exports such as `DialogContent`, `SelectItem`, `HoverCardContent`, and `DropdownMenuItem`, while their prop types come from the new Base-backed implementation rather than Radix.

## 4. Batch safety contract

Every implementation batch must be independently reviewable and leave the repository green. Do not begin the next batch while the current batch has unresolved type, behavior, build, formatting, or browser regressions.

For each batch:

1. Preview the relevant Base registry sources through the verified local CLI with `bunx --bun shadcn add <component> --cwd packages/ui --dry-run`, `--diff`, or `--view`; never use `--all`, `--overwrite`, or `init --force`.
2. Add or strengthen the smallest characterization tests for the behavior being replaced before changing the primitive.
3. Reconcile the Base implementation with KKB presentation and public naming.
4. Update every owned consumer affected by the interface change in the same batch.
5. Replace Radix-specific selectors and variables with the actual Base template contract; do not leave dead `data-[state=*]` or `--radix-*` styling behind.
6. Run focused tests first, then affected workspace checks, production builds, Biome, and the batch browser checklist.
7. Record any intentional incompatibility or retained exception before continuing.

Each browser pass must be recorded in the #77 issue or active PR with:

- browser/version and operating system;
- viewport and light/dark mode;
- route and exact interaction performed;
- expected behavior and observed result;
- tester and timestamp;
- screenshot, video, or durable issue/PR note when the behavior is visual.

Happy-dom characterization is fast regression evidence, not real-browser acceptance. The named browser checks below require a real browser and keyboard/pointer interaction where relevant.

Affected-workspace verification baseline:

```bash
bun run check-types -- --filter=@kkb/ui --filter=@kkb/web --filter=@kkb/docs
bun run test -- --filter=@kkb/ui --filter=@kkb/web
bun run build -- --filter=@kkb/web --filter=@kkb/docs
bun run format-and-lint
```

Use narrower focused tests while iterating, but complete the baseline before closing each batch. Commands are non-fix checks; do not use formatter or migration auto-fix modes as validation.

## 5. Implementation batches

### Batch 0 — lock-consistent baseline and generator foundation

Scope:

- restore installed dependencies from the existing lockfile with `bun install --frozen-lockfile`;
- confirm `bunx --bun shadcn --version` and the installed Base UI package match `bun.lock`;
- add `"base": "base"` to `packages/ui/components.json` and `apps/web/components.json`;
- keep `style: "new-york"`, `iconLibrary: "phosphor"`, aliases, and CSS paths unchanged;
- inspect Base registry output for `button`, `dialog`, `select`, `dropdown-menu`, and `sidebar` to establish the composition, overlay, value, menu, and aggregate patterns used later;
- record the shadcn version, retrieval timestamp, registry item/source, and reference-output digest or issue/PR attachment because registry templates are fetched and are not locked by `bun.lock`;
- inventory every remaining `@radix-ui/*` owner with `bun pm why`, including `@json-render/shadcn`, `cmdk`, and `vaul` where confirmed.

Acceptance:

- `bunx --bun shadcn info --cwd packages/ui` reports Base as `base` rather than `radix`;
- a Button dry run requests `@base-ui/react` rather than `radix-ui`;
- an icon-bearing Dialog or Select preview uses Phosphor rather than Lucide;
- the exact Base callback/event-detail signatures are recorded against the interface migration contract;
- no existing component or stylesheet is overwritten;
- the repository baseline still passes.

Stop condition: do not start source migration if the clean install or fetched registry output disagrees with the locked versions or expected Base selection. Resolve the dependency state first; do not downgrade source to match stale modules.

### Batch 1 — composition seam

Owned primitive files:

- `packages/ui/src/components/button.tsx`
- `packages/ui/src/components/badge.tsx`
- `packages/ui/src/components/breadcrumb.tsx`
- `packages/ui/src/components/button-group.tsx`
- `packages/ui/src/components/item.tsx`

Affected support files and consumers include:

- `packages/ui/src/components/input-group.tsx`
- `packages/ui/src/components/combobox.tsx` through `InputGroupButton`
- `packages/ui/src/components/alert-dialog.tsx` where Button renders action/cancel parts
- `apps/docs/app/page.tsx`
- `apps/web/components/ui-catalog/catalog-workbench.tsx`
- the Badge specimen in `apps/web/components/ui-catalog/focused-specimens.tsx`
- the obsolete `asChild` assertion in `apps/web/components/ui-catalog/__tests__/catalog-surface-rendering.test.tsx`

Work:

- establish the project-wide Base `render` convention using the current shadcn Base templates and Base `useRender` only where appropriate;
- remove `asChild` from these migrated KKB interfaces and update all direct consumers;
- preserve CVA variants, `data-slot`, `data-variant`, `data-size`, ref behavior, class merging, event composition, and single-element DOM output;
- do not migrate AlertDialog behavior in this batch; only adapt its internal Button composition if required by the new Button interface.

Characterization and browser proof:

- characterize `InputGroupButton` composition before changing Button;
- verify rendered anchors retain `href`, classes, accessible names, refs, and composed event handlers;
- verify Button and Badge produce one interactive element rather than nested controls;
- replace the Badge specimen label and SSR assertion with the new `render` contract;
- browser-check the docs landing page, `/ui?item=button`, `/ui?item=badge`, and the Combobox specimen.

### Batch 2 — native and low-state foundations

Owned primitive files:

- `aspect-ratio.tsx`
- `label.tsx`
- `separator.tsx`
- `avatar.tsx`
- `progress.tsx`
- `direction.tsx`

Work:

- implement native `AspectRatio` and `Label` modules;
- migrate Separator, Avatar, Progress, and DirectionProvider to Base UI;
- retain the `DirectionProvider` name and `dir` interface; remove the unused `direction` alias unless a new owned consumer is found during implementation;
- preserve Avatar fallback behavior, progress value semantics, orientation, existing `data-slot` hooks, and KKB styling.

Characterization and browser proof:

- cover AspectRatio ratio output, Label association, Progress values, Avatar fallback, separator orientation, and RTL direction propagation;
- browser-check `/oscilloscope`, the AspectRatio/Avatar/Progress focused specimens, and the RTL utility specimen.

### Batch 3 — disclosure and binary state

Owned primitive files:

- `accordion.tsx`
- `collapsible.tsx`
- `checkbox.tsx`
- `switch.tsx`
- `tabs.tsx`

Affected styling consumer:

- `packages/ui/src/components/field.tsx`

Work:

- migrate each compound module to its Base counterpart;
- update trigger composition from `asChild` to `render` where used;
- replace Radix state attributes with Base state attributes from the fetched, version-recorded registry templates;
- in `field.tsx`, add the Base checked selector while retaining the still-live Radix selector needed by RadioGroup; test both paths and remove the Radix selector in Batch 4 after RadioGroup migrates;
- preserve controlled/uncontrolled behavior, disabled states, keyboard traversal, indicator semantics, content mounting behavior, and KKB animations.

Characterization and browser proof:

- test controlled and uncontrolled state, disabled behavior, keyboard activation, emitted values, and `FieldLabel` styling against the actual Base checked attributes;
- browser-check `/ui?item=accordion`, `/ui?item=collapsible`, `/ui?item=checkbox`, `/ui?item=switch`, and `/ui?item=tabs`.

### Batch 4 — value controls

Owned primitive files:

- `toggle.tsx`
- `toggle-group.tsx`
- `toggle-variants.ts`
- `radio-group.tsx`
- `slider.tsx`

Work:

- migrate Toggle and `toggleVariants` before ToggleGroup because the group shares that state styling contract;
- preserve string values from ToggleGroup and RadioGroup;
- remove the temporary Radix checked selector from `field.tsx` after the RadioGroup path uses the Base checked attribute, then rerun both Checkbox and RadioGroup styling assertions;
- preserve the Slider `number[]` contract, controlled/default values, multi-thumb rendering, disabled state, orientation, keyboard stepping, and functional-roundness exception;
- update production consumers only where Base event details require an intentional adapter at the app seam.

Affected production consumers:

- `apps/web/components/oscilloscope/oscilloscope-controls.tsx`
- `apps/web/components/binaural-beats/binaural-beats-client.tsx`

Characterization and browser proof:

- assert exact callback values for single and multi-value controls;
- cover Slider arrow-key behavior and ToggleGroup roving focus;
- browser-check `/oscilloscope`, `/binaural-beats`, `/ui?item=slider`, and `/ui?item=toggle-group`.

### Batch 5 — Select

Owned primitive file:

- `select.tsx`

Related composition:

- `button-group.tsx` selectors targeting `data-slot=select-trigger`
- Select specimens and `apps/web/components/oscilloscope/oscilloscope-controls.tsx`

Work:

- reconcile the Base Select anatomy, value rendering, indicators, popup/positioner split, scrolling controls, collision behavior, and event details;
- remove Radix positioning variables and state selectors;
- preserve the KKB compound names and string-value behavior defined by the interface migration contract;
- update owned callers instead of adding a Radix-shaped compatibility layer.

Characterization and browser proof:

- cover controlled/uncontrolled value, keyboard open/select/close, disabled items, placeholder state, trigger ARIA state, portal rendering, and focus return;
- browser-check Select in `/oscilloscope` and `/ui?item=select` at desktop and mobile widths.

### Batch 6 — dialog family

Owned primitive files:

- `dialog.tsx`
- `alert-dialog.tsx`
- `sheet.tsx`

Affected aggregates and consumers:

- `packages/ui/src/components/command.tsx`
- `apps/web/components/ui-catalog/catalog-search.tsx`
- overlay and focused specimens using Dialog, AlertDialog, or Sheet triggers

Work:

- migrate Dialog first, then AlertDialog, then the Sheet presentation built on Dialog;
- replace trigger/close `asChild` composition with `render`;
- preserve controlled/uncontrolled open state, modal behavior, focus trap and restoration, accessible title/description, close reasons, portal order, semantic scrim, body scroll locking, Sheet side variants, and footer close actions;
- keep Sheet as Dialog behavior rather than changing it to Drawer.

Characterization and browser proof:

- cover pointer and keyboard open/close, Escape, outside dismissal distinctions, initial focus, focus trap, focus return, ARIA relationships, controlled callback details, and portal placement;
- browser-check catalog search, `/ui?item=dialog`, `/ui?item=alert-dialog`, `/ui?item=sheet`, and one mobile Sheet flow.

### Batch 7 — floating overlays

Owned primitive files:

- `popover.tsx`
- `hover-card.tsx` backed by Base PreviewCard
- `tooltip.tsx`

Work:

- migrate portal, positioner, popup, arrow, delay, and trigger composition using current Base templates;
- replace Radix transform-origin variables and side/state selectors;
- preserve controlled Popover behavior, Tooltip accessible association, HoverCard delay behavior, collision handling, and existing KKB visual treatment.

Characterization and browser proof:

- cover pointer and keyboard opening, delays, dismissal, focus restoration, `align="start"`, `side="bottom"`, and viewport collision;
- browser-check `/ui?item=popover`, `/ui?item=hover-card`, and `/ui?item=tooltip` at desktop and mobile widths.

### Batch 8a — DropdownMenu

Owned primitive file:

- `dropdown-menu.tsx` backed by Base Menu

Affected consumers:

- `packages/ui/src/components/mode-toggle.tsx`
- dropdown-menu demos, preview wall, and focused specimens

Work:

- establish Base Menu item, group, submenu, checkbox, radio, indicator, trigger, event-detail, portal, and positioning conventions;
- replace `asChild` with `render` and update controlled handling to Base interfaces;
- preserve destructive/inset variants, shortcuts, typeahead, roving focus, collision handling, and selection semantics;
- use Phosphor for icons touched in the file.

Characterization and browser proof:

- cover pointer and keyboard open/select/close, controlled callbacks, Escape, focus return, Home/End/arrow traversal, submenus, and checkbox/radio values;
- browser-check the mode toggle and `/ui?item=dropdown-menu`.

This is an independent batch boundary. Complete the full safety baseline before Batch 8b.

### Batch 8b — ContextMenu

Owned primitive file:

- `context-menu.tsx`

Work:

- reuse reviewed Base Menu decisions without coupling the migration to DropdownMenu source;
- preserve native context-menu opening, submenus, checkbox/radio values, destructive/inset variants, keyboard traversal, portals, and collision behavior;
- migrate touched icons to Phosphor.

Characterization and browser proof:

- cover the native `contextmenu` event, keyboard selection, Escape, focus restoration, submenus, and checked values;
- browser-check `/ui?item=context-menu`.

This is an independent batch boundary. Complete the full safety baseline before Batch 8c.

### Batch 8c — Menubar

Owned primitive file:

- `menubar.tsx`

Work:

- migrate the menubar root, menu, trigger, content, items, submenus, checkbox/radio state, and keyboard model;
- preserve KKB presentation while adopting Base event and state contracts;
- migrate touched icons to Phosphor.

Characterization and browser proof:

- cover horizontal trigger traversal, menu opening, submenu traversal, checked values, Escape, and focus restoration;
- browser-check `/ui?item=menubar`.

This is an independent batch boundary. Complete the full safety baseline before Batch 9a.

### Batch 9a — NavigationMenu

Owned primitive file:

- `navigation-menu.tsx`

Work:

- migrate viewport, indicator, link, trigger, positioning, open state, and keyboard behavior;
- replace Radix positioning/state contracts with Base contracts and preserve KKB presentation;
- migrate touched icons to Phosphor.

Characterization and browser proof:

- cover keyboard traversal, active links, open/close state, focus restoration, and responsive viewport behavior;
- browser-check `/ui?item=navigation-menu` at desktop and mobile widths.

This is an independent batch boundary. Complete the full safety baseline before Batch 9b.

### Batch 9b — ScrollArea

Owned primitive file:

- `scroll-area.tsx`

Work:

- migrate viewport, scrollbar, thumb, orientation, RTL, wheel, pointer, and keyboard behavior;
- replace Radix state contracts with Base contracts and preserve KKB presentation.

Characterization and browser proof:

- cover scrolling input modes, horizontal/vertical orientation, thumb behavior, and RTL;
- browser-check `/ui?item=scroll-area` and representative mobile overflow.

This is an independent batch boundary. Complete the full safety baseline before Batch 10a.

### Batch 10a — Form composition cleanup

Owned primitive file:

- `form.tsx`

Work:

- preserve React Hook Form contexts, generated IDs, descriptions, errors, and ARIA wiring while replacing Radix Label/Slot types and composition;
- keep the module focused on React Hook Form rather than adding a second Base Form abstraction.

Characterization and browser proof:

- cover label/control/description/error relationships, rendered-control composition, invalid state, and focus behavior;
- browser-check the Form focused specimen.

This is an independent batch boundary. Complete the full safety baseline before Batch 10b.

### Batch 10b — Sidebar composition cleanup

Owned primitive file:

- `sidebar.tsx`

Work:

- migrate remaining Slot-backed render seams only after Button, Separator, Sheet, and Tooltip are stable;
- update menu/button/action/sub-button composition to `render` without changing Sidebar state ownership or responsive behavior;
- do not refactor Sidebar architecture, random skeleton sizing, or feature behavior unrelated to primitive replacement;
- migrate touched icons to Phosphor.

Characterization and browser proof:

- cover desktop collapse, mobile Sheet open/close, active state, tooltip behavior, rendered links, focus order, and keyboard activation;
- browser-check the Sidebar focused specimen at desktop and mobile widths.

This is an independent batch boundary. Complete the full safety baseline before Batch 11.

### Batch 11 — dependency removal, documentation, and final acceptance

Files and records:

- `packages/ui/package.json`
- root `package.json`
- `bun.lock`
- `packages/ui/README.md`
- `docs/design/kkb-design.md`
- `DESIGN.md` only when synchronizing its generated implementation-status prose through the established design-record workflow

Work:

- confirm owned source has no `from "radix-ui"` imports and no stale Radix CSS variables/selectors;
- remove the direct `radix-ui` declaration from `packages/ui` and its root catalog entry;
- refresh the lockfile with Bun and verify frozen installation;
- document Base UI as the shared primitive foundation, the `render` composition convention, native AspectRatio/Label implementations, Sheet/PreviewCard/Menu mappings, and the exhaustive retained transitive-owner inventory;
- record that Phosphor migration remains incomplete until #74 removes residual owned Lucide imports;
- update the design roadmap snapshot so #77 is not reported as future work after completion.

Final verification:

```bash
bun install --frozen-lockfile
bun run check-types
bun run test
bun run build
bun run format-and-lint
```

Also verify:

- both shadcn configs report Base + Phosphor;
- no owned source imports `radix-ui`;
- no workspace manifest directly depends on `radix-ui`;
- every remaining Radix package is transitive and traces to a documented owner such as `@json-render/shadcn`, `cmdk`, or `vaul`;
- light/dark desktop/mobile browser checks pass for `/ui`, `/audio`, `/binaural-beats`, `/oscilloscope`, and the docs landing page;
- focus, keyboard navigation, dismissal, scroll locking, portal stacking, and controlled-value behavior remain correct across the representative matrix.

## 6. Required test additions

Keep tests focused on interfaces callers actually use. Do not mirror Base UI internals.

Add or extend coverage for:

- `render` composition: one DOM element, merged props/classes/events, forwarded ref, and anchor semantics;
- controlled/uncontrolled callbacks for open, checked, pressed, selected, and numeric value families;
- Slider array values and multi-thumb behavior used by audio/oscilloscope consumers;
- compound overlay/menu behavior: focus, keyboard traversal, dismissal, portals, and accessible naming;
- Base state attributes and positioning variables that KKB styles intentionally consume;
- Form ARIA relationships and Sidebar responsive composition;
- SSR/render coverage for all `/ui` focused specimen routes after interface changes.

Do not add broad snapshot tests or duplicate Base UI's own conformance suite.

## 7. Review and stop conditions

Pause the migration rather than widening scope when:

- a Base primitive lacks the required behavior and the choice would alter product semantics;
- a batch requires redesigning a route or changing app-owned session behavior;
- generated output conflicts with the locked Base UI types;
- an owned consumer cannot migrate without introducing a compatibility layer;
- focus, keyboard, controlled state, portals, positioning, or builds cannot be verified before the next batch.

Resolve the decision in the current batch, document the incompatibility, and update #77 before proceeding.

## 8. Definition of done

#77 is done only when all batches satisfy the safety contract, owned Radix imports and direct dependencies are gone, intentional Base interfaces are reflected in all owned consumers, KKB design contracts remain intact, retained transitive exceptions are documented, and the full repository plus representative browser matrix pass.

#74 starts afterward and owns the remaining Lucide-to-Phosphor sweep and direct Lucide dependency removal.
