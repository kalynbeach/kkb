import { ComponentCard } from "../component-card";
import {
  AudioCompositionDemo,
  PlayerControlsDemo,
  PlayheadDemo,
  WaveformDemo,
} from "../demos/audio-demo";

export function AudioSection() {
  return (
    <>
      <ComponentCard
        title="Audio bay contract"
        description="Scoped signal UI for waveform, transport, and presenter composition."
        className="md:col-span-2 xl:col-span-3"
      >
        <div className="grid gap-px bg-audio-panel-border text-sm md:grid-cols-3">
          {[
            ["scope", "audio blue stays inside playback and waveform surfaces"],
            ["state", "idle, playing, buffering, and error states need separate feedback"],
            ["composition", "presenter owns app wiring without mutating shared product chrome"],
          ].map(([label, copy]) => (
            <div key={label} className="bg-background p-4">
              <p className="font-mono text-xs text-muted-foreground">{label}</p>
              <p className="mt-2 leading-6">{copy}</p>
            </div>
          ))}
        </div>
      </ComponentCard>

      <ComponentCard
        title="Waveform"
        description="Buffered seek surface with the shared audio styling and interactive progress."
      >
        <WaveformDemo />
      </ComponentCard>

      <ComponentCard
        title="Playhead"
        description="Standalone progress marker for custom rulers, cue lanes, and mini timelines."
      >
        <PlayheadDemo />
      </ComponentCard>

      <ComponentCard
        title="Player Controls"
        description="Transport, rate, and volume controls with local demo state."
      >
        <PlayerControlsDemo />
      </ComponentCard>

      <ComponentCard
        title="Audio Composition"
        description="Real app wiring through PlayerClient and PlayerShell, rendered inside the catalog."
        className="md:col-span-2"
      >
        <AudioCompositionDemo />
      </ComponentCard>
    </>
  );
}
