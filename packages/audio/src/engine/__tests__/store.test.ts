import { describe, expect, test } from "bun:test";

import { createPlayerStore } from "../store";

describe("createPlayerStore", () => {
  test("transitions idle to loading to ready", () => {
    const store = createPlayerStore();

    store.setState({ status: "loading" });
    store.setState({ status: "ready", duration: 120 });

    expect(store.getSnapshot().status).toBe("ready");
    expect(store.getSnapshot().duration).toBe(120);
  });

  test("transitions ready to playing to recovering to playing", () => {
    const store = createPlayerStore();

    store.setState({ status: "ready" });
    store.setState({ status: "playing" });
    store.setState({ status: "recovering" });
    store.setState({ status: "playing" });

    expect(store.getSnapshot().status).toBe("playing");
  });
});
