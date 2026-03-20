import type { TrackRecordInput } from "./track-types";

const STATIC_TRACK_CATALOG_DATA: TrackRecordInput[] = [
  {
    id: "test-tone-aac",
    title: "Test Tone (AAC)",
    artist: "KKB",
    assets: [
      {
        src: "/audio/test-tone-aac.m4a",
        mimeType: "audio/mp4; codecs=mp4a.40.2",
      },
    ],
  },
  {
    id: "test-tone-opus",
    title: "Test Tone (Opus)",
    artist: "KKB",
    assets: [
      {
        src: "/audio/test-tone-opus.webm",
        mimeType: "audio/webm; codecs=opus",
      },
    ],
  },
];

const DEFAULT_TRACK_ID = "test-tone-aac";

export { DEFAULT_TRACK_ID, STATIC_TRACK_CATALOG_DATA };
