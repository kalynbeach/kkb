import { cn } from "@kkb/ui/lib/utils";

import type { TrackRecord } from "@/lib/audio/catalog/track-types";

type TrackSelectorProps = {
  tracks: TrackRecord[];
  selectedTrackId: string | null;
  onSelectTrack: (trackId: string) => void;
};

const FORMAT_LABELS: Record<string, string> = {
  "audio/mp4; codecs=mp4a.40.2": "AAC",
  "audio/webm; codecs=opus": "OPUS",
};

const getFormatLabel = (track: TrackRecord): string => {
  const asset = track.assets[0];
  if (!asset) return "";
  return FORMAT_LABELS[asset.mimeType] ?? asset.mimeType.split("/")[1]?.toUpperCase() ?? "";
};

function TrackSelector({ tracks, selectedTrackId, onSelectTrack }: TrackSelectorProps) {
  return (
    <div role="listbox" aria-label="Playlist" className="flex flex-col">
      <div className="flex items-center justify-between border-b border-[#505880] bg-[linear-gradient(90deg,#6870a0,#8088b8,#6870a0)] px-3 py-1.5">
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#d0d8e8]">
          Playlist
        </span>
        <span className="font-mono text-[10px] uppercase tracking-wider text-[#a0a8c0]">
          {tracks.length} tracks
        </span>
      </div>

      <div className="relative overflow-hidden border-2 border-[#303850] bg-[linear-gradient(180deg,#0a1028_0%,#0e1630_50%,#0a1028_100%)] shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 opacity-[0.04] [background-image:repeating-linear-gradient(0deg,transparent,transparent_1px,rgba(120,160,255,0.15)_1px,rgba(120,160,255,0.15)_2px)]"
        />
        {tracks.map((track, index) => {
          const isSelected = track.id === selectedTrackId;
          return (
            <button
              key={track.id}
              type="button"
              role="option"
              aria-selected={isSelected}
              className={cn(
                "relative flex w-full items-center gap-3 px-3 py-2 text-left transition-colors",
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[#78b8ff]",
                isSelected
                  ? "bg-[rgba(120,184,255,0.12)] shadow-[inset_0_0_12px_rgba(120,184,255,0.06)]"
                  : "hover:bg-[rgba(120,184,255,0.06)]",
              )}
              onClick={() => onSelectTrack(track.id)}
            >
              <span
                className={cn(
                  "font-mono text-[11px] tabular-nums",
                  isSelected ? "text-[#78b8ff]" : "text-[rgba(120,184,255,0.3)]",
                )}
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              <span className="flex min-w-0 flex-1 items-baseline gap-2">
                <span
                  className={cn(
                    "truncate font-mono text-xs tracking-wide",
                    isSelected
                      ? "text-[#78b8ff] drop-shadow-[0_0_8px_rgba(120,184,255,0.4)]"
                      : "text-[rgba(120,184,255,0.65)]",
                  )}
                >
                  {track.title}
                </span>
                {track.artist ? (
                  <span className="shrink-0 font-mono text-[10px] text-[rgba(120,184,255,0.3)]">
                    {track.artist}
                  </span>
                ) : null}
              </span>

              <span
                className={cn(
                  "shrink-0 rounded border px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider",
                  isSelected
                    ? "border-[rgba(120,184,255,0.25)] text-[rgba(120,184,255,0.6)]"
                    : "border-[rgba(120,184,255,0.1)] text-[rgba(120,184,255,0.25)]",
                )}
              >
                {getFormatLabel(track)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export { TrackSelector };
