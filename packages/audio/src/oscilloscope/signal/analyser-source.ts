import type { SignalProvider } from "./signal-provider";

export type AnalyserLike = {
  fftSize: number;
  frequencyBinCount: number;
  smoothingTimeConstant: number;
  getFloatFrequencyData(target: Float32Array): void;
  getFloatTimeDomainData(target: Float32Array): void;
};

export const createAnalyserSignalProvider = ({
  left,
  right,
  sampleRate,
}: {
  left: AnalyserLike;
  right?: AnalyserLike;
  sampleRate: number;
}): SignalProvider => ({
  channelCount: right ? 2 : 1,
  fftSize: left.fftSize,
  frequencyBinCount: left.frequencyBinCount,
  sampleRate,
  smoothing: left.smoothingTimeConstant,
  getFrequencyData: (channel) => {
    const analyser = channel === 0 || !right ? left : right;
    const buffer = new Float32Array(analyser.frequencyBinCount);
    analyser.getFloatFrequencyData(buffer);
    return buffer;
  },
  getSamples: (channel) => {
    const analyser = channel === 0 || !right ? left : right;
    const buffer = new Float32Array(analyser.fftSize);
    analyser.getFloatTimeDomainData(buffer);
    return buffer;
  },
});
