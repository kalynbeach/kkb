import { OscilloscopeClient } from "@/components/oscilloscope/oscilloscope-client";

export default function OscilloscopePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#0e1a11_0%,#071009_48%,#030806_100%)] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="flex max-w-3xl flex-col gap-2">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-emerald-200/70">
            Audio experiments
          </p>
          <div className="flex flex-col gap-2">
            <h1 className="text-balance font-mono text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Oscilloscope
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-emerald-50/70">
              WebGPU XY view for oscillator and mic input.
            </p>
          </div>
        </header>

        <OscilloscopeClient />
      </div>
    </main>
  );
}
