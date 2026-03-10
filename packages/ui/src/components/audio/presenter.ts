export type AudioPlayerStatus =
  | "idle"
  | "loading"
  | "ready"
  | "playing"
  | "paused"
  | "recovering"
  | "error";

export type BufferedRange = {
  start: number;
  end: number;
};

export type PlayerPresenterInput = {
  status: AudioPlayerStatus;
  currentTime: number;
  duration: number;
  bufferedRanges: BufferedRange[];
};

const formatTime = (value: number) => {
  const totalSeconds = Math.max(0, Math.floor(value));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const clampPercent = (value: number) => Math.min(100, Math.max(0, value));

export const createPlayerPresenter = ({
  status,
  currentTime,
  duration,
  bufferedRanges,
}: PlayerPresenterInput) => {
  const safeDuration = duration > 0 ? duration : 1;
  const isPlaying = status === "playing";
  const canControl = status !== "idle" && status !== "loading" && status !== "recovering" && status !== "error";

  return {
    isPlaying,
    isPlayDisabled: !canControl || isPlaying,
    isPauseDisabled: !canControl || !isPlaying,
    currentTimeLabel: formatTime(currentTime),
    durationLabel: formatTime(duration),
    progressPercent: clampPercent((currentTime / safeDuration) * 100),
    bufferedSegments: bufferedRanges.map((range) => ({
      leftPercent: clampPercent((range.start / safeDuration) * 100),
      widthPercent: clampPercent(((range.end - range.start) / safeDuration) * 100),
    })),
  };
};
