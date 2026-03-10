import type { SourceScoreContext, TimelineSnapshot, TrackInput } from "../contracts/types";
import { createPlaybackCheckpoint } from "./checkpoint";
import { createPlayerStore } from "./store";

type EngineSource = {
  id: string;
  canPlay(input: TrackInput): Promise<boolean>;
  score(context: SourceScoreContext): number;
  load(input: TrackInput): Promise<void>;
  play(): Promise<void>;
  pause(): Promise<void>;
  seek(seconds: number): Promise<void>;
  getTimeline(): TimelineSnapshot;
  destroy(): Promise<void>;
};

type AudioEngineOptions = {
  sources: EngineSource[];
  scoreContext?: Partial<SourceScoreContext>;
};

const DEFAULT_SCORE_CONTEXT: SourceScoreContext = {
  coopCoepEnabled: false,
  lowPowerModeLikely: false,
};

export class AudioEngine {
  private readonly store = createPlayerStore();
  private readonly checkpoint = createPlaybackCheckpoint();
  private readonly sources: EngineSource[];
  private readonly scoreContext: SourceScoreContext;
  private activeSource: EngineSource | null = null;

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
    this.store.setState({ status: "loading", error: null });

    const playableSources: EngineSource[] = [];
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

    this.activeSource = null;
    this.store.setState({
      status: "error",
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
}
