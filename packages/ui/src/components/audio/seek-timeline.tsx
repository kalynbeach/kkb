"use client";

import {
  SliderControl,
  SliderIndicator,
  SliderRoot,
  SliderThumb,
  SliderTrack,
} from "@kkb/ui/components/slider";
import { cn } from "@kkb/ui/lib/utils";
import { type Ref, useEffect, useState } from "react";

import { Playhead } from "./playhead";
import { type BufferedRange, formatAccessibleTime } from "./presenter";
import { getNextSeekTimeForKey } from "./seek-timeline-navigation";
import { AUDIO_BUFFERED_SEGMENT_CLASS_NAME } from "./theme";

const TIMELINE_TICK_POSITIONS = [0, 12.5, 25, 37.5, 50, 62.5, 75, 87.5, 100] as const;

type SeekTimelineProps = {
  duration: number;
  currentTime: number;
  bufferedRanges?: BufferedRange[];
  className?: string;
  onSeek?: (seconds: number) => void;
  inputRef?: Ref<HTMLInputElement>;
  progressIndicatorRef?: Ref<HTMLDivElement>;
  playheadRef?: Ref<HTMLDivElement>;
  bufferedRangesRef?: Ref<HTMLDivElement>;
};

function SeekTimeline({
  duration,
  currentTime,
  bufferedRanges = [],
  className,
  onSeek,
  inputRef,
  progressIndicatorRef,
  playheadRef,
  bufferedRangesRef,
}: SeekTimelineProps) {
  const safeDuration = Number.isFinite(duration) && duration > 0 ? duration : 0;
  const safeCurrentTime =
    safeDuration > 0 && Number.isFinite(currentTime) && currentTime >= 0
      ? Math.min(currentTime, safeDuration)
      : 0;
  const progressPercent =
    safeDuration > 0 ? Math.min(100, Math.max(0, (safeCurrentTime / safeDuration) * 100)) : 0;
  const isSeekable = onSeek !== undefined && safeDuration > 0;
  const hasLiveBufferedRangesLayer = bufferedRangesRef !== undefined;
  const [interactionTime, setInteractionTime] = useState(safeCurrentTime);

  useEffect(() => {
    setInteractionTime(safeCurrentTime);
  }, [safeCurrentTime]);

  const syncInteractionTime = (root: HTMLDivElement) => {
    const input = root.querySelector<HTMLInputElement>('input[type="range"]');
    const liveTime = input?.valueAsNumber;

    if (liveTime !== undefined && Number.isFinite(liveTime)) {
      setInteractionTime(Math.min(safeDuration, Math.max(0, liveTime)));
    }
  };

  const handleKeyDownCapture = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const InputElement = event.currentTarget.ownerDocument.defaultView?.HTMLInputElement;
    if (!onSeek || !InputElement || !(event.target instanceof InputElement)) {
      return;
    }

    if (event.key === "PageUp" || event.key === "PageDown") {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    const nextTime = getNextSeekTimeForKey({
      key: event.key,
      currentTime: event.target.valueAsNumber,
      duration: Number(event.target.max),
    });

    if (nextTime === null) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    setInteractionTime(nextTime);
    syncTimelineValue(event.currentTarget, event.target, nextTime, Number(event.target.max));
    onSeek(nextTime);
  };

  if (isSeekable) {
    return (
      <SliderRoot
        className={cn("group relative h-14 w-full cursor-pointer", className)}
        data-audio-timeline="true"
        max={safeDuration}
        onFocusCapture={(event) => syncInteractionTime(event.currentTarget)}
        min={0}
        onKeyDownCapture={handleKeyDownCapture}
        onPointerDownCapture={(event) => syncInteractionTime(event.currentTarget)}
        onValueChange={(value) => {
          const nextTime = Array.isArray(value) ? value[0] : value;
          if (typeof nextTime === "number") {
            setInteractionTime(nextTime);
            onSeek(nextTime);
          }
        }}
        step={0.01}
        thumbAlignment="center"
        value={[interactionTime]}
      >
        <SliderControl
          data-slot="seek-timeline-control"
          className="relative flex h-full w-full touch-none items-center select-none"
        >
          <TimelineRuler />
          <SliderTrack className="relative h-2 w-full grow overflow-hidden bg-audio-timeline-idle transition-colors duration-100 group-hover:bg-audio-timeline-idle-hover">
            <BufferedRangesLayer
              bufferedRanges={bufferedRanges}
              bufferedRangesRef={bufferedRangesRef}
              duration={safeDuration}
              live={hasLiveBufferedRangesLayer}
            />
            <SliderIndicator
              ref={progressIndicatorRef}
              data-slot="seek-timeline-progress"
              className="h-full bg-audio-timeline-played shadow-[0_0_8px_var(--audio-accent-glow)]"
            />
          </SliderTrack>
          <SliderThumb
            ref={playheadRef}
            data-slot="seek-timeline-playhead"
            inputRef={inputRef}
            index={0}
            getAriaLabel={() => "Seek timeline"}
            getAriaValueText={(_formattedValue, value) =>
              `${formatAccessibleTime(value)} of ${formatAccessibleTime(safeDuration)}`
            }
            className="block h-14 w-px shrink-0 bg-audio-accent shadow-[0_0_6px_var(--audio-accent-glow),0_0_2px_var(--audio-accent)] ring-audio-accent/50 transition-shadow select-none data-focused:ring-4"
          />
        </SliderControl>
      </SliderRoot>
    );
  }

  return (
    <div
      data-audio-timeline="true"
      role={safeDuration <= 0 ? "img" : "progressbar"}
      aria-valuenow={safeDuration > 0 ? safeCurrentTime : undefined}
      aria-valuemin={safeDuration > 0 ? 0 : undefined}
      aria-valuemax={safeDuration > 0 ? safeDuration : undefined}
      aria-valuetext={
        safeDuration > 0
          ? `${formatAccessibleTime(safeCurrentTime)} of ${formatAccessibleTime(safeDuration)}`
          : undefined
      }
      aria-label={safeDuration <= 0 ? "Audio timeline unavailable" : "Playback timeline"}
      className={cn("relative h-14 w-full", className)}
    >
      <TimelineRuler />

      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 overflow-hidden bg-audio-timeline-idle"
      >
        <BufferedRangesLayer
          bufferedRanges={bufferedRanges}
          bufferedRangesRef={bufferedRangesRef}
          duration={safeDuration}
          live={hasLiveBufferedRangesLayer}
        />

        <div
          ref={progressIndicatorRef}
          aria-hidden="true"
          className="absolute inset-y-0 left-0 bg-audio-timeline-played shadow-[0_0_8px_var(--audio-accent-glow)]"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <Playhead nodeRef={playheadRef} progressPercent={progressPercent} />
    </div>
  );
}

function syncTimelineValue(
  root: HTMLDivElement,
  input: HTMLInputElement,
  currentTime: number,
  duration: number,
) {
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  input.value = `${currentTime}`;
  input.setAttribute("aria-valuenow", `${currentTime}`);
  input.setAttribute(
    "aria-valuetext",
    `${formatAccessibleTime(currentTime)} of ${formatAccessibleTime(duration)}`,
  );

  const progress = root.querySelector<HTMLElement>('[data-slot="seek-timeline-progress"]');
  if (progress) {
    progress.style.width = `${progressPercent}%`;
  }

  const playhead = root.querySelector<HTMLElement>('[data-slot="seek-timeline-playhead"]');
  if (playhead) {
    playhead.style.insetInlineStart = `${progressPercent}%`;
  }
}

function TimelineRuler() {
  return (
    <div
      data-audio-timeline-ruler="true"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
    >
      {TIMELINE_TICK_POSITIONS.map((position) => (
        <span
          key={position}
          className={cn(
            "absolute top-1/2 w-px -translate-x-1/2 -translate-y-1/2 bg-audio-timeline-idle",
            position % 25 === 0 ? "h-5" : "h-3",
          )}
          style={{ left: `${position}%` }}
        />
      ))}
    </div>
  );
}

function BufferedRangesLayer({
  bufferedRanges,
  bufferedRangesRef,
  duration,
  live,
}: {
  bufferedRanges: BufferedRange[];
  bufferedRangesRef?: Ref<HTMLDivElement>;
  duration: number;
  live: boolean;
}) {
  return (
    <div
      ref={bufferedRangesRef}
      data-buffered-layer={live ? "live" : "static"}
      className="absolute inset-0"
    >
      {live
        ? null
        : bufferedRanges.map((range) => {
            const left = duration > 0 ? (range.start / duration) * 100 : 0;
            const width = duration > 0 ? ((range.end - range.start) / duration) * 100 : 0;

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
  );
}

export type { SeekTimelineProps };
export { SeekTimeline };
