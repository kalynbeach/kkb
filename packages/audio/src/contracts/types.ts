export type TrackInput = {
  src: string;
  mimeType?: string;
};

export type GaplessCapability = true | false | "best-effort";

export type SourceCapabilities = {
  streaming: boolean;
  sampleAccurateSeek: boolean;
  gapless: GaplessCapability;
  loudnessMetadata: boolean;
  requiresUserGesture: boolean;
  requiresSAB: boolean;
};

export type SourceScoreContext = {
  userAgent?: string;
  coopCoepEnabled: boolean;
  networkType?: string;
  lowPowerModeLikely: boolean;
};

export type TimelineSnapshot = {
  currentTime: number;
  duration: number;
};
