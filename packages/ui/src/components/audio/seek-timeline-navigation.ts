const SEEK_STEP_SECONDS = 5;

const clampTime = (value: number, duration: number) => Math.min(duration, Math.max(0, value));

const getNextSeekTimeForKey = ({
  key,
  currentTime,
  duration,
}: {
  key: string;
  currentTime: number;
  duration: number;
}) => {
  if (!Number.isFinite(duration) || duration <= 0) {
    return null;
  }

  const safeCurrentTime = Number.isFinite(currentTime) ? currentTime : 0;

  if (key === "ArrowLeft" || key === "ArrowDown") {
    return clampTime(safeCurrentTime - SEEK_STEP_SECONDS, duration);
  }

  if (key === "ArrowRight" || key === "ArrowUp") {
    return clampTime(safeCurrentTime + SEEK_STEP_SECONDS, duration);
  }

  if (key === "Home") {
    return 0;
  }

  if (key === "End") {
    return duration;
  }

  return null;
};

export { getNextSeekTimeForKey };
