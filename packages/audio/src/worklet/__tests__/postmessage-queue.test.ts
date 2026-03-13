import { describe, expect, test } from "bun:test";

import { createChunkQueue } from "../postmessage-queue";

describe("createChunkQueue", () => {
  test("drops stale chunks by sequence id", () => {
    const queue = createChunkQueue();

    queue.push({ seq: 2, frames: 128 });
    queue.push({ seq: 1, frames: 128 });

    expect(queue.read()?.seq).toBe(2);
    expect(queue.read()).toBeUndefined();
  });

  test("drops older queued chunks when a newer chunk arrives", () => {
    const queue = createChunkQueue();

    queue.push({ seq: 1, frames: 128 });
    queue.push({ seq: 2, frames: 128 });

    expect(queue.read()?.seq).toBe(2);
    expect(queue.read()).toBeUndefined();
  });
});
