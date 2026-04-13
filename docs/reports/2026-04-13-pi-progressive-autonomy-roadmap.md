# Pi progressive autonomy roadmap

_Date: 2026-04-13_

## Purpose

This document captures the next-stage direction for Pi customization in the `kkb` monorepo after the initial April 12 customization pass.

The goal is not merely to make Pi safer or more guided in conversational sessions. The goal is to build a **standards-aligned Pi system that works well across multiple operating modes**:

1. **conversational mode** — collaborative thinking, review, planning, critique, and scoped implementation
2. **supervised builder mode** — Pi executes substantial work while the human remains nearby for approvals and steering
3. **high-trust autonomous mode** — Pi can take a scoped contract, run for long periods, verify completion, and stop only when complete or truly blocked

These modes should share a common foundation of workflow structure, guardrails, verification culture, repo conventions, and output quality expectations.

---

## Context and inputs

This roadmap is based on:

- the earlier summary in `docs/reports/2026-04-12-pi-customization-summary.md`
- additional review of Pi sessions on this MacBook Pro
- current Pi docs for sessions, prompt templates, skills, extensions, themes, packages, TUI, and examples
- the repo's current project-local Pi state in `.pi/`
- relevant research/docs already in the repository, especially:
  - `docs/research/codex-harness-engineering.md`
  - `docs/research/jamonholmgren-night-shift-workflow.md`

### Additional findings from this MacBook Pro

This machine currently has a small Pi history footprint for `kkb`, but it reinforces the same workflow shape identified in the prior report.

Observed local session characteristics:

- only 3 saved Pi sessions for `kkb`
- usage heavily concentrated in `read` and `bash`, with much lighter `edit`/`write`
- all sessions used `openai-codex/gpt-5.4`
- one substantial doc-driven implementation session around the browser oscilloscope work
- little or no use yet of session naming, bookmarks, tree navigation, or Pi-native workflow/orchestration resources beyond appended system instructions and prompt templates

Even with this smaller local sample, the same core pattern is visible:

1. read docs first
2. inspect code/repo state
3. tighten plans/docs
4. implement carefully
5. verify with targeted checks and browser review when relevant
6. improve commit quality before wrapping up

This continues to validate that `kkb`'s Pi usage is fundamentally **doc-driven, maintainer-style, verification-heavy, and standards-conscious**.

---

## Updated north star

The earlier framing of **high-trust autonomous Pi** remains important, but it is not the only target use case.

The better framing is:

> Build Pi into a **high-trust, standards-aligned engineering partner** that works beautifully in conversation and scales up to autonomous execution when the task warrants it.

Or, more concretely:

> Build **progressively autonomous Pi** for `kkb` — one Pi system that supports conversational collaboration, supervised execution, and long-running autonomous workflows through a shared foundation of policy, workflows, verification, and resumability.

This framing matters because it avoids a false tradeoff:

- guardrails/workflows are **not** the alternative to autonomy
- guardrails/workflows are the infrastructure that makes autonomy trustworthy

The same investments that improve normal day-to-day conversational Pi usage should also become the substrate for overnight or long-running agent work.

---

## Product vision for Pi in `kkb`

Pi should increasingly feel like:

- a **standards-aware collaborator** in normal interactive sessions
- a **high-leverage builder** for larger scoped tasks
- a **reliable autonomous branch worker** for longer execution loops

That means Pi should be able to:

- read and use docs as a real system of record
- internalize repository-specific engineering and design norms
- stay aligned with Bun-first tooling and `kkb` repo conventions
- verify code changes through real checks rather than confidence alone
- verify UI work through browser-based review and evidence
- preserve high-quality commit, docs, and review hygiene
- recover and resume long-running work without losing task structure
- scale from narrow assistance to hours-long execution

The long-term aspiration is not merely “more output.”

The aspiration is:

- more research
- more design and planning
- more implementation
- more verification
- more shipping
- better software quality
- more beautiful and polished user-facing work
- less human babysitting
- much higher leverage per unit of human attention

---

## Operating modes

Pi customization should explicitly support three operating modes.

### 1. conversational mode

Use cases:

- repo-aware Q&A
- doc review
- feature planning
- design critique
- implementation discussion
- staged diff review
- PR drafting
- issue extraction
- lightweight bug triage

Desired qualities:

- concise but grounded
- reads docs and code before advising
- respects repo conventions automatically
- requires less corrective steering
- produces stronger plans and more relevant findings
- improves quality of normal pair-programming and maintainer work

### 2. supervised builder mode

Use cases:

- implement a scoped plan
- perform doc + code updates in one pass
- run targeted validation
- perform browser verification
- prepare commit and PR materials
- do design/polish passes with human checkpoints

Desired qualities:

- larger chunks of work with less micromanagement
- explicit validation and review before “done”
- reusable workflow structure instead of ad hoc prompting
- high confidence that outputs are repo-aligned and reviewable

### 3. high-trust autonomous mode

Use cases:

- overnight implementation from a spec/contract
- long-running research and planning passes
- autonomous UI polish loops
- queue-based task execution across branches
- review/verification loops that continue without supervision

Desired qualities:

- machine-readable task contracts
- clear success criteria and stop conditions
- durable state and resumability
- verifier loops instead of “done by vibe”
- escalation only on genuine blockers or judgment calls
- clean morning artifacts: branch state, report, docs, checks, draft PR materials

---

## Foundational design principles

These principles should shape all further Pi customization work.

### 1. one substrate, many autonomy levels

Do not build separate “chat Pi” and “autonomous Pi” systems.

Instead, build one strong foundation that improves:

- interactive collaboration today
- supervised execution next
- autonomous runs later

### 2. repository-local knowledge should be first-class

The strongest patterns in both `kkb` and the harness-engineering research point the same way:

- docs should be the map and system of record
- Pi should be taught where to look, not overloaded with one giant prompt blob
- plans, reports, specs, QA docs, and acceptance criteria should increasingly live in-repo in stable, discoverable locations

### 3. autonomy requires contracts, not vibes

If Pi is asked to run without supervision, it should do so against an explicit completion contract.

Every autonomous task should make clear:

- the objective
- constraints and non-goals
- allowed actions
- required verifiers
- success artifacts
- stop/escalation conditions

### 4. verification is the heart of trust

High-trust autonomy is mostly a verification problem.

The more Pi is allowed to act independently, the more “done” must be defined by concrete evidence such as:

- tests
- type checks
- lint/format
- browser smoke
- route-specific UI verification
- docs updated
- artifacts generated
- review-ready diff quality

### 5. resumability and state matter as much as prompts

For long-running work, durable task state matters more than conversational elegance.

Pi should be able to resume work from stable artifacts such as:

- a task contract/spec
- progress log or task state file
- verifier results
- file scope list
- next-step notes
- blocker records

### 6. human attention is precious

Pi should reduce, not increase, the need for babysitting.

The ideal system:

- lets the human think, design, review, and prioritize
- lets Pi perform the repetitive, high-throughput, context-heavy work
- tightens feedback loops so each session improves the system itself

---

## Shared foundational layers

The Pi roadmap for `kkb` can be thought of as five stacked layers.

### 1. policy layer

Purpose:

- encode the stable engineering, repo, and design preferences that should apply in all modes

Examples:

- Bun-first tooling
- `gh` for GitHub workflows
- avoid worktrees unless explicitly requested
- prefer `localhost`
- no dangerous shell behavior without confirmation
- no broken commits
- keep docs and code aligned
- inspect `docs/` before touching planning/architecture material
- prefer `@kkb/ui` for shared UI primitives and hooks
- browser verification discipline
- conventional commit quality expectations

Current state:

- partially captured in `.pi/APPEND_SYSTEM.md`

Needed next:

- runtime enforcement/warnings through extensions, not just prompt text

### 2. workflow layer

Purpose:

- turn repeated task patterns into named, reusable workflows

Examples:

- doc review
- plan feature
- implement plan
- review staged
- draft PR
- review PR comments
- issue extraction
- browser review
- design critique / polish pass
- dependency review

Current state:

- started through `.pi/prompts/*.md`

Needed next:

- skills and commands that encode multi-step behavior, not just prompt expansion

### 3. orchestration layer

Purpose:

- coordinate phases, retries, handoffs, and progress across larger tasks

Examples:

- plan → implement → verify → polish → review
- autonomous overnight loops
- queueing and retry logic
- status widgets and progress tracking
- subagent coordination

Current state:

- not yet built

Needed next:

- workflow extension(s), task state, and later a real orchestrator

### 4. verification layer

Purpose:

- define what counts as “complete” for code, docs, UI, and shipping readiness

Examples:

- targeted test/type/lint checks
- browser smoke and route verification
- screenshot/report capture
- docs update checks
- staged diff review and artifact hygiene

Current state:

- partly expressed through repo habits and prompt templates
- partly reinforced through existing browser-based workflows

Needed next:

- explicit verifier bundles and reusable review/verification workflows

### 5. memory / resumability layer

Purpose:

- preserve enough structured context for long-running or resumed work

Examples:

- session naming and bookmarks
- custom compaction tuned for `kkb`
- task contracts and progress logs
- summary artifacts and handoff files

Current state:

- almost entirely undeveloped in Pi-native terms

Needed next:

- custom compaction, session metadata helpers, and task-state persistence

---

## What should improve for everyday conversational Pi

The first customization wave should continue to make ordinary interactive Pi sessions noticeably better.

### Conversational Pi goals

Pi should more reliably:

- read relevant docs before answering
- inspect current code and git state before advising
- produce plans grounded in the repo as it exists now
- review staged changes with stronger correctness/docs/UX sensitivity
- draft higher-quality commit and PR materials
- respect `kkb` UI-system patterns automatically
- use browser verification with concrete evidence and findings
- retain the important parts of long sessions without losing scope or state

### Conversational Pi improvements to prioritize

1. stronger guardrails
2. richer workflow skills
3. session naming/bookmarking
4. custom compaction
5. browser-review workflow helpers
6. commit-preflight support
7. better report/handoff generation

These are all worthwhile even without autonomous execution.

---

## What should improve for autonomous Pi

Autonomous Pi needs some additional structure beyond better prompts and guardrails.

### Autonomous Pi goals

Pi should be able to:

- take a scoped task contract/spec
- create and refine a plan
- execute through multiple phases
- run checks and verification loops repeatedly
- update docs along with code
- use browser-based evidence when relevant
- recover from failures or retries
- stop only on completion or a true blocker
- leave a concise but useful morning report

### Autonomous Pi requirements

To safely get there, the system will need:

- task contracts/specs
- verifier bundles
- durable workflow state
- resumability
- orchestration commands and status views
- optional subagents/personas
- clear escalation rules

---

## Proposed customization architecture

A modular approach is recommended so the system can scale without becoming tangled.

### A. universal resources

These should improve almost every Pi session.

#### `kkb-agent-policy`

Type:

- extension

Responsibilities:

- enforce or warn on repo/tooling guardrails
- dangerous shell confirmations
- Bun-first command expectations
- Git/worktree/path warnings
- browser timeout and URL discipline
- optional commit-readiness checks before commit-like actions

#### `kkb-session-flow`

Type:

- extension and/or commands

Responsibilities:

- workflow launcher for common session types
- auto-session naming
- milestone bookmark helpers
- optional status widget showing branch/workflow/check state

#### `kkb-custom-compaction`

Type:

- extension

Responsibilities:

- replace or augment default compaction with `kkb`-specific summaries
- preserve goal, scope, docs, changed files, validation state, open questions, and next steps

#### `kkb-browser-review`

Type:

- skill plus optional extension helpers

Responsibilities:

- standardize browser verification expectations
- use the right browser skill/tooling first
- default to `localhost`
- keep timeouts short
- verify exact route
- return concrete UX/visual/implementation findings
- support report output patterns

#### `kkb-commit-preflight`

Type:

- extension and/or prompt+skill pair

Responsibilities:

- summarize current changes
- review validation coverage
- assess docs drift
- help draft repo-style commit messages
- support commit-readiness decisions

### B. interactive / supervised workflow resources

These primarily improve conversational and supervised-builder sessions.

#### `kkb-doc-driven-feature`

Type:

- skill

Responsibilities:

- read plans/research/reports first
- inspect current code state
- surface assumptions and risks
- guide implementation in phases
- keep docs in sync

#### `kkb-design-pass`

Type:

- skill

Responsibilities:

- run UI critique/polish-oriented workflows
- inspect `@kkb/ui` before creating local patterns
- use browser-based evidence
- call out concrete visual/UX issues and fixes

#### `kkb-handoff`

Type:

- skill or prompt template set

Responsibilities:

- generate implementation reports, next-step notes, or issue proposals from the current state of work

### C. autonomy / orchestration resources

These can be layered in once the shared substrate feels solid.

#### `kkb-task-contract`

Type:

- skill plus file format convention

Responsibilities:

- define a reusable task spec format for autonomous work
- capture goal, scope, constraints, acceptance criteria, required checks, routes to verify, docs to update, stop conditions, and expected artifacts

#### `kkb-orchestrator`

Type:

- extension

Responsibilities:

- run named workflows across phases
- persist workflow state
- resume interrupted tasks
- retry verifier failures within limits
- expose phase/progress widget(s)
- stop with clear blocked/completed outcomes

#### `kkb-subagents`

Type:

- package of subagent definitions plus workflows

Responsibilities:

- parallel reconnaissance
- planning specialization
- review specialization
- browser review specialization
- UI polish specialization

#### `kkb-verifiers`

Type:

- skill/extension helpers and scripts

Responsibilities:

- standard verifier bundles for code, docs, browser/UI, and shipping readiness

---

## Proposed task contract structure

A contract-driven approach is recommended for autonomous or semi-autonomous tasks.

A contract file could live in a repo-controlled location such as:

- `docs/plans/`
- `docs/specs/`
- or a dedicated future folder if needed after patterns stabilize

### Suggested sections

- **goal**
- **context / related docs**
- **scope**
- **non-goals**
- **constraints**
- **files or packages likely in scope**
- **acceptance criteria**
- **required verifiers**
- **routes or browser states to verify**
- **docs that must be updated**
- **allowed actions**
- **stop / escalation conditions**
- **expected completion artifacts**

### Why this matters

This structure makes tasks:

- easier to hand off
- easier to resume
- easier to review
- easier to verify
- less dependent on conversational memory

---

## Verification framework direction

Pi should move toward reusable verification bundles.

### 1. code verifier

Typical checks:

- targeted tests
- type checks
- lint/format
- package/app-specific validations

### 2. browser verifier

Typical checks:

- route opens successfully
- exact route/path verified
- screenshots captured
- critical interactions tested
- specific visual modes/states reviewed
- concrete findings recorded

### 3. docs verifier

Typical checks:

- relevant plans/reports/specs updated when behavior changes
- docs and implementation stay aligned
- new docs placed in the right directory and naming format

### 4. git/review verifier

Typical checks:

- no junk artifacts staged
- pending diff summarized
- commit message quality bar met
- PR notes/draft available if needed

### 5. UI quality verifier

Typical checks:

- spacing/hierarchy/typography issues reviewed
- responsive states checked when relevant
- accessibility or interaction rough edges noted
- concrete polish findings returned instead of generic approval

---

## Suggested subagent roles

Subagents are not the first build target, but they are likely a major leverage point later.

### Recommended initial roles

- **scout-docs** — inspect plans/research/specs and summarize only what matters
- **scout-code** — inspect current code paths, packages, and architectural fit
- **planner** — turn findings into phased implementation plans
- **reviewer** — review diffs/changes for correctness and missing updates
- **browser-reviewer** — focus only on browser/UI verification evidence and findings
- **ui-polish** — critique and refine visual/UI quality
- **issue-writer** — extract follow-up work into issue-ready proposals

### Model strategy

As usage scales up, model specialization will likely matter.

A good heuristic:

- cheaper/faster models for scouting, summarizing, extraction, and routine classification
- stronger reasoning models for planning, architecture, code review, and final integration
- visually/design-sensitive workflows can use specialized critique/polish prompts/skills and browser evidence

---

## Recommended workflows to enable over time

### 1. doc-driven feature workflow

Good for:

- normal interactive work
- supervised implementation

Flow:

1. read plan/research/spec docs
2. inspect code and repo state
3. summarize current state and risks
4. propose phased plan
5. implement in scoped passes
6. run targeted validation
7. update docs
8. review staged changes
9. prepare commit/PR materials

### 2. browser review workflow

Good for:

- UI changes
- browser-based bugfixes
- design/polish work

Flow:

1. verify exact local route
2. inspect states/modes/interactions
3. capture evidence where useful
4. report concrete findings
5. implement fixes or polish
6. rerun verification
7. produce/update smoke report when warranted

### 3. research-to-plan workflow

Good for:

- upcoming feature areas
- architecture decisions
- larger planning efforts

Flow:

1. inspect repo docs and relevant code
2. gather current state and options
3. compare tradeoffs
4. propose a phased plan
5. optionally generate follow-up issues and task contracts

### 4. design/polish workflow

Good for:

- improving UI quality and beauty intentionally

Flow:

1. inspect route/component in browser
2. critique hierarchy, spacing, typography, responsiveness, motion, and edge cases
3. implement improvements with `@kkb/ui` awareness
4. rerun browser review
5. stop when the requested quality bar is satisfied

### 5. overnight feature workflow

Good for:

- autonomous feature branch work with strong contracts and verifiers

Flow:

1. load task contract/spec
2. inspect docs and code
3. create or refine internal plan
4. implement scoped phase(s)
5. run code verifiers and fix failures
6. run browser/UI verifiers where relevant and fix findings
7. update docs and reports
8. review diff quality
9. prepare commit/PR artifacts
10. continue until complete or truly blocked
11. write concise morning report

---

## Roadmap: phased build-out

### Phase 0 — current baseline

Already done:

- `.pi/APPEND_SYSTEM.md`
- initial `.pi/prompts/*.md`
- stable articulation of many repo preferences
- initial Pi customization summary doc

### Phase 1 — strengthen all conversational Pi use

Priority:

- high
- immediate value for every session
- also lays groundwork for later autonomy

Recommended deliverables:

1. **`kkb-agent-policy` extension**
   - Bun/worktree/localhost/destructive-command guardrails
   - optional warnings around docs placement and browser habits
2. **`kkb-session-flow` extension**
   - session naming
   - bookmarks
   - lightweight workflow launcher
3. **`kkb-custom-compaction` extension**
   - `kkb`-specific context retention
4. **`kkb-browser-review` skill**
   - standardized browser verification workflow
5. **`kkb-doc-driven-feature` skill**
   - codify the repo's doc-first implementation loop
6. **`kkb-commit-preflight` helper**
   - stronger end-of-session review and commit support

Expected outcome:

- conversational Pi feels much more like a disciplined `kkb` collaborator
- fewer manual corrections
- better session structure
- higher-quality planning/review/output

### Phase 2 — supervised agentic workflows

Priority:

- medium-high
- expands work chunk size without requiring full unattended autonomy yet

Recommended deliverables:

1. plan/read-only mode for repo analysis and planning
2. phased workflow execution helpers
3. verifier bundles for code/browser/docs/review
4. handoff/report generation helpers
5. initial subagent experimentation for scouting and review

Expected outcome:

- Pi can do bigger chunks of work with less human micromanagement
- stronger repeatability in planning, implementation, and review
- better evidence-oriented completion behavior

### Phase 3 — autonomous branch worker v1

Priority:

- medium, but strategically important
- should follow once phases 1 and 2 feel stable

Recommended deliverables:

1. `kkb-task-contract` format
2. `kkb-orchestrator` extension with phase tracking and state persistence
3. verifier loop integration
4. resume/retry/blocker handling
5. concise morning report output

Expected outcome:

- Pi can take a scoped contract and make substantial unattended progress on a branch
- work is resumable, reviewable, and verifier-backed

### Phase 4 — broader overnight / queued autonomy

Priority:

- later
- dependent on proof that earlier phases are trustworthy

Possible deliverables:

1. queue-based overnight task runner
2. multiple branch/task orchestration
3. richer subagent ecosystems and review personas
4. optional PR-opening / ship-prep automation
5. budget/runtime controls and dashboards

Expected outcome:

- Pi becomes a real “night shift” or asynchronous engineering system, not just an interactive tool

---

## Recommended v1 package and file structure direction

The exact structure can evolve, but a likely direction is:

```text
.pi/
├── APPEND_SYSTEM.md
├── prompts/
│   ├── existing prompt templates...
│   └── future additions...
├── skills/
│   ├── kkb-doc-driven-feature/
│   │   └── SKILL.md
│   ├── kkb-browser-review/
│   │   └── SKILL.md
│   ├── kkb-design-pass/
│   │   └── SKILL.md
│   └── kkb-task-contract/
│       └── SKILL.md
├── extensions/
│   ├── kkb-agent-policy.ts
│   ├── kkb-session-flow.ts
│   ├── kkb-custom-compaction.ts
│   ├── kkb-commit-preflight.ts
│   └── kkb-orchestrator/
│       └── index.ts
└── themes/
    └── optional future theme(s)
```

Once patterns stabilize, these resources could eventually be bundled into a reusable Pi package.

---

## Recommended success criteria for the next customization wave

The next wave should be considered successful if it measurably improves both normal interactive work and later autonomy readiness.

### Conversational success signals

- less repeated steering around tool choice and repo conventions
- better default behavior in doc review, planning, implementation, and browser verification
- improved late-session coherence via compaction and metadata helpers
- more consistent commit-readiness reviews and commit message quality

### Supervised-builder success signals

- Pi can reliably carry out doc-driven implementation slices with less micromanagement
- browser verification and report output feel standardized rather than improvised
- design/polish passes are more evidence-based and actionable

### Autonomy-readiness success signals

- tasks can be represented in reusable contract/spec form
- completion is increasingly verifier-backed
- long-running work can be resumed cleanly
- workflow state is not trapped only in conversation history

---

## Recommended immediate next implementation slice

If the next pass should optimize for both immediate value and future autonomy, the best first slice is likely:

1. **`kkb-agent-policy`**
2. **`kkb-session-flow`**
3. **`kkb-custom-compaction`**
4. **`kkb-browser-review`**
5. **`kkb-doc-driven-feature`**

Why this slice first:

- it materially improves everyday conversational Pi usage
- it reduces repeated manual corrections
- it creates structure around session flow, browser verification, and context retention
- it lays the foundation for later task contracts and orchestration

The next slice after that should likely be:

1. **task contract format**
2. **verifier bundle definitions**
3. **orchestrator v1**

---

## Summary

The `kkb` Pi customization effort should now be treated as a two-track but shared-foundation effort:

1. **make conversational Pi much better immediately**
2. **use that stronger substrate to enable progressively more autonomous Pi workflows**

The important insight is that these goals reinforce each other.

- better policy makes autonomy safer
- better workflows make conversation more productive
- better verification improves both supervised and unsupervised execution
- better memory/resumability improves both long sessions and overnight runs

The long-term opportunity is substantial:

- Pi as a stronger daily collaborator for research, planning, coding, design, and shipping
- Pi as a high-trust autonomous worker for scoped, verifier-backed overnight tasks
- Pi as a system that helps `kkb` ship more, faster, and with higher quality while preserving strong engineering and design standards

That should remain the guiding direction for the next customization phase.
