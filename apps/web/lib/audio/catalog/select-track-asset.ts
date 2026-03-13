import type { TrackAsset, TrackRecord } from "./track-types";

const selectTrackAsset = (track: TrackRecord | null): TrackAsset | null => {
  if (!track) {
    return null;
  }

  const assetIndex = track.defaultAssetIndex ?? 0;
  return track.assets[assetIndex] ?? track.assets[0] ?? null;
};

export { selectTrackAsset };
