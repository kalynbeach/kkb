# Monorepo Overview Index

**Date:** 2026-03-28  
**Repo:** `kkb`

This index links to three companion documents that summarize the monorepo's current state, workspace inventory, and recommended next steps.

## Documents

1. [`2026-03-28-monorepo-architecture-map.md`](./2026-03-28-monorepo-architecture-map.md)
   - High-level architecture of the Bun + Turborepo workspace
   - Current package/app relationships
   - Audio integration map for `apps/web`, `@kkb/audio`, and `@kkb/ui`

2. [`2026-03-28-monorepo-workspace-inventory.md`](./2026-03-28-monorepo-workspace-inventory.md)
   - Workspace-by-workspace inventory
   - Roles, scripts, dependencies, routes, maturity, and key files
   - Mermaid diagram of apps/packages and internal dependency flow

3. [`2026-03-28-monorepo-prioritized-next-steps.md`](./2026-03-28-monorepo-prioritized-next-steps.md)
   - Recent work summary
   - Recently closed and currently open GitHub issues
   - Recommended sequence of next work, with rationale

## Snapshot Notes

This overview is grounded in the repository state on `main` as of 2026-03-28, including:

- root workspace manifests (`package.json`, `turbo.json`)
- app/package manifests under `apps/*` and `packages/*`
- current `apps/web` route surfaces (`/audio`, `/ui`, `/json-render`)
- current docs under `docs/`
- recent git history on `main`
- GitHub issues queried with `gh`

## Fast Summary

- `apps/web` is the active sandbox and verification host.
- `apps/docs` exists but is still a lightweight shell.
- `@kkb/audio` is the most clearly layered runtime package.
- `@kkb/ui` is the broadest shared package, spanning design-system primitives, audio UI, and `json-render` integration.
- The biggest recent push has been the `/ui` catalog plus dependency/doc cleanup.
- The clearest near-term follow-ups are audio UX polish, shared app-shell cleanup, and a decision about backend/package expansion.
