import { describe, expect, mock, test } from "bun:test";
import type { AudioSource } from "../../sources/audio-source";
import { createFallbackSource } from "../../sources/fallback-source";
import { createMediaElementSource } from "../../sources/media-element-source";
import { createWebCodecsSource } from "../../sources/webcodecs-source";
import { createWorkletPCMSource } from "../../sources/worklet-pcm-source";
import { AudioEngine } from "../engine";

const TEST_CAPABILITIES: AudioSource["capabilities"] = {
  streaming: true,
  sampleAccurateSeek: false,
  gapless: "best-effort",
  loudnessMetadata: false,
  requiresUserGesture: true,
  requiresSAB: false,
};

const createAudioStub = ({
  canPlayType = () => "probably",
  duration = 180,
}: {
  canPlayType?: (mimeType: string) => string;
  duration?: number;
} = {}) => {
  let src = "";
  const listeners = new Map<string, Set<() => void>>();

  return {
    currentTime: 0,
    duration,
    canPlayType,
    play: async () => {
      for (const listener of listeners.get("play") ?? []) {
        listener();
      }
    },
    pause: () => {
      for (const listener of listeners.get("pause") ?? []) {
        listener();
      }
    },
    load: () => {},
    removeAttribute: (name: string) => {
      if (name === "src") {
        src = "";
      }
    },
    addEventListener: (type: string, listener: () => void) => {
      const nextListeners = listeners.get(type) ?? new Set();
      nextListeners.add(listener);
      listeners.set(type, nextListeners);
    },
    removeEventListener: (type: string, listener: () => void) => {
      listeners.get(type)?.delete(listener);
    },
    emit: (type: string) => {
      for (const listener of listeners.get(type) ?? []) {
        listener();
      }
    },
    set src(value: string) {
      src = value;
    },
    get src() {
      return src;
    },
  };
};

describe("AudioEngine recovery", () => {
  test("falls back to the next source when the first source fails to load", async () => {
    let firstAttempts = 0;
    let secondAttempts = 0;

    const firstSource = {
      id: "webcodecs",
      capabilities: TEST_CAPABILITIES,
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
      capabilities: TEST_CAPABILITIES,
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

  test("skips sources whose canPlay check throws", async () => {
    let secondAttempts = 0;

    const firstSource = {
      id: "broken-source",
      capabilities: TEST_CAPABILITIES,
      canPlay: async () => {
        throw new Error("capability probe failed");
      },
      score: () => 100,
      load: async () => {},
      play: async () => {},
      pause: async () => {},
      seek: async () => {},
      getTimeline: () => ({ currentTime: 0, duration: 180 }),
      destroy: async () => {},
    };

    const secondSource = {
      id: "media-element",
      capabilities: TEST_CAPABILITIES,
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

    expect(secondAttempts).toBe(1);
    expect(engine.getSnapshot().sourceId).toBe("media-element");
  });

  test("preserves checkpoint time when recovery succeeds", async () => {
    const firstSource = {
      id: "webcodecs",
      capabilities: TEST_CAPABILITIES,
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
      capabilities: TEST_CAPABILITIES,
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

  test("logs failed recovery attempts before falling through to the next source", async () => {
    const consoleError = mock((_message: string, _error: unknown) => {});
    const originalConsoleError = console.error;
    console.error = consoleError as typeof console.error;

    try {
      const firstSource = {
        id: "webcodecs",
        capabilities: TEST_CAPABILITIES,
        canPlay: async () => true,
        score: () => 100,
        load: async () => {
          throw new Error("decode failed");
        },
        play: async () => {},
        pause: async () => {},
        seek: async () => {},
        getTimeline: () => ({ currentTime: 0, duration: 180 }),
        destroy: async () => {},
      };

      const secondSource = {
        id: "media-element",
        capabilities: TEST_CAPABILITIES,
        canPlay: async () => true,
        score: () => 50,
        load: async () => {},
        play: async () => {},
        pause: async () => {},
        seek: async () => {},
        getTimeline: () => ({ currentTime: 0, duration: 180 }),
        destroy: async () => {},
      };

      const engine = new AudioEngine({
        sources: [firstSource, secondSource],
      });

      await engine.load({
        src: "/audio/test-tone-aac.m4a",
        mimeType: "audio/mp4; codecs=mp4a.40.2",
      });

      expect(consoleError).toHaveBeenCalledTimes(1);
      expect(consoleError).toHaveBeenCalledWith(
        '[audio-engine] load failed for source "webcodecs"',
        expect.any(Error),
      );
      expect(engine.getSnapshot().sourceId).toBe("media-element");
    } finally {
      console.error = originalConsoleError;
    }
  });

  test("falls through when checkpoint restore seek fails on a source", async () => {
    const firstSource = {
      id: "webcodecs",
      capabilities: TEST_CAPABILITIES,
      canPlay: async () => true,
      score: () => 100,
      load: async () => {},
      play: async () => {},
      pause: async () => {},
      seek: async () => {
        throw new Error("restore seek failed");
      },
      getTimeline: () => ({ currentTime: 0, duration: 180 }),
      destroy: async () => {},
    };

    const secondSource = {
      id: "media-element",
      capabilities: TEST_CAPABILITIES,
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

    expect(engine.getSnapshot()).toMatchObject({
      status: "ready",
      currentTime: 24,
      sourceId: "media-element",
    });
  });

  test("prefers WorkletPCMSource over fallback when worklet transport is available", async () => {
    const fallback = createFallbackSource({
      currentTime: 0,
      duration: 180,
      src: "",
      canPlayType: () => "probably",
      play: async () => {},
      pause: () => {},
      load: () => {},
      removeAttribute: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
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
      canPlayType: () => "probably",
      play: async () => {},
      pause: () => {},
      load: () => {},
      removeAttribute: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
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
      addEventListener: () => {},
      removeEventListener: () => {},
    });
    const webCodecs = createWebCodecsSource({
      globals: { AudioDecoder: class AudioDecoder {} },
      demuxer: {
        isConfigured: () => true,
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
      addEventListener: () => {},
      removeEventListener: () => {},
    });
    const webCodecs = createWebCodecsSource({
      globals: { AudioDecoder: class AudioDecoder {} },
      demuxer: {
        isConfigured: () => true,
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

  test("updates engine status from native media events", async () => {
    const audio = createAudioStub();
    const mediaElement = createMediaElementSource(audio);
    const engine = new AudioEngine({
      sources: [mediaElement],
    });

    await engine.load({
      src: "/audio/test-tone-aac.m4a",
      mimeType: "audio/mp4; codecs=mp4a.40.2",
    });

    audio.emit("play");
    expect(engine.getSnapshot().status).toBe("playing");

    audio.emit("pause");
    expect(engine.getSnapshot().status).toBe("paused");
  });

  test("rewinds to the beginning when native playback ends", async () => {
    const audio = createAudioStub();
    const mediaElement = createMediaElementSource(audio);
    const engine = new AudioEngine({
      sources: [mediaElement],
    });

    await engine.load({
      src: "/audio/test-tone-aac.m4a",
      mimeType: "audio/mp4; codecs=mp4a.40.2",
    });
    await engine.seek(48);

    audio.emit("ended");

    expect(audio.currentTime).toBe(0);
    expect(engine.getSnapshot().currentTime).toBe(0);
    expect(engine.getSnapshot().status).toBe("paused");
  });

  test("tears down the previous source before loading a replacement track", async () => {
    let pauseCalls = 0;
    let destroyCalls = 0;

    const firstSource = {
      id: "first",
      capabilities: TEST_CAPABILITIES,
      canPlay: async (input: { src: string }) => input.src === "/audio/first.m4a",
      score: () => 100,
      load: async () => {},
      play: async () => {},
      pause: async () => {
        pauseCalls += 1;
      },
      seek: async () => {},
      getTimeline: () => ({ currentTime: 0, duration: 180 }),
      destroy: async () => {
        destroyCalls += 1;
      },
    };

    const secondSource = {
      id: "second",
      capabilities: TEST_CAPABILITIES,
      canPlay: async (input: { src: string }) => input.src === "/audio/second.m4a",
      score: () => 100,
      load: async () => {},
      play: async () => {},
      pause: async () => {},
      seek: async () => {},
      getTimeline: () => ({ currentTime: 0, duration: 120 }),
      destroy: async () => {},
    };

    const engine = new AudioEngine({
      sources: [firstSource, secondSource],
    });

    await engine.load({
      src: "/audio/first.m4a",
      mimeType: "audio/mp4; codecs=mp4a.40.2",
    });
    await engine.play();
    await engine.load({
      src: "/audio/second.m4a",
      mimeType: "audio/mp4; codecs=mp4a.40.2",
    });

    expect(pauseCalls).toBe(1);
    expect(destroyCalls).toBe(1);
    expect(engine.getSnapshot().sourceId).toBe("second");
  });

  test("continues teardown when pause fails before loading a replacement track", async () => {
    let pauseCalls = 0;
    let destroyCalls = 0;

    const firstSource = {
      id: "first",
      capabilities: TEST_CAPABILITIES,
      canPlay: async (input: { src: string }) => input.src === "/audio/first.m4a",
      score: () => 100,
      load: async () => {},
      play: async () => {},
      pause: async () => {
        pauseCalls += 1;
        throw new Error("pause failed");
      },
      seek: async () => {},
      getTimeline: () => ({ currentTime: 0, duration: 180 }),
      destroy: async () => {
        destroyCalls += 1;
      },
    };

    const secondSource = {
      id: "second",
      capabilities: TEST_CAPABILITIES,
      canPlay: async (input: { src: string }) => input.src === "/audio/second.m4a",
      score: () => 100,
      load: async () => {},
      play: async () => {},
      pause: async () => {},
      seek: async () => {},
      getTimeline: () => ({ currentTime: 0, duration: 120 }),
      destroy: async () => {},
    };

    const engine = new AudioEngine({
      sources: [firstSource, secondSource],
    });

    await engine.load({
      src: "/audio/first.m4a",
      mimeType: "audio/mp4; codecs=mp4a.40.2",
    });
    await engine.play();
    await engine.load({
      src: "/audio/second.m4a",
      mimeType: "audio/mp4; codecs=mp4a.40.2",
    });

    expect(pauseCalls).toBe(1);
    expect(destroyCalls).toBe(1);
    expect(engine.getSnapshot().sourceId).toBe("second");
  });

  test("clears active source state when a replacement load fails", async () => {
    let pauseCalls = 0;
    let destroyCalls = 0;

    const source = {
      id: "source",
      capabilities: TEST_CAPABILITIES,
      canPlay: async (input: { src: string }) => input.src === "/audio/first.m4a",
      score: () => 100,
      load: async () => {},
      play: async () => {},
      pause: async () => {
        pauseCalls += 1;
      },
      seek: async () => {},
      getTimeline: () => ({ currentTime: 0, duration: 180 }),
      destroy: async () => {
        destroyCalls += 1;
      },
    };

    const engine = new AudioEngine({
      sources: [source],
    });

    await engine.load({
      src: "/audio/first.m4a",
      mimeType: "audio/mp4; codecs=mp4a.40.2",
    });
    await engine.play();
    await expect(
      engine.load({
        src: "/audio/missing.flac",
        mimeType: "audio/flac",
      }),
    ).rejects.toThrow("Unable to load audio source");

    expect(pauseCalls).toBe(1);
    expect(destroyCalls).toBe(1);
    expect(engine.getSnapshot().status).toBe("error");
    expect(engine.getSnapshot().sourceId).toBeNull();
  });
});
