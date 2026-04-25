Follow these project-specific operating preferences unless the user explicitly says otherwise.

Conversational style:
- Keep answers short and concise.
- No emojis in commits, issues, PR comments, or code.
- No fluff or cheerful filler text.
- Technical prose only, be kind but direct (e.g., "Thanks @user" not "Thanks so much @user!").
- Ask clarifying questions when requirements, scope, or sequencing are materially unclear.

Code quality:
- No `any` types unless absolutely necessary.
- Check node_modules for external API type definitions instead of guessing.
- NEVER remove or downgrade code to fix type errors from outdated dependencies; upgrade the dependency instead.
- Always ask before removing functionality or code that appears to be intentional.
- Do not preserve backward compatibility unless the user explicitly asks for it.
- Keep changes scoped to the requested task; avoid opportunistic refactors unless they are necessary or explicitly requested.
- Avoid barrel files unless there is a clear reason to introduce one.

Commands:
- Use `bun`, `bunx`, and `bun pm` for JavaScript/TypeScript/package tasks. Avoid `node`, `npm`, `pnpm`, and `yarn` unless explicitly requested or required.
- Be conservative with destructive commands. Avoid `rm -rf` and similar patterns unless clearly necessary; prefer safer alternatives like targeted edits, `mv`, or user confirmation.
- Prefer `localhost` over `127.0.0.1` for local app URLs unless there is a specific reason not to.
- When browser verification is needed, use the relevant skill first, prefer `agent-browser` when appropriate, keep timeouts short, and verify the exact requested local URL/path.

Git:
- Do not commit broken code. Before committing, run the most relevant targeted checks you can reasonably run for the change.
- Before committing, review staged or pending changes and summarize them clearly.
- Match the repository's commit style: conventional commit subject plus a detailed body when the change warrants it. Prefer lower-cased bullet/list style in the body when summarizing changes.
- Do not create or use git worktrees unless the user explicitly requests one.
- Use `gh` for working with GitHub when relevant.

Docs:
- Keep docs and code aligned. If implementation changes behavior, plans, architecture notes, reports, or follow-up docs, update the relevant docs in the same pass.
- Reuse existing docs directories and naming conventions. Do not invent new top-level docs folders when an existing location already fits. Date-stamp new docs consistently with the repo's existing format.
- Before touching architecture, planning, or roadmap material, inspect `docs/` for the latest related documents.

UI:
- For UI work across the monorepo, treat `@kkb/ui` as the default base for shared styles, components, hooks, and utilities whenever possible.
- Before creating new app-local UI primitives, hooks, or reusable styling patterns, inspect `packages/ui` and prefer composing existing `@kkb/ui` building blocks.
- Do not create redundant components or styles when an equivalent or composable base already exists in `@kkb/ui`.
- If a new UI primitive or hook is likely reusable across apps, prefer adding it to `packages/ui` instead of duplicating it in an app.
- App-local UI is still appropriate for genuinely feature-specific composition and presentation layers, but it should be built on top of `@kkb/ui` where practical.
- When asked to review or verify UI work, prioritize concrete UX, visual, and implementation findings over vague approval.
