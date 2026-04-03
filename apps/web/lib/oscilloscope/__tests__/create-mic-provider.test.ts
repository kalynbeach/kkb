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
});
