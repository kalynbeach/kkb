import { describe, expect, test } from "bun:test";

import { createMicProvider } from "../create-mic-provider";

describe("createMicProvider", () => {
  test("requests a stream, builds analysers, and returns a teardown handle", async () => {
    let stopped = 0;
    const track = {
      getSettings: () => ({ channelCount: 2 }),
      stop: () => {
        stopped += 1;
      },
    };
    const stream = {
      getAudioTracks: () => [track],
      getTracks: () => [track],
    };

    const analyser = () => ({
      fftSize: 1024,
      frequencyBinCount: 512,
      smoothingTimeConstant: 0.5,
      getFloatFrequencyData: (_target: Float32Array) => {},
      getFloatTimeDomainData: (_target: Float32Array) => {},
      disconnect: () => {},
    });

    const audioContext = {
      sampleRate: 48_000,
      close: async () => {},
      createAnalyser: analyser,
      createChannelSplitter: () => ({ connect: () => {}, disconnect: () => {} }),
      createMediaStreamSource: () => ({ connect: () => {}, disconnect: () => {} }),
    };

    const result = await createMicProvider({
      createAudioContext: () => audioContext as unknown as AudioContext,
      getUserMedia: async () => stream as unknown as MediaStream,
    });

    expect(result.provider.channelCount).toBe(2);
    await result.destroy();
    expect(stopped).toBe(1);
  });

  test("derives a second axis for mono live mic input", async () => {
    const track = {
      getSettings: () => ({ channelCount: 1 }),
      stop: () => {},
    };
    const stream = {
      getAudioTracks: () => [track],
      getTracks: () => [track],
    };

    const analyser = {
      fftSize: 8,
      frequencyBinCount: 4,
      smoothingTimeConstant: 0.5,
      getFloatFrequencyData: (_target: Float32Array) => {},
      getFloatTimeDomainData: (target: Float32Array) =>
        target.set([0.2, 0.35, 0.5, 0.62, 0.38, 0.1, -0.1, -0.25]),
      disconnect: () => {},
    };

    const audioContext = {
      sampleRate: 48_000,
      close: async () => {},
      createAnalyser: () => analyser,
      createChannelSplitter: () => ({ connect: () => {}, disconnect: () => {} }),
      createMediaStreamSource: () => ({ connect: () => {}, disconnect: () => {} }),
    };

    const result = await createMicProvider({
      createAudioContext: () => audioContext as unknown as AudioContext,
      getUserMedia: async () => stream as unknown as MediaStream,
    });

    expect(result.provider.channelCount).toBe(2);
    expect(Array.from(result.provider.getSamples(1))).not.toEqual(
      Array.from(result.provider.getSamples(0)),
    );
  });

  test("can return a deterministic fake mic provider for browser automation", async () => {
    const result = await createMicProvider({
      clock: () => 1,
      mode: "fake-mono",
    });

    expect(result.provider.channelCount).toBe(2);
    expect(result.provider.getSamples(0)).toHaveLength(1024);
    expect(Array.from(result.provider.getSamples(1))).not.toEqual(
      Array.from(result.provider.getSamples(0)),
    );
    await result.destroy();
  });
});
