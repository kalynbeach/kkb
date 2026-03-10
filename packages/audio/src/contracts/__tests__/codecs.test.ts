import { describe, expect, test } from "bun:test";

import { isWebCodecsEligibleInput } from "../codecs";

describe("isWebCodecsEligibleInput", () => {
  test("returns true for opus in webm", () => {
    expect(
      isWebCodecsEligibleInput({
        src: "/audio/test-tone-opus.webm",
        mimeType: "audio/webm; codecs=opus",
      }),
    ).toBe(true);
  });

  test("returns true for AAC in mp4 containers", () => {
    expect(
      isWebCodecsEligibleInput({
        src: "/audio/test-tone-aac.m4a",
        mimeType: "audio/mp4; codecs=mp4a.40.2",
      }),
    ).toBe(true);
  });

  test("returns false for flac", () => {
    expect(
      isWebCodecsEligibleInput({
        src: "/audio/test-tone.flac",
        mimeType: "audio/flac",
      }),
    ).toBe(false);
  });
});
