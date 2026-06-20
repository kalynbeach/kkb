import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@kkb/ui/components/command";
import { Check } from "lucide-react";

import { allSelectableItems, type CatalogItem, groupedItems } from "./catalog-data";
import { CatalogItemIcon } from "./catalog-icons";

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
  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Search KKB UI catalog"
      description="Jump to preview, design tokens, or an exported @kkb/ui component."
      className="max-w-[calc(100%-2rem)] rounded-lg border bg-popover p-0 shadow-none sm:max-w-xl"
    >
      <CommandInput placeholder="Search component, category, source..." />
      <CommandList className="max-h-[min(70vh,520px)]">
        <CommandEmpty>No component found.</CommandEmpty>
        <CommandGroup heading="Views">
          {allSelectableItems
            .filter((item) => item.kind === "view")
            .map((item) => (
              <CatalogCommandItem
                key={item.id}
                item={item}
                selectedItemId={selectedItemId}
                onSelect={onSelect}
              />
            ))}
        </CommandGroup>
        <CommandSeparator />
        {groupedItems().map(({ category, items }) => (
          <CommandGroup key={category} heading={category}>
            {items.map((item) => (
              <CatalogCommandItem
                key={item.id}
                item={item}
                selectedItemId={selectedItemId}
                onSelect={onSelect}
              />
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
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
    <CommandItem
      value={[item.label, item.id, item.source, ...item.keywords].join(" ")}
      onSelect={() => onSelect(item.id)}
    >
      <CatalogItemIcon item={item} className="size-4" />
      <span className="min-w-0 flex-1 truncate">{item.label}</span>
      {item.id === selectedItemId ? <Check className="size-4" /> : null}
      <CommandShortcut>{item.kind}</CommandShortcut>
    </CommandItem>
  );
}
