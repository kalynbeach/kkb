import { describe, expect, test } from "bun:test";

import { createFallbackSource } from "../fallback-source";
import { createMediaElementSource } from "../media-element-source";

const createAudioStub = () => {
  let src = "";
  const listeners = new Map<string, Set<() => void>>();

  return {
    currentTime: 0,
    duration: 0,
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
    const audio = {
      ...createAudioStub(),
      play: async () => {
        playCalls += 1;
      },
    };
    const source = createFallbackSource(audio);

    await source.load({
      src: "/audio/test-tone-opus.webm",
      mimeType: "audio/webm; codecs=opus",
    });
    await source.play();

    expect(audio.src).toBe("/audio/test-tone-opus.webm");
    expect(playCalls).toBe(1);
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

  test("subscribes to native playback events", () => {
    const audio = createAudioStub();
    const source = createFallbackSource(audio);
    const events: string[] = [];

    const unsubscribe = source.subscribePlayback?.((event) => {
      events.push(event);
    });

    audio.emit("play");
    audio.emit("pause");
    unsubscribe?.();
    audio.emit("ended");

    expect(events).toEqual(["play", "pause"]);
  });
});
