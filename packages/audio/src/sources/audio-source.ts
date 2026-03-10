import type {
  SourceCapabilities,
  SourceScoreContext,
  TimelineSnapshot,
  TrackInput,
} from "../contracts/types";

export type PlaybackEvent = "play" | "pause" | "ended";

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
  getTimeline(): TimelineSnapshot;
  destroy(): Promise<void>;
  subscribePlayback?(listener: PlaybackListener): () => void;
};
