"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@kkb/ui/components/alert-dialog";
import { Badge } from "@kkb/ui/components/badge";
import { Button } from "@kkb/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@kkb/ui/components/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@kkb/ui/components/drawer";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@kkb/ui/components/hover-card";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
} from "@kkb/ui/components/popover";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@kkb/ui/components/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@kkb/ui/components/tooltip";
import { useState } from "react";

export function DialogSheetDemo() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <div className="grid gap-4 p-6 lg:grid-cols-2">
      <div className="space-y-4 rounded-xl border bg-muted/20 p-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">Modal dialog</p>
            <Badge variant="outline">{dialogOpen ? "open" : "closed"}</Badge>
          </div>
          <p className="text-sm leading-6 text-muted-foreground">
            Use blocking confirmation flows when the next step needs explicit acknowledgement.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <Button onClick={() => setDialogOpen(true)}>Open dialog</Button>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Publish overlay card</DialogTitle>
              <DialogDescription>
                Keep the route server-owned and hydrate only the isolated overlay surface.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter showCloseButton>
              <Button onClick={() => setDialogOpen(false)}>Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4 rounded-xl border bg-muted/20 p-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">Side sheet</p>
            <Badge variant="outline">{sheetOpen ? "open" : "closed"}</Badge>
          </div>
          <p className="text-sm leading-6 text-muted-foreground">
            Sheets keep supporting controls close without interrupting the main canvas.
          </p>
        </div>
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <Button variant="outline" onClick={() => setSheetOpen(true)}>
            Open sheet
          </Button>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Inspector rail</SheetTitle>
              <SheetDescription>
                Store secondary settings in a dismissible side panel.
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-3 px-4">
              <div className="rounded-lg border px-3 py-2 text-sm">Spacing tokens</div>
              <div className="rounded-lg border px-3 py-2 text-sm">Motion presets</div>
              <div className="rounded-lg border px-3 py-2 text-sm">Review checklist</div>
            </div>
            <SheetFooter>
              <Button variant="outline" onClick={() => setSheetOpen(false)}>
                Close panel
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

export function AlertDialogDrawerDemo() {
  const [alertOpen, setAlertOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="grid gap-4 p-6 lg:grid-cols-2">
      <div className="space-y-4 rounded-xl border bg-muted/20 p-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">Alert dialog</p>
            <Badge variant="outline">{alertOpen ? "armed" : "idle"}</Badge>
          </div>
          <p className="text-sm leading-6 text-muted-foreground">
            Reserve destructive confirmation for actions that can’t be undone.
          </p>
        </div>
        <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
          <Button variant="destructive" onClick={() => setAlertOpen(true)}>
            Archive section
          </Button>
          <AlertDialogContent size="sm">
            <AlertDialogHeader>
              <AlertDialogTitle>Archive overlay demos?</AlertDialogTitle>
              <AlertDialogDescription>
                This removes the section from the catalog until the next build.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction variant="destructive">Archive</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="space-y-4 rounded-xl border bg-muted/20 p-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">Mobile drawer</p>
            <Badge variant="outline">{drawerOpen ? "expanded" : "collapsed"}</Badge>
          </div>
          <p className="text-sm leading-6 text-muted-foreground">
            Drawers work well for stacked actions on narrower screens and touch flows.
          </p>
        </div>
        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
          <Button variant="secondary" onClick={() => setDrawerOpen(true)}>
            Open drawer
          </Button>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Quick actions</DrawerTitle>
              <DrawerDescription>
                Keep compact follow-up actions in a bottom-attached mobile surface.
              </DrawerDescription>
            </DrawerHeader>
            <div className="grid gap-2 px-4">
              <div className="rounded-lg border px-3 py-2 text-sm">Duplicate card</div>
              <div className="rounded-lg border px-3 py-2 text-sm">Mark reviewed</div>
              <div className="rounded-lg border px-3 py-2 text-sm">Share preview</div>
            </div>
            <DrawerFooter>
              <Button variant="outline" onClick={() => setDrawerOpen(false)}>
                Close drawer
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}

export function PopoverHoverCardTooltipDemo() {
  const [popoverOpen, setPopoverOpen] = useState(false);

  return (
    <TooltipProvider>
      <div className="grid gap-4 p-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="space-y-4 rounded-xl border bg-muted/20 p-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">Popover</p>
              <Badge variant="outline">{popoverOpen ? "open" : "closed"}</Badge>
            </div>
            <p className="text-sm leading-6 text-muted-foreground">
              Small contextual surfaces fit filters, metadata, and quick secondary controls.
            </p>
          </div>
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <Button variant="outline" onClick={() => setPopoverOpen(true)}>
              Open popover
            </Button>
            <PopoverContent align="start">
              <PopoverHeader>
                <PopoverTitle>Card density</PopoverTitle>
                <PopoverDescription>
                  Use compact overlays for lightweight adjustments that stay near the trigger.
                </PopoverDescription>
              </PopoverHeader>
            </PopoverContent>
          </Popover>
        </div>

        <div className="grid gap-3 rounded-xl border bg-muted/20 p-4">
          <HoverCard openDelay={120} closeDelay={120}>
            <HoverCardTrigger asChild>
              <Button variant="secondary">Preview hover card</Button>
            </HoverCardTrigger>
            <HoverCardContent align="start" className="space-y-2">
              <p className="text-sm font-medium">Overlay release note</p>
              <p className="text-sm leading-6 text-muted-foreground">
                Hover cards are useful for glanceable metadata without taking over the page.
              </p>
            </HoverCardContent>
          </HoverCard>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" className="justify-start">
                Focus tooltip target
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Short helper copy belongs in a tooltip.</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}
