import { formatAccessibleTime } from "@kkb/ui/components/audio/presenter";

type SeekTimelineInput = Pick<HTMLInputElement, "setAttribute" | "value">;

function syncSeekTimelineInput({
  target,
  currentTime,
  duration,
}: {
  target: SeekTimelineInput;
  currentTime: number;
  duration: number;
}) {
  if (!Number.isFinite(duration) || duration <= 0) {
    return;
  }

  const safeCurrentTime = Number.isFinite(currentTime)
    ? Math.min(duration, Math.max(0, currentTime))
    : 0;

  target.value = `${safeCurrentTime}`;
  target.setAttribute("aria-valuenow", `${safeCurrentTime}`);
  target.setAttribute(
    "aria-valuetext",
    `${formatAccessibleTime(safeCurrentTime)} of ${formatAccessibleTime(duration)}`,
  );
}

export { syncSeekTimelineInput };
