import type { OscilloscopeSupport } from "./types";

type SupportEnv = {
  navigator?: {
    gpu?: unknown;
  };
};

export const getOscilloscopeSupport = (
  env: SupportEnv = globalThis as SupportEnv,
): OscilloscopeSupport => {
  if (!env.navigator?.gpu) {
    return {
      reason: "WebGPU is not available in this browser.",
      status: "unsupported",
    };
  }

  return {
    status: "supported",
  };
};
