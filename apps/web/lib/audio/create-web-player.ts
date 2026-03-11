import type { TrackInput } from "@kkb/audio/contracts/types";
import { AudioEngine } from "@kkb/audio/engine/engine";
import type { PlaybackEvent } from "@kkb/audio/sources/audio-source";
import { createFallbackSource } from "@kkb/audio/sources/fallback-source";
import { createMediaElementSource } from "@kkb/audio/sources/media-element-source";
import { createWebCodecsDemuxer } from "@kkb/audio/sources/webcodecs-demux";
import { createWebCodecsSource } from "@kkb/audio/sources/webcodecs-source";
import { createWorkletPCMSource } from "@kkb/audio/sources/worklet-pcm-source";

type BufferedRange = {
  start: number;
  end: number;
};

type TimeRangesLike = {
  length: number;
  start(index: number): number;
  end(index: number): number;
};

type AudioElementLike = {
  currentTime: number;
  duration: number;
  buffered: TimeRangesLike;
  src: string;
  canPlayType(mimeType: string): string;
  play(): Promise<void>;
  pause(): void;
  load(): void;
  removeAttribute(name: string): void;
  addEventListener(type: PlaybackEvent, listener: () => void): void;
  removeEventListener(type: PlaybackEvent, listener: () => void): void;
};

type CreateWebPlayerOptions = {
  createMediaElement?: () => AudioElementLike;
  createFallbackElement?: () => AudioElementLike;
  enableWebCodecs?: boolean;
  enableWorkletPCM?: boolean;
};

type WebPlayer = ReturnType<typeof createWebPlayer>;

const DEFAULT_TRACK: TrackInput = {
  src: "/audio/test-tone-aac.m4a",
  mimeType: "audio/mp4; codecs=mp4a.40.2",
};

const createAudioElement = (): AudioElementLike => {
  const audio = new Audio();
  audio.preload = "auto";
  return audio;
};

const toBufferedRanges = (buffered: TimeRangesLike | undefined): BufferedRange[] => {
  if (!buffered || buffered.length === 0) {
    return [];
  }

  return Array.from({ length: buffered.length }, (_, index) => ({
    start: buffered.start(index),
    end: buffered.end(index),
  }));
};

export const createWebPlayer = (options: CreateWebPlayerOptions = {}) => {
  const mediaElement = (options.createMediaElement ?? createAudioElement)();
  const fallbackElement = (options.createFallbackElement ?? createAudioElement)();

  const mediaElementSource = createMediaElementSource(mediaElement);
  const fallbackSource = createFallbackSource(fallbackElement);
  const workletSource = createWorkletPCMSource({
    transport: {
      available: options.enableWorkletPCM ?? false,
      postMessage: () => {},
    },
    timeline: {
      currentTime: 0,
      duration: 0,
    },
  });
  const webCodecsSource = createWebCodecsSource({
    // The unit-level WebCodecs path exists, but the browser host stays opt-in until
    // a real decode/output pipeline is wired.
    globals:
      options.enableWebCodecs && typeof globalThis !== "undefined"
        ? { AudioDecoder: (globalThis as { AudioDecoder?: unknown }).AudioDecoder }
        : { AudioDecoder: undefined },
    demuxer: createWebCodecsDemuxer(),
    timeline: {
      currentTime: 0,
      duration: 0,
    },
  });

  const sources = [fallbackSource, workletSource, mediaElementSource, webCodecsSource];
  const sourcesById = new Map(sources.map((source) => [source.id, source]));
  const engine = new AudioEngine({ sources });

  return {
    engine,
    sources,
    defaultTrack: DEFAULT_TRACK,
    getSnapshot: () => engine.getSnapshot(),
    subscribe: (listener: () => void) => engine.subscribe(listener),
    loadTrack: (input: TrackInput) => engine.load(input),
    play: () => engine.play(),
    pause: () => engine.pause(),
    seek: (seconds: number) => engine.seek(seconds),
    getTimeline: () => {
      const snapshot = engine.getSnapshot();
      return (
        (snapshot.sourceId ? sourcesById.get(snapshot.sourceId)?.getTimeline() : null) ?? {
          currentTime: snapshot.currentTime,
          duration: snapshot.duration,
        }
      );
    },
    getBufferedRanges: () => {
      const snapshot = engine.getSnapshot();

      if (snapshot.sourceId === "fallback") {
        return toBufferedRanges(fallbackElement.buffered);
      }

      if (snapshot.sourceId === "media-element") {
        return toBufferedRanges(mediaElement.buffered);
      }

      return [];
    },
  };
};

export type { BufferedRange, WebPlayer };
