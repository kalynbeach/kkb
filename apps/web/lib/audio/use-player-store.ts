"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

import type { WebPlayer } from "./create-web-player";

function usePlayerStore(player: WebPlayer) {
  const snapshot = useSyncExternalStore(player.subscribe, player.getSnapshot, player.getSnapshot);
  const [timeline, setTimeline] = useState(() => player.getTimeline());
  const [bufferedRanges, setBufferedRanges] = useState(() => player.getBufferedRanges());

  useEffect(() => {
    let frame = 0;

    const update = () => {
      setTimeline(player.getTimeline());
      setBufferedRanges(player.getBufferedRanges());
      frame = requestAnimationFrame(update);
    };

    update();

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [player]);

  return {
    snapshot,
    timeline,
    bufferedRanges,
  };
}

export { usePlayerStore };
