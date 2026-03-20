import { selectTrackAsset } from "../catalog/select-track-asset";
import type { TrackCatalog } from "../catalog/track-catalog";
import type { TrackAsset, TrackRecord } from "../catalog/track-types";
import type { WebPlayer } from "../create-web-player";

type CatalogStatus = "idle" | "loading" | "ready" | "error";
type RestoreStatus = "idle" | "restoring" | "complete" | "error";

type PlayerControllerRuntimeSnapshot = ReturnType<WebPlayer["getSnapshot"]>;

type PlayerSelection = {
  trackId: string;
  track: TrackRecord;
  asset: TrackAsset;
};

type PlayerControllerSnapshot = Readonly<{
  catalogStatus: CatalogStatus;
  restoreStatus: RestoreStatus;
  selection: PlayerSelection | null;
  queueTrackIds: readonly string[];
  runtime: PlayerControllerRuntimeSnapshot;
  error: string | null;
}>;

type PlayerController = {
  getSnapshot(): PlayerControllerSnapshot;
  subscribe(listener: () => void): () => void;
  init(): Promise<void>;
  selectTrack(trackId: string): Promise<void>;
  play(): Promise<void>;
  pause(): Promise<void>;
  seek(seconds: number): Promise<void>;
  setRate(rate: number): Promise<void>;
  setVolume(volume: number): Promise<void>;
  destroy(): Promise<void>;
};

type PlayerControllerPlayer = Pick<
  WebPlayer,
  | "getSnapshot"
  | "subscribe"
  | "loadTrack"
  | "play"
  | "pause"
  | "seek"
  | "setRate"
  | "setVolume"
  | "destroy"
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
  selection: null,
  queueTrackIds: [],
  runtime: player.getSnapshot(),
  error: null,
});

const createPlayerController = ({
  catalog,
  player,
}: CreatePlayerControllerOptions): PlayerController => {
  let snapshot = getInitialSnapshot(player);
  // initPromise de-dupes concurrent boot, while initialized keeps later calls idempotent.
  let initPromise: Promise<void> | null = null;
  let trackLoadPromise: Promise<void> | null = null;
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
    const previousSelection = snapshot.selection;

    setSnapshot({
      catalogStatus: "ready",
      selection: {
        trackId: track.id,
        track,
        asset,
      },
      error: null,
    });

    try {
      await player.loadTrack({
        src: asset.src,
        mimeType: asset.mimeType,
      });
    } catch (error) {
      if (isStale(token)) {
        return false;
      }

      // Selection updates optimistically, so failed loads must restore the last confirmed track.
      setSnapshot({
        selection: previousSelection,
        runtime: player.getSnapshot(),
        error: toErrorMessage(error, "Unable to load selected track"),
      });
      throw error;
    }

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
      if (initPromise) {
        try {
          await initPromise;
        } catch {
          // Allow explicit user selection to recover after a failed init attempt.
        }
      }

      if (trackLoadPromise) {
        try {
          await trackLoadPromise;
        } catch {
          // Allow the newest explicit selection to recover after an earlier load failure.
        }
      }

      const nextTrackLoadPromise = (async () => {
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
      })();

      trackLoadPromise = nextTrackLoadPromise;

      try {
        await nextTrackLoadPromise;
      } finally {
        if (trackLoadPromise === nextTrackLoadPromise) {
          trackLoadPromise = null;
        }
      }
    },
    play: () => player.play(),
    pause: () => player.pause(),
    seek: (seconds) => player.seek(seconds),
    setRate: async (rate) => {
      await player.setRate(rate);
      syncRuntimeSnapshot();
    },
    setVolume: async (volume) => {
      await player.setVolume(volume);
      syncRuntimeSnapshot();
    },
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
  PlayerSelection,
  RestoreStatus,
};
