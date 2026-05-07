import {
  type BinauralBeatConfig,
  DEFAULT_BINAURAL_BEAT_CONFIG,
  getBinauralBeatFrequencies,
  sanitizeBinauralBeatConfig,
} from "./binaural-beat-config";

export type BinauralBeatEngine = {
  destroy: () => void;
  play: (config: BinauralBeatConfig) => Promise<void>;
  stop: () => Promise<void>;
  update: (config: BinauralBeatConfig) => void;
};

type BinauralBeatEngineOptions = {
  createAudioContext?: () => AudioContext;
  wait?: (milliseconds: number) => Promise<void>;
};

type BinauralBeatGraph = {
  leftGain: GainNode;
  leftOscillator: OscillatorNode;
  masterGain: GainNode;
  merger: ChannelMergerNode;
  rightGain: GainNode;
  rightOscillator: OscillatorNode;
};

const cancelAndHoldParam = (param: AudioParam, time: number) => {
  if ("cancelAndHoldAtTime" in param && typeof param.cancelAndHoldAtTime === "function") {
    param.cancelAndHoldAtTime(time);
    return;
  }

  param.cancelScheduledValues(time);
  param.setValueAtTime(param.value, time);
};

const scheduleParam = (param: AudioParam, value: number, startTime: number, endTime: number) => {
  cancelAndHoldParam(param, startTime);
  param.linearRampToValueAtTime(value, endTime);
};

const DESTROY_FADE_SECONDS = 0.025;

const disconnectGraph = (graph: BinauralBeatGraph) => {
  graph.leftOscillator.disconnect();
  graph.rightOscillator.disconnect();
  graph.leftGain.disconnect();
  graph.rightGain.disconnect();
  graph.merger.disconnect();
  graph.masterGain.disconnect();
};

const createGraph = (audioContext: AudioContext, config: BinauralBeatConfig) => {
  const sanitizedConfig = sanitizeBinauralBeatConfig(config);
  const frequencies = getBinauralBeatFrequencies(sanitizedConfig);
  const leftOscillator = audioContext.createOscillator();
  const rightOscillator = audioContext.createOscillator();
  const leftGain = audioContext.createGain();
  const rightGain = audioContext.createGain();
  const merger = audioContext.createChannelMerger(2);
  const masterGain = audioContext.createGain();
  const now = audioContext.currentTime;

  leftOscillator.type = "sine";
  rightOscillator.type = "sine";
  leftOscillator.frequency.setValueAtTime(frequencies.leftFrequencyHz, now);
  rightOscillator.frequency.setValueAtTime(frequencies.rightFrequencyHz, now);
  leftGain.gain.setValueAtTime(1, now);
  rightGain.gain.setValueAtTime(1, now);
  masterGain.gain.setValueAtTime(0, now);

  leftOscillator.connect(leftGain);
  rightOscillator.connect(rightGain);
  leftGain.connect(merger, 0, 0);
  rightGain.connect(merger, 0, 1);
  merger.connect(masterGain);
  masterGain.connect(audioContext.destination);

  return {
    graph: {
      leftGain,
      leftOscillator,
      masterGain,
      merger,
      rightGain,
      rightOscillator,
    },
    sanitizedConfig,
  };
};

export const createBinauralBeatEngine = ({
  createAudioContext = () => new AudioContext(),
  wait = (milliseconds) =>
    new Promise<void>((resolve) => {
      globalThis.setTimeout(resolve, milliseconds);
    }),
}: BinauralBeatEngineOptions = {}): BinauralBeatEngine => {
  let audioContext: AudioContext | null = null;
  let graph: BinauralBeatGraph | null = null;
  let currentConfig = sanitizeBinauralBeatConfig(DEFAULT_BINAURAL_BEAT_CONFIG);
  let destroyed = false;
  let playingPromise: Promise<void> | null = null;
  let stoppingPromise: Promise<void> | null = null;

  const getAudioContext = () => {
    audioContext ??= createAudioContext();
    return audioContext;
  };

  const playNext = async (config: BinauralBeatConfig) => {
    if (stoppingPromise) {
      await stoppingPromise;
    }

    if (destroyed) {
      return;
    }

    const context = getAudioContext();

    await context.resume();

    if (destroyed) {
      return;
    }

    if (graph) {
      const sanitizedConfig = sanitizeBinauralBeatConfig(config);
      const now = context.currentTime;

      currentConfig = sanitizedConfig;
      const frequencies = getBinauralBeatFrequencies(sanitizedConfig);
      const rampEnd = now + Math.min(sanitizedConfig.fadeSeconds, 0.25);
      scheduleParam(graph.leftOscillator.frequency, frequencies.leftFrequencyHz, now, rampEnd);
      scheduleParam(graph.rightOscillator.frequency, frequencies.rightFrequencyHz, now, rampEnd);
      scheduleParam(
        graph.masterGain.gain,
        sanitizedConfig.volume,
        now,
        now + sanitizedConfig.fadeSeconds,
      );
      return;
    }

    const nextGraph = createGraph(context, config);
    graph = nextGraph.graph;
    currentConfig = nextGraph.sanitizedConfig;

    const now = context.currentTime;
    graph.leftOscillator.start(now);
    graph.rightOscillator.start(now);
    scheduleParam(
      graph.masterGain.gain,
      nextGraph.sanitizedConfig.volume,
      now,
      now + nextGraph.sanitizedConfig.fadeSeconds,
    );
  };

  return {
    destroy: () => {
      destroyed = true;
      playingPromise = null;
      stoppingPromise = null;

      if (!audioContext) {
        return;
      }

      const context = audioContext;
      const currentGraph = graph;
      graph = null;
      audioContext = null;

      if (!currentGraph) {
        void context.close();
        return;
      }

      const now = context.currentTime;
      const stopAt = now + DESTROY_FADE_SECONDS;
      cancelAndHoldParam(currentGraph.masterGain.gain, now);
      currentGraph.masterGain.gain.linearRampToValueAtTime(0, stopAt);
      currentGraph.leftOscillator.stop(stopAt);
      currentGraph.rightOscillator.stop(stopAt);

      void wait(DESTROY_FADE_SECONDS * 1000 + 30).then(() => {
        disconnectGraph(currentGraph);
        void context.close();
      });
    },
    play: async (config) => {
      const previousPlayPromise = playingPromise;
      const nextPlayPromise = (async () => {
        if (previousPlayPromise) {
          try {
            await previousPlayPromise;
          } catch {
            // Continue so a later play request is not permanently blocked by an earlier failure.
          }
        }

        await playNext(config);
      })();
      playingPromise = nextPlayPromise;

      try {
        await nextPlayPromise;
      } finally {
        if (playingPromise === nextPlayPromise) {
          playingPromise = null;
        }
      }
    },
    stop: async () => {
      if (stoppingPromise) {
        await stoppingPromise;
        return;
      }

      if (!audioContext || !graph) {
        return;
      }

      const currentGraph = graph;
      const now = audioContext.currentTime;
      const stopAt = now + currentConfig.fadeSeconds;

      cancelAndHoldParam(currentGraph.masterGain.gain, now);
      currentGraph.masterGain.gain.linearRampToValueAtTime(0, stopAt);
      currentGraph.leftOscillator.stop(stopAt);
      currentGraph.rightOscillator.stop(stopAt);

      stoppingPromise = wait(currentConfig.fadeSeconds * 1000 + 30).then(() => {
        if (graph === currentGraph) {
          disconnectGraph(currentGraph);
          graph = null;
        }
        stoppingPromise = null;
      });

      await stoppingPromise;
    },
    update: (config) => {
      if (!audioContext || !graph) {
        return;
      }

      const sanitizedConfig = sanitizeBinauralBeatConfig(config);
      const frequencies = getBinauralBeatFrequencies(sanitizedConfig);
      const now = audioContext.currentTime;
      const rampEnd = now + Math.min(sanitizedConfig.fadeSeconds, 0.25);

      currentConfig = sanitizedConfig;
      scheduleParam(graph.leftOscillator.frequency, frequencies.leftFrequencyHz, now, rampEnd);
      scheduleParam(graph.rightOscillator.frequency, frequencies.rightFrequencyHz, now, rampEnd);
      scheduleParam(graph.masterGain.gain, sanitizedConfig.volume, now, rampEnd);
    },
  };
};
