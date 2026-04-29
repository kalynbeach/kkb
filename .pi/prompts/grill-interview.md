---
description: Stress-test a plan one decision at a time using pi-interview
argument-hint: "<plan-or-topic> [focus]"
---
Use the `grill-me` skill and the `pi-interview` tool to stress-test this plan or topic: $1

Additional focus/context: ${@:2}

Workflow:

1. Load and follow the `grill-me` skill.
2. Inspect the repository, docs, and code first when the answer can be discovered from local context.
3. Identify the next most important unresolved decision, dependency, assumption, or risk.
4. Ask exactly one decision checkpoint at a time using `interview`, not chat.
5. For each interview form:
   - use a focused title and description
   - include any relevant repo findings as an `info` question when useful
   - ask one primary `single`, `multi`, or `text` question
   - provide 2-4 concrete options for choice questions
   - mark your recommended answer with `recommended`
   - use `conviction: "strong"` only when highly confident, `conviction: "slight"` when unsure
   - use `weight: "critical"` for decisions that affect scope, architecture, data flow, ownership, safety, or sequencing
   - include a short text question for nuance, constraints, or overrides
6. After each answer, summarize what was decided and why it matters.
7. Continue down the decision tree until the remaining ambiguity is low enough to produce a concrete plan, implementation contract, or next action.
8. End with:
   - decisions made
   - assumptions accepted
   - risks still open
   - recommended next action

Do not batch unrelated decisions into one large form. If there are multiple branches, choose the highest-leverage branch first and continue sequentially.
