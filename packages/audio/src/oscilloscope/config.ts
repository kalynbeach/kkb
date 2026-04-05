import type { OscilloscopeConfig, OscilloscopeConfigUpdate } from "./types";

export const mergeOscilloscopeConfig = (
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
