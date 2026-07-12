import { describe, expect, test } from "bun:test";
import { createElement, createRef } from "react";
import { renderToString } from "react-dom/server";

import { Waveform } from "../waveform";
import { getNextSeekTimeForKey } from "../waveform-seek";

describe("Waveform keyboard seeking", () => {
  test("does not server-render buffered segments into the live-updated layer", () => {
    const html = renderToString(
      createElement(Waveform, {
        duration: 100,
        currentTime: 0,
        bufferedRanges: [{ start: 0, end: 30 }],
        bufferedRangesRef: createRef<HTMLDivElement>(),
      }),
    ).replaceAll("<!-- -->", "");

    expect(html).toContain('data-buffered-layer="live"');
    expect(html).not.toContain("width:30%");
  });

  test("renders a safe zero-valued slider contract when duration is invalid", () => {
    const html = renderToString(
      createElement(Waveform, {
        duration: Number.NaN,
        currentTime: 12,
      }),
    ).replaceAll("<!-- -->", "");

    expect(html).toContain('aria-valuemax="0"');
    expect(html).not.toContain('aria-valuemax="NaN"');
  });

  test("seeks backward five seconds on ArrowLeft", () => {
    expect(
      getNextSeekTimeForKey({
        key: "ArrowLeft",
        currentTime: 12,
        duration: 120,
      }),
    ).toBe(7);
  });

  test("seeks forward five seconds on ArrowRight", () => {
    expect(
      getNextSeekTimeForKey({
        key: "ArrowRight",
        currentTime: 12,
        duration: 120,
      }),
    ).toBe(17);
  });

  test("jumps to the start on Home", () => {
    expect(
      getNextSeekTimeForKey({
        key: "Home",
        currentTime: 48,
        duration: 120,
      }),
    ).toBe(0);
  });

  test("jumps to the end on End", () => {
    expect(
      getNextSeekTimeForKey({
        key: "End",
        currentTime: 48,
        duration: 120,
      }),
    ).toBe(120);
  });

  test("clamps results to valid bounds", () => {
    expect(
      getNextSeekTimeForKey({
        key: "ArrowLeft",
        currentTime: 3,
        duration: 120,
      }),
    ).toBe(0);

    expect(
      getNextSeekTimeForKey({
        key: "ArrowRight",
        currentTime: 118,
        duration: 120,
      }),
    ).toBe(120);
  });

  test("returns null when duration is invalid or the key is unsupported", () => {
    expect(
      getNextSeekTimeForKey({
        key: "ArrowRight",
        currentTime: 10,
        duration: 0,
      }),
    ).toBeNull();

    expect(
      getNextSeekTimeForKey({
        key: "PageDown",
        currentTime: 10,
        duration: 120,
      }),
    ).toBeNull();
  });
});
