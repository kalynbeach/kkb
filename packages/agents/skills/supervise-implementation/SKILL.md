---
name: supervise-implementation
description: Coordinate substantial software implementation with exactly one branch writer and one independent read-only supervisor. Offer this workflow before beginning work that appears substantial.
---

# Supervise implementation

Run substantial implementation with one mutable writer and one independent repository-read-only supervisor. The goal is stronger proof and recovery without parallel writers, status theater, or required planning documents.

If Kalyn explicitly invokes this skill, begin the workflow. If a change merely appears substantial and this skill is available, ask whether to use it before implementation begins. Keep that consultation short; do not silently activate the workflow.

## 1. Define the acceptance contract

Resolve the requested outcome, observable behavior, scope, exclusions, constraints, applicable checks, runtime proof, destructive or external-action boundaries, and terminal state. Use the request, issue, current session, repository instructions, source, tests, and diff as active work context.

Do not create a repository plan or report unless explicitly requested, required by established repository convention, or essential under an installed skill artifact contract.

Complete this step when writer and supervisor can independently state what success and failure mean.

## 2. Assign exactly one writer

Assign roles explicitly:

- **branch writer:** the only agent allowed to edit repository files, run mutating repository commands, commit, or push;
- **implementation supervisor:** independently inspects repository state and evidence but does not edit files, stage, commit, push, or operate the writer's runtime server.

The coordinating agent may be the writer or the supervisor, but never both. Other agents may perform bounded read-only research or evaluation; they do not become writers.

Tell the supervisor the acceptance contract, writer identity, owned paths, relevant proof, and reporting triggers. Tell the writer that supervisor output is evidence to evaluate, not automatic implementation instruction.

Complete this step when one reachable writer and one independent supervisor acknowledge their boundaries.

## 3. Implement with quiet independent supervision

The writer implements the smallest coherent solution, runs focused checks, inspects pending changes, and keeps source, tests, configuration, and any existing affected repository artifact accurate.

The supervisor observes at meaningful checkpoints or when asked. It independently checks scope, source behavior, tests, runtime evidence, repository state, and acceptance criteria. It reports only:

- a valid actionable finding with evidence, impact, and the smallest next action;
- a material scope or ownership violation;
- a blocker or stale-writer condition;
- an acceptance verdict.

The writer independently validates findings before changing code. Invalid findings receive one evidence-based disposition and do not start appeasement loops without new evidence.

## 4. Recover a stopped writer safely

A writer is stopped when it explicitly exits, becomes unavailable, is interrupted without resuming, or fails to respond through the harness's reasonable recovery path. Do not infer stoppage merely from a quiet period while a tool or test is running.

Before replacement, the supervisor inspects the current request, repository status, diff, recent commands and results, acceptance evidence, unresolved findings, and any running process ownership. It then writes an agent-optimal handoff prompt containing:

- outcome, scope, exclusions, and acceptance criteria;
- exact current repository and branch state;
- completed work and proof already obtained;
- unresolved work, risks, and known invalid paths;
- owned files and unrelated changes to preserve;
- next smallest action and required terminal checks.

Send that handoff as the replacement agent's initial message. Only after the prior writer is confirmed stopped does the replacement become the new sole branch writer. Never overlap writers during recovery.

## 5. Close on independent proof

The writer presents final source, test, runtime, and Git evidence against the acceptance contract. The supervisor independently audits the final state rather than trusting the writer's summary.

Complete only when:

- requested behavior and explicit acceptance criteria are satisfied;
- no valid unresolved actionable finding remains;
- applicable checks and runtime proof pass or a precise accepted baseline limitation is recorded;
- scope and repository-artifact policy were respected;
- task-owned changes are understood and unrelated user work is preserved;
- no writer or owned runtime process remains accidentally active.

Return the outcome, evidence, limitations, and exact next user action. Filing or supervising a PR requires separate skill invocation or authority.
