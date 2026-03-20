import { describe, expect, test } from "bun:test";

import { isMediaElementEligibleInput, isWebCodecsEligibleInput, normalizeMimeType } from "../codecs";

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

  test("returns false when mimeType is undefined", () => {
    expect(
      isWebCodecsEligibleInput({
        src: "/audio/test-tone-aac.m4a",
      }),
    ).toBe(false);
  });
});

describe("normalizeMimeType", () => {
  test("normalizes case and whitespace and returns an empty string when mimeType is undefined", () => {
    expect(
      normalizeMimeType({
        src: "/audio/test-tone-opus.webm",
        mimeType: "  AUDIO/WEBM; CODECS=OPUS  ",
      }),
    ).toBe("audio/webm; codecs=opus");
    expect(
      normalizeMimeType({
        src: "/audio/test-tone-opus.webm",
      }),
    ).toBe("");
  });
});

describe("isMediaElementEligibleInput", () => {
  test("returns false when mimeType is undefined", () => {
    expect(
      isMediaElementEligibleInput({
        src: "/audio/test-tone-aac.m4a",
      }),
    ).toBe(false);
  });
});
