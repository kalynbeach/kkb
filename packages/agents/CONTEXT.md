# KKB Agents

This context defines the durable language owned by `@kkb/agents` for Kalyn's custom agent context, skills, tools, and workflows.

## Context and artifacts

**Repository context**:
The minimal durable information intentionally kept with a project: executable truth, the agent contract, stable domain language, accepted architectural decisions, and actual product or user documentation.
_Avoid_: Project context, docs-first context

**Reopenable artifact**:
A communication or evidence artifact kept at a stable external path so it can be revisited without becoming part of repository context.
_Avoid_: Durable artifact, transient artifact

**Repository artifact**:
Material intentionally version-controlled because it belongs to the project’s durable context, not merely because it must survive the current conversation.
_Avoid_: Durable artifact

**Active work context**:
Lifecycle-bound scope, decisions, progress, and evidence for work in progress. It does not become repository context by default.
_Avoid_: Project documentation, implementation report

**Skill artifact contract**:
A skill’s explicit declaration that a repository artifact is an essential named output of that skill. Incidental plans, evidence, reports, and workflow records do not qualify.
_Avoid_: Documentation obligation

**Artifact reference**:
A storage-neutral handle for a reopenable artifact, accompanied by its privacy, portability, and verification state. It may be a local path now and an artifact ID or URL later.
_Avoid_: Artifact path

**Evidence ledger**:
An explicit inventory connecting material claims to their owning sources.
_Avoid_: Source list

**Artifact base theme**:
The shared KKB visual foundation for HTML communication artifacts, including consistent typography and complete light and dark styles.
_Avoid_: HTML template

**Artifact privacy level**:
The maximum intended audience if an artifact is published: `private` for Kalyn, `restricted` for authorized users or roles, or `public` for unauthenticated access.
_Avoid_: Publication state, access level

**Artifact publication**:
Moving a reopenable artifact into a service or location accessible to an intended audience under a privacy and authorization boundary.
_Avoid_: Artifact delivery

**HTML communication**:
The skill-owned process for composing, rendering, and verifying KKB HTML artifacts. It may learn from external visualization skills and references but does not invoke or wrap them as part of its runtime workflow.
_Avoid_: Visual explainer

## Agent operation

**Agent context**:
The maintained instructions, pointers, skills, and configuration that shape agent behavior across or within projects. Active work state and generated communication artifacts are not agent context.
_Avoid_: Agent guidance, agent docs

**Context improvement**:
A process that ties observed agent failures or corrections to the smallest responsible agent-context surface and evaluates improvements against later runs.
_Avoid_: Context cleanup, guidance rewrite

**Model-invoked skill**:
A skill selected automatically from natural-language intent that can also be invoked explicitly by name.
_Avoid_: Automatic-only skill

**Outcome authority**:
Permission granted by invoking a skill to perform its enumerated in-scope operations toward the named outcome.
_Avoid_: Blanket authority, implied authority

**Observation-only supervision**:
A supervision mode limited to observing and reporting rather than mutation.
_Avoid_: Supervision

**Branch writer**:
The one agent currently assigned and authorized to mutate a development branch.
_Avoid_: PR author, implementation agent

**Supervised implementation**:
A development workflow with one mutable writer and an independent repository-read-only supervisor that audits progress against an acceptance contract.
_Avoid_: Multi-agent implementation, implementation review

**PR-scope cleanliness**:
A state with no uncommitted PR changes and no unexplained changes to paths owned by the PR. Unrelated user work may remain when preserved and reported.
_Avoid_: Clean worktree

**Valid review finding**:
A reviewer claim independently verified against the latest PR head, intended behavior, and agreed scope. Reviewer output is evidence to classify, not proof that a defect exists.
_Avoid_: Review finding, reviewer issue

**Review-ready**:
A PR state in which the latest head has satisfied applicable checks and automated review, has no valid unresolved actionable finding or known critical runtime defect, and is ready for human review.
_Avoid_: Merge-ready

**Agent attribution**:
A one-line PR-body statement naming the model and agent harness responsible for creating, implementing, or owning the delivered change.
_Avoid_: Model attribution

**Meaningful human involvement**:
Kalyn materially prompted, directed, orchestrated, decided, or otherwise shaped agent work. Such work preserves truthful attribution to Kalyn as an author or co-author; agent-only attribution is reserved for work performed autonomously without that involvement.
_Avoid_: Human-in-the-loop, contribution credit

**GitHub access mechanism**:
The available connector, app, integration, or CLI used to operate GitHub; prefer a harness-native integration when it is capable of the task.
_Avoid_: GitHub identity

**GitHub actor identity**:
The account or app shown as performing a GitHub action. Visible agent writes use an agent or app identity; the personal `kalynbeach` identity requires explicit authorization.
_Avoid_: GitHub access mechanism
