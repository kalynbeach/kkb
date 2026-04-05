import { describe, expect, test } from "bun:test";

import { getOscilloscopeSupport } from "../support";

describe("getOscilloscopeSupport", () => {
  test("returns unsupported when navigator.gpu is missing", () => {
    expect(getOscilloscopeSupport({ navigator: {} })).toEqual({
      reason: "WebGPU is not available in this browser.",
      status: "unsupported",
    });
  });

  test("returns supported when navigator.gpu exists", () => {
    expect(
      getOscilloscopeSupport({
        navigator: { gpu: {} },
      }),
    ).toEqual({
      status: "supported",
    });
  });
});
