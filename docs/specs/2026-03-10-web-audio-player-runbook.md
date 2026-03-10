# Web Audio Player Runbook

Last Updated: 2026-03-10

## Current Operational Posture

The current `/audio` host is intentionally conservative:

1. Audible playback runs through `MediaElementSource`.
2. `FallbackSource` is the compatibility backstop.
3. `WebCodecsSource` and `WorkletPCMSource` are implemented and tested at the package level, but remain runtime-disabled in `apps/web` until their output paths are production-ready.

## Error Categories

| Category | Typical Symptoms | Primary Response |
| --- | --- | --- |
| Network/init | Fixture or remote input never loads | Inspect source URL, CORS, and load errors |
| Decode/init | Preferred source throws during `load()` | Confirm fallback path, inspect source-specific init failure |
| Worklet | Worklet registration or transport path fails | Confirm worklet asset path and transport gate |
| Gesture/policy | Playback blocked until interaction | Reproduce with explicit user gesture, especially Safari/iOS |
| Interruption | Route changes, tab backgrounding, audio route changes | Confirm engine resumes or degrades gracefully |

## First Response Checklist

1. Record active source id from the player UI or engine snapshot.
2. Check whether the host had `enableWebCodecs` or `enableWorkletPCM` disabled or enabled.
3. Reproduce with the local AAC fixture first.
4. Reproduce with the local Opus fixture second.
5. Confirm whether failure happens at `load`, `play`, or `seek`.

## Debug Targets

Inspect these values first:

1. `engine.getSnapshot().status`
2. `engine.getSnapshot().sourceId`
3. `engine.getSnapshot().error`
4. Buffered ranges from the active element
5. Worklet asset availability at `/worklets/kkb-audio-processor.js`

## Recovery Expectations

| Situation | Expected Behavior |
| --- | --- |
| Preferred source load failure | Engine selects the next compatible source |
| Seek after recovery | Checkpoint time is restored |
| Worklet path unavailable | Lower-ranked compatible source is selected |
| WebCodecs unavailable | Media-element path is selected |

## Host-Specific Notes

1. `apps/web/lib/audio/create-web-player.ts` is the gatekeeper for host-level source enablement.
2. If `WebCodecsSource` is enabled there before a real decode/output path exists, `/audio` may select a source that is not yet audible.
3. If `WorkletPCMSource` is enabled there before audible worklet output exists, `/audio` may select a non-audible path when its score outranks fallback.

## Escalation Guidance

Escalate implementation work when:

1. `MediaElementSource` cannot play the local AAC fixture in supported desktop browsers.
2. Fallback does not activate after forced preferred-source failure.
3. The route fails to boot after adding a new source gate.
4. Cross-origin isolation changes affect worklet registration or `SharedArrayBuffer` behavior.
