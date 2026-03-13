class KKBAudioProcessor extends AudioWorkletProcessor {
  process() {
    return true;
  }
}

registerProcessor("kkb-audio-processor", KKBAudioProcessor);
