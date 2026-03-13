import { describe, expect, test } from "bun:test";

import type { PlaybackEvent } from "../../sources/audio-source";
import { AudioEngine } from "../engine";

const createSource = ({
  play,
  pause,
  seek,
  getTimeline,
}: {
  play?: () => Promise<void>;
  pause?: () => Promise<void>;
  seek?: (seconds: number) => Promise<void>;
  getTimeline?: () => { currentTime: number; duration: number };
} = {}) => {
  let listener: ((event: PlaybackEvent) => void) | undefined;

  return {
    source: {
      id: "media-element",
      capabilities: {
        streaming: true,
        sampleAccurateSeek: false,
        gapless: "best-effort" as const,
        loudnessMetadata: false,
        requiresUserGesture: true,
        requiresSAB: false,
      },
      canPlay: async () => true,
      score: () => 1,
      load: async () => {},
      play: play ?? (async () => {}),
      pause: pause ?? (async () => {}),
      seek: seek ?? (async () => {}),
      getTimeline: getTimeline ?? (() => ({ currentTime: 12, duration: 180 })),
      destroy: async () => {},
      subscribePlayback: (nextListener: (event: PlaybackEvent) => void) => {
        listener = nextListener;
        return () => {
          listener = undefined;
        };
      },
    },
    emit: (event: PlaybackEvent) => {
      listener?.(event);
    },
  };
};

describe("AudioEngine runtime behavior", () => {
  test("records an error state when play fails", async () => {
    const engine = new AudioEngine({
      sources: [
        createSource({
          play: async () => {
            throw new Error("gesture required");
          },
        }).source,
      ],
    });

    await engine.load({
      src: "/audio/test-tone-aac.m4a",
      mimeType: "audio/mp4; codecs=mp4a.40.2",
    });

    await expect(engine.play()).rejects.toThrow("gesture required");
    expect(engine.getSnapshot()).toMatchObject({
      status: "error",
      error: "gesture required",
      sourceId: "media-element",
    });
  });

  test("records an error state when the active source emits an error event", async () => {
    const { source, emit } = createSource();
    const engine = new AudioEngine({ sources: [source] });

    await engine.load({
      src: "/audio/test-tone-aac.m4a",
      mimeType: "audio/mp4; codecs=mp4a.40.2",
    });

    emit({
      type: "error",
      error: new Error("network failed"),
    });

    expect(engine.getSnapshot()).toMatchObject({
      status: "error",
      error: "network failed",
      sourceId: "media-element",
    });
  });

  test("records an error state when ended handling fails", async () => {
    const { source, emit } = createSource({
      seek: async () => {
        throw new Error("seek reset failed");
      },
    });
    const engine = new AudioEngine({ sources: [source] });

    await engine.load({
      src: "/audio/test-tone-aac.m4a",
      mimeType: "audio/mp4; codecs=mp4a.40.2",
    });

    emit("ended");
    await Promise.resolve();
    await Promise.resolve();

    expect(engine.getSnapshot()).toMatchObject({
      status: "error",
      error: "seek reset failed",
      sourceId: "media-element",
    });
  });

  test("guards play and pause when no source is active", async () => {
    const engine = new AudioEngine({ sources: [] });

    await expect(engine.play()).resolves.toBeUndefined();
    await expect(engine.pause()).resolves.toBeUndefined();

    expect(engine.getSnapshot().status).toBe("idle");
  });

  test("rolls back optimistic state when active-source seek fails", async () => {
    let timelineCurrentTime = 12;
    const { source } = createSource({
      seek: async () => {
        throw new Error("seek failed");
      },
      getTimeline: () => ({ currentTime: timelineCurrentTime, duration: 180 }),
    });
    const engine = new AudioEngine({ sources: [source] });

    await engine.load({
      src: "/audio/test-tone-aac.m4a",
      mimeType: "audio/mp4; codecs=mp4a.40.2",
    });

    timelineCurrentTime = 999;

    await expect(engine.seek(42)).rejects.toThrow("seek failed");
    expect(engine.getSnapshot()).toMatchObject({
      status: "error",
      currentTime: 12,
      duration: 180,
      sourceId: "media-element",
      error: "seek failed",
    });
  });
});
