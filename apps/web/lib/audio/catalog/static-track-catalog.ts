import { DEFAULT_TRACK_ID, STATIC_TRACK_CATALOG_DATA } from "./static-track-catalog-data";
import type { TrackCatalog } from "./track-catalog";
import { validateTrackRecord } from "./track-types";

const createStaticTrackCatalog = (): TrackCatalog => {
  const tracks = STATIC_TRACK_CATALOG_DATA.flatMap((track) => {
    const validatedTrack = validateTrackRecord(track);
    return validatedTrack ? [validatedTrack] : [];
  });
  const tracksById = new Map(tracks.map((track) => [track.id, track]));

  return {
    listTracks: () => tracks,
    getTrack: (trackId) => tracksById.get(trackId) ?? null,
    getDefaultTrackId: () => DEFAULT_TRACK_ID,
  };
};

export { createStaticTrackCatalog };
