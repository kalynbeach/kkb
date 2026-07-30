"use client";

import { Button } from "@kkb/ui/components/button";
import { Kbd, KbdGroup } from "@kkb/ui/components/kbd";
import { ModeToggle } from "@kkb/ui/components/mode-toggle";
import { ArrowLeftIcon } from "@phosphor-icons/react/dist/csr/ArrowLeft";
import { MagnifyingGlassIcon } from "@phosphor-icons/react/dist/csr/MagnifyingGlass";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

import { resolveCatalogItem } from "./catalog-data";
import { CatalogCompactNav, CatalogRail } from "./catalog-rail";
import { CatalogSearchDialog } from "./catalog-search";
import { CatalogSurface } from "./catalog-surfaces";

export function CatalogWorkbench() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchOpen, setSearchOpen] = React.useState(false);
  const contentRef = React.useRef<HTMLElement>(null);
  const selectedItemResolution = resolveCatalogItem(searchParams.get("item"));
  const selectedItem = selectedItemResolution.item;

  const selectItem = React.useCallback(
    (id: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("item", id);
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
      setSearchOpen(false);
    },
    [pathname, router, searchParams],
  );

  React.useEffect(() => {
    const content = contentRef.current;

    if (!content) {
      return;
    }

    const frame = window.requestAnimationFrame(() => content.scrollTo({ top: 0 }));

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [selectedItem.id]);

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen((current) => !current);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <main className="flex h-screen flex-col overflow-hidden bg-background text-foreground">
      <CatalogSearchDialog
        open={searchOpen}
        selectedItemId={selectedItem.id}
        onOpenChange={setSearchOpen}
        onSelect={selectItem}
      />

      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="flex min-h-14 items-center gap-3 px-3 md:px-4">
          <Button variant="ghost" size="icon" asChild className="shrink-0">
            <Link href="/" aria-label="Return home">
              <ArrowLeftIcon aria-hidden="true" focusable="false" weight="regular" />
            </Link>
          </Button>
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[11px] text-muted-foreground">@kkb/ui</p>
            <h1 className="truncate font-mono text-base font-semibold tracking-[-0.01em]">
              {selectedItem.label}
            </h1>
          </div>
          <Button
            type="button"
            variant="outline"
            className="hidden min-w-64 justify-start gap-2 text-muted-foreground md:inline-flex"
            onClick={() => setSearchOpen(true)}
          >
            <MagnifyingGlassIcon
              aria-hidden="true"
              data-icon="inline-start"
              focusable="false"
              weight="regular"
            />
            Search...
            <KbdGroup className="ml-auto">
              <Kbd>⌘</Kbd>
              <Kbd>K</Kbd>
            </KbdGroup>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="md:hidden"
            onClick={() => setSearchOpen(true)}
            aria-label="Search catalog"
          >
            <MagnifyingGlassIcon aria-hidden="true" focusable="false" weight="regular" />
          </Button>
          <ModeToggle />
        </div>
      </header>

      <CatalogCompactNav selectedItem={selectedItem} onSelect={selectItem} />

      <div className="grid min-h-0 flex-1 overflow-hidden lg:grid-cols-[240px_minmax(0,1fr)]">
        <CatalogRail selectedItemId={selectedItem.id} onSelect={selectItem} />
        <section ref={contentRef} className="min-w-0 overflow-y-auto bg-background lg:border-l">
          <CatalogSurface selectedItem={selectedItem} onSelect={selectItem} />
        </section>
      </div>
    </main>
  );
}
