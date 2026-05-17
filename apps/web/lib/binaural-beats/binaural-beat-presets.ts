import {
  BINAURAL_BEAT_LIMITS,
  type BinauralBeatConfig,
  sanitizeBinauralBeatConfig,
} from "./binaural-beat-config";

export type BinauralBeatPreset = {
  beatFrequencyHz: number;
  carrierFrequencyHz: number;
  id: string;
  name: string;
};

export const BINAURAL_BEAT_PRESETS = [
  {
    beatFrequencyHz: 2,
    carrierFrequencyHz: 400,
    id: "delta",
    name: "Delta",
  },
  {
    beatFrequencyHz: 6,
    carrierFrequencyHz: 400,
    id: "theta",
    name: "Theta",
  },
  {
    beatFrequencyHz: 10,
    carrierFrequencyHz: 400,
    id: "alpha",
    name: "Alpha",
  },
  {
    beatFrequencyHz: 18,
    carrierFrequencyHz: 400,
    id: "beta",
    name: "Beta",
  },
  {
    beatFrequencyHz: BINAURAL_BEAT_LIMITS.beatFrequencyHz.max,
    carrierFrequencyHz: 400,
    id: "gamma",
    name: "Gamma",
  },
] as const satisfies readonly BinauralBeatPreset[];

export type BinauralBeatPresetId = (typeof BINAURAL_BEAT_PRESETS)[number]["id"];

type DefinedBinauralBeatPreset = (typeof BINAURAL_BEAT_PRESETS)[number];

export const findBinauralBeatPreset = (presetId: string | null): DefinedBinauralBeatPreset | null =>
  BINAURAL_BEAT_PRESETS.find((preset) => preset.id === presetId) ?? null;

export const applyBinauralBeatPreset = (
  config: BinauralBeatConfig,
  preset: BinauralBeatPreset,
): BinauralBeatConfig =>
  sanitizeBinauralBeatConfig({
    ...config,
    beatFrequencyHz: preset.beatFrequencyHz,
    carrierFrequencyHz: preset.carrierFrequencyHz,
  });

export const getBinauralBeatPresetIdFromHash = (hash: string): string | null => {
  const hashValue = hash.startsWith("#") ? hash.slice(1) : hash;
  const params = new URLSearchParams(hashValue);
  return params.get("preset");
};

export const getBinauralBeatPresetFromHash = (hash: string) =>
  findBinauralBeatPreset(getBinauralBeatPresetIdFromHash(hash));

export const getHashWithBinauralBeatPreset = (hash: string, presetId: string) => {
  const hashValue = hash.startsWith("#") ? hash.slice(1) : hash;
  const params = new URLSearchParams(hashValue);
  params.set("preset", presetId);
  return `#${params.toString()}`;
};
