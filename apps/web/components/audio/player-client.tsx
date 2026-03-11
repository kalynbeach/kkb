"use client";

import { useEffect, useState } from "react";

import { PlayerShell } from "@/components/audio/player-shell";
import type { WebPlayer } from "@/lib/audio/create-web-player";
import { createWebPlayer } from "@/lib/audio/create-web-player";
import { usePlayerStore } from "@/lib/audio/use-player-store";

const logActionError = (action: string) => (error: unknown) => {
  console.error(`[web-player] ${action} failed`, error);
};

function MountedPlayer({ player }: { player: WebPlayer }) {
  const { snapshot } = usePlayerStore(player);

  useEffect(() => {
    player.loadTrack(player.defaultTrack).catch(logActionError("loadTrack"));
  }, [player]);

  return (
    <PlayerShell
      player={player}
      title="Test Tone"
      subtitle="Local AAC fixture routed through the current media-element path."
      status={snapshot.status}
      duration={snapshot.duration}
      sourceId={snapshot.sourceId}
      error={snapshot.error}
      onPlay={() => {
        player.play().catch(logActionError("play"));
      }}
      onPause={() => {
        player.pause().catch(logActionError("pause"));
      }}
      onSeek={(seconds) => {
        player.seek(seconds).catch(logActionError("seek"));
      }}
    />
  );
}

function PlayerClient() {
  const [player, setPlayer] = useState<WebPlayer | null>(null);

  useEffect(() => {
    const nextPlayer = createWebPlayer();
    setPlayer(nextPlayer);

    return () => {
      nextPlayer.pause().catch(logActionError("pause"));
    };
  }, []);

  if (!player) {
    return (
      <PlayerShell
        player={null}
        title="Test Tone"
        subtitle="Local AAC fixture routed through the current media-element path."
        status="idle"
        duration={0}
        sourceId={null}
        error={null}
        onPlay={() => {}}
        onPause={() => {}}
        onSeek={() => {}}
      />
    );
  }

  return <MountedPlayer player={player} />;
}

export { PlayerClient };
