# Binaural beats preset system plan

## Goal

Add an MVP preset system to the shipped `/binaural-beats` experiment.

This slice should make common brainwave-frequency bands easy to audition while keeping the existing manual controls intact. The plan is intended to become a GitHub issue for implementation.

## Current state

The shipped MVP is host-owned and app-local:

- `apps/web/app/binaural-beats/page.tsx`
- `apps/web/components/binaural-beats/binaural-beats-client.tsx`
- `apps/web/lib/binaural-beats/binaural-beat-config.ts`
- `apps/web/lib/binaural-beats/create-binaural-beat-engine.ts`

The engine already supports the required preset target shape:

```ts
type BinauralBeatConfig = {
  beatFrequencyHz: number;
  carrierFrequencyHz: number;
  fadeSeconds: number;
  volume: number;
};
```

For this slice, presets should update only:

- `carrierFrequencyHz`
- `beatFrequencyHz`

Presets should not update:

- `volume`
- `fadeSeconds`

## Product decision

Use accurate brainwave-band labels instead of vague neutral labels.

Allowed labels:

- `Delta`
- `Theta`
- `Alpha`
- `Beta`
- `Gamma`

Use these as frequency-band labels, not as therapeutic or guaranteed outcome claims. The UI can say what frequency the preset loads, but should not claim that the preset causes sleep, focus, anxiety relief, meditation, creativity, or treatment effects.

Avoid labels like:

- `Deep sleep`
- `Anxiety relief`
- `Focus mode`
- `Meditation`
- `Healing`

## Preset model

Add an app-local preset module:

```txt
apps/web/lib/binaural-beats/binaural-beat-presets.ts
```

Suggested type:

```ts
type BinauralBeatPreset = {
  beatFrequencyHz: number;
  carrierFrequencyHz: number;
  description: string;
  id: string;
  name: string;
};
```

The preset object should intentionally omit `volume` and `fadeSeconds` so applying a preset cannot reset those user-controlled values.

Suggested initial presets:

| ID | Name | Beat frequency | Carrier |
| --- | --- | ---: | ---: |
| `delta` | Delta | `2 Hz` | `400 Hz` |
| `theta` | Theta | `6 Hz` | `400 Hz` |
| `alpha` | Alpha | `10 Hz` | `400 Hz` |
| `beta` | Beta | `18 Hz` | `400 Hz` |
| `gamma` | Gamma | `30 Hz` | `400 Hz` |

`Gamma` should use the existing max beat frequency unless the config range is intentionally widened in a separate issue.

## URL state

Remember the selected preset in the URL hash.

Use hash state instead of route search params for this MVP so preset changes remain client-owned and do not imply server navigation.

Suggested hash shape:

```txt
#preset=alpha
```

Manual control edits should preserve the selected preset until the user chooses another preset. This means `#preset=alpha` indicates the last selected starting point, not that current manual values exactly match the preset.

On initial load:

- read `preset` from `window.location.hash`
- if it matches a known preset, apply its carrier and beat values
- if it is missing or invalid, keep the current default config

On preset click:

- update carrier and beat values
- keep current volume and fade values
- update the URL hash
- if audio is already playing, rely on the existing config update path to ramp into the new frequencies

## UI

Use visible preset buttons, not a select.

Place the buttons near the current controls, above the manual sliders. The buttons should be fast to scan and audition.

Each button should show:

- preset name
- beat frequency

Optional compact secondary text:

- `400 Hz carrier`

The active preset should have a clear selected state derived from the selected preset id, not from comparing every current config value.

## Safety and copy posture

This project is currently a personal experiment. Safety copy and public-product risk mitigation are not a priority for this preset slice.

Do not expand safety copy as part of this issue.

Do not remove existing safety copy in this issue unless a separate docs/product decision explicitly says to simplify it.

Follow-up docs work should update the existing binaural beats planning docs to clarify that current safety guidance is lower priority while this remains personal-use experimentation.

## Tests

Add focused tests for the preset model:

- preset ids are unique
- every preset beat frequency and carrier frequency is within `BINAURAL_BEAT_LIMITS`
- applying a preset preserves `volume` and `fadeSeconds`
- invalid hash preset falls back without throwing
- valid hash preset initializes selected preset and config

Component tests are useful if the current test setup already covers the binaural route/client. Otherwise, keep the first slice focused on pure helpers and one targeted client test.

## Likely file changes

```txt
apps/web/lib/binaural-beats/binaural-beat-presets.ts
apps/web/lib/binaural-beats/__tests__/binaural-beat-presets.test.ts
apps/web/components/binaural-beats/binaural-beats-client.tsx
apps/web/components/binaural-beats/__tests__/binaural-beats-client.test.tsx
```

Only add the component test file if the local React test patterns make it straightforward.

## Validation

Run targeted checks:

```sh
bun run test --filter=@kkb/web
bun run check-types --filter=@kkb/web
```

Run formatting/linting only for the touched scope unless the implementation naturally requires broader validation.

## Follow-up issues

- Update binaural beats docs to reflect the current personal-experiment safety priority.
- Decide whether URL state should later include manual carrier/beat/volume/fade values.
- Consider custom user presets only after the fixed presets feel useful.
- Consider extracting preset/config helpers to `packages/audio` only after the binaural feature stops being app-local.
