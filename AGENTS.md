# Repository Guidelines

`AGENTS.md` is the primary agent guidance for this repository.

Read `README.md` for workspace structure, routes, commands, validation, documentation layout, and architectural boundaries.

## Standards for contributions

- TypeScript strict mode; avoid `any`-typed declarations.
- Biome is the repository formatter, linter, and import organizer.
- Use the React 19 JSX transform; do not add default React imports.
- Prefer `bun` and `bunx`; use `bun pm` for package metadata and inspection.
- Keep changes scoped and concise.
- Do not preserve backward compatibility unless explicitly requested.

## Commit and PR defaults

- Use conventional commit messages.
- Prefer a concise imperative subject with a short body when context or rationale matters.
- Before committing, run relevant checks and review pending changes.

## Documentation and progressive disclosure

- Before changing architecture, roadmap, or design documentation, inspect the latest relevant material under `docs/`.
- Keep documentation and implementation aligned.
- Prefer linking to existing documentation over duplicating it in guidance files.
- Use package or app `README.md` files for workspace-local context.

## Testing notes

- Run the relevant validation commands documented in `README.md`.
- Add or extend workspace test scripts when introducing testable behavior.
- Treat newly introduced lint warnings as regressions, even when existing warnings remain elsewhere.

## UI defaults

- Treat `@kkb/ui` as the default base for shared styles, components, hooks, and utilities.
- Before creating app-local UI primitives, hooks, or reusable styling patterns, inspect `packages/ui` and prefer composing existing `@kkb/ui` building blocks.
- Keep genuinely feature-specific composition and presentation local to the owning app.

## Agent skills

### Issue tracker

Issues are tracked in GitHub Issues for `kalynbeach/kkb` using the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Triage uses the default five-label vocabulary: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, and `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

This repository uses a multi-context domain docs layout. See `docs/agents/domain.md`.
