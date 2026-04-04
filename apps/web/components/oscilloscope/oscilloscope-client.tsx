"use client";

import { OSCILLOSCOPE_PRESETS } from "@kkb/audio/oscilloscope/presets";
import { getOscilloscopeSupport } from "@kkb/audio/oscilloscope/support";
import type { OscilloscopeConfig, OscilloscopeSupport } from "@kkb/audio/oscilloscope/types";
import { useCallback, useEffect, useRef, useState } from "react";

import { createMicProvider, type MicInputMode } from "@/lib/oscilloscope/create-mic-provider";

import { OscilloscopeShell } from "./oscilloscope-shell";

type CreateScope = typeof import("@kkb/audio/oscilloscope/runtime").createOscilloscope;
type LoadCreateScope = () => Promise<{
  createOscilloscope: CreateScope;
}>;
type ScopeController = ReturnType<CreateScope>;
type MicRuntime = Awaited<ReturnType<typeof createMicProvider>>;

type OscilloscopeClientProps = {
  createMicProvider?: typeof createMicProvider;
  createScope?: CreateScope;
  loadCreateScope?: LoadCreateScope;
};

const mergeConfig = (
  current: OscilloscopeConfig,
  next: Partial<OscilloscopeConfig>,
): OscilloscopeConfig => ({
  ...current,
  ...next,
  canvas: { ...current.canvas, ...next.canvas },
  phosphor: { ...current.phosphor, ...next.phosphor },
  source: {
    ...current.source,
    ...next.source,
    a: { ...current.source.a, ...next.source?.a },
    b: { ...current.source.b, ...next.source?.b },
  },
});

const getDefaultPreset = () => {
  const preset = OSCILLOSCOPE_PRESETS[0];
  if (!preset) {
    throw new Error("At least one oscilloscope preset is required.");
  }

  return preset;
};

const defaultPreset = getDefaultPreset();
const loadCreateScopeDefault: LoadCreateScope = () => import("@kkb/audio/oscilloscope/runtime");
const initialSupport: OscilloscopeSupport = {
  reason: "Checking WebGPU support...",
  supported: false,
};
const MIN_TRAIL_LENGTH = 16;
const MAX_TRAIL_LENGTH = 128;
const MIN_BLOOM = 0;
const MAX_BLOOM = 1.5;
const MIN_FREQUENCY = 1;
const MAX_FREQUENCY = 20_000;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const getMicInputMode = (): MicInputMode => {
  if (typeof window === "undefined") {
    return "live";
  }

  const mic = new URLSearchParams(window.location.search).get("mic");
  if (mic === "fake-mono" || mic === "fake-stereo") {
    return mic;
  }

  return "live";
};

const readHashConfig = (): { config: OscilloscopeConfig; presetId: string } | null => {
  if (typeof window === "undefined") return null;
  const hash = window.location.hash.slice(1);
  if (!hash) return null;

  const params = new URLSearchParams(hash);
  const presetId = params.get("preset");
  const preset = presetId ? OSCILLOSCOPE_PRESETS.find((p) => p.id === presetId) : null;
  const base = preset?.config ?? defaultPreset.config;

  const readClampedNumber = (key: string, fallback: number, min: number, max: number) => {
    const raw = params.get(key);
    if (raw === null) return fallback;
    const v = Number(raw);
    return Number.isFinite(v) ? clamp(v, min, max) : fallback;
  };

  const readClampedInteger = (key: string, fallback: number, min: number, max: number) => {
    const value = readClampedNumber(key, fallback, min, max);
    return Number.isFinite(value) ? Math.round(value) : fallback;
  };

  return {
    config: {
      ...base,
      source: {
        ...base.source,
        type: params.get("source") === "mic" ? "mic" : "oscillators",
        a: {
          ...base.source.a,
          frequency: readClampedNumber("freqA", base.source.a.frequency, MIN_FREQUENCY, MAX_FREQUENCY),
        },
        b: {
          ...base.source.b,
          frequency: readClampedNumber("freqB", base.source.b.frequency, MIN_FREQUENCY, MAX_FREQUENCY),
        },
      },
      phosphor: {
        ...base.phosphor,
        trailLength: readClampedInteger(
          "trail",
          base.phosphor.trailLength,
          MIN_TRAIL_LENGTH,
          MAX_TRAIL_LENGTH,
        ),
        bloom: readClampedNumber("bloom", base.phosphor.bloom, MIN_BLOOM, MAX_BLOOM),
      },
    },
    presetId: preset?.id ?? defaultPreset.id,
  };
};

const writeHashConfig = (cfg: OscilloscopeConfig, presetId: string) => {
  const p = new URLSearchParams();
  p.set("preset", presetId);
  p.set("source", cfg.source.type);
  if (cfg.source.type === "oscillators") {
    p.set("freqA", String(cfg.source.a.frequency));
    p.set("freqB", String(cfg.source.b.frequency));
  }
  p.set("trail", String(cfg.phosphor.trailLength));
  p.set("bloom", String(cfg.phosphor.bloom));
  window.history.replaceState(null, "", `#${p.toString()}`);
};

export function OscilloscopeClient({
  createMicProvider: createMicProviderOverride = createMicProvider,
  createScope,
  loadCreateScope = loadCreateScopeDefault,
}: OscilloscopeClientProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const micRuntimeRef = useRef<MicRuntime | null>(null);
  const micRequestIdRef = useRef(0);
  const scopeRef = useRef<ScopeController | null>(null);
  const [support, setSupport] = useState<OscilloscopeSupport>(initialSupport);
  const [config, setConfig] = useState<OscilloscopeConfig>(defaultPreset.config);
  const [micError, setMicError] = useState<string | null>(null);
  const [micStatus, setMicStatus] = useState<"idle" | "requesting" | "ready" | "error">("idle");
  const [selectedPresetId, setSelectedPresetId] = useState(defaultPreset.id);
  const latestConfigRef = useRef(config);

  latestConfigRef.current = config;

  const applyPreset = useCallback((preset: (typeof OSCILLOSCOPE_PRESETS)[number]) => {
    setConfig((current) => ({
      ...preset.config,
      source: { ...preset.config.source, type: current.source.type },
    }));
    setSelectedPresetId(preset.id);
  }, []);

  const handleResetVisual = useCallback(() => {
    const preset = OSCILLOSCOPE_PRESETS.find((p) => p.id === selectedPresetId);
    if (!preset) return;
    setConfig((current) => ({
      ...current,
      phosphor: { ...preset.config.phosphor },
    }));
  }, [selectedPresetId]);

  const destroyMicRuntime = (runtime: MicRuntime | null) => {
    runtime?.destroy().catch((error) => {
      console.error("[oscilloscope] mic destroy failed", error);
    });
  };

  const syncSignalSource = (
    scope: ScopeController,
    sourceType: OscilloscopeConfig["source"]["type"],
  ) => {
    const requestId = ++micRequestIdRef.current;

    if (sourceType !== "mic") {
      const runtime = micRuntimeRef.current;
      micRuntimeRef.current = null;
      scope.setSignalProvider(null);
      setMicError(null);
      setMicStatus("idle");
      destroyMicRuntime(runtime);

      return () => {
        if (micRequestIdRef.current === requestId) {
          micRequestIdRef.current += 1;
        }
      };
    }

    setMicError(null);
    setMicStatus("requesting");

    createMicProviderOverride({ mode: getMicInputMode() })
      .then((runtime) => {
        if (micRequestIdRef.current !== requestId || scopeRef.current !== scope) {
          runtime.destroy().catch(() => {});
          return;
        }

        const previousRuntime = micRuntimeRef.current;
        micRuntimeRef.current = runtime;
        destroyMicRuntime(previousRuntime);
        scope.setSignalProvider(runtime.provider);
        setMicStatus("ready");
      })
      .catch((error: unknown) => {
        if (micRequestIdRef.current !== requestId || scopeRef.current !== scope) {
          return;
        }

        scope.setSignalProvider(null);
        setMicError(error instanceof Error ? error.message : "Unable to access microphone.");
        setMicStatus("error");
      });

    return () => {
      if (micRequestIdRef.current === requestId) {
        micRequestIdRef.current += 1;
      }
    };
  };

  useEffect(() => {
    setSupport(getOscilloscopeSupport());
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!support.supported || !canvas) {
      return;
    }

    let destroyed = false;
    let scope: ScopeController | null = null;

    const destroyScope = () => {
      if (destroyed) {
        return;
      }

      destroyed = true;
      micRequestIdRef.current += 1;
      const runtime = micRuntimeRef.current;
      micRuntimeRef.current = null;
      scope?.destroy();
      if (scopeRef.current === scope) {
        scopeRef.current = null;
      }
      destroyMicRuntime(runtime);
    };

    const failStartup = (error: unknown) => {
      if (destroyed) {
        return;
      }

      console.error("[oscilloscope] start failed", error);
      setSupport({
        reason:
          error instanceof Error
            ? `Unable to start WebGPU renderer: ${error.message}`
            : "Unable to start WebGPU renderer in this browser.",
        supported: false,
      });
      destroyScope();
    };

    const startScope = async () => {
      try {
        const resolvedCreateScope = createScope ?? (await loadCreateScope()).createOscilloscope;
        if (destroyed) {
          return;
        }

        const latestConfig = latestConfigRef.current;
        scope = resolvedCreateScope(canvas, latestConfig);
        scopeRef.current = scope;
        scope.updateConfig(latestConfig);
        syncSignalSource(scope, latestConfig.source.type);
        scope.start().catch(failStartup);
      } catch (error) {
        failStartup(error);
      }
    };

    startScope();

    return () => {
      destroyScope();
    };
  }, [createScope, loadCreateScope, support.supported]);

  useEffect(() => {
    scopeRef.current?.updateConfig(config);
  }, [config]);

  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope) {
      return;
    }

    return syncSignalSource(scope, config.source.type);
  }, [config.source.type, createMicProviderOverride]);

  useEffect(() => {
    const initial = readHashConfig();
    if (initial) {
      setConfig(initial.config);
      setSelectedPresetId(initial.presetId);
    }
  }, []);

  useEffect(() => {
    writeHashConfig(config, selectedPresetId);
  }, [config, selectedPresetId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const index = Number(e.key) - 1;
      if (index >= 0 && index < OSCILLOSCOPE_PRESETS.length) {
        const preset = OSCILLOSCOPE_PRESETS[index];
        if (preset) applyPreset(preset);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [applyPreset]);

  return (
    <OscilloscopeShell
      canvasRef={canvasRef}
      config={config}
      micError={micError}
      micStatus={micStatus}
      onConfigChange={(next) => {
        setConfig((current) => mergeConfig(current, next));
      }}
      onPresetChange={(presetId) => {
        const preset = OSCILLOSCOPE_PRESETS.find((item) => item.id === presetId);
        if (preset) applyPreset(preset);
      }}
      onResetVisual={handleResetVisual}
      onSourceChange={(source) => {
        setConfig((current) => ({
          ...current,
          source: { ...current.source, type: source },
        }));
      }}
      selectedPresetId={selectedPresetId}
      support={support}
    />
  );
}
