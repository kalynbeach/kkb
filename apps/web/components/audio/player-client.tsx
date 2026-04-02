"use client";

import { useEffect, useState } from "react";

import { PlayerShell } from "@/components/audio/player-shell";
import { TrackSelector } from "@/components/audio/track-selector";
import { selectTrackAsset } from "@/lib/audio/catalog/select-track-asset";
import { createStaticTrackCatalog } from "@/lib/audio/catalog/static-track-catalog";
import type { TrackCatalog } from "@/lib/audio/catalog/track-catalog";
import type { TrackRecord } from "@/lib/audio/catalog/track-types";
import {
  createPlayerController,
  type PlayerController,
  type PlayerSelection,
} from "@/lib/audio/controller/player-controller";
import type { WebPlayer } from "@/lib/audio/create-web-player";
import { createWebPlayer } from "@/lib/audio/create-web-player";
import { usePlayerController } from "@/lib/audio/use-player-controller";

const logActionError = (action: string) => (error: unknown) => {
  console.error(`[web-player] ${action} failed`, error);
};

const getTrackSubtitle = (selection: PlayerSelection | null) => {
  if (!selection) {
    return "";
  }

  return [selection.track.artist, selection.asset.mimeType].filter(Boolean).join(" • ");
};

type MountedPlayerProps = {
  player: WebPlayer;
  controller: PlayerController;
  tracks: TrackRecord[];
  defaultTrackId: string;
  defaultTrack: TrackRecord | null;
};

function MountedPlayer({
  player,
  controller,
  tracks,
  defaultTrackId,
  defaultTrack,
}: MountedPlayerProps) {
  const snapshot = usePlayerController(controller);
  const defaultAsset = defaultTrack ? selectTrackAsset(defaultTrack) : null;
  const defaultSelection =
    defaultTrack && defaultAsset
      ? {
          trackId: defaultTrack.id,
          track: defaultTrack,
          asset: defaultAsset,
        }
      : null;
  const selection = snapshot.selection ?? defaultSelection;

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col">
      <PlayerShell
        player={player}
        title={selection?.track.title ?? "Unknown Track"}
        subtitle={getTrackSubtitle(selection)}
        status={snapshot.runtime.status}
        duration={snapshot.runtime.duration}
        sourceId={snapshot.runtime.sourceId}
        error={snapshot.runtime.error ?? snapshot.error}
        rate={snapshot.runtime.rate}
        volume={snapshot.runtime.volume}
        canSelectPrevious={snapshot.canSelectPrevious}
        canSelectNext={snapshot.canSelectNext}
        className="rounded-b-none border-b-0"
        onPrevious={() => {
          controller.previous().catch(logActionError("previous"));
        }}
        onPlay={() => {
          controller.play().catch(logActionError("play"));
        }}
        onPause={() => {
          controller.pause().catch(logActionError("pause"));
        }}
        onStop={() => {
          controller.stop().catch(logActionError("stop"));
        }}
        onNext={() => {
          controller.next().catch(logActionError("next"));
        }}
        onSeek={(seconds) => {
          controller.seek(seconds).catch(logActionError("seek"));
        }}
        onSetRate={(rate) => {
          controller.setRate(rate).catch(logActionError("setRate"));
        }}
        onSetVolume={(volume) => {
          controller.setVolume(volume).catch(logActionError("setVolume"));
        }}
      />
      <div className="audio-subshell">
        <TrackSelector
          tracks={tracks}
          selectedTrackId={selection?.trackId ?? defaultTrackId}
          onSelectTrack={(trackId) => {
            controller.selectTrack(trackId).catch(logActionError("selectTrack"));
          }}
        />
      </div>
    </div>
  );
}

type PlayerClientProps = {
  createPlayer?: () => WebPlayer;
  createCatalog?: () => TrackCatalog;
};

function PlayerClient({
  createPlayer = createWebPlayer,
  createCatalog = createStaticTrackCatalog,
}: PlayerClientProps) {
  const [catalog] = useState(() => createCatalog());
  const [runtime, setRuntime] = useState<{
    player: WebPlayer;
    controller: PlayerController;
  } | null>(null);
  const tracks = catalog.listTracks();
  const defaultTrackId = catalog.getDefaultTrackId();
  const defaultTrack = catalog.getTrack(defaultTrackId);
  const defaultAsset = defaultTrack ? selectTrackAsset(defaultTrack) : null;
  const defaultTrackIndex = tracks.findIndex((track) => track.id === defaultTrackId);

  useEffect(() => {
    const nextPlayer = createPlayer();
    const nextController = createPlayerController({
      catalog,
      player: nextPlayer,
    });

    setRuntime({
      player: nextPlayer,
      controller: nextController,
    });

    nextController.init().catch(logActionError("init"));

    return () => {
      nextController.destroy().catch(logActionError("destroy"));
    };
  }, [catalog, createPlayer]);

  if (!runtime) {
    return (
      <div className="mx-auto flex w-full max-w-lg flex-col">
        <PlayerShell
          player={null}
          title={defaultTrack?.title ?? "Unknown Track"}
          subtitle={getTrackSubtitle(
            defaultTrack && defaultAsset
              ? {
                  trackId: defaultTrack.id,
                  track: defaultTrack,
                  asset: defaultAsset,
                }
              : null,
          )}
          status="idle"
          duration={defaultTrack?.duration ?? 0}
          sourceId={null}
          error={null}
          rate={1}
          volume={1}
          canSelectPrevious={defaultTrackIndex > 0}
          canSelectNext={defaultTrackIndex >= 0 && defaultTrackIndex < tracks.length - 1}
          className="rounded-b-none border-b-0"
          onPrevious={() => {}}
          onPlay={() => {}}
          onPause={() => {}}
          onStop={() => {}}
          onNext={() => {}}
          onSeek={() => {}}
          onSetRate={() => {}}
          onSetVolume={() => {}}
        />
        <div className="audio-subshell">
          <TrackSelector
            tracks={tracks}
            selectedTrackId={defaultTrackId}
            onSelectTrack={() => {}}
          />
        </div>
      </div>
    );
  }

  return (
    <MountedPlayer
      player={runtime.player}
      controller={runtime.controller}
      tracks={tracks}
      defaultTrackId={defaultTrackId}
      defaultTrack={defaultTrack}
    />
  );
}

export { PlayerClient };
