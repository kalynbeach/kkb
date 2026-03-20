type TrackId = string;

type TrackAsset = Readonly<{
  src: string;
  mimeType: string;
  codec?: string;
  bitrateKbps?: number;
  fileSizeBytes?: number;
}>;

type NonEmptyTrackAssets = readonly [TrackAsset, ...TrackAsset[]];

type TrackRecordBase = Readonly<{
  id: TrackId;
  title: string;
  artist?: string;
  album?: string;
  artworkUrl?: string;
  duration?: number;
  waveformUrl?: string;
  loudnessLufs?: number;
  defaultAssetIndex?: number;
}>;

type TrackRecordInput = TrackRecordBase & {
  assets: readonly TrackAsset[];
};

type TrackRecord = TrackRecordBase & {
  assets: NonEmptyTrackAssets;
};

const hasAssets = (assets: readonly TrackAsset[]): assets is NonEmptyTrackAssets => assets.length > 0;

const validateTrackRecord = (track: TrackRecordInput | null): TrackRecord | null => {
  if (!track || !hasAssets(track.assets)) {
    return null;
  }

  return track as TrackRecord;
};

export { validateTrackRecord };
export type { TrackAsset, TrackId, TrackRecord, TrackRecordInput };
