import { OscilloscopeClient } from "@/components/oscilloscope/oscilloscope-client";

export default function OscilloscopePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#0e1a11_0%,#071009_48%,#030806_100%)] px-4 py-10 text-white">
      <OscilloscopeClient />
    </main>
  );
}
