import { ScrollArea } from "@kkb/ui/components/scroll-area";
import { cn } from "@kkb/ui/lib/utils";
import type { ReactNode } from "react";

import { categoryId, itemLane, itemsForCategory, laneLabel, railGroups } from "./catalog-data";
import { categoryIcons } from "./catalog-icons";

export function CatalogRail({
  selectedItemId,
  onSelect,
}: {
  selectedItemId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <aside className="hidden h-[calc(100vh-4rem)] overflow-hidden bg-sidebar text-sidebar-foreground lg:block">
      <div className="flex h-full flex-col border-r">
        <div className="border-b p-3">
          <RailButton active={selectedItemId === "preview"} onClick={() => onSelect("preview")}>
            Preview
          </RailButton>
        </div>
        <ScrollArea className="min-h-0 flex-1">
          <nav aria-label="UI catalog" className="space-y-5 p-3">
            {railGroups.map((group) => (
              <div key={group.label} className="space-y-2">
                <p className="px-2 font-mono text-[11px] leading-4 text-muted-foreground">
                  {group.label}
                </p>
                <div className="space-y-3">
                  {group.categories.map((category) => {
                    const Icon = categoryIcons[category];
                    const categoryItems = itemsForCategory(category);
                    const currentCategoryActive = selectedItemId === categoryId(category);

                    return (
                      <div key={category} className="space-y-1">
                        <RailButton
                          active={currentCategoryActive}
                          onClick={() => onSelect(categoryId(category))}
                          className="font-mono text-xs"
                        >
                          <Icon className="size-3.5 shrink-0" />
                          <span className="min-w-0 flex-1 truncate">{category}</span>
                          <span className="text-[10px] text-muted-foreground">
                            {categoryItems.length}
                          </span>
                        </RailButton>
                        <div className="space-y-0.5">
                          {categoryItems
                            .filter((item) => item.kind !== "category")
                            .map((item) => {
                              const lane = itemLane(item);

                              return (
                                <RailButton
                                  key={item.id}
                                  active={selectedItemId === item.id}
                                  onClick={() => onSelect(item.id)}
                                  className="min-h-7 pl-5 text-xs"
                                >
                                  <span className="min-w-0 flex-1 truncate">{item.label}</span>
                                  {lane !== "support" ? (
                                    <span className="font-mono text-[9px] text-muted-foreground">
                                      {laneLabel(lane)}
                                    </span>
                                  ) : null}
                                </RailButton>
                              );
                            })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
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
