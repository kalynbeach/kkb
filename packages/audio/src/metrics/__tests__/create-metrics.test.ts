import { describe, expect, test } from "bun:test";

import { createMetrics } from "../create-metrics";

describe("createMetrics", () => {
  test("tracks underruns, fallback attempts, and selection reasons", () => {
    const metrics = createMetrics();

    metrics.incrementUnderrun();
    metrics.recordFallbackAttempt("webcodecs", "media-element");
    metrics.recordSelectionReason("preferred-supported-source");

    expect(metrics.snapshot()).toEqual({
      underruns: 1,
      fallbackAttempts: [{ fromSourceId: "webcodecs", toSourceId: "media-element" }],
      selectionReasons: ["preferred-supported-source"],
    });
  });
});
