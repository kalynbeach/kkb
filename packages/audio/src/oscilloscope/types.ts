import type { SignalProvider } from "./signal/signal-provider";

export type OscilloscopeModeId = "xy";
export type OscilloscopeWaveform = "sine" | "square" | "saw" | "triangle";
export type OscilloscopeAspectRatio = "1:1" | "4:3";
export type OscilloscopeQuality = "quality" | "performance";
export type OscilloscopeSourceKind = "oscillators" | "mic";
export type OscilloscopePhosphorColor = "p31-green";
export type OscilloscopeRatioLock = "free" | "1:1" | "2:1" | "3:2";

export type OscillatorConfig = {
  amplitude: number;
  detuneCents: number;
  frequency: number;
  phase: number;
  waveform: OscilloscopeWaveform;
};

export type OscilloscopeConfig = {
  canvas: {
    aspectRatio: OscilloscopeAspectRatio;
    background: number;
    quality: OscilloscopeQuality;
  };
  mode: OscilloscopeModeId;
  phosphor: {
    bloom: number;
    color: OscilloscopePhosphorColor;
    trailLength: number;
  };
  source: {
    a: OscillatorConfig;
    b: OscillatorConfig;
    ratioLock: OscilloscopeRatioLock;
    type: OscilloscopeSourceKind;
  };
};

export type OscilloscopeConfigUpdate = {
  canvas?: Partial<OscilloscopeConfig["canvas"]>;
  mode?: OscilloscopeModeId;
  phosphor?: Partial<OscilloscopeConfig["phosphor"]>;
  source?: {
    a?: Partial<OscillatorConfig>;
    b?: Partial<OscillatorConfig>;
    ratioLock?: OscilloscopeRatioLock;
    type?: OscilloscopeSourceKind;
  };
};

export type OscilloscopeSupport =
  | { status: "checking" }
  | { status: "supported" }
  | {
      reason: string;
      status: "unsupported";
    };

export type OscilloscopePreset = {
  config: OscilloscopeConfig;
  id: string;
  name: string;
};

export type OscilloscopeController = {
  destroy(): void;
  getState(): {
    config: OscilloscopeConfig;
    provider: SignalProvider | null;
    running: boolean;
  };
  setSignalProvider(provider: SignalProvider | null): void;
  start(): Promise<void>;
  stop(): void;
  updateConfig(update: OscilloscopeConfigUpdate): void;
};
