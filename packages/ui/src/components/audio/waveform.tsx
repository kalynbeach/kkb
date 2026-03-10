"use client"

import { cn } from "@kkb/ui/lib/utils";

import { Playhead } from "./playhead";
import type { BufferedRange } from "./presenter";

const DEFAULT_BARS = [0.34, 0.52, 0.28, 0.76, 0.42, 0.61, 0.37, 0.86, 0.44, 0.58, 0.33, 0.72, 0.47, 0.64, 0.29, 0.81, 0.39, 0.69, 0.31, 0.57, 0.35, 0.74, 0.43, 0.62, 0.27, 0.84, 0.41, 0.66, 0.3, 0.55, 0.38, 0.79];

type WaveformProps = {
  duration: number;
  currentTime: number;
  bufferedRanges?: BufferedRange[];
  className?: string;
  onSeek?: (seconds: number) => void;
};

function Waveform({ duration, currentTime, bufferedRanges = [], className, onSeek }: WaveformProps) {
  const progressPercent = duration > 0 ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 0;

  const handleSeek = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!onSeek || duration <= 0) {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - bounds.left) / bounds.width;
    onSeek(Math.min(duration, Math.max(0, ratio * duration)));
  };

  return (
    <button
      type="button"
      onPointerDown={handleSeek}
      className={cn(
        "group relative flex h-28 w-full items-end gap-1 overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-[linear-gradient(180deg,rgba(248,250,252,0.98),rgba(226,232,240,0.94))] px-4 py-5 text-left shadow-[0_24px_80px_-40px_rgba(15,23,42,0.45)] transition-colors hover:border-slate-300/90 dark:border-slate-700 dark:bg-slate-900",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.18),transparent_42%),radial-gradient(circle_at_bottom,rgba(249,115,22,0.14),transparent_38%)] opacity-90" />
      {bufferedRanges.map((range) => {
        const left = duration > 0 ? (range.start / duration) * 100 : 0;
        const width = duration > 0 ? ((range.end - range.start) / duration) * 100 : 0;

        return (
          <div
            key={`${range.start}-${range.end}`}
            aria-hidden="true"
            className="absolute inset-y-0 rounded-[1.5rem] bg-slate-900/8 dark:bg-white/10"
            style={{ left: `${left}%`, width: `${width}%` }}
          />
        );
      })}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 rounded-[1.5rem] bg-[linear-gradient(90deg,rgba(14,165,233,0.18),rgba(249,115,22,0.24))]"
        style={{ width: `${progressPercent}%` }}
      />
      <div className="relative z-10 flex w-full items-end gap-1">
        {DEFAULT_BARS.map((height, index) => (
          <div
            key={index}
            className="min-w-0 flex-1 rounded-full bg-slate-500/55 transition-colors group-hover:bg-slate-600/60 dark:bg-slate-300/55 dark:group-hover:bg-slate-200/70"
            style={{ height: `${Math.round(height * 100)}%` }}
          />
        ))}
      </div>
      <Playhead progressPercent={progressPercent} />
    </button>
  );
}

export { Waveform }
