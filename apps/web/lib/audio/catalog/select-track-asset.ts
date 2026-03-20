import type { TrackAsset, TrackRecord, TrackRecordInput } from "./track-types";

function selectTrackAsset(track: TrackRecord): TrackAsset;
function selectTrackAsset(track: TrackRecordInput | null): TrackAsset | null;
function selectTrackAsset(track: TrackRecord | TrackRecordInput | null): TrackAsset | null {
  if (!track) {
    return null;
  }

  const assetIndex = track.defaultAssetIndex ?? 0;
  return track.assets[assetIndex] ?? track.assets[0] ?? null;
}

export { selectTrackAsset };
