"use client";

import { cn } from "@kkb/ui/lib/utils";
import type { Ref } from "react";

import { Playhead } from "./playhead";
import { type BufferedRange, formatAccessibleTime } from "./presenter";
import { AUDIO_BUFFERED_SEGMENT_CLASS_NAME } from "./theme";
import { clampTime, getNextSeekTimeForKey } from "./waveform-seek";

const DEFAULT_BARS = [
  { id: "bar-01", height: 0.34 },
  { id: "bar-02", height: 0.52 },
  { id: "bar-03", height: 0.28 },
  { id: "bar-04", height: 0.76 },
  { id: "bar-05", height: 0.42 },
  { id: "bar-06", height: 0.61 },
  { id: "bar-07", height: 0.37 },
  { id: "bar-08", height: 0.86 },
  { id: "bar-09", height: 0.44 },
  { id: "bar-10", height: 0.58 },
  { id: "bar-11", height: 0.33 },
  { id: "bar-12", height: 0.72 },
  { id: "bar-13", height: 0.47 },
  { id: "bar-14", height: 0.64 },
  { id: "bar-15", height: 0.29 },
  { id: "bar-16", height: 0.81 },
  { id: "bar-17", height: 0.39 },
  { id: "bar-18", height: 0.69 },
  { id: "bar-19", height: 0.31 },
  { id: "bar-20", height: 0.57 },
  { id: "bar-21", height: 0.35 },
  { id: "bar-22", height: 0.74 },
  { id: "bar-23", height: 0.43 },
  { id: "bar-24", height: 0.62 },
  { id: "bar-25", height: 0.27 },
  { id: "bar-26", height: 0.84 },
  { id: "bar-27", height: 0.41 },
  { id: "bar-28", height: 0.66 },
  { id: "bar-29", height: 0.3 },
  { id: "bar-30", height: 0.55 },
  { id: "bar-31", height: 0.38 },
  { id: "bar-32", height: 0.79 },
];

type WaveformProps = {
  duration: number;
  currentTime: number;
  bufferedRanges?: BufferedRange[];
  className?: string;
  onSeek?: (seconds: number) => void;
  rootRef?: Ref<HTMLDivElement>;
  progressOverlayRef?: Ref<HTMLDivElement>;
  playheadRef?: Ref<HTMLDivElement>;
  bufferedRangesRef?: Ref<HTMLDivElement>;
};

const getTimelineValue = (target: HTMLDivElement, attribute: string) => {
  const value = Number(target.getAttribute(attribute));
  return Number.isFinite(value) ? value : 0;
};

function Waveform({
  duration,
  currentTime,
  bufferedRanges = [],
  className,
  onSeek,
  rootRef,
  progressOverlayRef,
  playheadRef,
  bufferedRangesRef,
}: WaveformProps) {
  const safeDuration = Number.isFinite(duration) && duration > 0 ? duration : 0;
  const safeCurrentTime =
    safeDuration > 0 && Number.isFinite(currentTime) && currentTime >= 0
      ? Math.min(currentTime, safeDuration)
      : 0;
  const progressPercent =
    safeDuration > 0 ? Math.min(100, Math.max(0, (safeCurrentTime / safeDuration) * 100)) : 0;
  const isSeekable = onSeek !== undefined && safeDuration > 0;
  const hasLiveBufferedRangesLayer = bufferedRangesRef !== undefined;

  const handleSeek = (event: React.PointerEvent<HTMLDivElement>) => {
    const timelineDuration = getTimelineValue(event.currentTarget, "aria-valuemax");
    if (!onSeek || timelineDuration <= 0) {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - bounds.left) / bounds.width;
    onSeek(clampTime(ratio * timelineDuration, timelineDuration));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!onSeek) {
      return;
    }

    const nextTime = getNextSeekTimeForKey({
      key: event.key,
      currentTime: getTimelineValue(event.currentTarget, "aria-valuenow"),
      duration: getTimelineValue(event.currentTarget, "aria-valuemax"),
    });

    if (nextTime === null) {
      return;
    }

    event.preventDefault();
    onSeek(nextTime);
  };

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: live duration updates can promote this initially static waveform to an operable slider.
    <div
      ref={rootRef}
      role={safeDuration <= 0 ? "img" : isSeekable ? "slider" : "progressbar"}
      tabIndex={isSeekable ? 0 : undefined}
      aria-valuenow={safeDuration > 0 ? safeCurrentTime : undefined}
      aria-valuemin={safeDuration > 0 ? 0 : undefined}
      aria-valuemax={safeDuration > 0 ? safeDuration : undefined}
      aria-valuetext={
        safeDuration > 0
          ? `${formatAccessibleTime(safeCurrentTime)} of ${formatAccessibleTime(safeDuration)}`
          : undefined
      }
      aria-label={
        safeDuration <= 0 ? "Audio waveform unavailable" : isSeekable ? "Seek" : "Playback progress"
      }
      onPointerDown={onSeek ? handleSeek : undefined}
      onKeyDown={onSeek ? handleKeyDown : undefined}
      className={cn("relative h-14 w-full", isSeekable && "group cursor-pointer", className)}
    >
      <div
        ref={bufferedRangesRef}
        data-buffered-layer={hasLiveBufferedRangesLayer ? "live" : "static"}
        className="absolute inset-0"
      >
        {hasLiveBufferedRangesLayer
          ? null
          : bufferedRanges.map((range) => {
              const left = safeDuration > 0 ? (range.start / safeDuration) * 100 : 0;
              const width = safeDuration > 0 ? ((range.end - range.start) / safeDuration) * 100 : 0;

              return (
                <div
                  key={`${range.start}-${range.end}`}
                  aria-hidden="true"
                  className={AUDIO_BUFFERED_SEGMENT_CLASS_NAME}
                  style={{ left: `${left}%`, width: `${width}%` }}
                />
              );
            })}
      </div>

      <div
        ref={progressOverlayRef}
        aria-hidden="true"
        className="absolute inset-y-0 left-0 bg-[linear-gradient(90deg,var(--audio-buffered),var(--audio-waveform-progress-end))]"
        style={{ width: `${progressPercent}%` }}
      />

      <div className="absolute inset-0 flex items-end gap-[3px] px-1 py-0.5">
        {DEFAULT_BARS.map((bar, index) => {
          const barPosition = (index / DEFAULT_BARS.length) * 100;
          const isPlayed = barPosition < progressPercent;

          return (
            <div
              key={bar.id}
              className={cn(
                "flex-1 rounded-[2px] transition-colors duration-100",
                isPlayed
                  ? "bg-audio-waveform-played shadow-[0_0_8px_var(--audio-accent-glow)]"
                  : "bg-audio-waveform-idle group-hover:bg-audio-waveform-idle-hover",
              )}
              style={{ height: `${Math.max(12, Math.round(bar.height * 100))}%` }}
            />
          );
        })}
      </div>

      <Playhead nodeRef={playheadRef} progressPercent={progressPercent} />
    </div>
  );
}

export { Waveform };
