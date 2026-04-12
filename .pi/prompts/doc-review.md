---
description: Review a document with grounded repo context
---
Read $1 and inspect the repository for any relevant current context before responding.

Then provide a grounded document review focused on:
- correctness and internal consistency
- missing implementation detail or technical risk
- mismatches with the current codebase or docs
- unclear scope, sequencing, or acceptance criteria
- concrete improvements

If useful, end with:
- a concise findings list
- a recommended revised outline
- specific edits that should be made next

Additional focus/context: ${@:2}
