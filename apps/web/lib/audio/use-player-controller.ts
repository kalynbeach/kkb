"use client";

import { useSyncExternalStore } from "react";

import type { PlayerController } from "./controller/player-controller";

function usePlayerController(controller: PlayerController) {
  return useSyncExternalStore(controller.subscribe, controller.getSnapshot, controller.getSnapshot);
}

export { usePlayerController };
