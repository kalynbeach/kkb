import { describe, expect, test } from "bun:test";
import { createElement, createRef } from "react";
import { renderToString } from "react-dom/server";

import { SeekTimeline } from "../seek-timeline";
import { getNextSeekTimeForKey } from "../seek-timeline-navigation";

describe("SeekTimeline keyboard seeking", () => {
  test("renders a uniform seek timeline without decorative amplitude bars", () => {
    const html = renderToString(
      createElement(SeekTimeline, {
        duration: 100,
        currentTime: 25,
        bufferedRanges: [{ start: 0, end: 50 }],
        onSeek: () => {},
      }),
    ).replaceAll("<!-- -->", "");

    expect(html).toContain('data-audio-timeline="true"');
    expect(html).toContain('data-audio-timeline-ruler="true"');
    expect(html).not.toContain("bar-01");
  });

  test("does not server-render buffered segments into the live-updated layer", () => {
    const html = renderToString(
      createElement(SeekTimeline, {
        duration: 100,
        currentTime: 0,
        bufferedRanges: [{ start: 0, end: 30 }],
        bufferedRangesRef: createRef<HTMLDivElement>(),
      }),
    ).replaceAll("<!-- -->", "");

    expect(html).toContain('data-buffered-layer="live"');
    expect(html).not.toContain("width:30%");
  });

  test("renders an unavailable static timeline when duration is invalid", () => {
    const html = renderToString(
      createElement(SeekTimeline, {
        duration: Number.NaN,
        currentTime: 12,
        onSeek: () => {},
      }),
    ).replaceAll("<!-- -->", "");

    expect(html).toContain('role="img"');
    expect(html).toContain('aria-label="Audio timeline unavailable"');
    expect(html).not.toContain('role="slider"');
    expect(html).not.toContain('tabindex="0"');
    expect(html).not.toContain("NaN");
  });

  test("renders valid playback progress without interactive seek semantics", () => {
    const html = renderToString(
      createElement(SeekTimeline, {
        duration: 120,
        currentTime: 12,
      }),
    ).replaceAll("<!-- -->", "");

    expect(html).toContain('role="progressbar"');
    expect(html).toContain('aria-label="Playback timeline"');
    expect(html).toContain('aria-valuenow="12"');
    expect(html).toContain('aria-valuemax="120"');
    expect(html).not.toContain('role="slider"');
    expect(html).not.toContain('tabindex="0"');
    expect(html).not.toContain("cursor-pointer");
  });

  test("keeps precise numeric bounds with readable time values", () => {
    const html = renderToString(
      createElement(SeekTimeline, {
        duration: 125.9,
        currentTime: 65.9,
        onSeek: () => {},
      }),
    ).replaceAll("<!-- -->", "");

    expect(html).toContain('type="range"');
    expect(html).toContain('aria-label="Seek timeline"');
    expect(html).toContain('aria-valuenow="65.9"');
    expect(html).toContain('max="125.9"');
    expect(html).toContain('aria-valuetext="1:05.9 of 2:05.9"');
  });

  test("describes sub-second timeline bounds without collapsing them to zero", () => {
    const html = renderToString(
      createElement(SeekTimeline, {
        duration: 0.5,
        currentTime: 0.25,
        onSeek: () => {},
      }),
    ).replaceAll("<!-- -->", "");

    expect(html).toContain('aria-valuenow="0.25"');
    expect(html).toContain('max="0.5"');
    expect(html).toContain('aria-valuetext="0.25 seconds of 0.5 seconds"');
  });

  test("clamps rendered progress semantics to the duration", () => {
    const html = renderToString(
      createElement(SeekTimeline, {
        duration: 120,
        currentTime: 150,
        onSeek: () => {},
      }),
    ).replaceAll("<!-- -->", "");

    expect(html).toContain('aria-valuenow="120"');
    expect(html).toContain('aria-valuetext="2:00 of 2:00"');
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

  test("uses the same five-second step for vertical arrow keys", () => {
    expect(
      getNextSeekTimeForKey({
        key: "ArrowDown",
        currentTime: 12,
        duration: 120,
      }),
    ).toBe(7);
    expect(
      getNextSeekTimeForKey({
        key: "ArrowUp",
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
