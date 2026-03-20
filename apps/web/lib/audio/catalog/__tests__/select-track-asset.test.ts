import { describe, expect, test } from "bun:test";

import { selectTrackAsset } from "../select-track-asset";

describe("selectTrackAsset", () => {
  test("returns null for null tracks and tracks without assets", () => {
    expect(selectTrackAsset(null)).toBeNull();
    expect(
      selectTrackAsset({
        id: "assetless-track",
        title: "Assetless Track",
        assets: [],
      }),
    ).toBeNull();
  });

  test("prefers the default asset index when it is in range", () => {
    expect(
      selectTrackAsset({
        id: "multi-asset-track",
        title: "Multi Asset Track",
        assets: [
          { src: "/audio/test-tone-aac.m4a", mimeType: "audio/mp4; codecs=mp4a.40.2" },
          { src: "/audio/test-tone-opus.webm", mimeType: "audio/webm; codecs=opus" },
        ],
        defaultAssetIndex: 1,
      }),
    ).toEqual({
      src: "/audio/test-tone-opus.webm",
      mimeType: "audio/webm; codecs=opus",
    });
  });

  test("falls back to the first asset when the default asset index is out of range", () => {
    expect(
      selectTrackAsset({
        id: "fallback-track",
        title: "Fallback Track",
        assets: [
          { src: "/audio/test-tone-aac.m4a", mimeType: "audio/mp4; codecs=mp4a.40.2" },
          { src: "/audio/test-tone-opus.webm", mimeType: "audio/webm; codecs=opus" },
        ],
        defaultAssetIndex: 99,
      }),
    ).toEqual({
      src: "/audio/test-tone-aac.m4a",
      mimeType: "audio/mp4; codecs=mp4a.40.2",
    });
  });
});
