import { ComponentCard } from "../component-card";
import {
  AudioCompositionDemo,
  PlayerControlsDemo,
  PlayheadDemo,
  WaveformDemo,
} from "../demos/audio-demo";

export const audioSectionItemCount = 4;

export function AudioSection() {
  return (
    <>
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
