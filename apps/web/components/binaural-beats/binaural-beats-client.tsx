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
          <FieldLabel className="text-xs text-white/75" htmlFor={inputId}>
            {label}
          </FieldLabel>
          <span className="font-mono text-[11px] tabular-nums text-white/50">
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
            className="h-8 font-mono text-sm tabular-nums text-white"
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
        <p className="text-xs leading-5 text-white/45">{description}</p>
      </FieldContent>
    </Field>
  );
}

export function BinauralBeatsClient() {
  const [config, setConfig] = useState<BinauralBeatConfig>(DEFAULT_BINAURAL_BEAT_CONFIG);
  const [engine, setEngine] = useState<BinauralBeatEngine | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const frequencies = getBinauralBeatFrequencies(config);

  useEffect(() => {
    const nextEngine = createBinauralBeatEngine();
    setEngine(nextEngine);

    return () => {
      nextEngine.destroy();
    };
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
    setConfig((currentConfig) =>
      sanitizeBinauralBeatConfig({
        ...currentConfig,
        [key]: value,
      }),
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
        setIsPlaying(false);
        await engine.stop();
        setIsStopping(false);
        return;
      }

      await engine.play(config);
      setIsPlaying(true);
    } catch (nextError) {
      setIsPlaying(false);
      setIsStopping(false);
      setError(nextError instanceof Error ? nextError.message : "Unable to start audio.");
    }
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
      <section className="min-w-0 rounded-xl border border-white/[0.08] bg-black/20 p-5">
        <div className="flex min-h-[24rem] flex-col justify-between gap-8">
          <div className="grid gap-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/35">
              Stereo tone session
            </p>
            <div className="grid gap-2">
              <div className="flex flex-wrap items-end gap-x-5 gap-y-2">
                <h2 className="text-5xl font-semibold tracking-tight text-white sm:text-7xl">
                  {formatNumber(config.beatFrequencyHz)}
                </h2>
                <span className="pb-2 font-mono text-sm uppercase tracking-[0.16em] text-white/45">
                  Hz beat
                </span>
              </div>
              <p className="max-w-xl text-sm leading-6 text-white/52">
                Left channel {formatNumber(frequencies.leftFrequencyHz)} Hz. Right channel{" "}
                {formatNumber(frequencies.rightFrequencyHz)} Hz.
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            <div
              aria-hidden="true"
              className={cn(
                "grid h-32 grid-cols-2 overflow-hidden rounded-lg border border-white/[0.08]",
                "bg-[linear-gradient(135deg,rgba(24,24,27,0.92),rgba(8,8,10,0.98))]",
              )}
            >
              <div className="flex items-center justify-center border-white/[0.08] border-r">
                <div className="h-12 w-12 rounded-full border border-sky-300/30 bg-sky-300/10 shadow-[0_0_36px_rgba(125,211,252,0.22)]" />
              </div>
              <div className="flex items-center justify-center">
                <div className="h-12 w-12 rounded-full border border-amber-300/30 bg-amber-300/10 shadow-[0_0_36px_rgba(252,211,77,0.2)]" />
              </div>
            </div>

            {error ? (
              <p className="rounded-md border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-100">
                {error}
              </p>
            ) : null}

            <Button
              className="h-11 w-fit bg-white text-black hover:bg-white/90"
              disabled={!engine || isStopping}
              onClick={() => {
                togglePlayback().catch((nextError: unknown) => {
                  setIsPlaying(false);
                  setError(
                    nextError instanceof Error ? nextError.message : "Unable to control audio.",
                  );
                });
              }}
              type="button"
            >
              {isPlaying || isStopping ? <Pause /> : <Play />}
              {isStopping ? "Stopping" : isPlaying ? "Stop" : "Play"}
            </Button>
          </div>
        </div>
      </section>

      <aside className="flex min-w-0 flex-col divide-y divide-white/[0.06] rounded-xl border border-white/[0.08] bg-black/10">
        <div className="px-4 py-3.5">
          <p className="text-xs font-medium uppercase tracking-wide text-white/50">Controls</p>
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
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-white/50">Safety</p>
          <ul className="grid gap-2 text-xs leading-5 text-white/55">
            {SAFETY_NOTES.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
