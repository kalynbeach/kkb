import { describe, expect, mock, test } from "bun:test";

import type { TrackCatalog } from "../../catalog/track-catalog";
import { createPlayerController } from "../player-controller";

const createCatalogStub = (): TrackCatalog => ({
  listTracks: () => [
    {
      id: "test-tone-aac",
      title: "AAC Track",
      assets: [{ src: "/audio/test-tone-aac.m4a", mimeType: "audio/mp4; codecs=mp4a.40.2" }],
    },
    {
      id: "test-tone-opus",
      title: "Opus Track",
      assets: [{ src: "/audio/test-tone-opus.webm", mimeType: "audio/webm; codecs=opus" }],
    },
  ],
  getTrack: (trackId) =>
    ({
      "test-tone-aac": {
        id: "test-tone-aac",
        title: "AAC Track",
        assets: [{ src: "/audio/test-tone-aac.m4a", mimeType: "audio/mp4; codecs=mp4a.40.2" }],
      },
      "test-tone-opus": {
        id: "test-tone-opus",
        title: "Opus Track",
        assets: [{ src: "/audio/test-tone-opus.webm", mimeType: "audio/webm; codecs=opus" }],
      },
    })[trackId] ?? null,
  getDefaultTrackId: () => "test-tone-aac",
});

const createPlayerStub = () => {
  const loadTrack = mock(async (_input: { src: string; mimeType?: string }) => {});
  const play = mock(async () => {});
  const pause = mock(async () => {});
  const seek = mock(async (_seconds: number) => {});
  const destroy = mock(async () => {});

  return {
    player: {
      getSnapshot: () => ({
        status: "idle" as const,
        currentTime: 0,
        duration: 0,
        sourceId: null,
        error: null,
      }),
      subscribe: () => () => {},
      loadTrack,
      play,
      pause,
      seek,
      destroy,
    },
    loadTrack,
    play,
    pause,
    seek,
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
      selectedTrackId: "test-tone-aac",
      selectedTrack: { id: "test-tone-aac", title: "AAC Track" },
      asset: {
        src: "/audio/test-tone-aac.m4a",
        mimeType: "audio/mp4; codecs=mp4a.40.2",
      },
      runtime: {
        status: "idle",
        currentTime: 0,
        duration: 0,
        sourceId: null,
        error: null,
      },
    });
  });

  test("selectTrack resolves a track record and delegates playback actions", async () => {
    const catalog = createCatalogStub();
    const { player, loadTrack, play, pause, seek } = createPlayerStub();
    const controller = createPlayerController({ catalog, player });

    await controller.init();
    await controller.selectTrack("test-tone-opus");
    await controller.play();
    await controller.pause();
    await controller.seek(12);

    expect(loadTrack).toHaveBeenLastCalledWith({
      src: "/audio/test-tone-opus.webm",
      mimeType: "audio/webm; codecs=opus",
    });
    expect(play).toHaveBeenCalled();
    expect(pause).toHaveBeenCalled();
    expect(seek).toHaveBeenCalledWith(12);
    expect(controller.getSnapshot()).toMatchObject({
      selectedTrackId: "test-tone-opus",
      selectedTrack: { id: "test-tone-opus", title: "Opus Track" },
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
      selectedTrackId: "test-tone-aac",
      selectedTrack: { id: "test-tone-aac", title: "AAC Track" },
      error: null,
    });
  });
});
