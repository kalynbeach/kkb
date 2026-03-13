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
      className={cn(
        "flex h-7 w-8 items-center justify-center rounded-sm",
        "border border-[#b0b8d0] bg-[linear-gradient(180deg,#d0d8ee_0%,#b0b8d0_40%,#a0a8c0_100%)]",
        "shadow-[0_1px_0_rgba(255,255,255,0.5),inset_0_1px_0_rgba(255,255,255,0.4),0_1px_2px_rgba(0,0,0,0.12)]",
        "transition-shadow duration-75 cursor-pointer",
        "active:bg-[linear-gradient(180deg,#a0a8c0_0%,#b0b8d0_60%,#b8c0d8_100%)] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2),inset_0_0_1px_rgba(0,0,0,0.1)]",
        "disabled:opacity-35 disabled:cursor-default disabled:active:bg-[linear-gradient(180deg,#d0d8ee_0%,#b0b8d0_40%,#a0a8c0_100%)] disabled:active:shadow-[0_1px_0_rgba(255,255,255,0.5),inset_0_1px_0_rgba(255,255,255,0.4),0_1px_2px_rgba(0,0,0,0.12)]",
      )}
    >
      {children}
    </button>
  );
}

function PlayerControls({
  isPlaying,
  isPlayDisabled = false,
  isPauseDisabled = false,
  className,
  onPlay,
  onPause,
}: PlayerControlsProps) {
  return (
    <div className={cn("flex items-center justify-center gap-[3px] py-1.5", className)}>
      <TransportButton disabled label="Previous">
        <SkipBack className="size-[11px] fill-[#7880a0] text-[#7880a0]" />
      </TransportButton>

      <TransportButton
        disabled={isPlayDisabled}
        onClick={onPlay}
        label="Play"
      >
        <Play className="size-3 fill-[#48507a] text-[#48507a]" />
      </TransportButton>

      <TransportButton
        disabled={isPauseDisabled}
        onClick={onPause}
        label="Pause"
      >
        <Pause className="size-3 fill-[#48507a] text-[#48507a]" />
      </TransportButton>

      <TransportButton disabled label="Stop">
        <Square className="size-2.5 fill-[#7880a0] text-[#7880a0]" />
      </TransportButton>

      <TransportButton disabled label="Next">
        <SkipForward className="size-[11px] fill-[#7880a0] text-[#7880a0]" />
      </TransportButton>
    </div>
  );
}

export { PlayerControls };
