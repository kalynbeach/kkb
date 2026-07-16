import { afterEach, beforeEach, describe, expect, mock, test } from "bun:test";
import { Window } from "happy-dom";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";

import {
  type BinauralBeatConfig,
  DEFAULT_BINAURAL_BEAT_CONFIG,
} from "../../../lib/binaural-beats/binaural-beat-config";
import { BINAURAL_BEAT_PRESETS } from "../../../lib/binaural-beats/binaural-beat-presets";
import type { BinauralBeatEngine } from "../../../lib/binaural-beats/create-binaural-beat-engine";
import { BinauralBeatsClient } from "../binaural-beats-client";

type DomEnvironment = {
  cleanup: () => void;
  container: HTMLDivElement;
  document: Document;
  root: Root;
  window: Window;
};

const globalKeys = [
  "document",
  "window",
  "navigator",
  "HTMLElement",
  "HTMLButtonElement",
  "HTMLFormElement",
  "HTMLInputElement",
  "Element",
  "Node",
  "Event",
  "MouseEvent",
  "PointerEvent",
  "KeyboardEvent",
  "CustomEvent",
  "MutationObserver",
  "ResizeObserver",
  "DOMException",
  "SyntaxError",
  "getComputedStyle",
  "requestAnimationFrame",
  "cancelAnimationFrame",
  "IS_REACT_ACT_ENVIRONMENT",
] as const;

type GlobalKey = (typeof globalKeys)[number];

const originalGlobals = new Map<GlobalKey, unknown>();

function installDomGlobals(window: Window) {
  Object.defineProperties(window, {
    DOMException: { configurable: true, value: DOMException, writable: true },
    SyntaxError: { configurable: true, value: SyntaxError, writable: true },
    event: { configurable: true, value: undefined, writable: true },
  });

  const assignments: Record<GlobalKey, unknown> = {
    document: window.document,
    window,
    navigator: window.navigator,
    HTMLElement: window.HTMLElement,
    HTMLButtonElement: window.HTMLButtonElement,
    HTMLFormElement: window.HTMLFormElement,
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
    DOMException,
    SyntaxError,
    getComputedStyle: window.getComputedStyle.bind(window),
    requestAnimationFrame: (callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    },
    cancelAnimationFrame: () => {},
    IS_REACT_ACT_ENVIRONMENT: true,
  };

  for (const key of globalKeys) {
    originalGlobals.set(key, globalThis[key]);
    Object.defineProperty(globalThis, key, {
      configurable: true,
      value: assignments[key],
      writable: true,
    });
  }
}

function restoreDomGlobals() {
  for (const key of globalKeys) {
    Object.defineProperty(globalThis, key, {
      configurable: true,
      value: originalGlobals.get(key),
      writable: true,
    });
  }

  originalGlobals.clear();
}

function setupDom(): DomEnvironment {
  const window = new Window({ url: "http://localhost/binaural-beats" });
  installDomGlobals(window);

  const container = window.document.createElement("div");
  window.document.body.append(container);

  const root = createRoot(container);

  return {
    cleanup: () => {
      act(() => {
        root.unmount();
      });
      container.remove();
      window.close();
      restoreDomGlobals();
    },
    container,
    document: window.document,
    root,
    window,
  };
}

async function renderIntoDomAsync(environment: DomEnvironment, element: React.ReactNode) {
  await act(async () => {
    environment.root.render(element);
    await Promise.resolve();
    await Promise.resolve();
  });
}

async function dispatchClick(target: Element, window: Window) {
  await act(async () => {
    target.dispatchEvent(new window.PointerEvent("pointerdown", { bubbles: true, button: 0 }));
    target.dispatchEvent(new window.MouseEvent("mousedown", { bubbles: true, button: 0 }));
    target.dispatchEvent(new window.PointerEvent("pointerup", { bubbles: true, button: 0 }));
    target.dispatchEvent(new window.MouseEvent("mouseup", { bubbles: true, button: 0 }));
    target.dispatchEvent(new window.MouseEvent("click", { bubbles: true, button: 0 }));
    await Promise.resolve();
    await Promise.resolve();
  });
}

function getButtonByText(environment: DomEnvironment, text: string) {
  const button = Array.from(environment.document.querySelectorAll("button")).find((candidate) =>
    candidate.textContent?.includes(text),
  );

  if (!(button instanceof environment.window.HTMLButtonElement)) {
    throw new Error(`Unable to find button containing text: ${text}`);
  }

  return button;
}

function getPlaybackButton(environment: DomEnvironment, text: string) {
  const button = Array.from(environment.document.querySelectorAll("button")).find(
    (candidate) => candidate.textContent?.trim() === text,
  );

  if (!(button instanceof environment.window.HTMLButtonElement)) {
    throw new Error(`Unable to find playback button: ${text}`);
  }

  return button;
}

function getNumericInput(environment: DomEnvironment, configKey: keyof BinauralBeatConfig) {
  const input = environment.document.querySelector(`#binaural-${configKey}`);

  if (!(input instanceof environment.window.HTMLInputElement)) {
    throw new Error(`Unable to find numeric input: ${configKey}`);
  }

  return input;
}

function getSliderThumb(environment: DomEnvironment, configKey: keyof BinauralBeatConfig) {
  const thumb = environment.document.querySelector(
    `[data-testid="binaural-${configKey}-slider"] [data-slot="slider-thumb"]`,
  );

  if (!(thumb instanceof environment.window.HTMLElement)) {
    throw new Error(`Unable to find slider thumb: ${configKey}`);
  }

  return thumb;
}

async function pressSliderKey(
  environment: DomEnvironment,
  configKey: keyof BinauralBeatConfig,
  key: string,
  count: number,
) {
  for (let index = 0; index < count; index += 1) {
    const thumb = getSliderThumb(environment, configKey);

    await act(async () => {
      thumb.focus();
      thumb.dispatchEvent(
        new environment.window.KeyboardEvent("keydown", {
          bubbles: true,
          cancelable: true,
          key,
        }),
      );
      await Promise.resolve();
      await Promise.resolve();
    });
  }
}

function createDeferred<T>() {
  let reject!: (reason?: unknown) => void;
  let resolve!: (value: T | PromiseLike<T>) => void;
  const promise = new Promise<T>((nextResolve, nextReject) => {
    resolve = nextResolve;
    reject = nextReject;
  });

  return { promise, reject, resolve };
}

const createEngineHarness = () => {
  const calls: {
    destroyed: number;
    played: BinauralBeatConfig[];
    stopped: number;
    updated: BinauralBeatConfig[];
  } = {
    destroyed: 0,
    played: [],
    stopped: 0,
    updated: [],
  };
  let failNextPlay: Error | null = null;
  let failNextStop: Error | null = null;
  let nextPlayPromise: Promise<void> | null = null;
  let nextStopPromise: Promise<void> | null = null;
  const engine: BinauralBeatEngine = {
    destroy: () => {
      calls.destroyed += 1;
    },
    play: async (config) => {
      if (failNextPlay) {
        const error = failNextPlay;
        failNextPlay = null;
        throw error;
      }

      calls.played.push(config);
      const pending = nextPlayPromise;
      nextPlayPromise = null;

      if (pending) {
        await pending;
      }
    },
    stop: async () => {
      calls.stopped += 1;

      if (failNextStop) {
        const error = failNextStop;
        failNextStop = null;
        throw error;
      }

      const pending = nextStopPromise;
      nextStopPromise = null;

      if (pending) {
        await pending;
      }
    },
    update: (config) => {
      calls.updated.push(config);
    },
  };

  return {
    calls,
    engine,
    setFailNextPlay: (error: Error) => {
      failNextPlay = error;
    },
    setFailNextStop: (error: Error) => {
      failNextStop = error;
    },
    setNextPlayPromise: (promise: Promise<void>) => {
      nextPlayPromise = promise;
    },
    setNextStopPromise: (promise: Promise<void>) => {
      nextStopPromise = promise;
    },
  };
};

let domEnvironment: DomEnvironment | null = null;

beforeEach(() => {
  domEnvironment = setupDom();
});

afterEach(() => {
  domEnvironment?.cleanup();
  domEnvironment = null;
});

describe("BinauralBeatsClient", () => {
  test("renders a Play button", async () => {
    const environment = domEnvironment as DomEnvironment;
    const harness = createEngineHarness();
    const createEngine = mock(() => harness.engine);

    await renderIntoDomAsync(environment, <BinauralBeatsClient createEngine={createEngine} />);

    expect(getPlaybackButton(environment, "Play").disabled).toBe(false);
  });

  test("creates one engine and destroys it on unmount", async () => {
    const environment = domEnvironment as DomEnvironment;
    const harness = createEngineHarness();
    const createEngine = mock(() => harness.engine);

    await renderIntoDomAsync(environment, <BinauralBeatsClient createEngine={createEngine} />);

    expect(createEngine).toHaveBeenCalledTimes(1);

    environment.cleanup();
    domEnvironment = null;

    expect(harness.calls.destroyed).toBe(1);
  });

  test("hydrates the alpha preset from the URL hash", async () => {
    const environment = domEnvironment as DomEnvironment;
    const harness = createEngineHarness();
    const createEngine = mock(() => harness.engine);
    const alphaPreset = BINAURAL_BEAT_PRESETS.find((preset) => preset.id === "alpha");

    if (!alphaPreset) {
      throw new Error("Unable to find the alpha preset.");
    }

    environment.window.location.hash = "#preset=alpha";

    await renderIntoDomAsync(environment, <BinauralBeatsClient createEngine={createEngine} />);

    expect(getButtonByText(environment, "Alpha").getAttribute("aria-pressed")).toBe("true");
    expect(getNumericInput(environment, "beatFrequencyHz").value).toBe(
      String(alphaPreset.beatFrequencyHz),
    );
    expect(environment.document.querySelector("h2")?.textContent?.trim()).toBe(
      String(alphaPreset.beatFrequencyHz),
    );
  });

  test("uses the default config and no selected preset without a hash", async () => {
    const environment = domEnvironment as DomEnvironment;
    const harness = createEngineHarness();
    const createEngine = mock(() => harness.engine);

    await renderIntoDomAsync(environment, <BinauralBeatsClient createEngine={createEngine} />);

    expect(environment.document.querySelectorAll('button[aria-pressed="true"]')).toHaveLength(0);
    expect(getNumericInput(environment, "beatFrequencyHz").value).toBe(
      String(DEFAULT_BINAURAL_BEAT_CONFIG.beatFrequencyHz),
    );
    expect(getNumericInput(environment, "carrierFrequencyHz").value).toBe(
      String(DEFAULT_BINAURAL_BEAT_CONFIG.carrierFrequencyHz),
    );
    expect(getNumericInput(environment, "volume").value).toBe(
      String(DEFAULT_BINAURAL_BEAT_CONFIG.volume),
    );
    expect(getNumericInput(environment, "fadeSeconds").value).toBe(
      String(DEFAULT_BINAURAL_BEAT_CONFIG.fadeSeconds),
    );
  });

  test("selects a preset and replaces the URL hash", async () => {
    const environment = domEnvironment as DomEnvironment;
    const harness = createEngineHarness();
    const createEngine = mock(() => harness.engine);
    const originalReplaceState = environment.window.history.replaceState.bind(
      environment.window.history,
    );
    const replaceState = mock((data: unknown, unused: string, url?: string | URL | null) => {
      originalReplaceState(data, unused, url);
    });
    Object.defineProperty(environment.window.history, "replaceState", {
      configurable: true,
      value: replaceState,
      writable: true,
    });

    await renderIntoDomAsync(environment, <BinauralBeatsClient createEngine={createEngine} />);

    await dispatchClick(getButtonByText(environment, "Beta"), environment.window);

    expect(getButtonByText(environment, "Beta").getAttribute("aria-pressed")).toBe("true");
    expect(getNumericInput(environment, "beatFrequencyHz").value).toBe("18");
    expect(replaceState).toHaveBeenCalledTimes(1);
    expect(replaceState.mock.calls[0]?.[2]).toBe("#preset=beta");
    expect(environment.window.location.hash).toBe("#preset=beta");
  });

  test("shows Starting until deferred playback resolves", async () => {
    const environment = domEnvironment as DomEnvironment;
    const harness = createEngineHarness();
    const createEngine = mock(() => harness.engine);
    const deferred = createDeferred<void>();
    harness.setNextPlayPromise(deferred.promise);

    await renderIntoDomAsync(environment, <BinauralBeatsClient createEngine={createEngine} />);

    await dispatchClick(getPlaybackButton(environment, "Play"), environment.window);

    expect(harness.calls.played).toEqual([DEFAULT_BINAURAL_BEAT_CONFIG]);
    expect(getPlaybackButton(environment, "Starting").disabled).toBe(true);

    await act(async () => {
      deferred.resolve(undefined);
      await deferred.promise;
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(getPlaybackButton(environment, "Stop").disabled).toBe(false);
  });

  test("shows Stopping until deferred stop resolves", async () => {
    const environment = domEnvironment as DomEnvironment;
    const harness = createEngineHarness();
    const createEngine = mock(() => harness.engine);

    await renderIntoDomAsync(environment, <BinauralBeatsClient createEngine={createEngine} />);
    await dispatchClick(getPlaybackButton(environment, "Play"), environment.window);

    const deferred = createDeferred<void>();
    harness.setNextStopPromise(deferred.promise);

    await dispatchClick(getPlaybackButton(environment, "Stop"), environment.window);

    expect(harness.calls.stopped).toBe(1);
    expect(getPlaybackButton(environment, "Stopping").disabled).toBe(true);

    await act(async () => {
      deferred.resolve(undefined);
      await deferred.promise;
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(getPlaybackButton(environment, "Play").disabled).toBe(false);
  });

  test("recovers to Play and reports a stop failure", async () => {
    const environment = domEnvironment as DomEnvironment;
    const harness = createEngineHarness();
    const createEngine = mock(() => harness.engine);

    await renderIntoDomAsync(environment, <BinauralBeatsClient createEngine={createEngine} />);
    await dispatchClick(getPlaybackButton(environment, "Play"), environment.window);

    harness.setFailNextStop(new Error("stop blocked"));
    await dispatchClick(getPlaybackButton(environment, "Stop"), environment.window);

    expect(harness.calls.stopped).toBe(1);
    expect(environment.document.querySelector('[role="alert"]')?.textContent).toContain(
      "stop blocked",
    );
    expect(getPlaybackButton(environment, "Play").disabled).toBe(false);
  });

  test("recovers to Play and reports a play failure", async () => {
    const environment = domEnvironment as DomEnvironment;
    const harness = createEngineHarness();
    const createEngine = mock(() => harness.engine);
    harness.setFailNextPlay(new Error("blocked"));

    await renderIntoDomAsync(environment, <BinauralBeatsClient createEngine={createEngine} />);
    await dispatchClick(getPlaybackButton(environment, "Play"), environment.window);

    expect(harness.calls.played).toHaveLength(0);
    expect(environment.document.querySelector('[role="alert"]')?.textContent).toContain("blocked");
    expect(getPlaybackButton(environment, "Play").disabled).toBe(false);
  });

  test("updates the engine for config changes only while playing", async () => {
    const environment = domEnvironment as DomEnvironment;
    const harness = createEngineHarness();
    const createEngine = mock(() => harness.engine);

    await renderIntoDomAsync(environment, <BinauralBeatsClient createEngine={createEngine} />);

    await pressSliderKey(environment, "beatFrequencyHz", "ArrowRight", 4);

    expect(getNumericInput(environment, "beatFrequencyHz").value).toBe("12");
    expect(harness.calls.updated).toHaveLength(0);

    await dispatchClick(getPlaybackButton(environment, "Play"), environment.window);

    expect(harness.calls.played[0]?.beatFrequencyHz).toBe(12);
    const updateCountAfterPlay = harness.calls.updated.length;
    expect(updateCountAfterPlay).toBeGreaterThan(0);

    await pressSliderKey(environment, "beatFrequencyHz", "ArrowRight", 4);

    expect(getNumericInput(environment, "beatFrequencyHz").value).toBe("14");
    expect(harness.calls.updated.length).toBeGreaterThan(updateCountAfterPlay);
    expect(harness.calls.updated.at(-1)).toEqual({
      ...DEFAULT_BINAURAL_BEAT_CONFIG,
      beatFrequencyHz: 14,
    });
  });
});
