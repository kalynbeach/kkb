export type PlayerStatus =
  | "idle"
  | "loading"
  | "ready"
  | "playing"
  | "paused"
  | "recovering"
  | "error";

export type PlayerState = {
  status: PlayerStatus;
  currentTime: number;
  duration: number;
  sourceId: string | null;
  error: string | null;
};

const INITIAL_STATE: PlayerState = {
  status: "idle",
  currentTime: 0,
  duration: 0,
  sourceId: null,
  error: null,
};

export const createPlayerStore = () => {
  let state = INITIAL_STATE;
  const listeners = new Set<() => void>();

  return {
    getSnapshot: () => state,
    setState: (patch: Partial<PlayerState>) => {
      state = { ...state, ...patch };
      for (const listener of listeners) {
        listener();
      }
    },
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
};
