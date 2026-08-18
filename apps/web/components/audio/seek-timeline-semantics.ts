import { formatAccessibleTime } from "@kkb/ui/components/audio/presenter";

type SeekTimelineInput = Pick<
  HTMLInputElement,
  "disabled" | "max" | "min" | "setAttribute" | "value"
>;

function syncSeekTimelineInput({
  target,
  currentTime,
  duration,
}: {
  target: SeekTimelineInput;
  currentTime: number;
  duration: number;
}) {
  if (Number.isFinite(duration) && duration > 0) {
    const safeCurrentTime = Number.isFinite(currentTime)
      ? Math.min(duration, Math.max(0, currentTime))
      : 0;

    target.disabled = false;
    target.min = "0";
    target.max = `${duration}`;
    target.value = `${safeCurrentTime}`;
    target.setAttribute("aria-label", "Seek timeline");
    target.setAttribute("aria-valuenow", `${safeCurrentTime}`);
    target.setAttribute(
      "aria-valuetext",
      `${formatAccessibleTime(safeCurrentTime)} of ${formatAccessibleTime(duration)}`,
    );
    return;
  }

  target.disabled = true;
  target.min = "0";
  target.max = "1";
  target.value = "0";
  target.setAttribute("aria-label", "Audio timeline unavailable");
  target.setAttribute("aria-valuenow", "0");
  target.setAttribute("aria-valuetext", "Audio timeline unavailable");
}

export { syncSeekTimelineInput };
