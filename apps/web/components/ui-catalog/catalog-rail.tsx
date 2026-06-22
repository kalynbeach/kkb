import { ScrollArea } from "@kkb/ui/components/scroll-area";
import { cn } from "@kkb/ui/lib/utils";
import type { ReactNode } from "react";

import { categoryId, categoryOrder, itemsForCategory } from "./catalog-data";

export function CatalogRail({
  selectedItemId,
  onSelect,
}: {
  selectedItemId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <aside className="hidden h-[calc(100vh-3.5rem)] overflow-hidden bg-sidebar text-sidebar-foreground lg:block">
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
            {categoryOrder
              .filter((category) => category !== "Design System")
              .map((category) => {
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
                      {categoryItems
                        .filter((item) => item.kind !== "category" && item.kind !== "view")
                        .map((item) => (
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
      onClick={onClick}
      className={cn(
        "flex min-h-8 w-full items-center gap-2 rounded-md px-2 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
        active
          ? "bg-foreground text-background"
          : "text-muted-foreground hover:bg-accent/70 hover:text-foreground",
        className,
      )}
    >
      {children}
    </button>
  );
}
