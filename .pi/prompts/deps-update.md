---
description: Review and plan dependency updates carefully
---
Inspect current dependency state and relevant workspace/package context using Bun-native commands and workflows.

1) Check outdated monorepo root dependencies: `bun outdated`
2) Check outdated monorepo workspace and catalog dependencies: `bun outdated --filter="*"`

Then provide:
- the recommended update strategy
- which dependencies should be updated now vs deferred
- monorepo/catalog implications
- likely breakage or migration risks
- validation steps to run after updating

If asked to proceed, make the updates conservatively and summarize the result clearly.

Additional focus/context: $@
