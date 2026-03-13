type TrackId = string;

type TrackAsset = {
  src: string;
  mimeType: string;
  codec?: string;
  bitrateKbps?: number;
  fileSizeBytes?: number;
};

type TrackRecord = {
  id: TrackId;
  title: string;
  artist?: string;
  album?: string;
  artworkUrl?: string;
  duration?: number;
  waveformUrl?: string;
  loudnessLufs?: number;
  assets: TrackAsset[];
  defaultAssetIndex?: number;
};

export type { TrackAsset, TrackId, TrackRecord };
