import { describe, expect, test } from "bun:test";

import type { OscilloscopeConfig } from "../../types";
import { createRendererUniformValues, packRendererUniforms } from "../uniforms";

const config: OscilloscopeConfig = {
  canvas: {
    aspectRatio: "1:1",
    background: 0.02,
    quality: "quality",
  },
  mode: "xy",
  phosphor: {
    bloom: 0.75,
    color: "p31-green",
    trailLength: 64,
  },
  source: {
    type: "oscillators",
    ratioLock: "1:1",
    a: {
      amplitude: 1,
      detuneCents: 0,
      frequency: 220,
      phase: 0,
      waveform: "sine",
    },
    b: {
      amplitude: 1,
      detuneCents: 0,
      frequency: 220,
      phase: 0,
      waveform: "sine",
    },
  },
};

describe("createRendererUniformValues", () => {
  test("maps longer trails to slower fade and lower per-frame trace energy", () => {
    const shortTrail = createRendererUniformValues(
      {
        ...config,
        phosphor: { ...config.phosphor, trailLength: 24 },
      },
      640,
      320,
      1 / 60,
    );
    const longTrail = createRendererUniformValues(
      {
        ...config,
        phosphor: { ...config.phosphor, trailLength: 96 },
      },
      640,
      320,
      1 / 60,
    );

    expect(shortTrail.fadeAlpha).toBeGreaterThan(longTrail.fadeAlpha);
    expect(shortTrail.traceAlpha).toBeGreaterThan(longTrail.traceAlpha);
    expect(longTrail.fadeAlpha).toBeGreaterThan(0.03);
    expect(longTrail.texelSizeX).toBeCloseTo(1 / 640, 6);
    expect(longTrail.texelSizeY).toBeCloseTo(1 / 320, 6);
  });

  test("maps higher bloom into wider glow, hotter trace gain, and a brighter background lift", () => {
    const lowBloom = createRendererUniformValues(
      {
        ...config,
        phosphor: { ...config.phosphor, bloom: 0 },
      },
      640,
      320,
      1 / 60,
    );
    const highBloom = createRendererUniformValues(
      {
        ...config,
        phosphor: { ...config.phosphor, bloom: 1.5 },
      },
      640,
      320,
      1 / 60,
    );

    expect(highBloom.glowSpread).toBeGreaterThan(lowBloom.glowSpread);
    expect(highBloom.traceGain).toBeGreaterThan(lowBloom.traceGain);
    expect(highBloom.backgroundLift).toBeGreaterThan(lowBloom.backgroundLift);
  });

  test("clamps bloom and background inputs into safe shader ranges", () => {
    const values = createRendererUniformValues(
      {
        ...config,
        canvas: { ...config.canvas, background: -1 },
        phosphor: { ...config.phosphor, bloom: 4, trailLength: 16 },
      },
      0,
      0,
      1 / 60,
    );

    expect(values.backgroundLift).toBeGreaterThanOrEqual(0);
    expect(values.bloomStrength).toBe(1.5);
    expect(values.fadeAlpha).toBeLessThanOrEqual(0.1);
    expect(values.traceAlpha).toBeLessThanOrEqual(0.05);
    expect(values.texelSizeX).toBe(1);
    expect(values.texelSizeY).toBe(1);
  });

  test("normalizes fade against elapsed frame time", () => {
    const sixtyHertz = createRendererUniformValues(config, 640, 320, 1 / 60);
    const oneTwentyHertz = createRendererUniformValues(config, 640, 320, 1 / 120);

    expect(oneTwentyHertz.fadeAlpha).toBeLessThan(sixtyHertz.fadeAlpha);

    const retainedAtSixty = 1 - sixtyHertz.fadeAlpha;
    const retainedAtOneTwenty = 1 - oneTwentyHertz.fadeAlpha;

    expect(retainedAtOneTwenty * retainedAtOneTwenty).toBeCloseTo(retainedAtSixty, 6);
  });
});

describe("packRendererUniforms", () => {
  test("packs the renderer uniform values into one GPU-friendly buffer payload", () => {
    const values = createRendererUniformValues(config, 800, 600, 1 / 60);
    const payload = packRendererUniforms(values);

    expect(payload).toBeInstanceOf(Float32Array);
    expect(payload).toHaveLength(8);
    expect(payload[0]).toBeCloseTo(values.fadeAlpha, 6);
    expect(payload[1]).toBeCloseTo(values.traceAlpha, 6);
    expect(payload[2]).toBeCloseTo(values.backgroundLift, 6);
    expect(payload[3]).toBeCloseTo(values.glowSpread, 6);
    expect(payload[4]).toBeCloseTo(values.texelSizeX, 6);
    expect(payload[5]).toBeCloseTo(values.texelSizeY, 6);
    expect(payload[6]).toBeCloseTo(values.bloomStrength, 6);
    expect(payload[7]).toBeCloseTo(values.traceGain, 6);
  });
});
