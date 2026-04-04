import type { OscilloscopeConfig } from "../types";
import type { SignalProvider } from "./signal-provider";

type OscillatorSourceConfig = OscilloscopeConfig["source"];

type CreateOscillatorSignalProviderOptions = {
  clock?: () => number;
  fftSize?: number;
  sampleRate?: number;
};

export type OscillatorSignalProvider = SignalProvider & {
  update(update: Partial<OscillatorSourceConfig>): void;
};

const toPhaseOffset = (phase: number) => phase / (Math.PI * 2);

const sampleWave = (waveform: OscillatorSourceConfig["a"]["waveform"], phase: number) => {
  const wrapped = phase - Math.floor(phase);

  switch (waveform) {
    case "square":
      return wrapped < 0.5 ? 1 : -1;
    case "saw":
      return wrapped * 2 - 1;
    case "triangle":
      return 1 - 4 * Math.abs(wrapped - 0.5);
    default:
      return Math.sin(wrapped * Math.PI * 2);
  }
};

const mergeSourceConfig = (
  current: OscillatorSourceConfig,
  update: Partial<OscillatorSourceConfig>,
): OscillatorSourceConfig => ({
  ...current,
  ...update,
  a: { ...current.a, ...update.a },
  b: { ...current.b, ...update.b },
});

export const createOscillatorSignalProvider = (
  initialConfig: OscillatorSourceConfig,
  options: CreateOscillatorSignalProviderOptions = {},
): OscillatorSignalProvider => {
  let config = initialConfig;
  const sampleRate = options.sampleRate ?? 48_000;
  const fftSize = options.fftSize ?? 1024;
  const clock = options.clock ?? (() => performance.now() / 1000);
  const emptyFrequencyData = new Float32Array(fftSize / 2);
  let frameSamples:
    | {
        left: Float32Array;
        right: Float32Array;
      }
    | null = null;
  let servedChannels = {
    left: false,
    right: false,
  };

  const buildSamples = (oscillator: OscillatorSourceConfig["a"], now: number) => {
    const samples = new Float32Array(fftSize);
    const detuneMultiplier = 2 ** (oscillator.detuneCents / 1200);
    const frequency = oscillator.frequency * detuneMultiplier;

    for (let index = 0; index < fftSize; index += 1) {
      const time = now - (fftSize - 1 - index) / sampleRate;
      const phase = time * frequency + toPhaseOffset(oscillator.phase);
      samples[index] = sampleWave(oscillator.waveform, phase) * oscillator.amplitude;
    }

    return samples;
  };

  const readFrameSamples = () => {
    if (frameSamples && !(servedChannels.left && servedChannels.right)) {
      return frameSamples;
    }

    const now = clock();
    frameSamples = {
      left: buildSamples(config.a, now),
      right: buildSamples(config.b, now),
    };
    servedChannels = {
      left: false,
      right: false,
    };

    return frameSamples;
  };

  return {
    channelCount: 2,
    fftSize,
    frequencyBinCount: emptyFrequencyData.length,
    sampleRate,
    smoothing: 0,
    getFrequencyData: () => emptyFrequencyData,
    getSamples: (channel) => {
      const currentFrameSamples = readFrameSamples();

      if (channel === 0) {
        servedChannels.left = true;
        return currentFrameSamples.left;
      }

      servedChannels.right = true;
      return currentFrameSamples.right;
    },
    update: (update) => {
      config = mergeSourceConfig(config, update);
      frameSamples = null;
      servedChannels = {
        left: false,
        right: false,
      };
    },
  };
};
