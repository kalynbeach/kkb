import type { TrackInput } from "./types.js";

const WEB_CODECS_MIME_TYPES = new Set([
  "audio/webm; codecs=opus",
  "audio/mp4; codecs=mp4a.40.2",
  "audio/m4a; codecs=mp4a.40.2",
]);

export const normalizeMimeType = (input: TrackInput) =>
  input.mimeType?.trim().toLowerCase() ?? "";

export const isWebCodecsEligibleInput = (input: TrackInput) =>
  WEB_CODECS_MIME_TYPES.has(normalizeMimeType(input));

export const isMediaElementEligibleInput = (input: TrackInput) =>
  normalizeMimeType(input).length > 0;
