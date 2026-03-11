import { describe, expect, test } from "bun:test";
import { renderToString } from "react-dom/server";

import { PlayerShell } from "../player-shell";

const createPlayerStub = () => ({
  defaultTrack: {
    src: "/audio/test-tone-aac.m4a",
    mimeType: "audio/mp4; codecs=mp4a.40.2",
  },
  engine: {} as never,
  sources: [],
  getSnapshot: () => ({
    status: "ready" as const,
    currentTime: 0,
    duration: 180,
    sourceId: "media-element",
    error: null,
  }),
  subscribe: () => () => {},
  loadTrack: async () => {},
  play: async () => {},
  pause: async () => {},
  seek: async () => {},
  getTimeline: () => ({ currentTime: 0, duration: 180 }),
  getBufferedRanges: () => [{ start: 0, end: 30 }],
});

describe("PlayerShell", () => {
  test("does not create the browser audio runtime during server render", () => {
    expect(() =>
      renderToString(
        <PlayerShell
          player={createPlayerStub()}
          title="Test Tone"
          subtitle="Local AAC fixture routed through the current media-element path."
          status="ready"
          duration={180}
          sourceId="media-element"
          error={null}
          onPlay={() => {}}
          onPause={() => {}}
          onSeek={() => {}}
        />,
      ),
    ).not.toThrow();
  });
});
