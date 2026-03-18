"use client";

import { cn } from "@kkb/ui/lib/utils";
import { Pause, Play, SkipBack, SkipForward, Square } from "lucide-react";

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
  isPlayDisabled = false,
  isPauseDisabled = false,
  className,
  onPlay,
  onPause,
}: PlayerControlsProps) {
  return (
    <div className={cn("flex items-center justify-center gap-[3px] py-1.5", className)}>
      <TransportButton disabled label="Previous">
        <SkipBack className="size-[11px] fill-audio-control-icon-muted text-audio-control-icon-muted" />
      </TransportButton>

      <TransportButton disabled={isPlayDisabled} onClick={onPlay} label="Play">
        <Play className="size-3 fill-audio-control-icon text-audio-control-icon" />
      </TransportButton>

      <TransportButton disabled={isPauseDisabled} onClick={onPause} label="Pause">
        <Pause className="size-3 fill-audio-control-icon text-audio-control-icon" />
      </TransportButton>

      <TransportButton disabled label="Stop">
        <Square className="size-2.5 fill-audio-control-icon-muted text-audio-control-icon-muted" />
      </TransportButton>

      <TransportButton disabled label="Next">
        <SkipForward className="size-[11px] fill-audio-control-icon-muted text-audio-control-icon-muted" />
      </TransportButton>
    </div>
  );
}

export { PlayerControls };
