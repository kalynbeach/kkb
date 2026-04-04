import { describe, expect, test } from "bun:test";
import { renderToString } from "react-dom/server";

import OscilloscopePage from "../page";

describe("/oscilloscope page", () => {
  test("renders the oscilloscope shell and essential controls", () => {
    const html = renderToString(<OscilloscopePage />).replaceAll("<!-- -->", "");

    expect(html).toContain("Audio experiments");
    expect(html).toContain("Oscilloscope");
    expect(html).toContain("Source");
    expect(html).toContain("Preset");
    expect(html).toContain("Visual");
    expect(html).toContain("Oscillators");
    expect(html).toContain("Mic");
  });
});
