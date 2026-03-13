# Web Audio Player — Architecture Diagrams

System architecture and component relationships for the `@kkb/audio` package and web player integration.

## System Overview

High-level view of the three-layer architecture across the monorepo.

```mermaid
flowchart TB
    subgraph Web["apps/web (Next.js Host)"]
        Route["/audio route<br/>(server component)"]
        PC["PlayerClient<br/>(client component)"]
        MS["MountedPlayer"]
        PS["PlayerShell<br/>(WinAmp UI)"]
        CWP["createWebPlayer()"]
        UPS["usePlayerController()"]

        Route --> PC
        PC -->|"useEffect mount"| CWP
        PC -->|"player ready"| MS
        MS --> UPS
        MS --> PS
    end

    subgraph UI["packages/ui (Shared Components)"]
        Presenter["createPlayerPresenter()"]
        Controls["PlayerControls"]
        Waveform["Waveform"]
        Playhead["Playhead"]

        Waveform --> Playhead
    end

    subgraph Audio["packages/audio (Runtime Engine)"]
        Engine["AudioEngine"]
        Store["PlayerStore"]
        Checkpoint["PlaybackCheckpoint"]

        subgraph Sources["AudioSource Implementations"]
            WCS["WebCodecsSource<br/>score: 100 (disabled)"]
            MES["MediaElementSource<br/>score: 70 (active)"]
            WPS["WorkletPCMSource<br/>score: 50 (disabled)"]
            FS["FallbackSource<br/>score: 1 (active)"]
        end

        Engine --> Store
        Engine --> Checkpoint
        Engine --> Sources
    end

    CWP -->|"creates"| Engine
    UPS -->|"useSyncExternalStore"| Store
    PS -->|"rAF loop"| CWP
    PS --> Presenter
    PS --> Controls
    PS --> Waveform
```

## AudioSource Interface

Class diagram showing the source contract and all implementations.

```mermaid
classDiagram
    class AudioSource {
        <<interface>>
        +string id
        +SourceCapabilities capabilities
        +canPlay(input: TrackInput) Promise~boolean~
        +score(context: SourceScoreContext) number
        +load(input: TrackInput) Promise~void~
        +play() Promise~void~
        +pause() Promise~void~
        +seek(seconds: number) Promise~void~
        +getTimeline() TimelineSnapshot
        +destroy() Promise~void~
        +subscribePlayback?(listener: PlaybackListener) () => void
    }

    class SourceCapabilities {
        +boolean streaming
        +boolean sampleAccurateSeek
        +GaplessCapability gapless
        +boolean loudnessMetadata
        +boolean requiresUserGesture
        +boolean requiresSAB
    }

    class MediaElementSource {
        +id = "media-element"
        +score() 70
        +streaming = true
        +sampleAccurateSeek = false
        +gapless = "best-effort"
        +requiresUserGesture = true
        +requiresSAB = false
    }

    class FallbackSource {
        +id = "fallback"
        +score() 1
        +streaming = true
        +sampleAccurateSeek = false
        +gapless = "best-effort"
        +requiresUserGesture = true
        +requiresSAB = false
    }

    class WebCodecsSource {
        +id = "webcodecs"
        +score() 100
        +streaming = true
        +sampleAccurateSeek = true
        +gapless = true
        +requiresUserGesture = true
        +requiresSAB = false
    }

    class WorkletPCMSource {
        +id = "worklet-pcm"
        +score() 50
        +streaming = true
        +sampleAccurateSeek = true
        +gapless = true
        +requiresUserGesture = true
        +requiresSAB = false
    }

    AudioSource --> SourceCapabilities : declares
    MediaElementSource ..|> AudioSource
    FallbackSource ..|> AudioSource
    WebCodecsSource ..|> AudioSource
    WorkletPCMSource ..|> AudioSource
```

## Engine Internals

Class diagram of the `AudioEngine` and its internal collaborators.

```mermaid
classDiagram
    class AudioEngine {
        -PlayerStore store
        -PlaybackCheckpoint checkpoint
        -AudioSource[] sources
        -SourceScoreContext scoreContext
        -AudioSource activeSource
        +getSnapshot() PlayerState
        +subscribe(listener) () => void
        +load(input: TrackInput) Promise~void~
        +play() Promise~void~
        +pause() Promise~void~
        +seek(seconds) Promise~void~
        +setRate(rate) Promise~void~
        +setVolume(volume) Promise~void~
        -subscribeToActiveSource(source)
        -teardownActiveSource()
        -handlePlaybackEvent(source, event)
    }

    class PlayerStore {
        -PlayerState state
        -Set~Function~ listeners
        +getSnapshot() PlayerState
        +setState(patch: Partial~PlayerState~)
        +subscribe(listener) () => void
    }

    class PlayerState {
        +PlayerStatus status
        +number currentTime
        +number duration
        +string sourceId
        +string error
    }

    class PlaybackCheckpoint {
        -checkpoint: CheckpointData
        +get() CheckpointData
        +update(patch) CheckpointData
    }

    class CheckpointData {
        +number currentTime
        +number rate
        +number volume
    }

    class TrackInput {
        +string src
        +string? mimeType
    }

    class TimelineSnapshot {
        +number currentTime
        +number duration
    }

    AudioEngine *-- PlayerStore : owns
    AudioEngine *-- PlaybackCheckpoint : owns
    AudioEngine o-- AudioSource : manages 0..*
    PlayerStore --> PlayerState : stores
    PlaybackCheckpoint --> CheckpointData : stores
    AudioEngine ..> TrackInput : accepts
    AudioEngine ..> TimelineSnapshot : reads
```

## WebPlayer Factory

How `createWebPlayer()` composes sources and engine for the web host.

```mermaid
flowchart TB
    subgraph Factory["createWebPlayer(options)"]
        ME["new Audio()"] --> MES["MediaElementSource — score: 70"]
        FE["new Audio()"] --> FS["FallbackSource — score: 1"]
        WPS["WorkletPCMSource — score: 50 — disabled"]
        WCS["WebCodecsSource — score: 100 — disabled"]

        MES --> SRC["sources array"]
        FS --> SRC
        WPS -.-> SRC
        WCS -.-> SRC

        SRC --> ENG["AudioEngine"]
    end

    ENG --> API["WebPlayer API<br/>getSnapshot, subscribe, loadTrack,<br/>play, pause, seek, getTimeline,<br/>getBufferedRanges"]
```
