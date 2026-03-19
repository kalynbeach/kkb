import { describe, expect, test } from "bun:test";

import { createWorkletPCMSource } from "../worklet-pcm-source";

describe("createWorkletPCMSource", () => {
  test("reports sample-accurate capabilities and forwards play pause seek commands", async () => {
    const messages: unknown[] = [];
    const source = createWorkletPCMSource({
      transport: {
        available: true,
        postMessage: (message) => {
          messages.push(message);
        },
      },
      timeline: {
        currentTime: 0,
        duration: 180,
      },
    });

    await source.play();
    await source.pause();
    await source.seek(24);

    expect(source.capabilities.sampleAccurateSeek).toBe(true);
    expect(source.capabilities.gapless).toBe(true);
    expect(source.getTimeline()).toEqual({ currentTime: 24, duration: 180 });
    expect(messages).toEqual([{ type: "play" }, { type: "pause" }, { type: "seek", seconds: 24 }]);
  });

  test("accepts playback rate and volume updates even when transport support is not wired", async () => {
    const source = createWorkletPCMSource({
      transport: {
        available: true,
        postMessage: () => {},
      },
      timeline: {
        currentTime: 0,
        duration: 180,
      },
    });

    await expect(source.setRate(1.25)).resolves.toBeUndefined();
    await expect(source.setVolume(0.5)).resolves.toBeUndefined();
    expect(source.getTimeline()).toEqual({ currentTime: 0, duration: 180 });
  });
});
