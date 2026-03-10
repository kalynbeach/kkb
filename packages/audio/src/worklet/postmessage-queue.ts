export type Chunk = {
  seq: number;
  frames: number;
};

export const createChunkQueue = () => {
  let maxSeq = -1;
  const chunks: Chunk[] = [];

  return {
    push: (chunk: Chunk) => {
      if (chunk.seq < maxSeq) {
        return;
      }

      maxSeq = chunk.seq;
      chunks.push(chunk);
    },
    read: () => chunks.shift(),
  };
};
