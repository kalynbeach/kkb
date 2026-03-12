import type { TrackRecord } from "@/lib/audio/catalog/track-types";

type TrackSelectorProps = {
  tracks: TrackRecord[];
  selectedTrackId: string | null;
  onSelectTrack: (trackId: string) => void;
};

function TrackSelector({ tracks, selectedTrackId, onSelectTrack }: TrackSelectorProps) {
  return (
    <label className="mb-4 flex w-full max-w-lg flex-col gap-1.5">
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#9aa7c2]">Track</span>
      <select
        aria-label="Track"
        className="h-10 rounded-md border border-[#36405a] bg-[rgba(9,14,28,0.85)] px-3 font-mono text-sm text-[#dbe7ff] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] outline-none transition-colors focus:border-[#78b8ff]"
        value={selectedTrackId ?? ""}
        onChange={(event) => {
          onSelectTrack(event.currentTarget.value);
        }}
      >
        {tracks.map((track) => (
          <option key={track.id} value={track.id}>
            {track.title}
          </option>
        ))}
      </select>
    </label>
  );
}

export { TrackSelector };
