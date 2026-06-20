import { Suspense } from "react";

import { CatalogWorkbench } from "@/components/ui-catalog/catalog-workbench";

export default function UiPage() {
  return (
    <Suspense fallback={<UiPageFallback />}>
      <CatalogWorkbench />
    </Suspense>
  );
}

function UiPageFallback() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="border-b p-4 md:p-6">
        <p className="font-mono text-xs text-muted-foreground">@kkb/ui / catalog</p>
        <h1 className="mt-2 font-mono text-xl font-semibold tracking-[-0.01em]">UI catalog</h1>
      </div>
      <div className="grid min-h-[calc(100vh-5rem)] place-items-center p-6">
        <div className="rounded-md border bg-card p-6 font-mono text-sm text-muted-foreground">
          Loading catalog workbench…
        </div>
      </div>
    </main>
  );
}
