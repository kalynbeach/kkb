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

const INVALID_SEEK_TIME_MESSAGE = "Seek time must be a finite number greater than or equal to 0";
const SEEK_EXCEEDS_DURATION_MESSAGE = "Seek time exceeds the loaded track duration";

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
    // The engine contract requires at least one source candidate up front.
    if (options.sources.length === 0) {
      throw new Error("AudioEngine requires at least one source");
    }

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
    this.store.transitionToLoading();

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
      if (index > 0) {
        this.store.transitionToRecovering();
      }

      try {
        await source.load(input);
      } catch (error) {
        lastError = toError(error, "Unknown load failure");
        console.error(`[audio-engine] load failed for source "${source.id}"`, lastError);
        continue;
      }

      const checkpoint = this.checkpoint.get();
      // Restore timeline and control preferences before exposing the source as ready.
      if (checkpoint.currentTime > 0) {
        try {
          await source.seek(checkpoint.currentTime);
        } catch (error) {
          lastError = toError(error, "Unknown seek restore failure");
          console.error(
            `[audio-engine] checkpoint restore seek failed for source "${source.id}"`,
            lastError,
          );
          continue;
        }
      }

      try {
        await source.setRate(checkpoint.rate);
        await source.setVolume(checkpoint.volume);
      } catch (error) {
        lastError = toError(error, "Unknown playback preference failure");
        console.error(
          `[audio-engine] playback preference restore failed for source "${source.id}"`,
          lastError,
        );
        continue;
      }

      const timeline = source.getTimeline();
      this.activeSource = source;
      this.subscribeToActiveSource(source);
      this.store.transitionToReady({
        currentTime: checkpoint.currentTime || timeline.currentTime,
        duration: timeline.duration,
        sourceId: source.id,
        rate: checkpoint.rate,
        volume: checkpoint.volume,
      });
      return;
    }

    this.unsubscribeFromActiveSource();
    this.activeSource = null;
    this.store.transitionToError({
      error: lastError?.message ?? "Unable to load audio source",
      currentTime: 0,
      duration: 0,
      sourceId: null,
    });

    throw lastError ?? new Error("Unable to load audio source");
  }

  async play() {
    // Explicit no-op until a track has been loaded into an active source.
    if (!this.activeSource) {
      return;
    }

    try {
      await this.activeSource.play();
      this.store.transitionToPlaying();
    } catch (error) {
      const nextError = toError(error, "Unable to start playback");
      this.handleRuntimeError(nextError);
      throw nextError;
    }
  }

  async pause() {
    // Explicit no-op until a track has been loaded into an active source.
    if (!this.activeSource) {
      return;
    }

    try {
      await this.activeSource.pause();
      this.store.transitionToPaused();
    } catch (error) {
      const nextError = toError(error, "Unable to pause playback");
      this.handleRuntimeError(nextError);
      throw nextError;
    }
  }

  async seek(seconds: number) {
    const validationError = this.getSeekValidationError(seconds);
    if (validationError) {
      const nextError = new Error(validationError);
      this.handleRuntimeError(nextError);
      throw nextError;
    }

    const previousCheckpoint = this.checkpoint.get().currentTime;
    const previousSnapshotTime = this.store.getSnapshot().currentTime;

    this.checkpoint.update({ currentTime: seconds });
    this.store.syncTimeline({ currentTime: seconds });

    if (!this.activeSource) {
      return;
    }

    try {
      await this.activeSource.seek(seconds);
    } catch (error) {
      const nextError = toError(error, "Unable to seek playback");
      this.handleRuntimeError(nextError);
      this.checkpoint.update({ currentTime: previousCheckpoint });
      this.store.syncTimeline({ currentTime: previousSnapshotTime });
      throw nextError;
    }
  }

  private getSeekValidationError(seconds: number) {
    if (!Number.isFinite(seconds) || seconds < 0) {
      return INVALID_SEEK_TIME_MESSAGE;
    }

    // Pre-load seeks may be optimistic, but once duration is known we reject overshoots.
    const duration = this.store.getSnapshot().duration;
    if (Number.isFinite(duration) && duration > 0 && seconds > duration) {
      return SEEK_EXCEEDS_DURATION_MESSAGE;
    }

    return null;
  }

  async setRate(rate: number) {
    const previousRate = this.checkpoint.get().rate;
    this.checkpoint.update({ rate });

    try {
      await this.activeSource?.setRate(rate);
      this.store.setRate(rate);
    } catch (error) {
      const nextError = toError(error, "Unable to update playback rate");
      this.checkpoint.update({ rate: previousRate });
      this.store.setRate(previousRate);
      this.handleRuntimeError(nextError);
      throw nextError;
    }
  }

  async setVolume(volume: number) {
    const previousVolume = this.checkpoint.get().volume;
    this.checkpoint.update({ volume });

    try {
      await this.activeSource?.setVolume(volume);
      this.store.setVolume(volume);
    } catch (error) {
      const nextError = toError(error, "Unable to update volume");
      this.checkpoint.update({ volume: previousVolume });
      this.store.setVolume(previousVolume);
      this.handleRuntimeError(nextError);
      throw nextError;
    }
  }

  async destroy() {
    await this.teardownActiveSource();
    this.checkpoint.reset();
    this.store.reset();
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

    if (event.type === "error") {
      this.handleRuntimeError(event.error);
      return;
    }

    if (event.type === "play") {
      this.store.transitionToPlaying();
      return;
    }

    if (event.type === "ended") {
      const timeline = source.getTimeline();
      this.checkpoint.update({ currentTime: 0 });
      this.store.transitionToPaused({
        currentTime: 0,
        duration: timeline.duration,
      });
      // Keep source rewind explicit so a subsequent play starts from the beginning.
      await source.seek(0);
      return;
    }

    if (event.type === "pause") {
      const timeline: TimelineSnapshot = source.getTimeline();
      this.store.transitionToPaused({
        currentTime: timeline.currentTime,
        duration: timeline.duration,
      });
    }
  }

  private handleRuntimeError(error: Error) {
    const snapshot = this.store.getSnapshot();
    // Runtime failures should preserve the original error even when timeline reads also fail.
    const activeTimeline = this.getSafeActiveTimeline(snapshot);
    this.store.transitionToError({
      error: error.message,
      currentTime: activeTimeline.currentTime,
      duration: activeTimeline.duration,
      sourceId: this.activeSource?.id ?? snapshot.sourceId,
    });
  }

  private getSafeActiveTimeline(snapshot: ReturnType<AudioEngine["getSnapshot"]>) {
    if (!this.activeSource) {
      return {
        currentTime: snapshot.currentTime,
        duration: snapshot.duration,
      };
    }

    try {
      return this.activeSource.getTimeline();
    } catch {
      return {
        currentTime: snapshot.currentTime,
        duration: snapshot.duration,
      };
    }
  }
}
