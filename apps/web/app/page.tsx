import Link from "next/link";

const routes = [
  { href: "/audio", label: "audio" },
  { href: "/binaural-beats", label: "binaural" },
  { href: "/oscilloscope", label: "oscilloscope" },
  { href: "/ui", label: "ui" },
  { href: "/json-render", label: "json-render" },
] as const;

export default function Home() {
  return (
    <main className="flex min-h-svh items-center justify-center px-4 py-8 sm:px-8">
      <div className="grid w-full max-w-3xl gap-5">
        <header className="border-b border-foreground pb-3">
          <h1 className="font-serif text-2xl font-bold">KKB</h1>
        </header>

        <nav aria-label="KKB routes">
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {routes.map((route) => (
              <li key={route.href} className="min-w-0">
                <Link
                  href={route.href}
                  className="flex h-20 items-end border border-border p-3 font-mono text-sm font-semibold text-foreground transition-colors hover:border-foreground hover:bg-foreground hover:text-background focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 sm:h-24"
                >
                  {route.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </main>
  );
}
