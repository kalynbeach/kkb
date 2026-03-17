# Root Docs Refresh Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refresh root `README.md` and `AGENTS.md` so they match the monorepo's current workspaces, commands, and package responsibilities.

**Architecture:** Treat `README.md` as the user-facing repo entrypoint and `AGENTS.md` as the contributor/agent operating guide. Pull facts from root and workspace manifests plus current app/package surfaces, then align both docs around one shared inventory and one consistent command vocabulary.

**Tech Stack:** Markdown, Bun workspaces, Turborepo, Next.js 16, React 19, TypeScript 5.9, Biome

---

### Task 1: Lock Shared Facts

**Files:**
- Modify: `/Users/kalynbeach/dev/kkb/kkb/README.md`
- Modify: `/Users/kalynbeach/dev/kkb/kkb/AGENTS.md`
- Reference: `/Users/kalynbeach/dev/kkb/kkb/package.json`
- Reference: `/Users/kalynbeach/dev/kkb/kkb/turbo.json`
- Reference: `/Users/kalynbeach/dev/kkb/kkb/apps/web/package.json`
- Reference: `/Users/kalynbeach/dev/kkb/kkb/apps/docs/package.json`
- Reference: `/Users/kalynbeach/dev/kkb/kkb/packages/audio/package.json`
- Reference: `/Users/kalynbeach/dev/kkb/kkb/packages/ui/package.json`
- Reference: `/Users/kalynbeach/dev/kkb/kkb/packages/typescript-config/package.json`

- [ ] **Step 1: Build a current-state fact list**
Document the exact workspace inventory, package names, root scripts, Turbo tasks, and which workspaces actually define `build`, `check-types`, and `test`.

- [ ] **Step 2: Mark stale doc claims**
Flag every claim in `README.md` and `AGENTS.md` that conflicts with the fact list:
  planned apps/packages with no dirs,
  missing `packages/audio`,
  inaccurate build/test wording,
  inconsistent `turbo` vs `turbo run` examples,
  missing `docs/` tree coverage.

- [ ] **Step 3: Define canonical wording**
Pick one shared phrasing set for:
  workspace descriptions,
  command descriptions,
  testing coverage caveats,
  current maturity of `apps/web`, `apps/docs`, `packages/ui`, and `packages/audio`.

- [ ] **Step 4: Keep roadmap boundaries explicit**
Decide whether roadmap items stay in root docs. If they remain, move them into a clearly labeled future-work section so current-state inventory is never mixed with planned inventory.

### Task 2: Rewrite `README.md`

**Files:**
- Modify: `/Users/kalynbeach/dev/kkb/kkb/README.md`
- Reference: `/Users/kalynbeach/dev/kkb/kkb/apps/web/app/page.tsx`
- Reference: `/Users/kalynbeach/dev/kkb/kkb/apps/web/app/audio/page.tsx`
- Reference: `/Users/kalynbeach/dev/kkb/kkb/apps/web/app/json-render/page.tsx`
- Reference: `/Users/kalynbeach/dev/kkb/kkb/apps/docs/app/page.tsx`
- Reference: `/Users/kalynbeach/dev/kkb/kkb/docs`

- [ ] **Step 1: Replace vague workspace blurbs**
Describe actual roles:
  `apps/web` as the active demo/sandbox host for audio and `json-render`,
  `apps/docs` as an early-stage docs shell,
  `packages/audio` as the headless audio runtime,
  `packages/ui` as shared UI plus `json-render` and audio presenter surfaces,
  `packages/typescript-config` as shared TS config.

- [ ] **Step 2: Remove or isolate speculative inventory**
Delete the inline `_Planned:_` bullets from the main workspace lists, or move them to a separate roadmap section if they are still worth keeping.

- [ ] **Step 3: Fix dev command accuracy**
Update command descriptions so they reflect the real script surface:
  `bun run build` builds apps with defined `build` scripts,
  `bun run test` runs workspace tests where `test` exists,
  filter examples use one consistent Turbo style.

- [ ] **Step 4: Add missing repo-orientation context**
Add a short `docs/` section or equivalent note so readers know repo planning/spec/research artifacts already live under `/docs`.

- [ ] **Step 5: Trim stale TODO noise**
Either remove the completed TODO checklist or convert it into a short “Current focus” / “Recent additions” section that still adds value.

### Task 3: Rewrite `AGENTS.md`

**Files:**
- Modify: `/Users/kalynbeach/dev/kkb/kkb/AGENTS.md`
- Reference: `/Users/kalynbeach/dev/kkb/kkb/package.json`
- Reference: `/Users/kalynbeach/dev/kkb/kkb/turbo.json`
- Reference: `/Users/kalynbeach/dev/kkb/kkb/apps/web/app/page.tsx`
- Reference: `/Users/kalynbeach/dev/kkb/kkb/apps/docs/app/page.tsx`
- Reference: `/Users/kalynbeach/dev/kkb/kkb/packages/audio/package.json`
- Reference: `/Users/kalynbeach/dev/kkb/kkb/packages/ui/package.json`

- [ ] **Step 1: Expand project structure section**
Add `packages/audio`, update workspace descriptions to reflect current maturity, and keep package inventory aligned with `README.md`.

- [ ] **Step 2: Correct command guidance**
Rewrite build/test/lint sections so they match actual scripts and Turbo wiring:
  root uses Bun,
  root lint commands call Biome directly,
  test coverage is partial by workspace,
  filter examples use the chosen canonical Turbo syntax.

- [ ] **Step 3: Tighten agent-facing rules**
Add one short note that root docs must be grounded in current manifests/app surfaces and should not present roadmap items as active workspaces.

- [ ] **Step 4: Keep guidance repo-specific**
Remove or reword any generic guidance that no longer reflects this repo's current state, especially around “no dedicated test runner” and broad “build all packages/apps” wording.

### Task 4: Verify Doc Consistency

**Files:**
- Modify: `/Users/kalynbeach/dev/kkb/kkb/README.md`
- Modify: `/Users/kalynbeach/dev/kkb/kkb/AGENTS.md`

- [ ] **Step 1: Diff only target docs**
Run: `git diff -- README.md AGENTS.md`
Expected: only root doc changes appear.

- [ ] **Step 2: Cross-check every command**
Re-read `package.json` and `turbo.json`, then verify every command mentioned in both docs still exists and is described accurately.

- [ ] **Step 3: Cross-check every workspace claim**
Re-read each workspace `package.json` and the key app surfaces to verify names, ports, roles, and test/build coverage wording.

- [ ] **Step 4: Final read for role separation**
Verify `README.md` stays onboarding-oriented while `AGENTS.md` stays contributor/agent-oriented, without contradicting each other.

- [ ] **Step 5: Commit**
Run:
```bash
git add README.md AGENTS.md docs/plans/2026-03-16-root-docs-refresh.md
git commit -m "docs: refresh root repo guidance"
```
