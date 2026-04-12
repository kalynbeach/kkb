---
description: Review PR comments and turn them into an action plan
---
Use `gh` to inspect PR $1, including review comments and relevant discussion.

Then provide:
- a grouped summary of requested changes
- which comments appear already resolved vs still actionable
- a recommended implementation order
- any comments that imply docs/tests/architecture updates
- a concise execution plan for addressing the review

Additional focus/context: ${@:2}
