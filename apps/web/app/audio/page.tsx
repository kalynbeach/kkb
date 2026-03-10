import { PlayerClient } from "@/components/audio/player-client";

export default function AudioPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#e2e8f0_42%,#fff7ed_100%)] px-6 py-12 text-slate-950">
      <PlayerClient />
    </main>
  );
}
