type AudioContextLike = {
  audioWorklet: {
    addModule(url: string): Promise<void>;
  };
};

export const registerWorklet = async (audioContext: AudioContextLike, moduleUrl: string) => {
  await audioContext.audioWorklet.addModule(moduleUrl);
};
