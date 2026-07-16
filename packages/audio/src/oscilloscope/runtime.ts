import { mergeOscilloscopeConfig } from "./config";
import { MAX_TRACE_POINTS } from "./limits";
import { createXyMode } from "./modes/xy";
import { createWebGpuRenderer } from "./renderer/pipeline";
import type { OscilloscopeRenderer } from "./renderer/types";
import {
  createOscillatorSignalProvider,
  type OscillatorSignalProvider,
} from "./signal/oscillator-source";
import type { SignalProvider } from "./signal/signal-provider";
import type { OscilloscopeConfig, OscilloscopeController } from "./types";

type RuntimeOptions = {
  cancelFrame?: (handle: number) => void;
  createRenderer?: (canvas: HTMLCanvasElement) => Promise<OscilloscopeRenderer>;
  getDevicePixelRatio?: () => number;
  now?: () => number;
  requestFrame?: (callback: FrameRequestCallback) => number;
};

const EMPTY_GEOMETRY = {
  kind: "line-strip" as const,
  points: new Float32Array(0),
};

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
    (() => (typeof window === "undefined" ? 1 : Math.max(1, window.devicePixelRatio || 1)));
  const now = options.now ?? (() => performance.now() / 1000);

  let config = initialConfig;
  let running = false;
  let frameHandle = 0;
  let lastFrameTime: number | null = null;
  let renderer: OscilloscopeRenderer | null = null;
  let internalProvider: OscillatorSignalProvider | null =
    config.source.type === "oscillators" ? createOscillatorSignalProvider(config.source) : null;
  let providerOverride: SignalProvider | null = null;
  const xyMode = createXyMode();

  const syncInternalProvider = () => {
    if (config.source.type !== "oscillators") {
      internalProvider = null;
      return;
    }

    internalProvider ??= createOscillatorSignalProvider(config.source);
    internalProvider.update(config.source);
  };

  const getActiveProvider = () =>
    config.source.type === "mic" ? providerOverride : internalProvider;

  const tick = () => {
    if (!running || !renderer) {
      return;
    }

    try {
      const activeProvider = getActiveProvider();
      const frameTime = now();
      const deltaSeconds = lastFrameTime === null ? 1 / 60 : Math.max(0, frameTime - lastFrameTime);
      lastFrameTime = frameTime;
      renderer.resize(canvas.clientWidth, canvas.clientHeight, getDevicePixelRatio());
      const geometry =
        activeProvider === null
          ? EMPTY_GEOMETRY
          : xyMode.generateFrame({
              time: frameTime,
              signals: activeProvider,
              params: {
                gain: 1,
                sampleCount: Math.min(
                  MAX_TRACE_POINTS,
                  Math.max(256, Math.round(config.phosphor.trailLength) * 8),
                ),
              },
              viewport: { height: canvas.height, width: canvas.width },
            });
      renderer.drawFrame(geometry, config, deltaSeconds);
      frameHandle = requestFrame(tick);
    } catch (error) {
      running = false;
      lastFrameTime = null;
      console.error("[oscilloscope] render tick failed", error);
    }
  };

  return {
    destroy: () => {
      running = false;
      cancelFrame(frameHandle);
      renderer?.destroy();
      renderer = null;
      lastFrameTime = null;
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
      lastFrameTime = null;
      tick();
    },
    stop: () => {
      running = false;
      cancelFrame(frameHandle);
      lastFrameTime = null;
    },
    updateConfig: (update) => {
      config = mergeOscilloscopeConfig(config, update);
      syncInternalProvider();
    },
  };
};
