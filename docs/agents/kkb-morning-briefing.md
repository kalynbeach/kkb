# kkb morning briefing

Date: 2026-06-18

Status: v0 read-only Codex agent loop

## Purpose

Produce a concise, decision-oriented morning briefing for this repository. The briefing should help decide what to work on next. It should not edit code, docs, issues, PRs, branches, commits, or worktrees.

## Triggers

- Scheduled Codex automation in the morning.
- Manual prompt phrase: `kkb morning briefing`.
- Manual follow-up after a long-running Codex or Pi session.

## Output

For v0, return the briefing in the Codex thread or automation result. Do not create a durable markdown briefing file unless the user explicitly asks for one in that run.

Longer term, a rendered HTML briefing surfaced through `apps/web` or another hosted view would be useful, but that is outside v0.

## Default lookback

Use a two-week lookback for recent local, GitHub, and agent activity unless the user asks for a different window.

## Input Set

Inspect the minimum useful context first:

- `README.md`
- `AGENTS.md`
- this runbook
- `docs/research/2026-06-18-agent-loops-and-kkb-morning-briefing.md`
- recent docs under `docs/plans/`, `docs/reports/`, and `docs/research/`
- current branch and worktree status
- recent commits and recently touched branches
- open and recently updated GitHub PRs and issues for `kalynbeach/kkb`
- recent Codex and Pi session summaries or metadata that mention this repo

Use full Codex or Pi transcripts only when summaries, metadata, or a concrete blocker make a transcript likely to matter.

## GitHub Access

Use whichever read-only GitHub access works best in the automation environment:

- local `gh` commands when authentication works;
- the GitHub connector when it is available and more reliable.

If local `gh` authentication is invalid and no connector is available, report GitHub visibility as a blocker instead of guessing.

## Useful Local Checks

These commands are expected to be read-only:

```bash
git branch --show-current
git status --short
git log --since="2 weeks ago" --oneline --decorate --max-count=30
git for-each-ref --sort=-committerdate --format="%(committerdate:short) %(refname:short)" refs/heads refs/remotes --count=20
```

When using `gh`, prefer read-only list/view commands:

```bash
gh auth status
gh pr list --state open --json number,title,state,isDraft,updatedAt,author,reviewDecision,headRefName
gh issue list --state open --json number,title,updatedAt,author,labels,assignees
```

## Output Template

Keep the briefing short and structured.

```text
State
- branch:
- worktree:
- GitHub access:
- blockers:

Recent Activity
- ...

Needs Attention
- ...

Recommended Next Actions
1. [human|agent|mixed] ...
2. [human|agent|mixed] ...
3. [human|agent|mixed] ...

Loop Opportunities
- agent-ready:
- needs human judgment:
- do not start yet:
```

Use concrete file paths, issue numbers, PR numbers, branch names, or command results when making a recommendation.

## Ranking Rules

Recommend only one to three next actions. Prefer actions that are:

- already supported by a plan, issue, PR, or doc;
- unblocked by local state and GitHub access;
- small enough for a bounded follow-up agent loop;
- likely to improve project momentum today.

Separate human decisions from agent-ready work. Do not turn a product or architecture decision into an implementation recommendation without saying what judgment is missing.

## Stop Rules

Stop and report instead of continuing when:

- the worktree is dirty with changes that appear unrelated to the briefing;
- needed GitHub data is unavailable because auth or connector access is blocked;
- the next step requires a product, architecture, or prioritization decision;
- validation would require long-running or mutating commands;
- the loop would need to create branches, commits, comments, PRs, issues, files, or worktrees.

## Automation Prompt

Use this prompt for the scheduled Codex automation:

```text
Create a read-only morning briefing for the kkb repository.

Read docs/agents/kkb-morning-briefing.md first and follow its v0 scope, input set, output template, ranking rules, and stop rules. Inspect local git state, recent docs and plans, relevant recent Codex and Pi session summaries or metadata, and read-only GitHub PR/issue activity for kalynbeach/kkb. Use a two-week lookback by default.

Do not edit files, issues, PRs, branches, commits, or worktrees. Do not run long validation or browser tests.

Return the current repo state, recent activity that matters, PRs/issues/docs needing attention, top 1 to 3 recommended next actions, which actions are agent-ready versus human-judgment-dependent, and blockers. Keep it concise and cite concrete local paths, issue numbers, PR numbers, branch names, or commands inspected.
```
