import { selectTrackAsset } from "../catalog/select-track-asset";
import type { TrackCatalog } from "../catalog/track-catalog";
import type { TrackAsset, TrackRecord } from "../catalog/track-types";
import type { WebPlayer } from "../create-web-player";

type CatalogStatus = "idle" | "loading" | "ready" | "error";
type RestoreStatus = "idle" | "restoring" | "complete" | "error";

type PlayerControllerRuntimeSnapshot = ReturnType<WebPlayer["getSnapshot"]>;

type PlayerControllerSnapshot = {
  catalogStatus: CatalogStatus;
  restoreStatus: RestoreStatus;
  selectedTrackId: string | null;
  selectedTrack: TrackRecord | null;
  queueTrackIds: string[];
  asset: TrackAsset | null;
  runtime: PlayerControllerRuntimeSnapshot;
  error: string | null;
};

type PlayerController = {
  getSnapshot(): PlayerControllerSnapshot;
  subscribe(listener: () => void): () => void;
  init(): Promise<void>;
  selectTrack(trackId: string): Promise<void>;
  play(): Promise<void>;
  pause(): Promise<void>;
  seek(seconds: number): Promise<void>;
  destroy(): Promise<void>;
};

type PlayerControllerPlayer = Pick<
  WebPlayer,
  "getSnapshot" | "subscribe" | "loadTrack" | "play" | "pause" | "seek" | "destroy"
>;

type CreatePlayerControllerOptions = {
  catalog: TrackCatalog;
  player: PlayerControllerPlayer;
};

const getInitialSnapshot = (
  player: PlayerControllerPlayer,
  catalogStatus: CatalogStatus = "idle",
): PlayerControllerSnapshot => ({
  catalogStatus,
  restoreStatus: "idle",
  selectedTrackId: null,
  selectedTrack: null,
  queueTrackIds: [],
  asset: null,
  runtime: player.getSnapshot(),
  error: null,
});

const createPlayerController = ({
  catalog,
  player,
}: CreatePlayerControllerOptions): PlayerController => {
  let snapshot = getInitialSnapshot(player);
  let initPromise: Promise<void> | null = null;
  let initialized = false;
  let disposed = false;
  let lifecycleToken = 0;
  const listeners = new Set<() => void>();

  const emit = () => {
    for (const listener of listeners) {
      listener();
    }
  };

  const setSnapshot = (patch: Partial<PlayerControllerSnapshot>) => {
    if (disposed) {
      return;
    }

    snapshot = {
      ...snapshot,
      ...patch,
      runtime: patch.runtime ?? snapshot.runtime,
    };
    emit();
  };

  const syncRuntimeSnapshot = () => {
    setSnapshot({
      runtime: player.getSnapshot(),
    });
  };

  const isStale = (token: number) => disposed || token !== lifecycleToken;

  const toErrorMessage = (error: unknown, fallbackMessage: string) =>
    error instanceof Error ? error.message : fallbackMessage;

  const unsubscribePlayer = player.subscribe(syncRuntimeSnapshot);

  const loadTrack = async (track: TrackRecord, token: number) => {
    const asset = selectTrackAsset(track);

    if (!asset) {
      setSnapshot({
        error: `Track "${track.id}" does not have a playable asset`,
      });
      throw new Error(`Track "${track.id}" does not have a playable asset`);
    }

    setSnapshot({
      catalogStatus: "ready",
      selectedTrackId: track.id,
      selectedTrack: track,
      asset,
      error: null,
    });

    await player.loadTrack({
      src: asset.src,
      mimeType: asset.mimeType,
    });

    if (isStale(token)) {
      return false;
    }

    syncRuntimeSnapshot();
    return true;
  };

  const ensureCatalogReady = () => {
    if (snapshot.catalogStatus === "ready") {
      return;
    }

    setSnapshot({
      catalogStatus: "loading",
      error: null,
    });

    const defaultTrackId = catalog.getDefaultTrackId();
    const defaultTrack = catalog.getTrack(defaultTrackId);

    if (!defaultTrack) {
      setSnapshot({
        catalogStatus: "error",
        error: `Default track "${defaultTrackId}" is missing from the catalog`,
      });
      throw new Error(`Default track "${defaultTrackId}" is missing from the catalog`);
    }

    setSnapshot({
      catalogStatus: "ready",
      restoreStatus: initialized ? snapshot.restoreStatus : "restoring",
    });
  };

  return {
    getSnapshot: () => snapshot,
    subscribe: (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    init: async () => {
      if (initialized) {
        return;
      }

      if (initPromise) {
        return initPromise;
      }

      initPromise = (async () => {
        const token = lifecycleToken;
        ensureCatalogReady();
        const defaultTrack = catalog.getTrack(catalog.getDefaultTrackId());

        if (!defaultTrack) {
          throw new Error("Default track is missing from the catalog");
        }

        const completed = await loadTrack(defaultTrack, token);
        if (!completed || isStale(token)) {
          return;
        }

        initialized = true;
        setSnapshot({ restoreStatus: "complete" });
      })();

      try {
        await initPromise;
      } catch (error) {
        if (!isStale(lifecycleToken)) {
          setSnapshot({
            restoreStatus: "error",
            error: toErrorMessage(error, "Unable to initialize player"),
          });
        }
        throw error;
      } finally {
        initPromise = null;
      }
    },
    selectTrack: async (trackId) => {
      ensureCatalogReady();
      const track = catalog.getTrack(trackId);

      if (!track) {
        setSnapshot({
          error: `Track "${trackId}" is missing from the catalog`,
        });
        throw new Error(`Track "${trackId}" is missing from the catalog`);
      }

      const token = lifecycleToken;
      await loadTrack(track, token);
      if (isStale(token)) {
        return;
      }

      if (!initialized) {
        initialized = true;
        setSnapshot({ restoreStatus: "complete" });
      }
    },
    play: () => player.play(),
    pause: () => player.pause(),
    seek: (seconds) => player.seek(seconds),
    destroy: async () => {
      disposed = true;
      lifecycleToken += 1;
      unsubscribePlayer();
      listeners.clear();
      await player.destroy();
    },
  };
};

export { createPlayerController };
export type {
  CatalogStatus,
  PlayerController,
  PlayerControllerPlayer,
  PlayerControllerRuntimeSnapshot,
  PlayerControllerSnapshot,
  RestoreStatus,
};
