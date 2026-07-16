import { describe, expect, test } from "bun:test";
import { renderToString } from "react-dom/server";

import { Calendar } from "../calendar";

describe("Calendar", () => {
  test("server-renders stable ISO day identifiers", () => {
    const html = renderToString(<Calendar month={new Date(2026, 2, 1)} />);

    expect(html).toContain('data-day="2026-03-01"');
  });
});
