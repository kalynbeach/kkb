"use client";

import { cn } from "@kkb/ui/lib/utils";
import { PlayerControls } from "@kkb/ui/components/audio/player-controls";
import { createPlayerPresenter } from "@kkb/ui/components/audio/presenter";
import { Waveform } from "@kkb/ui/components/audio/waveform";

type BufferedRange = {
  start: number;
  end: number;
};

type PlayerShellProps = {
  title: string;
  subtitle: string;
  status: "idle" | "loading" | "ready" | "playing" | "paused" | "recovering" | "error";
  currentTime: number;
  duration: number;
  bufferedRanges: BufferedRange[];
  sourceId: string | null;
  error: string | null;
  onPlay: () => void;
  onPause: () => void;
  onSeek: (seconds: number) => void;
};

function PlayerShell({
  title,
  subtitle,
  status,
  currentTime,
  duration,
  bufferedRanges,
  sourceId,
  error,
  onPlay,
  onPause,
  onSeek,
}: PlayerShellProps) {
  const presenter = createPlayerPresenter({
    status,
    currentTime,
    duration,
    bufferedRanges,
  });

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col">
      {/* Main chassis — silver/steel body */}
      <div className="rounded-lg border border-[#8890a0] bg-[linear-gradient(180deg,#b8c0d0_0%,#9098a8_8%,#a0a8b8_40%,#8890a0_92%,#707880_100%)] p-1 shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.3)]">
        {/* Title bar — metallic strip */}
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

        {/* LCD display panel — deep navy with blue text */}
        <div className="relative mx-1 mt-1 overflow-hidden rounded border-2 border-[#303850] bg-[linear-gradient(180deg,#0a1028_0%,#0e1630_50%,#0a1028_100%)] p-4 shadow-[inset_0_2px_8px_rgba(0,0,0,0.6),inset_0_-1px_0_rgba(255,255,255,0.02)]">
          {/* Scanline overlay */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-30 opacity-[0.04] [background-image:repeating-linear-gradient(0deg,transparent,transparent_1px,rgba(120,160,255,0.15)_1px,rgba(120,160,255,0.15)_2px)]"
          />

          {/* Time display */}
          <div className="flex items-baseline justify-between">
            <div className="font-mono text-3xl font-bold tracking-wider text-[#78b8ff] drop-shadow-[0_0_10px_rgba(120,184,255,0.5)]">
              {presenter.currentTimeLabel}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[9px] uppercase text-[rgba(120,184,255,0.4)]">kbps</span>
                <span className="font-mono text-xs font-bold text-[rgba(120,184,255,0.6)]">128</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[9px] uppercase text-[rgba(120,184,255,0.4)]">khz</span>
                <span className="font-mono text-xs font-bold text-[rgba(120,184,255,0.6)]">44</span>
              </div>
              <StatusLed status={status} />
            </div>
          </div>

          {/* Track title marquee */}
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

          {/* EQ visualization / seek bar */}
          <div className="mt-2">
            <Waveform
              duration={duration}
              currentTime={currentTime}
              bufferedRanges={bufferedRanges}
              onSeek={onSeek}
            />
          </div>

          {/* Seek progress line + duration */}
          <div className="mt-1.5 flex items-center gap-2">
            <div className="relative h-1 flex-1 overflow-hidden rounded-full bg-[rgba(120,184,255,0.08)]">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-[linear-gradient(90deg,rgba(120,184,255,0.5),rgba(160,200,255,0.7))] shadow-[0_0_4px_rgba(120,184,255,0.3)]"
                style={{ width: `${presenter.progressPercent}%` }}
              />
            </div>
            <span className="font-mono text-[10px] text-[rgba(120,184,255,0.35)]">
              {presenter.durationLabel}
            </span>
          </div>
        </div>

        {/* Transport controls */}
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

        {/* Status bar — metallic footer */}
        <div className="flex items-center justify-between border-t border-[#707890] px-3 py-1.5">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div
                className={cn(
                  "size-1.5 rounded-full",
                  status === "error" && "bg-red-500 shadow-[0_0_4px_rgba(239,68,68,0.6)]",
                  (status === "loading" || status === "recovering") && "bg-amber-400 shadow-[0_0_4px_rgba(251,191,36,0.6)]",
                  status !== "error" && status !== "loading" && status !== "recovering" && "bg-[#60a0ff] shadow-[0_0_4px_rgba(96,160,255,0.6)]",
                )}
              />
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#505870]">
                {status}
              </span>
            </div>
            <span className="font-mono text-[10px] text-[#404860]">|</span>
            <span className="font-mono text-[10px] text-[#505870]">
              buf{" "}
              {presenter.bufferedSegments.length > 0
                ? `${Math.round(presenter.bufferedSegments.at(-1)?.leftPercent ?? 0)}%`
                : "0%"}
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

function StatusLed({
  status,
}: {
  status: PlayerShellProps["status"];
}) {
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
