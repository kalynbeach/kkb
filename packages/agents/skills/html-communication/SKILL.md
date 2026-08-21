---
name: html-communication
description: Create or revise a plan, research report, audit, explainer, comparison, or UI mock as a standalone KKB HTML communication artifact. Do not use for product UI or shipping application code.
---

# Communicate through HTML

Create one reopenable, browser-readable HTML artifact for a human. This is an independent KKB skill with its own shell, references, privacy model, and verification contract. Do not invoke or wrap `visual-explainer`.

Creation never authorizes publication. Default to a local, unpublished artifact.

## 1. Establish the artifact contract

Resolve the audience, question, document type, source boundary, desired depth, privacy level, and any explicit delivery location.

Privacy levels describe the maximum intended audience if later published:

- `private`: Kalyn only;
- `restricted`: authenticated users or roles selected by Kalyn;
- `public`: unauthenticated access.

Read supplied sources, active repository instructions, and only directly relevant stable repository context. Do not search for the newest plan or report by default. For a revision, update the same artifact and preserve useful content-specific visual language unless redesign is requested.

Use [`assets/artifact-shell.html`](assets/artifact-shell.html) as the provisional base theme and page shell. Read only the focused reference needed for the content:

- [`references/composition.md`](references/composition.md) for document shape, density, and responsive composition;
- [`references/diagrams.md`](references/diagrams.md) when relationships or state warrant a diagram.

Complete this step when audience, sources, shape, privacy, and destination policy are explicit.

## 2. Set evidence rigor proportionally

For research, audits, reports, comparisons, architecture explanations, or any artifact with dense factual claims, build an explicit evidence ledger before composition. Inventory material claims, numbers, versions, commits, paths, symbols, issue or PR references, test results, and observed behaviors; connect each to its owning source or an uncertainty label.

For a simple explainer or UI mock, use a lighter source-and-coverage check instead of manufacturing a ledger. Still distinguish verified fact, inference or judgment, uncertainty, recommendation, and deferred scope wherever those distinctions matter.

Pin dates, versions, tags, commits, or snapshots for drift-prone claims. Put citations or file references near the claims they support. When complete source coverage is requested, give every source item a visible home rather than compressing it away.

Complete this step when the proof model matches the artifact's factual density.

## 3. Choose the smallest useful representation

Use:

- prose for sustained reading and explanations;
- semantic tables for repeated fields or exact comparison;
- Mermaid for relationships, flows, hierarchy, or state;
- structured cards for internals, plans, findings, or independently scannable units;
- a small overview diagram plus detailed prose or cards for dense systems.

Route the narrative by content rather than forcing a universal dashboard:

- research: question and boundary, executive result, evidence, findings, risks, sources;
- plan or spec: problem, desired behavior, scope, decisions, implementation, tests, uncertainties;
- report or audit: verdict, ranked findings, evidence and impact, recommendation, acceptance state;
- explainer: core model, smallest useful visual, details, glossary, sources;
- comparison: shared criteria, alternatives, tradeoffs, recommendation;
- UI mocks: clearly labeled options using realistic content, aligned for direct comparison, ending with decisions needed.

Skip decorative visualization and interaction that do not improve understanding.

## 4. Compose with the KKB artifact theme

Start from the packaged shell instead of copying a prior artifact wholesale. Preserve its semantic structure, shared typography, token roles, complete light and dark palettes, system-mode default, and lightweight mode control. Add a content-specific style layer that reflects the subject without replacing the base theme.

Lead with the outcome, intuition, or decision. Keep prose measures readable, headings clear, accents sparse and semantic, and reference-heavy material compact or collapsible. Use compact responsive navigation only when the section count or length benefits from it. Respect reduced motion. Keep tables and diagrams readable without accidental page-level overflow.

The packaged theme is provisional. Consume a future generated or packaged KKB artifact-theme asset when that becomes a stable portable interface; do not reach into a product application's private source tree at runtime.

Complete this step when the first viewport communicates the core result and every required source item has a clear place.

## 5. Preserve privacy and portability

Write to the explicit path when given. Otherwise create a reopenable artifact under:

```text
~/.agent/artifacts/<project>/<descriptive-name>.html
```

Create a repository artifact only when explicitly requested, required by an established repository convention, or essential under an installed skill's artifact contract. Persistence alone does not justify adding it to the repository.

Default to one HTML file that opens without a build step. For `private` artifacts or private-source content, use only embedded or local dependencies and local or system fonts. For `restricted` or `public` artifacts, remote dependencies are allowed only when their requests and portability cost are disclosed. Embed all dependencies when fully offline behavior is requested.

Keep the same location across revisions. This skill never uploads, deploys, or exposes the artifact. A publication request requires a handoff to a separately authorized publication workflow with a confirmed privacy boundary.

## 6. Verify and return an artifact reference

Verification is proportional, but every artifact must be opened in the environment's preferred browser and checked for:

- valid, readable HTML and correct title;
- desktop and narrow layouts without accidental horizontal overflow;
- base typography and complete light and dark styles;
- system mode and the manual mode control when present;
- navigation, tables, source links, diagrams, and interactions actually used;
- browser console errors;
- coverage against the evidence ledger or lighter source check.

Dense or interactive artifacts require full path-by-path verification. Simple documents need only the relevant subset. Fix failures and repeat affected checks.

Deliver a storage-neutral artifact reference containing:

- locator: local path now, service artifact ID or URL later;
- privacy level;
- portability and dependency state;
- verification performed and any remaining limitation.

A preview alone is not delivery.
