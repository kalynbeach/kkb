import { OSCILLOSCOPE_PRESETS } from "@kkb/audio/oscilloscope/presets";
import type { OscilloscopeConfig } from "@kkb/audio/oscilloscope/types";

type OscilloscopeControlsProps = {
  config: OscilloscopeConfig;
  onConfigChange: (config: Partial<OscilloscopeConfig>) => void;
  onPresetChange: (presetId: string) => void;
  onSourceChange: (source: OscilloscopeConfig["source"]["type"]) => void;
  selectedPresetId: string;
};

export function OscilloscopeControls({
  config,
  onConfigChange,
  onPresetChange,
  onSourceChange,
  selectedPresetId,
}: OscilloscopeControlsProps) {
  return (
    <aside className="rounded-3xl border border-emerald-500/20 bg-black/40 p-5 text-emerald-50">
      <div className="space-y-5">
        <div>
          <label
            className="mb-2 block font-mono text-xs uppercase tracking-[0.2em] text-emerald-300/80"
            htmlFor="oscilloscope-preset"
          >
            Preset
          </label>
          <select
            className="w-full rounded-xl border border-emerald-500/20 bg-[#071009] px-3 py-2 text-sm"
            id="oscilloscope-preset"
            onChange={(event) => onPresetChange(event.target.value)}
            value={selectedPresetId}
          >
            {OSCILLOSCOPE_PRESETS.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="mb-2 block font-mono text-xs uppercase tracking-[0.2em] text-emerald-300/80">
            Source
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              className="rounded-xl border border-emerald-500/20 px-3 py-2 text-sm"
              onClick={() => onSourceChange("oscillators")}
              type="button"
            >
              Oscillators
            </button>
            <button
              className="rounded-xl border border-emerald-500/20 px-3 py-2 text-sm"
              onClick={() => onSourceChange("mic")}
              type="button"
            >
              Mic
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm">
            <span className="mb-1 block font-mono text-xs uppercase tracking-[0.18em] text-emerald-300/70">
              A Freq
            </span>
            <input
              className="w-full rounded-xl border border-emerald-500/20 bg-[#071009] px-3 py-2"
              onChange={(event) =>
                onConfigChange({
                  source: {
                    ...config.source,
                    a: { ...config.source.a, frequency: Number(event.target.value) },
                  },
                })
              }
              type="number"
              value={config.source.a.frequency}
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-mono text-xs uppercase tracking-[0.18em] text-emerald-300/70">
              B Freq
            </span>
            <input
              className="w-full rounded-xl border border-emerald-500/20 bg-[#071009] px-3 py-2"
              onChange={(event) =>
                onConfigChange({
                  source: {
                    ...config.source,
                    b: { ...config.source.b, frequency: Number(event.target.value) },
                  },
                })
              }
              type="number"
              value={config.source.b.frequency}
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-mono text-xs uppercase tracking-[0.18em] text-emerald-300/70">
              Trail
            </span>
            <input
              className="w-full"
              max="128"
              min="16"
              onChange={(event) =>
                onConfigChange({
                  phosphor: { ...config.phosphor, trailLength: Number(event.target.value) },
                })
              }
              step="1"
              type="range"
              value={config.phosphor.trailLength}
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-mono text-xs uppercase tracking-[0.18em] text-emerald-300/70">
              Bloom
            </span>
            <input
              className="w-full"
              max="1.5"
              min="0"
              onChange={(event) =>
                onConfigChange({
                  phosphor: { ...config.phosphor, bloom: Number(event.target.value) },
                })
              }
              step="0.05"
              type="range"
              value={config.phosphor.bloom}
            />
          </label>
        </div>
      </div>
    </aside>
  );
}
