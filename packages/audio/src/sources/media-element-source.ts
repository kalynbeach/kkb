import type { SourceCapabilities } from "../contracts/types";
import type { AudioSource, PlaybackEventName } from "./audio-source";

type MediaErrorLike = {
  code: number;
} | null;

type AudioElementLike = {
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

const MEDIA_ELEMENT_CAPABILITIES: SourceCapabilities = {
  streaming: true,
  sampleAccurateSeek: false,
  gapless: "best-effort",
  loudnessMetadata: false,
  requiresUserGesture: true,
  requiresSAB: false,
};

const getMediaElementErrorMessage = (audio: AudioElementLike) => {
  if (audio.error?.code) {
    return `Media element error (code ${audio.error.code})`;
  }

  return "Media element error";
};

export const createMediaElementSource = (audio: AudioElementLike): AudioSource => ({
  id: "media-element",
  capabilities: MEDIA_ELEMENT_CAPABILITIES,
  canPlay: async (input) => audio.canPlayType(input.mimeType ?? "") !== "",
  score: (_context) => 70,
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
  subscribePlayback: (listener) => {
    const play = () => {
      listener("play");
    };
    const pause = () => {
      listener("pause");
    };
    const ended = () => {
      listener("ended");
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
  },
});
