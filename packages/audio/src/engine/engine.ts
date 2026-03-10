import type { SourceScoreContext, TimelineSnapshot, TrackInput } from "../contracts/types";
import type { AudioSource, PlaybackEvent } from "../sources/audio-source";
import { createPlaybackCheckpoint } from "./checkpoint";
import { createPlayerStore } from "./store";

type AudioEngineOptions = {
  sources: AudioSource[];
  scoreContext?: Partial<SourceScoreContext>;
};

const DEFAULT_SCORE_CONTEXT: SourceScoreContext = {
  coopCoepEnabled: false,
  lowPowerModeLikely: false,
};

export class AudioEngine {
  private readonly store = createPlayerStore();
  private readonly checkpoint = createPlaybackCheckpoint();
  private readonly sources: AudioSource[];
  private readonly scoreContext: SourceScoreContext;
  private activeSource: AudioSource | null = null;
  private unsubscribeActivePlayback: (() => void) | null = null;

  constructor(options: AudioEngineOptions) {
    this.sources = options.sources;
    this.scoreContext = { ...DEFAULT_SCORE_CONTEXT, ...options.scoreContext };
  }

  getSnapshot() {
    return this.store.getSnapshot();
  }

  subscribe(listener: () => void) {
    return this.store.subscribe(listener);
  }

  async load(input: TrackInput) {
    const hadActiveSource = this.activeSource !== null;
    await this.teardownActiveSource();
    if (hadActiveSource) {
      this.checkpoint.update({ currentTime: 0 });
    }
    this.store.setState({
      status: "loading",
      currentTime: 0,
      duration: 0,
      sourceId: null,
      error: null,
    });

    const playableSources: AudioSource[] = [];
    for (const source of this.sources) {
      if (await source.canPlay(input)) {
        playableSources.push(source);
      }
    }

    const rankedSources = playableSources.sort(
      (left, right) => right.score(this.scoreContext) - left.score(this.scoreContext),
    );

    let lastError: Error | null = null;

    for (const [index, source] of rankedSources.entries()) {
      try {
        if (index > 0) {
          this.store.setState({ status: "recovering" });
        }

        await source.load(input);

        const checkpoint = this.checkpoint.get();
        if (checkpoint.currentTime > 0) {
          await source.seek(checkpoint.currentTime);
        }

        const timeline = source.getTimeline();
        this.activeSource = source;
        this.subscribeToActiveSource(source);
        this.store.setState({
          status: "ready",
          currentTime: checkpoint.currentTime || timeline.currentTime,
          duration: timeline.duration,
          sourceId: source.id,
          error: null,
        });
        return;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error("Unknown load failure");
      }
    }

    this.unsubscribeFromActiveSource();
    this.activeSource = null;
    this.store.setState({
      status: "error",
      currentTime: 0,
      duration: 0,
      sourceId: null,
      error: lastError?.message ?? "Unable to load audio source",
    });

    throw lastError ?? new Error("Unable to load audio source");
  }

  async play() {
    if (!this.activeSource) {
      return;
    }

    await this.activeSource.play();
    this.store.setState({ status: "playing" });
  }

  async pause() {
    if (!this.activeSource) {
      return;
    }

    await this.activeSource.pause();
    this.store.setState({ status: "paused" });
  }

  async seek(seconds: number) {
    this.checkpoint.update({ currentTime: seconds });
    this.store.setState({ currentTime: seconds });

    if (!this.activeSource) {
      return;
    }

    await this.activeSource.seek(seconds);
  }

  async setRate(rate: number) {
    this.checkpoint.update({ rate });
  }

  async setVolume(volume: number) {
    this.checkpoint.update({ volume });
  }

  private subscribeToActiveSource(source: AudioSource) {
    this.unsubscribeFromActiveSource();
    this.unsubscribeActivePlayback =
      source.subscribePlayback?.((event) => {
        void this.handlePlaybackEvent(source, event);
      }) ?? null;
  }

  private unsubscribeFromActiveSource() {
    this.unsubscribeActivePlayback?.();
    this.unsubscribeActivePlayback = null;
  }

  private async teardownActiveSource() {
    const source = this.activeSource;

    this.unsubscribeFromActiveSource();
    this.activeSource = null;

    if (!source) {
      return;
    }

    await source.pause();
    await source.destroy();
  }

  private async handlePlaybackEvent(source: AudioSource, event: PlaybackEvent) {
    if (this.activeSource !== source) {
      return;
    }

    if (event === "play") {
      this.store.setState({ status: "playing" });
      return;
    }

    if (event === "ended") {
      this.checkpoint.update({ currentTime: 0 });
      this.store.setState({
        status: "paused",
        currentTime: 0,
        duration: source.getTimeline().duration,
      });
      await source.seek(0);
      return;
    }

    if (event === "pause") {
      const timeline: TimelineSnapshot = source.getTimeline();
      this.store.setState({
        status: "paused",
        currentTime: timeline.currentTime,
        duration: timeline.duration,
      });
    }
  }
}
