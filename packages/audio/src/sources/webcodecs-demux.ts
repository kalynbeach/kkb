import { isWebCodecsEligibleInput } from "../contracts/codecs";
import type { TimelineSnapshot, TrackInput } from "../contracts/types";

type DemuxResult = Partial<TimelineSnapshot> | undefined;

export type WebCodecsDemuxer = {
  supports(input: TrackInput): boolean;
  load(input: TrackInput): Promise<DemuxResult>;
  destroy?(): Promise<void>;
};

export const createWebCodecsDemuxer = (): WebCodecsDemuxer => ({
  supports: (input) => isWebCodecsEligibleInput(input),
  load: async () => undefined,
});
