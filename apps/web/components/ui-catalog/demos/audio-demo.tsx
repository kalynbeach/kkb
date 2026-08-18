"use client";

import { PlayerControls } from "@kkb/ui/components/audio/player-controls";

import { Playhead } from "@kkb/ui/components/audio/playhead";
import { createPlayerPresenter } from "@kkb/ui/components/audio/presenter";
import { SeekTimeline } from "@kkb/ui/components/audio/seek-timeline";
import { Badge } from "@kkb/ui/components/badge";
import { useState } from "react";

import { PlayerClient } from "@/components/audio/player-client";

const demoDurationSeconds = 42;
const demoBufferedRanges = [
  { start: 0, end: 12 },
  { start: 16, end: 30 },
] as const;

const staticPlayheadPercent = 38;

const getBufferedPercentLabel = () =>
  `${Math.round(((demoBufferedRanges[demoBufferedRanges.length - 1]?.end ?? 0) / demoDurationSeconds) * 100)}%`;

type AudioDemoFrameProps = {
  title: string;
  meta: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

function AudioDemoFrame({ title, meta, children, footer }: AudioDemoFrameProps) {
  return (
    <div className="p-4 sm:p-5">
      <div className="audio-shell">
        <div className="audio-titlebar rounded-t">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-audio-title">
            {title}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-wider text-audio-meta">
            {meta}
          </span>
        </div>
        <div className="audio-panel mx-1 mt-1 rounded p-4">
          <div className="space-y-4">{children}</div>
        </div>
        {footer ? (
          <div className="border-t border-audio-shell-border px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-audio-label">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function SeekTimelineDemo() {
  const [currentTime, setCurrentTime] = useState(14);
  const presenter = createPlayerPresenter({
    status: "playing",
    currentTime,
    duration: demoDurationSeconds,
    bufferedRanges: demoBufferedRanges.slice(),
  });

  return (
    <AudioDemoFrame
      title="Seek Surface"
      meta={presenter.currentTimeLabel}
      footer="click timeline or use arrow keys"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-1">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-audio-label">
            buffered
          </p>
          <p className="font-mono text-sm text-audio-accent-muted">{getBufferedPercentLabel()}</p>
        </div>
        <Badge variant="outline" className="border-audio-shell-border text-audio-accent-muted">
          live seek
        </Badge>
      </div>
      <SeekTimeline
        duration={demoDurationSeconds}
        currentTime={currentTime}
        bufferedRanges={demoBufferedRanges.slice()}
        onSeek={setCurrentTime}
      />
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-audio-label">
        <span>{presenter.currentTimeLabel}</span>
        <span>{presenter.durationLabel}</span>
      </div>
    </AudioDemoFrame>
  );
}

export function PlayheadDemo() {
  const presenter = createPlayerPresenter({
    status: "ready",
    currentTime: 16,
    duration: demoDurationSeconds,
    bufferedRanges: [],
  });

  return (
    <AudioDemoFrame
      title="Transport Ruler"
      meta={`${staticPlayheadPercent}%`}
      footer="standalone marker for custom timelines"
    >
      <div className="space-y-3">
        <div className="relative h-16 overflow-hidden rounded-md border border-audio-panel-border bg-[linear-gradient(180deg,var(--audio-panel-start),var(--audio-panel-mid),var(--audio-panel-end))]">
          <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-audio-accent-soft" />
          <div className="absolute inset-x-0 top-3 flex justify-between px-3 font-mono text-[10px] uppercase tracking-wider text-audio-label">
            <span>intro</span>
            <span>drop</span>
            <span>tail</span>
          </div>
          <Playhead progressPercent={staticPlayheadPercent} className="top-2 bottom-2" />
        </div>
        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-audio-label">
          <span>{presenter.currentTimeLabel}</span>
          <span>{presenter.durationLabel}</span>
        </div>
      </div>
    </AudioDemoFrame>
  );
}

export function PlayerControlsDemo() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [rate, setRate] = useState(1);
  const [volume, setVolume] = useState(0.7);
  const presenter = createPlayerPresenter({
    status: isPlaying ? "playing" : "ready",
    currentTime: 12,
    duration: demoDurationSeconds,
    bufferedRanges: demoBufferedRanges.slice(),
  });

  return (
    <AudioDemoFrame
      title="Transport"
      meta={isPlaying ? "playing" : "ready"}
      footer={`${rate}x rate · ${Math.round(volume * 100)} volume`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline" className="border-audio-shell-border text-audio-accent-muted">
          {presenter.currentTimeLabel}
        </Badge>
        <Badge variant="outline" className="border-audio-shell-border text-audio-accent-muted">
          {presenter.durationLabel}
        </Badge>
      </div>
      <PlayerControls
        controlMode={presenter.controlMode}
        rate={rate}
        volume={volume}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onSetRate={setRate}
        onSetVolume={setVolume}
      />
    </AudioDemoFrame>
  );
}

export function AudioCompositionDemo() {
  return (
    <div className="p-4 sm:p-5">
      <PlayerClient />
    </div>
  );
}
