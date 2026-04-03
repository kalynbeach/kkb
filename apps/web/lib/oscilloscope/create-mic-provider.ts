import { createAnalyserSignalProvider } from "@kkb/audio/oscilloscope/signal/analyser-source";

export const createMicProvider = async ({
  createAudioContext = () => new AudioContext(),
  getUserMedia = (constraints: MediaStreamConstraints) =>
    navigator.mediaDevices.getUserMedia(constraints),
}: {
  createAudioContext?: () => AudioContext;
  getUserMedia?: (constraints: MediaStreamConstraints) => Promise<MediaStream>;
} = {}) => {
  const stream = await getUserMedia({
    audio: {
      autoGainControl: false,
      channelCount: 2,
      echoCancellation: false,
      noiseSuppression: false,
    },
  });

  const audioContext = createAudioContext();
  const source = audioContext.createMediaStreamSource(stream);
  const left = audioContext.createAnalyser();
  left.fftSize = 1024;
  left.smoothingTimeConstant = 0.45;

  const primaryTrack = stream.getAudioTracks()[0];
  const channelCount = primaryTrack?.getSettings().channelCount ?? 2;

  if (channelCount < 2) {
    source.connect(left);

    return {
      destroy: async () => {
        source.disconnect();
        left.disconnect();
        stream.getTracks().forEach((track) => {
          track.stop();
        });
        await audioContext.close();
      },
      provider: createAnalyserSignalProvider({
        left,
        sampleRate: audioContext.sampleRate,
      }),
    };
  }

  const splitter = audioContext.createChannelSplitter(2);
  const right = audioContext.createAnalyser();
  right.fftSize = 1024;
  right.smoothingTimeConstant = 0.45;

  source.connect(splitter);
  splitter.connect(left, 0);
  splitter.connect(right, 1);

  return {
    destroy: async () => {
      source.disconnect();
      splitter.disconnect();
      left.disconnect();
      right.disconnect();
      stream.getTracks().forEach((track) => {
        track.stop();
      });
      await audioContext.close();
    },
    provider: createAnalyserSignalProvider({
      left,
      right,
      sampleRate: audioContext.sampleRate,
    }),
  };
};
