# Agent loops and kkb morning briefing

Date: 2026-06-18

## Purpose

This document captures the current research context for designing agent loops and workflows, based on the Theo video summary, local project inspection, previous Codex and Pi agent sessions, and GitHub activity for `kalynbeach`.

No implementation has started. The first concrete loop to design and test is the `kkb` morning briefing.

## Core idea from the Theo video

> https://www.youtube.com/watch?v=iJVJwmCKW9o&

The video argues that developers should move beyond one-off prompts and start designing loops that prompt agents. The important shift is from treating coding agents as direct code editors to treating them as workflow participants that can plan, implement, review, react to feedback, and trigger follow-up work.

The loop pattern from the video is:

1. watch what the human does after an agent finishes;
2. ask whether the agent can perform that next step directly;
3. add bounded automation around that handoff;
4. keep humans responsible for judgment, approval, scope, and cost control.

The useful framing is not "create rigid personas." It is "create a workflow shape that matches the work, then let agents dynamically gather context and divide work."

The main risk is runaway work: long loops can burn tokens, create oversized threads, or continue in the wrong direction. Initial loops should be small, observable, cheap, and easy to stop.

## Working read

The best first target is `~/dev/kkb/kkb`.

Reasons:

- it is active and already has meaningful GitHub issue and PR history;
- it has rich docs and architecture notes;
- it has repeated Codex and Pi session history;
- the repository already reflects an agent-assisted development style;
- the work appears to benefit from recurring context gathering more than from immediate full autonomy.

The first loop should be read-only. It should produce a concise morning briefing that helps decide what to do next in `kkb`; it should not implement code, edit issues, comment on PRs, commit, push, or open PRs.

## Sources inspected

Local project areas:

- `~/dev`
- `~/dev/kkb/kkb`
- `~/dev/research`
- `~/dev/apps/wave-player`
- `~/dev/oss/pi-mono`

Agent history:

- Codex sessions in `~/.codex`
- Pi sessions, prompts, and run history in `~/.pi`

GitHub activity:

- GitHub account: `kalynbeach`
- repos, commits, issues, and PRs going back multiple years where available

Current research repo docs:

- `docs/jamonholmgren-night-shift-workflow.md`
- `docs/2026-06-03-compiler-development-overview.md`

## Local project findings

Around 50 git checkouts were found under `~/dev`. The main clusters were:

- `kkb`
- `research`
- `labs`
- `design`
- `tools`
- `learning`
- `sites`
- `ai/mcp`
- `oss`
- `apps`
- archives

Best initial target:

- `/Users/kalynbeach/dev/kkb/kkb`

Useful secondary context:

- `/Users/kalynbeach/dev/apps/wave-player`
- `/Users/kalynbeach/dev/research`
- `/Users/kalynbeach/dev/oss/pi-mono`

Projects to avoid as first automation targets:

- archived repos;
- dirty prototypes;
- repos without clear issue, PR, or documentation flow;
- repos where the next step is ambiguous and would require early human judgment.

## kkb evidence

Important local files:

- `/Users/kalynbeach/dev/kkb/kkb/README.md`
- `/Users/kalynbeach/dev/kkb/kkb/AGENTS.md`
- `/Users/kalynbeach/dev/kkb/kkb/docs/reports/2026-04-12-pi-customization-summary.md`
- `/Users/kalynbeach/dev/kkb/kkb/docs/reports/2026-04-13-pi-progressive-autonomy-roadmap.md`
- `/Users/kalynbeach/dev/kkb/kkb/docs/reports/2026-04-25-pi-extension-workflow-composition.md`

The `kkb` repo appears to be the strongest place to start because it already combines:

- audio architecture work;
- docs-first planning;
- issue-driven follow-up;
- review-heavy development;
- agent workflow experimentation;
- explicit local conventions for Codex and Pi.

## GitHub findings

Recent or important `kalynbeach/kkb` PRs included:

- `#63 feat: add Ableton package`
- `#62 feat: add binaural beat presets`
- `#51 feat: add binaural beats MVP`
- `#29 feat: add browser oscilloscope v1`
- `#3 feat: add web audio player`

Open or important `kkb` issues included:

- `#50 docs(architecture): record audio and oscilloscope deep-module ownership decisions`
- `#48 refactor(audio): make browser playback runtime capabilities explicit`
- `#47 refactor(audio): define a web audio player session boundary`
- `#31 audio: spike host-owned track playback analyser path for oscilloscope`
- binaural follow-ups `#53` through `#61`

Other repo activity over the last few years included:

- `kalynbeach-net`
- `kalynbeach-xyz`
- `wave-visions`

Operational note:

- local `gh auth status` reported an invalid token for account `kalynbeach`;
- the GitHub connector worked during research;
- any loop that requires local `gh` commands should first handle authentication as a blocker rather than attempting mutations.

## Codex session findings

Codex session counts by cwd were roughly:

- 104 sessions in `/Users/kalynbeach/dev/kkb/kkb`
- 22 sessions in `/Users/kalynbeach/dev/research`
- 7 sessions in `/Users/kalynbeach/dev`
- 4 sessions in `kkb-agentic`
- 4 sessions in `/Users/kalynbeach/dev/apps/wave-player`

Common session names and workflows included:

- `Review web audio docs`
- `Review feature/web-audio-player diff`
- `Spawn subagent to explore repo`
- `Review recent commits and plan next`
- `Explore monorepo structure`
- `Inspect GitHub issues`
- `Map @kkb/audio architecture`
- `Review web audio codebase`
- `Reverse engineer Brainaural`
- `Review next priorities`
- `Design agent loops`

Common tool and workflow patterns:

- parallel exploration;
- docs and architecture review;
- implementation from an explicit plan;
- PR feedback loops;
- browser verification;
- staged diff review before commit;
- final summaries with validation state.

The existing Codex pattern is already close to a loop. The remaining human work is mostly re-entry, prioritization, prompt handoff, review orchestration, and deciding when enough evidence exists to proceed.

## Pi session findings

Local Pi sessions were concentrated in `/Users/kalynbeach/dev/kkb/kkb`.

Repeated user prompt themes:

- review staged changes;
- discuss audio architecture;
- read docs, reports, and plans before acting;
- use `agent-browser` where appropriate;
- do not use worktrees unless explicitly requested;
- use the local commit message style;
- use `gh` for GitHub workflows.

Pi run-history showed agents such as `researcher` and `scout` working on prompts like:

- what should we work on next in the `kkb` repository;
- external evidence gathering;
- local code context gathering;
- practical tradeoff analysis.

Existing global Pi prompts included:

- `project-recap`
- `diff-review`
- `plan-review`
- `fact-check`
- visual plan, diagram, and slides generation

Existing `kkb` `.pi` project prompts included:

- `doc-review`
- `plan-feature`
- `implement-plan`
- `review-staged`
- `draft-pr`
- `review-pr-comments`
- `issue-pass`
- `commit-message`
- `deps-update`
- `grill-interview`

This suggests the first useful loops should coordinate existing habits instead of introducing a new system too early.

## Inferred development style

The local evidence points to a style with these preferences:

- docs and architecture notes are treated as first-class work;
- planning and review often happen before implementation;
- changes are expected to be scoped and intentional;
- staged diffs should be reviewed before commit;
- browser or runtime verification matters when behavior is user-facing;
- issues and PRs are used as durable coordination surfaces;
- agent outputs should be checked by another review pass before human attention is spent deeply;
- broad autonomous implementation should be gated behind clearer scope and stop rules.

## Initial loop candidates

### 1. kkb morning briefing

Purpose:

- summarize the current state of `kkb`;
- identify what matters today;
- recommend the top 1 to 3 next actions;
- surface blockers before any implementation starts.

Why first:

- high value;
- low risk;
- mostly read-only;
- matches existing re-entry and planning behavior;
- can use Codex, Pi, local git, docs, and GitHub context without writing to anything.

### 2. PR review feedback loop

Purpose:

- watch a PR;
- collect comments and failed checks;
- summarize actionable feedback;
- propose or start a bounded fix loop only after explicit approval.

Why not first:

- requires reliable GitHub authentication;
- can mutate comments or code if not carefully bounded;
- benefits from having the morning briefing loop first.

### 3. Docs-to-issues loop

Purpose:

- scan architecture docs and reports;
- detect unresolved decisions or follow-up tasks;
- draft issue updates or new issue candidates.

Why later:

- useful, but easy to create issue churn;
- should begin as a read-only draft generator.

### 4. Plan-to-implementation loop

Purpose:

- take a reviewed plan;
- implement a scoped change;
- run targeted checks;
- review its own diff;
- optionally ask another agent to review.

Why later:

- higher token and mutation cost;
- should be constrained to issues or PRs selected by the morning briefing.

### 5. Browser verification loop

Purpose:

- run the app;
- verify key UI or audio behavior with browser automation;
- capture screenshots or failure notes;
- return exact reproduction steps.

Why later:

- valuable after implementation loops exist;
- must be scoped to avoid long-running exploratory testing.

### 6. Loop garbage collection

Purpose:

- detect stale branches, stale plans, abandoned draft docs, oversized sessions, or repeated failed loops;
- recommend cleanup actions.

Why later:

- useful once multiple loops are running;
- not necessary before the first read-only briefing loop.

## First concrete loop: kkb morning briefing

### Objective

Produce a concise, decision-oriented morning briefing for `/Users/kalynbeach/dev/kkb/kkb`.

The briefing should answer:

- what changed recently;
- what needs attention;
- what is blocked;
- what should be done next;
- what can be delegated to an agent loop;
- what still needs human judgment.

### Trigger

Initial version:

- manual prompt from the user.

Later versions:

- scheduled morning automation;
- explicit "brief me on kkb" command;
- follow-up after an overnight or long-running agent session;
- follow-up after PR activity.

### Inputs

Local repository state:

- current branch;
- `git status`;
- recent commits;
- recent branches, if cheap to inspect;
- recently modified docs and plans.

GitHub state:

- open PRs;
- PR review status;
- failed checks;
- open issues;
- recently updated issues and PRs;
- issues assigned to or created by `kalynbeach`.

Agent history:

- recent Codex sessions touching `kkb`;
- recent Pi sessions touching `kkb`;
- recent prompts or generated plans relevant to `kkb`.

Project docs:

- `README.md`;
- `AGENTS.md`;
- `docs/reports/*`;
- active plans and architecture notes.

Operational state:

- whether `gh` auth works;
- whether required local tools are available;
- whether the worktree is dirty;
- whether there are stale or conflicting branches.

### Output shape

The briefing should be short and structured:

1. State
   - branch;
   - worktree cleanliness;
   - local blockers;
   - GitHub auth status.

2. Recent activity
   - recent commits;
   - recently updated PRs;
   - recently updated issues;
   - relevant recent agent sessions.

3. Needs attention
   - PRs waiting on review or fixes;
   - issues with clear next actions;
   - docs or architecture decisions needing closure;
   - failing checks or local validation problems.

4. Recommended next actions
   - top 1 to 3 actions;
   - each action labeled as human, agent, or mixed;
   - expected scope and risk.

5. Loop opportunities
   - which next step could be handled by an agent loop;
   - which loop should not start yet;
   - what confirmation is needed.

### Stop rules

The loop should stop and report instead of continuing when:

- local `gh` authentication is invalid and the needed data cannot be retrieved another safe way;
- the `kkb` worktree is dirty with unrelated changes;
- a PR or issue requires a product decision;
- the next implementation step is ambiguous;
- validation would require long-running or mutating commands;
- the loop would need to create branches, commits, comments, PRs, issues, or worktrees.

### Non-goals for v0

The first version should not:

- write code;
- edit docs;
- edit issues;
- comment on PRs;
- commit;
- push;
- open PRs;
- run a full test suite unless explicitly requested;
- run long browser tests;
- create or use worktrees;
- trigger other implementation agents automatically.

### Success criteria

The loop is useful if it reliably produces:

- a current snapshot of `kkb`;
- a small ranked action list;
- clear blockers;
- a distinction between human decisions and agent-ready work;
- enough context to start the next loop without another broad rediscovery pass.

It is not useful if it produces a generic status report, buries the decision, or recommends broad work without citing the local reason.

## Proposed v0 briefing prompt

```text
Create a read-only morning briefing for /Users/kalynbeach/dev/kkb/kkb.

Inspect local git state, recent commits, recent docs/plans, relevant recent Codex and Pi sessions, and GitHub PR/issue activity for kalynbeach/kkb. Do not edit files, issues, PRs, branches, or worktrees.

Return:
1. current repo state;
2. recent activity that matters;
3. PRs/issues/docs needing attention;
4. top 1 to 3 recommended next actions;
5. which actions are agent-ready and which require human judgment;
6. blockers, especially auth or dirty-worktree issues.

Keep it concise and cite concrete local paths, issue numbers, PR numbers, or commands inspected.
```

## Open design questions

Follow-up decisions from the first design pass are captured in `docs/agents/kkb-morning-briefing.md`. The original answered questions were:

- where the briefing output should live, if anywhere;
  - The output initially should live in either markdown documents or a single, continuous Codex thread.
  - Eventually, an HTML version of the briefing that is hosted/rendered via the `kkb/web` (or some setup where I can view the HTML briefings on any of my devices) would be ideal.
- whether it should be scheduled or manual first;
  - It should be scheduled as a Codex automation, but should also be manually triggerable (for testing/when necessary).
- whether it should use only local `gh`, only the GitHub connector, or either;
  - It should use either `gh` or the GitHub connector (whatever works best for the Codex automation).
- whether Codex/Pi session lookup should scan full transcripts or only summaries and metadata;
  - Session summaries and metadata by default, but it should efficiently scan and analyze full transcripts for relevant sessions when necessary.
- how far back recent activity should go by default;
  - Recent activity should go back 2 weeks, to start.
- what token budget is acceptable for a daily loop;
  - Token budget for this this daily loop is not a concern initially, but will be looked at more later.
- what exact phrase should trigger it.
  - It should be primarily triggered by the scheduled automation, otherwise, something like "kkb morning briefing" should trigger it.

## Recommended next discussion

Discuss the `kkb` morning briefing v0 in terms of:

- minimum viable input set;
- output format;
- stop rules;
- scheduling;
- whether it should create a durable markdown briefing file or only respond in-thread;
- how to handle invalid `gh` auth;
- when to graduate from read-only briefing to PR review or issue triage loops.
