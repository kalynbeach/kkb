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

export type PlayerControlMode = "unavailable" | "play" | "pause";

export const formatTime = (value: number) => {
  const totalSeconds = Math.max(0, Math.floor(Number.isFinite(value) ? value : 0));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export const formatAccessibleTime = (value: number) => {
  const safeValue = Math.max(0, Number.isFinite(value) ? value : 0);
  const roundedValue = Number(safeValue.toFixed(3));

  if (roundedValue < 1) {
    return `${roundedValue} seconds`;
  }

  const minutes = Math.floor(roundedValue / 60);
  const seconds = Number((roundedValue - minutes * 60).toFixed(3));
  const [wholeSeconds, fractionalSeconds] = `${seconds}`.split(".");
  const secondsLabel = `${wholeSeconds?.padStart(2, "0")}${
    fractionalSeconds ? `.${fractionalSeconds}` : ""
  }`;

  return `${minutes}:${secondsLabel}`;
};

const sanitizeNumber = (value: number) => (Number.isFinite(value) && value > 0 ? value : 0);

const sanitizeOffset = (value: number) => (Number.isFinite(value) && value >= 0 ? value : 0);

const clampPercent = (value: number) => {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(100, Math.max(0, value));
};

export const createPlayerPresenter = ({
  status,
  currentTime,
  duration,
  bufferedRanges,
}: PlayerPresenterInput) => {
  const safeCurrentTime = sanitizeOffset(currentTime);
  const safeDurationValue = sanitizeNumber(duration);
  const safeDuration = safeDurationValue > 0 ? safeDurationValue : 1;
  const isPlaying = status === "playing";
  const canControl =
    status !== "idle" && status !== "loading" && status !== "recovering" && status !== "error";
  const controlMode: PlayerControlMode = !canControl ? "unavailable" : isPlaying ? "pause" : "play";

  return {
    isPlaying,
    controlMode,
    currentTimeLabel: formatTime(safeCurrentTime),
    durationLabel: formatTime(safeDurationValue),
    progressPercent: clampPercent((safeCurrentTime / safeDuration) * 100),
    bufferedSegments: bufferedRanges.map((range) => ({
      leftPercent: clampPercent((sanitizeOffset(range.start) / safeDuration) * 100),
      widthPercent: clampPercent(
        ((sanitizeOffset(range.end) - sanitizeOffset(range.start)) / safeDuration) * 100,
      ),
    })),
  };
};
