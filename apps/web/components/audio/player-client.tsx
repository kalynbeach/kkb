"use client";

import { useEffect, useState } from "react";

import { PlayerShell } from "@/components/audio/player-shell";
import { TrackSelector } from "@/components/audio/track-selector";
import { selectTrackAsset } from "@/lib/audio/catalog/select-track-asset";
import { createStaticTrackCatalog } from "@/lib/audio/catalog/static-track-catalog";
import type { TrackCatalog } from "@/lib/audio/catalog/track-catalog";
import type { TrackAsset, TrackRecord } from "@/lib/audio/catalog/track-types";
import {
  createPlayerController,
  type PlayerController,
} from "@/lib/audio/controller/player-controller";
import type { WebPlayer } from "@/lib/audio/create-web-player";
import { createWebPlayer } from "@/lib/audio/create-web-player";
import { usePlayerController } from "@/lib/audio/use-player-controller";

const logActionError = (action: string) => (error: unknown) => {
  console.error(`[web-player] ${action} failed`, error);
};

const getTrackSubtitle = (track: TrackRecord | null, asset: TrackAsset | null) => {
  if (!track && !asset) {
    return "";
  }

  return [track?.artist, asset?.mimeType].filter(Boolean).join(" • ");
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
  const { snapshot } = usePlayerController(controller);

  const selectedTrack = snapshot.selectedTrack ?? defaultTrack;
  const selectedAsset = snapshot.asset ?? selectTrackAsset(selectedTrack);

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col">
      <PlayerShell
        player={player}
        title={selectedTrack?.title ?? "Unknown Track"}
        subtitle={getTrackSubtitle(selectedTrack, selectedAsset)}
        status={snapshot.runtime.status}
        duration={snapshot.runtime.duration}
        sourceId={snapshot.runtime.sourceId}
        error={snapshot.runtime.error ?? snapshot.error}
        className="rounded-b-none border-b-0"
        onPlay={() => {
          controller.play().catch(logActionError("play"));
        }}
        onPause={() => {
          controller.pause().catch(logActionError("pause"));
        }}
        onSeek={(seconds) => {
          controller.seek(seconds).catch(logActionError("seek"));
        }}
      />
      <div className="audio-subshell">
        <TrackSelector
          tracks={tracks}
          selectedTrackId={snapshot.selectedTrackId ?? defaultTrackId}
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
          subtitle={getTrackSubtitle(defaultTrack, selectTrackAsset(defaultTrack))}
          status="idle"
          duration={defaultTrack?.duration ?? 0}
          sourceId={null}
          error={null}
          className="rounded-b-none border-b-0"
          onPlay={() => {}}
          onPause={() => {}}
          onSeek={() => {}}
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
