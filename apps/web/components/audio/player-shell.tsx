"use client";

import { PlayerControls } from "@kkb/ui/components/audio/player-controls";
import { createPlayerPresenter } from "@kkb/ui/components/audio/presenter";
import { Waveform } from "@kkb/ui/components/audio/waveform";
import { cn } from "@kkb/ui/lib/utils";
import { useEffect, useEffectEvent, useRef } from "react";

import type { WebPlayer } from "@/lib/audio/create-web-player";

type PlayerShellProps = {
  player: WebPlayer | null;
  title: string;
  subtitle: string;
  status: "idle" | "loading" | "ready" | "playing" | "paused" | "recovering" | "error";
  duration: number;
  sourceId: string | null;
  error: string | null;
  onPlay: () => void;
  onPause: () => void;
  onSeek: (seconds: number) => void;
  className?: string;
};

const shouldPollPlayerTimeline = (status: PlayerShellProps["status"]) => status === "playing";

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
      segment.className = "absolute inset-y-0 bg-[rgba(120,184,255,0.06)]";
      segment.style.left = `${left}%`;
      segment.style.width = `${width}%`;
      return segment;
    }),
  );
};

function PlayerShell({
  player,
  title,
  subtitle,
  status,
  duration,
  sourceId,
  error,
  onPlay,
  onPause,
  onSeek,
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
  const presenter = createPlayerPresenter({
    status,
    currentTime: initialTimeline.currentTime,
    duration: initialTimeline.duration || duration,
    bufferedRanges: initialBufferedRanges,
  });

  const syncLiveTimeline = useEffectEvent(() => {
    if (!player) {
      return;
    }

    const timeline = player.getTimeline();
    const bufferedRanges = player.getBufferedRanges();
    const effectiveDuration = timeline.duration || duration;
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
      waveformRootRef.current.setAttribute("aria-valuenow", `${Math.round(timeline.currentTime)}`);
      waveformRootRef.current.setAttribute("aria-valuemax", `${Math.round(effectiveDuration)}`);
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
  }, [duration, player, status]);

  return (
    <div className="flex w-full flex-col">
      <div className={cn("rounded-lg border border-[#8890a0] bg-[linear-gradient(180deg,#b8c0d0_0%,#9098a8_8%,#a0a8b8_40%,#8890a0_92%,#707880_100%)] p-1 shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.3)]", className)}>
        <div className="flex items-center justify-between rounded-t border-b border-[#505880] bg-[linear-gradient(90deg,#6870a0,#8088b8,#6870a0)] px-3 py-1.5">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <div className="size-2 rounded-full bg-[#a0c0ff]" />
              <div className="size-2 rounded-full bg-[rgba(160,192,255,0.5)]" />
              <div className="size-2 rounded-full bg-[rgba(160,192,255,0.3)]" />
            </div>
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#d0d8e8]">
              KKB Audio
            </span>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#a0a8c0]">
            {sourceId ?? "—"}
          </span>
        </div>

        <div className="relative mx-1 mt-1 overflow-hidden rounded border-2 border-[#303850] bg-[linear-gradient(180deg,#0a1028_0%,#0e1630_50%,#0a1028_100%)] p-4 shadow-[inset_0_2px_8px_rgba(0,0,0,0.6),inset_0_-1px_0_rgba(255,255,255,0.02)]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-30 opacity-[0.04] [background-image:repeating-linear-gradient(0deg,transparent,transparent_1px,rgba(120,160,255,0.15)_1px,rgba(120,160,255,0.15)_2px)]"
          />

          <div className="flex items-baseline justify-between">
            <div
              ref={timeDisplayRef}
              className="font-mono text-3xl font-bold tracking-wider text-[#78b8ff] drop-shadow-[0_0_10px_rgba(120,184,255,0.5)]"
            >
              {presenter.currentTimeLabel}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[9px] uppercase text-[rgba(120,184,255,0.4)]">
                  kbps
                </span>
                <span className="font-mono text-xs font-bold text-[rgba(120,184,255,0.6)]">
                  128
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[9px] uppercase text-[rgba(120,184,255,0.4)]">
                  khz
                </span>
                <span className="font-mono text-xs font-bold text-[rgba(120,184,255,0.6)]">44</span>
              </div>
              <StatusLed status={status} />
            </div>
          </div>

          <div className="mt-2 h-5 overflow-hidden">
            <p
              className={cn(
                "whitespace-nowrap font-mono text-sm leading-5 tracking-wide text-[rgba(120,184,255,0.75)]",
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
              duration={initialTimeline.duration || duration}
              currentTime={initialTimeline.currentTime}
              bufferedRanges={initialBufferedRanges}
              getTimeline={player?.getTimeline}
              onSeek={onSeek}
            />
          </div>

          <div className="mt-1.5 flex items-center gap-2">
            <div className="relative h-1 flex-1 overflow-hidden rounded-full bg-[rgba(120,184,255,0.08)]">
              <div
                ref={progressFillRef}
                className="absolute inset-y-0 left-0 rounded-full bg-[linear-gradient(90deg,rgba(120,184,255,0.5),rgba(160,200,255,0.7))] shadow-[0_0_4px_rgba(120,184,255,0.3)]"
                style={{ width: `${presenter.progressPercent}%` }}
              />
            </div>
            <span
              ref={durationDisplayRef}
              className="font-mono text-[10px] text-[rgba(120,184,255,0.35)]"
            >
              {presenter.durationLabel}
            </span>
          </div>
        </div>

        <div className="mx-1 mt-1 mb-1">
          <PlayerControls
            title={title}
            isPlaying={presenter.isPlaying}
            isPlayDisabled={presenter.isPlayDisabled}
            isPauseDisabled={presenter.isPauseDisabled}
            currentTimeLabel={presenter.currentTimeLabel}
            durationLabel={presenter.durationLabel}
            onPlay={onPlay}
            onPause={onPause}
          />
        </div>

        <div className="flex items-center justify-between border-t border-[#707890] px-3 py-1.5">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div
                className={cn(
                  "size-1.5 rounded-full",
                  status === "error" && "bg-red-500 shadow-[0_0_4px_rgba(239,68,68,0.6)]",
                  (status === "loading" || status === "recovering") &&
                    "bg-amber-400 shadow-[0_0_4px_rgba(251,191,36,0.6)]",
                  status !== "error" &&
                    status !== "loading" &&
                    status !== "recovering" &&
                    "bg-[#60a0ff] shadow-[0_0_4px_rgba(96,160,255,0.6)]",
                )}
              />
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#505870]">
                {status}
              </span>
            </div>
            <span className="font-mono text-[10px] text-[#404860]">|</span>
            <span ref={bufferedLabelRef} className="font-mono text-[10px] text-[#505870]">
              buf {formatBufferedLabel(presenter.bufferedSegments)}
            </span>
          </div>
          {error ? (
            <span className="max-w-48 truncate font-mono text-[10px] text-red-400/80">{error}</span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function StatusLed({ status }: { status: PlayerShellProps["status"] }) {
  const isActive = status === "playing";
  return (
    <div className="flex items-center gap-1">
      <div
        className={cn(
          "size-1.5 rounded-full transition-colors",
          isActive
            ? "bg-[#78b8ff] shadow-[0_0_6px_rgba(120,184,255,0.6)]"
            : "bg-[rgba(120,184,255,0.2)]",
        )}
      />
      <span className="font-mono text-[9px] uppercase text-[rgba(120,184,255,0.4)]">
        {status === "playing" ? "stereo" : "—"}
      </span>
    </div>
  );
}

export { PlayerShell };
export { shouldPollPlayerTimeline };
