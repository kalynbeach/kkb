import { describe, expect, test } from "bun:test";

import { createWebCodecsDemuxer } from "../webcodecs-demux";

describe("createWebCodecsDemuxer", () => {
  test("supports only the declared allowlisted mime types", () => {
    const demuxer = createWebCodecsDemuxer();

    expect(
      demuxer.supports({
        src: "/audio/test-tone-opus.webm",
        mimeType: "audio/webm; codecs=opus",
      }),
    ).toBe(true);
    expect(
      demuxer.supports({
        src: "/audio/test-tone.flac",
        mimeType: "audio/flac",
      }),
    ).toBe(false);
  });
});
