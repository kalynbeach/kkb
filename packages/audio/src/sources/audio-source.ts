import type {
  SourceCapabilities,
  SourceScoreContext,
  TimelineSnapshot,
  TrackInput,
} from "../contracts/types";

export type PlaybackEventName = "play" | "pause" | "ended" | "error";

export type PlaybackErrorEvent = {
  type: "error";
  error: Error;
};

export type PlaybackEvent = "play" | "pause" | "ended" | PlaybackErrorEvent;

export type PlaybackListener = (event: PlaybackEvent) => void;

export type AudioSource = {
  id: string;
  capabilities: SourceCapabilities;
  canPlay(input: TrackInput): Promise<boolean>;
  score(context: SourceScoreContext): number;
  load(input: TrackInput): Promise<void>;
  play(): Promise<void>;
  pause(): Promise<void>;
  seek(seconds: number): Promise<void>;
  setRate(rate: number): Promise<void>;
  setVolume(volume: number): Promise<void>;
  getTimeline(): TimelineSnapshot;
  destroy(): Promise<void>;
  subscribePlayback?(listener: PlaybackListener): () => void;
};
