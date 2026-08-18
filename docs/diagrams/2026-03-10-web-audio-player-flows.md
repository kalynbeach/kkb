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
    ready --> idle : destroy()
    playing --> idle : destroy()
    paused --> idle : destroy()
    recovering --> idle : destroy()
    error --> idle : destroy()

    error --> loading : load() retry
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
    participant Controller as PlayerController
    participant ControllerHook as usePlayerController()
    participant Mounted as MountedPlayer
    participant WP as WebPlayer
    participant Engine as AudioEngine
    participant Source as MediaElementSource
    participant Audio as HTMLAudioElement

    Note over User,Audio: Play
    User->>Shell: click Play button
    Shell->>Controller: play()
    Controller->>WP: play()
    WP->>Engine: play()
    Engine->>Source: play()
    Source->>Audio: audio.play()
    Audio-->>Source: "play" event
    Source-->>Engine: playbackListener({ type: "play" })
    Engine->>Engine: transitionToPlaying()
    Engine-->>ControllerHook: snapshot change notification
    ControllerHook->>Mounted: controller snapshot
    Shell-->>User: UI updates (LED, button states)

    Note over User,Audio: Seek
    User->>Shell: click or drag SeekTimeline to 60%
    Shell->>Shell: calculate seconds from slider value
    Shell->>Controller: seek(seconds)
    Controller->>WP: seek(seconds)
    WP->>Engine: seek(seconds)
    Engine->>Engine: checkpoint.update({ currentTime })
    Engine->>Engine: syncTimeline({ currentTime })
    Engine->>Source: seek(seconds)
    Source->>Audio: audio.currentTime = seconds

    Note over User,Audio: Rate / volume
    User->>Shell: adjust shared controls
    Shell->>Controller: setRate(rate) / setVolume(volume)
    Controller->>WP: setRate(rate) / setVolume(volume)
    WP->>Engine: persist control change
    Engine->>Source: setRate(rate) / setVolume(volume)

    Note over User,Audio: Timeline updates (continuous)
    loop requestAnimationFrame
        Shell->>WP: getTimeline()
        WP->>Audio: read currentTime, duration
        Shell->>WP: getBufferedRanges()
        WP->>Audio: read buffered
        Shell->>Presenter: updated timeline + ranges
        Presenter-->>Shell: progressPercent, bufferedSegments
    end
```

## React Component Data Flow

How state flows from engine through React to UI components.

```mermaid
flowchart TB
    subgraph Engine["AudioEngine (outside React)"]
        Store["PlayerStore<br/>status, currentTime,<br/>duration, sourceId,<br/>error, rate, volume"]
        AE["Audio Element<br/>currentTime, duration, buffered"]
    end

    subgraph Controller["PlayerController"]
        SNAP["selection, runtime,<br/>catalogStatus, restoreStatus"]
        ACT["play / pause / seek / setRate / setVolume"]
    end

    subgraph Hook["usePlayerController(controller)"]
        USES["useSyncExternalStore()<br/>→ controller snapshot"]
    end

    subgraph ShellLoop["PlayerShell"]
        RAF["requestAnimationFrame loop<br/>→ timeline, bufferedRanges"]
    end

    subgraph Client["MountedPlayer"]
        Props["merged props:<br/>selection + runtime + timeline + bufferedRanges"]
    end

    subgraph Shell["PlayerShell"]
        direction TB
        P["createPlayerPresenter()"]
        subgraph Views["UI Components"]
            LCD["LCD Display<br/>time, title, status"]
            WF["SeekTimeline<br/>played, buffered, playhead"]
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
        Rate["onSetRate(rate)"]
        Volume["onSetVolume(volume)"]
    end

    Store -->|"player.subscribe"| SNAP
    SNAP --> USES
    AE -->|"read per frame"| RAF
    USES --> Props
    RAF --> Props
    Props --> Shell
    Actions -->|"controller actions"| ACT
    ACT -->|"player facade"| Engine
```

## Checkpoint Recovery on Source Switch

How checkpointed time behaves when a new `load()` replaces an existing source.

```mermaid
sequenceDiagram
    participant Engine as AudioEngine
    participant CP as Checkpoint
    participant S1 as Source A (active)
    participant S2 as Source B (replacement)

    Note over Engine,CP: A prior seek stored currentTime: 45 in the checkpoint

    Note over Engine: User selects a new track while Source A is active
    Engine->>Engine: load(newTrack)
    Engine->>Engine: hadActiveSource = true
    Engine->>Engine: teardownActiveSource()
    Engine->>S1: pause()
    Engine->>S1: destroy()
    Engine->>CP: update({ currentTime: 0 })
    Note over Engine: Replacing an active source clears resume time
    Engine->>S2: load(input)
    S2-->>Engine: resolved
    Engine->>CP: get()
    CP-->>Engine: { currentTime: 0, rate: 1, volume: 1 }
    Note over Engine: No checkpoint seek runs because currentTime is 0
    Engine->>Engine: transitionToReady({ status: "ready", currentTime: 0, sourceId: S2.id })
```
