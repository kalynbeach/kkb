"use client";

import { OSCILLOSCOPE_PRESETS } from "@kkb/audio/oscilloscope/presets";
import { getOscilloscopeSupport } from "@kkb/audio/oscilloscope/support";
import type { OscilloscopeConfig, OscilloscopeSupport } from "@kkb/audio/oscilloscope/types";
import { useEffect, useRef, useState } from "react";

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
        if (preset) {
          setConfig((current) => ({
            ...preset.config,
            source: {
              ...preset.config.source,
              type: current.source.type,
            },
          }));
          setSelectedPresetId(preset.id);
        }
      }}
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
