import { describe, expect, test } from "bun:test";
import { renderToString } from "react-dom/server";

import { PlayerShell } from "../player-shell";
import { shouldPollPlayerTimeline } from "../player-timeline";
import { syncSeekTimelineInput } from "../seek-timeline-semantics";

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

  test("synchronizes the live seek timeline input across valid and invalid durations", () => {
    const attributes = new Map<string, string>();
    const target = {
      disabled: true,
      max: "",
      min: "",
      value: "",
      setAttribute: (name: string, value: string) => {
        attributes.set(name, value);
      },
    };

    syncSeekTimelineInput({
      target,
      currentTime: 150,
      duration: 120,
    });

    expect(target).toMatchObject({ disabled: false, min: "0", max: "120", value: "120" });
    expect(Object.fromEntries(attributes)).toEqual({
      "aria-label": "Seek timeline",
      "aria-valuenow": "120",
      "aria-valuetext": "2:00 of 2:00",
    });

    syncSeekTimelineInput({
      target,
      currentTime: 0,
      duration: Number.NaN,
    });

    expect(target).toMatchObject({ disabled: true, min: "0", max: "1", value: "0" });
    expect(Object.fromEntries(attributes)).toEqual({
      "aria-label": "Audio timeline unavailable",
      "aria-valuenow": "0",
      "aria-valuetext": "Audio timeline unavailable",
    });
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

  test("renders previous, stop, and next controls from transport state", () => {
    const html = renderToString(
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
        canSelectPrevious={false}
        canSelectNext={true}
        onPlay={() => {}}
        onPause={() => {}}
        onPrevious={() => {}}
        onStop={() => {}}
        onNext={() => {}}
        onSeek={() => {}}
        onSetRate={() => {}}
        onSetVolume={() => {}}
      />,
    );
    const normalizedHtml = html.replaceAll("<!-- -->", "");

    expect(normalizedHtml).toContain('disabled="" aria-label="Previous"');
    expect(normalizedHtml).not.toContain('disabled="" aria-label="Stop"');
    expect(normalizedHtml).not.toContain('disabled="" aria-label="Next"');
  });

  test("does not render fake diagnostics when no real track metadata exists", () => {
    const html = renderToString(
      <PlayerShell
        player={createPlayerStub()}
        title="Test Tone"
        subtitle="Local AAC fixture routed through the current media-element path."
        status="playing"
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
    );
    const normalizedHtml = html.replaceAll("<!-- -->", "");

    expect(normalizedHtml).not.toContain("kbps");
    expect(normalizedHtml).not.toContain("khz");
    expect(normalizedHtml).not.toContain("stereo");
  });

  test("announces coarse status and exposes complete errors", () => {
    const loadingHtml = renderToString(
      <PlayerShell
        player={createPlayerStub()}
        title="Test Tone"
        subtitle="Local AAC fixture routed through the current media-element path."
        status="loading"
        duration={0}
        sourceId={null}
        error={null}
        rate={1}
        volume={1}
        onPlay={() => {}}
        onPause={() => {}}
        onSeek={() => {}}
        onSetRate={() => {}}
        onSetVolume={() => {}}
      />,
    ).replaceAll("<!-- -->", "");
    const errorHtml = renderToString(
      <PlayerShell
        player={createPlayerStub()}
        title="Test Tone"
        subtitle="Local AAC fixture routed through the current media-element path."
        status="error"
        duration={0}
        sourceId={null}
        error="The audio source could not be decoded. Choose another track."
        rate={1}
        volume={1}
        onPlay={() => {}}
        onPause={() => {}}
        onSeek={() => {}}
        onSetRate={() => {}}
        onSetVolume={() => {}}
      />,
    ).replaceAll("<!-- -->", "");

    expect(loadingHtml).toContain('role="status"');
    expect(loadingHtml).toContain('aria-live="polite"');
    expect(errorHtml).toContain('role="alert"');
    expect(errorHtml).toContain("The audio source could not be decoded. Choose another track.");
    expect(errorHtml).not.toContain("max-w-48 truncate");
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
