# @kkb/web

Next.js integration and visual-verification app for the KKB monorepo.

## Routes

- `/audio` — audio player demo
- `/binaural-beats` — app-owned binaural beat experiment
- `/oscilloscope` — WebGPU oscilloscope using internal oscillators or microphone input
- `/ui` — complete `@kkb/ui` component inventory and visual acceptance workbench
- `/json-render` — experimental JSON-render adapter demos, separate from the active design-system roadmap

`/ui` follows the [shadcn/create inspection model](https://ui.shadcn.com/create?preset=b1D0enCq&base=base&item=preview): a dense Preview wall with explicit coverage for every supported visual component and focused item views for component-specific variants and states. Package-derived parity tests prevent the curated catalog registry from drifting from `@kkb/ui`; providers, hooks, presenters, theme constants, and experimental integrations remain secondary. It is not a workshop index, documentation site, or gallery for complete application shells. Route/session behavior and complete feature composition remain app-owned.

## Development

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) to view.
