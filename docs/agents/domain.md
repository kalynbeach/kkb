# Domain docs

## Layout

This repo uses a **multi-context** domain docs layout.

Expected locations:

- `CONTEXT-MAP.md` at the repository root, mapping domains to their context documentation.
- `docs/adr/` for system-wide architectural decisions.
- `<workspace>/CONTEXT.md` for workspace-specific domain language.
- `<workspace>/docs/adr/` for workspace-specific decisions.

Current workspace roots include `apps/*` and `packages/*`.

## Before exploring, read these

1. Read root `CONTEXT-MAP.md`.
2. Read each relevant workspace `CONTEXT.md`.
3. Read applicable system-wide ADRs under `docs/adr/`.
4. Read applicable workspace ADRs under `<workspace>/docs/adr/`.

If these files do not exist, proceed silently. Producer workflows can create them lazily when terminology or decisions are resolved.

## File structure

```text
/
├── CONTEXT-MAP.md
├── docs/adr/
├── apps/
│   └── <app>/
│       ├── CONTEXT.md
│       └── docs/adr/
└── packages/
    └── <package>/
        ├── CONTEXT.md
        └── docs/adr/
```

## Use the glossary's vocabulary

Use terms defined by the relevant `CONTEXT.md` in issue titles, proposals, hypotheses, and test names. Do not drift to synonyms the glossary explicitly avoids.

If a required concept is absent, reconsider whether new terminology is necessary or record the gap for later domain modeling.

## Flag ADR conflicts

Surface conflicts with existing ADRs explicitly rather than silently overriding them.
