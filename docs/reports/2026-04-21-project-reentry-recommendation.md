# Project Re-entry Recommendation

**Date:** 2026-04-21  
**Repo:** `kkb`  
**Branch reviewed:** `main`

## Purpose

This note captures the recommended way to resume work after a break, based on:

- recent git history on `main`
- current open GitHub issues
- the latest oscilloscope plans/reports
- the March monorepo overview and prioritized next-steps docs

## Executive recommendation

**Resume with the oscilloscope follow-up stack, starting with the smallest post-merge hardening slice, then the host-owned playback spike.**

If the goal is to get productive again quickly without reopening too many strategic questions at once, the best sequence is:

1. **Issue #30** — `audio: harden oscilloscope renderer post-merge`
2. **Issue #31** — `audio: spike host-owned track playback analyser path for oscilloscope`
3. **Issue #34** — `audio: improve oscilloscope renderer persistence and composite quality`

This recommendation aligns with the most recent oscilloscope planning documents and preserves the current repo momentum:

- the structural V1 work is already done
- browser verification has already been established
- the remaining work is now narrow and well-described
- the oscilloscope thread is still the freshest substantial product work in the repo

## Why this is the best re-entry lane

### 1. It is the clearest continuation of the latest real feature work

The newest meaningful app/runtime work was the browser oscilloscope V1. The repo already has:

- `apps/web/app/oscilloscope/page.tsx`
- oscilloscope runtime + renderer code in `packages/audio/src/oscilloscope/*`
- browser smoke reports
- follow-up plans that clearly describe what should happen next

That means there is much less re-discovery cost than starting an unrelated track.

### 2. The scope is narrow enough to re-enter safely

The next oscilloscope steps are not vague “improve everything” work. They are concrete:

- tighten renderer cleanup/hardening
- answer the host-owned playback analyser question
- then raise visual fidelity

That makes it a strong restart path after time away.

### 3. It compounds prior work instead of opening a new subsystem

Compared with starting `@kkb/convex`, reworking the docs strategy, or broadening `/ui`, this path:

- builds directly on the newest foundation already merged
- avoids repo-wide churn
- yields visible product progress
- reduces uncertainty for future audio/visualization work

### 4. The docs already tell us the next decision to make

The most recent oscilloscope plan is explicit: after merge, the next slice should be:

1. post-merge hardening
2. host-owned track playback spike

So following that sequence keeps code work aligned with the latest written plan instead of inventing a new branch of work.

## Ranked recommendation

## Priority 1 — Re-entry slice: oscilloscope post-merge hardening (`#30`)

### Why first

This is the best “warm back up” task:

- smallest scope
- closest to recent work
- low ambiguity
- low product-risk
- useful before deeper oscilloscope follow-up work

### What this should cover

Based on the existing plan:

- cache the composite bind group instead of recreating it every frame
- make an explicit cleanup decision around renderer/device teardown
- keep any cleanup tightly scoped to directly touched oscilloscope renderer code

### Why it is a good first session back

It lets you:

- reload the oscilloscope codepaths
- confirm tests/checks still feel familiar
- get a quick win
- avoid jumping straight into broader architecture or UX decisions

### Success output

- one small, reviewable hardening change
- tests/types/lint still green
- oscilloscope follow-up context refreshed

---

## Priority 2 — Main next slice: host-owned playback analyser spike (`#31`)

### Why second

This is the most important unresolved architectural question in the oscilloscope track:

> How should current track playback feed the oscilloscope without breaking the host/runtime boundary?

The answer matters more than additional UI polish because it determines whether a future real `track` source is feasible through the current player architecture.

### Why now

The repo already has the right boundaries:

- oscilloscope core stays headless in `@kkb/audio`
- browser graph ownership stays in `apps/web`
- mic input already follows that model

The playback spike is the natural next test of that architecture.

### What this should produce

- one host-owned playback analysis seam in `apps/web`
- one proof path showing whether media-element-backed playback can drive an analyser-backed `SignalProvider`
- a browser-verified report capturing whether the path is good enough for a future shipped `track` source

### Why this is higher leverage than broad `/audio` polish right now

It answers a deeper cross-surface question:

- not just “does the player look better?”
- but “can the player and oscilloscope interoperate cleanly within the current design?”

That is a better architectural unlock.

---

## Priority 3 — Visual fidelity pass: oscilloscope renderer quality (`#34`)

### Why third

Once the hardening and playback-boundary questions are clearer, the renderer-quality pass becomes a more confident investment.

The current docs say the main gap is no longer architecture — it is **visual quality**:

- phosphor persistence
- composite/glow credibility
- overall rendering polish

### Why not first

It is tempting because it is visually rewarding, but it is a slightly worse re-entry move than `#30` and a slightly less strategically clarifying move than `#31`.

### Best timing

Take this up once:

- the renderer baseline is freshly hardened
- the playback-integration question is no longer guesswork

---

## Recommended “not now” items

These are worthwhile, but they are weaker immediate restart options.

### `/audio` polish issues (`#37`–`#41`)

Why not first:

- good product polish work, but more diffuse
- less tightly connected to the freshest implementation context
- easier to scatter across multiple UX concerns at once

Best timing:

- after the oscilloscope follow-up stack
- or as a deliberate shift back to player/product polish

### shared app-shell/layout cleanup (`#16`)

Why not first:

- good cleanup task
- but less energizing and less user-visible than continuing the current audio/oscilloscope thread

Best timing:

- between larger feature slices
- or when you want a low-risk refactor day

### docs strategy decision (`#33`)

Why not first:

- important, but still a repo/product decision rather than an execution unblocker
- does not create as much immediate momentum after a break

### `@kkb/convex` (`#13`)

Why not first:

- introduces an entirely new subsystem and product direction
- too much scope and uncertainty for a re-entry task

## Suggested next-session plan

If the goal is to restart with a practical, low-friction sequence, do this:

### Session 1

**Take issue `#30` only.**

Goals:
- re-read the oscilloscope renderer code and latest follow-up docs
- land the small hardening fixes
- run targeted validation
- end with a clean, reviewable change

#### Session 1 restart checklist

Use this as the literal re-entry checklist for the first working session back.

##### Re-orientation
- [ ] Read `docs/plans/2026-04-05-browser-oscilloscope-track-playback-spike.md`
- [ ] Re-read the renderer-quality context in `docs/reports/2026-04-02-browser-oscilloscope-branch-review.md`
- [ ] Re-read `packages/audio/src/oscilloscope/renderer/pipeline.ts`
- [ ] Reconfirm the current oscilloscope package surface in `packages/audio/package.json`

##### Scope lock
- [ ] Keep the session limited to issue `#30`
- [ ] Do not start the playback analyser spike in the same pass
- [ ] Avoid opportunistic cleanup outside directly touched renderer code

##### Implementation targets
- [ ] Cache the composite bind group instead of recreating it every frame
- [ ] Make an explicit decision about renderer/device teardown behavior
- [ ] Add or update focused tests only if needed to support the hardening change

##### Validation
- [ ] Run `bun run test -- --filter=@kkb/audio --filter=@kkb/web`
- [ ] Run `bun run check-types -- --filter=@kkb/audio --filter=@kkb/web`
- [ ] Run `bun run format-and-lint`
- [ ] Confirm the diff stays narrow and reviewable

##### Wrap-up
- [ ] Write a short summary of what changed and what was intentionally deferred to `#31`
- [ ] Confirm the next session should start with the host-owned playback analyser spike

### Session 2

**Start issue `#31`.**

Goals:
- define the host-owned playback analyser abstraction in `apps/web`
- build one proof path for media-element-backed playback
- verify it in-browser
- write the spike report with a recommendation

### Session 3

**Decide between `#34` and a return to `/audio` polish.**

Decision rule:
- if the playback spike is promising, continue the oscilloscope thread with renderer-quality work
- if the playback spike exposes a bigger blocker, switch to `/audio` polish while that larger direction settles

## Bottom line

If we want the best balance of:

- low re-entry friction
- high leverage
- visible progress
- alignment with the latest docs

then the right place to resume is:

1. **oscilloscope hardening**
2. **oscilloscope playback analyser spike**
3. **oscilloscope renderer fidelity**

That is the clearest continuation of where the repo left off, and it should get you back into the codebase quickly without opening a broader strategy fork too early.
