import type { SourceCapabilities } from "../contracts/types";
import type { AudioSource } from "./audio-source";
import { type AudioElementLike, createMediaElementBackedSource } from "./media-element-shared";

const FALLBACK_CAPABILITIES: SourceCapabilities = {
  streaming: true,
  sampleAccurateSeek: false,
  gapless: "best-effort",
  loudnessMetadata: false,
  requiresUserGesture: true,
  requiresSAB: false,
};

export const createFallbackSource = (audio: AudioElementLike): AudioSource =>
  createMediaElementBackedSource({
    audio,
    capabilities: FALLBACK_CAPABILITIES,
    id: "fallback",
    score: 1,
  });
