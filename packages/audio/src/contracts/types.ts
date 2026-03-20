export type TrackInput = Readonly<{
  src: string;
  mimeType?: string;
}>;

export type GaplessCapability = true | false | "best-effort";

export type SourceCapabilities = Readonly<{
  streaming: boolean;
  sampleAccurateSeek: boolean;
  gapless: GaplessCapability;
  loudnessMetadata: boolean;
  requiresUserGesture: boolean;
  requiresSAB: boolean;
}>;

export type SourceScoreContext = Readonly<{
  userAgent?: string;
  coopCoepEnabled: boolean;
  networkType?: string;
  lowPowerModeLikely: boolean;
}>;

export type TimelineSnapshot = Readonly<{
  currentTime: number;
  duration: number;
}>;
