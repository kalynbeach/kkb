---
name: supervise-pr
description: Supervise or babysit a pull request through CI, automated review, and evidence-based in-scope repair. Watch or monitor requests use observation-only mode.
---

# Supervise a pull request

Run a quiet, evidence-driven loop until the latest PR head is review-ready or a terminal blocker requires Kalyn. Explicit `supervise-pr`, "supervise," or "babysit" requests grant outcome authority for the enumerated repair operations below. Requests only to "watch" or "monitor" invoke observation-only supervision.

Supervision never authorizes merging or closing.

## 1. Establish scope, authority, and ownership

Read context in this order:

1. the current request, PR body, linked issue, and relevant review threads;
2. active repository instructions;
3. the complete current-head diff, branch history, checks, and merge state;
4. only stable repository context directly relevant to the change.

Record the original goal, explicit exclusions, acceptance criteria, applicable validation, latest head SHA, base, required checks and approvals, automated reviewers, unresolved threads, and draft state. This is the scope fence.

Resolve the GitHub access mechanism and visible actor as in `file-pr`: prefer a capable harness-native integration, fall back to `gh` when needed, and request explicit authorization before visible writes as `kalynbeach`.

There is a concurrent branch writer only when another agent currently has the explicit mutable assignment and remains reachable or is known to be working. Historical implementation or PR authorship does not retain ownership. In outcome-authority mode, this skill owns narrow branch mutations unless such a concurrent writer exists. With a concurrent writer, remain repository-read-only and send that writer concise evidence, impact, and the next action.

Complete this step when the scope fence, mode, current head, actor, and sole writer are explicit.

## 2. Observe only material changes

Use harness-native waiting or monitoring when available; otherwise poll at bounded intervals. Refresh:

- head SHA and commits;
- base movement, conflicts, and mergeability;
- applicable check conclusions and relevant logs;
- approvals, summaries, inline comments, discussion, and unresolved threads;
- draft, obsolete, and writer-ownership state.

Compare each observation with the previous one. Stay quiet when nothing material changed. Evidence applies only to the head it evaluated.

In observation-only mode, classify and report evidence but never edit, commit, push, reply, resolve, rebase, or change PR state. Stop or keep waiting according to the request.

## 3. Prove and classify every finding

Independently test each check failure or reviewer claim against the latest source, intended behavior, and scope. Classify it as:

- valid and actionable in scope;
- valid but outside scope;
- duplicate, stale, or already resolved;
- invalid or misleading;
- product or architecture decision for Kalyn;
- repository-independent infrastructure flake.

A reviewer statement is evidence to investigate, not proof. A **valid review finding** requires independent support. Never make appeasement changes merely to silence an invalid finding.

For invalid, misleading, stale, duplicate, or out-of-scope findings, post one concise evidence-based disposition through the approved actor and resolve the thread when the platform permits. Do not enter a repeated debate unless materially new evidence appears.

Complete this step when every new failure and thread has an evidence-backed classification.

## 4. Repair the smallest valid scope

Outcome-authority mode permits these operations for a valid in-scope finding:

1. reproduce or otherwise prove the issue;
2. make the smallest correction;
3. add or strengthen focused coverage when behavior changed;
4. run affected checks and proportionate repository or runtime proof;
5. update the PR body and any existing repository artifact whose claims became inaccurate;
6. inspect the pending diff, commit using repository conventions and configured identity, push normally, and resume observation on the new head.

Do not create a plan, report, evidence file, or other repository artifact unless explicitly requested, required by established repository convention, or essential under an installed skill artifact contract.

For CI, prove whether a failure is branch-caused before changing code. Retry a demonstrated flake; investigate deterministic failures. Do not spend repeated runs without new evidence.

Rebase only when base movement materially blocks mergeability, invalidates evidence, creates conflicts, or repository policy requires freshness. Require a PR-scoped clean state and freshly fetched refs. After rebasing, rerun affected proof and use a lease-protected push only if the remote head still equals the SHA previously observed. Stop on mismatch.

Complete each repair cycle when the mutation or response is published through the approved actor and observation has resumed on the resulting head.

## 5. Stop at a defined terminal state

Stop at `review-ready` when all of these hold on the latest head:

- all required checks and any other checks applicable to the acceptance contract pass;
- applicable automated review has completed;
- no **valid** unresolved actionable finding remains;
- the PR is mergeable and current enough for repository policy;
- the PR body and existing linked repository artifacts accurately describe the diff and evidence;
- PR-scope cleanliness holds, even if preserved unrelated user work remains;
- no known critical runtime defect remains.

Human approval is a separate state. Continue to `merge-ready` only when explicitly asked; it additionally requires repository-mandated human approvals on the latest head.

Leave draft or ready state unchanged unless explicitly requested or active policy requires a transition. Never merge or close.

Stop and report when the next action requires a product decision, broader implementation authority, unavailable approved identity, unsafe history rewrite, external coordination, or a non-transient external state change. Ask before closing an obsolete PR. Otherwise keep waiting quietly through temporary external outages.

Report only the terminal result, a material intervention, or a concrete blocker: current head, checks, review disposition, mutations made, remaining risk, and exact next human action.
