export type SignalProvider = {
  channelCount: 1 | 2;
  fftSize: number;
  frequencyBinCount: number;
  sampleRate: number;
  smoothing: number;
  getFrequencyData(channel: 0 | 1): Float32Array;
  /**
   * Returns a provider-owned buffer whose contents remain stable until the next
   * call for the same channel. Reading the other channel must not mutate it.
   * Callers that retain samples across frames must copy the returned buffer.
   */
  getSamples(channel: 0 | 1): Float32Array;
};
