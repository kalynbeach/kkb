import { describe, expect, test } from "bun:test";

import type { PlaybackEvent } from "../../sources/audio-source";
import { AudioEngine } from "../engine";

const createSource = ({
  id = "media-element",
  canPlay = async () => true,
  play,
  pause,
  seek,
  setRate,
  setVolume,
  getTimeline,
}: {
  id?: string;
  canPlay?: (input: { src: string; mimeType?: string }) => Promise<boolean>;
  play?: () => Promise<void>;
  pause?: () => Promise<void>;
  seek?: (seconds: number) => Promise<void>;
  setRate?: (rate: number) => Promise<void>;
  setVolume?: (volume: number) => Promise<void>;
  getTimeline?: () => { currentTime: number; duration: number };
} = {}) => {
  let listener: ((event: PlaybackEvent) => void) | undefined;

  return {
    source: {
      id,
      capabilities: {
        streaming: true,
        sampleAccurateSeek: false,
        gapless: "best-effort" as const,
        loudnessMetadata: false,
        requiresUserGesture: true,
        requiresSAB: false,
      },
      canPlay,
      score: () => 1,
      load: async () => {},
      play: play ?? (async () => {}),
      pause: pause ?? (async () => {}),
      seek: seek ?? (async () => {}),
      setRate: setRate ?? (async () => {}),
      setVolume: setVolume ?? (async () => {}),
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
  test("rejects construction without available sources", () => {
    expect(() => new AudioEngine({ sources: [] })).toThrow(
      "AudioEngine requires at least one source",
    );
  });

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

  test("records an error state when pause fails", async () => {
    const engine = new AudioEngine({
      sources: [
        createSource({
          pause: async () => {
            throw new Error("pause blocked");
          },
        }).source,
      ],
    });

    await engine.load({
      src: "/audio/test-tone-aac.m4a",
      mimeType: "audio/mp4; codecs=mp4a.40.2",
    });

    await expect(engine.pause()).rejects.toThrow("pause blocked");
    expect(engine.getSnapshot()).toMatchObject({
      status: "error",
      error: "pause blocked",
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

    emit({ type: "ended" });
    await Promise.resolve();
    await Promise.resolve();

    expect(engine.getSnapshot()).toMatchObject({
      status: "error",
      error: "seek reset failed",
      sourceId: "media-element",
    });
  });

  test("guards play and pause when no source is active", async () => {
    const engine = new AudioEngine({ sources: [createSource().source] });

    await expect(engine.play()).resolves.toBeUndefined();
    await expect(engine.pause()).resolves.toBeUndefined();

    expect(engine.getSnapshot().status).toBe("idle");
  });

  test("rejects invalid seek values before a source is active", async () => {
    const engine = new AudioEngine({ sources: [createSource().source] });

    for (const invalidSeek of [Number.NaN, -1, Number.POSITIVE_INFINITY]) {
      await expect(engine.seek(invalidSeek)).rejects.toThrow(
        "Seek time must be a finite number greater than or equal to 0",
      );
      expect(engine.getSnapshot()).toMatchObject({
        status: "error",
        currentTime: 0,
        duration: 0,
        sourceId: null,
        error: "Seek time must be a finite number greater than or equal to 0",
      });
    }
  });

  test("rejects seeks beyond the known duration", async () => {
    const engine = new AudioEngine({
      sources: [
        createSource({
          getTimeline: () => ({ currentTime: 12, duration: 180 }),
        }).source,
      ],
    });

    await engine.load({
      src: "/audio/test-tone-aac.m4a",
      mimeType: "audio/mp4; codecs=mp4a.40.2",
    });

    await expect(engine.seek(181)).rejects.toThrow("Seek time exceeds the loaded track duration");
    expect(engine.getSnapshot()).toMatchObject({
      status: "error",
      currentTime: 12,
      duration: 180,
      sourceId: "media-element",
      error: "Seek time exceeds the loaded track duration",
    });
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

  test("preserves the original runtime error when timeline reads fail during error handling", async () => {
    let throwTimelineError = false;
    const engine = new AudioEngine({
      sources: [
        createSource({
          play: async () => {
            throw new Error("gesture required");
          },
          getTimeline: () => {
            if (!throwTimelineError) {
              return { currentTime: 12, duration: 180 };
            }
            throw new Error("timeline unavailable");
          },
        }).source,
      ],
    });

    await engine.load({
      src: "/audio/test-tone-aac.m4a",
      mimeType: "audio/mp4; codecs=mp4a.40.2",
    });

    throwTimelineError = true;
    await expect(engine.play()).rejects.toThrow("gesture required");
    expect(engine.getSnapshot()).toMatchObject({
      status: "error",
      sourceId: "media-element",
      error: "gesture required",
    });
  });

  test("records ended-event timeline failures without masking the original error", async () => {
    let throwTimelineError = false;
    const { source, emit } = createSource({
      getTimeline: () => {
        if (!throwTimelineError) {
          return { currentTime: 12, duration: 180 };
        }
        throw new Error("timeline unavailable");
      },
    });
    const engine = new AudioEngine({ sources: [source] });

    await engine.load({
      src: "/audio/test-tone-aac.m4a",
      mimeType: "audio/mp4; codecs=mp4a.40.2",
    });

    throwTimelineError = true;
    emit({ type: "ended" });
    await Promise.resolve();
    await Promise.resolve();

    expect(engine.getSnapshot()).toMatchObject({
      status: "error",
      sourceId: "media-element",
      error: "timeline unavailable",
    });
  });

  test("persists rate and volume across source switches and resets them on destroy", async () => {
    const firstRateCalls: number[] = [];
    const firstVolumeCalls: number[] = [];
    const secondRateCalls: number[] = [];
    const secondVolumeCalls: number[] = [];
    const firstSource = createSource({
      id: "media-element",
      canPlay: async (input) => input.mimeType?.includes("mp4") ?? false,
      setRate: async (rate) => {
        firstRateCalls.push(rate);
      },
      setVolume: async (volume) => {
        firstVolumeCalls.push(volume);
      },
    }).source;
    const secondSource = createSource({
      id: "fallback",
      canPlay: async (input) => input.mimeType?.includes("webm") ?? false,
      setRate: async (rate) => {
        secondRateCalls.push(rate);
      },
      setVolume: async (volume) => {
        secondVolumeCalls.push(volume);
      },
    }).source;
    const engine = new AudioEngine({ sources: [firstSource, secondSource] });

    await engine.load({
      src: "/audio/test-tone-aac.m4a",
      mimeType: "audio/mp4; codecs=mp4a.40.2",
    });
    await engine.setRate(1.5);
    await engine.setVolume(0.4);

    expect(engine.getSnapshot()).toMatchObject({
      sourceId: "media-element",
      rate: 1.5,
      volume: 0.4,
    });
    expect(firstRateCalls).toEqual([1, 1.5]);
    expect(firstVolumeCalls).toEqual([1, 0.4]);

    await engine.load({
      src: "/audio/test-tone-opus.webm",
      mimeType: "audio/webm; codecs=opus",
    });

    expect(engine.getSnapshot()).toMatchObject({
      sourceId: "fallback",
      rate: 1.5,
      volume: 0.4,
    });
    expect(secondRateCalls).toEqual([1.5]);
    expect(secondVolumeCalls).toEqual([0.4]);

    await engine.destroy();

    expect(engine.getSnapshot()).toMatchObject({
      status: "idle",
      sourceId: null,
      rate: 1,
      volume: 1,
    });
  });
});
