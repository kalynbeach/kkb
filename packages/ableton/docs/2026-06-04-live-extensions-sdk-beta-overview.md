# Ableton Live Extensions SDK Beta Overview

**Date**: 2026-06-04  
**Model**: GPT-5.5 Extra High (Codex App)

Spawned four explorer subagents for API, docs, examples, and tarball/CLI analysis, then cross-checked locally. No workspace files were edited.

**Overview**
The Ableton Live Extensions SDK beta is a Node.js/TypeScript extension system for offline or command-style workflows inside Live. It can inspect and mutate Live Set objects, register commands/context-menu actions, show modal WebView UI, show progress dialogs, import audio into projects, render pre-FX arrangement audio, and use npm packages.

It is explicitly not for real-time audio processing, real-time MIDI routing/manipulation, drawing into Live’s native UI, persistent background extensions, or Control Surface integration.

**Distribution**
The SDK folder contains three packages:

- `@ableton-extensions/sdk`: runtime/types, no bin, API version support currently only `"1.0.0"`.
- `@ableton-extensions/cli`: `extensions-cli`, with `run` and `package`.
- `@ableton-extensions/create-extension`: `create-extension`, scaffolds projects and vendors the SDK/CLI tarballs into `vendor/`.

Docs/templates require Node `>=24.14.1`, while package engines say `>=22.11.0`. Treat `>=24.14.1` as the safer practical requirement.

**Core Workflow**
A generated extension has `manifest.json`, `src/extension.ts`, `build.ts`, `.env`, `vendor/*.tgz`, and npm scripts. `activate(activation)` is the entrypoint. You call:

```ts
const context = initialize(activation, "1.0.0");
```

`manifest.json` declares `name`, `author`, `version`, `entry`, and `minimumApiVersion`. The build script bundles `src/extension.ts` into `manifest.entry` as a standalone CommonJS Node bundle because the Extension Host does not resolve `node_modules` at runtime.

**Runtime Model**
`ExtensionContext` exposes `application`, `commands`, `environment`, `resources`, `ui`, `getObjectFromHandle`, and `withinTransaction`.

Live objects are referenced by host-assigned `Handle { id: bigint }`. Resolve handles with `context.getObjectFromHandle(handle, SomeClass)`. Handles/objects can become invalid after deletion, movement, or session changes, so long-term caching is discouraged.

Commands are registered callbacks. Context-menu actions link a scope and label to a command ID. General event/subscription APIs are not present; interaction surfaces are command callbacks, context-menu triggers, modal `postMessage`, and progress-dialog cancellation.

Transactions group mutations into one undo step. `withinTransaction` is synchronous; don’t `await` inside it. For async creations/deletions, start promises inside the callback and return/await them outside.

**API Surface**
The API reference exposes 27 classes, 8 interfaces, 2 enums, 2 type aliases, 1 variable, and 1 function.

Main object hierarchy:

- `DataModelObject`: base wrapper, `handle`, `parent`.
- `Application`: `song`.
- `Song`: tracks, return tracks, main track, scenes, cue points, tempo, grid, scale info, create/delete/duplicate tracks/scenes/cue points.
- `Track` -> `AudioTrack`, `MidiTrack`: name, mute/solo/arm, clip slots, take lanes, arrangement clips, devices, mixer, device operations, clip clearing/deletion.
- `Clip` -> `AudioClip`, `MidiClip`: name, timing, loop markers, color, mute. Audio adds file path, warping, warp mode/markers. MIDI adds notes.
- `ClipSlot`, `TakeLane`, `Scene`, `CuePoint`.
- `Device`, `DeviceParameter`, `Simpler`, `Sample`, `RackDevice`, `DrumRack`, `Chain`, `DrumChain`, `TrackMixer`, `ChainMixer`.
- Service classes: `Commands`, `Environment`, `Resources`, `Ui`.

Important types/enums:

- `ContextMenuScope`: `AudioClip`, `MidiClip`, `AudioTrack`, `MidiTrack`, `ClipSlot`, `Scene`, `Simpler`, `Sample`, `DrumRack`, `ClipSlotSelection`, `AudioTrack.ArrangementSelection`, `MidiTrack.ArrangementSelection`.
- `ArrangementSelection`: beat start/end plus selected lane handles.
- `ClipSlotSelection`: selected clip slot handles.
- `ClipLoopSettings`: validates marker order, minimum loop length `0.25` beats, non-looping bounds, and unwarped constraints.
- `GridQuantization`: no grid through thirty-second.
- `WarpMode`: `Beats`, `Tones`, `Texture`, `Repitch`, `Complex`, `ComplexPro`.

**UI And Files**
`ui.registerContextMenuAction` returns an unregister function. `ui.showModalDialog(url, width, height)` supports `file:`, `data:`, `https:`, and `http://localhost`. WebViews return data by posting `{ method: "close_and_send", params: [string] }` through WebKit on macOS or WebView2 on Windows.

`ui.withinProgressDialog` provides an async callback with `update(text, progress?)` and `AbortSignal`.

`resources.importIntoProject(filePath)` copies a file into the Live project and returns the path Live should use. `resources.renderPreFxAudio(audioTrack, start, end)` writes a temp WAV path. Filesystem guidance restricts extension IO to `environment.storageDirectory` and `environment.tempDirectory`; future OS sandboxing is expected.

**Examples**
- `context-menu`: minimal context menu registration/logging.
- `warpMode`: resolves an audio clip and mutates `warpMode`.
- `arrangementselection`: processes arrangement selection and creates MIDI clips.
- `audio-clips`: imports a placeholder audio file and creates warped/unwarped clips in Session or Arrangement.
- `modal-dialog`: inlines HTML, opens a modal, returns JSON, renames MIDI/audio clips.
- `progress-dialog`: cancellable progress dialog with updates.
- `strip-silence`: renders selected audio, decodes with `audio-decode`, computes silence, clears ranges in a transaction.

**CLI**
`extensions-cli run [dir]` reads `.env` from the current working directory via `process.loadEnvFile()`, then uses `--live` or `EXTENSION_HOST_PATH`. It accepts `.app`, `.exe`, install root, host dir, or direct `ExtensionHostNodeModule.node`. It requires only `package.json` before launching; it does not validate manifest/entry on run.

`extensions-cli package [dir]` validates `manifest.json`, `manifest.entry`, and included paths. It creates a zip-based `.ablx` containing only `manifest.json`, the entry file, and explicit `--include` files/directories.

**Gotchas**
Docs contain a few stale or inconsistent snippets: some prose mentions `extensions-cli build --dev`, but the CLI has no `build` command; generated scripts call `tsx build.ts`. Some docs show old `createAudioClip(imported, false)` style calls, while current declarations require object arguments. `npm run package` in templates runs `npm run build`, not `build:production`.

Key sources reviewed locally from the Ableton Live Extensions SDK beta bundle: SDK declaration files, CLI runtime, create-extension runtime, bundled documentation, and bundled examples.
