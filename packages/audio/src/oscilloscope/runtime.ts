import { createXyMode } from "./modes/xy";
import { createWebGpuRenderer } from "./renderer/pipeline";
import type { OscilloscopeRenderer } from "./renderer/types";
import {
  createOscillatorSignalProvider,
  type OscillatorSignalProvider,
} from "./signal/oscillator-source";
import type { SignalProvider } from "./signal/signal-provider";
import type {
  OscilloscopeConfig,
  OscilloscopeConfigUpdate,
  OscilloscopeController,
} from "./types";

type RuntimeOptions = {
  cancelFrame?: (handle: number) => void;
  createRenderer?: (canvas: HTMLCanvasElement) => Promise<OscilloscopeRenderer>;
  getDevicePixelRatio?: () => number;
  now?: () => number;
  requestFrame?: (callback: FrameRequestCallback) => number;
};

const mergeConfig = (
  current: OscilloscopeConfig,
  update: OscilloscopeConfigUpdate,
): OscilloscopeConfig => ({
  ...current,
  ...update,
  canvas: { ...current.canvas, ...update.canvas },
  phosphor: { ...current.phosphor, ...update.phosphor },
  source: {
    ...current.source,
    ...update.source,
    a: { ...current.source.a, ...update.source?.a },
    b: { ...current.source.b, ...update.source?.b },
  },
});

export const createOscilloscope = (
  canvas: HTMLCanvasElement,
  initialConfig: OscilloscopeConfig,
  options: RuntimeOptions = {},
): OscilloscopeController => {
  const createRenderer = options.createRenderer ?? createWebGpuRenderer;
  const requestFrame = options.requestFrame ?? requestAnimationFrame;
  const cancelFrame = options.cancelFrame ?? cancelAnimationFrame;
  const getDevicePixelRatio =
    options.getDevicePixelRatio ??
    (() =>
      typeof window === "undefined" ? 1 : Math.max(1, window.devicePixelRatio || 1));
  const now = options.now ?? (() => performance.now() / 1000);

  let config = initialConfig;
  let running = false;
  let frameHandle = 0;
  let renderer: OscilloscopeRenderer | null = null;
  let internalProvider: OscillatorSignalProvider | null = createOscillatorSignalProvider(
    config.source,
  );
  let providerOverride: SignalProvider | null = null;
  const xyMode = createXyMode();

  const getActiveProvider = () => providerOverride ?? internalProvider;

  const tick = () => {
    const activeProvider = getActiveProvider();
    if (!running || !renderer || !activeProvider) {
      return;
    }

    renderer.resize(canvas.clientWidth, canvas.clientHeight, getDevicePixelRatio());
    const geometry = xyMode.generateFrame({
      time: now(),
      signals: activeProvider,
      params: { gain: 1, sampleCount: Math.max(256, config.phosphor.trailLength * 8) },
      viewport: { height: canvas.height, width: canvas.width },
    });
    renderer.drawFrame(geometry, config);
    frameHandle = requestFrame(tick);
  };

  return {
    destroy: () => {
      running = false;
      cancelFrame(frameHandle);
      renderer?.destroy();
      renderer = null;
      providerOverride = null;
      internalProvider = null;
    },
    getState: () => ({ config, provider: getActiveProvider(), running }),
    setSignalProvider: (provider) => {
      providerOverride = provider;
    },
    start: async () => {
      if (running) {
        return;
      }

      renderer ??= await createRenderer(canvas);
      running = true;
      tick();
    },
    stop: () => {
      running = false;
      cancelFrame(frameHandle);
    },
    updateConfig: (update) => {
      config = mergeConfig(config, update);
      internalProvider?.update(config.source);
    },
  };
};
