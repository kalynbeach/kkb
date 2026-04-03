import type { SignalProvider } from "./signal-provider";

export type AnalyserLike = {
  fftSize: number;
  frequencyBinCount: number;
  smoothingTimeConstant: number;
  getFloatFrequencyData(target: Float32Array): void;
  getFloatTimeDomainData(target: Float32Array): void;
};

export type MonoChannelMode = "duplicate" | "derived-stereo";

export type SampleConditioning = {
  center?: boolean;
  maxGain?: number;
  minGain?: number;
  silenceFloor?: number;
  targetPeak?: number;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const readAnalyserSamples = (analyser: AnalyserLike) => {
  const buffer = new Float32Array(analyser.fftSize);
  analyser.getFloatTimeDomainData(buffer);
  return buffer;
};

const conditionSampleBuffer = (
  input: Float32Array,
  conditioning?: SampleConditioning,
): Float32Array => {
  if (!conditioning) {
    return input;
  }

  const output = input.slice();

  if (conditioning.center) {
    let mean = 0;

    for (const sample of output) {
      mean += sample;
    }

    mean /= output.length || 1;

    for (let index = 0; index < output.length; index += 1) {
      output[index] = (output[index] ?? 0) - mean;
    }
  }

  let peak = 0;
  for (const sample of output) {
    peak = Math.max(peak, Math.abs(sample));
  }

  const silenceFloor = conditioning.silenceFloor ?? 0;
  if (peak <= silenceFloor) {
    return new Float32Array(output.length);
  }

  const targetPeak = conditioning.targetPeak ?? peak;
  const minGain = conditioning.minGain ?? 1;
  const maxGain = conditioning.maxGain ?? 1;
  const gain = clamp(targetPeak / peak, minGain, maxGain);

  if (gain === 1) {
    return output;
  }

  for (let index = 0; index < output.length; index += 1) {
    output[index] = clamp((output[index] ?? 0) * gain, -1, 1);
  }

  return output;
};

const deriveStereoBuffer = (
  input: Float32Array,
  conditioning?: SampleConditioning,
): Float32Array => {
  const derived = new Float32Array(input.length);
  const delay = Math.max(1, Math.floor(input.length / 32));

  for (let index = 0; index < input.length; index += 1) {
    const current = input[index] ?? 0;
    const previous = input[Math.max(0, index - 1)] ?? 0;
    const delayed = input[Math.max(0, index - delay)] ?? 0;
    const slope = current - previous;
    derived[index] = clamp(delayed * 0.82 + slope * 1.6, -1, 1);
  }

  return conditionSampleBuffer(derived, conditioning);
};

export const createAnalyserSignalProvider = ({
  left,
  monoChannelMode = "duplicate",
  right,
  sampleConditioning,
  sampleRate,
}: {
  left: AnalyserLike;
  monoChannelMode?: MonoChannelMode;
  right?: AnalyserLike;
  sampleConditioning?: SampleConditioning;
  sampleRate: number;
}): SignalProvider => ({
  channelCount: right || monoChannelMode === "derived-stereo" ? 2 : 1,
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
    if (!right) {
      const samples = conditionSampleBuffer(readAnalyserSamples(left), sampleConditioning);

      if (channel === 1 && monoChannelMode === "derived-stereo") {
        return deriveStereoBuffer(samples, sampleConditioning);
      }

      return samples;
    }

    const analyser = channel === 0 ? left : right;
    return conditionSampleBuffer(readAnalyserSamples(analyser), sampleConditioning);
  },
});
