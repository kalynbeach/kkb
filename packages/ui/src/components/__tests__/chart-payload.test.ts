import { describe, expect, test } from "bun:test";

import { mapVisibleChartPayload } from "../chart-payload";

describe("mapVisibleChartPayload", () => {
  test("skips hidden entries without advancing visible indexes", () => {
    const payload = [
      { name: "first", type: "line" },
      { name: "hidden", type: "none" },
      { name: "second", type: "line" },
    ];

    expect(mapVisibleChartPayload(payload, (item, index) => `${index}:${item.name}`)).toEqual([
      "0:first",
      "1:second",
    ]);
  });
});
