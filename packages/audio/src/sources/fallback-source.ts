import type { SourceCapabilities } from "../contracts/types";
import type { AudioSource, PlaybackEvent } from "./audio-source";

type AudioElementLike = {
  currentTime: number;
  duration: number;
  src: string;
  canPlayType(mimeType: string): string;
  play(): Promise<void>;
  pause(): void;
  load(): void;
  removeAttribute(name: string): void;
  addEventListener(type: PlaybackEvent, listener: () => void): void;
  removeEventListener(type: PlaybackEvent, listener: () => void): void;
};

const FALLBACK_CAPABILITIES: SourceCapabilities = {
  streaming: true,
  sampleAccurateSeek: false,
  gapless: "best-effort",
  loudnessMetadata: false,
  requiresUserGesture: true,
  requiresSAB: false,
};

export const createFallbackSource = (audio: AudioElementLike): AudioSource => ({
  id: "fallback",
  capabilities: FALLBACK_CAPABILITIES,
  canPlay: async (input) => audio.canPlayType(input.mimeType ?? "") !== "",
  score: (_context) => 1,
  load: async (input) => {
    audio.src = input.src;
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

    audio.addEventListener("play", play);
    audio.addEventListener("pause", pause);
    audio.addEventListener("ended", ended);

    return () => {
      audio.removeEventListener("play", play);
      audio.removeEventListener("pause", pause);
      audio.removeEventListener("ended", ended);
    };
  },
});
