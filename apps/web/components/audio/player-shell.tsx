"use client";

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
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <div className="grid gap-6 lg:grid-cols-[1.35fr_0.9fr]">
        <div className="flex flex-col gap-4 rounded-[2rem] border border-slate-200/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(226,232,240,0.95))] p-6 shadow-[0_30px_100px_-45px_rgba(15,23,42,0.45)]">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-sky-700">
                KKB Audio Lab
              </p>
              <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
                High-fidelity web playback
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-slate-600">
                Repo-owned controls and waveform components, with runtime selection and fallback
                handled by the audio engine.
              </p>
            </div>
            <div className="rounded-full border border-slate-300/80 bg-white/80 px-3 py-1 text-xs font-medium text-slate-600">
              {sourceId ?? "unloaded"}
            </div>
          </div>
          <Waveform
            duration={duration}
            currentTime={currentTime}
            bufferedRanges={bufferedRanges}
            onSeek={onSeek}
          />
        </div>
        <PlayerControls
          title={title}
          subtitle={subtitle}
          isPlaying={presenter.isPlaying}
          isPlayDisabled={presenter.isPlayDisabled}
          isPauseDisabled={presenter.isPauseDisabled}
          currentTimeLabel={presenter.currentTimeLabel}
          durationLabel={presenter.durationLabel}
          onPlay={onPlay}
          onPause={onPause}
        />
      </div>
      <div className="grid gap-4 rounded-[1.75rem] border border-slate-200/80 bg-white/85 p-5 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.45)] md:grid-cols-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Status</p>
          <p className="mt-2 text-lg font-semibold text-slate-950">{status}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            Buffered
          </p>
          <p className="mt-2 text-lg font-semibold text-slate-950">
            {presenter.bufferedSegments.length > 0
              ? `${Math.round(presenter.bufferedSegments.at(-1)?.leftPercent ?? 0)}%+`
              : "0%"}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Errors</p>
          <p className="mt-2 text-sm font-medium text-slate-700">{error ?? "No active errors"}</p>
        </div>
      </div>
    </div>
  );
}

export { PlayerShell };
