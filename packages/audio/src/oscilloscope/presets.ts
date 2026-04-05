import type { OscilloscopePreset } from "./types";

export const OSCILLOSCOPE_PRESETS: OscilloscopePreset[] = [
  {
    id: "circle",
    name: "Circle",
    config: {
      mode: "xy",
      canvas: { aspectRatio: "1:1", background: 0.02, quality: "quality" },
      phosphor: { bloom: 0.75, color: "p31-green", trailLength: 64 },
      source: {
        type: "oscillators",
        ratioLock: "1:1",
        a: {
          amplitude: 1,
          detuneCents: 0,
          frequency: 220,
          phase: 1.5707963267948966,
          waveform: "sine",
        },
        b: {
          amplitude: 1,
          detuneCents: 0,
          frequency: 220,
          phase: 0,
          waveform: "sine",
        },
      },
    },
  },
  {
    id: "figure-eight",
    name: "Figure Eight",
    config: {
      mode: "xy",
      canvas: { aspectRatio: "1:1", background: 0.02, quality: "quality" },
      phosphor: { bloom: 0.8, color: "p31-green", trailLength: 72 },
      source: {
        type: "oscillators",
        ratioLock: "2:1",
        a: {
          amplitude: 1,
          detuneCents: 0,
          frequency: 220,
          phase: 0,
          waveform: "sine",
        },
        b: {
          amplitude: 1,
          detuneCents: 0,
          frequency: 110,
          phase: 0,
          waveform: "sine",
        },
      },
    },
  },
  {
    id: "lissajous-3-2",
    name: "Lissajous 3:2",
    config: {
      mode: "xy",
      canvas: { aspectRatio: "1:1", background: 0.02, quality: "quality" },
      phosphor: { bloom: 0.85, color: "p31-green", trailLength: 84 },
      source: {
        type: "oscillators",
        ratioLock: "3:2",
        a: {
          amplitude: 1,
          detuneCents: 0,
          frequency: 300,
          phase: 0,
          waveform: "sine",
        },
        b: {
          amplitude: 1,
          detuneCents: 0,
          frequency: 200,
          phase: 0,
          waveform: "sine",
        },
      },
    },
  },
  {
    id: "breathing-detune",
    name: "Breathing Detune",
    config: {
      mode: "xy",
      canvas: { aspectRatio: "1:1", background: 0.02, quality: "quality" },
      phosphor: { bloom: 0.9, color: "p31-green", trailLength: 96 },
      source: {
        type: "oscillators",
        ratioLock: "1:1",
        a: {
          amplitude: 1,
          detuneCents: 3,
          frequency: 220,
          phase: 1.5707963267948966,
          waveform: "sine",
        },
        b: {
          amplitude: 1,
          detuneCents: 0,
          frequency: 220,
          phase: 0,
          waveform: "sine",
        },
      },
    },
  },
];
