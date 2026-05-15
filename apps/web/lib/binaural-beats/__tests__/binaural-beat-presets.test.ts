import { describe, expect, test } from "bun:test";

import { BINAURAL_BEAT_LIMITS, DEFAULT_BINAURAL_BEAT_CONFIG } from "../binaural-beat-config";
import {
  applyBinauralBeatPreset,
  BINAURAL_BEAT_PRESETS,
  findBinauralBeatPreset,
  getBinauralBeatPresetFromHash,
  getHashWithBinauralBeatPreset,
  getHashWithoutBinauralBeatPreset,
} from "../binaural-beat-presets";

describe("binaural beat presets", () => {
  test("uses unique preset ids", () => {
    const ids = BINAURAL_BEAT_PRESETS.map((preset) => preset.id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  test("keeps every preset frequency inside configured limits", () => {
    for (const preset of BINAURAL_BEAT_PRESETS) {
      expect(preset.beatFrequencyHz).toBeGreaterThanOrEqual(
        BINAURAL_BEAT_LIMITS.beatFrequencyHz.min,
      );
      expect(preset.beatFrequencyHz).toBeLessThanOrEqual(BINAURAL_BEAT_LIMITS.beatFrequencyHz.max);
      expect(preset.carrierFrequencyHz).toBeGreaterThanOrEqual(
        BINAURAL_BEAT_LIMITS.carrierFrequencyHz.min,
      );
      expect(preset.carrierFrequencyHz).toBeLessThanOrEqual(
        BINAURAL_BEAT_LIMITS.carrierFrequencyHz.max,
      );
    }
  });

  test("applies a preset without changing volume or fade", () => {
    const preset = findBinauralBeatPreset("beta");

    expect(preset).not.toBeNull();
    if (!preset) {
      return;
    }

    expect(
      applyBinauralBeatPreset(
        {
          beatFrequencyHz: 4,
          carrierFrequencyHz: 250,
          fadeSeconds: 1.7,
          volume: 0.27,
        },
        preset,
      ),
    ).toEqual({
      beatFrequencyHz: 18,
      carrierFrequencyHz: 400,
      fadeSeconds: 1.7,
      volume: 0.27,
    });
  });

  test("returns null for invalid hash presets", () => {
    expect(getBinauralBeatPresetFromHash("#preset=unknown")).toBeNull();
    expect(getBinauralBeatPresetFromHash("")).toBeNull();
  });

  test("reads valid hash preset and applies it to default config", () => {
    const preset = getBinauralBeatPresetFromHash("#preset=alpha");

    expect(preset).not.toBeNull();
    if (!preset) {
      return;
    }

    expect(applyBinauralBeatPreset(DEFAULT_BINAURAL_BEAT_CONFIG, preset)).toEqual({
      ...DEFAULT_BINAURAL_BEAT_CONFIG,
      beatFrequencyHz: 10,
      carrierFrequencyHz: 400,
    });
  });

  test("writes preset hash while preserving other hash parameters", () => {
    expect(getHashWithBinauralBeatPreset("#foo=bar", "theta")).toBe("#foo=bar&preset=theta");
  });

  test("removes preset hash while preserving other hash parameters", () => {
    expect(getHashWithoutBinauralBeatPreset("#foo=bar&preset=theta")).toBe("#foo=bar");
    expect(getHashWithoutBinauralBeatPreset("#preset=theta")).toBe("");
  });
});
