import { describe, expect, test } from "bun:test";

import { createSABRingBuffer } from "../sab-ring-buffer";

describe("createSABRingBuffer", () => {
  test("creates a shared buffer with the requested frame capacity", () => {
    const ringBuffer = createSABRingBuffer(512);

    expect(ringBuffer.capacityFrames).toBe(512);
    expect(ringBuffer.sab).toBeInstanceOf(SharedArrayBuffer);
  });
});
