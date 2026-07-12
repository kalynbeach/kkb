# Plan 003: Make `bun test` fail loudly in workspaces that have tests

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat bff3b6b..HEAD -- apps/web/package.json packages/audio/package.json packages/ui/package.json packages/ableton/package.json`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none (001 recommended first)
- **Category**: tests
- **Planned at**: commit `bff3b6b`, 2026-07-11

## Why this matters

Every workspace test script is `bun test --pass-with-no-tests`. With that flag, a workspace whose tests are accidentally excluded — a glob/config regression, a bad rename of a `__tests__` directory, a tsconfig change that makes bun collect zero files — reports **green** instead of failing. `packages/ableton` demonstrates the failure mode today: it has zero test files, yet `turbo run test` reports it successful. The flag is appropriate only where there is genuinely nothing to test. This plan drops the flag in the three workspaces that have real suites (`apps/web`, `packages/audio`, `packages/ui`) so "found 0 tests" becomes a failure, and leaves it (documented) in `packages/ableton`, whose only code is a 72-line build script, a 1-line placeholder lib, and a 9-line hello-world extension — below the threshold where a smoke test earns its keep.

## Current state

- `apps/web/package.json` — `"test": "bun test --pass-with-no-tests"`; has 18 test files / 93 tests (verified passing at `bff3b6b`).
- `packages/audio/package.json` — `"test": "bun test --pass-with-no-tests"`; has substantive suites under `src/**/__tests__/`.
- `packages/ui/package.json` — `"test": "bun test --pass-with-no-tests"`; has at least `src/components/audio/__tests__/audio-theme.test.ts`.
- `packages/ableton/package.json` — `"test": "bun test --pass-with-no-tests"`; `find packages/ableton -name '*.test.*'` (excluding node_modules) returns nothing. Keep as-is.
- `apps/docs/package.json` — no `test` script at all. Keep as-is.
- `turbo.json` — `"test": { "dependsOn": ["^test"] }`; no change needed.

Repo conventions: Bun only; conventional commits.

## Commands you will need

| Purpose | Command | Expected on success |
|---------|---------|---------------------|
| All tests | `bun run test` | exit 0, tasks successful |
| One workspace | `turbo run test --filter=@kkb/web` (also `@kkb/audio`, `@kkb/ui`) | exit 0, non-zero test count |
| Typecheck | `bun run check-types` | exit 0 |
| Lint | `bun run format-and-lint` | exit 0 |

## Scope

**In scope** (the only files you should modify):
- `apps/web/package.json`
- `packages/audio/package.json`
- `packages/ui/package.json`
- `plans/README.md` (status row update)

**Out of scope** (do NOT touch):
- `packages/ableton/package.json` — the flag stays until the package grows testable code (see Maintenance notes).
- `apps/docs/package.json` — adding a test script to a workspace with nothing to test would just recreate the problem.
- `turbo.json` — task config is already correct.
- Writing new tests — plan 004 covers the biggest test gap separately.

## Git workflow

- Branch: `advisor/003-strict-test-scripts`
- Single commit, message: `config: fail bun test when suites are missing`
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Drop the flag in the three workspaces with suites

In each of `apps/web/package.json`, `packages/audio/package.json`, `packages/ui/package.json`, change:

```json
"test": "bun test --pass-with-no-tests"
```

to:

```json
"test": "bun test"
```

**Verify**: `grep -l 'pass-with-no-tests' apps/*/package.json packages/*/package.json` → prints only `packages/ableton/package.json`

### Step 2: Confirm each workspace still collects and passes its tests

**Verify** (two commands — do not pipe the turbo run, or the pipe reports grep/tail's exit status instead of the tests'):

```bash
turbo run test --filter=@kkb/web --filter=@kkb/audio --filter=@kkb/ui --force
echo "turbo-exit: $?"
```

→ `turbo-exit: 0`, and the output shows non-zero passing counts for all three workspaces with zero failures. (`--force` bypasses the turbo cache so the new scripts actually run.)

### Step 3: Confirm the guard works (negative test, then revert)

Temporarily rename a test dir to prove the failure mode is now caught:

```bash
mv packages/ui/src/components/audio/__tests__ packages/ui/src/components/audio/__tests_x
turbo run test --filter=@kkb/ui --force; echo "exit: $?"
mv packages/ui/src/components/audio/__tests_x packages/ui/src/components/audio/__tests__
```

**Verify**: the middle command exits non-zero (bun reports no tests found). After the second `mv`, `git status --porcelain` shows no changes under `packages/ui/src`.

### Step 4: Full verification loop

**Verify**: `bun run check-types && bun run test && bun run format-and-lint` → all exit 0.

## Test plan

No new test files. Step 3 is the behavioral proof: a workspace losing its suite now fails instead of passing silently.

## Done criteria

- [ ] `pass-with-no-tests` appears only in `packages/ableton/package.json` (`grep -rl 'pass-with-no-tests' apps packages --include=package.json`)
- [ ] `turbo run test --force` passes for `@kkb/web`, `@kkb/audio`, `@kkb/ui` with non-zero test counts
- [ ] Step 3 negative test demonstrated a non-zero exit and was fully reverted
- [ ] `bun run check-types`, `bun run test`, `bun run format-and-lint` all exit 0
- [ ] No files outside the in-scope list modified (`git status`)
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report back (do not improvise) if:

- Any of the three workspaces reports "0 tests" with the flag removed — a collection regression already exists; that's a finding to report, not to patch here.
- Bun's behavior differs from expected (e.g. `bun test` exits 0 with no tests found even without the flag on the installed bun version) — report the observed behavior and bun version.

## Maintenance notes

- When `packages/ableton` gains real logic (the roadmap has Ableton extension work), add its first test and drop the flag there in the same PR.
- If a new workspace is scaffolded, default its test script to plain `bun test` once it has a suite; only use `--pass-with-no-tests` for intentionally test-free packages.
