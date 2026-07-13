import { afterEach, beforeEach, describe, expect, mock, test } from "bun:test";
import { Window } from "happy-dom";
import { act, StrictMode } from "react";
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
  "HTMLFormElement",
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
    HTMLFormElement: window.HTMLFormElement,
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
    target.dispatchEvent(new window.PointerEvent("pointerdown", { bubbles: true, button: 0 }));
    target.dispatchEvent(new window.MouseEvent("mousedown", { bubbles: true, button: 0 }));
    target.dispatchEvent(new window.PointerEvent("pointerup", { bubbles: true, button: 0 }));
    target.dispatchEvent(new window.MouseEvent("mouseup", { bubbles: true, button: 0 }));
    target.dispatchEvent(new window.MouseEvent("click", { bubbles: true, button: 0 }));
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

async function selectPreset(environment: DomEnvironment, value: string) {
  const nativeSelect = environment.document.querySelector('select[aria-label="Preset fallback"]');

  if (nativeSelect instanceof environment.window.HTMLSelectElement) {
    act(() => {
      nativeSelect.value = value;
      nativeSelect.dispatchEvent(new environment.window.Event("change", { bubbles: true }));
    });
    return;
  }

  const trigger = environment.document.querySelector(
    '[data-slot="select-trigger"]',
  ) as HTMLButtonElement | null;

  if (!trigger) {
    throw new Error("Unable to find preset select trigger.");
  }

  dispatchClick(trigger, environment.window);
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });

  const option = Array.from(
    environment.document.querySelectorAll('[data-slot="select-item"]'),
  ).find((candidate) => candidate.getAttribute("data-value") === value);

  if (!(option instanceof environment.window.HTMLElement)) {
    throw new Error(`Unable to find preset option: ${value}`);
  }

  dispatchClick(option, environment.window);
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
  test("does not create or load the browser runtime during server render", () => {
    const createScope = mock(() => {
      throw new Error("browser runtime should not start during server render");
    });
    const loadCreateScope = mock(async () => ({ createOscilloscope: createScope }));

    const html = renderToString(
      <OscilloscopeClient createScope={createScope} loadCreateScope={loadCreateScope} />,
    );

    expect(html).toContain("Checking WebGPU support...");
    expect(createScope).not.toHaveBeenCalled();
    expect(loadCreateScope).not.toHaveBeenCalled();
  });

  test("shows the unsupported state without starting the browser runtime", async () => {
    const environment = domEnvironment as DomEnvironment;
    Object.defineProperty(environment.window.navigator, "gpu", {
      configurable: true,
      value: undefined,
      writable: true,
    });
    const createScope = mock(() => {
      throw new Error("unsupported browser runtime should not start");
    });

    await renderIntoDomAsync(environment, <OscilloscopeClient createScope={createScope} />);

    expect(environment.document.body.textContent).toContain(
      "WebGPU is not available in this browser.",
    );
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

    const micButton = getButtonByText(environment, "Mic");

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
    expect(environment.document.body.textContent).not.toContain("Internal oscillators active");
  });

  test("shows a readable fallback message when scope construction throws synchronously", async () => {
    const environment = domEnvironment as DomEnvironment;
    const createScope = mock(() => {
      throw new Error("scope construction failed");
    });

    await renderIntoDomAsync(environment, <OscilloscopeClient createScope={createScope} />);

    expect(environment.document.body.textContent).toContain(
      "Unable to start WebGPU renderer: scope construction failed",
    );
    expect(environment.document.body.textContent).not.toContain("Internal oscillators active");
  });

  test("shows a readable fallback message when lazy scope loading fails", async () => {
    const environment = domEnvironment as DomEnvironment;
    const loadCreateScope = mock(async () => {
      throw new Error("lazy scope import failed");
    });

    await renderIntoDomAsync(environment, <OscilloscopeClient loadCreateScope={loadCreateScope} />);

    expect(environment.document.body.textContent).toContain(
      "Unable to start WebGPU renderer: lazy scope import failed",
    );
    expect(environment.document.body.textContent).not.toContain("Internal oscillators active");
  });

  test("replays latest source state after lazy scope loading resolves", async () => {
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
    const createScope = mock((_canvas: HTMLCanvasElement, _config: unknown) => scope);
    const deferred = createDeferred<{ createOscilloscope: typeof createScope }>();
    const loadCreateScope = mock(() => deferred.promise);
    const createMicProvider = mock(async () => ({
      destroy: async () => {},
      provider,
    }));

    await renderIntoDomAsync(
      environment,
      <OscilloscopeClient
        createMicProvider={createMicProvider}
        loadCreateScope={loadCreateScope}
      />,
    );

    const micButton = getButtonByText(environment, "Mic");

    dispatchClick(micButton, environment.window);

    await act(async () => {
      deferred.resolve({ createOscilloscope: createScope });
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(createScope).toHaveBeenCalledTimes(1);
    expect(createScope.mock.calls[0]?.[1]).toMatchObject({
      source: { type: "mic" },
    });
    expect(createMicProvider).toHaveBeenCalledTimes(1);
    expect(scope.setSignalProvider).toHaveBeenCalledWith(provider);
  });

  test("passes the fake mic mode from the URL into the mic provider factory", async () => {
    const environment = domEnvironment as DomEnvironment;
    environment.window.history.replaceState(
      {},
      "",
      "http://localhost/oscilloscope?mic=fake-stereo",
    );

    const provider = {
      channelCount: 2,
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
    const createMicProvider = mock(async (_options?: unknown) => ({
      destroy: async () => {},
      provider,
    }));

    await renderIntoDomAsync(
      environment,
      <OscilloscopeClient createMicProvider={createMicProvider} createScope={createScope} />,
    );

    const micButton = getButtonByText(environment, "Mic");

    dispatchClick(micButton, environment.window);
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(createMicProvider).toHaveBeenCalledWith({ mode: "fake-stereo" });
  });

  test("clamps hash-restored visual and oscillator settings to safe bounds", async () => {
    const environment = domEnvironment as DomEnvironment;
    environment.window.history.replaceState(
      {},
      "",
      "http://localhost/oscilloscope#preset=circle&trail=100000&bloom=10&freqA=-10&freqB=500000",
    );

    const scope = {
      destroy: mock(() => {}),
      getState: () => ({ config: null, provider: null, running: true }),
      setSignalProvider: mock((_provider: unknown) => {}),
      start: mock(async () => {}),
      stop: mock(() => {}),
      updateConfig: mock((_config: unknown) => {}),
    };
    const createScope = mock(() => scope);

    await renderIntoDomAsync(
      environment,
      <StrictMode>
        <OscilloscopeClient createScope={createScope} />
      </StrictMode>,
    );
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(scope.updateConfig.mock.calls.at(-1)?.[0]).toMatchObject({
      phosphor: {
        bloom: 1.5,
        trailLength: 128,
      },
      source: {
        a: {
          frequency: 1,
        },
        b: {
          frequency: 20_000,
        },
      },
    });
    expect(environment.window.location.hash).toBe(
      "#preset=circle&source=oscillators&freqA=1&freqB=20000&trail=128&bloom=1.5",
    );
  });

  test("keeps mic mode active when switching presets", async () => {
    const environment = domEnvironment as DomEnvironment;
    const provider = {
      channelCount: 2,
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
    const createMicProvider = mock(async () => ({
      destroy: async () => {},
      provider,
    }));

    await renderIntoDomAsync(
      environment,
      <OscilloscopeClient createMicProvider={createMicProvider} createScope={createScope} />,
    );

    const micButton = getButtonByText(environment, "Mic");

    dispatchClick(micButton, environment.window);
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    await selectPreset(environment, "figure-eight");
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(createMicProvider).toHaveBeenCalledTimes(1);
    expect(scope.setSignalProvider).toHaveBeenCalledWith(provider);
    expect(scope.updateConfig.mock.calls.at(-1)?.[0]).toMatchObject({
      source: {
        type: "mic",
      },
    });
  });

  test("hides oscillator-only signal controls in mic mode", async () => {
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

    expect(environment.document.body.textContent).toContain("Oscillator A");
    expect(environment.document.body.textContent).toContain("Oscillator B");

    dispatchClick(getButtonByText(environment, "Mic"), environment.window);
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(environment.document.body.textContent).not.toContain("Oscillator A");
    expect(environment.document.body.textContent).not.toContain("Oscillator B");
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

    const micButton = getButtonByText(environment, "Mic");
    const oscillatorsButton = getButtonByText(environment, "Oscillators");

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

    const micButton = getButtonByText(environment, "Mic");
    const oscillatorsButton = getButtonByText(environment, "Oscillators");

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
