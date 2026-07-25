"use client";

import { PlayerControls } from "@kkb/ui/components/audio/player-controls";
import { createPlayerPresenter } from "@kkb/ui/components/audio/presenter";
import {
  AUDIO_BUFFERED_SEGMENT_CLASS_NAME,
  AUDIO_SCANLINES_CLASS_NAME,
} from "@kkb/ui/components/audio/theme";
import { Waveform } from "@kkb/ui/components/audio/waveform";
import { cn } from "@kkb/ui/lib/utils";
import { useEffect, useEffectEvent, useRef } from "react";

import type { WebPlayer } from "@/lib/audio/create-web-player";

import { shouldPollPlayerTimeline } from "./player-timeline";
import { syncWaveformSemantics } from "./waveform-semantics";

type PlayerShellProps = {
  player: WebPlayer | null;
  title: string;
  subtitle: string;
  status: "idle" | "loading" | "ready" | "playing" | "paused" | "recovering" | "error";
  duration: number;
  sourceId: string | null;
  error: string | null;
  rate: number;
  volume: number;
  canSelectPrevious?: boolean;
  canSelectNext?: boolean;
  onPrevious?: () => void;
  onPlay: () => void;
  onPause: () => void;
  onStop?: () => void;
  onNext?: () => void;
  onSeek: (seconds: number) => void;
  onSetRate: (rate: number) => void;
  onSetVolume: (volume: number) => void;
  className?: string;
};

const formatBufferedLabel = (
  bufferedSegments: ReturnType<typeof createPlayerPresenter>["bufferedSegments"],
) => `${Math.round(getBufferedExtentPercent(bufferedSegments))}%`;

const getBufferedExtentPercent = (
  bufferedSegments: ReturnType<typeof createPlayerPresenter>["bufferedSegments"],
) => {
  if (bufferedSegments.length === 0) {
    return 0;
  }

  return Math.min(
    100,
    bufferedSegments.reduce(
      (maxBufferedPercent, segment) =>
        Math.max(maxBufferedPercent, segment.leftPercent + segment.widthPercent),
      0,
    ),
  );
};

const syncBufferedRanges = (
  container: HTMLDivElement | null,
  duration: number,
  bufferedRanges: ReturnType<WebPlayer["getBufferedRanges"]>,
) => {
  if (!container) {
    return;
  }

  const signature = `${duration}:${bufferedRanges.map((range) => `${range.start}-${range.end}`).join("|")}`;
  if (container.dataset.signature === signature) {
    return;
  }

  container.dataset.signature = signature;
  container.replaceChildren(
    ...bufferedRanges.map((range) => {
      const left = duration > 0 ? (range.start / duration) * 100 : 0;
      const width = duration > 0 ? ((range.end - range.start) / duration) * 100 : 0;
      const segment = document.createElement("div");
      segment.setAttribute("aria-hidden", "true");
      segment.className = AUDIO_BUFFERED_SEGMENT_CLASS_NAME;
      segment.style.left = `${left}%`;
      segment.style.width = `${width}%`;
      return segment;
    }),
  );
};

const resolveDuration = (duration: number, fallbackDuration: number) =>
  Number.isFinite(duration) && duration > 0 ? duration : fallbackDuration;

function PlayerShell({
  player,
  title,
  subtitle,
  status,
  duration,
  sourceId,
  error,
  rate,
  volume,
  canSelectPrevious = false,
  canSelectNext = false,
  onPrevious,
  onPlay,
  onPause,
  onStop,
  onNext,
  onSeek,
  onSetRate,
  onSetVolume,
  className,
}: PlayerShellProps) {
  const timeDisplayRef = useRef<HTMLDivElement>(null);
  const durationDisplayRef = useRef<HTMLSpanElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const bufferedLabelRef = useRef<HTMLSpanElement>(null);
  const waveformRootRef = useRef<HTMLDivElement>(null);
  const waveformProgressRef = useRef<HTMLDivElement>(null);
  const waveformPlayheadRef = useRef<HTMLDivElement>(null);
  const waveformBufferedRangesRef = useRef<HTMLDivElement>(null);
  const initialTimeline = player?.getTimeline() ?? { currentTime: 0, duration };
  const initialBufferedRanges = player?.getBufferedRanges() ?? [];
  const initialDuration = resolveDuration(initialTimeline.duration, duration);
  const presenter = createPlayerPresenter({
    status,
    currentTime: initialTimeline.currentTime,
    duration: initialDuration,
    bufferedRanges: initialBufferedRanges,
  });

  const syncLiveTimeline = useEffectEvent(() => {
    if (!player) {
      return;
    }

    const timeline = player.getTimeline();
    const bufferedRanges = player.getBufferedRanges();
    const effectiveDuration = resolveDuration(timeline.duration, duration);
    const nextPresenter = createPlayerPresenter({
      status,
      currentTime: timeline.currentTime,
      duration: effectiveDuration,
      bufferedRanges,
    });

    if (timeDisplayRef.current) {
      timeDisplayRef.current.textContent = nextPresenter.currentTimeLabel;
    }

    if (durationDisplayRef.current) {
      durationDisplayRef.current.textContent = nextPresenter.durationLabel;
    }

    if (progressFillRef.current) {
      progressFillRef.current.style.width = `${nextPresenter.progressPercent}%`;
    }

    if (bufferedLabelRef.current) {
      bufferedLabelRef.current.textContent = `buf ${formatBufferedLabel(nextPresenter.bufferedSegments)}`;
    }

    if (waveformRootRef.current) {
      syncWaveformSemantics({
        target: waveformRootRef.current,
        currentTime: timeline.currentTime,
        duration: effectiveDuration,
      });
    }

    if (waveformProgressRef.current) {
      waveformProgressRef.current.style.width = `${nextPresenter.progressPercent}%`;
    }

    if (waveformPlayheadRef.current) {
      waveformPlayheadRef.current.style.left = `${nextPresenter.progressPercent}%`;
    }

    syncBufferedRanges(waveformBufferedRangesRef.current, effectiveDuration, bufferedRanges);
  });

  useEffect(() => {
    if (!player) {
      return;
    }

    // React owns coarse state; live timeline and buffered ranges stay on the imperative path.
    syncLiveTimeline();

    if (!shouldPollPlayerTimeline(status)) {
      return;
    }

    let frame = 0;

    const update = () => {
      syncLiveTimeline();
      frame = requestAnimationFrame(update);
    };

    update();

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [player, status]);

  return (
    <div className="flex w-full flex-col">
      <div className={cn("audio-shell", className)}>
        <div className="audio-titlebar rounded-t">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <div className="size-2 rounded-full bg-audio-window-dot" />
              <div className="size-2 rounded-full bg-audio-window-dot-muted" />
              <div className="size-2 rounded-full bg-audio-window-dot-faint" />
            </div>
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-audio-title">
              KKB Audio
            </span>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-audio-meta">
            {sourceId ?? "—"}
          </span>
        </div>

        <div className="audio-panel mx-1 mt-1 rounded p-4">
          <div
            aria-hidden="true"
            className={cn(AUDIO_SCANLINES_CLASS_NAME, "z-30 opacity-[0.04]")}
          />

          <div className="flex items-baseline justify-between">
            <div
              ref={timeDisplayRef}
              className="font-mono text-3xl font-bold tracking-wider text-audio-accent drop-shadow-[0_0_10px_var(--audio-accent-glow)]"
            >
              {presenter.currentTimeLabel}
            </div>
            <div className="flex items-center">
              <StatusLed status={status} />
            </div>
          </div>

          <div className="mt-2 h-5 overflow-hidden">
            <p
              className={cn(
                "whitespace-nowrap font-mono text-sm leading-5 tracking-wide text-audio-accent-muted",
                presenter.isPlaying ? "animate-marquee" : "truncate",
              )}
            >
              {title}
              {subtitle ? ` — ${subtitle}` : ""}
            </p>
          </div>

          <div className="mt-2">
            <Waveform
              rootRef={waveformRootRef}
              progressOverlayRef={waveformProgressRef}
              playheadRef={waveformPlayheadRef}
              bufferedRangesRef={waveformBufferedRangesRef}
              duration={initialDuration}
              currentTime={initialTimeline.currentTime}
              bufferedRanges={initialBufferedRanges}
              onSeek={onSeek}
            />
          </div>

          <div className="mt-1.5 flex items-center gap-2">
            <div className="relative h-1 flex-1 overflow-hidden rounded-full bg-audio-accent-softer">
              <div
                ref={progressFillRef}
                className="absolute inset-y-0 left-0 rounded-full bg-[linear-gradient(90deg,var(--audio-accent-soft),var(--audio-progress-end))] shadow-[0_0_4px_var(--audio-accent-dim)]"
                style={{ width: `${presenter.progressPercent}%` }}
              />
            </div>
            <span ref={durationDisplayRef} className="font-mono text-xs text-audio-accent-muted">
              {presenter.durationLabel}
            </span>
          </div>
        </div>

        <div className="mx-1 mt-1 mb-1">
          <PlayerControls
            controlMode={presenter.controlMode}
            rate={rate}
            volume={volume}
            onPrevious={canSelectPrevious ? onPrevious : undefined}
            onPlay={onPlay}
            onPause={onPause}
            onStop={onStop}
            onNext={canSelectNext ? onNext : undefined}
            onSetRate={onSetRate}
            onSetVolume={onSetVolume}
          />
        </div>

        <div className="flex items-start justify-between gap-3 border-t border-audio-shell-border px-3 py-1.5">
          <div className="flex min-w-0 items-center gap-3">
            <div
              role="status"
              aria-live="polite"
              aria-atomic="true"
              className="flex items-center gap-1.5"
            >
              <div
                aria-hidden="true"
                className={cn(
                  "size-1.5 rounded-full",
                  status === "error" &&
                    "bg-audio-status-error shadow-[0_0_4px_var(--audio-status-error-glow)]",
                  (status === "loading" || status === "recovering") &&
                    "bg-audio-status-warning shadow-[0_0_4px_var(--audio-status-warning-glow)]",
                  status !== "error" &&
                    status !== "loading" &&
                    status !== "recovering" &&
                    "bg-audio-status-info shadow-[0_0_4px_var(--audio-status-info-glow)]",
                )}
              />
              <span className="font-mono text-xs uppercase tracking-wider text-audio-label">
                {status}
              </span>
            </div>
            <span aria-hidden="true" className="font-mono text-xs text-audio-divider">
              |
            </span>
            <span ref={bufferedLabelRef} className="font-mono text-xs text-audio-label">
              buf {formatBufferedLabel(presenter.bufferedSegments)}
            </span>
          </div>
          {error ? (
            <p
              role="alert"
              className="max-w-64 break-words text-right font-mono text-xs leading-4 text-audio-error-text"
            >
              {error}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function StatusLed({ status }: { status: PlayerShellProps["status"] }) {
  const isActive = status === "playing";
  return (
    <div className="flex items-center">
      <div
        className={cn(
          "size-1.5 rounded-full transition-colors",
          isActive
            ? "bg-audio-accent shadow-[0_0_6px_var(--audio-accent-glow)]"
            : "bg-audio-accent-soft",
        )}
      />
    </div>
  );
}

export { PlayerShell };
