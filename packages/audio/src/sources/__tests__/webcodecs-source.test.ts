import { describe, expect, test } from "bun:test";

import { createWebCodecsSource, supportsWebCodecsSource } from "../webcodecs-source";

describe("supportsWebCodecsSource", () => {
  test("returns false when AudioDecoder is unavailable", () => {
    expect(supportsWebCodecsSource({ AudioDecoder: undefined })).toBe(false);
  });
});

describe("createWebCodecsSource", () => {
  test("is ineligible for unsupported mime types", async () => {
    const source = createWebCodecsSource({
      globals: { AudioDecoder: class AudioDecoder {} },
      demuxer: {
        isConfigured: () => true,
        supports: () => true,
        load: async () => {},
      },
      timeline: {
        currentTime: 0,
        duration: 180,
      },
    });

    await expect(
      source.canPlay({
        src: "/audio/test-tone.flac",
        mimeType: "audio/flac",
      }),
    ).resolves.toBe(false);
  });

  test("is eligible only when the input is on the declared allowlist", async () => {
    const source = createWebCodecsSource({
      globals: { AudioDecoder: class AudioDecoder {} },
      demuxer: {
        isConfigured: () => true,
        supports: () => true,
        load: async () => {},
      },
      timeline: {
        currentTime: 0,
        duration: 180,
      },
    });

    await expect(
      source.canPlay({
        src: "/audio/test-tone-opus.webm",
        mimeType: "audio/webm; codecs=opus",
      }),
    ).resolves.toBe(true);
  });
});
