# Composition reference

Use this reference after the artifact contract is known. It is a decision aid, not a template catalog.

## Start with reader intent

The first viewport should answer the reader's first question:

- decision document: what should happen and why;
- research: what changed or was learned;
- audit: what is wrong, how serious it is, and what to do;
- explainer: the smallest mental model that makes the rest unsurprising;
- comparison: the recommendation and decisive tradeoff;
- mock: what differs between the labeled options.

Keep the primary narrative in one reading order. Sidebars, sticky navigation, filters, and tabs are justified only when they materially reduce navigation cost.

## Match structure to information

| Information shape | Default representation |
|---|---|
| Sustained argument or explanation | Prose with a readable measure |
| Repeated fields or exact comparison | Semantic table |
| Independent findings, components, or steps | Structured cards |
| Relationship, flow, hierarchy, or state | Mermaid diagram |
| Dense system | Small overview diagram plus prose, tables, or cards |
| Supporting evidence | Nearby citations, compact appendix, or `<details>` |

Do not turn every fact into a card. Do not use a diagram when one sentence or a short list is clearer.

## Control density

- Keep body copy near 60–75 characters per line.
- Use whitespace to separate ideas, not to imitate a marketing page.
- Keep reference-heavy material compact; use `<details>` only for genuinely secondary evidence.
- Use no more visual hierarchy than the content needs.
- Prefer one strong accent role plus semantic positive, warning, and negative roles.
- Let artifact-specific styling express the subject through layout, diagram treatment, or restrained accents while preserving the base theme.

## Responsive behavior

- Preserve the narrative order at narrow widths.
- Collapse multi-column cards to one column before text becomes cramped.
- Contain wide tables in a `<div class="table-wrap">` horizontal scroller; never make the page itself overflow.
- Avoid fixed heights for prose and evidence.
- Add compact section navigation when four or more substantial sections make orientation difficult; verify every anchor.

## Interaction threshold

Add interaction only when it helps inspect information:

- a simple theme control is part of the base shell;
- `<details>` may collapse evidence;
- diagram pan, zoom, or expansion is useful only when the diagram cannot remain legible responsively;
- UI mock controls should demonstrate a real state or enable direct comparison.

Every added control creates keyboard, narrow-layout, state, and console verification obligations.

## Provenance

These principles selectively adapt useful composition and responsive-document techniques from the MIT-licensed `visual-explainer` skill. This package has no runtime dependency on that skill and does not copy its templates or general theme catalog.
