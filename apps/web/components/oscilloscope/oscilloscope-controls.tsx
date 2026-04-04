"use client";

import { OSCILLOSCOPE_PRESETS } from "@kkb/audio/oscilloscope/presets";
import type { OscilloscopeConfig } from "@kkb/audio/oscilloscope/types";
import { Badge } from "@kkb/ui/components/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@kkb/ui/components/card";
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
  onConfigChange: (config: Partial<OscilloscopeConfig>) => void;
  onPresetChange: (presetId: string) => void;
  onSourceChange: (source: OscilloscopeConfig["source"]["type"]) => void;
  selectedPresetId: string;
};

const formatBloomValue = (value: number) => value.toFixed(2);

const parseNumberInput = (value: string) => {
  const nextValue = Number(value);
  return Number.isFinite(nextValue) ? nextValue : null;
};

function ControlsCard({
  children,
  description,
  title,
}: {
  children: React.ReactNode;
  description?: string;
  title: string;
}) {
  return (
    <Card className="border-white/10 bg-black/20 py-0 backdrop-blur-sm">
      <CardHeader className="gap-1 border-b border-white/10 py-3.5">
        <CardTitle className="font-mono text-xs uppercase tracking-[0.16em] text-white/90">
          {title}
        </CardTitle>
        {description ? (
          <CardDescription className="text-sm text-white/55">{description}</CardDescription>
        ) : null}
      </CardHeader>
      <CardContent className="py-3.5">{children}</CardContent>
    </Card>
  );
}

function ControlLabel({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <FieldLabel
      className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/75"
      htmlFor={htmlFor}
    >
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
  onSourceChange,
  selectedPresetId,
}: OscilloscopeControlsProps) {
  return (
    <aside className="flex min-w-0 flex-col gap-2.5 xl:sticky xl:top-6">
      <ControlsCard title="Source">
        <FieldGroup className="gap-4">
          <Field>
            <FieldContent>
              <ControlLabel>Input source</ControlLabel>
              <ToggleGroup
                aria-label="Oscilloscope source"
                className="w-full font-mono text-xs uppercase tracking-[0.14em]"
                onValueChange={(value) => {
                  if (value === "oscillators" || value === "mic") {
                    onSourceChange(value);
                  }
                }}
                type="single"
                value={config.source.type}
                variant="outline"
              >
                <ToggleGroupItem className="flex-1 justify-center" value="oscillators">
                  Oscillators
                </ToggleGroupItem>
                <ToggleGroupItem className="flex-1 justify-center" value="mic">
                  Mic
                </ToggleGroupItem>
              </ToggleGroup>
              <ControlHint>
                {config.source.type === "mic"
                  ? "Live analyser input."
                  : "Built-in dual oscillator."}
              </ControlHint>
            </FieldContent>
          </Field>
        </FieldGroup>
      </ControlsCard>

      <ControlsCard title="Preset">
        <FieldGroup className="gap-4">
          <Field>
            <FieldContent>
              <ControlLabel htmlFor="oscilloscope-preset">Starting point</ControlLabel>
              <Select onValueChange={onPresetChange} value={selectedPresetId}>
                <SelectTrigger
                  className="w-full font-mono text-xs uppercase tracking-[0.14em]"
                  id="oscilloscope-preset"
                >
                  <SelectValue placeholder="Select a preset" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {OSCILLOSCOPE_PRESETS.map((preset) => (
                      <SelectItem key={preset.id} value={preset.id}>
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
              <ControlHint>Presets keep the active source.</ControlHint>
            </FieldContent>
          </Field>
        </FieldGroup>
      </ControlsCard>

      {config.source.type === "oscillators" ? (
        <ControlsCard title="Signal">
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
                  type="number"
                  value={config.source.a.frequency}
                />
                <ControlHint>X axis, Hz.</ControlHint>
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
                  type="number"
                  value={config.source.b.frequency}
                />
                <ControlHint>Y axis, Hz.</ControlHint>
              </FieldContent>
            </Field>
          </FieldGroup>
        </ControlsCard>
      ) : null}

      <ControlsCard title="Visual">
        <FieldGroup className="gap-4">
          <Field>
            <FieldContent>
              <div className="flex items-center justify-between gap-3">
                <ControlLabel>Trail</ControlLabel>
                <Badge className="font-mono text-[11px] tabular-nums" variant="outline">
                  {config.phosphor.trailLength}
                </Badge>
              </div>
              <Slider
                aria-label="Trail length"
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
              <ControlHint>Persistence.</ControlHint>
            </FieldContent>
          </Field>

          <Field>
            <FieldContent>
              <div className="flex items-center justify-between gap-3">
                <ControlLabel>Bloom</ControlLabel>
                <Badge className="font-mono text-[11px] tabular-nums" variant="outline">
                  {formatBloomValue(config.phosphor.bloom)}
                </Badge>
              </div>
              <Slider
                aria-label="Bloom intensity"
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
              <ControlHint>Glow.</ControlHint>
            </FieldContent>
          </Field>
        </FieldGroup>
      </ControlsCard>
    </aside>
  );
}
