import { describe, expect, test } from "bun:test";

import { createBinauralBeatEngine } from "../create-binaural-beat-engine";

type Deferred = {
  promise: Promise<void>;
  resolve: () => void;
};

type ParamCall =
  | {
      time: number;
      type: "cancelScheduledValues";
    }
  | {
      time: number;
      type: "setValueAtTime";
      value: number;
    }
  | {
      time: number;
      type: "linearRampToValueAtTime";
      value: number;
    };

const createDeferred = (): Deferred => {
  let resolveDeferred: () => void = () => {};
  const promise = new Promise<void>((resolve) => {
    resolveDeferred = resolve;
  });

  return {
    promise,
    resolve: resolveDeferred,
  };
};

class FakeAudioParam {
  calls: ParamCall[] = [];
  value = 0;

  cancelScheduledValues(time: number) {
    this.calls.push({ time, type: "cancelScheduledValues" });
  }

  linearRampToValueAtTime(value: number, time: number) {
    this.value = value;
    this.calls.push({ time, type: "linearRampToValueAtTime", value });
  }

  setValueAtTime(value: number, time: number) {
    this.value = value;
    this.calls.push({ time, type: "setValueAtTime", value });
  }
}

class FakeAudioNode {
  connectCalls: Array<{ input?: number; output?: number; target: unknown }> = [];
  disconnectCalls = 0;

  connect(target: unknown, output?: number, input?: number) {
    this.connectCalls.push({ input, output, target });
    return target;
  }

  disconnect() {
    this.disconnectCalls += 1;
  }
}

class FakeOscillatorNode extends FakeAudioNode {
  frequency = new FakeAudioParam();
  startCalls: number[] = [];
  stopCalls: number[] = [];
  type: OscillatorType = "sine";

  start(time: number) {
    this.startCalls.push(time);
  }

  stop(time: number) {
    this.stopCalls.push(time);
  }
}

class FakeGainNode extends FakeAudioNode {
  gain = new FakeAudioParam();
}

class FakeChannelMergerNode extends FakeAudioNode {}

class FakeAudioContext {
  currentTime = 4;
  destination = new FakeAudioNode();
  gainNodes: FakeGainNode[] = [];
  mergerNodes: FakeChannelMergerNode[] = [];
  oscillatorNodes: FakeOscillatorNode[] = [];
  resumeCalls = 0;

  close() {
    return Promise.resolve();
  }

  createChannelMerger() {
    const mergerNode = new FakeChannelMergerNode();
    this.mergerNodes.push(mergerNode);
    return mergerNode as unknown as ChannelMergerNode;
  }

  createGain() {
    const gainNode = new FakeGainNode();
    this.gainNodes.push(gainNode);
    return gainNode as unknown as GainNode;
  }

  createOscillator() {
    const oscillatorNode = new FakeOscillatorNode();
    this.oscillatorNodes.push(oscillatorNode);
    return oscillatorNode as unknown as OscillatorNode;
  }

  resume() {
    this.resumeCalls += 1;
    return Promise.resolve();
  }
}

describe("createBinauralBeatEngine", () => {
  test("builds a stereo oscillator graph and automates updates", async () => {
    const audioContext = new FakeAudioContext();
    const engine = createBinauralBeatEngine({
      createAudioContext: () => audioContext as unknown as AudioContext,
      wait: () => Promise.resolve(),
    });

    await engine.play({
      beatFrequencyHz: 10,
      carrierFrequencyHz: 400,
      fadeSeconds: 0.8,
      volume: 0.15,
    });

    expect(audioContext.resumeCalls).toBe(1);
    expect(audioContext.oscillatorNodes).toHaveLength(2);
    expect(audioContext.gainNodes).toHaveLength(3);
    expect(audioContext.mergerNodes).toHaveLength(1);
    expect(audioContext.oscillatorNodes[0]?.frequency.calls).toContainEqual({
      time: 4,
      type: "setValueAtTime",
      value: 400,
    });
    expect(audioContext.oscillatorNodes[1]?.frequency.calls).toContainEqual({
      time: 4,
      type: "setValueAtTime",
      value: 410,
    });
    expect(audioContext.oscillatorNodes[0]?.startCalls).toEqual([4]);
    expect(audioContext.oscillatorNodes[1]?.startCalls).toEqual([4]);

    engine.update({
      beatFrequencyHz: 12,
      carrierFrequencyHz: 420,
      fadeSeconds: 0.8,
      volume: 0.2,
    });

    expect(audioContext.oscillatorNodes[0]?.frequency.calls).toContainEqual({
      time: 4.25,
      type: "linearRampToValueAtTime",
      value: 420,
    });
    expect(audioContext.oscillatorNodes[1]?.frequency.calls).toContainEqual({
      time: 4.25,
      type: "linearRampToValueAtTime",
      value: 432,
    });
    expect(audioContext.gainNodes[2]?.gain.calls).toContainEqual({
      time: 4.25,
      type: "linearRampToValueAtTime",
      value: 0.2,
    });
  });

  test("serializes replay until the previous graph finishes stopping", async () => {
    const audioContext = new FakeAudioContext();
    const stopWait = createDeferred();
    const engine = createBinauralBeatEngine({
      createAudioContext: () => audioContext as unknown as AudioContext,
      wait: () => stopWait.promise,
    });

    await engine.play({
      beatFrequencyHz: 10,
      carrierFrequencyHz: 400,
      fadeSeconds: 0.8,
      volume: 0.15,
    });

    const stopPromise = engine.stop();
    const replayPromise = engine.play({
      beatFrequencyHz: 8,
      carrierFrequencyHz: 300,
      fadeSeconds: 0.8,
      volume: 0.12,
    });

    expect(audioContext.oscillatorNodes).toHaveLength(2);
    expect(audioContext.oscillatorNodes[0]?.stopCalls).toEqual([4.8]);
    expect(audioContext.oscillatorNodes[1]?.stopCalls).toEqual([4.8]);

    stopWait.resolve();
    await stopPromise;
    await replayPromise;

    expect(audioContext.oscillatorNodes).toHaveLength(4);
    expect(audioContext.oscillatorNodes[0]?.disconnectCalls).toBe(1);
    expect(audioContext.oscillatorNodes[1]?.disconnectCalls).toBe(1);
    expect(audioContext.oscillatorNodes[2]?.frequency.calls).toContainEqual({
      time: 4,
      type: "setValueAtTime",
      value: 300,
    });
    expect(audioContext.oscillatorNodes[3]?.frequency.calls).toContainEqual({
      time: 4,
      type: "setValueAtTime",
      value: 308,
    });
  });

  test("keeps stop idempotent while a graph is already stopping", async () => {
    const audioContext = new FakeAudioContext();
    const stopWait = createDeferred();
    const engine = createBinauralBeatEngine({
      createAudioContext: () => audioContext as unknown as AudioContext,
      wait: () => stopWait.promise,
    });

    await engine.play({
      beatFrequencyHz: 10,
      carrierFrequencyHz: 400,
      fadeSeconds: 0.8,
      volume: 0.15,
    });

    const firstStopPromise = engine.stop();
    const secondStopPromise = engine.stop();

    expect(audioContext.oscillatorNodes[0]?.stopCalls).toEqual([4.8]);
    expect(audioContext.oscillatorNodes[1]?.stopCalls).toEqual([4.8]);

    stopWait.resolve();
    await firstStopPromise;
    await secondStopPromise;

    expect(audioContext.oscillatorNodes[0]?.stopCalls).toEqual([4.8]);
    expect(audioContext.oscillatorNodes[1]?.stopCalls).toEqual([4.8]);
    expect(audioContext.oscillatorNodes[0]?.disconnectCalls).toBe(1);
    expect(audioContext.oscillatorNodes[1]?.disconnectCalls).toBe(1);
  });
});
