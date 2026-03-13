import type { TrackId, TrackRecord } from "./track-types";

type TrackCatalog = {
  listTracks(): TrackRecord[];
  getTrack(trackId: TrackId): TrackRecord | null;
  getDefaultTrackId(): TrackId;
};

export type { TrackCatalog };
