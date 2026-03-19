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
  rate: number;
  volume: number;
};

const INITIAL_STATE: PlayerState = {
  status: "idle",
  currentTime: 0,
  duration: 0,
  sourceId: null,
  error: null,
  rate: 1,
  volume: 1,
};

type ReadyStateInput = {
  currentTime: number;
  duration: number;
  sourceId: string;
  rate: number;
  volume: number;
};

type TimelineStateInput = {
  currentTime?: number;
  duration?: number;
};

type ErrorStateInput = TimelineStateInput & {
  error: string;
  sourceId?: string | null;
};

export const createPlayerStore = () => {
  let state = INITIAL_STATE;
  const listeners = new Set<() => void>();
  const updateState = (nextState: PlayerState) => {
    state = nextState;
    for (const listener of listeners) {
      listener();
    }
  };

  return {
    getSnapshot: () => state,
    transitionToLoading: () => {
      updateState({
        ...state,
        status: "loading",
        currentTime: 0,
        duration: 0,
        sourceId: null,
        error: null,
      });
    },
    transitionToReady: ({ currentTime, duration, sourceId, rate, volume }: ReadyStateInput) => {
      updateState({
        status: "ready",
        currentTime,
        duration,
        sourceId,
        error: null,
        rate,
        volume,
      });
    },
    transitionToPlaying: () => {
      updateState({
        ...state,
        status: "playing",
        error: null,
      });
    },
    transitionToPaused: ({ currentTime = state.currentTime, duration = state.duration }: TimelineStateInput = {}) => {
      updateState({
        ...state,
        status: "paused",
        currentTime,
        duration,
        error: null,
      });
    },
    transitionToRecovering: () => {
      updateState({
        ...state,
        status: "recovering",
        error: null,
      });
    },
    transitionToError: ({
      error,
      currentTime = state.currentTime,
      duration = state.duration,
      sourceId = state.sourceId,
    }: ErrorStateInput) => {
      updateState({
        ...state,
        status: "error",
        currentTime,
        duration,
        sourceId,
        error,
      });
    },
    syncTimeline: ({ currentTime = state.currentTime, duration = state.duration }: TimelineStateInput) => {
      updateState({
        ...state,
        currentTime,
        duration,
      });
    },
    setRate: (rate: number) => {
      updateState({
        ...state,
        rate,
      });
    },
    setVolume: (volume: number) => {
      updateState({
        ...state,
        volume,
      });
    },
    reset: () => {
      updateState({ ...INITIAL_STATE });
    },
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
};
