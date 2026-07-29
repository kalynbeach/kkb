# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

KKB is primarily for Kalyn Beach: a personal technical-creative studio and reusable-systems workshop for building, testing, refining, documenting, and sharing experiments.

Secondary users include future collaborators and people Kalyn chooses to share work with, such as peers reviewing demos, code, reports, design systems, and creative tooling. Public-facing output grows from the workshop rather than defining it.

## Product Purpose

KKB is the core monorepo for Kalyn's technical and creative work. It brings audio runtime experiments, oscilloscope and signal-visualization surfaces, shared UI primitives, JSON-driven rendering, Ableton extension work, documentation, reports, and agent-workflow research into one coherent environment.

Success means:

- Experiments can move cleanly from prototypes into reusable packages, components, or documented artifacts.
- Apps, demos, docs, and reports feel like one coherent KKB family rather than disconnected projects.
- Work remains inspectable and understandable to collaborators or readers without losing Kalyn's technical and creative point of view.
- The shared design foundation supports ambitious audio, shader, 3D, motion, and symbolic work without fragmenting the product.

## Positioning

KKB is a personal studio where technical experiments, creative media systems, documentation, and reusable software are developed together. Unlike a generic component library, portfolio, or collection of isolated demos, it provides a path from exploration to inspectable artifact to shared system while preserving strong package boundaries and a consistent identity.

## Operating Context

KKB is developed as a Bun-workspace Turborepo with shared packages and Next.js applications. Work commonly moves through an iterative loop:

1. Explore a technical or creative idea in an app or focused prototype.
2. Make the result usable and inspectable through a demo, visualization, report, or test surface.
3. Extract stable behavior, presentation, or contracts into the appropriate shared package.
4. Document decisions, evidence, constraints, and follow-up work in the repository.
5. Share selected routes, artifacts, code, or reports with collaborators and peers.

`apps/web` is the active integration and visual-verification host. `apps/docs` is an early documentation shell. Shared behavior belongs in packages such as `@kkb/audio`, while reusable interface foundations belong in `@kkb/ui`.

## Capabilities and Constraints

- `@kkb/ui` is the default source for shared interface primitives, tokens, hooks, and reusable presentation patterns.
- Browser and session orchestration remains app-owned until a reusable contract is clear.
- Shared packages should remain headless or presentation-focused according to their documented architectural boundaries.
- The initial design atmosphere is one deliberately curated light/dark pair; additional theme worlds remain future work.
- Dynamic audio, shader, WebGPU, 3D, and generative work must provide light, dark, reduced-motion, meaningful static, responsive, and accessible representations.
- JSON-render remains an existing experimental capability but is outside the active design-system roadmap.
- KKB is personal-first. It is not currently defined as a general-purpose product for external customers.
- Experimental work may be incomplete or uncertain; interfaces and documentation should communicate status rather than imply unsupported maturity.

## Brand Commitments

The product name is KKB, with the internal package namespace `@kkb/*`.

KKB's voice is technical, rhythmic, detailed, beautiful, and bold. It should communicate expert confidence with visible craft: precise without becoming sterile, expressive without becoming generic spectacle, and direct without becoming corporate.

The design system is a coherent canvas rather than a single finished aesthetic. Stable typography, geometry, symbology, interaction behavior, and accessibility contracts preserve identity, while themes provide selectable atmospheres through curated light and dark palettes, shader variations, materials, and subtle changes in feel.

Structural surfaces and ordinary controls use radius-none. Rounded geometry is reserved for explicitly documented elements whose shape communicates identity or mechanical behavior. Phosphor is the initial utility-icon vocabulary, separate from custom KKB sigils and symbols. `@kkb/ui` will migrate from Radix primitives to Base UI as approved near-term foundation work.

`docs/design/kkb-design.md` is the durable source for the current design intent and inspiration synthesis. `https://internet.dev/` remains a positive reference for craft culture, directness, density, workshop energy, and visible care for web work.

## Evidence on Hand

The repository contains real implementations and artifacts that future work may use as evidence:

- Active web routes for audio, binaural beats, oscilloscope, shared UI, and JSON rendering
- Headless audio runtime and WebGPU oscilloscope work under shared packages
- The `@kkb/ui` component library and visual catalog
- Ableton extension experiments and packaged artifacts
- Architecture reports, plans, research, specifications, and diagrams under `docs/`
- The design intent and reviewed references in `docs/design/kkb-design.md`

KKB does not currently claim external customers, adoption, testimonials, commercial traction, or production benchmarks beyond evidence explicitly checked into the repository. Future surfaces must not fabricate those claims.

## Product Principles

1. **Build a workshop, not a demo pile.** Experiments should contribute to a coherent environment and have a practical route toward reusable systems or durable documentation.
2. **Make the work inspectable.** Demos, reports, controls, source references, and visualizations should expose enough context for another person to understand what exists and why.
3. **Share foundations before duplicating solutions.** Reusable behavior and presentation belong in the appropriate shared package, especially `@kkb/ui`, once their contracts are clear.
4. **Preserve room for ambitious expression.** The foundation should support audio, shaders, 3D, animation, generative graphics, sigils, and advanced visualization without weakening usability or coherence.
5. **Communicate experimental truth.** Status, uncertainty, limitations, and evidence should remain visible; unfinished work must not masquerade as settled product capability.

## Accessibility & Inclusion

WCAG AA contrast is the baseline. Interactive controls must be keyboard-accessible with visible focus states. Motion needs reduced-motion alternatives, and dynamic visual systems need meaningful static states. Status, signal, selection, and error meaning must not rely on color alone.

Audio and microphone experiences should provide safe defaults, clear state feedback, and explicit guidance where sound, device access, or browser capability affects the experience. Responsive visualizations must not widen the document, hide required information behind hover-only interactions, or create inaccessible horizontal regions.
