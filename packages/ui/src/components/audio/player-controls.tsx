"use client"

import { Pause, Play } from "lucide-react";

import { Button } from "@kkb/ui/components/button";
import { cn } from "@kkb/ui/lib/utils";

type PlayerControlsProps = {
  title: string;
  subtitle?: string;
  isPlaying: boolean;
  isPlayDisabled?: boolean;
  isPauseDisabled?: boolean;
  currentTimeLabel: string;
  durationLabel: string;
  className?: string;
  onPlay?: () => void;
  onPause?: () => void;
};

function PlayerControls({
  title,
  subtitle,
  isPlaying,
  isPlayDisabled = false,
  isPauseDisabled = false,
  currentTimeLabel,
  durationLabel,
  className,
  onPlay,
  onPause,
}: PlayerControlsProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5 rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-6 shadow-[0_22px_70px_-36px_rgba(15,23,42,0.38)] dark:border-slate-800 dark:bg-slate-950",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-700 dark:text-sky-400">
            Web Audio Player
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            {title}
          </h2>
          {subtitle ? (
            <p className="text-sm text-slate-600 dark:text-slate-300">{subtitle}</p>
          ) : null}
        </div>
        <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
          {currentTimeLabel} / {durationLabel}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button
          type="button"
          size="icon-lg"
          className="rounded-full bg-slate-950 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
          disabled={isPlayDisabled}
          onClick={onPlay}
        >
          <Play className="size-5 fill-current" />
          <span className="sr-only">Play</span>
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon-lg"
          className="rounded-full border-slate-300 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:hover:bg-slate-900"
          disabled={isPauseDisabled}
          onClick={onPause}
        >
          <Pause className="size-5 fill-current" />
          <span className="sr-only">Pause</span>
        </Button>
        <div className="ml-auto text-sm font-medium text-slate-600 dark:text-slate-300">
          {isPlaying ? "Playing" : "Paused"}
        </div>
      </div>
    </div>
  );
}

export { PlayerControls }
