# `@kkb/agents`

Canonical source for Kalyn's custom agent context, skills, tools, workflows, and their installation and synchronization tooling.

The package currently contains portable agent assets. Runtime code and distribution tooling will be added only when their contracts are designed.

## Layout

- [`CONTEXT.md`](./CONTEXT.md) — stable language for the KKB Agents bounded context.
- [`docs/`](./docs/) — durable package-owned decision, provenance, and contract records.
- [`skills/`](./skills/) — independently addressable KKB skills and their packaged references, assets, and harness metadata.
- [`tests/`](./tests/) — package-integrity validation.

`@kkb/agents` owns the canonical source. Installing or synchronizing that source into an agent harness is a separate operation; the package does not currently install itself or expose a runtime import API.

## Repository context and artifacts

Keep this package's repository context limited to durable, current truth. Active implementation state belongs in the request, session, issue, PR, and diff. Generated plans, reports, research, audits, and evidence remain external reopenable artifacts by default rather than accumulating as package documentation.

Add a package-local document only when it is explicitly requested or materially preserves a durable package decision, provenance record, or contract. The existing [`docs/`](./docs/) record is package-owned provenance for the canonical skills, not a general destination for active work artifacts. This direction is still evolving and will be aligned with the repository's broader agent and documentation guidance in a deliberate follow-up.
