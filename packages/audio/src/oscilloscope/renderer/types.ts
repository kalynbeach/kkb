import type { FrameGeometry } from "../modes/mode";
import type { OscilloscopeConfig } from "../types";

export type OscilloscopeRenderer = {
  destroy(): void;
  drawFrame(geometry: FrameGeometry, config: OscilloscopeConfig): void;
  resize(width: number, height: number, devicePixelRatio: number): void;
};
