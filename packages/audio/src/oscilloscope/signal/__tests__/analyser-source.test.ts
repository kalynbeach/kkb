import { describe, expect, test } from "bun:test";

import { createAnalyserSignalProvider } from "../analyser-source";

describe("createAnalyserSignalProvider", () => {
  test("reads time-domain and frequency-domain data from the provided analysers", () => {
    const left = {
      fftSize: 8,
      frequencyBinCount: 4,
      smoothingTimeConstant: 0.4,
      getFloatFrequencyData: (target: Float32Array) => target.set([-80, -60, -40, -20]),
      getFloatTimeDomainData: (target: Float32Array) =>
        target.set([0, 0.25, 0.5, 0.75, 0, -0.25, -0.5, -0.75]),
    };
    const right = {
      fftSize: 8,
      frequencyBinCount: 4,
      smoothingTimeConstant: 0.4,
      getFloatFrequencyData: (target: Float32Array) => target.set([-70, -55, -35, -15]),
      getFloatTimeDomainData: (target: Float32Array) =>
        target.set([0, -0.25, -0.5, -0.75, 0, 0.25, 0.5, 0.75]),
    };

    const provider = createAnalyserSignalProvider({ left, right, sampleRate: 48_000 });
    const leftSamples = provider.getSamples(0);
    const leftBeforeRightRead = Array.from(leftSamples);
    const rightSamples = provider.getSamples(1);

    expect(Array.from(leftSamples)).toEqual([0, 0.25, 0.5, 0.75, 0, -0.25, -0.5, -0.75]);
    expect(Array.from(rightSamples)).toEqual([0, -0.25, -0.5, -0.75, 0, 0.25, 0.5, 0.75]);
    expect(Array.from(leftSamples)).toEqual(leftBeforeRightRead);
    expect(rightSamples).not.toBe(leftSamples);
    expect(provider.getSamples(0)).toBe(leftSamples);
    expect(provider.getSamples(1)).toBe(rightSamples);
    expect(Array.from(provider.getFrequencyData(0))).toEqual([-80, -60, -40, -20]);
  });

  test("can derive a second axis and condition mono input for XY rendering", () => {
    const provider = createAnalyserSignalProvider({
      left: {
        fftSize: 8,
        frequencyBinCount: 4,
        smoothingTimeConstant: 0.28,
        getFloatFrequencyData: (target: Float32Array) => target.set([-90, -75, -60, -45]),
        getFloatTimeDomainData: (target: Float32Array) =>
          target.set([0.22, 0.3, 0.45, 0.62, 0.44, 0.18, -0.04, -0.2]),
      },
      monoChannelMode: "derived-stereo",
      sampleConditioning: {
        center: true,
        maxGain: 8,
        minGain: 1,
        silenceFloor: 0.0001,
        targetPeak: 0.75,
      },
      sampleRate: 48_000,
    });

    const x = provider.getSamples(0);
    const xBeforeDerivedRead = Array.from(x);
    const y = provider.getSamples(1);
    const xMean = x.reduce((sum, sample) => sum + sample, 0) / x.length;
    const xPeak = x.reduce((peak, sample) => Math.max(peak, Math.abs(sample)), 0);

    expect(provider.channelCount).toBe(2);
    expect(xMean).toBeCloseTo(0, 6);
    expect(xPeak).toBeCloseTo(0.75, 6);
    expect(Array.from(y)).not.toEqual(Array.from(x));
    expect(Array.from(x)).toEqual(xBeforeDerivedRead);
    expect(y).not.toBe(x);
    expect(provider.getSamples(0)).toBe(x);
    expect(provider.getSamples(1)).toBe(y);
  });
});
