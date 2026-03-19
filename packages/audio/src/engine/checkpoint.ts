export type PlaybackCheckpoint = {
  currentTime: number;
  rate: number;
  volume: number;
};

const DEFAULT_CHECKPOINT: PlaybackCheckpoint = {
  currentTime: 0,
  rate: 1,
  volume: 1,
};

export const createPlaybackCheckpoint = () => {
  let checkpoint = DEFAULT_CHECKPOINT;

  return {
    get: () => checkpoint,
    update: (patch: Partial<PlaybackCheckpoint>) => {
      checkpoint = { ...checkpoint, ...patch };
      return checkpoint;
    },
    reset: () => {
      checkpoint = { ...DEFAULT_CHECKPOINT };
      return checkpoint;
    },
  };
};
