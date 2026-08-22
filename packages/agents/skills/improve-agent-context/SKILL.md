---
name: improve-agent-context
description: Improve AGENTS.md, skills, prompts, or agent configuration from selected runs and repeated agent failures. Propose a narrow evidence-backed patch before applying it.
---

# Improve agent context

Turn observed agent failures and corrections into the smallest useful change to agent context. Invocation authorizes read-only analysis and a proposal. Applying a patch requires explicit approval; after approval, this same skill may apply and verify only the approved scope.

## 1. Select evidence and target behavior

Use only runs, sessions, transcripts, review loops, corrections, or artifacts explicitly selected by Kalyn or already placed in the current task's scope. Resolve:

- the undesirable agent behavior;
- the desired replacement behavior;
- affected harnesses, repositories, or workflows;
- privacy and credential boundaries;
- the current context surfaces that could own the correction.

Do not broadly mine unrelated history. Redact credentials, private datasets, and irrelevant personal content from analysis and outputs.

Complete this step when the evidence boundary and observable target behavior are explicit.

## 2. Diagnose the failure mechanism

For each candidate pattern, capture:

- what the agent saw;
- what it did;
- why that choice was reasonable or likely under the available context;
- the correction Kalyn supplied;
- whether the behavior repeated or caused enough harm to justify a durable rule.

Distinguish a context failure from a model limitation, tool failure, stale repository state, missing product decision, or one-off mistake. Do not encode a general rule when the evidence does not support one.

Complete this step when each proposed change has a demonstrated failure mechanism.

## 3. Choose the smallest responsible surface

Prefer the narrowest context owner that will be present when the behavior recurs:

1. fix an existing skill when the failure belongs to that workflow;
2. fix repository `AGENTS.md` or stable domain context when the rule is repository-specific;
3. fix global agent context only when the behavior genuinely spans projects and harnesses;
4. add a new skill only when there is a distinct, repeatedly requested workflow with a clear trigger and completion condition.

Replace or remove conflicting, stale, duplicated, or overbroad text instead of appending another rule. Keep active work state, generated plans, reports, and evidence outside durable agent context.

## 4. Propose before mutation

Present a compact proposal containing:

- selected evidence and recurrence or severity;
- diagnosed context failure;
- responsible file or configuration surface;
- exact narrow diff or unambiguous edit;
- expected behavior change;
- realistic positive and negative forward tests;
- text to replace or remove so context does not only grow.

Call out unresolved tradeoffs. Do not edit, install, sync, or publish context yet. Pause for explicit approval.

## 5. Apply only approved scope

After approval, reread the target and apply the smallest approved patch. Preserve unrelated user changes. Do not widen the edit because nearby context could also be improved.

If approval materially changes the proposal, restate the revised narrow diff before applying when the consequence is not obvious.

## 6. Verify behavior and hygiene

Validate syntax or package structure, then forward-test with a realistic prompt or fixture that previously produced the failure. Check both:

- positive behavior: the intended instruction is discovered and followed;
- negative behavior: unrelated tasks do not load unnecessary context or trigger the workflow.

Inspect the final diff for duplication, contradiction, excess length, accidental secrets, and portability across Kalyn's machines and harnesses. Report the evidence, applied files, verification result, and any remaining uncertainty.

Do not install, distribute, or publish context beyond the explicitly approved target.
