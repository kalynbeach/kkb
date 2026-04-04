import type { OscilloscopeConfig, OscilloscopeSupport } from "@kkb/audio/oscilloscope/types";
import { Alert, AlertDescription, AlertTitle } from "@kkb/ui/components/alert";
import { AspectRatio } from "@kkb/ui/components/aspect-ratio";
import { Badge } from "@kkb/ui/components/badge";
import type { RefObject } from "react";

import { OscilloscopeControls } from "./oscilloscope-controls";

type OscilloscopeShellProps = {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  config: OscilloscopeConfig;
  micError: string | null;
  micStatus: "idle" | "requesting" | "ready" | "error";
  onConfigChange: (config: Partial<OscilloscopeConfig>) => void;
  onPresetChange: (presetId: string) => void;
  onResetVisual: () => void;
  onSourceChange: (source: OscilloscopeConfig["source"]["type"]) => void;
  selectedPresetId: string;
  support: OscilloscopeSupport;
};

type StageStatus =
  | {
      description: string;
      title: string;
      tone: "critical" | "neutral";
      type: "alert";
    }
  | {
      detail?: string;
      label: string;
      type: "compact";
    };

const getSupportBadge = (support: OscilloscopeSupport) => {
  if (support.supported) {
    return { label: "WebGPU", variant: "secondary" as const };
  }

  if (support.reason === "Checking WebGPU support...") {
    return { label: "Checking", variant: "outline" as const };
  }

  return { label: "Unsupported", variant: "outline" as const };
};

const getStageStatus = ({
  config,
  micError,
  micStatus,
  support,
}: Pick<OscilloscopeShellProps, "config" | "micError" | "micStatus" | "support">): StageStatus => {
  if (!support.supported) {
    return {
      description:
        support.reason === "Checking WebGPU support..."
          ? "Checking whether this browser can start WebGPU."
          : (support.reason ?? "This browser cannot start the oscilloscope renderer."),
      title:
        support.reason === "Checking WebGPU support..."
          ? "Checking browser support"
          : "WebGPU unavailable",
      tone: support.reason === "Checking WebGPU support..." ? "neutral" : "critical",
      type: "alert",
    };
  }

  if (config.source.type !== "mic") {
    return {
      label: "Internal oscillators active",
      type: "compact",
    };
  }

  if (micStatus === "requesting") {
    return {
      description: "Waiting for browser permission.",
      title: "Requesting microphone",
      tone: "neutral",
      type: "alert",
    };
  }

  if (micStatus === "error") {
    return {
      description: micError ?? "Unable to access microphone input.",
      title: "Microphone unavailable",
      tone: "critical",
      type: "alert",
    };
  }

  if (micStatus === "ready") {
    return {
      label: "Mic input active",
      type: "compact",
    };
  }

  return {
    label: "Mic input idle",
    type: "compact",
  };
};

const getSourceBadgeLabel = (source: OscilloscopeConfig["source"]["type"]) =>
  source === "mic" ? "Mic" : "Oscillators";

function OscilloscopeStageStatus(props: StageStatus) {
  if (props.type === "alert") {
    return (
      <Alert
        className="border-white/10 bg-black/30 text-white"
        variant={props.tone === "critical" ? "destructive" : "default"}
      >
        <AlertTitle>{props.title}</AlertTitle>
        <AlertDescription className="text-white/70">{props.description}</AlertDescription>
      </Alert>
    );
  }

  return (
    <p className="text-xs text-white/50">
      {props.label}
      {props.detail ? <span className="text-white/40"> · {props.detail}</span> : null}
    </p>
  );
}

export function OscilloscopeShell({
  canvasRef,
  config,
  micError,
  micStatus,
  onConfigChange,
  onPresetChange,
  onResetVisual,
  onSourceChange,
  selectedPresetId,
  support,
}: OscilloscopeShellProps) {
  const supportBadge = getSupportBadge(support);
  const stageStatus = getStageStatus({ config, micError, micStatus, support });
  const stageAlert = stageStatus.type === "alert" ? stageStatus : null;
  const stageSummary = stageStatus.type === "compact" ? stageStatus : null;

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_22rem] xl:items-start">
      <section className="flex min-w-0 flex-col gap-3">
        {stageAlert ? <OscilloscopeStageStatus {...stageAlert} /> : null}

        <AspectRatio ratio={1}>
          <div className="relative size-full overflow-hidden rounded-2xl border border-emerald-400/20 bg-[#020604] shadow-[inset_0_0_0_1px_rgba(16,185,129,0.06)]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.16)_0%,rgba(16,185,129,0.06)_32%,rgba(0,0,0,0)_72%)]" />
            {support.supported ? (
              <canvas className="relative z-10 h-full w-full" ref={canvasRef} />
            ) : (
              <div className="relative z-10 flex h-full items-center justify-center px-8 text-center text-sm leading-6 text-white/70">
                {support.reason}
              </div>
            )}
          </div>
        </AspectRatio>

        <div className="flex items-center gap-2">
          {stageSummary ? <OscilloscopeStageStatus {...stageSummary} /> : null}
          <div className="ml-auto flex items-center gap-1.5">
            <Badge
              className="border-white/10 bg-white/5 font-mono text-[11px] uppercase tracking-[0.14em] text-white/70"
              variant="outline"
            >
              {getSourceBadgeLabel(config.source.type)}
            </Badge>
            <Badge
              className="border-white/10 bg-white/5 font-mono text-[11px] uppercase tracking-[0.14em] text-white/70"
              variant="outline"
            >
              {supportBadge.label}
            </Badge>
          </div>
        </div>
      </section>

      <OscilloscopeControls
        config={config}
        onConfigChange={onConfigChange}
        onPresetChange={onPresetChange}
        onResetVisual={onResetVisual}
        onSourceChange={onSourceChange}
        selectedPresetId={selectedPresetId}
      />
    </div>
  );
}
