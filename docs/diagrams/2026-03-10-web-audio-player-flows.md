# Web Audio Player — State & Flow Diagrams

Player state machine, data flow, and interaction sequences.

## Player State Machine

State transitions managed by `PlayerStore` inside `AudioEngine`.

```mermaid
stateDiagram-v2
    direction LR

    [*] --> idle

    idle --> loading : load()

    state load_result <<choice>>
    loading --> load_result
    load_result --> ready : source succeeds
    load_result --> recovering : source fails, next available
    load_result --> error : all sources fail

    recovering --> ready : fallback succeeds
    recovering --> error : fallback fails

    ready --> playing : play()

    playing --> paused : pause() / ended

    paused --> playing : play()

    error --> loading : load() retry

    note right of loading
        ready, playing, and paused
        can all return here via load()
    end note
```

## Source Selection & Fallback

Sequence diagram showing how `engine.load()` ranks and attempts sources.

```mermaid
sequenceDiagram
    participant Engine as AudioEngine
    participant S1 as MediaElementSource (70)
    participant S2 as FallbackSource (1)

    Note over Engine: load(trackInput)
    Engine->>Engine: teardown active source, set "loading"

    Engine->>S1: canPlay(input)
    S1-->>Engine: true
    Engine->>S2: canPlay(input)
    S2-->>Engine: true

    Note over Engine: Rank by score: S1(70), S2(1)

    Engine->>S1: load(input)

    alt Success
        S1-->>Engine: resolved
        Engine->>Engine: subscribe, restore checkpoint
        Note over Engine: status = "ready", sourceId = "media-element"
    else S1 fails — fallback
        S1-->>Engine: Error
        Note over Engine: status = "recovering"
        Engine->>S2: load(input)
        alt Success
            S2-->>Engine: resolved
            Note over Engine: status = "ready", sourceId = "fallback"
        else S2 fails
            S2-->>Engine: Error
            Note over Engine: status = "error"
        end
    end
```

## Playback Interaction Flow

User interaction from click through engine to audio element.

```mermaid
sequenceDiagram
    participant User
    participant Shell as PlayerShell
    participant Presenter as createPlayerPresenter()
    participant Hook as usePlayerStore()
    participant WP as WebPlayer
    participant Engine as AudioEngine
    participant Source as MediaElementSource
    participant Audio as HTMLAudioElement

    Note over User,Audio: Play
    User->>Shell: click Play button
    Shell->>WP: player.play()
    WP->>Engine: play()
    Engine->>Source: play()
    Source->>Audio: audio.play()
    Audio-->>Source: "play" event
    Source-->>Engine: playbackListener("play")
    Engine->>Engine: store.setState({ status: "playing" })
    Engine-->>Hook: snapshot change notification
    Hook->>WP: getSnapshot()
    Hook->>Presenter: { status: "playing", ... }
    Presenter-->>Shell: { isPlaying: true, ... }
    Shell-->>User: UI updates (LED, button states)

    Note over User,Audio: Seek
    User->>Shell: click Waveform at 60%
    Shell->>Shell: calculate seconds from position
    Shell->>WP: player.seek(seconds)
    WP->>Engine: seek(seconds)
    Engine->>Engine: checkpoint.update({ currentTime })
    Engine->>Engine: store.setState({ currentTime })
    Engine->>Source: seek(seconds)
    Source->>Audio: audio.currentTime = seconds

    Note over User,Audio: Timeline updates (continuous)
    loop requestAnimationFrame
        Hook->>WP: getTimeline()
        WP->>Audio: read currentTime, duration
        Hook->>WP: getBufferedRanges()
        WP->>Audio: read buffered
        Hook->>Presenter: updated timeline + ranges
        Presenter-->>Shell: progressPercent, bufferedSegments
    end
```

## React Component Data Flow

How state flows from engine through React to UI components.

```mermaid
flowchart TB
    subgraph Engine["AudioEngine (outside React)"]
        Store["PlayerStore<br/>status, currentTime,<br/>duration, sourceId, error"]
        AE["Audio Element<br/>currentTime, duration, buffered"]
    end

    subgraph Hook["usePlayerStore(player)"]
        USES["useSyncExternalStore()<br/>→ snapshot"]
        RAF["requestAnimationFrame loop<br/>→ timeline, bufferedRanges"]
    end

    subgraph Client["MountedPlayer"]
        Props["merged props:<br/>snapshot + timeline + bufferedRanges"]
    end

    subgraph Shell["PlayerShell"]
        direction TB
        P["createPlayerPresenter()"]
        subgraph Views["UI Components"]
            LCD["LCD Display<br/>time, title, status"]
            WF["Waveform<br/>bars, progress, buffered"]
            PH["Playhead<br/>position"]
            CTL["PlayerControls<br/>play, pause"]
            LED["Status LEDs<br/>green/amber/red"]
            SB["Status Bar<br/>status text, errors"]
        end
        P --> Views
    end

    subgraph Actions["User Actions"]
        Play["onPlay()"]
        Pause["onPause()"]
        Seek["onSeek(seconds)"]
    end

    Store -->|"subscribe"| USES
    AE -->|"read per frame"| RAF
    USES --> Props
    RAF --> Props
    Props --> Shell
    Actions -->|"player.play/pause/seek"| Engine
```

## Checkpoint Recovery on Source Switch

How playback position persists when the engine falls back to a different source.

```mermaid
sequenceDiagram
    participant Engine as AudioEngine
    participant CP as Checkpoint
    participant S1 as Source A (primary)
    participant S2 as Source B (fallback)

    Note over Engine: User is playing at 45s

    Engine->>S1: getTimeline()
    S1-->>Engine: { currentTime: 45, duration: 120 }

    Note over Engine: Source A fails mid-playback

    Engine->>Engine: teardownActiveSource()
    Engine->>S1: pause()
    Engine->>S1: destroy()

    Note over Engine: Checkpoint retains currentTime: 45

    Engine->>Engine: load(sameTrack) — recovery path
    Engine->>S2: load(input)
    S2-->>Engine: resolved

    Engine->>CP: get()
    CP-->>Engine: { currentTime: 45, rate: 1, volume: 1 }

    Note over Engine: currentTime > 0, restore position
    Engine->>S2: seek(45)
    Engine->>Engine: store.setState({ status: "ready", sourceId: S2.id })

    Note over Engine: Playback resumes at 45s on Source B
```
