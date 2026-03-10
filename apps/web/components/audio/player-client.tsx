"use client";

import { useEffect, useState } from "react";

import { PlayerShell } from "@/components/audio/player-shell";
import type { WebPlayer } from "@/lib/audio/create-web-player";
import { createWebPlayer } from "@/lib/audio/create-web-player";
import { usePlayerStore } from "@/lib/audio/use-player-store";

function MountedPlayer({ player }: { player: WebPlayer }) {
  const { snapshot, timeline, bufferedRanges } = usePlayerStore(player);

  useEffect(() => {
    void player.loadTrack(player.defaultTrack);
  }, [player]);

  return (
    <PlayerShell
      title="Test Tone"
      subtitle="Local AAC fixture routed through the current media-element path."
      status={snapshot.status}
      currentTime={timeline.currentTime}
      duration={timeline.duration || snapshot.duration}
      bufferedRanges={bufferedRanges}
      sourceId={snapshot.sourceId}
      error={snapshot.error}
      onPlay={() => {
        void player.play();
      }}
      onPause={() => {
        void player.pause();
      }}
      onSeek={(seconds) => {
        void player.seek(seconds);
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
      void nextPlayer.pause();
    };
  }, []);

  if (!player) {
    return (
      <PlayerShell
        title="Test Tone"
        subtitle="Local AAC fixture routed through the current media-element path."
        status="idle"
        currentTime={0}
        duration={0}
        bufferedRanges={[]}
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
