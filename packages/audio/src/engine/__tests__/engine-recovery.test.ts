import { describe, expect, test } from "bun:test";

import { AudioEngine } from "../engine";

describe("AudioEngine recovery", () => {
  test("falls back to the next source when the first source fails to load", async () => {
    let firstAttempts = 0;
    let secondAttempts = 0;

    const firstSource = {
      id: "webcodecs",
      canPlay: async () => true,
      score: () => 100,
      load: async () => {
        firstAttempts += 1;
        throw new Error("decode failed");
      },
      play: async () => {},
      pause: async () => {},
      seek: async () => {},
      getTimeline: () => ({ currentTime: 12, duration: 180 }),
      destroy: async () => {},
    };

    const secondSource = {
      id: "media-element",
      canPlay: async () => true,
      score: () => 50,
      load: async () => {
        secondAttempts += 1;
      },
      play: async () => {},
      pause: async () => {},
      seek: async () => {},
      getTimeline: () => ({ currentTime: 12, duration: 180 }),
      destroy: async () => {},
    };

    const engine = new AudioEngine({
      sources: [firstSource, secondSource],
    });

    await engine.load({
      src: "/audio/test-tone-aac.m4a",
      mimeType: "audio/mp4; codecs=mp4a.40.2",
    });

    expect(firstAttempts).toBe(1);
    expect(secondAttempts).toBe(1);
    expect(engine.getSnapshot().sourceId).toBe("media-element");
  });

  test("preserves checkpoint time when recovery succeeds", async () => {
    const firstSource = {
      id: "webcodecs",
      canPlay: async () => true,
      score: () => 100,
      load: async () => {
        throw new Error("decode failed");
      },
      play: async () => {},
      pause: async () => {},
      seek: async () => {},
      getTimeline: () => ({ currentTime: 24, duration: 180 }),
      destroy: async () => {},
    };

    const secondSource = {
      id: "media-element",
      canPlay: async () => true,
      score: () => 50,
      load: async () => {},
      play: async () => {},
      pause: async () => {},
      seek: async () => {},
      getTimeline: () => ({ currentTime: 24, duration: 180 }),
      destroy: async () => {},
    };

    const engine = new AudioEngine({
      sources: [firstSource, secondSource],
    });

    await engine.seek(24);
    await engine.load({
      src: "/audio/test-tone-aac.m4a",
      mimeType: "audio/mp4; codecs=mp4a.40.2",
    });

    expect(engine.getSnapshot().currentTime).toBe(24);
    expect(engine.getSnapshot().status).toBe("ready");
  });
});
