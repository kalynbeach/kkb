# Context Map

## Contexts

- [KKB Agents](./packages/agents/CONTEXT.md) — owns language for KKB agent context, skills, artifacts, and supervised development workflows
- [UI](./packages/ui/CONTEXT.md) — owns shared interface language and reusable presentation components

## Relationships

- **KKB Agents → repositories**: agent workflows consume repository context while active work and generated artifacts remain outside durable repository context unless explicitly owned.
- **UI → web apps**: applications compose shared UI components while owning feature-specific runtime coordination.
