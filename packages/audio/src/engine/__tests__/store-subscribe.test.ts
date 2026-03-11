import { describe, expect, test } from "bun:test";

import { createPlayerStore } from "../store";

describe("createPlayerStore subscriptions", () => {
  test("notifies active listeners on state changes", () => {
    const store = createPlayerStore();
    let notifications = 0;

    const unsubscribe = store.subscribe(() => {
      notifications += 1;
    });

    store.setState({ status: "loading" });
    store.setState({ status: "ready" });
    unsubscribe();
    store.setState({ status: "playing" });

    expect(notifications).toBe(2);
  });
});
