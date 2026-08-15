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
import { CheckIcon } from "@phosphor-icons/react/dist/csr/Check";
import * as React from "react";

import { type CatalogItem, categoryMeta, itemFromId } from "./catalog-data";
import { CatalogItemIcon } from "./catalog-icons";
import { getCatalogSearchGroups } from "./catalog-search-index";

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
  const selectedItem = itemFromId(selectedItemId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100%-2rem)] overflow-hidden border bg-popover p-0 shadow-none sm:max-w-xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Search KKB UI catalog</DialogTitle>
          <DialogDescription>
            Jump to preview, design tokens, a visual component, or a supporting export.
          </DialogDescription>
        </DialogHeader>
        <CatalogSearchSession open={open} selectedItem={selectedItem} onSelect={onSelect} />
      </DialogContent>
    </Dialog>
  );
}

export function CatalogSearchSession({
  open,
  selectedItem,
  onSelect,
}: {
  open: boolean;
  selectedItem: CatalogItem;
  onSelect: (id: string) => void;
}) {
  return (
    <CatalogSearchContent
      key={open ? "open" : "closed"}
      selectedItem={selectedItem}
      onSelect={onSelect}
    />
  );
}

function CatalogSearchContent({
  selectedItem,
  onSelect,
}: {
  selectedItem: CatalogItem;
  onSelect: (id: string) => void;
}) {
  const [query, setQuery] = React.useState("");
  const trimmedQuery = query.trim();
  const groups = React.useMemo(
    () => getCatalogSearchGroups(trimmedQuery, selectedItem),
    [trimmedQuery, selectedItem],
  );
  const resultCount = groups.reduce((total, group) => total + group.items.length, 0);

  return (
    <Command
      shouldFilter={false}
      loop
      className="[&_[cmdk-group-heading]]:text-muted-foreground **:data-[slot=command-input-wrapper]:h-12 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5"
    >
      <CommandInput
        aria-label="Search KKB UI catalog"
        value={query}
        onValueChange={setQuery}
        placeholder="Search component, category, source..."
      />
      <div role="status" className="border-b px-3 py-2 font-mono text-[11px] text-muted-foreground">
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
                  selectedItemId={selectedItem.id}
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
      <CatalogItemIcon item={item} className="size-5" />
      <span className="grid min-w-0 flex-1 gap-0.5">
        <span className="truncate font-mono font-bold">{item.label}</span>
        <span className="truncate font-mono text-[11px] text-muted-foreground">
          {catalogItemMeta(item)}
        </span>
      </span>
      {item.id === selectedItemId ? (
        <>
          <CheckIcon
            aria-hidden="true"
            className="mt-0.5 size-5"
            focusable="false"
            weight="regular"
          />
          <span className="sr-only">Current catalog item</span>
        </>
      ) : null}
      <CommandShortcut className="mt-0.5">{item.entryType}</CommandShortcut>
    </CommandItem>
  );
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
