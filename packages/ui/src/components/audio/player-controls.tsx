"use client";

import { cn } from "@kkb/ui/lib/utils";
import { Pause, Play, SkipBack, SkipForward, Square } from "lucide-react";

import type { PlayerControlMode } from "./presenter";

type PlayerControlsProps = {
  controlMode: PlayerControlMode;
  rate: number;
  volume: number;
  className?: string;
  onPrevious?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  onStop?: () => void;
  onNext?: () => void;
  onSetRate?: (rate: number) => void;
  onSetVolume?: (volume: number) => void;
};

const PLAYBACK_RATE_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 2];

function TransportButton({
  children,
  disabled = false,
  onClick,
  label,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-label={label}
      className="audio-transport-button"
    >
      {children}
    </button>
  );
}

function PlayerControls({
  controlMode,
  rate,
  volume,
  className,
  onPrevious,
  onPlay,
  onPause,
  onStop,
  onNext,
  onSetRate,
  onSetVolume,
}: PlayerControlsProps) {
  const controlsDisabled = controlMode === "unavailable";
  const isPreviousDisabled = controlsDisabled || !onPrevious;
  const isPlayDisabled = controlMode !== "play";
  const isPauseDisabled = controlMode !== "pause";
  const isStopDisabled = controlsDisabled;
  const isNextDisabled = controlsDisabled || !onNext;

  return (
    <div className={cn("flex flex-col gap-2 py-1.5", className)}>
      <div className="flex items-center justify-center gap-[3px]">
        <TransportButton disabled={isPreviousDisabled} onClick={onPrevious} label="Previous">
          <SkipBack className="size-[11px] fill-audio-control-icon-muted text-audio-control-icon-muted" />
        </TransportButton>

        <TransportButton disabled={isPlayDisabled} onClick={onPlay} label="Play">
          <Play className="size-3 fill-audio-control-icon text-audio-control-icon" />
        </TransportButton>

        <TransportButton disabled={isPauseDisabled} onClick={onPause} label="Pause">
          <Pause className="size-3 fill-audio-control-icon text-audio-control-icon" />
        </TransportButton>

        <TransportButton disabled={isStopDisabled} onClick={onStop} label="Stop">
          <Square className="size-2.5 fill-audio-control-icon-muted text-audio-control-icon-muted" />
        </TransportButton>

        <TransportButton disabled={isNextDisabled} onClick={onNext} label="Next">
          <SkipForward className="size-[11px] fill-audio-control-icon-muted text-audio-control-icon-muted" />
        </TransportButton>
      </div>

      <div className="grid grid-cols-2 gap-3 px-2">
        {/* Transport owns play/pause only; rate and volume stay in the shared controls layer. */}
        <label className="flex min-w-0 flex-col gap-1">
          <span className="font-mono text-xs uppercase tracking-wider text-audio-label">Rate</span>
          <select
            aria-label="Rate"
            disabled={controlsDisabled}
            value={rate}
            onChange={(event) => {
              onSetRate?.(Number(event.target.value));
            }}
            className="rounded border border-audio-shell-border bg-transparent px-2 py-1 font-mono text-xs text-audio-control-icon"
          >
            {PLAYBACK_RATE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {`${option}x`}
              </option>
            ))}
          </select>
        </label>

        <label className="flex min-w-0 flex-col gap-1">
          <span className="flex items-center justify-between font-mono text-xs uppercase tracking-wider text-audio-label">
            <span>Volume</span>
            <span>{Math.round(volume * 100)}%</span>
          </span>
          <input
            aria-label="Volume"
            type="range"
            min="0"
            max="100"
            step="5"
            disabled={controlsDisabled}
            value={Math.round(volume * 100)}
            onChange={(event) => {
              onSetVolume?.(Number(event.target.value) / 100);
            }}
            className="w-full accent-[var(--audio-accent)]"
          />
        </label>
      </div>
    </div>
  );
}

export { PlayerControls };
