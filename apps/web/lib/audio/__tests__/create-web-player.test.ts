import { describe, expect, test } from "bun:test";

import { createWebPlayer } from "../create-web-player";

const createAudioStub = ({
  canPlayType = () => "probably",
}: {
  canPlayType?: (mimeType: string) => string;
} = {}) => {
  let src = "";
  const listeners = new Map<string, Set<() => void>>();

  return {
    currentTime: 0,
    duration: 180,
    buffered: {
      length: 1,
      start: () => 0,
      end: () => 30,
    },
    canPlayType,
    play: async () => {},
    pause: () => {},
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
    set src(value: string) {
      src = value;
    },
    get src() {
      return src;
    },
  };
};

describe("createWebPlayer", () => {
  test("wires engine and sources into one player instance", () => {
    const player = createWebPlayer({
      createMediaElement: createAudioStub,
      createFallbackElement: createAudioStub,
    });

    expect(player).toHaveProperty("engine");
    expect(player).toHaveProperty("sources");
    expect(player.sources).toHaveLength(4);
    expect(typeof player.getSnapshot).toBe("function");
    expect(typeof player.subscribe).toBe("function");
  });

  test("reports timeline updates from the active worklet source", async () => {
    const player = createWebPlayer({
      createMediaElement: () =>
        createAudioStub({
          canPlayType: () => "",
        }),
      createFallbackElement: () =>
        createAudioStub({
          canPlayType: () => "",
        }),
      enableWorkletPCM: true,
    });

    await player.loadTrack({
      src: "/audio/test-tone-opus.webm",
      mimeType: "audio/webm; codecs=opus",
    });
    await player.seek(12);

    expect(player.getSnapshot().sourceId).toBe("worklet-pcm");
    expect(player.getTimeline().currentTime).toBe(12);
    expect(player.getBufferedRanges()).toEqual([]);
  });

  test("reports timeline updates from the active webcodecs source", async () => {
    const originalAudioDecoder = globalThis.AudioDecoder;
    globalThis.AudioDecoder = class AudioDecoder {};

    try {
      const player = createWebPlayer({
        createMediaElement: createAudioStub,
        createFallbackElement: createAudioStub,
        enableWebCodecs: true,
      });

      await player.loadTrack(player.defaultTrack);
      await player.seek(18);

      expect(player.getSnapshot().sourceId).toBe("webcodecs");
      expect(player.getTimeline().currentTime).toBe(18);
      expect(player.getBufferedRanges()).toEqual([]);
    } finally {
      globalThis.AudioDecoder = originalAudioDecoder;
    }
  });
});
