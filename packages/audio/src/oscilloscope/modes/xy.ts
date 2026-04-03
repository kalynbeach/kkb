import type { DisplayMode, FrameGeometry, XyModeParams } from "./mode";

const clamp = (value: number) => Math.max(-1, Math.min(1, value));

export const createXyMode = (): DisplayMode<XyModeParams> => ({
  id: "xy",
  name: "XY",
  generateFrame: ({ params, signals }): FrameGeometry => {
    const left = signals.getSamples(0);
    const right = signals.channelCount === 2 ? signals.getSamples(1) : left;
    const sampleCount = Math.min(params.sampleCount, left.length, right.length);
    const points = new Float32Array(sampleCount * 2);

    for (let index = 0; index < sampleCount; index += 1) {
      points[index * 2] = clamp((left[index] ?? 0) * params.gain);
      points[index * 2 + 1] = clamp((right[index] ?? 0) * params.gain);
    }

    return {
      kind: "line-strip",
      points,
    };
  },
});
