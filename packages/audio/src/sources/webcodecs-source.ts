import { isWebCodecsEligibleInput } from "../contracts/codecs";
import type { SourceCapabilities, TimelineSnapshot } from "../contracts/types";
import type { AudioSource } from "./audio-source";
import type { WebCodecsDemuxer } from "./webcodecs-demux";

type WebCodecsGlobals = {
  AudioDecoder?: unknown;
};

type WebCodecsSourceOptions = {
  globals: WebCodecsGlobals;
  demuxer: WebCodecsDemuxer;
  timeline: TimelineSnapshot;
};

const WEB_CODECS_CAPABILITIES: SourceCapabilities = {
  streaming: true,
  sampleAccurateSeek: true,
  gapless: true,
  loudnessMetadata: false,
  requiresUserGesture: true,
  requiresSAB: false,
};

export const supportsWebCodecsSource = (globals: WebCodecsGlobals) =>
  typeof globals.AudioDecoder !== "undefined";

export const createWebCodecsSource = ({
  globals,
  demuxer,
  timeline,
}: WebCodecsSourceOptions): AudioSource => {
  let currentTimeline = { ...timeline };

  return {
    id: "webcodecs",
    capabilities: WEB_CODECS_CAPABILITIES,
    canPlay: async (input) =>
      supportsWebCodecsSource(globals) &&
      demuxer.isConfigured() &&
      isWebCodecsEligibleInput(input) &&
      demuxer.supports(input),
    score: (_context) => 100,
    load: async (input) => {
      const nextTimeline = await demuxer.load(input);
      if (nextTimeline) {
        currentTimeline = { ...currentTimeline, ...nextTimeline };
      }
    },
    play: async () => {},
    pause: async () => {},
    seek: async (seconds) => {
      currentTimeline = { ...currentTimeline, currentTime: seconds };
    },
    getTimeline: () => currentTimeline,
    destroy: async () => {
      await demuxer.destroy?.();
    },
  };
};
