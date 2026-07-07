"use client";

import { Button } from "@kkb/ui/components/button";
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
import { useState } from "react";

type CommandGroupData = {
  heading: string;
  items: ReadonlyArray<{
    label: string;
    shortcut: string;
  }>;
};

const commandGroups: ReadonlyArray<CommandGroupData> = [
  {
    heading: "Jump to",
    items: [
      { label: "Layout section", shortcut: "L" },
      { label: "Feedback section", shortcut: "F" },
    ],
  },
  {
    heading: "Actions",
    items: [
      { label: "Duplicate current card", shortcut: "D" },
      { label: "Copy review link", shortcut: "C" },
    ],
  },
] as const;

export function CommandDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-4 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-md bg-muted/20 p-4">
        <div className="space-y-1">
          <p className="text-sm font-medium">Palette launcher</p>
          <p className="text-sm text-muted-foreground">
            Local dialog state keeps the command surface isolated from the route shell.
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>Open command</Button>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        Try opening the palette, then filter local grouped items.
      </div>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Catalog command"
        description="Search local section actions."
      >
        <CommandInput placeholder="Search sections and actions..." />
        <CommandList>
          <CommandEmpty>No matching commands.</CommandEmpty>
          {commandGroups.map((group, index) => (
            <div key={group.heading}>
              {index > 0 ? <CommandSeparator /> : null}
              <CommandGroup heading={group.heading}>
                {group.items.map((item) => (
                  <CommandItem key={item.label} onSelect={() => setOpen(false)}>
                    {item.label}
                    <CommandShortcut>{item.shortcut}</CommandShortcut>
                  </CommandItem>
                ))}
              </CommandGroup>
            </div>
          ))}
        </CommandList>
      </CommandDialog>
    </div>
  );
}
