import { BinauralBeatsClient } from "@/components/binaural-beats/binaural-beats-client";

export default function BinauralBeatsPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#1a1a1d_0%,#0d0d10_45%,#050506_100%)] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <header className="flex max-w-3xl flex-col gap-2">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/40">
            Audio experiments
          </p>
          <div className="flex flex-col gap-2">
            <h1 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Binaural beats
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-white/50">
              Native Web Audio tone generator with separate left and right sine waves.
            </p>
          </div>
        </header>

        <BinauralBeatsClient />
      </div>
    </main>
  );
}
