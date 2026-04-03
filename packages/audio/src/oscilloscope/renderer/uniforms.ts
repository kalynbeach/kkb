import type { OscilloscopeConfig } from "../types";

export type RendererUniformValues = {
  background: number;
  bloomStrength: number;
  fadeAlpha: number;
  glowSpread: number;
  texelSizeX: number;
  texelSizeY: number;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export const createRendererUniformValues = (
  config: OscilloscopeConfig,
  width: number,
  height: number,
  deltaSeconds: number,
): RendererUniformValues => {
  const safeWidth = Math.max(1, width);
  const safeHeight = Math.max(1, height);
  const trailLength = Math.max(16, config.phosphor.trailLength);
  const fadeAlphaAtSixtyHertz = clamp(2.2 / trailLength, 0.015, 0.14);
  const retainedAtSixtyHertz = 1 - fadeAlphaAtSixtyHertz;
  const normalizedFrames = Math.max(0, deltaSeconds) * 60;
  const fadeAlpha = clamp(1 - retainedAtSixtyHertz ** normalizedFrames, 0, 1);

  return {
    background: clamp(config.canvas.background, 0, 1),
    bloomStrength: clamp(config.phosphor.bloom, 0, 1.5),
    fadeAlpha,
    glowSpread: clamp(0.75 + config.phosphor.bloom * 1.25, 0.75, 3),
    texelSizeX: 1 / safeWidth,
    texelSizeY: 1 / safeHeight,
  };
};

export const packRendererUniforms = (values: RendererUniformValues) =>
  new Float32Array([
    values.fadeAlpha,
    values.bloomStrength,
    values.background,
    values.glowSpread,
    values.texelSizeX,
    values.texelSizeY,
    0,
    0,
  ]);
