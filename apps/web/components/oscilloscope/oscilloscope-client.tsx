"use client";

import {
  createOscilloscope,
  getOscilloscopeSupport,
  OSCILLOSCOPE_PRESETS,
  type OscilloscopeConfig,
  type OscilloscopeSupport,
} from "@kkb/audio/oscilloscope";
import { useEffect, useRef, useState } from "react";

import { createMicProvider } from "@/lib/oscilloscope/create-mic-provider";

import { OscilloscopeShell } from "./oscilloscope-shell";

type OscilloscopeClientProps = {
  createMicProvider?: typeof createMicProvider;
  createScope?: typeof createOscilloscope;
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

const defaultPreset = OSCILLOSCOPE_PRESETS[0]!;
const getInitialSupport = (): OscilloscopeSupport =>
  typeof navigator === "undefined" ? { reason: null, supported: true } : getOscilloscopeSupport();

export function OscilloscopeClient({
  createMicProvider: createMicProviderOverride = createMicProvider,
  createScope = createOscilloscope,
}: OscilloscopeClientProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const micRuntimeRef = useRef<null | { destroy(): Promise<void> }>(null);
  const scopeRef = useRef<ReturnType<typeof createOscilloscope> | null>(null);
  const [support, setSupport] = useState<OscilloscopeSupport>(getInitialSupport);
  const [config, setConfig] = useState<OscilloscopeConfig>(defaultPreset.config);
  const [micError, setMicError] = useState<string | null>(null);
  const [micStatus, setMicStatus] = useState<"idle" | "requesting" | "ready" | "error">("idle");
  const [selectedPresetId, setSelectedPresetId] = useState(defaultPreset.id);

  useEffect(() => {
    setSupport(getOscilloscopeSupport());
  }, []);

  useEffect(() => {
    if (!support.supported || !canvasRef.current) {
      return;
    }

    const scope = createScope(canvasRef.current, config);
    let destroyed = false;

    const destroyScope = () => {
      if (destroyed) {
        return;
      }

      destroyed = true;
      const runtime = micRuntimeRef.current;
      micRuntimeRef.current = null;
      scope.destroy();
      if (scopeRef.current === scope) {
        scopeRef.current = null;
      }
      runtime?.destroy().catch((error) => {
        console.error("[oscilloscope] mic destroy failed", error);
      });
    };

    scopeRef.current = scope;
    scope.start().catch((error) => {
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
    });

    return () => {
      destroyScope();
    };
  }, [createScope, support.supported]);

  useEffect(() => {
    scopeRef.current?.updateConfig(config);
  }, [config]);

  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope) {
      return;
    }

    if (config.source.type !== "mic") {
      const runtime = micRuntimeRef.current;
      micRuntimeRef.current = null;
      scope.setSignalProvider(null);
      setMicError(null);
      setMicStatus("idle");
      runtime?.destroy().catch((error) => {
        console.error("[oscilloscope] mic destroy failed", error);
      });
      return;
    }

    let cancelled = false;
    setMicError(null);
    setMicStatus("requesting");

    createMicProviderOverride()
      .then((runtime) => {
        if (cancelled) {
          runtime.destroy().catch(() => {});
          return;
        }

        const previousRuntime = micRuntimeRef.current;
        micRuntimeRef.current = runtime;
        previousRuntime?.destroy().catch(() => {});
        scope.setSignalProvider(runtime.provider);
        setMicStatus("ready");
      })
      .catch((error: unknown) => {
        if (cancelled) {
          return;
        }

        scope.setSignalProvider(null);
        setMicError(error instanceof Error ? error.message : "Unable to access microphone.");
        setMicStatus("error");
      });

    return () => {
      cancelled = true;
    };
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
          setConfig(preset.config);
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
