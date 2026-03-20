import { describe, expect, test } from "bun:test";

import { createFallbackSource } from "../fallback-source";
import { createMediaElementSource } from "../media-element-source";

const createAudioStub = () => {
  let src = "";
  const listeners = new Map<string, Set<() => void>>();

  return {
    currentTime: 0,
    duration: 0,
    playbackRate: 1,
    volume: 1,
    canPlayType: () => "probably",
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

describe("createFallbackSource", () => {
  test("exposes lower capabilities than the media element source", () => {
    const fallback = createFallbackSource(createAudioStub());
    const mediaElement = createMediaElementSource(createAudioStub());

    expect(fallback.score({ coopCoepEnabled: false, lowPowerModeLikely: false })).toBeLessThan(
      mediaElement.score({ coopCoepEnabled: false, lowPowerModeLikely: false }),
    );
    expect(fallback.capabilities.sampleAccurateSeek).toBe(false);
  });

  test("can still load and play a compatible input", async () => {
    let playCalls = 0;
    let loadCalls = 0;
    const audio = {
      ...createAudioStub(),
      play: async () => {
        playCalls += 1;
      },
      load: () => {
        loadCalls += 1;
      },
    };
    const source = createFallbackSource(audio);

    await source.load({
      src: "/audio/test-tone-opus.webm",
      mimeType: "audio/webm; codecs=opus",
    });
    await source.play();

    expect(audio.src).toBe("/audio/test-tone-opus.webm");
    expect(loadCalls).toBe(1);
    expect(playCalls).toBe(1);
  });

  test("treats inputs without mimeType as ineligible", async () => {
    const source = createFallbackSource({
      ...createAudioStub(),
      canPlayType: (mimeType: string) => (mimeType.includes("audio/") ? "probably" : ""),
    });

    await expect(
      source.canPlay({
        src: "/audio/test-tone-opus.webm",
      }),
    ).resolves.toBe(false);
  });

  test("rejects unsupported mime types during source selection", async () => {
    const source = createFallbackSource({
      ...createAudioStub(),
      canPlayType: () => "",
    });

    await expect(
      source.canPlay({
        src: "/audio/test-tone.flac",
        mimeType: "audio/flac",
      }),
    ).resolves.toBe(false);
  });

  test("applies playback rate and volume to the fallback element", async () => {
    const audio = createAudioStub();
    const source = createFallbackSource(audio);

    await source.setRate(0.8);
    await source.setVolume(0.6);

    expect(audio.playbackRate).toBe(0.8);
    expect(audio.volume).toBe(0.6);
  });

  test("subscribes to native playback events", () => {
    const audio = createAudioStub();
    const source = createFallbackSource(audio);
    const events: Array<string | { type: string; error: Error }> = [];

    const unsubscribe = source.subscribePlayback?.((event) => {
      events.push(event);
    });

    audio.emit("play");
    audio.emit("pause");
    unsubscribe?.();
    audio.emit("ended");

    expect(events).toEqual(["play", "pause"]);
  });

  test("forwards native error events to playback subscribers", () => {
    const audio = createAudioStub();
    const source = createFallbackSource(audio);
    const events: Array<string | { type: string; error: Error }> = [];

    source.subscribePlayback?.((event) => {
      events.push(event);
    });

    audio.emit("error");

    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({
      type: "error",
      error: expect.any(Error),
    });
  });

  test("maps fallback media error codes to readable messages", () => {
    const cases = [
      { code: 2, message: "Media element network error" },
      { code: 3, message: "Media element decode error" },
      { code: 4, message: "Media element source is not supported" },
      { code: 99, message: "Media element error" },
    ];

    for (const { code, message } of cases) {
      const audio = {
        ...createAudioStub(),
        error: { code },
      };
      const source = createFallbackSource(audio);
      const events: Array<string | { type: string; error: Error }> = [];

      source.subscribePlayback?.((event) => {
        events.push(event);
      });

      audio.emit("error");

      expect(events[0]).toMatchObject({
        type: "error",
        error: expect.objectContaining({ message }),
      });
    }
  });
});
