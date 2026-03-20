import { describe, expect, mock, test } from "bun:test";

import type { TrackCatalog } from "../../catalog/track-catalog";
import type { TrackRecord } from "../../catalog/track-types";
import { createPlayerController } from "../player-controller";

const AAC_TRACK: TrackRecord = {
  id: "test-tone-aac",
  title: "AAC Track",
  assets: [{ src: "/audio/test-tone-aac.m4a", mimeType: "audio/mp4; codecs=mp4a.40.2" }],
};

const OPUS_TRACK: TrackRecord = {
  id: "test-tone-opus",
  title: "Opus Track",
  assets: [{ src: "/audio/test-tone-opus.webm", mimeType: "audio/webm; codecs=opus" }],
};

const createCatalogStub = ({
  tracks = [AAC_TRACK, OPUS_TRACK],
  defaultTrackId = AAC_TRACK.id,
}: {
  tracks?: TrackRecord[];
  defaultTrackId?: string;
} = {}): TrackCatalog => {
  const tracksById = new Map(tracks.map((track) => [track.id, track]));

  return {
    listTracks: () => tracks,
    getTrack: (trackId) => tracksById.get(trackId) ?? null,
    getDefaultTrackId: () => defaultTrackId,
  };
};

const createPlayerStub = () => {
  let listener: (() => void) | null = null;
  let snapshot = {
    status: "idle" as const,
    currentTime: 0,
    duration: 0,
    sourceId: null as string | null,
    error: null as string | null,
    rate: 1,
    volume: 1,
  };
  const loadTrack = mock(async (_input: { src: string; mimeType?: string }) => {});
  const play = mock(async () => {});
  const pause = mock(async () => {});
  const seek = mock(async (_seconds: number) => {});
  const setRate = mock(async (rate: number) => {
    snapshot = { ...snapshot, rate };
    listener?.();
  });
  const setVolume = mock(async (volume: number) => {
    snapshot = { ...snapshot, volume };
    listener?.();
  });
  const destroy = mock(async () => {});

  return {
    player: {
      getSnapshot: () => snapshot,
      subscribe: (nextListener: () => void) => {
        listener = nextListener;
        return () => {
          listener = null;
        };
      },
      loadTrack: async (input: { src: string; mimeType?: string }) => {
        await loadTrack(input);
        snapshot = {
          ...snapshot,
          sourceId: input.mimeType?.includes("webm") ? "fallback" : "media-element",
        };
        listener?.();
      },
      play,
      pause,
      seek,
      setRate,
      setVolume,
      destroy,
    },
    loadTrack,
    play,
    pause,
    seek,
    setRate,
    setVolume,
    destroy,
  };
};

const createDeferred = <T>() => {
  let resolvePromise: (value: T | PromiseLike<T>) => void = () => {};
  let rejectPromise: (reason?: unknown) => void = () => {};
  const promise = new Promise<T>((resolve, reject) => {
    resolvePromise = resolve;
    rejectPromise = reject;
  });

  return {
    promise,
    resolve: resolvePromise,
    reject: rejectPromise,
  };
};

describe("createPlayerController", () => {
  test("loads the default track on init and composes runtime snapshot state", async () => {
    const catalog = createCatalogStub();
    const { player, loadTrack } = createPlayerStub();
    const controller = createPlayerController({ catalog, player });

    await controller.init();

    expect(loadTrack).toHaveBeenCalledWith({
      src: "/audio/test-tone-aac.m4a",
      mimeType: "audio/mp4; codecs=mp4a.40.2",
    });
    expect(controller.getSnapshot()).toMatchObject({
      catalogStatus: "ready",
      restoreStatus: "complete",
      selection: {
        trackId: "test-tone-aac",
        track: { id: "test-tone-aac", title: "AAC Track" },
        asset: {
          src: "/audio/test-tone-aac.m4a",
          mimeType: "audio/mp4; codecs=mp4a.40.2",
        },
      },
      runtime: {
        status: "idle",
        currentTime: 0,
        duration: 0,
        sourceId: "media-element",
        error: null,
        rate: 1,
        volume: 1,
      },
    });
  });

  test("selectTrack resolves one atomic selection and delegates playback controls", async () => {
    const catalog = createCatalogStub();
    const { player, loadTrack, play, pause, seek, setRate, setVolume } = createPlayerStub();
    const controller = createPlayerController({ catalog, player });

    await controller.init();
    await controller.selectTrack("test-tone-opus");
    await controller.play();
    await controller.pause();
    await controller.seek(12);
    await controller.setRate(1.25);
    await controller.setVolume(0.4);

    expect(loadTrack).toHaveBeenLastCalledWith({
      src: "/audio/test-tone-opus.webm",
      mimeType: "audio/webm; codecs=opus",
    });
    expect(play).toHaveBeenCalled();
    expect(pause).toHaveBeenCalled();
    expect(seek).toHaveBeenCalledWith(12);
    expect(setRate).toHaveBeenCalledWith(1.25);
    expect(setVolume).toHaveBeenCalledWith(0.4);
    expect(controller.getSnapshot()).toMatchObject({
      selection: {
        trackId: "test-tone-opus",
        track: { id: "test-tone-opus", title: "Opus Track" },
        asset: {
          src: "/audio/test-tone-opus.webm",
          mimeType: "audio/webm; codecs=opus",
        },
      },
      runtime: {
        sourceId: "fallback",
        rate: 1.25,
        volume: 0.4,
      },
    });
  });

  test("marks restore as error when init fails", async () => {
    const catalog = createCatalogStub();
    const { player } = createPlayerStub();
    const controller = createPlayerController({
      catalog,
      player: {
        ...player,
        loadTrack: async () => {
          throw new Error("load failed");
        },
      },
    });

    await expect(controller.init()).rejects.toThrow("load failed");
    expect(controller.getSnapshot()).toMatchObject({
      catalogStatus: "ready",
      restoreStatus: "error",
      error: "load failed",
    });
  });

  test("reuses the in-flight init promise and loads the default track once", async () => {
    const catalog = createCatalogStub();
    const deferred = createDeferred<void>();
    const { player, loadTrack } = createPlayerStub();
    const controller = createPlayerController({
      catalog,
      player: {
        ...player,
        loadTrack: async (input) => {
          await loadTrack(input);
          return deferred.promise;
        },
      },
    });

    const firstInit = controller.init();
    const secondInit = controller.init();

    expect(loadTrack).toHaveBeenCalledTimes(1);

    deferred.resolve();
    await firstInit;
    await secondInit;

    expect(loadTrack).toHaveBeenCalledTimes(1);
    expect(controller.getSnapshot()).toMatchObject({
      restoreStatus: "complete",
      selection: {
        trackId: "test-tone-aac",
      },
    });
  });

  test("keeps the current selection when selectTrack receives a missing track id", async () => {
    const catalog = createCatalogStub();
    const { player, loadTrack } = createPlayerStub();
    const controller = createPlayerController({ catalog, player });

    await controller.init();
    await expect(controller.selectTrack("missing-track")).rejects.toThrow(
      'Track "missing-track" is missing from the catalog',
    );

    expect(loadTrack).toHaveBeenCalledTimes(1);
    expect(controller.getSnapshot()).toMatchObject({
      selection: {
        trackId: "test-tone-aac",
        track: { id: "test-tone-aac", title: "AAC Track" },
      },
      error: 'Track "missing-track" is missing from the catalog',
    });
  });

  test("reports an error when a selected track does not have a playable asset", async () => {
    const catalog = createCatalogStub({
      tracks: [
        AAC_TRACK,
        {
          id: "assetless-track",
          title: "Assetless Track",
          assets: [],
        },
      ],
    });
    const { player, loadTrack } = createPlayerStub();
    const controller = createPlayerController({ catalog, player });

    await controller.init();
    await expect(controller.selectTrack("assetless-track")).rejects.toThrow(
      'Track "assetless-track" does not have a playable asset',
    );

    expect(loadTrack).toHaveBeenCalledTimes(1);
    expect(controller.getSnapshot()).toMatchObject({
      selection: {
        trackId: "test-tone-aac",
        track: { id: "test-tone-aac", title: "AAC Track" },
      },
      error: 'Track "assetless-track" does not have a playable asset',
    });
  });

  test("ignores stale init completion after destroy", async () => {
    const catalog = createCatalogStub();
    const deferred = createDeferred<void>();
    const { player, destroy } = createPlayerStub();
    const controller = createPlayerController({
      catalog,
      player: {
        ...player,
        loadTrack: () => deferred.promise,
      },
    });

    const initPromise = controller.init();
    await Promise.resolve();
    await controller.destroy();
    deferred.resolve();

    await initPromise;
    expect(destroy).toHaveBeenCalledTimes(1);
    expect(controller.getSnapshot()).toMatchObject({
      restoreStatus: "restoring",
      selection: {
        trackId: "test-tone-aac",
        track: { id: "test-tone-aac", title: "AAC Track" },
      },
      error: null,
    });
  });
});
