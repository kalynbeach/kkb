# Web Audio Player Codec Matrix

Last Updated: 2026-03-10

## Current Host Defaults (`apps/web`)

The current web host intentionally enables the media-element path for audible playback and keeps the `WebCodecsSource` and `WorkletPCMSource` registered but runtime-disabled until their full decode/output paths are wired.

| Input | Mime Type | Current Preferred Source in `apps/web` | Fallback Chain | Notes |
| --- | --- | --- | --- | --- |
| Local AAC fixture | `audio/mp4; codecs=mp4a.40.2` | `MediaElementSource` | `FallbackSource` | Current `/audio` route default |
| Local Opus fixture | `audio/webm; codecs=opus` | `MediaElementSource` | `FallbackSource` | Can be used for manual source checks |

## Runtime Capability Matrix (`@kkb/audio`)

| Input | Mime Type | Eligible Sources | Package-Level Preference Order | Notes |
| --- | --- | --- | --- | --- |
| AAC in MP4/M4A | `audio/mp4; codecs=mp4a.40.2` or `audio/m4a; codecs=mp4a.40.2` | `WebCodecsSource`, `MediaElementSource`, `FallbackSource` | `WebCodecsSource` -> `MediaElementSource` -> `WorkletPCMSource` -> `FallbackSource` | `WebCodecsSource` requires verified browser support and host opt-in |
| Opus in WebM | `audio/webm; codecs=opus` | `WebCodecsSource`, `MediaElementSource`, `FallbackSource` | `WebCodecsSource` -> `MediaElementSource` -> `WorkletPCMSource` -> `FallbackSource` | Same host gating as above |
| PCM/WAV (lab only) | `audio/wav` | `WorkletPCMSource`, `MediaElementSource`, `FallbackSource` | `WorkletPCMSource` -> `MediaElementSource` -> `FallbackSource` | Reserved for tooling and validation |
| FLAC | `audio/flac` | `MediaElementSource`, `FallbackSource` | `MediaElementSource` -> `FallbackSource` | Outside initial WebCodecs matrix |

## Failure Routing

| Failure Mode | Preferred Source | Next Source |
| --- | --- | --- |
| `AudioDecoder` unavailable | `WebCodecsSource` | `MediaElementSource` |
| Demux unsupported for input | `WebCodecsSource` | `MediaElementSource` |
| WebCodecs load/init failure | `WebCodecsSource` | `MediaElementSource` |
| Media element init/playback failure | `MediaElementSource` | `FallbackSource` |
| Worklet transport unavailable | `WorkletPCMSource` | Lower-ranked compatible source |

## Deployment Notes

1. `WebCodecsSource` exists in the runtime and unit tests, but `apps/web` currently keeps it disabled until a real decoded-output path is in place.
2. `WorkletPCMSource` exists in the runtime and unit tests, but `apps/web` currently keeps it disabled until worklet output is wired to audible playback.
3. Production rollout should only flip those gates after browser validation in the QA matrix and audible-playback verification in the runbook.
