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
});
