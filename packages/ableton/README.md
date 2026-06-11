# @kkb/ableton

> KKB's Ableton Live stuff

**WORK IN PROGRESS**

## Ableton Live Extensions

Read the Extensions SDK Beta overview here: [2026-06-04-live-extensions-sdk-beta-overview](./docs/2026-06-04-live-extensions-sdk-beta-overview.md)

### CLI

To start up the initial `hello-live` extension:

```
cd packages/ableton
bun start
```

To build all `@kkb/ableton` extensions for development (sourcemaps, not minified):

```
cd packages/ableton
bun run build:dev
```

To build all `@kkb/ableton` extensions for production (minified, no sourcemaps):

```
cd packages/ableton
bun run build
```

To build the configured `hello-live` extension for production and produce a `.ablx` file to share:

```
cd packages/ableton
bun run package
```
