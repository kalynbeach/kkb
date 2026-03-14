import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-8 p-8">
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="font-mono text-2xl font-bold tracking-tight">KKB</h1>
      </div>
      <nav className="flex gap-6">
        <Link
          href="/audio"
          className="font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          audio
        </Link>
        <Link
          href="/json-render"
          className="font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          json-render
        </Link>
      </nav>
    </div>
  );
}
