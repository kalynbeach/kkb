import { describe, expect, test } from "bun:test";

import type { SignalProvider } from "../../signal/signal-provider";
import { createXyMode } from "../xy";

const provider: SignalProvider = {
  channelCount: 2,
  fftSize: 4,
  frequencyBinCount: 2,
  sampleRate: 48_000,
  smoothing: 0,
  getFrequencyData: () => new Float32Array([0, 0]),
  getSamples: (channel) =>
    channel === 0 ? new Float32Array([-1, -0.5, 0.5, 1]) : new Float32Array([1, 0.5, -0.5, -1]),
};

describe("createXyMode", () => {
  test("builds a clipped line-strip from left/right sample pairs", () => {
    const geometry = createXyMode().generateFrame({
      time: 0,
      signals: provider,
      params: { gain: 1, sampleCount: 4 },
      viewport: { height: 512, width: 512 },
    });

    expect(geometry.kind).toBe("line-strip");
    expect(Array.from(geometry.points)).toEqual([-1, 1, -0.5, 0.5, 0.5, -0.5, 1, -1]);
  });

  test("duplicates mono samples into both axes", () => {
    const monoProvider: SignalProvider = {
      ...provider,
      channelCount: 1,
      getSamples: () => new Float32Array([-1, -0.25, 0.25, 1]),
    };

    const geometry = createXyMode().generateFrame({
      time: 0,
      signals: monoProvider,
      params: { gain: 1, sampleCount: 4 },
      viewport: { height: 512, width: 512 },
    });

    expect(Array.from(geometry.points)).toEqual([-1, -1, -0.25, -0.25, 0.25, 0.25, 1, 1]);
  });
});
