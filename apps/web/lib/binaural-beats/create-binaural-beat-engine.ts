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

const scheduleParam = (param: AudioParam, value: number, startTime: number, endTime: number) => {
  param.cancelScheduledValues(startTime);
  param.setValueAtTime(param.value, startTime);
  param.linearRampToValueAtTime(value, endTime);
};

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
  let stoppingPromise: Promise<void> | null = null;

  const getAudioContext = () => {
    audioContext ??= createAudioContext();
    return audioContext;
  };

  const clearGraph = () => {
    if (!graph) {
      return;
    }

    disconnectGraph(graph);
    graph = null;
  };

  return {
    destroy: () => {
      clearGraph();
      void audioContext?.close();
      audioContext = null;
    },
    play: async (config) => {
      if (stoppingPromise) {
        await stoppingPromise;
      }

      const context = getAudioContext();

      await context.resume();

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

      currentGraph.masterGain.gain.cancelScheduledValues(now);
      currentGraph.masterGain.gain.setValueAtTime(currentGraph.masterGain.gain.value, now);
      currentGraph.masterGain.gain.linearRampToValueAtTime(0, stopAt);
      currentGraph.leftOscillator.stop(stopAt);
      currentGraph.rightOscillator.stop(stopAt);

      stoppingPromise = wait(currentConfig.fadeSeconds * 1000 + 30).then(() => {
        disconnectGraph(currentGraph);
        if (graph === currentGraph) {
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
