import { DEFAULT_TRACK_ID, STATIC_TRACK_CATALOG_DATA } from "./static-track-catalog-data";
import type { TrackCatalog } from "./track-catalog";

const createStaticTrackCatalog = (): TrackCatalog => {
  const tracks = STATIC_TRACK_CATALOG_DATA;
  const tracksById = new Map(tracks.map((track) => [track.id, track]));

  return {
    listTracks: () => tracks,
    getTrack: (trackId) => tracksById.get(trackId) ?? null,
    getDefaultTrackId: () => DEFAULT_TRACK_ID,
  };
};

export { createStaticTrackCatalog };
