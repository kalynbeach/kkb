"use client";

import { useSyncExternalStore } from "react";

import type { PlayerController } from "./controller/player-controller";

function usePlayerController(controller: PlayerController) {
  const snapshot = useSyncExternalStore(
    controller.subscribe,
    controller.getSnapshot,
    controller.getSnapshot,
  );

  return {
    snapshot,
  };
}

export { usePlayerController };
