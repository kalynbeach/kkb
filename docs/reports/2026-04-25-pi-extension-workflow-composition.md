# Pi Extension Workflow Composition

**Date:** 2026-04-25  
**Repo:** `kkb`  
**Purpose:** Capture practical ways the currently installed Pi extensions can work together based on recent `kkb` Pi sessions, project standards, and the progressive-autonomy direction documented in earlier reports.

## Summary

The installed Pi extensions now form a coherent workflow stack for `kkb`:

1. **Reusable workflow entrypoints** — `pi-prompt-template-model` plus project-local `.pi/prompts/*`
2. **Clarification and decision capture** — `pi-interview`
3. **Research and external context** — `pi-web-access`
4. **Delegation and parallel thinking** — `pi-subagents` and `pi-interactive-shell`
5. **Multi-agent coordination** — `pi-messenger` and `pi-intercom`
6. **Measured autonomous optimization** — `pi-autoresearch`

This stack aligns well with the existing `kkb` Pi workflow: doc-driven, standards-conscious, verification-heavy, and progressively autonomous.

The biggest opportunity is not installing more extensions. It is composing the installed extensions into durable workflows that support conversational collaboration, supervised implementation, and high-trust autonomous execution.

## Context from recent Pi sessions

Recent `kkb` Pi sessions reinforce the patterns already captured in:

- `docs/reports/2026-04-12-pi-customization-summary.md`
- `docs/reports/2026-04-13-pi-progressive-autonomy-roadmap.md`

The local session history shows repeated use of these workflows:

1. read docs first
2. inspect repository and recent git/GitHub context
3. review or refine plans, reports, and research docs
4. implement grounded feature work in small scoped passes
5. verify with targeted checks and browser review when relevant
6. review staged or pending changes before commit
7. draft or refine commit messages, PR material, and GitHub issues
8. document the next chunk of work before moving on

The tool usage remains dominated by `read` and `bash`, followed by smaller amounts of `edit` and `write`, which is consistent with a maintainer-style workflow rather than freeform code generation.

## Installed extensions reviewed

The installed Pi packages/extensions are:

- `pi-autoresearch` — autonomous experiment loop with benchmark/log/keep/discard tools
- `pi-prompt-template-model` — prompt-template frontmatter for model, thinking, skills, loops, chains, and delegation
- `pi-subagents` — task delegation to specialized subagents, including chains and parallel execution
- `pi-messenger` — multi-agent mesh coordination, file reservations, Crew task planning/execution
- `pi-intercom` — direct 1:1 communication between local Pi sessions
- `pi-interactive-shell` — interactive, hands-free, dispatch, background, and monitor-mode CLI sessions
- `pi-interview` — structured interactive forms for requirements and decisions
- `pi-web-access` — web search, code search, URL/GitHub/PDF/video fetching and extraction

These sit on top of the core Pi coding agent and the project-local `.pi` configuration already present in this repo.

## Recommended extension composition patterns

### 1. Grounded plan before implementation

Use for the common pattern of reading docs, inspecting repo context, making a concrete plan, then saving or updating docs.

**Extension stack:**

- `pi-prompt-template-model`
- `pi-web-access`
- `pi-interview`
- optionally `pi-subagents`

**Workflow:**

1. Run a template such as `/plan-feature docs/plans/foo.md`.
2. Pi reads local docs and code.
3. If external context matters, use `web_search`, `code_search`, or `fetch_content`.
4. If multiple tradeoffs exist, use `interview` instead of ad hoc chat back-and-forth.
5. Optionally ask a planner or reviewer subagent to critique the plan.

**Why it fits `kkb`:**

Planning and saved reports are already central to the project workflow. `pi-interview` is especially useful when the plan has several real choices: implementation scope, verification depth, architecture direction, UI priority, or autonomy level.

### 2. Staged diff review with independent critique

Use for the repeated pre-commit review workflow.

**Extension stack:**

- `pi-prompt-template-model`
- `pi-subagents`
- optionally `pi-interactive-shell`
- optionally `pi-web-access`

**Workflow:**

1. Main Pi runs the existing `/review-staged` template.
2. A reviewer subagent receives a narrow review task focused on regressions, docs drift, validation gaps, and architectural fit.
3. For higher-stakes changes, `pi-interactive-shell` can dispatch another CLI agent for independent review.
4. Main Pi reconciles findings and recommends whether the change is commit-ready.

**Why it fits `kkb`:**

The repository standards already emphasize not committing broken code, running relevant checks, and reviewing staged or pending changes before commit. Subagents are a good fit because review is separable from implementation.

### 3. Docs-to-issues pass

Use for the recurring pattern of inspecting docs, TODOs, recent work, and GitHub issues to identify actionable follow-up issues.

**Extension stack:**

- `pi-prompt-template-model`
- `pi-web-access` when upstream/library context matters
- `pi-subagents` for parallel issue discovery
- `pi-messenger` for larger Crew-style planning

**Workflow:**

1. Run `/issue-pass`.
2. Main Pi inspects existing issues via `gh`, docs, plans, TODOs, and recent commits.
3. Subagents can independently scan separate areas such as:
   - `docs/plans`
   - `docs/reports`
   - `packages/audio`
   - `apps/web`
   - `packages/ui`
4. Main Pi deduplicates, sequences, and ranks issue proposals.
5. Use `gh` to create and verify issues.

**Why it fits `kkb`:**

This is already an established manual workflow. Subagents would reduce blind spots while keeping the main session responsible for final judgment and issue quality.

### 4. Implementation from plan with scoped delegation

Use when moving from a saved plan or report into implementation while keeping docs aligned.

**Extension stack:**

- `pi-prompt-template-model`
- `pi-subagents`
- `pi-messenger` for larger waves
- `pi-interactive-shell` for delegated CLI agents
- `pi-interview` for decision checkpoints

**Normal workflow:**

1. Main Pi runs `/implement-plan docs/plans/foo.md`.
2. A scout subagent gathers current code and doc context.
3. Main Pi summarizes actual code work, assumptions, and risks.
4. If ambiguity exists, `interview` asks for decisions.
5. Main Pi implements.
6. A reviewer subagent checks the diff before final validation and commit recommendation.

**Larger-task workflow:**

1. Turn a plan or PRD into tasks with `pi_messenger({ action: "plan" })`.
2. Review the generated task graph before work starts.
3. Run one work wave at a time with low concurrency.
4. Use file reservations to avoid overlapping edits.
5. Main Pi reviews each completed task.

**Important local constraint:**

`kkb` project instructions say not to create or use git worktrees unless explicitly requested. Both `pi-subagents` and `pi-prompt-template-model` can support worktree-based workflows, but they should remain opt-in here.

### 5. Browser and UI verification loop

Use for oscilloscope/audio work, UI polish, and browser behavior verification.

**Extension stack:**

- `pi-interactive-shell`
- `pi-web-access`
- `pi-subagents`
- the global `agent-browser` skill and CLI

**Workflow:**

1. Use `interactive_shell` hands-free or monitor mode for `bun run dev` or another long-running local process.
2. Use `agent-browser` for exact browser verification at `localhost`.
3. If a visual regression or screen recording exists, use `fetch_content` on a local video file with a specific prompt.
4. Use a reviewer subagent focused only on UX/browser findings.
5. Save useful evidence into `docs/reports/*`.

**Why it fits `kkb`:**

The browser oscilloscope work already established a preference for browser smoke reports, visual quality review, short browser timeouts, and exact local URL verification.

### 6. Dependency update lane

Use for dependency updates and package maintenance.

**Extension stack:**

- `pi-prompt-template-model`
- `pi-web-access`
- `pi-interactive-shell`
- `pi-subagents`

**Workflow:**

1. Run `/deps-update`.
2. Use Bun-native commands such as:
   - `bun outdated`
   - `bun outdated --filter="*"`
   - targeted `bun update` operations
3. Use `web_search` or `fetch_content` for changelogs and migration notes when updates look risky.
4. Use `interactive_shell` monitor mode for long checks if needed.
5. Use a subagent review for dependency-risk assessment before committing.

**Why it fits `kkb`:**

The project standards strongly prefer Bun-native workflows and careful preservation of existing `package.json` changes.

### 7. Autoresearch for measurable improvements

Use for tasks with a clear metric, not broad architecture or design work.

**Extension stack:**

- `pi-autoresearch`
- `pi-web-access` for research hooks or external context
- `pi-subagents` for idea generation and review
- `pi-interactive-shell` if a dev server or watcher is part of the benchmark

**Good candidate metrics in this repo:**

- `bun run test` runtime
- `bun run check-types` runtime
- `bun run build` runtime
- bundle size for `apps/web`
- Lighthouse score for a local page
- oscilloscope rendering benchmark, if one is introduced
- `@kkb/audio` test speed or correctness/performance metric

**Workflow:**

1. Define the metric and benchmark command.
2. Create `autoresearch.sh` and optional `autoresearch.checks.sh`.
3. Let Pi try small optimizations.
4. `log_experiment` keeps improvements and reverts regressions.
5. Use `autoresearch-finalize` to turn successful experiments into clean reviewable changes.

**Caution:**

`pi-autoresearch` is best for optimization loops where “better” is measurable. It is less appropriate for ambiguous architecture, design taste, or product direction decisions.

### 8. Two-session planner/worker setup

Use when one Pi session should preserve strategic context while another executes scoped work.

**Extension stack:**

- `pi-intercom`
- optionally `pi-messenger`
- optionally `pi-subagents`

**Workflow:**

- Session A: `planner`
  - owns roadmap, docs, GitHub issues, and architecture decisions
- Session B: `worker`
  - implements scoped tasks
- Planner uses `intercom({ action: "send" })` for task handoff.
- Worker uses `intercom({ action: "ask" })` when blocked.
- Planner answers without losing broader context.

**When to use each coordination extension:**

- Use `pi-intercom` for direct 1:1 planner/worker conversations.
- Use `pi-messenger` for shared-folder coordination, file reservations, task graphs, and Crew workflows.

## Highest-leverage next customizations

### 1. Add execution frontmatter to existing `.pi/prompts`

The current project prompt templates encode workflow text. With `pi-prompt-template-model`, they can also encode execution behavior.

Potential variants:

- `/review-staged-fast` — cheaper/faster model, concise output
- `/review-staged-deep` — stronger model and reviewer subagent
- `/plan-feature` — high thinking and optional planner review
- `/issue-pass` — optional parallel scouts
- `/deps-update` — explicitly tuned for Bun/package-management conventions

### 2. Create a few user-scoped subagents

Because this repo intentionally removed project-scoped skills, avoid reintroducing project `.agents/skills` unless that decision changes. User-scoped subagents would still be useful and reusable across related projects.

Candidate subagents:

- `kkb-scout` — repo/doc recon, no edits
- `kkb-reviewer` — staged diff review, no edits
- `kkb-doc-sync-reviewer` — checks docs/code drift
- `kkb-browser-qa-planner` — plans browser verification steps
- `kkb-issue-curator` — turns docs into GitHub issue proposals

These should likely inherit project context but remain narrowly scoped.

### 3. Add a decision-checkpoint pattern using `pi-interview`

Use `interview` when:

- implementation has multiple valid paths
- scope could creep
- architecture ownership is unclear
- UI tradeoffs depend on taste or priority
- a long-running/autonomous task needs a clear contract before starting

This directly supports the progressive autonomy goal: more autonomy with stronger guardrails.

### 4. Use `pi-interactive-shell` monitor mode for long-running processes

Good candidates:

- dev servers
- watch tests
- browser smoke sessions
- long builds
- delegated CLI agents

This would make Pi less dependent on manual polling and more event-driven.

### 5. Reserve `pi-messenger` Crew for explicit task-wave work

Crew is powerful but should not become the default for small conversational or review tasks.

Good Crew use cases:

- a PRD/spec with several independent implementation slices
- issue batches that can be split cleanly
- docs/code migration work with clear file boundaries
- broad but well-scoped cleanup with review after each task

Poor Crew use cases:

- one small bug
- ambiguous architecture exploration
- tasks where file overlap is likely
- tasks where parallel agents should not touch the tree

## Recommended golden workflows

### Conversational default

Use project prompt templates plus targeted repository inspection, optionally with `pi-web-access`.

Example:

```text
/plan-feature docs/plans/foo.md
```

This remains the right default for most `kkb` sessions.

### Supervised builder

Use a prompt template, scout subagent, implementation pass, reviewer subagent, and targeted checks.

Example:

```text
/implement-plan docs/plans/foo.md
```

Then explicitly review pending changes before commit.

### High-trust autonomous

Use an interview contract, then either Messenger/Crew or Autoresearch depending on the task shape.

Suggested sequence:

1. `interview` captures objective, scope, stop conditions, and verification requirements.
2. `pi_messenger` plans tasks or `pi-autoresearch` defines a benchmark loop.
3. `pi-interactive-shell` monitors long-running commands.
4. A subagent reviewer checks results.
5. Main Pi summarizes branch state, validation, docs, and next steps.

## Bottom line

The installed Pi extensions are well aligned with the `kkb` progressive-autonomy roadmap.

The strongest next step is to compose them into durable workflows:

- prompt templates as entrypoints
- `pi-interview` as scope and decision guardrail
- `pi-web-access` as research layer
- `pi-subagents` as focused reviewers and scouts
- `pi-interactive-shell` as long-running/delegated execution layer
- `pi-messenger` and `pi-intercom` as coordination layers
- `pi-autoresearch` as measured optimization loop

This gives `kkb` a path from current maintainer-style Pi usage to higher-trust autonomous execution without losing the standards, docs hygiene, and verification discipline that already define the project workflow.
