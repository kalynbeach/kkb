import type { OscilloscopeConfig, OscilloscopeSupport } from "@kkb/audio/oscilloscope";
import type { RefObject } from "react";

import { OscilloscopeControls } from "./oscilloscope-controls";

type OscilloscopeShellProps = {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  config: OscilloscopeConfig;
  micError: string | null;
  micStatus: "idle" | "requesting" | "ready" | "error";
  onConfigChange: (config: Partial<OscilloscopeConfig>) => void;
  onPresetChange: (presetId: string) => void;
  onSourceChange: (source: OscilloscopeConfig["source"]["type"]) => void;
  selectedPresetId: string;
  support: OscilloscopeSupport;
};

export function OscilloscopeShell({
  canvasRef,
  config,
  micError,
  micStatus,
  onConfigChange,
  onPresetChange,
  onSourceChange,
  selectedPresetId,
  support,
}: OscilloscopeShellProps) {
  return (
    <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
      <section className="rounded-3xl border border-emerald-500/20 bg-black/50 p-5 shadow-[0_0_80px_rgba(0,255,128,0.08)]">
        <div className="mb-4 flex items-center justify-between font-mono text-xs uppercase tracking-[0.2em] text-emerald-300/80">
          <span>Browser Oscilloscope</span>
          <span>{support.supported ? config.mode : "unsupported"}</span>
        </div>
        <div className="aspect-square overflow-hidden rounded-2xl border border-emerald-500/20 bg-[#020604]">
          {support.supported ? (
            <canvas className="h-full w-full" ref={canvasRef} />
          ) : (
            <div className="flex h-full items-center justify-center px-8 text-center text-sm text-emerald-100/70">
              {support.reason}
            </div>
          )}
        </div>
        <div className="mt-4 font-mono text-xs text-emerald-200/70">
          {config.source.type === "mic"
            ? micStatus === "error"
              ? micError
              : micStatus === "ready"
                ? "Mic input active"
                : micStatus === "requesting"
                  ? "Requesting mic permission"
                  : "Mic input idle"
            : "Internal oscillators active"}
        </div>
      </section>

      <OscilloscopeControls
        config={config}
        onConfigChange={onConfigChange}
        onPresetChange={onPresetChange}
        onSourceChange={onSourceChange}
        selectedPresetId={selectedPresetId}
      />
    </div>
  );
}
