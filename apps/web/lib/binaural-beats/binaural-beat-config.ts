export type BinauralBeatConfig = {
  beatFrequencyHz: number;
  carrierFrequencyHz: number;
  fadeSeconds: number;
  volume: number;
};

export type BinauralBeatFrequencies = {
  leftFrequencyHz: number;
  rightFrequencyHz: number;
};

export const BINAURAL_BEAT_LIMITS = {
  beatFrequencyHz: {
    default: 10,
    max: 30,
    min: 1,
  },
  carrierFrequencyHz: {
    default: 400,
    max: 900,
    min: 100,
  },
  fadeSeconds: {
    default: 0.8,
    max: 3,
    min: 0.1,
  },
  volume: {
    default: 0.15,
    max: 0.4,
    min: 0,
  },
} as const;

export const DEFAULT_BINAURAL_BEAT_CONFIG: BinauralBeatConfig = {
  beatFrequencyHz: BINAURAL_BEAT_LIMITS.beatFrequencyHz.default,
  carrierFrequencyHz: BINAURAL_BEAT_LIMITS.carrierFrequencyHz.default,
  fadeSeconds: BINAURAL_BEAT_LIMITS.fadeSeconds.default,
  volume: BINAURAL_BEAT_LIMITS.volume.default,
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const sanitizeNumber = (value: number, fallback: number) =>
  Number.isFinite(value) ? value : fallback;

export const sanitizeBinauralBeatConfig = (config: BinauralBeatConfig): BinauralBeatConfig => ({
  beatFrequencyHz: clamp(
    sanitizeNumber(config.beatFrequencyHz, BINAURAL_BEAT_LIMITS.beatFrequencyHz.default),
    BINAURAL_BEAT_LIMITS.beatFrequencyHz.min,
    BINAURAL_BEAT_LIMITS.beatFrequencyHz.max,
  ),
  carrierFrequencyHz: clamp(
    sanitizeNumber(config.carrierFrequencyHz, BINAURAL_BEAT_LIMITS.carrierFrequencyHz.default),
    BINAURAL_BEAT_LIMITS.carrierFrequencyHz.min,
    BINAURAL_BEAT_LIMITS.carrierFrequencyHz.max,
  ),
  fadeSeconds: clamp(
    sanitizeNumber(config.fadeSeconds, BINAURAL_BEAT_LIMITS.fadeSeconds.default),
    BINAURAL_BEAT_LIMITS.fadeSeconds.min,
    BINAURAL_BEAT_LIMITS.fadeSeconds.max,
  ),
  volume: clamp(
    sanitizeNumber(config.volume, BINAURAL_BEAT_LIMITS.volume.default),
    BINAURAL_BEAT_LIMITS.volume.min,
    BINAURAL_BEAT_LIMITS.volume.max,
  ),
});

export const getBinauralBeatFrequencies = (config: BinauralBeatConfig): BinauralBeatFrequencies => {
  const sanitizedConfig = sanitizeBinauralBeatConfig(config);

  return {
    leftFrequencyHz: sanitizedConfig.carrierFrequencyHz,
    rightFrequencyHz: sanitizedConfig.carrierFrequencyHz + sanitizedConfig.beatFrequencyHz,
  };
};
