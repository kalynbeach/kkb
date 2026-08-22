# Diagram reference

Use a diagram only when connected structure is materially easier to understand visually.

## Choose the smallest diagram

- flowchart: components, decisions, data flow, or ownership;
- sequence: ordered interaction among multiple actors;
- state diagram: lifecycle states and legal transitions;
- timeline: state changing over time;
- tree: hierarchy or branching;
- semantic table instead: exact repeated mappings without meaningful topology.

For dense systems, show a small overview first and move detailed contracts into prose, cards, or tables. Avoid one enormous graph.

## Mermaid policy

Mermaid is the default for durable relationships and state because its source remains editable. Render each diagram into a `<pre class="mermaid">` container so the packaged shell's diagram styling and scroll behavior apply. Keep labels short, group only meaningful boundaries, and use shapes consistently. Include the Mermaid source with the artifact when the artifact is intended to preserve the full result.

Dependency handling follows the artifact privacy contract:

- `private`: use an embedded or local Mermaid runtime, or render to local inline SVG;
- `restricted` or `public`: a remote runtime is acceptable only when disclosed and compatible with the requested portability;
- offline: embed the runtime or render locally; do not rely on a CDN.

Prefer native Mermaid output. Do not create a redundant image fallback when the target renderer works unless portability requires one.

## Legibility and controls

- Use readable labels and high-contrast edge text in both color modes.
- Test the actual rendered diagram, not only Mermaid syntax.
- Keep diagrams within their container at narrow widths.
- Add pan, zoom, reset, or expand only when a complex diagram needs them; verify keyboard and pointer behavior.
- Do not use continuous animation.
- Pair the diagram with concise prose that states the conclusion it supports.

## Verification

Check every diagram in light and dark modes, desktop and narrow widths. Confirm no clipped nodes, unreadable labels, page-level overflow, failed rendering, or console errors. Compare the graph with its owning sources and evidence ledger before delivery.

## Provenance

These principles selectively adapt useful Mermaid and verification techniques from the MIT-licensed `visual-explainer` skill. `html-communication` remains independently owned and never invokes that skill.
