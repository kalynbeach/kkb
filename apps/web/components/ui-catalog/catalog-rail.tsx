"use client";

import { ScrollArea } from "@kkb/ui/components/scroll-area";
import { cn } from "@kkb/ui/lib/utils";
import type { ReactNode } from "react";
import * as React from "react";

import { type CatalogItem, categoryId, categoryOrder, itemsForCategory } from "./catalog-data";

const browseCategories = categoryOrder.filter((category) => category !== "Design System");

export function CatalogCompactNav({
  selectedItem,
  onSelect,
}: {
  selectedItem: CatalogItem;
  onSelect: (id: string) => void;
}) {
  const activeButtonRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    activeButtonRef.current?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [selectedItem.category, selectedItem.id]);

  return (
    <nav
      aria-label="UI catalog sections"
      className="border-b bg-sidebar text-sidebar-foreground lg:hidden"
    >
      <div className="flex gap-1 overflow-x-auto px-2 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <CompactNavButton
          active={selectedItem.id === "preview"}
          activeButtonRef={selectedItem.id === "preview" ? activeButtonRef : undefined}
          onClick={() => onSelect("preview")}
        >
          Preview
        </CompactNavButton>
        <CompactNavButton
          active={selectedItem.id === "design-system"}
          activeButtonRef={selectedItem.id === "design-system" ? activeButtonRef : undefined}
          onClick={() => onSelect("design-system")}
        >
          Design System
        </CompactNavButton>
        {browseCategories.map((category) => (
          <CompactNavButton
            key={category}
            active={selectedItem.category === category}
            activeButtonRef={selectedItem.category === category ? activeButtonRef : undefined}
            onClick={() => onSelect(categoryId(category))}
          >
            {category}
          </CompactNavButton>
        ))}
      </div>
    </nav>
  );
}

export function CatalogRail({
  selectedItemId,
  onSelect,
}: {
  selectedItemId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <aside className="hidden h-full overflow-hidden bg-sidebar text-sidebar-foreground lg:block">
      <div className="flex h-full flex-col border-r">
        <div className="border-b p-3">
          <RailButton active={selectedItemId === "preview"} onClick={() => onSelect("preview")}>
            Preview
          </RailButton>
          <RailButton
            active={selectedItemId === "design-system"}
            onClick={() => onSelect("design-system")}
          >
            Design System
          </RailButton>
        </div>
        <ScrollArea className="min-h-0 flex-1">
          <nav aria-label="UI catalog" className="space-y-4 p-3">
            {browseCategories.map((category) => {
              const categoryItems = itemsForCategory(category);
              const currentCategoryActive = selectedItemId === categoryId(category);

              return (
                <div key={category} className="space-y-1">
                  <div className="flex items-center justify-between gap-2 px-2">
                    <p className="font-mono text-[11px] leading-4 text-muted-foreground">
                      {category}
                    </p>
                    <button
                      type="button"
                      aria-current={currentCategoryActive ? "page" : undefined}
                      aria-label={`Show all ${category} items`}
                      onClick={() => onSelect(categoryId(category))}
                      className={cn(
                        "font-mono text-[10px] text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
                        currentCategoryActive && "text-foreground underline",
                      )}
                    >
                      All
                    </button>
                  </div>
                  <div className="space-y-0.5">
                    {categoryItems.map((item) => (
                      <RailButton
                        key={item.id}
                        active={selectedItemId === item.id}
                        onClick={() => onSelect(item.id)}
                        className="min-h-7 text-xs"
                      >
                        <span className="min-w-0 flex-1 truncate">{item.label}</span>
                      </RailButton>
                    ))}
                  </div>
                </div>
              );
            })}
          </nav>
        </ScrollArea>
      </div>
    </aside>
  );
}

function CompactNavButton({
  active,
  activeButtonRef,
  onClick,
  children,
}: {
  active: boolean;
  activeButtonRef?: React.Ref<HTMLButtonElement>;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      ref={activeButtonRef}
      aria-current={active ? "page" : undefined}
      onClick={onClick}
      className={cn(
        "min-h-11 shrink-0 rounded-md px-3 font-mono text-xs transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
        active
          ? "bg-foreground font-semibold text-background underline decoration-2 underline-offset-4"
          : "text-muted-foreground hover:bg-accent/70 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function RailButton({
  active,
  onClick,
  className,
  children,
}: {
  active: boolean;
  onClick: () => void;
  className?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-current={active ? "page" : undefined}
      onClick={onClick}
      className={cn(
        "flex min-h-8 w-full items-center gap-2 rounded-md px-2 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
        active
          ? "bg-foreground font-medium text-background underline underline-offset-4"
          : "text-muted-foreground hover:bg-accent/70 hover:text-foreground",
        className,
      )}
    >
      {children}
    </button>
  );
}
