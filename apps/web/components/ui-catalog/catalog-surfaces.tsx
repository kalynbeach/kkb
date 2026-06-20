"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@kkb/ui/components/accordion";
import { Alert, AlertDescription, AlertTitle } from "@kkb/ui/components/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@kkb/ui/components/alert-dialog";
import { AspectRatio } from "@kkb/ui/components/aspect-ratio";
import { Avatar, AvatarFallback, AvatarImage } from "@kkb/ui/components/avatar";
import { Badge } from "@kkb/ui/components/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@kkb/ui/components/breadcrumb";
import { Button } from "@kkb/ui/components/button";
import { ButtonGroup } from "@kkb/ui/components/button-group";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@kkb/ui/components/card";
import { Checkbox } from "@kkb/ui/components/checkbox";
import { Code } from "@kkb/ui/components/code";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@kkb/ui/components/collapsible";
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@kkb/ui/components/combobox";
import { Command, CommandInput, CommandItem, CommandList } from "@kkb/ui/components/command";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@kkb/ui/components/context-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@kkb/ui/components/dialog";
import { DirectionProvider } from "@kkb/ui/components/direction";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@kkb/ui/components/drawer";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@kkb/ui/components/dropdown-menu";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@kkb/ui/components/empty";
import { Field, FieldContent, FieldDescription, FieldLabel } from "@kkb/ui/components/field";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@kkb/ui/components/hover-card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@kkb/ui/components/input-group";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@kkb/ui/components/input-otp";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@kkb/ui/components/item";
import { Kbd, KbdGroup } from "@kkb/ui/components/kbd";
import { Label } from "@kkb/ui/components/label";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@kkb/ui/components/menubar";
import { ModeToggle } from "@kkb/ui/components/mode-toggle";
import { NativeSelect, NativeSelectOption } from "@kkb/ui/components/native-select";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@kkb/ui/components/navigation-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@kkb/ui/components/pagination";
import { Popover, PopoverContent, PopoverTrigger } from "@kkb/ui/components/popover";
import { Progress } from "@kkb/ui/components/progress";
import { RadioGroup, RadioGroupItem } from "@kkb/ui/components/radio-group";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@kkb/ui/components/resizable";
import { ScrollArea } from "@kkb/ui/components/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@kkb/ui/components/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@kkb/ui/components/sheet";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@kkb/ui/components/sidebar";
import { Skeleton } from "@kkb/ui/components/skeleton";
import { Slider } from "@kkb/ui/components/slider";
import { Toaster } from "@kkb/ui/components/sonner";
import { Spinner } from "@kkb/ui/components/spinner";
import { Switch } from "@kkb/ui/components/switch";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@kkb/ui/components/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@kkb/ui/components/tabs";
import { Textarea } from "@kkb/ui/components/textarea";
import { Toggle } from "@kkb/ui/components/toggle";
import { ToggleGroup, ToggleGroupItem } from "@kkb/ui/components/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@kkb/ui/components/tooltip";
import { cn } from "@kkb/ui/lib/utils";
import {
  Bell,
  Boxes,
  ChevronRight,
  CircleAlert,
  Component,
  Grid2X2,
  Search,
  X,
} from "lucide-react";
import * as React from "react";

import {
  type CatalogCategory,
  type CatalogItem,
  categoryMeta,
  componentItems,
  focusedIntent,
  itemFromId,
  relatedItems,
  sourceInstruction,
  utilityItems,
} from "./catalog-data";
import { CatalogItemIcon } from "./catalog-icons";
import {
  AudioCompositionDemo,
  PlayerControlsDemo,
  PlayheadDemo,
  WaveformDemo,
} from "./demos/audio-demo";
import { CarouselDemo } from "./demos/carousel-demo";
import { CalendarDemo } from "./demos/select-calendar-demo";
import { AudioSection } from "./sections/audio-section";
import { DataSection } from "./sections/data-section";
import { FeedbackSection } from "./sections/feedback-section";
import { InputSection } from "./sections/input-section";
import { LayoutSection } from "./sections/layout-section";
import { MenuSection } from "./sections/menu-section";
import { NavigationSection } from "./sections/navigation-section";
import { OverlaySection } from "./sections/overlay-section";

const chartData = [
  { month: "Jan", value: 52 },
  { month: "Feb", value: 86 },
  { month: "Mar", value: 68 },
  { month: "Apr", value: 44 },
  { month: "May", value: 72 },
] as const;

const exportItems = [...componentItems, ...utilityItems];
const categoryTokenRows = Object.entries(categoryMeta).map(
  ([label, meta]) => [label, meta.description] as const,
);

export function CatalogSurface({
  selectedItem,
  onSelect,
}: {
  selectedItem: CatalogItem;
  onSelect: (id: string) => void;
}) {
  if (selectedItem.id === "preview") {
    return <PreviewSurface onSelect={onSelect} />;
  }

  if (selectedItem.id === "design-system") {
    return <DesignSystemSurface />;
  }

  if (selectedItem.id.startsWith("category-")) {
    return <CategorySurface item={selectedItem} />;
  }

  return <FocusedComponentSurface item={selectedItem} onSelect={onSelect} />;
}

function PreviewSurface({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <div className="bg-background">
      <div className="flex min-h-12 flex-wrap items-center justify-between gap-2 border-b px-3 py-2">
        <div className="flex min-w-0 items-center gap-2">
          <p className="font-mono text-sm font-semibold">Preview</p>
          <Badge variant="outline">{exportItems.length} exports</Badge>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={() => onSelect("design-system")}>
          Inspect tokens
        </Button>
      </div>

      <div className="grid auto-rows-min gap-px bg-border md:grid-cols-6">
        <PreviewPanel title="Actions" className="md:col-span-3">
          <ActionBench />
        </PreviewPanel>
        <PreviewPanel title="Fields" className="md:col-span-3">
          <FieldBench />
        </PreviewPanel>
        <PreviewPanel title="Navigation" className="md:col-span-3">
          <NavigationBench />
        </PreviewPanel>
        <PreviewPanel title="Data" className="md:col-span-3">
          <DataBench />
        </PreviewPanel>
        <PreviewPanel title="Feedback" className="md:col-span-2">
          <FeedbackBench />
        </PreviewPanel>
        <PreviewPanel title="Overlays" className="md:col-span-2">
          <OverlayBench />
        </PreviewPanel>
        <PreviewPanel title="Menus" className="md:col-span-2">
          <MenuBench />
        </PreviewPanel>
        <PreviewPanel title="Layout" className="md:col-span-3">
          <LayoutBench />
        </PreviewPanel>
        <PreviewPanel title="Audio" className="md:col-span-3">
          <AudioBench />
        </PreviewPanel>
        <PreviewPanel title="Design tokens" className="md:col-span-2">
          <TokenBench onSelect={onSelect} />
        </PreviewPanel>
        <PreviewPanel title="Export wall" className="md:col-span-4">
          <ExportWall onSelect={onSelect} />
        </PreviewPanel>
      </div>
    </div>
  );
}

function PreviewPanel({
  title,
  className,
  children,
}: {
  title: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("min-w-0 bg-background", className)}>
      <div className="flex min-h-9 items-center justify-between border-b px-3">
        <h2 className="font-mono text-xs font-semibold text-muted-foreground">{title}</h2>
      </div>
      <div className="p-3">{children}</div>
    </section>
  );
}

function ActionBench() {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Button>Run checks</Button>
        <Button variant="secondary">Save note</Button>
        <Button variant="outline">Open route</Button>
        <Button variant="ghost">Keep editing</Button>
      </div>
      <ButtonGroup>
        <Button variant="outline">Source</Button>
        <Button variant="outline">States</Button>
        <Button variant="outline">Tokens</Button>
      </ButtonGroup>
      <div className="flex flex-wrap items-center gap-2">
        <Toggle defaultPressed>
          <Grid2X2 className="size-4" />
          Grid
        </Toggle>
        <ToggleGroup type="multiple" defaultValue={["labels"]}>
          <ToggleGroupItem value="labels">Labels</ToggleGroupItem>
          <ToggleGroupItem value="stats">Stats</ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
}

function FieldBench() {
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      <div className="space-y-3">
        <InputGroup>
          <InputGroupAddon>
            <Search className="size-4" />
            <InputGroupText>Filter</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput defaultValue="audio waveform" />
          <InputGroupAddon align="inline-end">
            <InputGroupButton size="icon-xs" variant="ghost" aria-label="Clear filter">
              <X className="size-3" />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        <Textarea defaultValue="Favor shared primitives before app-local patterns." />
        <Combobox items={["button", "audio waveform", "table"]}>
          <ComboboxInput placeholder="Primitive or bay" />
          <ComboboxContent>
            <ComboboxList>
              {["button", "audio waveform", "table"].map((value) => (
                <ComboboxItem key={value} value={value}>
                  {value}
                </ComboboxItem>
              ))}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>
      <div className="space-y-3">
        <Select defaultValue="preview">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="stable">Stable</SelectItem>
            <SelectItem value="preview">Preview</SelectItem>
          </SelectContent>
        </Select>
        <NativeSelect defaultValue="compact" aria-label="Density">
          <NativeSelectOption value="compact">Compact</NativeSelectOption>
          <NativeSelectOption value="roomy">Roomy</NativeSelectOption>
        </NativeSelect>
        <div className="grid gap-3 border p-3">
          <Field orientation="horizontal">
            <Checkbox id="preview-audit" defaultChecked />
            <FieldContent>
              <FieldLabel htmlFor="preview-audit">Run audit</FieldLabel>
              <FieldDescription>Keyboard and contrast pass.</FieldDescription>
            </FieldContent>
          </Field>
          <RadioGroup defaultValue="stable" className="gap-2">
            <div className="flex items-center gap-2 text-sm">
              <RadioGroupItem id="preview-stable" value="stable" />
              <Label htmlFor="preview-stable">Ship-ready</Label>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <RadioGroupItem id="preview-review" value="review" />
              <Label htmlFor="preview-review">Needs review</Label>
            </div>
          </RadioGroup>
          <Switch id="preview-sticky" defaultChecked aria-label="Sticky rail" />
          <Slider defaultValue={[72]} max={100} aria-label="Density" />
        </div>
      </div>
    </div>
  );
}

function NavigationBench() {
  return (
    <div className="space-y-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>UI</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Tabs defaultValue="preview">
        <TabsList>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="tokens">Tokens</TabsTrigger>
          <TabsTrigger value="audio">Audio</TabsTrigger>
        </TabsList>
        <TabsContent value="preview" className="border p-3 text-sm">
          Dense component wall.
        </TabsContent>
        <TabsContent value="tokens" className="border p-3 text-sm">
          Live token specimens.
        </TabsContent>
        <TabsContent value="audio" className="border p-3 text-sm">
          Instrument bay.
        </TabsContent>
      </Tabs>
      <div className="flex flex-wrap items-center gap-3">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Catalog</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="w-64 p-3">
                  <NavigationMenuLink className="block rounded-md p-2 text-sm hover:bg-accent">
                    Components
                  </NavigationMenuLink>
                  <NavigationMenuLink className="block rounded-md p-2 text-sm hover:bg-accent">
                    Tokens
                  </NavigationMenuLink>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

function DataBench() {
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_180px]">
      <Table>
        <TableCaption>Catalog implementation matrix.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Primitive</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {["Table", "Code", "Kbd"].map((name) => (
            <TableRow key={name}>
              <TableCell>{name}</TableCell>
              <TableCell>covered</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="space-y-3">
        <p className="text-sm">
          Import <Code>@kkb/ui/components/table</Code>
        </p>
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
        <div className="flex h-24 items-end gap-1 border bg-muted/20 p-3" aria-label="Chart">
          {chartData.map((bar) => (
            <div key={bar.month} className="flex flex-1 flex-col items-center gap-1">
              <div className="w-full bg-foreground" style={{ height: `${bar.value}%` }} />
              <span className="font-mono text-[10px] text-muted-foreground">{bar.month}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FeedbackBench() {
  return (
    <div className="space-y-3">
      <Alert>
        <CircleAlert className="size-4" />
        <AlertTitle>Coverage ready</AlertTitle>
        <AlertDescription>Every public export has a catalog path.</AlertDescription>
      </Alert>
      <div className="flex flex-wrap items-center gap-2">
        <Badge>stable</Badge>
        <Badge variant="secondary">preview</Badge>
        <Badge variant="outline">token</Badge>
        <Avatar>
          <AvatarImage src="" alt="" />
          <AvatarFallback>KB</AvatarFallback>
        </Avatar>
        <Spinner className="size-4" />
      </div>
      <Progress value={78} />
      <div className="space-y-2">
        <Skeleton className="h-4 w-44" />
        <Skeleton className="h-16 w-full" />
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}

function OverlayBench() {
  return (
    <TooltipProvider>
      <div className="flex flex-wrap gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Inspect component</DialogTitle>
              <DialogDescription>Focused modal example.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button>Done</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline">Alert</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reset demo state?</AlertDialogTitle>
              <AlertDialogDescription>This only affects the preview.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Reset</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">Sheet</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Component metadata</SheetTitle>
              <SheetDescription>Source, category, and states.</SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline">Drawer</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Mobile tray</DrawerTitle>
              <DrawerDescription>Bottom-mounted support surface.</DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <Button>Close</Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Popover</Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <p className="text-sm">Tune density and component state.</p>
          </PopoverContent>
        </Popover>
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="outline">Hover card</Button>
          </HoverCardTrigger>
          <HoverCardContent>
            <p className="text-sm">Preview metadata without leaving flow.</p>
          </HoverCardContent>
        </HoverCard>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon">
              <Bell className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Notification state</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}

function MenuBench() {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Dropdown</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Catalog</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Copy import</DropdownMenuItem>
            <DropdownMenuCheckboxItem checked>Show tokens</DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                Copy source <MenubarShortcut>⌘C</MenubarShortcut>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Open docs</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
      <ContextMenu>
        <ContextMenuTrigger className="grid h-20 place-items-center border border-dashed text-sm text-muted-foreground">
          Right click surface
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>
            Open focused view<ContextMenuShortcut>↵</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem>Copy source</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <Command className="rounded-md border">
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandItem>Button</CommandItem>
          <CommandItem>Dialog</CommandItem>
        </CommandList>
      </Command>
    </div>
  );
}

function LayoutBench() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Release surface</CardTitle>
          <CardDescription>Hard-edged KKB panel.</CardDescription>
          <CardAction>
            <Badge>ready</Badge>
          </CardAction>
        </CardHeader>
        <CardContent>
          <AspectRatio ratio={16 / 7}>
            <div className="grid size-full place-items-center border bg-muted/30 font-mono text-sm">
              16:7 frame
            </div>
          </AspectRatio>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            Action
          </Button>
        </CardFooter>
      </Card>
      <div className="space-y-3">
        <ScrollArea className="h-28 border">
          <ItemGroup>
            {["Preview", "Tokens", "Button"].map((label, index) => (
              <React.Fragment key={label}>
                <Item size="sm">
                  <ItemMedia variant="icon">
                    <Component className="size-4" />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>{label}</ItemTitle>
                    <ItemDescription>Catalog entry</ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <Badge variant="outline">{index + 1}</Badge>
                  </ItemActions>
                </Item>
                {index < 2 ? <ItemSeparator /> : null}
              </React.Fragment>
            ))}
          </ItemGroup>
        </ScrollArea>
        <ResizablePanelGroup className="min-h-24 rounded-md border">
          <ResizablePanel defaultSize={45} className="grid place-items-center text-sm">
            rail
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={55} className="grid place-items-center text-sm">
            canvas
          </ResizablePanel>
        </ResizablePanelGroup>
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Boxes className="size-4" />
            </EmptyMedia>
            <EmptyTitle>No variant selected</EmptyTitle>
            <EmptyDescription>Select a component to inspect.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    </div>
  );
}

function AudioBench() {
  return (
    <div className="grid gap-3 xl:grid-cols-2">
      <WaveformDemo />
      <PlayerControlsDemo />
    </div>
  );
}

function TokenBench({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        {[
          ["background", "bg-background text-foreground"],
          ["foreground", "bg-foreground text-background"],
          ["primary", "bg-primary text-primary-foreground"],
          ["muted", "bg-muted text-muted-foreground"],
          ["border", "bg-border text-foreground"],
          ["audio", "bg-audio-accent text-primary"],
        ].map(([label, className]) => (
          <button
            key={label}
            type="button"
            onClick={() => onSelect("design-system")}
            className={cn("min-h-16 border p-3 text-left font-mono text-xs", className)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        <p className="font-mono text-lg font-semibold tracking-[-0.02em]">TX-02 heading</p>
        <p className="text-sm leading-6 text-muted-foreground">
          Geist carries longer explanatory copy with stable rhythm.
        </p>
      </div>
    </div>
  );
}

function ExportWall({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <div className="grid gap-1 sm:grid-cols-2 xl:grid-cols-3">
      {exportItems.map((item) => (
        <article
          key={item.id}
          className="grid min-h-24 grid-cols-[minmax(0,1fr)_auto] items-start gap-3 border bg-background p-3"
        >
          <span className="min-w-0">
            <span className="block truncate font-mono text-xs font-semibold">{item.label}</span>
            <span className="mt-1 block font-mono text-[10px] text-muted-foreground">
              {item.category}
            </span>
            <button
              type="button"
              onClick={() => onSelect(item.id)}
              aria-label={`Open ${item.label}`}
              className="mt-3 font-mono text-[10px] text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              Open
            </button>
          </span>
          <span className="grid min-h-9 min-w-12 place-items-center">
            {renderTinyPreview(item.id)}
          </span>
        </article>
      ))}
    </div>
  );
}

function SurfaceHeader({ item, action }: { item: CatalogItem; action?: React.ReactNode }) {
  return (
    <div className="grid gap-3 bg-background px-4 py-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-muted-foreground">
          <span>{item.category}</span>
          <ChevronRight className="size-3" />
          <span>{item.kind}</span>
        </div>
        <h2 className="mt-1 truncate font-mono text-xl font-semibold tracking-[-0.02em]">
          {item.label}
        </h2>
      </div>
      {action}
    </div>
  );
}

function FocusedComponentSurface({
  item,
  onSelect,
}: {
  item: CatalogItem;
  onSelect: (id: string) => void;
}) {
  return (
    <div>
      <SurfaceHeader
        item={item}
        action={
          <Code className="max-w-full break-all whitespace-normal text-[11px]">
            {sourceInstruction(item)}
          </Code>
        }
      />
      <div className="border-t bg-muted/20 p-3 md:p-4">
        <div className="grid gap-4 md:grid-cols-2">{renderFocusedExamples(item)}</div>
      </div>
      <FocusedMetadata item={item} onSelect={onSelect} />
    </div>
  );
}

function FocusedMetadata({
  item,
  onSelect,
}: {
  item: CatalogItem;
  onSelect: (id: string) => void;
}) {
  const related = relatedItems(item);

  return (
    <div className="grid gap-px border-t bg-border md:grid-cols-[minmax(0,1fr)_minmax(240px,0.45fr)]">
      <div className="bg-background p-4">
        <p className="font-mono text-xs text-muted-foreground">intent</p>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          {focusedIntent(item)}
        </p>
      </div>
      <div className="bg-background p-4">
        <p className="font-mono text-xs text-muted-foreground">related</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {related.map((relatedItem) => (
            <Button
              key={relatedItem.id}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onSelect(relatedItem.id)}
            >
              {relatedItem.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

function CategorySurface({ item }: { item: CatalogItem }) {
  if (item.category === "Audio") {
    return <InstrumentCategorySurface item={item} />;
  }

  return (
    <div>
      <SurfaceHeader item={item} />
      <div className="border-t bg-muted/20 p-3 md:p-4">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {renderCategory(item.category)}
        </div>
      </div>
    </div>
  );
}

function InstrumentCategorySurface({ item }: { item: CatalogItem }) {
  return (
    <div>
      <div className="grid gap-4 border-b border-audio-panel-border bg-[linear-gradient(180deg,var(--audio-panel-start),var(--audio-panel-mid),var(--audio-panel-end))] p-4 text-audio-title md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
        <div className="min-w-0">
          <p className="truncate font-mono text-xs text-audio-meta">{item.source}</p>
          <h2 className="mt-1 font-mono text-xl font-semibold tracking-[-0.02em]">{item.label}</h2>
        </div>
        <Badge variant="outline" className="border-audio-panel-border text-audio-accent-muted">
          audio blue scoped
        </Badge>
      </div>
      <div className="bg-muted/20 p-3 md:p-4">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {renderCategory(item.category)}
        </div>
      </div>
    </div>
  );
}

function renderCategory(category: CatalogCategory) {
  switch (category) {
    case "Layout":
      return <LayoutSection />;
    case "Navigation":
      return <NavigationSection />;
    case "Input":
      return <InputSection />;
    case "Feedback":
      return <FeedbackSection />;
    case "Overlay":
      return <OverlaySection />;
    case "Menu":
      return <MenuSection />;
    case "Data":
      return <DataSection />;
    case "Audio":
      return <AudioSection />;
    case "Utilities":
      return <UtilitiesExamples />;
    case "Design System":
      return <DesignSystemCards />;
  }
}

function renderFocusedExamples(item: CatalogItem) {
  return (
    <DemoBoundary resetKey={item.id}>
      {item.category === "Audio" ? <FocusedAudioExamples item={item} /> : focusedExamplesFor(item)}
    </DemoBoundary>
  );
}

function focusedExamplesFor(item: CatalogItem) {
  switch (item.id) {
    case "accordion":
    case "collapsible":
      return <DisclosureExamples />;
    case "alert-dialog":
    case "dialog":
    case "drawer":
    case "sheet":
    case "popover":
    case "hover-card":
    case "tooltip":
      return <OverlayExamples />;
    case "button":
    case "button-group":
    case "toggle":
    case "toggle-group":
      return <ActionExamples />;
    case "input":
    case "input-group":
    case "input-otp":
    case "select":
    case "native-select":
    case "combobox":
    case "checkbox":
    case "radio-group":
    case "switch":
    case "slider":
    case "textarea":
    case "field":
    case "form":
    case "label":
      return <InputExamples />;
    case "table":
    case "chart":
    case "code":
    case "kbd":
    case "carousel":
    case "json-render":
    case "json-render-catalog":
    case "json-render-registry":
      return <DataExamples />;
    case "sidebar":
    case "navigation-menu":
    case "breadcrumb":
    case "tabs":
    case "pagination":
      return <NavigationExamples />;
    case "card":
    case "aspect-ratio":
    case "empty":
    case "item":
    case "resizable":
    case "scroll-area":
    case "separator":
      return <LayoutExamples />;
    case "alert":
    case "avatar":
    case "badge":
    case "progress":
    case "skeleton":
    case "sonner":
    case "spinner":
      return <FeedbackExamples />;
    case "command":
    case "context-menu":
    case "dropdown-menu":
    case "menubar":
      return <MenuExamples />;
    case "direction":
    case "mode-toggle":
    case "theme-provider":
    case "use-mobile":
      return <UtilitiesExamples />;
    default:
      return (
        <SpecimenStage title={item.label}>
          <div className="grid min-h-40 place-items-center">{renderTinyPreview(item.id)}</div>
        </SpecimenStage>
      );
  }
}

function FocusedAudioExamples({ item }: { item: CatalogItem }) {
  if (item.id === "audio-playhead") {
    return (
      <SpecimenStage title="Playhead">
        <PlayheadDemo />
      </SpecimenStage>
    );
  }

  if (item.id === "audio-player-controls") {
    return (
      <SpecimenStage title="Player controls">
        <PlayerControlsDemo />
      </SpecimenStage>
    );
  }

  if (item.id === "audio-waveform") {
    return (
      <SpecimenStage title="Waveform">
        <WaveformDemo />
      </SpecimenStage>
    );
  }

  return (
    <>
      <SpecimenStage title="Waveform">
        <WaveformDemo />
      </SpecimenStage>
      <SpecimenStage title="Player composition">
        <AudioCompositionDemo />
      </SpecimenStage>
    </>
  );
}

type DemoBoundaryProps = {
  resetKey: string;
  children: React.ReactNode;
};

type DemoBoundaryState = {
  hasError: boolean;
};

class DemoBoundary extends React.Component<DemoBoundaryProps, DemoBoundaryState> {
  state: DemoBoundaryState = { hasError: false };

  static getDerivedStateFromError(): DemoBoundaryState {
    return { hasError: true };
  }

  componentDidUpdate(previousProps: DemoBoundaryProps) {
    if (previousProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <SpecimenStage title="Demo unavailable">
          <div className="min-h-40 border border-dashed p-4 text-sm text-muted-foreground">
            This demo failed in isolation. The catalog remains usable; open another component or
            inspect the console for the failing specimen.
          </div>
        </SpecimenStage>
      );
    }

    return this.props.children;
  }
}

function SpecimenStage({
  title,
  description,
  className,
  children,
}: {
  title: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("min-w-0 border bg-background", className)}>
      <header className="border-b px-3 py-2">
        <h3 className="font-mono text-sm font-semibold">{title}</h3>
        {description ? (
          <p className="mt-1 text-sm leading-5 text-muted-foreground">{description}</p>
        ) : null}
      </header>
      <div className="p-4">{children}</div>
    </section>
  );
}

function ActionExamples() {
  return (
    <>
      <SpecimenStage title="Variants and sizes">
        <div className="flex flex-wrap items-center gap-2">
          <Button>Default</Button>
          <Button size="sm">Small</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button disabled>Disabled</Button>
        </div>
      </SpecimenStage>
      <SpecimenStage title="Toolbar">
        <ActionBench />
      </SpecimenStage>
    </>
  );
}

function InputExamples() {
  return (
    <>
      <SpecimenStage title="Settings form">
        <FieldBench />
      </SpecimenStage>
      <SpecimenStage title="Structured entry">
        <div className="space-y-4">
          <InputOTP maxLength={6}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <CalendarDemo />
        </div>
      </SpecimenStage>
    </>
  );
}

function LayoutExamples() {
  return (
    <>
      <SpecimenStage title="Panel primitives">
        <LayoutBench />
      </SpecimenStage>
      <SpecimenStage title="Aspect ratio">
        <AspectRatio ratio={16 / 7}>
          <div className="grid size-full place-items-center border bg-muted/30 font-mono text-sm">
            16:7 frame
          </div>
        </AspectRatio>
      </SpecimenStage>
    </>
  );
}

function NavigationExamples() {
  return (
    <>
      <SpecimenStage title="Route shell">
        <NavigationBench />
      </SpecimenStage>
      <SpecimenStage title="Sidebar">
        <div className="h-64 overflow-hidden border">
          <SidebarProvider defaultOpen className="min-h-0">
            <Sidebar collapsible="none">
              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupLabel>Catalog</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {["Preview", "Tokens", "Components"].map((label) => (
                        <SidebarMenuItem key={label}>
                          <SidebarMenuButton>
                            <Component />
                            <span>{label}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
            </Sidebar>
            <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
              canvas
            </div>
          </SidebarProvider>
        </div>
      </SpecimenStage>
    </>
  );
}

function DisclosureExamples() {
  return (
    <>
      <SpecimenStage title="Accordion">
        <Accordion type="single" collapsible defaultValue="one">
          <AccordionItem value="one">
            <AccordionTrigger>What does Preview show?</AccordionTrigger>
            <AccordionContent>Every public @kkb/ui component export.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="two">
            <AccordionTrigger>What does search include?</AccordionTrigger>
            <AccordionContent>
              Views, categories, components, utilities, and source paths.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </SpecimenStage>
      <SpecimenStage title="Collapsible">
        <Collapsible defaultOpen>
          <div className="flex items-center justify-between gap-4">
            <p className="font-mono text-sm">Implementation notes</p>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                Toggle
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="pt-3 text-sm leading-6 text-muted-foreground">
            Keep demo islands focused and use shared primitives.
          </CollapsibleContent>
        </Collapsible>
      </SpecimenStage>
    </>
  );
}

function OverlayExamples() {
  return (
    <>
      <SpecimenStage title="Modal family">
        <OverlayBench />
      </SpecimenStage>
      <SpecimenStage title="Contextual overlay">
        <TooltipProvider>
          <div className="flex flex-wrap gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">Popover</Button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <p className="text-sm">Tune density and component state.</p>
              </PopoverContent>
            </Popover>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <Bell className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Notification state</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </SpecimenStage>
    </>
  );
}

function FeedbackExamples() {
  return (
    <>
      <SpecimenStage title="Status stack">
        <FeedbackBench />
      </SpecimenStage>
      <SpecimenStage title="Error state">
        <Alert variant="destructive">
          <CircleAlert className="size-4" />
          <AlertTitle>Browser verification failed</AlertTitle>
          <AlertDescription>
            Re-run the focused browser check after fixing overflow or clipped overlay findings.
          </AlertDescription>
        </Alert>
      </SpecimenStage>
    </>
  );
}

function MenuExamples() {
  return (
    <>
      <SpecimenStage title="Menu surfaces">
        <MenuBench />
      </SpecimenStage>
      <SpecimenStage title="Command pattern">
        <Command className="rounded-md border">
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandItem>Button</CommandItem>
            <CommandItem>Dialog</CommandItem>
          </CommandList>
        </Command>
      </SpecimenStage>
    </>
  );
}

function DataExamples() {
  return (
    <>
      <SpecimenStage title="Table, code, keyboard">
        <DataBench />
      </SpecimenStage>
      <SpecimenStage title="Chart and carousel">
        <div className="space-y-6">
          <div
            className="flex h-44 items-end gap-2 border bg-muted/20 p-4"
            aria-label="Chart specimen"
          >
            {chartData.map((bar) => (
              <div key={bar.month} className="flex flex-1 flex-col items-center gap-2">
                <div className="w-full bg-foreground" style={{ height: `${bar.value}%` }} />
                <span className="font-mono text-xs text-muted-foreground">{bar.month}</span>
              </div>
            ))}
          </div>
          <CarouselDemo />
        </div>
      </SpecimenStage>
    </>
  );
}

function UtilitiesExamples() {
  return (
    <>
      <SpecimenStage title="Theme and direction">
        <div className="space-y-4">
          <ModeToggle />
          <DirectionProvider dir="rtl">
            <div className="rounded-md border p-3 text-sm">RTL provider specimen / مزامنة</div>
          </DirectionProvider>
          <p className="text-sm text-muted-foreground">
            ThemeProvider wraps the app; this page consumes its light/dark state.
          </p>
        </div>
      </SpecimenStage>
      <SpecimenStage title="Public utilities">
        <div className="space-y-2">
          {utilityItems.map((item) => (
            <div key={item.id} className="border p-3">
              <p className="font-mono text-sm">{item.label}</p>
              <p className="mt-1 break-all font-mono text-xs text-muted-foreground">
                {item.source}
              </p>
            </div>
          ))}
        </div>
      </SpecimenStage>
    </>
  );
}

function DesignSystemSurface() {
  return (
    <div>
      <SurfaceHeader item={itemFromId("design-system")} />
      <div className="grid gap-px border-t bg-border lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="grid gap-px bg-border md:grid-cols-2">{<DesignSystemCards />}</div>
        <div className="grid gap-px bg-border">
          <TokenPanel
            title="Implementation"
            rows={[
              ["semantic tokens", "shadcn-compatible CSS variables"],
              ["studio names", "bench ink, rail gray, scope blue"],
              ["shape", "1-4px product radii"],
              ["motion", "stateful, reduced-motion aware"],
            ]}
          />
          <TokenPanel
            title="Scoped color"
            rows={[
              ["audio blue", "audio and waveform only"],
              ["P31 green", "oscilloscope traces only"],
              ["accent", "neutral product accent"],
            ]}
          />
          <TokenPanel title="Category map" rows={categoryTokenRows} />
        </div>
      </div>
    </div>
  );
}

function DesignSystemCards() {
  return (
    <>
      <SpecimenStage title="Color tokens">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {[
            ["background", "bg-background text-foreground"],
            ["foreground", "bg-foreground text-background"],
            ["card", "bg-card text-card-foreground"],
            ["primary", "bg-primary text-primary-foreground"],
            ["secondary", "bg-secondary text-secondary-foreground"],
            ["muted", "bg-muted text-muted-foreground"],
            ["accent", "bg-accent text-accent-foreground"],
            ["border", "bg-border text-foreground"],
            ["audio", "bg-audio-accent text-primary"],
          ].map(([label, className]) => (
            <div key={label} className={cn("min-h-20 border p-3 font-mono text-xs", className)}>
              {label}
            </div>
          ))}
        </div>
      </SpecimenStage>
      <SpecimenStage title="Typography">
        <div className="space-y-4">
          <div>
            <p className="font-mono text-2xl font-semibold tracking-[-0.02em]">
              Instrument-grade heading
            </p>
            <p className="font-mono text-xs text-muted-foreground">font-mono / TX-02</p>
          </div>
          <p className="max-w-prose text-sm leading-6 text-muted-foreground">
            Geist carries longer explanatory copy with stable rhythm and readable line lengths.
          </p>
          <p className="font-mono-secondary text-xs">Departure Mono stays selective.</p>
        </div>
      </SpecimenStage>
      <SpecimenStage title="Radius">
        <div className="grid grid-cols-4 gap-3">
          {["rounded-none", "rounded-sm", "rounded-md", "rounded-lg"].map((radius) => (
            <div
              key={radius}
              className={cn(
                "grid aspect-square place-items-center border bg-muted/30 font-mono text-[10px]",
                radius,
              )}
            >
              {radius.replace("rounded-", "")}
            </div>
          ))}
        </div>
      </SpecimenStage>
      <SpecimenStage title="Spacing">
        <div className="space-y-3">
          {[1, 2, 3, 4, 6, 8].map((step) => (
            <div key={step} className="flex items-center gap-3">
              <span className="w-10 font-mono text-xs text-muted-foreground">{step * 4}px</span>
              <div className="h-3 bg-foreground" style={{ width: step * 16 }} />
            </div>
          ))}
        </div>
      </SpecimenStage>
    </>
  );
}

function TokenPanel({
  title,
  rows,
}: {
  title: string;
  rows: readonly (readonly [string, string])[];
}) {
  return (
    <div className="bg-background p-4">
      <p className="font-mono text-sm font-semibold">{title}</p>
      <div className="mt-3 divide-y">
        {rows.map(([label, value]) => (
          <div key={label} className="grid gap-2 py-2 text-sm sm:grid-cols-[112px_minmax(0,1fr)]">
            <span className="font-mono text-xs text-muted-foreground">{label}</span>
            <span className="text-muted-foreground">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function renderTinyPreview(id: string) {
  return <StaticTinyPreview item={itemFromId(id)} />;
}

function StaticTinyPreview({ item }: { item: CatalogItem }) {
  if (item.category === "Audio") {
    return (
      <span
        aria-hidden="true"
        className="flex h-10 w-20 items-end gap-1 border border-audio-panel-border bg-audio-accent-softer p-1"
      >
        {[24, 56, 36, 72, 48, 64].map((value) => (
          <span key={value} className="flex-1 bg-audio-accent" style={{ height: `${value}%` }} />
        ))}
      </span>
    );
  }

  if (item.category === "Data") {
    return (
      <span aria-hidden="true" className="flex h-10 w-20 items-end gap-1 border bg-muted/20 p-1">
        {[40, 80, 55, 70].map((value) => (
          <span key={value} className="flex-1 bg-foreground" style={{ height: `${value}%` }} />
        ))}
      </span>
    );
  }

  if (item.category === "Input") {
    return (
      <span aria-hidden="true" className="grid h-10 w-20 gap-1 border bg-muted/20 p-2">
        <span className="h-1.5 w-12 bg-muted-foreground/50" />
        <span className="h-3 border bg-background" />
      </span>
    );
  }

  if (item.category === "Overlay" || item.category === "Menu") {
    return (
      <span aria-hidden="true" className="relative h-10 w-20 border bg-muted/20">
        <span className="absolute top-2 left-2 h-5 w-10 border bg-background" />
        <span className="absolute right-2 bottom-2 h-5 w-10 border bg-background" />
      </span>
    );
  }

  if (item.category === "Navigation") {
    return (
      <span aria-hidden="true" className="grid h-10 w-20 gap-1 border bg-muted/20 p-2">
        <span className="h-1.5 w-14 bg-foreground" />
        <span className="h-1.5 w-10 bg-muted-foreground/50" />
        <span className="h-1.5 w-12 bg-muted-foreground/50" />
      </span>
    );
  }

  if (item.category === "Feedback") {
    return (
      <span aria-hidden="true" className="flex h-10 w-20 items-center gap-1 border bg-muted/20 p-2">
        <span className="size-3 rounded-full bg-foreground" />
        <span className="grid flex-1 gap-1">
          <span className="h-1.5 bg-muted-foreground/60" />
          <span className="h-1.5 w-10 bg-muted-foreground/40" />
        </span>
      </span>
    );
  }

  if (item.category === "Layout") {
    return (
      <span aria-hidden="true" className="grid h-10 w-20 grid-cols-[1fr_1.4fr] gap-1 border p-1">
        <span className="bg-muted" />
        <span className="grid gap-1">
          <span className="bg-muted" />
          <span className="bg-muted" />
        </span>
      </span>
    );
  }

  return (
    <span aria-hidden="true" className="grid size-10 place-items-center border bg-muted/20">
      <CatalogItemIcon item={item} className="size-4 text-muted-foreground" />
    </span>
  );
}
