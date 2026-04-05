import {
  type AnalyserLike,
  createAnalyserSignalProvider,
} from "@kkb/audio/oscilloscope/signal/analyser-source";

export type MicInputMode = "live" | "fake-mono" | "fake-stereo";

const MIC_SAMPLE_CONDITIONING = {
  center: true,
  maxGain: 10,
  minGain: 0.9,
  silenceFloor: 0.003,
  targetPeak: 0.72,
} as const;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const stopStreamTracks = (stream: MediaStream) => {
  stream.getTracks().forEach((track) => {
    track.stop();
  });
};

const createFakeAnalyser = ({
  clock,
  harmonicSkew,
  phaseOffset,
  sampleRate,
}: {
  clock: () => number;
  harmonicSkew: number;
  phaseOffset: number;
  sampleRate: number;
}): AnalyserLike & { disconnect(): void } => ({
  disconnect: () => {},
  fftSize: 1024,
  frequencyBinCount: 512,
  smoothingTimeConstant: 0.28,
  getFloatFrequencyData: (target) => {
    for (let index = 0; index < target.length; index += 1) {
      const falloff = index / Math.max(1, target.length - 1);
      target[index] = -24 - falloff * 48;
    }
  },
  getFloatTimeDomainData: (target) => {
    const now = clock();

    for (let index = 0; index < target.length; index += 1) {
      const time = now - (target.length - 1 - index) / sampleRate;
      const envelope = 0.42 + 0.3 * Math.sin(time * Math.PI * 2 * 0.37 + phaseOffset * 0.8);
      const carrierA = Math.sin(time * Math.PI * 2 * (170 * harmonicSkew) + phaseOffset);
      const carrierB = Math.sin(time * Math.PI * 2 * (260 * harmonicSkew) + phaseOffset * 1.7);
      const carrierC = Math.sin(time * Math.PI * 2 * (96 * harmonicSkew) + phaseOffset * 0.45);
      const sample = (carrierA * 0.56 + carrierB * 0.28 + carrierC * 0.16) * envelope;
      target[index] = clamp(sample, -1, 1);
    }
  },
});

const createFakeMicRuntime = ({
  clock = () => performance.now() / 1000,
  mode,
  sampleRate = 48_000,
}: {
  clock?: () => number;
  mode: Exclude<MicInputMode, "live">;
  sampleRate?: number;
}) => {
  const left = createFakeAnalyser({
    clock,
    harmonicSkew: 1,
    phaseOffset: 0,
    sampleRate,
  });
  const right =
    mode === "fake-stereo"
      ? createFakeAnalyser({
          clock,
          harmonicSkew: 0.76,
          phaseOffset: Math.PI / 2.8,
          sampleRate,
        })
      : undefined;

  return {
    destroy: async () => {},
    provider: createAnalyserSignalProvider({
      left,
      monoChannelMode: "derived-stereo",
      right,
      sampleConditioning: MIC_SAMPLE_CONDITIONING,
      sampleRate,
    }),
  };
};

export const createMicProvider = async ({
  clock,
  createAudioContext = () => new AudioContext(),
  getUserMedia = (constraints: MediaStreamConstraints) =>
    navigator.mediaDevices.getUserMedia(constraints),
  mode = "live",
}: {
  clock?: () => number;
  createAudioContext?: () => AudioContext;
  getUserMedia?: (constraints: MediaStreamConstraints) => Promise<MediaStream>;
  mode?: MicInputMode;
} = {}) => {
  if (mode !== "live") {
    return createFakeMicRuntime({ clock, mode });
  }

  const stream = await getUserMedia({
    audio: {
      autoGainControl: false,
      channelCount: { ideal: 2 },
      echoCancellation: false,
      noiseSuppression: false,
    },
  });

  let audioContext: AudioContext | null = null;

  try {
    const context = createAudioContext();
    audioContext = context;
    const source = context.createMediaStreamSource(stream);
    const left = context.createAnalyser();
    left.fftSize = 1024;
    left.smoothingTimeConstant = 0.28;

    const primaryTrack = stream.getAudioTracks()[0];
    const channelCount = primaryTrack?.getSettings().channelCount;

    if (typeof channelCount !== "number" || channelCount < 2) {
      source.connect(left);

      return {
        destroy: async () => {
          source.disconnect();
          left.disconnect();
          stopStreamTracks(stream);
          await context.close();
        },
        provider: createAnalyserSignalProvider({
          left,
          monoChannelMode: "derived-stereo",
          sampleConditioning: MIC_SAMPLE_CONDITIONING,
          sampleRate: context.sampleRate,
        }),
      };
    }

    const splitter = context.createChannelSplitter(2);
    const right = context.createAnalyser();
    right.fftSize = 1024;
    right.smoothingTimeConstant = 0.28;

    source.connect(splitter);
    splitter.connect(left, 0);
    splitter.connect(right, 1);

    return {
      destroy: async () => {
        source.disconnect();
        splitter.disconnect();
        left.disconnect();
        right.disconnect();
        stopStreamTracks(stream);
        await context.close();
      },
      provider: createAnalyserSignalProvider({
        left,
        right,
        sampleConditioning: MIC_SAMPLE_CONDITIONING,
        sampleRate: context.sampleRate,
      }),
    };
  } catch (error) {
    stopStreamTracks(stream);

    if (audioContext) {
      try {
        await audioContext.close();
      } catch {
        // Ignore cleanup failures and preserve the original setup error.
      }
    }

    throw error;
  }
};
