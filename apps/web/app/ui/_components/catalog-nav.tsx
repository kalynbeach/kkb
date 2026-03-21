"use client";

import { cn } from "@kkb/ui/lib/utils";
import { useEffect, useState } from "react";

type CatalogSection = {
  id: string;
  label: string;
};

type CatalogNavProps = {
  sections: readonly CatalogSection[];
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
        distance: Math.abs(element.getBoundingClientRect().top - DESKTOP_NAV_OFFSET),
      };
    })
    .filter((section): section is { id: string; distance: number } => section !== null)
    .sort((left, right) => left.distance - right.distance);

  return sectionElements[0]?.id ?? sections[0]?.id ?? "";
};

export function CatalogNav({ sections }: CatalogNavProps) {
  const [activeSectionId, setActiveSectionId] = useState(sections[0]?.id ?? "");

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
                      "inline-flex items-center rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                      isActive
                        ? "border-foreground bg-foreground text-background"
                        : "border-border bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground",
                    )}
                  >
                    {section.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      <aside className="hidden lg:block">
        <div className="sticky top-8">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Sections
          </p>
          <nav aria-label="Catalog sections">
            <ul className="space-y-1.5">
              {sections.map((section) => {
                const isActive = section.id === activeSectionId;

                return (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      aria-current={isActive ? "location" : undefined}
                      onClick={() => setActiveSectionId(section.id)}
                      className={cn(
                        "flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                        isActive
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                      )}
                    >
                      <span>{section.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}
