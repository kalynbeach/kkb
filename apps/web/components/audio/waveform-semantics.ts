import { formatAccessibleTime } from "@kkb/ui/components/audio/presenter";

type WaveformSemanticTarget = Pick<HTMLDivElement, "removeAttribute" | "setAttribute">;

function syncWaveformSemantics({
  target,
  currentTime,
  duration,
}: {
  target: WaveformSemanticTarget;
  currentTime: number;
  duration: number;
}) {
  if (Number.isFinite(duration) && duration > 0) {
    const safeCurrentTime = Number.isFinite(currentTime)
      ? Math.min(duration, Math.max(0, currentTime))
      : 0;

    target.setAttribute("role", "slider");
    target.setAttribute("tabindex", "0");
    target.setAttribute("aria-label", "Seek");
    target.setAttribute("aria-valuemin", "0");
    target.setAttribute("aria-valuenow", `${safeCurrentTime}`);
    target.setAttribute("aria-valuemax", `${duration}`);
    target.setAttribute(
      "aria-valuetext",
      `${formatAccessibleTime(safeCurrentTime)} of ${formatAccessibleTime(duration)}`,
    );
    return;
  }

  target.setAttribute("role", "img");
  target.setAttribute("aria-label", "Audio waveform unavailable");
  target.removeAttribute("tabindex");
  target.removeAttribute("aria-valuenow");
  target.removeAttribute("aria-valuemin");
  target.removeAttribute("aria-valuemax");
  target.removeAttribute("aria-valuetext");
}

export { syncWaveformSemantics };
