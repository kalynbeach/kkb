export type SignalProvider = {
  channelCount: 1 | 2;
  fftSize: number;
  frequencyBinCount: number;
  sampleRate: number;
  smoothing: number;
  getFrequencyData(channel: 0 | 1): Float32Array;
  getSamples(channel: 0 | 1): Float32Array;
};
