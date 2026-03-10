export const createSABRingBuffer = (capacityFrames: number) => ({
  sab: new SharedArrayBuffer(capacityFrames * Float32Array.BYTES_PER_ELEMENT),
  capacityFrames,
});
