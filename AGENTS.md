# `kkb` Repository Agent Guidelines

`AGENTS.md` is the primary agent guidance for the `kkb` repository.

Read `README.md` for workspace structure, routes, commands, validation, documentation layout, and architectural boundaries.

## Code Quality

- Prefer concise, simple solutions over clever or heavy abstractions; channel both "measure twice, cut once" and "YAGNI" principles.
- Do not introduce machinery because it looks architecturally impressive. Understand the real constraint, then fight for the smallest model that makes the correct behavior unsurprising.
- Do not preserve complexity just because it already exists.
- Do not preserve backward compatibility unless the user explicitly asks for it.
- Avoid opportunistic refactors unless they are necessary or explicitly requested.
- Tests are good; endless smoke tests, "regression tests" for feature deletions, etc., much less good. Tests should be focused, not slop.
- Comments are a great way to clarify functionality and how code is used. Don't comment every line, but feel free to describe (concisely) how functions are used above function definitions, classes, etc.
- Keep comments up to date. When making changes, it's important to keep things in sync.

## TypeScript

- Use `bun`, `bunx`, and `bun pm` for JavaScript & TypeScript tasks. Avoid `node`, `npm`, `pnpm`, and `yarn` (even if they are mentioned in a skill or external resource) unless they're absolutely required.
- Check `node_modules` for external API type definitions instead of guessing.
- Avoid `any` types. `any` is the enemy; inferred types are our friend. Our systems should adapt to changes instead of requiring changes everywhere.
- Avoid creating `index.ts` barrel files unless there is a clear reason to introduce one.
- Avoid one-line functions that are just casting wrappers.
- If your TypeScript code looks like a Python dev wrote it, it is bad TypeScript code.
- Never remove or downgrade code to fix type errors from outdated dependencies; upgrade the dependency instead.

## Styles and UI

- Treat `@kkb/ui` as the default base for shared `kkb` styles, components, hooks, and utilities.
- Before creating app-local UI primitives, hooks, or reusable styling patterns, inspect `packages/ui` and prefer composing existing `@kkb/ui` building blocks.
- Do not create redundant components or styles when an equivalent or composable base already exists in `@kkb/ui`.
- If a new UI primitive or hook is likely reusable across apps, prefer adding it to `packages/ui` instead of duplicating it in an app.
- App-local UI is still appropriate for genuinely feature-specific composition and presentation layers, but it should be built on top of `@kkb/ui` where practical.
- When asked to review or verify UI work, prioritize concrete UX, visual, and implementation findings over vague approval.

## Testing

- Run the relevant validation commands documented in `README.md`.
- Add or extend workspace test scripts when introducing testable behavior.
- Treat newly introduced lint warnings as regressions, even when existing warnings remain elsewhere.

## Documentation

- Keep docs and code aligned. If implementation changes behavior, plans, architecture notes, reports, or follow-up docs, update the relevant docs in the same pass.
- Reuse existing docs directories and naming conventions. Do not invent new top-level docs folders when an existing location already fits. Date-stamp new docs consistently with the repo's existing format.
- Before touching architecture, planning, or roadmap material, inspect `docs/` for the latest related documents.
- Add reference links to existing documentation when relevant.

## Git

- Do not commit broken code. Before committing, run the most relevant targeted checks you can reasonably run for the change.
- Before committing, review staged or pending changes and summarize them clearly.
- Only create and use git worktrees if it's highly beneficial or necessary for the work at hand, or if the user or workflow explicitly requests one.

### Commit Messages

- Write commit messages using the Conventional Commits spec: subject plus a detailed body when the change warrants it.
- Prefer lower-cased bullet/list style in the message body when summarizing changes.
- When committing work related to a GitHub issue or PR, include the relevant issue or PR number(s) in the commit message. For example: `"fix: fix the bug (#93)"`.
- Do not include validation/test sections in commit message bodies.
- After writing a commit, inspect the final commit message and verify that it contains actual newlines rather than literal `\n` escape sequences and that its list items are contiguous with no extra space between them.

## Agent skills

### Issue tracker

Issues are tracked in GitHub Issues for `kalynbeach/kkb` using the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Triage uses the default five-label vocabulary: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, and `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

This repository uses a multi-context domain docs layout. See `docs/agents/domain.md`.
