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

    expect(Array.from(provider.getSamples(0))).toEqual([0, 0.25, 0.5, 0.75, 0, -0.25, -0.5, -0.75]);
    expect(Array.from(provider.getSamples(1))).toEqual([0, -0.25, -0.5, -0.75, 0, 0.25, 0.5, 0.75]);
    expect(Array.from(provider.getFrequencyData(0))).toEqual([-80, -60, -40, -20]);
  });
});
