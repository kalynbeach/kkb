import type {
  SourceCapabilities,
  SourceScoreContext,
  TimelineSnapshot,
  TrackInput,
} from "../contracts/types";

type WorkletTransport = {
  available: boolean;
  postMessage(message: { type: "play" | "pause" } | { type: "seek"; seconds: number }): void;
};

type WorkletPCMSourceOptions = {
  transport: WorkletTransport;
  timeline: TimelineSnapshot;
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

const WORKLET_PCM_CAPABILITIES: SourceCapabilities = {
  streaming: true,
  sampleAccurateSeek: true,
  gapless: true,
  loudnessMetadata: false,
  requiresUserGesture: true,
  requiresSAB: false,
};

export const createWorkletPCMSource = ({
  transport,
  timeline,
}: WorkletPCMSourceOptions): AudioSource => {
  let currentTimeline = { ...timeline };

  return {
    id: "worklet-pcm",
    capabilities: WORKLET_PCM_CAPABILITIES,
    canPlay: async (_input) => transport.available,
    score: (_context) => 50,
    load: async (_input) => {},
    play: async () => {
      transport.postMessage({ type: "play" });
    },
    pause: async () => {
      transport.postMessage({ type: "pause" });
    },
    seek: async (seconds) => {
      currentTimeline = { ...currentTimeline, currentTime: seconds };
      transport.postMessage({ type: "seek", seconds });
    },
    getTimeline: () => currentTimeline,
    destroy: async () => {},
  };
};
