# Plan 001: Add a verification CI workflow that runs check-types, test, and format-and-lint on every push and PR

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat bff3b6b..HEAD -- .github/workflows package.json turbo.json`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: dx
- **Planned at**: commit `bff3b6b`, 2026-07-11

## Why this matters

The repo documents a three-command verification loop (`bun run check-types`, `bun run test`, `bun run format-and-lint` — see `README.md` "Validation status") and AGENTS.md instructs "treat newly introduced warnings as regressions", but nothing enforces any of it: `.github/workflows/` contains only `claude.yml` (an `@claude`-mention agent) and `claude-code-review.yml` (AI PR review). Neither is a deterministic gate. A type error, failing test, or lint regression can land on `main` unnoticed. This plan adds a plain GitHub Actions workflow that runs the documented loop on every push to `main` and every pull request. Every other plan in `plans/` uses these three commands as done-criteria, so this is the foundation plan.

## Current state

- `.github/workflows/claude.yml` — Claude agent triggered by `@claude` mentions; uses `runs-on: ubuntu-latest`, `actions/checkout@v6`. Not a verification gate.
- `.github/workflows/claude-code-review.yml` — Claude PR review on `pull_request`. Not a verification gate.
- There is no `ci.yml`, no husky/lefthook/pre-commit config anywhere in the repo.
- Root `package.json` (repo root): scripts are `"check-types": "turbo run check-types"`, `"test": "turbo run test"`, `"format-and-lint": "biome check ."`; `"packageManager": "bun@1.3.14"`.
- `turbo.json` defines `check-types` and `test` tasks with `dependsOn: ["^..."]`; no remote-cache signature/token is configured in the repo.
- All three commands pass today at `bff3b6b` (verified during planning: 5 workspaces typecheck clean; 93 tests pass in `@kkb/web` plus suites in `@kkb/audio`, `@kkb/ui`, `@kkb/ableton`).

Repo conventions to match:
- Bun only — never npm/pnpm/yarn/npx (`CLAUDE.md`, `AGENTS.md`).
- Existing workflows use `ubuntu-latest` and `actions/checkout@v6`; match both.
- Conventional commit messages, lowercase, no articles, e.g. `config: add verification ci workflow`.

## Commands you will need

| Purpose   | Command                     | Expected on success |
|-----------|-----------------------------|---------------------|
| Install   | `bun install`               | exit 0              |
| Typecheck | `bun run check-types`       | exit 0, "5 successful" tasks |
| Tests     | `bun run test`              | exit 0, all workspaces pass |
| Lint      | `bun run format-and-lint`   | exit 0              |

## Scope

**In scope** (the only files you should create or modify):
- `.github/workflows/ci.yml` (create)
- `plans/README.md` (status row update)

**Out of scope** (do NOT touch):
- `.github/workflows/claude.yml` and `claude-code-review.yml` — separate concern (see plans/README.md "considered and rejected" for the hardening note).
- `turbo.json`, root `package.json` — no script or task changes are needed.
- Turbo remote caching / `TURBO_TOKEN` — do not add secrets or cache config; local turbo cache inside the job is enough at this repo's scale.
- Pre-commit hooks — deliberately excluded; CI is the single mechanical gate.

## Git workflow

- Branch: `advisor/001-verification-ci`
- Single commit, message: `config: add verification ci workflow`
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Create `.github/workflows/ci.yml`

Create the file with exactly this content:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v6

      - name: Setup Bun
        uses: oven-sh/setup-bun@v2
        with:
          bun-version: 1.3.14

      - name: Install dependencies
        run: bun install --frozen-lockfile

      - name: Typecheck
        run: bun run check-types

      - name: Test
        run: bun run test

      - name: Format and lint
        run: bun run format-and-lint
```

Notes:
- `bun-version: 1.3.14` mirrors `packageManager` in root `package.json`. If that field has changed since `bff3b6b`, use the current value.
- `--frozen-lockfile` makes lockfile/manifest drift a CI failure — that is intentional.

**Verify**: `bun -e "const fs=require('fs');const t=fs.readFileSync('.github/workflows/ci.yml','utf8');if(!/oven-sh\/setup-bun@v2/.test(t)||!/--frozen-lockfile/.test(t))throw new Error('missing content');console.log('ok')"` → prints `ok`

### Step 2: Prove the workflow's commands pass locally

Run the three commands in workflow order:

**Verify**: `bun install --frozen-lockfile && bun run check-types && bun run test && bun run format-and-lint` → all exit 0. If `format-and-lint` reports only pre-existing warnings but exits 0, that is a pass; if it exits non-zero, STOP (see below).

### Step 3: Update the plan index and commit

First set this plan's status row to DONE in `plans/README.md` (skip the index edit only if a reviewer dispatched you and said they maintain the index — then commit `ci.yml` alone). Then commit both files together:

`git add .github/workflows/ci.yml plans/README.md && git commit -m "config: add verification ci workflow"`

**Verify**: `git status --porcelain` → empty.

## Test plan

No unit tests — this is CI config. The verification is Step 2 (the exact commands the workflow runs pass locally) plus, after the branch is pushed by the operator, the `CI` check appearing on the PR. Do not push yourself.

## Done criteria

- [ ] `.github/workflows/ci.yml` exists with the four run steps in the order install → check-types → test → format-and-lint
- [ ] `bun install --frozen-lockfile` exits 0 (lockfile is in sync)
- [ ] `bun run check-types`, `bun run test`, `bun run format-and-lint` all exit 0
- [ ] No files outside the in-scope list modified (`git status`)
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report back (do not improvise) if:

- `bun install --frozen-lockfile` fails at `bff3b6b`-descended HEAD — the lockfile is out of sync with a manifest; fixing that is out of scope.
- `bun run format-and-lint` exits non-zero on an untouched tree — the README says warnings may exist but the command is expected to pass; a hard failure means the baseline drifted.
- A file named `.github/workflows/ci.yml` already exists.

## Maintenance notes

- If a `build` gate is wanted later, add `bun run build` as a step after Test — it was left out to keep CI fast (Next.js builds are the slow path and nothing deploys from CI today).
- If bun's version in `packageManager` is bumped, the `bun-version` pin here must be bumped in the same PR.
- Plans 002–005 in this directory assume this workflow exists as their regression net.
