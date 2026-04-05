import type { SignalProvider } from "../signal/signal-provider";

export type FrameGeometry = {
  kind: "line-strip";
  points: Float32Array;
};

export type DisplayMode<TParams> = {
  generateFrame(input: {
    params: TParams;
    signals: SignalProvider;
    time: number;
    viewport: { height: number; width: number };
  }): FrameGeometry;
  id: string;
  name: string;
};

export type XyModeParams = {
  gain: number;
  sampleCount: number;
};
