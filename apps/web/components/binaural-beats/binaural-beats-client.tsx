"use client";

import { Button } from "@kkb/ui/components/button";
import { Field, FieldContent, FieldGroup, FieldLabel } from "@kkb/ui/components/field";
import { Input } from "@kkb/ui/components/input";
import { Slider } from "@kkb/ui/components/slider";
import { cn } from "@kkb/ui/lib/utils";
import { Pause, Play } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
  BINAURAL_BEAT_LIMITS,
  type BinauralBeatConfig,
  DEFAULT_BINAURAL_BEAT_CONFIG,
  getBinauralBeatFrequencies,
  sanitizeBinauralBeatConfig,
} from "@/lib/binaural-beats/binaural-beat-config";
import {
  applyBinauralBeatPreset,
  BINAURAL_BEAT_PRESETS,
  type BinauralBeatPresetId,
  findBinauralBeatPreset,
  getBinauralBeatPresetFromHash,
  getHashWithBinauralBeatPreset,
  getHashWithoutBinauralBeatPreset,
} from "@/lib/binaural-beats/binaural-beat-presets";
import {
  type BinauralBeatEngine,
  createBinauralBeatEngine,
} from "@/lib/binaural-beats/create-binaural-beat-engine";

type NumericConfigKey = keyof BinauralBeatConfig;

type NumberControlProps = {
  configKey: NumericConfigKey;
  description: string;
  label: string;
  max: number;
  min: number;
  onChange: (key: NumericConfigKey, value: number) => void;
  step: number;
  suffix: string;
  value: number;
};

const SAFETY_NOTES = [
  "Use headphones for binaural mode.",
  "This is an experimental audio tool, not medical treatment.",
  "Start at low volume.",
  "Stop if you feel discomfort, dizziness, headache, anxiety, nausea, or unusual symptoms.",
  "Do not use while driving or operating machinery.",
  "Mono or speaker output may not work as intended.",
];

const formatNumber = (value: number) => Number(value.toFixed(2)).toString();

function NumberControl({
  configKey,
  description,
  label,
  max,
  min,
  onChange,
  step,
  suffix,
  value,
}: NumberControlProps) {
  const inputId = `binaural-${configKey}`;

  return (
    <Field>
      <FieldContent className="gap-2">
        <div className="flex items-center justify-between gap-3">
          <FieldLabel className="text-xs text-foreground/75" htmlFor={inputId}>
            {label}
          </FieldLabel>
          <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
            {formatNumber(value)} {suffix}
          </span>
        </div>
        <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_5.5rem]">
          <Slider
            aria-label={label}
            data-testid={`binaural-${configKey}-slider`}
            max={max}
            min={min}
            onValueChange={([nextValue]) => {
              if (typeof nextValue === "number") {
                onChange(configKey, nextValue);
              }
            }}
            step={step}
            value={[value]}
          />
          <Input
            autoComplete="off"
            className="h-8 font-mono text-sm tabular-nums text-foreground"
            id={inputId}
            inputMode="decimal"
            max={max}
            min={min}
            onChange={(event) => {
              const nextValue = Number(event.target.value);
              if (Number.isFinite(nextValue)) {
                onChange(configKey, nextValue);
              }
            }}
            step={step}
            type="number"
            value={value}
          />
        </div>
        <p className="text-xs leading-5 text-muted-foreground/80">{description}</p>
      </FieldContent>
    </Field>
  );
}

export function BinauralBeatsClient() {
  const [config, setConfig] = useState<BinauralBeatConfig>(DEFAULT_BINAURAL_BEAT_CONFIG);
  const [engine, setEngine] = useState<BinauralBeatEngine | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const [selectedPresetId, setSelectedPresetId] = useState<BinauralBeatPresetId | null>(null);
  const [error, setError] = useState<string | null>(null);
  const frequencies = getBinauralBeatFrequencies(config);
  const playbackStatus = isStarting
    ? "Audio is starting."
    : isStopping
      ? "Audio is stopping."
      : isPlaying
        ? `Audio is playing. Left channel ${formatNumber(frequencies.leftFrequencyHz)} Hz. Right channel ${formatNumber(frequencies.rightFrequencyHz)} Hz.`
        : "Audio is stopped.";

  useEffect(() => {
    const nextEngine = createBinauralBeatEngine();
    setEngine(nextEngine);

    return () => {
      nextEngine.destroy();
    };
  }, []);

  useEffect(() => {
    const preset = getBinauralBeatPresetFromHash(window.location.hash);

    if (!preset) {
      return;
    }

    setSelectedPresetId(preset.id);
    setConfig((currentConfig) => applyBinauralBeatPreset(currentConfig, preset));
  }, []);

  useEffect(() => {
    if (isPlaying) {
      engine?.update(config);
    }
  }, [config, engine, isPlaying]);

  const controls = useMemo(
    () => [
      {
        configKey: "carrierFrequencyHz" as const,
        description: "Base tone sent to the left channel.",
        label: "Carrier",
        step: 1,
        suffix: "Hz",
        ...BINAURAL_BEAT_LIMITS.carrierFrequencyHz,
      },
      {
        configKey: "beatFrequencyHz" as const,
        description: "Difference added to the right channel.",
        label: "Beat",
        step: 0.5,
        suffix: "Hz",
        ...BINAURAL_BEAT_LIMITS.beatFrequencyHz,
      },
      {
        configKey: "volume" as const,
        description: "Capped conservatively for generated tones.",
        label: "Volume",
        step: 0.01,
        suffix: "",
        ...BINAURAL_BEAT_LIMITS.volume,
      },
      {
        configKey: "fadeSeconds" as const,
        description: "Smooths starts, stops, and major changes.",
        label: "Fade",
        step: 0.1,
        suffix: "s",
        ...BINAURAL_BEAT_LIMITS.fadeSeconds,
      },
    ],
    [],
  );

  const updateConfig = (key: NumericConfigKey, value: number) => {
    if (key === "carrierFrequencyHz" || key === "beatFrequencyHz") {
      setSelectedPresetId(null);
      window.history.replaceState(null, "", getHashWithoutBinauralBeatPreset(window.location.hash));
    }

    setConfig((currentConfig) =>
      sanitizeBinauralBeatConfig({
        ...currentConfig,
        [key]: value,
      }),
    );
  };

  const selectPreset = (presetId: BinauralBeatPresetId) => {
    const preset = findBinauralBeatPreset(presetId);

    if (!preset) {
      return;
    }

    setSelectedPresetId(preset.id);
    setConfig((currentConfig) => applyBinauralBeatPreset(currentConfig, preset));
    window.history.replaceState(
      null,
      "",
      getHashWithBinauralBeatPreset(window.location.hash, preset.id),
    );
  };

  const togglePlayback = async () => {
    if (!engine) {
      return;
    }

    setError(null);

    try {
      if (isPlaying) {
        setIsStopping(true);
        setIsStarting(false);
        setIsPlaying(false);
        await engine.stop();
        setIsStopping(false);
        return;
      }

      setIsStarting(true);
      await engine.play(config);
      setIsPlaying(true);
      setIsStarting(false);
    } catch (nextError) {
      setIsPlaying(false);
      setIsStarting(false);
      setIsStopping(false);
      setError(nextError instanceof Error ? nextError.message : "Unable to start audio.");
    }
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
      <section className="min-w-0 rounded-xl border border-border bg-card/60 p-5">
        <div className="flex min-h-[24rem] flex-col justify-between gap-8">
          <div className="grid gap-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground/70">
              Stereo tone session
            </p>
            <div className="grid gap-2">
              <div className="flex flex-wrap items-end gap-x-5 gap-y-2">
                <h2 className="text-5xl font-semibold tracking-tight text-foreground sm:text-7xl">
                  {formatNumber(config.beatFrequencyHz)}
                </h2>
                <span className="pb-2 font-mono text-sm uppercase tracking-[0.16em] text-muted-foreground">
                  Hz beat
                </span>
              </div>
              <p className="max-w-xl text-sm leading-6 text-muted-foreground">
                Left channel {formatNumber(frequencies.leftFrequencyHz)} Hz. Right channel{" "}
                {formatNumber(frequencies.rightFrequencyHz)} Hz.
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            <div
              aria-hidden="true"
              className={cn(
                "grid h-32 grid-cols-2 overflow-hidden rounded-lg border border-border",
                "bg-[linear-gradient(135deg,var(--card),var(--muted))]",
              )}
            >
              <div className="flex items-center justify-center border-border border-r">
                <div className="h-12 w-12 rounded-full border border-chart-1/30 bg-chart-1/10 shadow-[0_0_36px] shadow-chart-1/25" />
              </div>
              <div className="flex items-center justify-center">
                <div className="h-12 w-12 rounded-full border border-chart-5/30 bg-chart-5/10 shadow-[0_0_36px] shadow-chart-5/25" />
              </div>
            </div>

            {error ? (
              <p
                className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                role="alert"
              >
                {error}
              </p>
            ) : null}

            <p aria-live="polite" className="sr-only">
              {playbackStatus}
            </p>

            <Button
              className="h-11 w-fit bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={!engine || isStarting || isStopping}
              onClick={() => {
                togglePlayback().catch((nextError: unknown) => {
                  setIsPlaying(false);
                  setIsStarting(false);
                  setError(
                    nextError instanceof Error ? nextError.message : "Unable to control audio.",
                  );
                });
              }}
              type="button"
            >
              {isPlaying || isStopping ? <Pause /> : <Play />}
              {isStarting ? "Starting" : isStopping ? "Stopping" : isPlaying ? "Stop" : "Play"}
            </Button>
          </div>
        </div>
      </section>

      <aside className="flex min-w-0 flex-col divide-y divide-border rounded-xl border border-border bg-card/40">
        <div className="px-4 py-3.5">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Controls
          </p>
        </div>
        <div className="grid gap-3 px-4 py-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Band presets
          </p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
            {BINAURAL_BEAT_PRESETS.map((preset) => {
              const isSelected = selectedPresetId === preset.id;

              return (
                <Button
                  aria-pressed={isSelected}
                  className={cn(
                    "h-auto justify-between gap-3 border px-3 py-2 text-left text-foreground",
                    isSelected
                      ? "border-audio-accent bg-audio-accent-softer hover:bg-audio-accent-soft"
                      : "border-border bg-card/50 hover:border-audio-accent/50 hover:bg-muted/70",
                  )}
                  key={preset.id}
                  onClick={() => selectPreset(preset.id)}
                  type="button"
                  variant="ghost"
                >
                  <span className="grid gap-0.5">
                    <span className="font-medium">{preset.name}</span>
                    <span
                      className={cn(
                        "font-mono text-[11px]",
                        isSelected ? "text-audio-accent-muted" : "text-muted-foreground",
                      )}
                    >
                      {preset.carrierFrequencyHz} Hz carrier
                    </span>
                  </span>
                  <span className="font-mono text-xs tabular-nums">
                    {preset.beatFrequencyHz} Hz
                  </span>
                </Button>
              );
            })}
          </div>
        </div>
        <div className="px-4 py-4">
          <FieldGroup className="gap-5">
            {controls.map((control) => (
              <NumberControl
                configKey={control.configKey}
                description={control.description}
                key={control.configKey}
                label={control.label}
                max={control.max}
                min={control.min}
                onChange={updateConfig}
                step={control.step}
                suffix={control.suffix}
                value={config[control.configKey]}
              />
            ))}
          </FieldGroup>
        </div>
        <div className="px-4 py-4">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Safety
          </p>
          <ul className="grid gap-2 text-xs leading-5 text-muted-foreground">
            {SAFETY_NOTES.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
