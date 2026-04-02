import { describe, expect, test } from "bun:test";

import { createStaticTrackCatalog } from "../static-track-catalog";

describe("createStaticTrackCatalog", () => {
  test("returns stable test-tone records and a deterministic default track", () => {
    const catalog = createStaticTrackCatalog();

    const tracks = catalog.listTracks();

    expect(tracks.map((track) => track.id)).toEqual(["test-tone-aac", "test-tone-opus"]);
    expect(catalog.getDefaultTrackId()).toBe("test-tone-aac");
    expect(catalog.getTrack("test-tone-aac")).toMatchObject({
      id: "test-tone-aac",
      title: "Test Tone (AAC)",
      duration: 2,
      assets: [
        {
          src: "/audio/test-tone-aac.m4a",
          mimeType: "audio/mp4; codecs=mp4a.40.2",
        },
      ],
    });
    expect(catalog.getTrack("test-tone-opus")).toMatchObject({
      id: "test-tone-opus",
      title: "Test Tone (Opus)",
      duration: 2,
      assets: [
        {
          src: "/audio/test-tone-opus.webm",
          mimeType: "audio/webm; codecs=opus",
        },
      ],
    });
    expect(catalog.getTrack("missing-track")).toBeNull();
  });
});
