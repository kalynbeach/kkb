import { describe, expect, test } from "bun:test";

import {
  BINAURAL_BEAT_LIMITS,
  DEFAULT_BINAURAL_BEAT_CONFIG,
  getBinauralBeatFrequencies,
  sanitizeBinauralBeatConfig,
} from "../binaural-beat-config";

describe("binaural beat config", () => {
  test("keeps default config inside safe limits", () => {
    const config = sanitizeBinauralBeatConfig(DEFAULT_BINAURAL_BEAT_CONFIG);

    expect(config.carrierFrequencyHz).toBe(BINAURAL_BEAT_LIMITS.carrierFrequencyHz.default);
    expect(config.beatFrequencyHz).toBe(BINAURAL_BEAT_LIMITS.beatFrequencyHz.default);
    expect(config.volume).toBe(BINAURAL_BEAT_LIMITS.volume.default);
    expect(config.fadeSeconds).toBe(BINAURAL_BEAT_LIMITS.fadeSeconds.default);
  });

  test("clamps carrier and beat frequencies", () => {
    expect(
      sanitizeBinauralBeatConfig({
        beatFrequencyHz: -12,
        carrierFrequencyHz: 12_000,
        fadeSeconds: 1,
        volume: 0.1,
      }),
    ).toMatchObject({
      beatFrequencyHz: BINAURAL_BEAT_LIMITS.beatFrequencyHz.min,
      carrierFrequencyHz: BINAURAL_BEAT_LIMITS.carrierFrequencyHz.max,
    });
  });

  test("clamps volume and fade duration", () => {
    expect(
      sanitizeBinauralBeatConfig({
        beatFrequencyHz: 10,
        carrierFrequencyHz: 400,
        fadeSeconds: 12,
        volume: 4,
      }),
    ).toMatchObject({
      fadeSeconds: BINAURAL_BEAT_LIMITS.fadeSeconds.max,
      volume: BINAURAL_BEAT_LIMITS.volume.max,
    });
  });

  test("uses defaults for invalid numeric input", () => {
    expect(
      sanitizeBinauralBeatConfig({
        beatFrequencyHz: Number.NaN,
        carrierFrequencyHz: Number.POSITIVE_INFINITY,
        fadeSeconds: Number.NEGATIVE_INFINITY,
        volume: Number.NaN,
      }),
    ).toEqual(DEFAULT_BINAURAL_BEAT_CONFIG);
  });

  test("computes stereo frequencies from carrier and beat delta", () => {
    expect(
      getBinauralBeatFrequencies({
        beatFrequencyHz: 7,
        carrierFrequencyHz: 320,
        fadeSeconds: 0.5,
        volume: 0.12,
      }),
    ).toEqual({
      leftFrequencyHz: 320,
      rightFrequencyHz: 327,
    });
  });
});
