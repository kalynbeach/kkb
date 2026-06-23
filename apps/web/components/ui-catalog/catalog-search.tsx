import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@kkb/ui/components/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@kkb/ui/components/dialog";
import { Check } from "lucide-react";
import * as React from "react";

import {
  allSelectableItems,
  type CatalogItem,
  categoryMeta,
  itemFromId,
  itemsForCategory,
} from "./catalog-data";
import { CatalogItemIcon } from "./catalog-icons";
import { rankCatalogSearch } from "./catalog-search-index";

export type CatalogSearchGroup = {
  heading: string;
  items: readonly CatalogItem[];
};

export function CatalogSearchDialog({
  open,
  selectedItemId,
  onOpenChange,
  onSelect,
}: {
  open: boolean;
  selectedItemId: string;
  onOpenChange: (open: boolean) => void;
  onSelect: (id: string) => void;
}) {
  const [query, setQuery] = React.useState("");
  const trimmedQuery = query.trim();
  const selectedItem = itemFromId(selectedItemId);
  const groups = React.useMemo(
    () => getCatalogSearchGroups(trimmedQuery, selectedItem),
    [trimmedQuery, selectedItem],
  );
  const resultCount = groups.reduce((total, group) => total + group.items.length, 0);

  React.useEffect(() => {
    if (open) {
      setQuery("");
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100%-2rem)] overflow-hidden rounded-lg border bg-popover p-0 shadow-none sm:max-w-xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Search KKB UI catalog</DialogTitle>
          <DialogDescription>
            Jump to preview, design tokens, or an exported @kkb/ui component.
          </DialogDescription>
        </DialogHeader>
        <Command
          shouldFilter={false}
          loop
          className="[&_[cmdk-group-heading]]:text-muted-foreground **:data-[slot=command-input-wrapper]:h-12 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5"
        >
          <CommandInput
            value={query}
            onValueChange={setQuery}
            placeholder="Search component, category, source..."
          />
          <div
            role="status"
            className="border-b px-3 py-2 font-mono text-[11px] text-muted-foreground"
          >
            {trimmedQuery
              ? `${resultCount} ${resultCount === 1 ? "match" : "matches"}`
              : "Pinned views and category browse"}
          </div>
          <CommandList className="max-h-[min(70vh,520px)]">
            {groups.length ? (
              groups.map((group) => (
                <CommandGroup key={group.heading} heading={group.heading}>
                  {group.items.map((item) => (
                    <CatalogCommandItem
                      key={item.id}
                      item={item}
                      selectedItemId={selectedItemId}
                      onSelect={onSelect}
                    />
                  ))}
                </CommandGroup>
              ))
            ) : (
              <div className="py-6 text-center text-sm">No catalog item found.</div>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}

function CatalogCommandItem({
  item,
  selectedItemId,
  onSelect,
}: {
  item: CatalogItem;
  selectedItemId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <CommandItem value={item.id} onSelect={() => onSelect(item.id)} className="py-2.5">
      <CatalogItemIcon item={item} className="size-4" />
      <span className="grid min-w-0 flex-1 gap-0.5">
        <span className="truncate font-mono font-bold">{item.label}</span>
        <span className="truncate font-mono text-[11px] text-muted-foreground">
          {catalogItemMeta(item)}
        </span>
      </span>
      {item.id === selectedItemId ? <Check className="mt-0.5 size-4" /> : null}
      <CommandShortcut className="mt-0.5">{item.kind}</CommandShortcut>
    </CommandItem>
  );
}

export function getCatalogSearchGroups(
  query: string,
  selectedItem: CatalogItem,
): CatalogSearchGroup[] {
  if (!query) {
    return emptySearchGroups(selectedItem);
  }

  const grouped = new Map<string, CatalogItem[]>();

  for (const { item } of rankCatalogSearch(query).slice(0, 24)) {
    const heading = searchResultHeading(item);
    grouped.set(heading, [...(grouped.get(heading) ?? []), item]);
  }

  return [...grouped].map(([heading, items]) => ({ heading, items }));
}

function emptySearchGroups(selectedItem: CatalogItem): CatalogSearchGroup[] {
  const pinned = ["preview", "design-system"]
    .map((id) => allSelectableItems.find((item) => item.id === id))
    .filter((item): item is CatalogItem => Boolean(item));

  const currentCategory =
    selectedItem.category === "Design System"
      ? []
      : itemsForCategory(selectedItem.category).filter(
          (item) => item.kind !== "category" && item.kind !== "view",
        );

  const categoryItems = allSelectableItems.filter((item) => item.kind === "category");

  return [
    { heading: "Pinned", items: pinned },
    {
      heading:
        selectedItem.category === "Design System" ? "Core components" : selectedItem.category,
      items:
        currentCategory.length > 0
          ? currentCategory
          : allSelectableItems
              .filter((item) => item.important && item.kind === "component")
              .slice(0, 10),
    },
    { heading: "Browse categories", items: categoryItems },
  ].filter((group) => group.items.length > 0);
}

function searchResultHeading(item: CatalogItem) {
  switch (item.kind) {
    case "view":
      return "Views";
    case "category":
      return "Categories";
    case "component":
    case "utility":
      return item.category;
  }
}

function catalogItemMeta(item: CatalogItem) {
  if (item.kind === "category") {
    return categoryMeta[item.category].description;
  }

  if (item.kind === "view") {
    return item.source;
  }

  return `${item.category} / ${item.source}`;
}
