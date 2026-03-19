import { describe, expect, test } from "bun:test";

import { createPlayerStore } from "../store";

describe("createPlayerStore", () => {
  test("transitions idle to loading to ready with persisted controls", () => {
    const store = createPlayerStore();

    store.transitionToLoading();
    store.transitionToReady({
      currentTime: 12,
      duration: 120,
      sourceId: "media-element",
      rate: 1.25,
      volume: 0.4,
    });

    expect(store.getSnapshot()).toEqual({
      status: "ready",
      currentTime: 12,
      duration: 120,
      sourceId: "media-element",
      error: null,
      rate: 1.25,
      volume: 0.4,
    });
  });

  test("keeps correlated runtime fields coherent across playback transitions", () => {
    const store = createPlayerStore();

    store.transitionToReady({
      currentTime: 4,
      duration: 180,
      sourceId: "fallback",
      rate: 1,
      volume: 1,
    });
    store.transitionToPlaying();
    store.syncTimeline({ currentTime: 24 });
    store.setRate(1.5);
    store.setVolume(0.25);
    store.transitionToRecovering();
    store.transitionToPaused();
    store.transitionToError({ error: "network failed" });

    expect(store.getSnapshot()).toEqual({
      status: "error",
      currentTime: 24,
      duration: 180,
      sourceId: "fallback",
      error: "network failed",
      rate: 1.5,
      volume: 0.25,
    });
  });
});
