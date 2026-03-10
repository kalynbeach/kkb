"use client";

import { cn } from "@kkb/ui/lib/utils";

import { Playhead } from "./playhead";
import type { BufferedRange } from "./presenter";

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
};

function Waveform({
  duration,
  currentTime,
  bufferedRanges = [],
  className,
  onSeek,
}: WaveformProps) {
  const progressPercent =
    duration > 0 ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 0;

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
        {DEFAULT_BARS.map((bar) => (
          <div
            key={bar.id}
            className="min-w-0 flex-1 rounded-full bg-slate-500/55 transition-colors group-hover:bg-slate-600/60 dark:bg-slate-300/55 dark:group-hover:bg-slate-200/70"
            style={{ height: `${Math.round(bar.height * 100)}%` }}
          />
        ))}
      </div>
      <Playhead progressPercent={progressPercent} />
    </button>
  );
}

export { Waveform };
