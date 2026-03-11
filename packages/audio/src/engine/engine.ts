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

const toError = (error: unknown, fallbackMessage: string) =>
  error instanceof Error ? error : new Error(fallbackMessage);

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
      try {
        if (await source.canPlay(input)) {
          playableSources.push(source);
        }
      } catch (error) {
        console.error(`[audio-engine] canPlay failed for source "${source.id}"`, error);
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
        lastError = toError(error, "Unknown load failure");
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

    try {
      await this.activeSource.play();
      this.store.setState({ status: "playing", error: null });
    } catch (error) {
      const nextError = toError(error, "Unable to start playback");
      this.handleRuntimeError(nextError);
      throw nextError;
    }
  }

  async pause() {
    if (!this.activeSource) {
      return;
    }

    try {
      await this.activeSource.pause();
      this.store.setState({ status: "paused", error: null });
    } catch (error) {
      const nextError = toError(error, "Unable to pause playback");
      this.handleRuntimeError(nextError);
      throw nextError;
    }
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

  async destroy() {
    await this.teardownActiveSource();
    this.checkpoint.update({ currentTime: 0 });
    this.store.setState({
      status: "idle",
      currentTime: 0,
      duration: 0,
      sourceId: null,
      error: null,
    });
  }

  private subscribeToActiveSource(source: AudioSource) {
    this.unsubscribeFromActiveSource();
    this.unsubscribeActivePlayback =
      source.subscribePlayback?.((event) => {
        this.handlePlaybackEvent(source, event).catch((error) => {
          this.handleRuntimeError(toError(error, "Playback event handling failed"));
        });
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

    try {
      await source.pause();
    } catch (error) {
      console.error(`[audio-engine] pause failed during teardown for source "${source.id}"`, error);
    }

    try {
      await source.destroy();
    } catch (error) {
      console.error(
        `[audio-engine] destroy failed during teardown for source "${source.id}"`,
        error,
      );
    }
  }

  private async handlePlaybackEvent(source: AudioSource, event: PlaybackEvent) {
    if (this.activeSource !== source) {
      return;
    }

    if (typeof event !== "string") {
      this.handleRuntimeError(event.error);
      return;
    }

    if (event === "play") {
      this.store.setState({ status: "playing", error: null });
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
        error: null,
      });
    }
  }

  private handleRuntimeError(error: Error) {
    const snapshot = this.store.getSnapshot();
    this.store.setState({
      status: "error",
      currentTime: this.activeSource
        ? this.activeSource.getTimeline().currentTime
        : snapshot.currentTime,
      duration: this.activeSource ? this.activeSource.getTimeline().duration : snapshot.duration,
      sourceId: this.activeSource?.id ?? snapshot.sourceId,
      error: error.message,
    });
  }
}
