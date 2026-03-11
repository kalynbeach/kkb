"use client";

import { useSyncExternalStore } from "react";

import type { WebPlayer } from "./create-web-player";

function usePlayerStore(player: WebPlayer) {
  const snapshot = useSyncExternalStore(player.subscribe, player.getSnapshot, player.getSnapshot);

  return {
    snapshot,
  };
}

export { usePlayerStore };
