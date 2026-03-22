"use client";

import { Badge } from "@kkb/ui/components/badge";
import { Button } from "@kkb/ui/components/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@kkb/ui/components/context-menu";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@kkb/ui/components/dropdown-menu";
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarTrigger,
} from "@kkb/ui/components/menubar";
import { useState } from "react";

type AlignmentMode = "grid" | "stack";
type DensityMode = "comfortable" | "compact";

const dropdownActions = [
  { label: "Duplicate card", shortcut: "D" },
  { label: "Pin section", shortcut: "P" },
] as const;

const contextActions = [
  { label: "Rename section" },
  { label: "Copy anchor link" },
  { label: "Mark reviewed" },
] as const;

export function DropdownMenuDemo() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showCounts, setShowCounts] = useState(true);
  const [alignment, setAlignment] = useState<AlignmentMode>("grid");

  return (
    <div className="space-y-4 p-6">
      <div className="space-y-2 rounded-xl border bg-muted/20 p-4">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">Button-triggered actions</p>
          <Badge variant="outline">{alignment}</Badge>
        </div>
        <p className="text-sm leading-6 text-muted-foreground">
          Use dropdowns for compact trigger-adjacent actions, lightweight toggles, and single-value
          view preferences.
        </p>
      </div>

      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            onPointerDown={(event) => {
              if (event.button === 0 && !event.ctrlKey) {
                setMenuOpen((current) => !current);
              }
            }}
          >
            Open menu
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>Catalog controls</DropdownMenuLabel>
          {dropdownActions.map((action) => (
            <DropdownMenuItem key={action.label}>
              {action.label}
              <DropdownMenuShortcut>{action.shortcut}</DropdownMenuShortcut>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem checked={showCounts} onCheckedChange={setShowCounts}>
            Show section counts
          </DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Alignment</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={alignment}
            onValueChange={(value) => setAlignment(value as AlignmentMode)}
          >
            <DropdownMenuRadioItem value="grid">Grid</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="stack">Stack</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <p className="text-sm text-muted-foreground">
        Counts are {showCounts ? "visible" : "hidden"} in {alignment} mode.
      </p>
    </div>
  );
}

export function ContextMenuDemo() {
  const [surfaceState, setSurfaceState] = useState<"ready" | "review">("ready");

  return (
    <div className="p-6">
      <ContextMenu>
        <ContextMenuTrigger className="flex min-h-52 flex-col justify-between rounded-xl border border-dashed bg-background p-4 text-left outline-none">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">Context region</p>
              <Badge variant="outline">{surfaceState}</Badge>
            </div>
            <p className="text-sm leading-6 text-muted-foreground">
              Right click or long press to open a contextual menu attached to the selected surface.
            </p>
          </div>
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            surface specific actions
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-52">
          <ContextMenuLabel>Section surface</ContextMenuLabel>
          {contextActions.map((action) => (
            <ContextMenuItem
              key={action.label}
              onSelect={() =>
                setSurfaceState(action.label === "Mark reviewed" ? "review" : "ready")
              }
            >
              {action.label}
            </ContextMenuItem>
          ))}
          <ContextMenuSeparator />
          <ContextMenuItem inset>
            {surfaceState === "review" ? "Review state active" : "Ready to review"}
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
}

export function MenubarDemo() {
  const [showHints, setShowHints] = useState(true);
  const [density, setDensity] = useState<DensityMode>("comfortable");

  return (
    <div className="space-y-4 p-6">
      <div className="flex flex-wrap items-center gap-3">
        <Badge variant="outline">{density}</Badge>
        <p className="text-sm text-muted-foreground">
          Menubars suit app-like command surfaces with multiple related command groups.
        </p>
      </div>

      <Menubar className="w-full justify-start">
        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent>
            <MenubarCheckboxItem checked={showHints} onCheckedChange={setShowHints}>
              Show hints
            </MenubarCheckboxItem>
            <MenubarSeparator />
            <MenubarRadioGroup
              value={density}
              onValueChange={(value) => setDensity(value as DensityMode)}
            >
              <MenubarRadioItem value="comfortable">Comfortable density</MenubarRadioItem>
              <MenubarRadioItem value="compact">Compact density</MenubarRadioItem>
            </MenubarRadioGroup>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger>Actions</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Duplicate section</MenubarItem>
            <MenubarItem>Export snapshot</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>

      <div className="rounded-xl border bg-muted/20 p-4 text-sm text-muted-foreground">
        Hints are {showHints ? "visible" : "hidden"} with {density} spacing.
      </div>
    </div>
  );
}
