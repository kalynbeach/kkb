# Pi customization summary

_Date: 2026-04-12_

## Purpose

This document captures the Pi session/workflow analysis and the first round of Pi-specific customizations added for the `kkb` monorepo so the setup can be revisited and extended later without re-deriving context.

## Scope of the review

The review covered:

- Pi session files in `~/.pi/agent/sessions/--Users-kalynbeach-dev-kkb-kkb--/*.jsonl`
- current Pi docs for sessions, prompt templates, skills, extensions, themes, packages, and TUI customization
- current project-local `.pi/` state in this repository
- current global Pi settings in `~/.pi/agent/settings.json`

## High-level findings from Pi session review

### Session usage snapshot

Across the saved Pi sessions for this repository at the time of review:

- 16 sessions were present
- 142 user messages were present
- 2,624 total session entries were present
- tool usage was dominated by `bash` and `read`, followed by `edit`
- almost all assistant turns used `openai-codex/gpt-5.4` with `high` thinking
- there was little or no use of session naming, labels/bookmarks, tree navigation summaries, or custom Pi resources beyond the default environment

Approximate aggregate usage from the analyzed session files:

- `bash`: 633 tool results
- `read`: 613 tool results
- `edit`: 159 tool results
- `write`: 55 tool results
- `run_experiment`: 2 tool results
- total cost: about $49.65
- total tokens: about 100.8M, heavily aided by cache reads

### Dominant workflow pattern

A clear repeated loop showed up across the sessions:

1. read docs first
2. inspect repository context
3. review or refine research/plan/report documents
4. implement grounded feature work in small passes
5. verify behavior, often with browser-oriented review
6. review staged changes before commit
7. draft or refine commit messages / PR material / GitHub issues
8. document the next chunk of work before moving on

This is a strongly doc-driven, maintainer-style workflow rather than a freeform code-generation workflow.

### Recurring preferences and corrections

The session history showed stable preferences that were being restated manually often enough to justify moving them into durable Pi configuration:

- use `bun`, `bunx`, and `bun pm` by default for JS/TS/package work
- avoid `node`, `npm`, `pnpm`, and `yarn` unless explicitly requested or required
- use `gh` for GitHub-related work
- do not create git worktrees unless explicitly requested
- prefer `localhost` over `127.0.0.1` for local app URLs
- be very conservative with destructive shell commands, especially `rm`
- do not commit broken code
- run relevant targeted checks before commit
- review staged or pending changes before committing
- match the repository's preferred commit style: conventional subject plus a detailed lower-cased list-style body when warranted
- keep docs and code aligned in the same pass
- reuse existing `docs/` directories and date-stamped naming conventions
- inspect current `docs/` material before editing plans, architecture notes, or roadmap-related content
- avoid barrel files unless there is a clear reason to introduce one
- when browser verification is needed, use the relevant skill first, prefer `agent-browser` when appropriate, keep timeouts short, and verify the exact requested URL/path
- keep changes scoped and avoid opportunistic refactors unless necessary

## Initial assessment of the current Pi setup

At the time of review, the project-specific Pi customization surface was still minimal.

### Existing project-local Pi state

The repository already contained:

- `.pi/skills/turborepo`

There were no project-local:

- `.pi/settings.json`
- `.pi/prompts/`
- `.pi/extensions/`
- `.pi/themes/`
- `.pi/APPEND_SYSTEM.md`
- `.pi/SYSTEM.md`

### Existing global Pi state

The global Pi settings file at `~/.pi/agent/settings.json` showed:

- default provider: `openai-codex`
- default model: `gpt-5.4`
- enabled models including Anthropic and OpenAI Codex options
- default thinking level: `high`
- installed package: `https://github.com/davebcn87/pi-autoresearch`

## Recommended customization direction

The recommendation from the review was to move repeated workflow corrections and recurring prompt patterns into Pi-native configuration in this order:

1. project-local appended system instructions
2. project-local prompt templates
3. a custom workflow skill for doc-driven feature work
4. a custom browser-review skill
5. a guardrails extension
6. a commit-helper extension
7. session metadata helpers such as auto-naming/bookmarking
8. custom compaction tuned to this workflow

The reasoning was:

- `APPEND_SYSTEM.md` is the fastest way to reduce repeated steering
- prompt templates are a high-leverage way to encode repeated task openings without adding automation complexity
- skills are a good fit for repeatable multi-step workflows
- extensions are best reserved for enforcement, UI, and runtime behavior changes

## Customizations added in this pass

Two categories of project-local customizations were added:

1. `.pi/APPEND_SYSTEM.md`
2. `.pi/prompts/*.md`

### 1. Project-local appended system instructions

File added:

- `.pi/APPEND_SYSTEM.md`

This file was chosen instead of `.pi/SYSTEM.md` because:

- `.pi/SYSTEM.md` replaces Pi's default system prompt entirely
- `.pi/APPEND_SYSTEM.md` appends project instructions to the default Pi system prompt
- appending is the safer, more incremental customization for this repository

Important Pi-specific note:

- `APPEND_SYSTEM.md` is a special Pi filename
- project-local path: `.pi/APPEND_SYSTEM.md`
- global path alternative: `~/.pi/agent/APPEND_SYSTEM.md`
- if Pi is already running, `/reload` should be used after editing it

The current appended instructions encode the recurring project preferences listed above, including:

- Bun-first commands
- `gh` for GitHub work
- no worktrees unless explicitly requested
- `localhost` preference
- caution around destructive shell commands
- no committing broken code
- review staged changes before commit
- match repo commit style
- keep docs aligned with implementation
- reuse existing docs structure and naming conventions
- avoid barrel files unless justified
- treat `@kkb/ui` as the default base for shared UI styles, components, hooks, and utilities across the monorepo when practical
- inspect `packages/ui` before introducing new app-local UI primitives, hooks, or reusable styling patterns
- prefer composing `@kkb/ui` building blocks over creating redundant app-local replacements
- promote likely reusable app-level UI primitives or hooks into `packages/ui` instead of duplicating them
- allow app-local UI for genuinely feature-specific composition and presentation layers, while still preferring `@kkb/ui` as the base
- use the relevant browser skill first and keep browser timeouts short
- prioritize concrete review findings
- ask clarifying questions when requirements are materially unclear
- keep changes scoped

### 2. Project-local prompt templates

Directory added:

- `.pi/prompts/`

The following prompt templates were created:

- `.pi/prompts/doc-review.md`
- `.pi/prompts/plan-feature.md`
- `.pi/prompts/implement-plan.md`
- `.pi/prompts/review-staged.md`
- `.pi/prompts/draft-pr.md`
- `.pi/prompts/review-pr-comments.md`
- `.pi/prompts/issue-pass.md`
- `.pi/prompts/commit-message.md`
- `.pi/prompts/deps-update.md`

These templates are intended to reduce repeated session-opening prompt boilerplate for the task shapes that appeared most often in the session review.

### Template intent summary

#### `/doc-review`
Use for grounded reviews of a doc with current repository context.

#### `/plan-feature`
Use for creating a practical implementation plan from a feature or planning document.

#### `/implement-plan`
Use when moving from plan doc to implementation while keeping docs aligned and calling out assumptions, risk, validation, and remaining work.

#### `/review-staged`
Use before commit to summarize changes, call out findings, and assess commit readiness.

#### `/draft-pr`
Use to draft concise but technical PR descriptions based on current branch state and comparable PRs.

#### `/review-pr-comments`
Use to inspect a PR via `gh` and turn review feedback into an actionable implementation plan.

#### `/issue-pass`
Use to turn plans, TODOs, and related docs into actionable GitHub issue proposals.

#### `/commit-message`
Use to produce a repo-style commit message with a conventional subject and a detailed lower-cased list-style body when warranted.

#### `/deps-update`
Use to assess dependency updates conservatively, with Bun-first workflows and monorepo/catalog considerations.

### Example prompt-template usage

After Pi reloads resources, example invocations include:

- `/doc-review @docs/research/browser-oscilloscope.md`
- `/plan-feature @docs/plans/2026-04-05-browser-oscilloscope-track-playback-spike.md`
- `/implement-plan @docs/plans/2026-04-04-browser-oscilloscope-ui-refactor.md`
- `/review-staged`
- `/draft-pr`
- `/review-pr-comments 29`
- `/issue-pass oscilloscope follow-ups`
- `/commit-message`
- `/deps-update`

## Why these first changes were prioritized

These changes were selected first because they are:

- low risk
- easy to iterate
- immediately useful in normal sessions
- aligned with the most repetitive session-opening patterns from the history review
- a good foundation for later skill and extension work

They also avoid prematurely locking in more complex runtime behavior before the preferred workflow conventions have been exercised through normal usage.

## Additional customization note added after the initial pass

After the initial Pi customization pass, an additional durable preference was identified and approved for inclusion in the Pi instructions:

- for UI work across the `kkb` monorepo, `@kkb/ui` should be treated as the default source of truth for shared base styles, components, hooks, and utilities whenever possible
- new app-level UI should prefer composition from `@kkb/ui` rather than introducing redundant primitives or styling systems
- genuinely feature-specific composition and presentation layers can remain app-local, but they should still build on top of `@kkb/ui` where practical
- when a new primitive or hook appears reusable across `apps/*`, it should generally be promoted into `packages/ui` rather than copied into an app

This preference aligns with the current repository structure:

- both `apps/web` and `apps/docs` already import `@kkb/ui/styles/globals.css`
- both app layouts already use `@kkb/ui/components/theme-provider`
- `packages/ui` already exposes a substantial shared library of primitives, hooks, utilities, and theme tokens
- current app code already shows the intended pattern of composing shared `@kkb/ui` primitives with feature-specific app surfaces

## Remaining recommended next steps

### Near-term next customizations

The next recommended additions are:

1. `kkb-doc-driven-feature` skill
2. `kkb-browser-review` skill
3. `kkb-guardrails` extension

### Proposed `kkb-doc-driven-feature` skill

Intent:

- encode the recurring doc-first feature workflow
- read plans/research/reports first
- inspect current code and docs state
- surface assumptions / open questions early
- implement in grounded phases
- update docs and validation notes as work progresses

Expected value:

- less repeated “read these docs, inspect current state, ask clarifying questions, then implement carefully” prompting
- more consistent execution order across long feature branches

### Proposed `kkb-browser-review` skill

Intent:

- encode the preferred browser-review and verification workflow
- use the relevant browser skill first
- default to `localhost`
- keep timeouts short
- verify the exact requested route
- return concrete UX/visual/implementation findings rather than vague approval

Expected value:

- less repeated steering around browser tooling behavior
- more consistent verification output

### Proposed `kkb-guardrails` extension

Intent:

- enforce or warn on known recurring preference violations at runtime

Candidate rules:

- warn/block `node`, `npm`, `pnpm`, and `yarn` usage unless explicitly needed
- warn/block `git worktree`
- warn on `127.0.0.1` when `localhost` would suffice
- confirm or block dangerous `rm` usage
- optionally warn on unusually long browser-tool timeouts
- optionally warn when new docs are being placed into an unexpected directory

Expected value:

- fewer manual corrections during sessions
- faster convergence on preferred repo behavior

## Operational notes for future sessions

- Pi should auto-discover `.pi/APPEND_SYSTEM.md` and `.pi/prompts/*.md`
- if Pi is already running, use `/reload`
- these changes do not require `.pi/settings.json`
- the next customization pass should likely stay project-local until the patterns feel stable enough to bundle into a reusable Pi package

## Longer-term packaging idea

If the project-local prompts, skills, and extensions prove stable, they could eventually be bundled into a shared Pi package for reuse across related repositories.

A future package might contain:

- KKB-specific prompts
- KKB-specific skills
- KKB-specific guardrail extensions
- optional themes or UI/status helpers

That packaging step should probably happen only after the skill and extension layer has been exercised for a while inside this repository.

## Summary

The main takeaway from the Pi session review was that the workflow is already disciplined, but much of that discipline still lives in manual in-session correction rather than durable Pi configuration.

The first customization pass therefore focused on moving the most stable, repeated instructions into:

- appended system instructions for always-on preferences
- prompt templates for repeatable task openings

This creates a lightweight foundation for the next pass, which should likely focus on one workflow skill and one guardrails extension rather than adding more prompt templates immediately.
