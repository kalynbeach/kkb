type FallbackAttempt = {
  fromSourceId: string;
  toSourceId: string;
};

export const createMetrics = () => {
  let underruns = 0;
  const fallbackAttempts: FallbackAttempt[] = [];
  const selectionReasons: string[] = [];

  return {
    incrementUnderrun: () => {
      underruns += 1;
    },
    recordFallbackAttempt: (fromSourceId: string, toSourceId: string) => {
      fallbackAttempts.push({ fromSourceId, toSourceId });
    },
    recordSelectionReason: (reason: string) => {
      selectionReasons.push(reason);
    },
    snapshot: () => ({
      underruns,
      fallbackAttempts: [...fallbackAttempts],
      selectionReasons: [...selectionReasons],
    }),
  };
};
