import { describe, expect, test } from "bun:test";
import { Window } from "happy-dom";

const childProcessFlag = "KKB_SEEK_TIMELINE_DRAG_CHILD";

async function runSeekTimelineDrag() {
  const window = new Window({ url: "http://localhost/ui?item=audio-seek-timeline" });
  const originalGlobals = new Map<string, unknown>();
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
      callback(0);
      return 1;
    },
    cancelAnimationFrame: () => {},
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

  React.act(() => {
    root.render(
      React.createElement(SeekTimeline, {
        currentTime: 30,
        duration: 120,
        onSeek: (seconds) => seekCalls.push(seconds),
      }),
    );
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
      left: 24.5,
      right: 25.5,
      top: 0,
      width: 1,
      x: 24.5,
      y: 0,
      toJSON: () => ({}),
    }) as DOMRect;

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

  React.act(() => {
    for (const clientX of [50, 75]) {
      window.document.dispatchEvent(
        new window.PointerEvent("pointermove", {
          bubbles: true,
          buttons: 1,
          cancelable: true,
          clientX,
          isPrimary: true,
          pointerId: 1,
          pointerType: "mouse",
        }),
      );
    }
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

  expect(seekCalls).toEqual([60, 90]);
  expect(input.value).toBe("90");
  expect(control.hasPointerCapture(1)).toBe(false);

  React.act(() => root.unmount());
  container.remove();
  window.close();
  for (const [key, value] of originalGlobals) {
    Object.defineProperty(globalThis, key, { configurable: true, value, writable: true });
  }
}

describe("SeekTimeline drag contract", () => {
  test("captures the pointer and seeks continuously while dragging the playhead", async () => {
    if (process.env[childProcessFlag] === "1") {
      await runSeekTimelineDrag();
      return;
    }

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
