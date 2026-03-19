import { describe, expect, test } from "bun:test";

import { createPlayerStore } from "../store";

describe("createPlayerStore subscriptions", () => {
  test("notifies active listeners with fresh snapshot objects on named transitions", () => {
    const store = createPlayerStore();
    let notifications = 0;
    const snapshots = [store.getSnapshot()];

    const unsubscribe = store.subscribe(() => {
      notifications += 1;
      snapshots.push(store.getSnapshot());
    });

    store.transitionToLoading();
    store.transitionToReady({
      currentTime: 0,
      duration: 180,
      sourceId: "media-element",
      rate: 1,
      volume: 1,
    });
    unsubscribe();
    store.transitionToPlaying();

    expect(notifications).toBe(2);
    expect(snapshots[0]).not.toBe(snapshots[1]);
    expect(snapshots[1]).not.toBe(snapshots[2]);
  });
});
