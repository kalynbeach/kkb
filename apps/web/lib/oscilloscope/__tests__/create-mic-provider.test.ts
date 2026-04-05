import { describe, expect, test } from "bun:test";

import { createMicProvider } from "../create-mic-provider";

describe("createMicProvider", () => {
  test("requests a stream, builds analysers, and returns a teardown handle", async () => {
    let stopped = 0;
    let requestedConstraints: MediaStreamConstraints | null = null;
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
      getUserMedia: async (constraints) => {
        requestedConstraints = constraints;
        return stream as unknown as MediaStream;
      },
    });

    expect(result.provider.channelCount).toBe(2);
    expect(requestedConstraints).toEqual({
      audio: {
        autoGainControl: false,
        channelCount: { ideal: 2 },
        echoCancellation: false,
        noiseSuppression: false,
      },
    });
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

  test("treats missing channel count metadata as mono-safe input", async () => {
    const track = {
      getSettings: () => ({}),
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
      createChannelSplitter: () => {
        throw new Error("stereo splitter should not be used when channel count is unknown");
      },
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

  test("stops tracks when audio context creation fails after stream acquisition", async () => {
    let stopped = 0;
    const track = {
      getSettings: () => ({ channelCount: 1 }),
      stop: () => {
        stopped += 1;
      },
    };
    const stream = {
      getAudioTracks: () => [track],
      getTracks: () => [track],
    };

    await expect(
      createMicProvider({
        createAudioContext: () => {
          throw new Error("context failed");
        },
        getUserMedia: async () => stream as unknown as MediaStream,
      }),
    ).rejects.toThrow("context failed");

    expect(stopped).toBe(1);
  });

  test("closes partial audio graph resources when analyser wiring throws", async () => {
    let stopped = 0;
    let closed = 0;
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

    await expect(
      createMicProvider({
        createAudioContext: () =>
          ({
            sampleRate: 48_000,
            close: async () => {
              closed += 1;
            },
            createAnalyser: analyser,
            createChannelSplitter: () => {
              throw new Error("splitter failed");
            },
            createMediaStreamSource: () => ({ connect: () => {}, disconnect: () => {} }),
          }) as unknown as AudioContext,
        getUserMedia: async () => stream as unknown as MediaStream,
      }),
    ).rejects.toThrow("splitter failed");

    expect(stopped).toBe(1);
    expect(closed).toBe(1);
  });
});
