import { afterEach, beforeEach, describe, expect, mock, test } from "bun:test";
import { Window } from "happy-dom";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { renderToString } from "react-dom/server";

import { OscilloscopeClient } from "../oscilloscope-client";

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
  "HTMLCanvasElement",
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
    HTMLCanvasElement: window.HTMLCanvasElement,
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
  const window = new Window({ url: "http://localhost/oscilloscope" });
  installDomGlobals(window);

  Object.defineProperty(window.navigator, "gpu", {
    configurable: true,
    value: {},
    writable: true,
  });

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

function dispatchClick(target: Element, window: Window) {
  act(() => {
    target.dispatchEvent(new window.MouseEvent("click", { bubbles: true, button: 0 }));
  });
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

let domEnvironment: DomEnvironment | null = null;

beforeEach(() => {
  domEnvironment = setupDom();
});

afterEach(() => {
  domEnvironment?.cleanup();
  domEnvironment = null;
});

describe("OscilloscopeClient", () => {
  test("does not create the browser runtime during server render", () => {
    const createScope = mock(() => {
      throw new Error("browser runtime should not start during server render");
    });

    expect(() => renderToString(<OscilloscopeClient createScope={createScope} />)).not.toThrow();
    expect(createScope).not.toHaveBeenCalled();
  });

  test("keeps one scope instance alive while controls push config updates", async () => {
    const environment = domEnvironment as DomEnvironment;
    const updateConfig = mock((_config: unknown) => {});
    const scope = {
      destroy: mock(() => {}),
      getState: () => ({ config: null, provider: null, running: true }),
      setSignalProvider: mock((_provider: unknown) => {}),
      start: mock(async () => {}),
      stop: mock(() => {}),
      updateConfig,
    };
    const createScope = mock(() => scope);
    const createMicProvider = mock(async () => ({
      destroy: async () => {},
      provider: {
        channelCount: 1,
        fftSize: 8,
        frequencyBinCount: 4,
        sampleRate: 48_000,
        smoothing: 0,
        getFrequencyData: () => new Float32Array(4),
        getSamples: () => new Float32Array(8),
      },
    }));

    await renderIntoDomAsync(
      environment,
      <OscilloscopeClient createMicProvider={createMicProvider} createScope={createScope} />,
    );

    const buttons = Array.from(environment.document.querySelectorAll("button"));
    const micButton = buttons.find((button) =>
      button.textContent?.includes("Mic"),
    ) as HTMLButtonElement;

    dispatchClick(micButton, environment.window);
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(createScope).toHaveBeenCalledTimes(1);
    expect(updateConfig).toHaveBeenCalled();
  });

  test("shows a readable fallback message when runtime startup fails", async () => {
    const environment = domEnvironment as DomEnvironment;
    const createScope = mock(() => ({
      destroy: () => {},
      getState: () => ({ config: null, provider: null, running: false }),
      setSignalProvider: () => {},
      start: async () => {
        throw new Error("adapter unavailable");
      },
      stop: () => {},
      updateConfig: () => {},
    }));

    await renderIntoDomAsync(environment, <OscilloscopeClient createScope={createScope} />);

    expect(environment.document.body.textContent).toContain(
      "Unable to start WebGPU renderer: adapter unavailable",
    );
  });

  test("reuses the same scope while mic mode attaches and detaches a host provider", async () => {
    const environment = domEnvironment as DomEnvironment;
    const provider = {
      channelCount: 1,
      fftSize: 8,
      frequencyBinCount: 4,
      sampleRate: 48_000,
      smoothing: 0,
      getFrequencyData: () => new Float32Array(4),
      getSamples: () => new Float32Array(8),
    };
    const scope = {
      destroy: mock(() => {}),
      getState: () => ({ config: null, provider: null, running: true }),
      setSignalProvider: mock((_provider: unknown) => {}),
      start: mock(async () => {}),
      stop: mock(() => {}),
      updateConfig: mock((_config: unknown) => {}),
    };
    const createScope = mock(() => scope);
    const destroyMic = mock(async () => {});
    const createMicProvider = mock(async () => ({ destroy: destroyMic, provider }));

    await renderIntoDomAsync(
      environment,
      <OscilloscopeClient createMicProvider={createMicProvider} createScope={createScope} />,
    );

    const buttons = Array.from(environment.document.querySelectorAll("button"));
    const micButton = buttons.find((button) =>
      button.textContent?.includes("Mic"),
    ) as HTMLButtonElement;
    const oscillatorsButton = buttons.find((button) =>
      button.textContent?.includes("Oscillators"),
    ) as HTMLButtonElement;

    dispatchClick(micButton, environment.window);
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    dispatchClick(oscillatorsButton, environment.window);
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(createScope).toHaveBeenCalledTimes(1);
    expect(createMicProvider).toHaveBeenCalledTimes(1);
    expect(scope.setSignalProvider).toHaveBeenCalledWith(provider);
    expect(scope.setSignalProvider).toHaveBeenCalledWith(null);
    expect(destroyMic).toHaveBeenCalled();
  });

  test("ignores a stale mic rejection after switching back to oscillators", async () => {
    const environment = domEnvironment as DomEnvironment;
    const scope = {
      destroy: mock(() => {}),
      getState: () => ({ config: null, provider: null, running: true }),
      setSignalProvider: mock((_provider: unknown) => {}),
      start: mock(async () => {}),
      stop: mock(() => {}),
      updateConfig: mock((_config: unknown) => {}),
    };
    const createScope = mock(() => scope);
    const deferred = createDeferred<{
      destroy(): Promise<void>;
      provider: unknown;
    }>();
    const createMicProvider = mock(() => deferred.promise);

    await renderIntoDomAsync(
      environment,
      <OscilloscopeClient createMicProvider={createMicProvider} createScope={createScope} />,
    );

    const buttons = Array.from(environment.document.querySelectorAll("button"));
    const micButton = buttons.find((button) =>
      button.textContent?.includes("Mic"),
    ) as HTMLButtonElement;
    const oscillatorsButton = buttons.find((button) =>
      button.textContent?.includes("Oscillators"),
    ) as HTMLButtonElement;

    dispatchClick(micButton, environment.window);
    dispatchClick(oscillatorsButton, environment.window);

    deferred.reject(new Error("late mic failure"));
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(environment.document.body.textContent).toContain("Internal oscillators active");
    expect(environment.document.body.textContent).not.toContain("late mic failure");
  });
});
