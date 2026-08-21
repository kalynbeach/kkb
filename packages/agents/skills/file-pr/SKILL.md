---
name: file-pr
description: File or open a pull request when the user asks to publish, submit, or put a branch up for review.
---

# File a pull request

Create a ready-for-review PR that explains the problem and outcome for Kalyn in plain language. Invocation grants outcome authority to audit the branch, stage and commit already-intended work, push it, and create or update the PR. It does not authorize implementing newly discovered fixes, expanding scope, merging, or closing.

## 1. Resolve the delivery contract

Read context in this order:

1. the current request and any issue or PR it explicitly identifies;
2. active `AGENTS.md` or equivalent repository instructions;
3. the current branch, worktree, diff, history, remotes, and existing PR state;
4. only the stable repository context directly relevant to the changed area, such as `CONTEXT.md`, accepted ADRs, and product documentation.

Do not scan a documentation directory for the "latest" plan, report, or status note. Active work context should come from the request, issue, PR, session, and diff.

Resolve the repository, head, intended base, merge-base, original goal, explicit exclusions, and whether the head already has an open or closed PR. Update or report an existing PR instead of creating a duplicate.

Resolve GitHub access mechanism separately from actor identity:

- prefer a capable harness-native connector, app, or integration;
- otherwise use `gh` or the repository's available mechanism;
- visible agent writes should use an agent or app actor;
- if the only visible write path acts as `kalynbeach`, request explicit authorization before using it.

Complete this step when the target, scope, existing-PR state, and write identity are known.

## 2. Audit and prepare the branch

1. Refresh remote refs and inspect the complete commit range and diff against the merge-base, including staged and unstaged changes that could affect publication.
2. Read every changed file with enough surrounding source, tests, configuration, and stable documentation to verify the goal and detect secrets, generated debris, accidental files, unrelated work, or scope drift.
3. Discover title, body, issue-linking, commit, and validation conventions from repository instructions, templates, CI, scripts, and a small sample of recent commits or PRs.
4. Reuse fresh proof when it covers the current head. Otherwise run focused checks and only the broader gates proportionate to the change and repository risk.
5. Treat branch-caused failures as blockers. Identify verified baseline or infrastructure failures precisely instead of hiding them.
6. When intended work is uncommitted, stage only in-scope paths, inspect the staged diff, and commit with the repository's configured Git identity and conventions. Do not change Git identity or rewrite authorship as part of filing.
7. Preserve unrelated user changes. A globally clean worktree is not required; PR-scope cleanliness is.

If any audit step discovers an implementation defect, stop before staging, committing, pushing, or filing, and report the evidence and exact next action. Filing authority cannot fix it. Continue only after the defect is resolved under separate implementation authority.

Complete this step when every PR-owned change is understood, intended work is committed, validation is sufficient, and exclusions are accounted for.

## 3. Write for the human reviewer

Follow repository conventions. Prefer an outcome-oriented Conventional Commit title when no stronger convention exists. Avoid session narration and file inventories.

The body starts with this structure:

```markdown
## Summary

<the problem and resulting outcome in plain, straightforward language>

Agent: <model> via <harness>

## Changes

- <reviewer-relevant behavior or boundary>

## Validation

- `<exact command>`
- <runtime, UI, artifact, or other direct evidence>

## Scope

- <intentional exclusion, limitation, or follow-up>
```

Use `Agents: <model> via <harness>; ...` only when multiple agents materially created, implemented, or owned the delivered change. Do not list reviewers, read-only supervisors, or agents that made only minor corrections.

Add validation and scope detail in proportion to the change. Link an existing issue, ADR, product document, or explicitly required repository artifact when useful; do not create or duplicate a plan, report, or evidence document just to support the PR. Use `Closes #N` only when the PR truthfully completes the issue. Omit empty or redundant sections other than the required Summary and agent-attribution line.

Human and agent attribution must reflect meaningful involvement rather than contribution-graph optimization. Kalyn remains an author or co-author when he materially prompted, directed, orchestrated, or decided the work; reserve agent-only attribution for genuinely autonomous work.

Complete this step when a human can understand the problem, outcome, proof, boundaries, and responsible agent without reading the diff first.

## 4. Publish and verify

1. Push the intended branch without rewriting unexpected remote history. Stop on unseen remote commits or actor mismatch.
2. Create a ready-for-review PR by default. Use draft state only when explicitly requested or required by active repository policy.
3. Re-read the PR from GitHub and verify its number, URL, head, base, state, title, body, links, and initial checks.
4. Report the PR reference, branch and base, review state, validation state, known limitations, and preserved unrelated changes.
5. Continue into `supervise-pr` only when the user also requested PR supervision.

Complete only when GitHub matches the intended delivery and no PR-owned change remains uncommitted.

Never merge, close, alter branch protection, implement a discovered fix, or expand scope without separate explicit authority.
