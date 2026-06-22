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

import type { CatalogItem } from "./catalog-data";
import { CatalogItemIcon } from "./catalog-icons";
import { searchCatalogItems } from "./catalog-search-index";

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
  const results = React.useMemo(() => searchCatalogItems(query), [query]);

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
          <CommandList className="max-h-[min(70vh,520px)]">
            {results.length ? (
              <CommandGroup heading={query.trim() ? "Results" : "Catalog"}>
                {results.map((item) => (
                  <CatalogCommandItem
                    key={item.id}
                    item={item}
                    selectedItemId={selectedItemId}
                    onSelect={onSelect}
                  />
                ))}
              </CommandGroup>
            ) : (
              <div className="py-6 text-center text-sm">No component found.</div>
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
    <CommandItem value={item.id} onSelect={() => onSelect(item.id)}>
      <CatalogItemIcon item={item} className="size-4" />
      <span className="min-w-0 flex-1 truncate">{item.label}</span>
      {item.id === selectedItemId ? <Check className="size-4" /> : null}
      <CommandShortcut>{item.kind}</CommandShortcut>
    </CommandItem>
  );
}
