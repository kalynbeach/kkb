import { describe, expect, test } from "bun:test";

import { getNextSeekTimeForKey } from "../waveform";

describe("Waveform keyboard seeking", () => {
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
