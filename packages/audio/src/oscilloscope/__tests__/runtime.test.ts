import { describe, expect, test } from "bun:test";
import { createOscilloscope } from "../runtime";
import type { SignalProvider } from "../signal/signal-provider";

const provider: SignalProvider = {
  channelCount: 2,
  fftSize: 4,
  frequencyBinCount: 2,
  sampleRate: 48_000,
  smoothing: 0,
  getFrequencyData: () => new Float32Array([0, 0]),
  getSamples: () => new Float32Array([0, 0.25, -0.25, 0]),
};

describe("createOscilloscope", () => {
  test("starts once, attaches providers, and tears down the renderer", async () => {
    const drawCalls: number[] = [];
    const canvas = {
      clientHeight: 320,
      clientWidth: 320,
      height: 320,
      width: 320,
    } as HTMLCanvasElement;

    const scope = createOscilloscope(
      canvas,
      {
        canvas: { aspectRatio: "1:1", background: 0.02, quality: "quality" },
        mode: "xy",
        phosphor: { bloom: 0.75, color: "p31-green", trailLength: 64 },
        source: {
          type: "oscillators",
          ratioLock: "1:1",
          a: { amplitude: 1, detuneCents: 0, frequency: 220, phase: 0, waveform: "sine" },
          b: { amplitude: 1, detuneCents: 0, frequency: 220, phase: 0, waveform: "sine" },
        },
      },
      {
        createRenderer: async () => ({
          destroy: () => {
            drawCalls.push(-1);
          },
          drawFrame: (geometry) => {
            drawCalls.push(geometry.points.length);
          },
          resize: () => {},
        }),
        now: () => 1,
        requestFrame: () => 1,
        cancelFrame: () => {},
      },
    );

    scope.setSignalProvider(provider);
    expect(scope.getState().provider).toBe(provider);

    scope.setSignalProvider(null);
    expect(scope.getState().provider).not.toBeNull();

    await scope.start();
    scope.stop();
    scope.destroy();

    expect(drawCalls[0]).toBeGreaterThan(0);
    expect(drawCalls.at(-1)).toBe(-1);
  });

  test("passes elapsed seconds into renderer draws", async () => {
    const frameTimes = [10, 10.25];
    const deltas: number[] = [];
    let scheduledFrame: FrameRequestCallback | null = null;
    const canvas = {
      clientHeight: 320,
      clientWidth: 320,
      height: 320,
      width: 320,
    } as HTMLCanvasElement;

    const scope = createOscilloscope(
      canvas,
      {
        canvas: { aspectRatio: "1:1", background: 0.02, quality: "quality" },
        mode: "xy",
        phosphor: { bloom: 0.75, color: "p31-green", trailLength: 64 },
        source: {
          type: "oscillators",
          ratioLock: "1:1",
          a: { amplitude: 1, detuneCents: 0, frequency: 220, phase: 0, waveform: "sine" },
          b: { amplitude: 1, detuneCents: 0, frequency: 220, phase: 0, waveform: "sine" },
        },
      },
      {
        createRenderer: async () => ({
          destroy: () => {},
          drawFrame: (_geometry, _config, deltaSeconds) => {
            deltas.push(deltaSeconds);
          },
          resize: () => {},
        }),
        now: () => frameTimes.shift() ?? 10.25,
        requestFrame: (callback) => {
          scheduledFrame = callback;
          return 1;
        },
        cancelFrame: () => {},
      },
    );

    await scope.start();
    scheduledFrame?.(0);

    expect(deltas).toEqual([1 / 60, 0.25]);
  });
});
