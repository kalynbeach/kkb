"use client";

import { OSCILLOSCOPE_PRESETS } from "@kkb/audio/oscilloscope/presets";
import type { OscilloscopeConfig, OscilloscopeConfigUpdate } from "@kkb/audio/oscilloscope/types";
import { Field, FieldContent, FieldGroup, FieldLabel } from "@kkb/ui/components/field";
import { Input } from "@kkb/ui/components/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@kkb/ui/components/select";
import { Slider } from "@kkb/ui/components/slider";
import { ToggleGroup, ToggleGroupItem } from "@kkb/ui/components/toggle-group";

type OscilloscopeControlsProps = {
  config: OscilloscopeConfig;
  onConfigChange: (config: OscilloscopeConfigUpdate) => void;
  onPresetChange: (presetId: string) => void;
  onResetVisual: () => void;
  onSourceChange: (source: OscilloscopeConfig["source"]["type"]) => void;
  selectedPresetId: string;
};

const MIN_FREQUENCY = 1;
const MAX_FREQUENCY = 20_000;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const formatBloomValue = (value: number) => value.toFixed(2);

const parseNumberInput = (value: string) => {
  const nextValue = Number(value);
  return Number.isFinite(nextValue) ? clamp(nextValue, MIN_FREQUENCY, MAX_FREQUENCY) : null;
};

function ControlsSection({
  action,
  children,
  title,
}: {
  action?: React.ReactNode;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex flex-col gap-3.5 px-4 py-3.5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-white/50">{title}</p>
        {action}
      </div>
      {children}
    </div>
  );
}

function ControlLabel({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <FieldLabel className="text-[11px] font-medium text-white/75" htmlFor={htmlFor}>
      {children}
    </FieldLabel>
  );
}

function ControlHint({ children }: { children: React.ReactNode }) {
  return <p className="text-xs leading-5 text-white/55">{children}</p>;
}

export function OscilloscopeControls({
  config,
  onConfigChange,
  onPresetChange,
  onResetVisual,
  onSourceChange,
  selectedPresetId,
}: OscilloscopeControlsProps) {
  return (
    <aside className="flex min-w-0 flex-col divide-y divide-white/[0.06] rounded-xl border border-white/[0.06] xl:sticky xl:top-6">
      <ControlsSection title="Source">
        <FieldGroup className="gap-4">
          <Field>
            <FieldContent>
              <ControlLabel>Input source</ControlLabel>
              <ToggleGroup
                aria-label="Oscilloscope source"
                className="w-full text-sm"
                data-testid="oscilloscope-source-toggle"
                onValueChange={(value) => {
                  if (value === "oscillators" || value === "mic") {
                    onSourceChange(value);
                  }
                }}
                type="single"
                value={config.source.type}
                variant="outline"
              >
                <ToggleGroupItem
                  aria-label="Oscillators"
                  className="flex-1 justify-center"
                  data-testid="oscilloscope-source-oscillators"
                  value="oscillators"
                >
                  Oscillators
                </ToggleGroupItem>
                <ToggleGroupItem
                  aria-label="Mic"
                  className="flex-1 justify-center"
                  data-testid="oscilloscope-source-mic"
                  value="mic"
                >
                  Mic
                </ToggleGroupItem>
              </ToggleGroup>
              <ControlHint>
                {config.source.type === "mic"
                  ? "Routes microphone signal to the display"
                  : "Two internal oscillators mapped to X and Y axes"}
              </ControlHint>
            </FieldContent>
          </Field>
        </FieldGroup>
      </ControlsSection>

      <ControlsSection title="Preset">
        <FieldGroup className="gap-4">
          <Field>
            <FieldContent>
              <ControlLabel htmlFor="oscilloscope-preset">Starting point</ControlLabel>
              <Select onValueChange={onPresetChange} value={selectedPresetId}>
                <SelectTrigger
                  aria-label="Preset"
                  className="w-full text-sm"
                  data-testid="oscilloscope-preset-trigger"
                  id="oscilloscope-preset"
                >
                  <SelectValue placeholder="Select a preset" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {OSCILLOSCOPE_PRESETS.map((preset) => (
                      <SelectItem
                        data-testid={`oscilloscope-preset-${preset.id}`}
                        key={preset.id}
                        value={preset.id}
                      >
                        {preset.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <select
                aria-hidden="true"
                aria-label="Preset fallback"
                autoComplete="off"
                hidden
                name="oscilloscopePreset"
                onChange={(event) => onPresetChange(event.target.value)}
                tabIndex={-1}
                value={selectedPresetId}
              >
                {OSCILLOSCOPE_PRESETS.map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {preset.name}
                  </option>
                ))}
              </select>
              <ControlHint>
                Loads frequency and visual settings. Keeps your current source.
              </ControlHint>
            </FieldContent>
          </Field>
        </FieldGroup>
      </ControlsSection>

      {config.source.type === "oscillators" ? (
        <ControlsSection title="Signal">
          <FieldGroup className="gap-4">
            <Field>
              <FieldContent>
                <ControlLabel htmlFor="oscilloscope-frequency-a">Oscillator A</ControlLabel>
                <Input
                  autoComplete="off"
                  className="font-mono tabular-nums"
                  id="oscilloscope-frequency-a"
                  inputMode="decimal"
                  name="oscillatorAFrequency"
                  max={MAX_FREQUENCY}
                  min={MIN_FREQUENCY}
                  onChange={(event) => {
                    const nextValue = parseNumberInput(event.target.value);
                    if (nextValue !== null) {
                      onConfigChange({
                        source: {
                          ...config.source,
                          a: { ...config.source.a, frequency: nextValue },
                        },
                      });
                    }
                  }}
                  step="any"
                  type="number"
                  value={config.source.a.frequency}
                />
                <ControlHint>Controls the horizontal frequency, in Hz</ControlHint>
              </FieldContent>
            </Field>

            <Field>
              <FieldContent>
                <ControlLabel htmlFor="oscilloscope-frequency-b">Oscillator B</ControlLabel>
                <Input
                  autoComplete="off"
                  className="font-mono tabular-nums"
                  id="oscilloscope-frequency-b"
                  inputMode="decimal"
                  name="oscillatorBFrequency"
                  max={MAX_FREQUENCY}
                  min={MIN_FREQUENCY}
                  onChange={(event) => {
                    const nextValue = parseNumberInput(event.target.value);
                    if (nextValue !== null) {
                      onConfigChange({
                        source: {
                          ...config.source,
                          b: { ...config.source.b, frequency: nextValue },
                        },
                      });
                    }
                  }}
                  step="any"
                  type="number"
                  value={config.source.b.frequency}
                />
                <ControlHint>Controls the vertical frequency, in Hz</ControlHint>
              </FieldContent>
            </Field>
          </FieldGroup>
        </ControlsSection>
      ) : null}

      <ControlsSection
        action={
          <button
            className="text-[11px] text-white/30 transition-colors hover:text-white/60"
            onClick={onResetVisual}
            type="button"
          >
            Reset
          </button>
        }
        title="Visual"
      >
        <FieldGroup className="gap-4">
          <Field>
            <FieldContent>
              <div className="flex items-center justify-between gap-3">
                <ControlLabel>Trail</ControlLabel>
                <span className="font-mono text-[11px] tabular-nums text-white/50">
                  {config.phosphor.trailLength}
                </span>
              </div>
              <Slider
                aria-label="Trail length"
                data-testid="oscilloscope-trail-slider"
                id="oscilloscope-trail"
                max={128}
                min={16}
                onValueChange={([value]) => {
                  if (typeof value === "number") {
                    onConfigChange({
                      phosphor: { ...config.phosphor, trailLength: value },
                    });
                  }
                }}
                step={1}
                value={[config.phosphor.trailLength]}
              />
              <ControlHint>How long the trace lingers on screen</ControlHint>
            </FieldContent>
          </Field>

          <Field>
            <FieldContent>
              <div className="flex items-center justify-between gap-3">
                <ControlLabel>Bloom</ControlLabel>
                <span className="font-mono text-[11px] tabular-nums text-white/50">
                  {formatBloomValue(config.phosphor.bloom)}
                </span>
              </div>
              <Slider
                aria-label="Bloom intensity"
                data-testid="oscilloscope-bloom-slider"
                id="oscilloscope-bloom"
                max={1.5}
                min={0}
                onValueChange={([value]) => {
                  if (typeof value === "number") {
                    onConfigChange({
                      phosphor: { ...config.phosphor, bloom: value },
                    });
                  }
                }}
                step={0.05}
                value={[config.phosphor.bloom]}
              />
              <ControlHint>Intensity of the phosphor glow effect</ControlHint>
            </FieldContent>
          </Field>
        </FieldGroup>
      </ControlsSection>
    </aside>
  );
}
