import { describe, expect, test } from "bun:test";
import { renderToString } from "react-dom/server";

import { PlayerShell, shouldPollPlayerTimeline } from "../player-shell";

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
    rate: 1,
    volume: 1,
  }),
  subscribe: () => () => {},
  loadTrack: async () => {},
  play: async () => {},
  pause: async () => {},
  seek: async () => {},
  setRate: async () => {},
  setVolume: async () => {},
  destroy: async () => {},
  getTimeline: () => ({ currentTime: 0, duration: 180 }),
  getBufferedRanges: () => [{ start: 0, end: 30 }],
});

describe("PlayerShell", () => {
  test("polls the live timeline only while playback is active", () => {
    expect(shouldPollPlayerTimeline("playing")).toBe(true);
    expect(shouldPollPlayerTimeline("ready")).toBe(false);
    expect(shouldPollPlayerTimeline("paused")).toBe(false);
    expect(shouldPollPlayerTimeline("error")).toBe(false);
  });

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
          rate={1}
          volume={1}
          onPlay={() => {}}
          onPause={() => {}}
          onSeek={() => {}}
          onSetRate={() => {}}
          onSetVolume={() => {}}
        />,
      ),
    ).not.toThrow();
  });

  test("shows buffered progress using the buffered extent", () => {
    const html = renderToString(
      <PlayerShell
        player={{
          ...createPlayerStub(),
          getBufferedRanges: () => [{ start: 10, end: 30 }],
          getTimeline: () => ({ currentTime: 0, duration: 100 }),
        }}
        title="Test Tone"
        subtitle="Local AAC fixture routed through the current media-element path."
        status="ready"
        duration={100}
        sourceId="media-element"
        error={null}
        rate={1}
        volume={1}
        onPlay={() => {}}
        onPause={() => {}}
        onSeek={() => {}}
        onSetRate={() => {}}
        onSetVolume={() => {}}
      />,
    );
    const normalizedHtml = html.replaceAll("<!-- -->", "");

    expect(normalizedHtml).toContain("buf 30%");
  });

  test("clamps buffered progress display to 100 percent", () => {
    const html = renderToString(
      <PlayerShell
        player={{
          ...createPlayerStub(),
          getBufferedRanges: () => [{ start: 80, end: 140 }],
          getTimeline: () => ({ currentTime: 0, duration: 100 }),
        }}
        title="Test Tone"
        subtitle="Local AAC fixture routed through the current media-element path."
        status="ready"
        duration={100}
        sourceId="media-element"
        error={null}
        rate={1.5}
        volume={0.4}
        onPlay={() => {}}
        onPause={() => {}}
        onSeek={() => {}}
        onSetRate={() => {}}
        onSetVolume={() => {}}
      />,
    );
    const normalizedHtml = html.replaceAll("<!-- -->", "");

    expect(normalizedHtml).toContain("buf 100%");
  });

  test("renders playback rate and volume controls", () => {
    const html = renderToString(
      <PlayerShell
        player={createPlayerStub()}
        title="Test Tone"
        subtitle="Local AAC fixture routed through the current media-element path."
        status="ready"
        duration={180}
        sourceId="media-element"
        error={null}
        rate={1.5}
        volume={0.4}
        onPlay={() => {}}
        onPause={() => {}}
        onSeek={() => {}}
        onSetRate={() => {}}
        onSetVolume={() => {}}
      />,
    );
    const normalizedHtml = html.replaceAll("<!-- -->", "");

    expect(normalizedHtml).toContain("Rate");
    expect(normalizedHtml).toContain("1.5x");
    expect(normalizedHtml).toContain("Volume");
    expect(normalizedHtml).toContain("40%");
  });
});
