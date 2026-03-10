import type { SourceCapabilities, SourceScoreContext, TimelineSnapshot, TrackInput } from "../contracts/types";

type AudioElementLike = {
  currentTime: number;
  duration: number;
  src: string;
  play(): Promise<void>;
  pause(): void;
  load(): void;
  removeAttribute(name: string): void;
};

type AudioSource = {
  id: string;
  capabilities: SourceCapabilities;
  canPlay(input: TrackInput): Promise<boolean>;
  score(context: SourceScoreContext): number;
  load(input: TrackInput): Promise<void>;
  play(): Promise<void>;
  pause(): Promise<void>;
  seek(seconds: number): Promise<void>;
  getTimeline(): TimelineSnapshot;
  destroy(): Promise<void>;
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
  canPlay: async (_input) => true,
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
});
