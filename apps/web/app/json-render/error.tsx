"use client";

export default function JsonRenderError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-4xl space-y-4">
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <p className="text-muted-foreground">{error.message}</p>
        <button type="button" onClick={reset} className="underline">
          Try again
        </button>
      </div>
    </div>
  );
}
