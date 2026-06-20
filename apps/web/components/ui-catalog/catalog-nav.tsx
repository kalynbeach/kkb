"use client";

import { cn } from "@kkb/ui/lib/utils";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type CatalogSection = {
  id: string;
  label: string;
  itemCount?: number;
};

type CatalogNavProps = {
  sections: readonly CatalogSection[];
  totalItemCount?: number;
};

const DESKTOP_NAV_OFFSET = 144;

const getSectionIdFromHash = (sections: readonly CatalogSection[]) => {
  const hash = window.location.hash.replace(/^#/, "");

  return sections.some((section) => section.id === hash) ? hash : "";
};

const getClosestSectionId = (sections: readonly CatalogSection[]) => {
  const sectionElements = sections
    .map((section) => {
      const element = document.getElementById(section.id);
      if (!element) {
        return null;
      }

      return {
        id: section.id,
        top: element.getBoundingClientRect().top,
      };
    })
    .filter((section): section is { id: string; top: number } => section !== null);

  const currentSection = [...sectionElements]
    .filter((section) => section.top <= DESKTOP_NAV_OFFSET)
    .sort((left, right) => right.top - left.top)[0];

  return currentSection?.id ?? sectionElements[0]?.id ?? sections[0]?.id ?? "";
};

export function CatalogNav({ sections, totalItemCount }: CatalogNavProps) {
  const [activeSectionId, setActiveSectionId] = useState(sections[0]?.id ?? "");
  const [query, setQuery] = useState("");

  const filteredSections = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return sections;
    }

    return sections.filter((section) => section.label.toLowerCase().includes(normalizedQuery));
  }, [query, sections]);

  useEffect(() => {
    if (sections.length === 0) {
      return;
    }

    const syncActiveSectionId = () => {
      const nextActiveSectionId = getClosestSectionId(sections);

      setActiveSectionId((currentSectionId) =>
        currentSectionId === nextActiveSectionId ? currentSectionId : nextActiveSectionId,
      );
    };

    const syncActiveSectionIdFromHash = () => {
      const nextActiveSectionId = getSectionIdFromHash(sections);

      if (nextActiveSectionId) {
        setActiveSectionId((currentSectionId) =>
          currentSectionId === nextActiveSectionId ? currentSectionId : nextActiveSectionId,
        );

        return;
      }

      syncActiveSectionId();
    };

    const observer = new IntersectionObserver(
      () => {
        syncActiveSectionId();
      },
      {
        rootMargin: "-18% 0px -64% 0px",
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      },
    );

    for (const section of sections) {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }
    }

    syncActiveSectionIdFromHash();
    const frame = window.requestAnimationFrame(syncActiveSectionIdFromHash);
    window.addEventListener("scroll", syncActiveSectionId, { passive: true });
    window.addEventListener("resize", syncActiveSectionId);
    window.addEventListener("hashchange", syncActiveSectionIdFromHash);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", syncActiveSectionId);
      window.removeEventListener("resize", syncActiveSectionId);
      window.removeEventListener("hashchange", syncActiveSectionIdFromHash);
    };
  }, [sections]);

  return (
    <>
      <div className="border-b pb-4 lg:hidden">
        <nav aria-label="Catalog sections" className="-mx-4 overflow-x-auto px-4 sm:-mx-6 sm:px-6">
          <ul className="flex min-w-max gap-2">
            {sections.map((section) => {
              const isActive = section.id === activeSectionId;

              return (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    aria-current={isActive ? "location" : undefined}
                    onClick={() => setActiveSectionId(section.id)}
                    className={cn(
                      "inline-flex min-h-11 items-center gap-2 rounded-md border px-3 text-sm font-medium transition-colors",
                      isActive
                        ? "border-foreground bg-foreground text-background"
                        : "border-border bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground",
                    )}
                  >
                    <span className="font-mono">{section.label}</span>
                    {section.itemCount ? (
                      <span className="font-mono text-xs opacity-70">{section.itemCount}</span>
                    ) : null}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      <aside className="hidden lg:block">
        <div className="sticky top-8 space-y-5">
          <div className="space-y-2">
            <p className="font-mono text-xs text-muted-foreground">browse sections</p>
            <label className="relative block">
              <span className="sr-only">Filter catalog sections</span>
              <Search className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-3 size-3.5 text-muted-foreground" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Filter sections"
                className="h-9 w-full rounded-md border bg-background pr-3 pl-8 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-[3px] focus:ring-ring/20"
              />
            </label>
          </div>

          <nav aria-label="Catalog sections">
            <ul className="space-y-1.5">
              {filteredSections.map((section) => {
                const isActive = section.id === activeSectionId;

                return (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      aria-current={isActive ? "location" : undefined}
                      onClick={() => setActiveSectionId(section.id)}
                      className={cn(
                        "flex min-h-10 items-center justify-between rounded-md px-3 text-sm transition-colors",
                        isActive
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                      )}
                    >
                      <span className="font-mono">{section.label}</span>
                      {section.itemCount ? (
                        <span className="font-mono text-xs text-muted-foreground">
                          {section.itemCount}
                        </span>
                      ) : null}
                    </a>
                  </li>
                );
              })}
            </ul>
            {filteredSections.length === 0 ? (
              <p className="rounded-md border border-dashed p-3 text-sm text-muted-foreground">
                No section matches “{query}”.
              </p>
            ) : null}
          </nav>

          {totalItemCount ? (
            <div className="rounded-md bg-muted/20 p-3">
              <p className="font-mono text-xs text-muted-foreground">catalog coverage</p>
              <p className="mt-1 text-sm text-foreground">
                {totalItemCount} primitives across {sections.length} browsable groups.
              </p>
            </div>
          ) : null}
        </div>
      </aside>
    </>
  );
}
