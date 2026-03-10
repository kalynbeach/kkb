"use client";

import { useEffect, useState } from "react";

import { PlayerShell } from "@/components/audio/player-shell";
import { createWebPlayer } from "@/lib/audio/create-web-player";
import { usePlayerStore } from "@/lib/audio/use-player-store";

function PlayerClient() {
  const [player] = useState(() => createWebPlayer());
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

export { PlayerClient };
