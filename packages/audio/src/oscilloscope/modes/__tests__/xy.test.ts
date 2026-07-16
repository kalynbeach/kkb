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

  test("reuses the active points view when the sample count is unchanged", () => {
    const samples = [
      new Float32Array([-1, 0]),
      new Float32Array([1, 0.5]),
      new Float32Array([-0.25, 0.75]),
      new Float32Array([0.25, -0.75]),
    ];
    let readIndex = 0;
    const changingProvider: SignalProvider = {
      ...provider,
      fftSize: 2,
      frequencyBinCount: 1,
      getSamples: () => samples[readIndex++] ?? new Float32Array(0),
    };
    const mode = createXyMode();
    const frame = {
      time: 0,
      signals: changingProvider,
      params: { gain: 1, sampleCount: 2 },
      viewport: { height: 512, width: 512 },
    };

    const first = mode.generateFrame(frame);
    const second = mode.generateFrame(frame);

    expect(second.points).toBe(first.points);
    expect(Array.from(second.points)).toEqual([-0.25, 0.25, 0.75, -0.75]);
  });

  test("clamps direct callers to the renderer point budget", () => {
    const samples = new Float32Array(5_000);
    const oversizedProvider: SignalProvider = {
      ...provider,
      fftSize: samples.length,
      frequencyBinCount: samples.length / 2,
      getSamples: () => samples,
    };

    const geometry = createXyMode().generateFrame({
      time: 0,
      signals: oversizedProvider,
      params: { gain: 1, sampleCount: samples.length },
      viewport: { height: 512, width: 512 },
    });

    expect(geometry.points).toHaveLength(8_192);
  });
});
