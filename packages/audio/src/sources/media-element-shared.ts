import { isMediaElementEligibleInput } from "../contracts/codecs";
import type { SourceCapabilities, TrackInput } from "../contracts/types";
import type { AudioSource, PlaybackEventName, PlaybackListener } from "./audio-source";

export type MediaErrorLike = {
  code: number;
} | null;

export type TimeRangesLike = {
  length: number;
  start(index: number): number;
  end(index: number): number;
};

export type AudioElementLike = {
  currentTime: number;
  duration: number;
  playbackRate: number;
  volume: number;
  error?: MediaErrorLike;
  src: string;
  canPlayType(mimeType: string): string;
  play(): Promise<void>;
  pause(): void;
  load(): void;
  removeAttribute(name: string): void;
  addEventListener(type: PlaybackEventName, listener: () => void): void;
  removeEventListener(type: PlaybackEventName, listener: () => void): void;
};

type CreateMediaElementSourceOptions = {
  audio: AudioElementLike;
  capabilities: SourceCapabilities;
  id: string;
  score: number;
};

const getMediaElementErrorMessage = (audio: AudioElementLike) => {
  switch (audio.error?.code) {
    case 2:
      return "Media element network error";
    case 3:
      return "Media element decode error";
    case 4:
      return "Media element source is not supported";
    default:
      return "Media element error";
  }
};

const canPlayMediaElementInput = (audio: AudioElementLike, input: TrackInput) =>
  isMediaElementEligibleInput(input) && audio.canPlayType(input.mimeType ?? "") !== "";

const subscribeToMediaElementPlayback = (audio: AudioElementLike, listener: PlaybackListener) => {
  const play = () => {
    listener({ type: "play" });
  };
  const pause = () => {
    listener({ type: "pause" });
  };
  const ended = () => {
    listener({ type: "ended" });
  };
  const error = () => {
    listener({
      type: "error",
      error: new Error(getMediaElementErrorMessage(audio)),
    });
  };

  audio.addEventListener("play", play);
  audio.addEventListener("pause", pause);
  audio.addEventListener("ended", ended);
  audio.addEventListener("error", error);

  return () => {
    audio.removeEventListener("play", play);
    audio.removeEventListener("pause", pause);
    audio.removeEventListener("ended", ended);
    audio.removeEventListener("error", error);
  };
};

export const createMediaElementBackedSource = ({
  audio,
  capabilities,
  id,
  score,
}: CreateMediaElementSourceOptions): AudioSource => ({
  id,
  capabilities,
  canPlay: async (input) => canPlayMediaElementInput(audio, input),
  score: (_context) => score,
  load: async (input) => {
    audio.src = input.src;
    audio.load();
  },
  play: async () => {
    await audio.play();
  },
  pause: async () => {
    audio.pause();
  },
  seek: async (seconds) => {
    audio.currentTime = seconds;
  },
  setRate: async (rate) => {
    audio.playbackRate = rate;
  },
  setVolume: async (volume) => {
    audio.volume = volume;
  },
  getTimeline: () => ({
    currentTime: audio.currentTime,
    duration: audio.duration,
  }),
  destroy: async () => {
    audio.removeAttribute("src");
    audio.load();
  },
  subscribePlayback: (listener) => subscribeToMediaElementPlayback(audio, listener),
});
