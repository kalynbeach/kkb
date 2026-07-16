import { MAX_TRACE_POINTS } from "../limits";
import type { DisplayMode, FrameGeometry, XyModeParams } from "./mode";

const clamp = (value: number) => Math.max(-1, Math.min(1, value));

export const createXyMode = (): DisplayMode<XyModeParams> => {
  const pointBuffer = new Float32Array(MAX_TRACE_POINTS * 2);
  let activePoints = pointBuffer.subarray(0, 0);

  return {
    id: "xy",
    name: "XY",
    generateFrame: ({ params, signals }): FrameGeometry => {
      const left = signals.getSamples(0);
      const right = signals.channelCount === 2 ? signals.getSamples(1) : left;
      const sampleCount = Math.min(MAX_TRACE_POINTS, params.sampleCount, left.length, right.length);
      const activeLength = sampleCount * 2;

      if (activePoints.length !== activeLength) {
        activePoints = pointBuffer.subarray(0, activeLength);
      }

      for (let index = 0; index < sampleCount; index += 1) {
        activePoints[index * 2] = clamp((left[index] ?? 0) * params.gain);
        activePoints[index * 2 + 1] = clamp((right[index] ?? 0) * params.gain);
      }

      return {
        kind: "line-strip",
        points: activePoints,
      };
    },
  };
};
