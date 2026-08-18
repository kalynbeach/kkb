import { describe, expect, test } from "bun:test";
import { Window } from "happy-dom";

const childProcessFlag = "KKB_SEEK_TIMELINE_DRAG_CHILD";

async function runSeekTimelineDrag() {
  const window = new Window({ url: "http://localhost/ui?item=audio-seek-timeline" });
  const originalGlobals = new Map<string, unknown>();
  let runFramesImmediately = true;
  let nextFrameId = 0;
  const queuedFrames = new Map<number, FrameRequestCallback>();
  const globals = {
    document: window.document,
    window,
    navigator: window.navigator,
    HTMLElement: window.HTMLElement,
    HTMLInputElement: window.HTMLInputElement,
    Element: window.Element,
    Node: window.Node,
    Event: window.Event,
    MouseEvent: window.MouseEvent,
    PointerEvent: window.PointerEvent,
    KeyboardEvent: window.KeyboardEvent,
    CustomEvent: window.CustomEvent,
    MutationObserver: window.MutationObserver,
    ResizeObserver: window.ResizeObserver,
    getComputedStyle: window.getComputedStyle.bind(window),
    requestAnimationFrame: (callback: FrameRequestCallback) => {
      nextFrameId += 1;
      if (runFramesImmediately) {
        callback(0);
      } else {
        queuedFrames.set(nextFrameId, callback);
      }
      return nextFrameId;
    },
    cancelAnimationFrame: (frameId: number) => {
      queuedFrames.delete(frameId);
    },
    IS_REACT_ACT_ENVIRONMENT: true,
  };

  for (const [key, value] of Object.entries(globals)) {
    originalGlobals.set(key, Reflect.get(globalThis, key));
    Object.defineProperty(globalThis, key, { configurable: true, value, writable: true });
  }

  const React = await import("react");
  const { createRoot } = await import("react-dom/client");
  const { SeekTimeline } = await import("@kkb/ui/components/audio/seek-timeline");

  const container = window.document.createElement("div");
  window.document.body.append(container);
  const root = createRoot(container);
  const seekCalls: number[] = [];
  const scrubbingStates: boolean[] = [];
  const handleScrubbingChange = (scrubbing: boolean) => scrubbingStates.push(scrubbing);
  const renderTimeline = (currentTime: number, duration: number) =>
    React.createElement(SeekTimeline, {
      currentTime,
      duration,
      onSeek: (seconds: number) => {
        seekCalls.push(seconds);
        root.render(renderTimeline(seconds, duration));
      },
      onScrubbingChange: handleScrubbingChange,
    });

  React.act(() => {
    root.render(renderTimeline(30, 120));
  });

  const control = window.document.querySelector<HTMLElement>('[data-slot="seek-timeline-control"]');
  const playhead = window.document.querySelector<HTMLElement>(
    '[data-slot="seek-timeline-playhead"]',
  );
  const input = window.document.querySelector<HTMLInputElement>(
    'input[type="range"][aria-label="Seek timeline"]',
  );

  if (!control || !playhead || !input) {
    throw new Error("Expected composed seek timeline Slider anatomy");
  }

  control.getBoundingClientRect = () =>
    ({
      bottom: 56,
      height: 56,
      left: 0,
      right: 100,
      top: 0,
      width: 100,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    }) as DOMRect;
  playhead.getBoundingClientRect = () =>
    ({
      bottom: 56,
      height: 56,
      left: 19,
      right: 31,
      top: 0,
      width: 12,
      x: 19,
      y: 0,
      toJSON: () => ({}),
    }) as DOMRect;

  React.act(() => {
    playhead.dispatchEvent(
      new window.PointerEvent("pointerdown", {
        bubbles: true,
        button: 2,
        buttons: 2,
        cancelable: true,
        clientX: 25,
        isPrimary: true,
        pointerId: 2,
        pointerType: "mouse",
      }),
    );
  });

  expect(scrubbingStates).toEqual([]);

  React.act(() => {
    playhead.dispatchEvent(
      new window.PointerEvent("pointerdown", {
        bubbles: true,
        button: 0,
        buttons: 1,
        cancelable: true,
        clientX: 25,
        isPrimary: true,
        pointerId: 1,
        pointerType: "mouse",
      }),
    );
  });

  expect(control.hasPointerCapture(1)).toBe(true);
  expect(scrubbingStates).toEqual([true]);

  React.act(() => {
    window.document.dispatchEvent(
      new window.PointerEvent("pointermove", {
        bubbles: true,
        buttons: 1,
        cancelable: true,
        clientX: 50,
        isPrimary: true,
        pointerId: 1,
        pointerType: "mouse",
      }),
    );
  });

  expect(input.value).toBe("60");
  expect(seekCalls).toEqual([]);

  React.act(() => {
    window.document.dispatchEvent(
      new window.PointerEvent("pointermove", {
        bubbles: true,
        buttons: 1,
        cancelable: true,
        clientX: 75,
        isPrimary: true,
        pointerId: 1,
        pointerType: "mouse",
      }),
    );
    window.document.dispatchEvent(
      new window.PointerEvent("pointerup", {
        bubbles: true,
        button: 0,
        cancelable: true,
        clientX: 75,
        isPrimary: true,
        pointerId: 1,
        pointerType: "mouse",
      }),
    );
  });

  expect(seekCalls).toEqual([90]);
  expect(input.value).toBe("90");
  expect(control.hasPointerCapture(1)).toBe(false);
  expect(scrubbingStates).toEqual([true, false]);

  React.act(() => {
    playhead.dispatchEvent(
      new window.PointerEvent("pointerdown", {
        bubbles: true,
        button: 0,
        buttons: 1,
        clientX: 75,
        isPrimary: true,
        pointerId: 5,
        pointerType: "mouse",
      }),
    );
    playhead.dispatchEvent(
      new window.PointerEvent("pointerup", {
        bubbles: true,
        button: 0,
        clientX: 75,
        isPrimary: true,
        pointerId: 5,
        pointerType: "mouse",
      }),
    );
  });

  expect(scrubbingStates).toEqual([true, false, true, false]);

  React.act(() => {
    playhead.dispatchEvent(
      new window.PointerEvent("pointerdown", {
        bubbles: true,
        button: 0,
        buttons: 1,
        cancelable: true,
        clientX: 75,
        isPrimary: true,
        pointerId: 4,
        pointerType: "mouse",
      }),
    );
    root.render(renderTimeline(0, 0));
  });

  expect(scrubbingStates).toEqual([true, false, true, false, true, false]);

  React.act(() => {
    root.render(renderTimeline(10, 120));
  });

  expect(container.querySelector<HTMLInputElement>('input[type="range"]')?.value).toBe("10");

  React.act(() => root.unmount());
  container.remove();

  runFramesImmediately = false;
  const { PlayerShell } = await import("@/components/audio/player-shell");
  const liveTimeline = { currentTime: 15, duration: 120 };
  let bufferedRanges = [{ start: 0, end: 30 }];
  const player = {
    defaultTrack: {
      src: "/audio/test-tone-aac.m4a",
      mimeType: "audio/mp4; codecs=mp4a.40.2",
    },
    engine: {} as never,
    sources: [],
    getSnapshot: () => ({
      status: "playing" as const,
      currentTime: liveTimeline.currentTime,
      duration: liveTimeline.duration,
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
    getTimeline: () => liveTimeline,
    getBufferedRanges: () => (liveTimeline.duration > 0 ? bufferedRanges : []),
  };
  const liveContainer = window.document.createElement("div");
  window.document.body.append(liveContainer);
  const liveRoot = createRoot(liveContainer);

  React.act(() => {
    liveRoot.render(
      React.createElement(PlayerShell, {
        player,
        trackId: "test-tone-a",
        title: "Test Tone",
        subtitle: "Local fixture",
        status: "playing",
        duration: 120,
        sourceId: "media-element",
        error: null,
        rate: 1,
        volume: 1,
        onPlay: () => {},
        onPause: () => {},
        onSeek: () => {},
        onSetRate: () => {},
        onSetVolume: () => {},
      }),
    );
  });

  liveTimeline.currentTime = 60;
  bufferedRanges = [{ start: 0, end: 90 }];
  const liveInput = liveContainer.querySelector<HTMLInputElement>('input[type="range"]');
  const liveControl = liveContainer.querySelector<HTMLElement>(
    '[data-slot="seek-timeline-control"]',
  );
  const livePlayhead = liveContainer.querySelector<HTMLElement>(
    '[data-slot="seek-timeline-playhead"]',
  );
  if (!liveControl || !livePlayhead) {
    throw new Error("Expected PlayerShell seek timeline Slider anatomy");
  }

  liveControl.getBoundingClientRect = control.getBoundingClientRect;
  livePlayhead.getBoundingClientRect = () =>
    ({
      bottom: 56,
      height: 56,
      left: 6.5,
      right: 18.5,
      top: 0,
      width: 12,
      x: 6.5,
      y: 0,
      toJSON: () => ({}),
    }) as DOMRect;
  React.act(() => {
    livePlayhead.dispatchEvent(
      new window.PointerEvent("pointerdown", {
        bubbles: true,
        button: 0,
        buttons: 1,
        cancelable: true,
        clientX: 12.5,
        isPrimary: true,
        pointerId: 3,
        pointerType: "mouse",
      }),
    );
  });

  const interactingFrame = queuedFrames.values().next().value;
  queuedFrames.clear();
  if (!interactingFrame) {
    throw new Error("Expected PlayerShell to queue a live timeline frame");
  }

  React.act(() => interactingFrame(16));
  expect(liveInput?.value).toBe("15");

  React.act(() => {
    livePlayhead.dispatchEvent(
      new window.PointerEvent("pointercancel", {
        bubbles: true,
        button: 0,
        cancelable: true,
        clientX: 12.5,
        isPrimary: true,
        pointerId: 3,
        pointerType: "mouse",
      }),
    );
  });

  const settledFrame = queuedFrames.values().next().value;
  queuedFrames.clear();
  if (!settledFrame) {
    throw new Error("Expected PlayerShell to continue polling the live timeline");
  }

  React.act(() => settledFrame(32));

  const liveProgress = liveContainer.querySelector<HTMLElement>(
    '[data-slot="seek-timeline-progress"]',
  );
  const liveBuffer = liveContainer.querySelector<HTMLElement>('[data-buffered-layer="live"] > div');

  expect(liveInput?.value).toBe("60");
  expect(liveInput?.getAttribute("aria-valuenow")).toBe("60");
  expect(liveProgress?.style.width).toBe("50%");
  expect(livePlayhead?.style.insetInlineStart).toBe("50%");
  expect(liveBuffer?.style.width).toBe("75%");

  React.act(() => {
    liveRoot.render(
      React.createElement(PlayerShell, {
        player,
        trackId: "test-tone-b",
        title: "Next Test Tone",
        subtitle: "Selecting local fixture",
        status: "playing",
        duration: 120,
        sourceId: "media-element",
        error: null,
        rate: 1,
        volume: 1,
        onPlay: () => {},
        onPause: () => {},
        onSeek: () => {},
        onSetRate: () => {},
        onSetVolume: () => {},
      }),
    );
  });

  const staleTrackFrame = queuedFrames.values().next().value;
  queuedFrames.clear();
  if (!staleTrackFrame) {
    throw new Error("Expected the previous track to leave a queued timeline frame");
  }

  React.act(() => staleTrackFrame(48));

  expect(liveContainer.innerHTML).not.toContain('aria-label="Seek timeline"');
  expect(liveContainer.innerHTML).toContain('role="img" aria-label="Audio timeline unavailable"');

  liveTimeline.currentTime = 0;
  liveTimeline.duration = 0;
  React.act(() => {
    liveRoot.render(
      React.createElement(PlayerShell, {
        player,
        trackId: "test-tone-b",
        title: "Next Test Tone",
        subtitle: "Loading local fixture",
        status: "loading",
        duration: 0,
        sourceId: null,
        error: null,
        rate: 1,
        volume: 1,
        onPlay: () => {},
        onPause: () => {},
        onSeek: () => {},
        onSetRate: () => {},
        onSetVolume: () => {},
      }),
    );
  });

  expect(liveContainer.innerHTML).not.toContain('aria-label="Seek timeline"');
  expect(liveContainer.innerHTML).toContain('role="img" aria-label="Audio timeline unavailable"');

  React.act(() => {
    liveRoot.render(
      React.createElement(PlayerShell, {
        player,
        trackId: "test-tone-a",
        title: "Test Tone",
        subtitle: "Restored after failed selection",
        status: "error",
        duration: 0,
        sourceId: null,
        error: "Next track failed to load",
        rate: 1,
        volume: 1,
        onPlay: () => {},
        onPause: () => {},
        onSeek: () => {},
        onSetRate: () => {},
        onSetVolume: () => {},
      }),
    );
  });

  liveTimeline.currentTime = 30;
  liveTimeline.duration = 120;
  React.act(() => {
    liveRoot.render(
      React.createElement(PlayerShell, {
        player,
        trackId: "test-tone-a",
        title: "Test Tone",
        subtitle: "Recovered fixture",
        status: "playing",
        duration: 120,
        sourceId: "media-element",
        error: null,
        rate: 1,
        volume: 1,
        onPlay: () => {},
        onPause: () => {},
        onSeek: () => {},
        onSetRate: () => {},
        onSetVolume: () => {},
      }),
    );
  });

  expect(liveContainer.innerHTML).toContain('aria-label="Seek timeline"');

  React.act(() => liveRoot.unmount());
  liveContainer.remove();
  window.close();
  for (const [key, value] of originalGlobals) {
    Object.defineProperty(globalThis, key, { configurable: true, value, writable: true });
  }
}

describe("SeekTimeline drag contract", () => {
  test("scrubs continuously, commits once, and keeps live refs synchronized", async () => {
    if (process.env[childProcessFlag] === "1") {
      await runSeekTimelineDrag();
      return;
    }

    // Base UI chooses its layout-effect implementation at import time, before this suite installs DOM.
    const result = Bun.spawnSync({
      cmd: ["bun", "test", import.meta.path],
      env: { ...process.env, [childProcessFlag]: "1" },
      stderr: "pipe",
      stdout: "pipe",
    });

    if (result.exitCode !== 0) {
      const output = `${result.stdout.toString()}\n${result.stderr.toString()}`.trim();
      throw new Error(`Isolated SeekTimeline drag test failed:\n${output}`);
    }

    expect(result.exitCode).toBe(0);
  });
});
