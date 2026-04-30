# Domain docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

## Layout

This repo uses a **single-context** domain docs layout.

Expected locations:

- `CONTEXT.md` at the repo root for project domain language and glossary terms.
- `docs/adr/` at the repo root for architectural decision records.

## Before exploring, read these

- **`CONTEXT.md`** at the repo root, if it exists.
- **`docs/adr/`** ADRs that touch the area you're about to work in, if they exist.

If these files don't exist, proceed silently. Don't flag their absence and don't suggest creating them upfront. Producer workflows can create them lazily when terms or decisions actually get resolved.

## File structure

```text
/
├── CONTEXT.md
├── docs/adr/
│   ├── 0001-example-decision.md
│   └── 0002-example-follow-up.md
└── apps/ and packages/
```

## Use the glossary's vocabulary

When your output names a domain concept in an issue title, refactor proposal, hypothesis, or test name, use the term as defined in `CONTEXT.md`. Don't drift to synonyms the glossary explicitly avoids.

If the concept you need isn't in the glossary yet, either reconsider whether you're inventing language the project doesn't use or note the gap for later clarification.

## Flag ADR conflicts

If your output contradicts an existing ADR, surface it explicitly rather than silently overriding:

> _Contradicts ADR-0007 (example decision) — but worth reopening because..._
