# Pi agent context file consolidation

_Date: 2026-08-15_

## Purpose

This report records the current consolidation of always-on agent guidance between Kalyn's global Pi context and the `kkb` monorepo.

## Context model

Pi concatenates context from:

1. `~/.pi/agent/AGENTS.md` for global user guidance
2. `AGENTS.md` files discovered from parent directories through the current working directory

Project `AGENTS.md` files load independently of Pi project trust unless context loading is explicitly disabled. By contrast, `.pi/APPEND_SYSTEM.md` changes the Pi system prompt and is a trusted project resource.

The intended boundary is now:

- **Global `~/.pi/agent/AGENTS.md`:** Kalyn's identity, communication preferences, safety boundaries, general engineering principles, language/tool defaults, Git conventions, and browser workflow.
- **Repository `AGENTS.md`:** portable standards and workflows that should apply to anyone working in `kkb`, including environments that do not have Kalyn's global context.
- **Repository `README.md`:** workspace facts, commands, routes, validation, documentation layout, and architectural boundaries.
- **Project `.pi/` resources:** opt-in Pi workflows and capabilities rather than duplicated standing policy.

## Changes

### Global guidance

`~/.pi/agent/AGENTS.md` is now the durable source for Kalyn's cross-project preferences. It covers concise communication, read-only handling of questions, destructive-action and production safeguards, restrained delegation, simple code design, TypeScript and Python defaults, documentation hygiene, Git and commit practices, GitHub usage, and browser automation.

This file is user-local and intentionally not part of the `kkb` repository.

### Repository guidance

The root `AGENTS.md` has been refreshed around the same core engineering principles while retaining `kkb`-specific requirements. It now carries portable guidance for:

- simple, scoped implementation and focused testing
- Bun-first TypeScript work, strong typing, and dependency handling
- reuse of `@kkb/ui` and app/package ownership boundaries
- repository validation and documentation hygiene
- Git and Conventional Commit practices
- issue tracking, triage labels, and domain documentation

Some overlap with the global file is deliberate. Repository-critical rules remain local so other agents and contributors do not depend on Kalyn's private Pi configuration.

### Removed Pi system-prompt layer

`.pi/APPEND_SYSTEM.md` is being removed because its contents duplicated guidance now represented by the global and repository `AGENTS.md` files. This reduces the number of always-on policy surfaces without removing the existing project prompt templates under `.pi/prompts/`.

System-prompt files remain available for future instructions that genuinely need to modify Pi's system prompt rather than ordinary user or repository context.

## Relationship to earlier reports

The earlier [Pi customization summary](./2026-04-12-pi-customization-summary.md) and [progressive autonomy roadmap](./2026-04-13-pi-progressive-autonomy-roadmap.md) remain historical records of the previous configuration. This report records the current context-file decision and supersedes their descriptions of `.pi/APPEND_SYSTEM.md` as part of the active baseline.

## Operational notes

- Restart Pi or run `/reload` after changing either `AGENTS.md` file.
- The Pi startup header can confirm which context files were loaded.
- `--no-context-files` disables both global and repository context discovery for exceptional runs.
- Future policy changes should be placed at the narrowest durable scope: global for personal defaults, repository-local for portable `kkb` rules, and `.pi` only for Pi-specific workflows or runtime behavior.
