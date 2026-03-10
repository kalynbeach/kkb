import { describe, expect, test } from "bun:test";

import { AudioEngine } from "../engine";
import { createFallbackSource } from "../../sources/fallback-source";
import { createMediaElementSource } from "../../sources/media-element-source";
import { createWebCodecsSource } from "../../sources/webcodecs-source";
import { createWorkletPCMSource } from "../../sources/worklet-pcm-source";

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

  test("prefers WorkletPCMSource over fallback when worklet transport is available", async () => {
    const fallback = createFallbackSource({
      currentTime: 0,
      duration: 180,
      src: "",
      play: async () => {},
      pause: () => {},
      load: () => {},
      removeAttribute: () => {},
    });
    const worklet = createWorkletPCMSource({
      transport: {
        available: true,
        postMessage: () => {},
      },
      timeline: {
        currentTime: 0,
        duration: 180,
      },
    });

    const engine = new AudioEngine({
      sources: [fallback, worklet],
    });

    await engine.load({
      src: "/audio/test-tone-opus.webm",
      mimeType: "audio/webm; codecs=opus",
    });

    expect(engine.getSnapshot().sourceId).toBe("worklet-pcm");
  });

  test("falls through to fallback when worklet transport is unavailable", async () => {
    const fallback = createFallbackSource({
      currentTime: 0,
      duration: 180,
      src: "",
      play: async () => {},
      pause: () => {},
      load: () => {},
      removeAttribute: () => {},
    });
    const worklet = createWorkletPCMSource({
      transport: {
        available: false,
        postMessage: () => {},
      },
      timeline: {
        currentTime: 0,
        duration: 180,
      },
    });

    const engine = new AudioEngine({
      sources: [fallback, worklet],
    });

    await engine.load({
      src: "/audio/test-tone-opus.webm",
      mimeType: "audio/webm; codecs=opus",
    });

    expect(engine.getSnapshot().sourceId).toBe("fallback");
  });

  test("prefers WebCodecsSource over media element when the input is eligible", async () => {
    const mediaElement = createMediaElementSource({
      currentTime: 0,
      duration: 180,
      src: "",
      canPlayType: () => "probably",
      play: async () => {},
      pause: () => {},
      load: () => {},
      removeAttribute: () => {},
    });
    const webCodecs = createWebCodecsSource({
      globals: { AudioDecoder: class AudioDecoder {} },
      demuxer: {
        supports: () => true,
        load: async () => {},
      },
      timeline: {
        currentTime: 0,
        duration: 180,
      },
    });

    const engine = new AudioEngine({
      sources: [mediaElement, webCodecs],
    });

    await engine.load({
      src: "/audio/test-tone-opus.webm",
      mimeType: "audio/webm; codecs=opus",
    });

    expect(engine.getSnapshot().sourceId).toBe("webcodecs");
  });

  test("falls back to MediaElementSource on WebCodecs load failure", async () => {
    let mediaElementLoads = 0;
    const mediaElement = createMediaElementSource({
      currentTime: 0,
      duration: 180,
      src: "",
      canPlayType: () => "probably",
      play: async () => {},
      pause: () => {},
      load: () => {
        mediaElementLoads += 1;
      },
      removeAttribute: () => {},
    });
    const webCodecs = createWebCodecsSource({
      globals: { AudioDecoder: class AudioDecoder {} },
      demuxer: {
        supports: () => true,
        load: async () => {
          throw new Error("decoder init failed");
        },
      },
      timeline: {
        currentTime: 0,
        duration: 180,
      },
    });

    const engine = new AudioEngine({
      sources: [mediaElement, webCodecs],
    });

    await engine.load({
      src: "/audio/test-tone-opus.webm",
      mimeType: "audio/webm; codecs=opus",
    });

    expect(mediaElementLoads).toBe(1);
    expect(engine.getSnapshot().sourceId).toBe("media-element");
  });
});
