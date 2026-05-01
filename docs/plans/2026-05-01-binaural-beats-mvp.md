# Binaural beats MVP implementation plan

## Decision

Build a host-owned native Web Audio prototype first.

Do not use `AudioWorklet` for v1. The research supports native nodes as simpler, precise enough, and lower maintenance for steady tones and gain modulation.

## Slice 1: minimal safe generator

### Route/component

Add a standalone experiment route:

- `apps/web/app/binaural-beats/page.tsx`
- `apps/web/components/binaural-beats/binaural-beats-client.tsx`
- optional shell/control files under `apps/web/components/binaural-beats/`

Keep this out of the existing `/audio` player initially. This is a generated-tone session, not media playback.

### Audio engine location

Start app-local:

- `apps/web/lib/binaural-beats/create-binaural-beat-engine.ts`

Extract into `packages/audio` only after the contract stabilizes.

### Engine API

Approximate shape:

```ts
type BinauralBeatConfig = {
  carrierFrequencyHz: number;
  beatFrequencyHz: number;
  volume: number;
  fadeSeconds: number;
};

type BinauralBeatEngine = {
  play(config: BinauralBeatConfig): Promise<void>;
  update(config: BinauralBeatConfig): void;
  stop(): void;
  destroy(): void;
};
```

### Web Audio graph

For binaural mode:

```txt
left OscillatorNode  -> left GainNode  -> ChannelMerger input 0
right OscillatorNode -> right GainNode -> ChannelMerger input 1
ChannelMergerNode -> master GainNode -> AudioContext.destination
```

Frequency mapping:

- left: `carrierFrequencyHz`
- right: `carrierFrequencyHz + beatFrequencyHz`

Use:

- `OscillatorNode.type = "sine"`
- `AudioContext.resume()` inside the user-triggered play handler
- `AudioParam` automation for frequency/gain updates
- fade in/out to avoid clicks

## Controls

Initial controls:

- Play / Stop
- Carrier frequency
  - default: `400 Hz`
  - range: probably `100–900 Hz`
- Beat frequency
  - default: `10 Hz`
  - range: `1–30 Hz`
- Volume
  - low default, e.g. `0.15`
  - cap conservatively
- Fade duration
  - default: `0.5–1.5s`

Avoid brain-state claims in preset labels for now. If presets exist, use neutral labels like:

- “Slow pulse”
- “Medium pulse”
- “Fast pulse”

Not:

- “Alpha”
- “Theta sleep”
- “Anxiety relief”

## Required safety/product copy

Visible near the controls:

- “Use headphones for binaural mode.”
- “This is an experimental audio tool, not medical treatment.”
- “Start at low volume.”
- “Stop if you feel discomfort, dizziness, headache, anxiety, nausea, or unusual symptoms.”
- “Do not use while driving or operating machinery.”

Keep copy factual and non-therapeutic.

## Tests

### Unit/signal tests

Add tests around pure helpers first, likely app-local or in `packages/audio` if extracted:

- clamp carrier frequency
- clamp beat frequency
- compute left/right frequencies
- reject invalid numeric input
- default config stays in safe range

### Offline audio tests

If practical in Bun/runtime support:

- use `OfflineAudioContext` to render short buffers
- assert stereo channel separation
- assert left/right dominant frequencies
- assert fades avoid abrupt start/stop
- assert no clipping/headroom issues

If `OfflineAudioContext` is not available in the test environment, isolate graph-building behind injected constructors and test config/automation calls with stubs.

## Avoid in v1

- `AudioWorklet`
- SAB/ring buffers
- COOP/COEP changes
- medical/clinical claims
- integrated player source
- generated visualizer unless separately scoped
- “brainwave entrainment” as product-facing language

## Likely file changes

```txt
apps/web/app/binaural-beats/page.tsx
apps/web/components/binaural-beats/binaural-beats-client.tsx
apps/web/lib/binaural-beats/create-binaural-beat-engine.ts
apps/web/lib/binaural-beats/binaural-beat-config.ts
apps/web/lib/binaural-beats/__tests__/binaural-beat-config.test.ts
```

Optional later extraction:

```txt
packages/audio/src/entrainment/*
```

## Validation before commit

Run targeted checks:

```sh
bun run test --filter=@kkb/web
bun run check-types --filter=@kkb/web
bun run format-and-lint
```

If Turbo filter syntax is required directly:

```sh
turbo run test --filter=@kkb/web
turbo run check-types --filter=@kkb/web
```

## Recommended next move

Implement the standalone `/binaural-beats` MVP with native Web Audio nodes and conservative safety copy. Keep the engine app-local until we know whether this becomes a reusable `@kkb/audio` source or remains an experiment/demo.
