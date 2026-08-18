# Web Audio Player QA Matrix

Last Updated: 2026-08-17

## Scope

Validate:

1. `/audio` route loads in `apps/web`
2. Local AAC and Opus fixtures load and seek
3. `MediaElementSource` is the expected active source in the current host
4. Fallback to `FallbackSource` still works when the preferred source fails
5. Cross-origin isolation behavior is known before enabling `SharedArrayBuffer` in production

## Browser Matrix

| Platform | Browser | Fixture | Expected Source | Checks |
| --- | --- | --- | --- | --- |
| macOS | Chrome latest | AAC `.m4a` | `media-element` | Load, play, pause, seek, timeline scrub |
| macOS | Chrome latest | Opus `.webm` | `media-element` | Load, play, seek, fixture swap |
| macOS | Firefox latest | AAC `.m4a` | `media-element` | Load, play, pause, seek |
| macOS | Firefox latest | Opus `.webm` | `media-element` | Load, play, seek |
| macOS | Safari latest | AAC `.m4a` | `media-element` | Gesture-unlocked play, pause, seek |
| iOS | Safari latest | AAC `.m4a` | `media-element` | User gesture unlock, play, pause, seek |

## Runtime Fallback Checks

| Scenario | Setup | Expected Result |
| --- | --- | --- |
| Media element failure | Force `MediaElementSource.load()` to throw in a test harness | `FallbackSource` becomes active |
| Worklet unavailable | `enableWorkletPCM = false` | Lower-ranked compatible source selected |
| WebCodecs disabled | `enableWebCodecs = false` | `MediaElementSource` selected for AAC/Opus fixtures |
| WebCodecs init failure | Enable source and force demux/load error | Engine falls back to `MediaElementSource` |

## Cross-Origin Isolation Validation

Before enabling `SharedArrayBuffer` in the web host:

1. Confirm `crossOriginIsolated === true` in the deployed environment.
2. Confirm `COOP` and `COEP` headers are present on the app shell and worklet asset responses.
3. Confirm `SharedArrayBuffer` branch is selected in a browser smoke test.
4. Confirm disabling cross-origin isolation still falls back to non-`SAB` transport without hard failure.

## Manual Route Checklist

1. Start the web app and open `/audio`.
2. Confirm the route renders the seek timeline, controls, and source badge.
3. Confirm the default AAC fixture loads without errors.
4. Press play and confirm audible output.
5. Scrub within the timeline and confirm time updates.
6. Pause and resume.
7. Reload and confirm the route still initializes cleanly.
