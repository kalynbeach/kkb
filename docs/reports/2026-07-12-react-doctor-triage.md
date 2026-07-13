# React Doctor triage

Date: 2026-07-12

Command:

```sh
bunx react-doctor@latest --verbose
```

React Doctor `0.7.6` initially scanned 157 files across `@kkb/docs`, `@kkb/web`, and
`@kkb/ui`. The baseline score was 56/100 with 60 findings: 2 errors and 58 warnings.
`@kkb/docs` scored 100 with no findings. A follow-up scan after the first remediation stack
covered 163 files and reported 13 warnings; the second remediation stack reduced that result to
7 warnings across 165 files.

## Disposition summary

- Resolved from the original scan: 55 findings.
- Deferred from the original scan with evidence: 5 findings.
- Final scan: 7 warnings and no errors. Two additional oscilloscope heuristics surfaced around the
  same local external-runtime synchronization already covered by the original deferral.
- The fix stack prioritizes correctness, stale closures, hydration consistency, dead code,
  Fast Refresh boundaries, stable context values, and verified dependency ownership.
- Deferred findings are external-system synchronization effects, local Effect Event false
  positives, and a route-level dynamic-loading decision.

## Finding ledger

| ID | Severity | Rule | Location | Disposition |
| --- | --- | --- | --- | --- |
| RD-001 | warning | `only-export-components` | `apps/web/components/audio/player-shell.tsx:349` | Fix: move the polling helper to a pure module. |
| RD-002 | warning | `no-effect-chain` | `apps/web/components/binaural-beats/binaural-beats-client.tsx:155` | Defer: the effect synchronizes committed state to the external Web Audio engine and is guarded while stopped. |
| RD-003 | error | `no-ref-current-in-render` | `apps/web/components/oscilloscope/oscilloscope-client.tsx:157` | Fix: read current config through a React Effect Event instead of mutating a ref during render. |
| RD-004 | warning | `prefer-module-scope-pure-function` | `apps/web/components/oscilloscope/oscilloscope-client.tsx:176` | Fix: move the capture-free teardown helper to module scope. |
| RD-005 | warning | `rendering-hydration-no-flicker` | `apps/web/components/oscilloscope/oscilloscope-client.tsx:236` | Fix: expose a primitive WebGPU capability snapshot through `useSyncExternalStore` while retaining the SSR checking state. |
| RD-006 | warning | `exhaustive-deps` | `apps/web/components/oscilloscope/oscilloscope-client.tsx:303` | Fix: make runtime source synchronization an Effect Event so async startup reads the current provider factory. |
| RD-007 | warning | `no-effect-chain` | `apps/web/components/oscilloscope/oscilloscope-client.tsx:305` | Defer: the effect synchronizes React config to an imperative oscilloscope runtime, not derived React state. |
| RD-008 | warning | `no-pass-live-state-to-parent` | `apps/web/components/oscilloscope/oscilloscope-client.tsx:315` | Defer: the local function controls an imperative signal provider and is not a parent callback. |
| RD-009 | warning | `exhaustive-deps` | `apps/web/components/oscilloscope/oscilloscope-client.tsx:316` | Fix: use the same Effect Event while retaining the provider override as a resynchronization dependency. |
| RD-010 | warning | `no-effect-chain` | `apps/web/components/oscilloscope/oscilloscope-client.tsx:326` | Keep diagnostic: committed state is synchronized to the browser hash as an external system. Fix: gate persistence until restoration commits so Strict Mode cannot overwrite the incoming hash. |
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
| RD-040 | warning | `no-many-boolean-props` | `packages/ui/src/components/audio/player-controls.tsx:49` | Fix: replace transport booleans with a presenter-owned control-mode discriminant and callback-derived navigation availability. |
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
| RD-051 | warning | `js-combine-iterations` | `packages/ui/src/components/chart.tsx:159` | Fix: map visible tooltip payloads in one pass while preserving the filtered formatter index. |
| RD-052 | warning | `js-combine-iterations` | `packages/ui/src/components/chart.tsx:258` | Fix: reuse the same one-pass visible-payload mapper for legends. |
| RD-053 | warning | `jsx-no-constructed-context-values` | `packages/ui/src/components/form.tsx:36` | Fix: memoize the field provider value. |
| RD-054 | warning | `jsx-no-constructed-context-values` | `packages/ui/src/components/form.tsx:75` | Fix: memoize the item provider value. |
| RD-055 | warning | `only-export-components` | `packages/ui/src/components/navigation-menu.tsx:159` | Fix: stop exporting the file-local style helper. |
| RD-056 | warning | `exhaustive-deps` | `packages/ui/src/components/sidebar.tsx:87` | Fix: derive the effective open state inside the callback and list the controlled and internal sources explicitly. |
| RD-057 | warning | `exhaustive-deps` | `packages/ui/src/components/sidebar.tsx:122` | Fix: derive the effective open state inside the context memo with explicit source dependencies. |
| RD-058 | warning | `only-export-components` | `packages/ui/src/components/tabs.tsx:80` | Fix: stop exporting the file-local variant helper. |
| RD-059 | warning | `jsx-no-constructed-context-values` | `packages/ui/src/components/toggle-group.tsx:43` | Fix: memoize the toggle-group provider value. |
| RD-060 | warning | `only-export-components` | `packages/ui/src/components/toggle.tsx:45` | Fix: move the shared variant helper to a pure module. |

## Completed commit stack

1. `a434e49` — stabilize oscilloscope effect callbacks.
2. `e26dfc1` — isolate the player timeline helper.
3. `9f9dd2e` — remove unused workspace dependencies.
4. `c5b563c` — clean up carousel subscriptions and stabilize its context.
5. `3824680` — stabilize chart and form render contexts.
6. `471e468` — isolate UI helpers, stabilize toggle context, and add calendar SSR coverage.
7. `5dcf2f6` — canonicalize invalid catalog routes on the server.
8. `7198c46` — reset catalog search sessions and remove dead catalog data.
9. `2ee5e45` — isolate catalog preview data and rendering helpers.
10. `145a938` — make sidebar dependencies explicit.
11. `3410d45` — model player control modes.
12. `b0d6ba9` — map chart payloads in one pass and cover visible indexes.
13. `ff5f925` — stabilize oscilloscope hydration and Strict Mode hash restoration.

## Final React Doctor result

The final React Doctor `0.7.6` scan covered 165 files and completed successfully:

- Score shown by the tool: 59/100. The score changed from 67 on the 13-warning scan even though
  the warning count fell; warning count and disposition are the comparable follow-up measures.
- Errors: 0, down from 2.
- Warnings: 7, down from 58 initially and 13 at the start of this follow-up.
- `@kkb/docs`: 100, no findings.
- `@kkb/web`: 59, 6 warnings.
- `@kkb/ui`: 85, 1 warning.

### Residual warning triage

| Rule | Count | Disposition |
| --- | ---: | --- |
| `no-effect-chain` | 3 | Deliberate external synchronization: Web Audio updates, oscilloscope runtime config updates, and URL hash persistence belong in effects. Strict Mode hash restoration is now gated and covered. |
| `no-pass-live-state-to-parent` | 2 | False positives: the Effect Event controls the local imperative signal runtime and is not a parent callback. |
| `no-pass-data-to-parent` | 1 | False positive on the same local signal-runtime Effect Event; no data is passed to a parent component. |
| `prefer-dynamic-import` | 1 | Deferred to a consuming route boundary; chart is already an opt-in package subpath. |

The three parent-data/state diagnostics include two warnings that were not distinct entries in the
baseline scan. They appeared after the oscilloscope callbacks moved to React Effect Events, but they
target the same locally owned imperative runtime synchronization as RD-008.

## Verification

- `bun run test`: 193 tests passed across `@kkb/audio`, `@kkb/ui`, and `@kkb/web`.
- `bun run check-types`: all five workspace typecheck tasks passed.
- `bun run format-and-lint`: passed with 31 existing warnings and 3 infos in generated/static docs
  and the existing sidebar cookie assignment.
- `bun run build --filter=@kkb/web`: passed.
- `bun run build --filter=@kkb/docs`: passed.
- `bun install --frozen-lockfile --lockfile-only`: passed.
- `bunx react-doctor@latest --verbose`: 7 warnings and no errors.
- `git diff --check`: passed.

The combined sandboxed Turbo build stalled while both Next compilers ran concurrently. The two Next
workspaces completed successfully when built sequentially outside the restricted sandbox.
