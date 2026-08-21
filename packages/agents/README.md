# `@kkb/agents`

Canonical source for Kalyn's custom agent context, skills, tools, workflows, and their installation and synchronization tooling.

The package currently contains portable agent assets. Runtime code and distribution tooling will be added only when their contracts are designed.

## Layout

- [`CONTEXT.md`](./CONTEXT.md) — stable language for the KKB Agents bounded context.
- [`docs/`](./docs/) — package research and decision records.
- [`skills/`](./skills/) — independently addressable KKB skills and their packaged references, assets, and harness metadata.
- [`tests/`](./tests/) — package-integrity validation.

`@kkb/agents` owns the canonical source. Installing or synchronizing that source into an agent harness is a separate operation; the package does not currently install itself or expose a runtime import API.
