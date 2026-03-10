import { PlayerClient } from "@/components/audio/player-client";

export default function AudioPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#0e1018_0%,#141828_50%,#0e1018_100%)] px-4 py-12">
      <PlayerClient />
    </main>
  );
}
