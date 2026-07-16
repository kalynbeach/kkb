import { redirect } from "next/navigation";
import { Suspense } from "react";
import { resolveCatalogItem } from "@/components/ui-catalog/catalog-data";
import { CatalogWorkbench } from "@/components/ui-catalog/catalog-workbench";

type UiSearchParams = Record<string, string | string[] | undefined>;

export default async function UiPage({ searchParams }: { searchParams: Promise<UiSearchParams> }) {
  const resolvedSearchParams = await searchParams;
  const requestedItem = firstValue(resolvedSearchParams.item);

  if (resolveCatalogItem(requestedItem ?? null).missingItemId) {
    redirect(catalogPathWithoutItem(resolvedSearchParams));
  }

  return (
    <Suspense fallback={<UiPageFallback />}>
      <CatalogWorkbench />
    </Suspense>
  );
}

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function catalogPathWithoutItem(searchParams: UiSearchParams) {
  const canonicalSearchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    if (key === "item" || value === undefined) {
      continue;
    }

    if (Array.isArray(value)) {
      for (const entry of value) {
        canonicalSearchParams.append(key, entry);
      }
    } else {
      canonicalSearchParams.set(key, value);
    }
  }

  const query = canonicalSearchParams.toString();
  return query ? `/ui?${query}` : "/ui";
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
