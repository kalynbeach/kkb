import type { SourceCapabilities } from "../contracts/types";
import type { AudioSource } from "./audio-source";
import { type AudioElementLike, createMediaElementBackedSource } from "./media-element-shared";

const MEDIA_ELEMENT_CAPABILITIES: SourceCapabilities = {
  streaming: true,
  sampleAccurateSeek: false,
  gapless: "best-effort",
  loudnessMetadata: false,
  requiresUserGesture: true,
  requiresSAB: false,
};

export const createMediaElementSource = (audio: AudioElementLike): AudioSource =>
  createMediaElementBackedSource({
    audio,
    capabilities: MEDIA_ELEMENT_CAPABILITIES,
    id: "media-element",
    score: 70,
  });
