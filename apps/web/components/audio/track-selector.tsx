import { AUDIO_SCANLINES_CLASS_NAME } from "@kkb/ui/components/audio/theme";
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
      <div className="audio-titlebar">
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-audio-title">
          Playlist
        </span>
        <span className="font-mono text-[10px] uppercase tracking-wider text-audio-meta">
          {tracks.length} tracks
        </span>
      </div>

      <div className="audio-panel">
        <div aria-hidden="true" className={cn(AUDIO_SCANLINES_CLASS_NAME, "z-10 opacity-[0.04]")} />
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
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-audio-accent",
                isSelected
                  ? "bg-audio-accent-soft shadow-[inset_0_0_12px_var(--audio-buffered)]"
                  : "hover:bg-audio-buffered",
              )}
              onClick={() => onSelectTrack(track.id)}
            >
              <span
                className={cn(
                  "font-mono text-[11px] tabular-nums",
                  isSelected ? "text-audio-accent" : "text-audio-accent-faint",
                )}
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              <span className="flex min-w-0 flex-1 items-baseline gap-2">
                <span
                  className={cn(
                    "truncate font-mono text-xs tracking-wide",
                    isSelected
                      ? "text-audio-accent drop-shadow-[0_0_8px_var(--audio-accent-glow)]"
                      : "text-audio-accent-muted",
                  )}
                >
                  {track.title}
                </span>
                {track.artist ? (
                  <span className="shrink-0 font-mono text-[10px] text-audio-accent-faint">
                    {track.artist}
                  </span>
                ) : null}
              </span>

              <span
                className={cn(
                  "shrink-0 rounded border px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider",
                  isSelected
                    ? "border-audio-accent-soft text-audio-accent-muted"
                    : "border-audio-accent-softer text-audio-accent-faint",
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
