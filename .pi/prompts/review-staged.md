---
description: Review current staged or pending changes before commit
---
Review the current staged changes (or the full pending diff if nothing is staged) in the context of the current branch, recent work, and any obviously related docs.

Focus on:
- correctness / regressions
- architectural fit
- UI/UX issues if applicable
- docs drift
- missing validation
- follow-up risks

Return:
- a concise summary of what changed
- findings grouped by severity if needed
- suggested next fixes before commit
- a commit-readiness recommendation

Additional focus/context: $@
