import { describe, expect, test } from "bun:test";

import { createOscillatorSignalProvider } from "../oscillator-source";

describe("createOscillatorSignalProvider", () => {
  test("generates independent channel buffers from oscillator A and B", () => {
    const provider = createOscillatorSignalProvider(
      {
        ratioLock: "free",
        type: "oscillators",
        a: { amplitude: 1, detuneCents: 0, frequency: 100, phase: 0, waveform: "sine" },
        b: { amplitude: 0.5, detuneCents: 0, frequency: 50, phase: 0, waveform: "triangle" },
      },
      {
        clock: () => 1,
        fftSize: 8,
        sampleRate: 8,
      },
    );

    const left = provider.getSamples(0);
    const right = provider.getSamples(1);

    expect(left).toHaveLength(8);
    expect(right).toHaveLength(8);
    expect(Array.from(left)).not.toEqual(Array.from(right));
  });

  test("applies config updates without replacing the provider instance", () => {
    const provider = createOscillatorSignalProvider(
      {
        ratioLock: "free",
        type: "oscillators",
        a: { amplitude: 1, detuneCents: 0, frequency: 100, phase: 0, waveform: "sine" },
        b: { amplitude: 1, detuneCents: 0, frequency: 100, phase: 0, waveform: "sine" },
      },
      {
        clock: () => 1,
        fftSize: 8,
        sampleRate: 8,
      },
    );

    const before = Array.from(provider.getSamples(0));

    provider.update({
      a: { frequency: 200 },
    });

    const after = Array.from(provider.getSamples(0));

    expect(after).not.toEqual(before);
  });

  test("uses one clock sample for both channels in the same frame", () => {
    let clockCalls = 0;
    const provider = createOscillatorSignalProvider(
      {
        ratioLock: "1:1",
        type: "oscillators",
        a: { amplitude: 1, detuneCents: 0, frequency: 220, phase: Math.PI / 2, waveform: "sine" },
        b: { amplitude: 1, detuneCents: 0, frequency: 220, phase: 0, waveform: "sine" },
      },
      {
        clock: () => {
          clockCalls += 1;
          return 1;
        },
        fftSize: 8,
        sampleRate: 48_000,
      },
    );

    const left = provider.getSamples(0);
    const right = provider.getSamples(1);

    expect(clockCalls).toBe(1);

    for (let index = 0; index < left.length; index += 1) {
      expect(left[index] ** 2 + right[index] ** 2).toBeCloseTo(1, 5);
    }
  });

  test("reuses distinct channel buffers across frames", () => {
    const provider = createOscillatorSignalProvider(
      {
        ratioLock: "1:1",
        type: "oscillators",
        a: { amplitude: 1, detuneCents: 0, frequency: 220, phase: 0, waveform: "sine" },
        b: { amplitude: 1, detuneCents: 0, frequency: 220, phase: 0, waveform: "sine" },
      },
      {
        clock: () => 1,
        fftSize: 8,
        sampleRate: 48_000,
      },
    );

    const firstLeft = provider.getSamples(0);
    const firstRight = provider.getSamples(1);
    const secondLeft = provider.getSamples(0);
    const secondRight = provider.getSamples(1);

    expect(secondLeft).toBe(firstLeft);
    expect(secondRight).toBe(firstRight);
    expect(firstLeft).not.toBe(firstRight);
  });
});
