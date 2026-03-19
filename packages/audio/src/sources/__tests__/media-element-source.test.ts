import { describe, expect, test } from "bun:test";

import { createMediaElementSource } from "../media-element-source";

const createAudioStub = () => {
  let src = "";
  const listeners = new Map<string, Set<() => void>>();

  return {
    currentTime: 0,
    duration: 0,
    playbackRate: 1,
    volume: 1,
    canPlayType: (mimeType: string) => (mimeType.includes("audio/") ? "probably" : ""),
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

describe("createMediaElementSource", () => {
  test("loads, seeks, and destroys the media element", async () => {
    const audio = createAudioStub();
    const source = createMediaElementSource(audio);

    await source.load({
      src: "/audio/test-tone-aac.m4a",
      mimeType: "audio/mp4; codecs=mp4a.40.2",
    });
    await source.seek(32);
    await source.destroy();

    expect(audio.currentTime).toBe(32);
    expect(audio.src).toBe("");
  });

  test("delegates play to the media element", async () => {
    let playCalls = 0;
    const audio = {
      ...createAudioStub(),
      play: async () => {
        playCalls += 1;
      },
    };
    const source = createMediaElementSource(audio);

    await source.play();

    expect(playCalls).toBe(1);
  });

  test("applies playback rate and volume to the media element", async () => {
    const audio = createAudioStub();
    const source = createMediaElementSource(audio);

    await source.setRate(1.5);
    await source.setVolume(0.3);

    expect(audio.playbackRate).toBe(1.5);
    expect(audio.volume).toBe(0.3);
  });

  test("subscribes to native playback events", () => {
    const audio = createAudioStub();
    const source = createMediaElementSource(audio);
    const events: Array<string | { type: string; error: Error }> = [];

    const unsubscribe = source.subscribePlayback?.((event) => {
      events.push(event);
    });

    audio.emit("play");
    audio.emit("pause");
    audio.emit("ended");
    unsubscribe?.();
    audio.emit("pause");

    expect(events).toEqual(["play", "pause", "ended"]);
  });

  test("forwards native error events to playback subscribers", () => {
    const audio = createAudioStub();
    const source = createMediaElementSource(audio);
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
});
