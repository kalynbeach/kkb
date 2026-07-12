# React Doctor triage

Date: 2026-07-12

Command:

```sh
bunx react-doctor@latest --verbose
```

React Doctor `0.7.6` scanned 157 files across `@kkb/docs`, `@kkb/web`, and `@kkb/ui`.
The baseline score was 56/100 with 60 findings: 2 errors and 58 warnings. `@kkb/docs`
scored 100 with no findings.

## Disposition summary

- Fix in this stack: 49 findings.
- Defer with evidence: 11 findings.
- The fix stack prioritizes correctness, stale closures, hydration consistency, dead code,
  Fast Refresh boundaries, stable context values, and verified dependency ownership.
- Deferred findings are external-system synchronization effects, an intentional browser support
  transition, small chart payload iterations, a route-level dynamic-loading decision, transport
  capability booleans, and two dependency-analysis false positives.

## Finding ledger

| ID | Severity | Rule | Location | Disposition |
| --- | --- | --- | --- | --- |
| RD-001 | warning | `only-export-components` | `apps/web/components/audio/player-shell.tsx:349` | Fix: move the polling helper to a pure module. |
| RD-002 | warning | `no-effect-chain` | `apps/web/components/binaural-beats/binaural-beats-client.tsx:155` | Defer: the effect synchronizes committed state to the external Web Audio engine and is guarded while stopped. |
| RD-003 | error | `no-ref-current-in-render` | `apps/web/components/oscilloscope/oscilloscope-client.tsx:157` | Fix: read current config through a React Effect Event instead of mutating a ref during render. |
| RD-004 | warning | `prefer-module-scope-pure-function` | `apps/web/components/oscilloscope/oscilloscope-client.tsx:176` | Fix: move the capture-free teardown helper to module scope. |
| RD-005 | warning | `rendering-hydration-no-flicker` | `apps/web/components/oscilloscope/oscilloscope-client.tsx:236` | Defer: the explicit checking state preserves SSR hydration before browser-only WebGPU detection. |
| RD-006 | warning | `exhaustive-deps` | `apps/web/components/oscilloscope/oscilloscope-client.tsx:303` | Fix: make runtime source synchronization an Effect Event so async startup reads the current provider factory. |
| RD-007 | warning | `no-effect-chain` | `apps/web/components/oscilloscope/oscilloscope-client.tsx:305` | Defer: the effect synchronizes React config to an imperative oscilloscope runtime, not derived React state. |
| RD-008 | warning | `no-pass-live-state-to-parent` | `apps/web/components/oscilloscope/oscilloscope-client.tsx:315` | Defer: the local function controls an imperative signal provider and is not a parent callback. |
| RD-009 | warning | `exhaustive-deps` | `apps/web/components/oscilloscope/oscilloscope-client.tsx:316` | Fix: use the same Effect Event while retaining the provider override as a resynchronization dependency. |
| RD-010 | warning | `no-effect-chain` | `apps/web/components/oscilloscope/oscilloscope-client.tsx:326` | Defer: committed state is intentionally synchronized to the browser hash as an external system. |
| RD-011 | warning | `unused-export` | `apps/web/components/ui-catalog/catalog-data.ts:72` | Fix: delete dead `railGroups` data. |
| RD-012 | warning | `unused-export` | `apps/web/components/ui-catalog/catalog-data.ts:306` | Fix: delete dead `groupedItems`. |
| RD-013 | warning | `unused-export` | `apps/web/components/ui-catalog/catalog-data.ts:313` | Fix: delete dead `itemLane` and its orphaned lane data. |
| RD-014 | warning | `unused-export` | `apps/web/components/ui-catalog/catalog-data.ts:325` | Fix: delete dead `laneLabel`. |
| RD-015 | warning | `unused-export` | `apps/web/components/ui-catalog/catalog-data.ts:344` | Fix: delete dead `focusedIntent`. |
| RD-016 | warning | `unused-export` | `apps/web/components/ui-catalog/catalog-data.ts:375` | Fix: delete dead `sourceInstruction`. |
| RD-017 | warning | `unused-export` | `apps/web/components/ui-catalog/catalog-data.ts:383` | Fix: delete dead `relatedItems`. |
| RD-018 | warning | `js-combine-iterations` | `apps/web/components/ui-catalog/catalog-rail.tsx:43` | Fix: reuse one filtered browse-category collection. |
| RD-019 | warning | `js-combine-iterations` | `apps/web/components/ui-catalog/catalog-rail.tsx:83` | Fix: reuse one filtered browse-category collection. |
| RD-020 | warning | `js-combine-iterations` | `apps/web/components/ui-catalog/catalog-rail.tsx:108` | Fix: centralize selectable category filtering. |
| RD-021 | warning | `js-set-map-lookups` | `apps/web/components/ui-catalog/catalog-search-index.ts:82` | Fix: use a set for repeated label-word lookups. |
| RD-022 | warning | `js-set-map-lookups` | `apps/web/components/ui-catalog/catalog-search-index.ts:82` | Fix: use the same set for repeated id-word lookups. |
| RD-023 | warning | `js-combine-iterations` | `apps/web/components/ui-catalog/catalog-search-index.ts:109` | Fix: collect positive search matches in one pass before sorting. |
| RD-024 | warning | `no-reset-all-state-on-prop-change` | `apps/web/components/ui-catalog/catalog-search.tsx:54` | Fix: remount query state per open session so stale results cannot paint. |
| RD-025 | warning | `only-export-components` | `apps/web/components/ui-catalog/catalog-search.tsx:135` | Fix: move search grouping logic to the data/search module. |
| RD-026 | warning | `only-export-components` | `apps/web/components/ui-catalog/catalog-surface-shared.tsx:10` | Fix: move chart fixture data to a data-only module. |
| RD-027 | warning | `only-export-components` | `apps/web/components/ui-catalog/catalog-surface-shared.tsx:100` | Fix: expose the renderer as a named component. |
| RD-028 | warning | `nextjs-no-client-side-redirect` | `apps/web/components/ui-catalog/catalog-workbench.tsx:70` | Fix: canonicalize invalid item parameters in the server page before rendering. |
| RD-029 | warning | `unused-export` | `apps/web/components/ui-catalog/sections/audio-section.tsx:9` | Fix: delete the unused item-count export. |
| RD-030 | warning | `unused-export` | `apps/web/components/ui-catalog/sections/data-section.tsx:16` | Fix: delete the unused item-count export. |
| RD-031 | warning | `unused-export` | `apps/web/components/ui-catalog/sections/feedback-section.tsx:11` | Fix: delete the unused item-count export. |
| RD-032 | warning | `unused-export` | `apps/web/components/ui-catalog/sections/input-section.tsx:29` | Fix: delete the unused item-count export. |
| RD-033 | warning | `unused-export` | `apps/web/components/ui-catalog/sections/layout-section.tsx:27` | Fix: delete the unused item-count export. |
| RD-034 | warning | `unused-export` | `apps/web/components/ui-catalog/sections/menu-section.tsx:5` | Fix: delete the unused item-count export. |
| RD-035 | warning | `unused-export` | `apps/web/components/ui-catalog/sections/navigation-section.tsx:36` | Fix: delete the unused item-count export. |
| RD-036 | warning | `unused-export` | `apps/web/components/ui-catalog/sections/overlay-section.tsx:8` | Fix: delete the unused item-count export. |
| RD-037 | warning | `unused-dependency` | `apps/web/package.json` (`radix-ui`) | Fix: remove the dependency; only `@kkb/ui` imports it. |
| RD-038 | warning | `unused-dev-dependency` | `apps/web/package.json` (`@json-render/shadcn`) | Fix: remove the duplicate dev dependency; `@kkb/ui` owns the actual import. |
| RD-039 | warning | `unused-dependency` | `packages/ui/package.json` (`@hookform/resolvers`) | Fix: remove the dependency; the workspace has no imports. |
| RD-040 | warning | `no-many-boolean-props` | `packages/ui/src/components/audio/player-controls.tsx:49` | Defer: the booleans represent independent queue and playback capabilities already covered by tests. |
| RD-041 | warning | `only-export-components` | `packages/ui/src/components/audio/waveform.tsx:238` | Fix: move keyboard seek helpers to a pure module. |
| RD-042 | warning | `only-export-components` | `packages/ui/src/components/badge.tsx:45` | Fix: stop exporting the file-local variant helper. |
| RD-043 | warning | `only-export-components` | `packages/ui/src/components/button-group.tsx:76` | Fix: stop exporting the file-local variant helper. |
| RD-044 | warning | `only-export-components` | `packages/ui/src/components/button.tsx:61` | Fix: move the shared variant helper to a pure module. |
| RD-045 | warning | `no-locale-format-in-render` | `packages/ui/src/components/calendar.tsx:159` | Fix: use React DayPicker's stable `day.isoDate` data identifier. |
| RD-046 | error | `effect-needs-cleanup` | `packages/ui/src/components/carousel.tsx:93` | Fix: unsubscribe both `reInit` and `select` listeners. |
| RD-047 | warning | `jsx-no-constructed-context-values` | `packages/ui/src/components/carousel.tsx:106` | Fix: memoize the carousel provider value. |
| RD-048 | warning | `prefer-dynamic-import` | `packages/ui/src/components/chart.tsx:5` | Defer: chart is an opt-in package subpath; loading policy belongs at a consuming route boundary. |
| RD-049 | warning | `jsx-no-constructed-context-values` | `packages/ui/src/components/chart.tsx:50` | Fix: memoize the chart provider value. |
| RD-050 | warning | `rerender-memo-before-early-return` | `packages/ui/src/components/chart.tsx:118` | Fix: return inactive tooltips before deriving their small label fragment. |
| RD-051 | warning | `js-combine-iterations` | `packages/ui/src/components/chart.tsx:159` | Defer: tooltip payloads are small and the filtered formatter index is behaviorally significant. |
| RD-052 | warning | `js-combine-iterations` | `packages/ui/src/components/chart.tsx:258` | Defer: legend payloads are small and the current filter/map form is clearer. |
| RD-053 | warning | `jsx-no-constructed-context-values` | `packages/ui/src/components/form.tsx:36` | Fix: memoize the field provider value. |
| RD-054 | warning | `jsx-no-constructed-context-values` | `packages/ui/src/components/form.tsx:75` | Fix: memoize the item provider value. |
| RD-055 | warning | `only-export-components` | `packages/ui/src/components/navigation-menu.tsx:159` | Fix: stop exporting the file-local style helper. |
| RD-056 | warning | `exhaustive-deps` | `packages/ui/src/components/sidebar.tsx:87` | Defer: the callback depends on derived `open`, which already covers `openProp` and `_open`. |
| RD-057 | warning | `exhaustive-deps` | `packages/ui/src/components/sidebar.tsx:122` | Defer: the memo depends on derived `open`, so the reported source states are not stale. |
| RD-058 | warning | `only-export-components` | `packages/ui/src/components/tabs.tsx:80` | Fix: stop exporting the file-local variant helper. |
| RD-059 | warning | `jsx-no-constructed-context-values` | `packages/ui/src/components/toggle-group.tsx:43` | Fix: memoize the toggle-group provider value. |
| RD-060 | warning | `only-export-components` | `packages/ui/src/components/toggle.tsx:45` | Fix: move the shared variant helper to a pure module. |

## Planned commit stack

1. Fix oscilloscope render purity and stale effect callbacks.
2. Fix carousel listener cleanup and stabilize context providers.
3. Canonicalize catalog routes and reset search sessions synchronously.
4. Remove dead catalog code and streamline its collection passes.
5. Isolate non-component helpers from Fast Refresh component modules.
6. Use a hydration-stable calendar day identifier.
7. Remove dependencies with no owning imports.

Each source commit must pass its most relevant targeted tests and type checks before it is added to
the draft pull request. The completed stack will rerun the full test, type-check, lint, build, and
React Doctor checks; this report will then record the final score and residual findings.
