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
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@kkb/ui/components/avatar";
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
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@kkb/ui/components/empty";
import { Field, FieldContent, FieldDescription, FieldLabel } from "@kkb/ui/components/field";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@kkb/ui/components/hover-card";
import { Input } from "@kkb/ui/components/input";
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
import { Separator } from "@kkb/ui/components/separator";
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
  Check,
  ChevronRight,
  CircleAlert,
  Component,
  Download,
  ExternalLink,
  Grid2X2,
  Loader2,
  Mail,
  Plus,
  Search,
  Settings,
  SlidersHorizontal,
  X,
} from "lucide-react";
import * as React from "react";

import {
  type CatalogCategory,
  type CatalogItem,
  componentItems,
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
    <div className="bg-muted/25">
      <div className="grid auto-rows-min gap-px bg-border md:grid-cols-12">
        <PreviewCell className="md:col-span-12 xl:col-span-4">
          <TokenTypeStrip onSelect={onSelect} />
        </PreviewCell>
        <PreviewCell className="md:col-span-7 xl:col-span-4">
          <ActionPreview />
        </PreviewCell>
        <PreviewCell className="md:col-span-5 xl:col-span-4">
          <NavigationPreview />
        </PreviewCell>
        <PreviewCell className="md:col-span-6 xl:col-span-4">
          <FormPreview />
        </PreviewCell>
        <PreviewCell className="md:col-span-6 xl:col-span-4">
          <MenuOverlayPreview />
        </PreviewCell>
        <PreviewCell className="md:col-span-7 xl:col-span-4">
          <DataPreview />
        </PreviewCell>
        <PreviewCell className="md:col-span-5 xl:col-span-8">
          <AudioPreview />
        </PreviewCell>
      </div>
      <div className="border-t bg-background p-3">
        <div className="flex flex-wrap gap-2">
          {componentItems
            .filter((item) => item.important)
            .slice(0, 16)
            .map((item) => (
              <Button
                key={item.id}
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onSelect(item.id)}
                className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
              >
                {item.label}
              </Button>
            ))}
        </div>
      </div>
    </div>
  );
}

function PreviewCell({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <section className={cn("min-w-0 bg-background p-3 md:p-4", className)}>{children}</section>
  );
}

function PreviewLabel({ children }: { children: React.ReactNode }) {
  return <p className="mb-3 font-mono text-[11px] text-muted-foreground">{children}</p>;
}

function TokenTypeStrip({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <div className="space-y-4">
      <PreviewLabel>tokens / type</PreviewLabel>
      <div className="grid grid-cols-3 gap-2">
        {[
          ["paper", "bg-background text-foreground"],
          ["ink", "bg-foreground text-background"],
          ["rail", "bg-muted text-muted-foreground"],
          ["primary", "bg-primary text-primary-foreground"],
          ["audio", "bg-audio-accent text-primary"],
          ["border", "bg-border text-foreground"],
        ].map(([label, className]) => (
          <button
            key={label}
            type="button"
            onClick={() => onSelect("design-system")}
            className={cn("min-h-16 border p-2 text-left font-mono text-[11px]", className)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="border p-3">
        <p className="font-mono text-xl font-semibold tracking-[-0.02em]">TX-02 specimen</p>
        <p className="mt-1 text-sm leading-5 text-muted-foreground">
          Geist body copy stays quiet beside technical labels.
        </p>
      </div>
    </div>
  );
}

function ActionPreview() {
  return (
    <div className="space-y-4">
      <PreviewLabel>buttons / actions</PreviewLabel>
      <div className="flex flex-wrap gap-2">
        <Button>Run checks</Button>
        <Button variant="secondary">Save note</Button>
        <Button variant="outline">
          <ExternalLink className="size-4" />
          Open
        </Button>
        <Button variant="ghost">Dismiss</Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm">
          <Plus className="size-4" />
          Add
        </Button>
        <Button size="sm" variant="outline">
          Export
          <Download className="size-4" />
        </Button>
        <Button size="icon" variant="outline" aria-label="Settings">
          <Settings className="size-4" />
        </Button>
        <Button disabled>
          <Loader2 className="size-4 animate-spin" />
          Syncing
        </Button>
      </div>
      <ButtonGroup>
        <Button variant="outline">Source</Button>
        <Button variant="outline">States</Button>
        <Button variant="outline">Tokens</Button>
      </ButtonGroup>
    </div>
  );
}

function NavigationPreview() {
  return (
    <div className="space-y-4">
      <PreviewLabel>navigation</PreviewLabel>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">KKB</BreadcrumbLink>
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
          Component wall
        </TabsContent>
        <TabsContent value="tokens" className="border p-3 text-sm">
          Token specimens
        </TabsContent>
        <TabsContent value="audio" className="border p-3 text-sm">
          Audio primitives
        </TabsContent>
      </Tabs>
    </div>
  );
}

function FormPreview() {
  return (
    <div className="space-y-4">
      <PreviewLabel>forms / fields</PreviewLabel>
      <div className="grid gap-3">
        <Field>
          <FieldLabel htmlFor="catalog-filter">Filter</FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <Search className="size-4" />
            </InputGroupAddon>
            <InputGroupInput id="catalog-filter" defaultValue="audio waveform" />
          </InputGroup>
        </Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Select defaultValue="preview">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="preview">Preview</SelectItem>
              <SelectItem value="focused">Focused</SelectItem>
            </SelectContent>
          </Select>
          <NativeSelect defaultValue="compact" aria-label="Density">
            <NativeSelectOption value="compact">Compact</NativeSelectOption>
            <NativeSelectOption value="roomy">Roomy</NativeSelectOption>
          </NativeSelect>
        </div>
        <div className="flex flex-wrap items-center gap-4 border p-3">
          <Field orientation="horizontal" className="w-auto">
            <Checkbox id="preview-verified" defaultChecked />
            <FieldLabel htmlFor="preview-verified">Verified</FieldLabel>
          </Field>
          <Switch id="preview-enabled" defaultChecked aria-label="Enabled" />
          <Slider defaultValue={[72]} max={100} className="min-w-32 flex-1" aria-label="Density" />
        </div>
      </div>
    </div>
  );
}

function MenuOverlayPreview() {
  return (
    <TooltipProvider>
      <div className="space-y-4">
        <PreviewLabel>menus / overlays</PreviewLabel>
        <div className="flex flex-wrap gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Dropdown</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Inspect</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Copy import</DropdownMenuItem>
              <DropdownMenuCheckboxItem checked>Show states</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Popover</Button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <p className="text-sm">Density, token, and state controls stay contextual.</p>
            </PopoverContent>
          </Popover>
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
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Status">
                <Bell className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Status</TooltipContent>
          </Tooltip>
        </div>
        <Command className="rounded-md border">
          <CommandInput placeholder="Navigate..." />
          <CommandList>
            <CommandItem>Button</CommandItem>
            <CommandItem>Input</CommandItem>
            <CommandItem>Audio Waveform</CommandItem>
          </CommandList>
        </Command>
      </div>
    </TooltipProvider>
  );
}

function DataPreview() {
  return (
    <div className="space-y-4">
      <PreviewLabel>data</PreviewLabel>
      <Table>
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
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3">
        <div className="flex h-24 items-end gap-1 border bg-muted/20 p-3" aria-label="Chart">
          {chartData.map((bar) => (
            <div key={bar.month} className="flex flex-1 flex-col items-center gap-1">
              <div className="w-full bg-foreground" style={{ height: `${bar.value}%` }} />
              <span className="font-mono text-[10px] text-muted-foreground">{bar.month}</span>
            </div>
          ))}
        </div>
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </div>
    </div>
  );
}

function AudioPreview() {
  return (
    <div className="space-y-4">
      <PreviewLabel>audio</PreviewLabel>
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_280px]">
        <WaveformDemo />
        <PlayerControlsDemo />
      </div>
    </div>
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
  const related = relatedItems(item);

  return (
    <div className="bg-muted/20">
      <SurfaceHeader
        item={item}
        action={
          <Code className="max-w-full break-all whitespace-normal text-[11px] opacity-80">
            {sourceInstruction(item)}
          </Code>
        }
      />
      <div className="border-t p-3 md:p-4">
        <div className="grid gap-px bg-border md:grid-cols-2">{renderFocusedExamples(item)}</div>
      </div>
      {related.length ? (
        <footer className="border-t bg-background px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="font-mono text-[11px] text-muted-foreground">Related</span>
            <div className="flex flex-wrap gap-1.5">
              {related.map((relatedItem) => (
                <Button
                  key={relatedItem.id}
                  type="button"
                  variant="ghost"
                  size="xs"
                  className="h-6 px-2 text-[11px] text-muted-foreground hover:text-foreground"
                  onClick={() => onSelect(relatedItem.id)}
                >
                  {relatedItem.label}
                </Button>
              ))}
            </div>
          </div>
        </footer>
      ) : null}
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
    case "button":
      return <ButtonSpecimen />;
    case "button-group":
      return <ButtonGroupSpecimen />;
    case "card":
      return <CardSpecimen />;
    case "input":
      return <InputSpecimen />;
    case "dialog":
      return <DialogSpecimen />;
    case "table":
      return <TableSpecimen />;
    case "accordion":
    case "collapsible":
      return <DisclosureExamples item={item} />;
    case "alert-dialog":
      return <AlertDialogSpecimen />;
    case "drawer":
    case "sheet":
    case "popover":
    case "hover-card":
    case "tooltip":
      return <OverlayExamples item={item} />;
    case "toggle":
    case "toggle-group":
      return <ActionExamples item={item} />;
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
      return <InputExamples item={item} />;
    case "chart":
    case "code":
    case "kbd":
    case "carousel":
    case "json-render":
    case "json-render-catalog":
    case "json-render-registry":
      return <DataExamples item={item} />;
    case "sidebar":
    case "navigation-menu":
    case "breadcrumb":
    case "tabs":
    case "pagination":
      return <NavigationExamples item={item} />;
    case "aspect-ratio":
    case "empty":
    case "item":
    case "resizable":
    case "scroll-area":
    case "separator":
      return <LayoutExamples item={item} />;
    case "alert":
    case "avatar":
    case "badge":
    case "progress":
    case "skeleton":
    case "sonner":
    case "spinner":
      return <FeedbackExamples item={item} />;
    case "command":
    case "context-menu":
    case "dropdown-menu":
    case "menubar":
      return <MenuExamples item={item} />;
    case "direction":
    case "mode-toggle":
    case "theme-provider":
    case "use-mobile":
      return <UtilitiesExamples item={item} />;
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

function ButtonSpecimen() {
  return (
    <>
      <SpecimenStage title="Variants and sizes" className="md:col-span-2">
        <div className="grid gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
            <Button variant="destructive">Destructive</Button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button size="xs">Extra small</Button>
            <Button size="sm">Small</Button>
            <Button>Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon" aria-label="Settings">
              <Settings className="size-4" />
            </Button>
          </div>
        </div>
      </SpecimenStage>
      <SpecimenStage title="Icons and states">
        <div className="flex flex-wrap items-center gap-2">
          <Button>
            <Plus className="size-4" />
            Add source
          </Button>
          <Button variant="outline">
            Download
            <Download className="size-4" />
          </Button>
          <Button disabled>
            <Loader2 className="size-4 animate-spin" />
            Loading
          </Button>
          <Button aria-invalid variant="outline">
            Invalid
          </Button>
        </div>
      </SpecimenStage>
      <SpecimenStage title="Action row">
        <div className="flex flex-wrap items-center justify-between gap-3 border p-3">
          <div>
            <p className="font-mono text-sm font-semibold">Catalog route</p>
            <p className="text-sm text-muted-foreground">Preview, verify, then keep editing.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline">Cancel</Button>
            <Button>Apply changes</Button>
          </div>
        </div>
      </SpecimenStage>
    </>
  );
}

function ButtonGroupSpecimen() {
  return (
    <>
      <SpecimenStage title="Segmented actions">
        <ButtonGroup>
          <Button variant="outline">Source</Button>
          <Button variant="outline">States</Button>
          <Button variant="outline">Tokens</Button>
        </ButtonGroup>
      </SpecimenStage>
      <SpecimenStage title="Toolbar grouping">
        <div className="flex flex-wrap gap-2">
          <ButtonGroup>
            <Button variant="outline" size="icon" aria-label="Grid">
              <Grid2X2 className="size-4" />
            </Button>
            <Button variant="outline" size="icon" aria-label="Tune">
              <SlidersHorizontal className="size-4" />
            </Button>
            <Button variant="outline" size="icon" aria-label="Confirm">
              <Check className="size-4" />
            </Button>
          </ButtonGroup>
          <Button variant="secondary">Run selected</Button>
        </div>
      </SpecimenStage>
    </>
  );
}

function CardSpecimen() {
  return (
    <>
      <SpecimenStage title="Default and compact card" className="md:col-span-2">
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Playback surface</CardTitle>
              <CardDescription>Bordered panel with action slot.</CardDescription>
              <CardAction>
                <Badge>ready</Badge>
              </CardAction>
            </CardHeader>
            <CardContent>
              <div className="grid min-h-28 place-items-center border bg-muted/30 font-mono text-sm">
                content
              </div>
            </CardContent>
            <CardFooter className="justify-between gap-2">
              <span className="font-mono text-xs text-muted-foreground">24px padding</span>
              <Button size="sm">Open</Button>
            </CardFooter>
          </Card>
          <Card className="gap-4 py-4">
            <CardHeader className="px-4">
              <CardTitle className="text-base">Compact review</CardTitle>
              <CardDescription>Smaller internal rhythm.</CardDescription>
            </CardHeader>
            <CardContent className="px-4">
              <Progress value={68} />
            </CardContent>
            <CardFooter className="px-4">
              <Button variant="outline" size="sm" className="w-full">
                Continue
              </Button>
            </CardFooter>
          </Card>
        </div>
      </SpecimenStage>
      <SpecimenStage title="Edge-to-edge media">
        <Card className="overflow-hidden py-0">
          <div className="grid h-32 place-items-center bg-foreground text-background">
            <p className="font-mono text-sm">media</p>
          </div>
          <CardHeader>
            <CardTitle>Signal capture</CardTitle>
            <CardDescription>Content can own the top edge.</CardDescription>
          </CardHeader>
        </Card>
      </SpecimenStage>
      <SpecimenStage title="Footer actions">
        <Card>
          <CardHeader>
            <CardTitle>Specimen queue</CardTitle>
            <CardDescription>Action rows stay compact.</CardDescription>
          </CardHeader>
          <CardFooter className="gap-2">
            <Button variant="outline" className="flex-1">
              Skip
            </Button>
            <Button className="flex-1">Approve</Button>
          </CardFooter>
        </Card>
      </SpecimenStage>
    </>
  );
}

function InputSpecimen() {
  return (
    <>
      <SpecimenStage title="Text field states" className="md:col-span-2">
        <div className="grid gap-4 lg:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="input-plain">Plain</FieldLabel>
            <Input id="input-plain" placeholder="Component name" />
          </Field>
          <Field>
            <FieldLabel htmlFor="input-filled">With value</FieldLabel>
            <Input id="input-filled" defaultValue="audio-waveform" />
          </Field>
          <Field>
            <FieldLabel htmlFor="input-disabled">Disabled</FieldLabel>
            <Input id="input-disabled" disabled defaultValue="locked" />
          </Field>
          <Field data-invalid>
            <FieldLabel htmlFor="input-invalid">Invalid</FieldLabel>
            <Input id="input-invalid" aria-invalid defaultValue="missing import" />
            <FieldDescription className="text-destructive">
              Source path is required.
            </FieldDescription>
          </Field>
        </div>
      </SpecimenStage>
      <SpecimenStage title="Label and help text">
        <Field>
          <FieldLabel htmlFor="input-email">Notify collaborator</FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <Mail className="size-4" />
            </InputGroupAddon>
            <InputGroupInput id="input-email" placeholder="kalyn@example.com" />
          </InputGroup>
          <FieldDescription>Used for compact settings and route filters.</FieldDescription>
        </Field>
      </SpecimenStage>
      <SpecimenStage title="Grouped search">
        <InputGroup>
          <InputGroupAddon>
            <Search className="size-4" />
            <InputGroupText>Filter</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput defaultValue="button" />
          <InputGroupAddon align="inline-end">
            <InputGroupButton size="icon-xs" variant="ghost" aria-label="Clear filter">
              <X className="size-3" />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </SpecimenStage>
    </>
  );
}

function DialogSpecimen() {
  return (
    <>
      <SpecimenStage title="Trigger and modal">
        <Dialog>
          <DialogTrigger asChild>
            <Button>Open dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Inspect component</DialogTitle>
              <DialogDescription>Focused modal example.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline">Cancel</Button>
              <Button>Done</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SpecimenStage>
      <SpecimenStage title="Open-state anatomy">
        <div className="mx-auto max-w-sm border bg-background p-4 shadow-sm">
          <p className="font-mono text-base font-semibold">Inspect component</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Dialog content is compact, explicit, and action-led.
          </p>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" size="sm">
              Cancel
            </Button>
            <Button size="sm">Done</Button>
          </div>
        </div>
      </SpecimenStage>
    </>
  );
}

function TableSpecimen() {
  return (
    <>
      <SpecimenStage title="Compact data table" className="md:col-span-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Component</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              ["Button", "Input", "ready"],
              ["Card", "Layout", "ready"],
              ["Waveform", "Audio", "scoped"],
            ].map(([component, category, status]) => (
              <TableRow key={component}>
                <TableCell>{component}</TableCell>
                <TableCell>{category}</TableCell>
                <TableCell>
                  <Badge variant="outline">{status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SpecimenStage>
      <SpecimenStage title="Caption and keyboard">
        <div className="space-y-4">
          <Table>
            <TableCaption>Focused table specimen.</TableCaption>
            <TableBody>
              <TableRow>
                <TableCell>Open search</TableCell>
                <TableCell>
                  <KbdGroup>
                    <Kbd>⌘</Kbd>
                    <Kbd>K</Kbd>
                  </KbdGroup>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </SpecimenStage>
    </>
  );
}

function ActionExamples({ item }: { item: CatalogItem }) {
  return (
    <>
      <SpecimenStage title={`${item.label} states`}>
        <div className="flex flex-wrap items-center gap-2">
          <Toggle defaultPressed>
            <Grid2X2 className="size-4" />
            Grid
          </Toggle>
          <Toggle aria-invalid>Invalid</Toggle>
          <Toggle disabled>Disabled</Toggle>
          <ToggleGroup type="multiple" defaultValue={["labels"]}>
            <ToggleGroupItem value="labels">Labels</ToggleGroupItem>
            <ToggleGroupItem value="stats">Stats</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </SpecimenStage>
      <SpecimenStage title={`${item.label} toolbar`}>
        <ActionBench />
      </SpecimenStage>
    </>
  );
}

function InputExamples({ item }: { item: CatalogItem }) {
  if (item.id === "select" || item.id === "native-select" || item.id === "combobox") {
    return (
      <>
        <SpecimenStage title={`${item.label} closed state`}>
          <div className="grid gap-3">
            <Select defaultValue="preview">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="preview">Preview</SelectItem>
                <SelectItem value="focused">Focused</SelectItem>
              </SelectContent>
            </Select>
            <NativeSelect defaultValue="compact" aria-label="Density">
              <NativeSelectOption value="compact">Compact</NativeSelectOption>
              <NativeSelectOption value="roomy">Roomy</NativeSelectOption>
            </NativeSelect>
          </div>
        </SpecimenStage>
        <SpecimenStage title={`${item.label} search state`}>
          <Combobox items={["button", "input", "audio waveform"]}>
            <ComboboxInput placeholder="Primitive or bay" />
            <ComboboxContent>
              <ComboboxList>
                {["button", "input", "audio waveform"].map((value) => (
                  <ComboboxItem key={value} value={value}>
                    {value}
                  </ComboboxItem>
                ))}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </SpecimenStage>
      </>
    );
  }

  if (item.id === "input-group") {
    return (
      <>
        <SpecimenStage title="Input Group addons">
          <InputGroup>
            <InputGroupAddon>
              <Search className="size-4" />
              <InputGroupText>Filter</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput defaultValue="card" />
            <InputGroupAddon align="inline-end">
              <InputGroupButton size="icon-xs" variant="ghost" aria-label="Clear">
                <X className="size-3" />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </SpecimenStage>
        <SpecimenStage title="Input Group action">
          <InputGroup>
            <InputGroupInput placeholder="kalyn@example.com" />
            <InputGroupAddon align="inline-end">
              <InputGroupButton size="sm">Invite</InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </SpecimenStage>
      </>
    );
  }

  if (item.id === "input-otp") {
    return (
      <>
        <SpecimenStage title="Input OTP segmented code">
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
        </SpecimenStage>
        <SpecimenStage title="Input OTP in context">
          <Field>
            <FieldLabel>Verification code</FieldLabel>
            <FieldDescription>Six slots with separator rhythm.</FieldDescription>
          </Field>
        </SpecimenStage>
      </>
    );
  }

  return (
    <>
      <SpecimenStage title={`${item.label} settings form`}>
        <FieldBench />
      </SpecimenStage>
      <SpecimenStage title={`${item.label} structured entry`}>
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <Checkbox id={`${item.id}-checked`} defaultChecked />
            <Switch id={`${item.id}-switch`} defaultChecked aria-label={`${item.label} enabled`} />
            <Slider defaultValue={[64]} max={100} aria-label={`${item.label} range`} />
          </div>
          <CalendarDemo />
        </div>
      </SpecimenStage>
    </>
  );
}

function LayoutExamples({ item }: { item: CatalogItem }) {
  if (item.id === "aspect-ratio") {
    return (
      <>
        <SpecimenStage title="Ratios" className="md:col-span-2">
          <div className="grid gap-4 lg:grid-cols-3">
            {[
              ["16 / 9", 16 / 9],
              ["4 / 3", 4 / 3],
              ["1 / 1", 1],
            ].map(([label, ratio]) => (
              <AspectRatio key={label} ratio={ratio as number}>
                <div className="grid size-full place-items-center border bg-muted/30 font-mono text-sm">
                  {label}
                </div>
              </AspectRatio>
            ))}
          </div>
        </SpecimenStage>
        <SpecimenStage title="Media frame" className="md:col-span-2">
          <AspectRatio ratio={21 / 9}>
            <div className="grid size-full place-items-center border bg-foreground text-background">
              <span className="font-mono text-sm">21 / 9</span>
            </div>
          </AspectRatio>
        </SpecimenStage>
      </>
    );
  }

  if (item.id === "resizable") {
    return (
      <>
        <SpecimenStage title="Horizontal panels" className="md:col-span-2">
          <ResizablePanelGroup className="min-h-72 border">
            <ResizablePanel defaultSize={28} minSize={20} className="grid place-items-center">
              <span className="font-mono text-sm">rail</span>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={72} minSize={40} className="grid place-items-center">
              <span className="font-mono text-sm">canvas</span>
            </ResizablePanel>
          </ResizablePanelGroup>
        </SpecimenStage>
        <SpecimenStage title="Three panels" className="md:col-span-2">
          <ResizablePanelGroup className="min-h-64 border">
            <ResizablePanel defaultSize={30} minSize={20} className="grid place-items-center">
              <span className="font-mono text-sm">left</span>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={40} minSize={25} className="grid place-items-center">
              <span className="font-mono text-sm">preview</span>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel
              defaultSize={30}
              minSize={20}
              className="grid place-items-center bg-muted/25"
            >
              <span className="font-mono text-sm">right</span>
            </ResizablePanel>
          </ResizablePanelGroup>
        </SpecimenStage>
      </>
    );
  }

  if (item.id === "scroll-area") {
    return (
      <>
        <SpecimenStage title="Scrollable list">
          <ScrollArea className="h-72 border">
            <ItemGroup>
              {componentItems.slice(0, 18).map((component) => (
                <React.Fragment key={component.id}>
                  <Item size="sm">
                    <ItemContent>
                      <ItemTitle>{component.label}</ItemTitle>
                      <ItemDescription>{component.source}</ItemDescription>
                    </ItemContent>
                  </Item>
                  <ItemSeparator />
                </React.Fragment>
              ))}
            </ItemGroup>
          </ScrollArea>
        </SpecimenStage>
        <SpecimenStage title="Contained copy">
          <ScrollArea className="h-72 border p-4">
            <div className="space-y-4 pr-4 text-sm leading-6 text-muted-foreground">
              {Array.from({ length: 8 }, (_, index) => (
                <p key={index}>
                  ScrollArea keeps long content inside a bounded specimen without moving the page.
                </p>
              ))}
            </div>
          </ScrollArea>
        </SpecimenStage>
      </>
    );
  }

  if (item.id === "separator") {
    return (
      <>
        <SpecimenStage title="Horizontal separators">
          <div className="space-y-4">
            <div>
              <p className="font-mono text-sm">Preview</p>
              <p className="text-sm text-muted-foreground">Component specimen state.</p>
            </div>
            <Separator />
            <div>
              <p className="font-mono text-sm">Source</p>
              <p className="text-sm text-muted-foreground">@kkb/ui/components/separator</p>
            </div>
            <Separator />
            <div>
              <p className="font-mono text-sm">Related</p>
              <p className="text-sm text-muted-foreground">Low-noise footer grouping.</p>
            </div>
          </div>
        </SpecimenStage>
        <SpecimenStage title="Vertical separators">
          <div className="flex h-36 items-stretch justify-center gap-6">
            <span className="grid place-items-center font-mono text-sm">A</span>
            <Separator orientation="vertical" />
            <span className="grid place-items-center font-mono text-sm">B</span>
            <Separator orientation="vertical" />
            <span className="grid place-items-center font-mono text-sm">C</span>
          </div>
        </SpecimenStage>
      </>
    );
  }

  if (item.id === "empty") {
    return (
      <SpecimenStage title="Empty state" className="md:col-span-2">
        <Empty className="min-h-72 border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Boxes className="size-5" />
            </EmptyMedia>
            <EmptyTitle>No captures selected</EmptyTitle>
            <EmptyDescription>Choose an audio pass or create a new capture.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button size="sm">Create capture</Button>
          </EmptyContent>
        </Empty>
      </SpecimenStage>
    );
  }

  if (item.id === "item") {
    return (
      <SpecimenStage title="Item group" className="md:col-span-2">
        <ItemGroup className="border">
          {[
            {
              iconItem: itemFromId("audio-waveform"),
              title: "Audio waveform",
              description: "High-density preview item",
              state: "ready",
            },
            {
              iconItem: itemFromId("dialog"),
              title: "Dialog",
              description: "Overlay item with trigger state",
              state: "open",
            },
            {
              iconItem: itemFromId("table"),
              title: "Table",
              description: "Data item with keyboard affordance",
              state: "focus",
            },
          ].map(({ iconItem, title, description, state }, index) => (
            <React.Fragment key={title}>
              <Item>
                <ItemMedia>
                  <CatalogItemIcon item={iconItem} className="size-4" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{title}</ItemTitle>
                  <ItemDescription>{description}</ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Badge variant="secondary">{state}</Badge>
                </ItemActions>
              </Item>
              {index < 2 ? <ItemSeparator /> : null}
            </React.Fragment>
          ))}
        </ItemGroup>
      </SpecimenStage>
    );
  }

  return (
    <SpecimenStage title={item.label} className="md:col-span-2">
      {renderTinyPreview(item.id)}
    </SpecimenStage>
  );
}

function NavigationExamples({ item }: { item: CatalogItem }) {
  if (item.id === "breadcrumb") {
    return (
      <SpecimenStage title="Breadcrumb states" className="md:col-span-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/ui">Catalog</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/ui?item=category-navigation">Navigation</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </SpecimenStage>
    );
  }

  if (item.id === "tabs") {
    return (
      <SpecimenStage title="Tabs" className="md:col-span-2">
        <Tabs defaultValue="preview" className="w-full">
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="tokens">Tokens</TabsTrigger>
            <TabsTrigger value="usage">Usage</TabsTrigger>
          </TabsList>
          <TabsContent value="preview" className="border p-4">
            Component preview state
          </TabsContent>
          <TabsContent value="tokens" className="border p-4">
            Token reference state
          </TabsContent>
          <TabsContent value="usage" className="border p-4">
            Usage state
          </TabsContent>
        </Tabs>
      </SpecimenStage>
    );
  }

  if (item.id === "pagination") {
    return (
      <SpecimenStage title="Pagination" className="md:col-span-2">
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
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </SpecimenStage>
    );
  }

  return (
    <>
      <SpecimenStage title={`${item.label} route shell`}>
        <NavigationBench />
      </SpecimenStage>
      <SpecimenStage title={`${item.label} navigation state`}>
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

function DisclosureExamples({ item }: { item: CatalogItem }) {
  return (
    <>
      <SpecimenStage title={`${item.label} expanded state`}>
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
      <SpecimenStage title={`${item.label} disclosure control`}>
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

function OverlayExamples({ item }: { item: CatalogItem }) {
  return (
    <>
      <SpecimenStage title={`${item.label} trigger`}>
        <OverlayBench />
      </SpecimenStage>
      <SpecimenStage title={`${item.label} open-state shape`}>
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

function AlertDialogSpecimen() {
  return (
    <>
      <SpecimenStage title="Trigger and modal">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Delete capture</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete capture?</AlertDialogTitle>
              <AlertDialogDescription>
                This action removes the selected waveform capture.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SpecimenStage>
      <SpecimenStage title="Open-state anatomy">
        <div className="max-w-sm border bg-background p-4 shadow-sm">
          <p className="font-mono text-sm font-semibold">Delete capture?</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Alert dialogs reserve the destructive decision for the footer.
          </p>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" size="sm">
              Cancel
            </Button>
            <Button variant="destructive" size="sm">
              Delete
            </Button>
          </div>
        </div>
      </SpecimenStage>
    </>
  );
}

function FeedbackExamples({ item }: { item: CatalogItem }) {
  if (item.id === "alert") {
    return (
      <SpecimenStage title="Alert variants" className="md:col-span-2">
        <div className="grid gap-3">
          <Alert>
            <Check className="size-4" />
            <AlertTitle>Capture ready</AlertTitle>
            <AlertDescription>Waveform analysis completed.</AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <CircleAlert className="size-4" />
            <AlertTitle>Capture failed</AlertTitle>
            <AlertDescription>Reconnect the input source.</AlertDescription>
          </Alert>
        </div>
      </SpecimenStage>
    );
  }

  if (item.id === "avatar") {
    return (
      <SpecimenStage title="Avatar sizes" className="md:col-span-2">
        <div className="flex flex-wrap items-center gap-5">
          <Avatar size="sm">
            <AvatarFallback>KB</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
            <AvatarFallback>SC</AvatarFallback>
            <AvatarBadge />
          </Avatar>
          <Avatar size="lg">
            <AvatarFallback>UI</AvatarFallback>
          </Avatar>
          <AvatarGroup>
            <Avatar>
              <AvatarFallback>AA</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>BB</AvatarFallback>
            </Avatar>
            <AvatarGroupCount>+3</AvatarGroupCount>
          </AvatarGroup>
        </div>
      </SpecimenStage>
    );
  }

  if (item.id === "badge") {
    return (
      <SpecimenStage title="Badge variants" className="md:col-span-2">
        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </div>
      </SpecimenStage>
    );
  }

  if (item.id === "progress") {
    return (
      <SpecimenStage title="Progress values" className="md:col-span-2">
        <div className="grid gap-4">
          <Progress value={28} />
          <Progress value={64} />
          <Progress value={92} />
        </div>
      </SpecimenStage>
    );
  }

  if (item.id === "skeleton") {
    return (
      <SpecimenStage title="Skeleton loading shape" className="md:col-span-2">
        <div className="space-y-3">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-28 w-full" />
          <div className="grid gap-2 sm:grid-cols-3">
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
          </div>
        </div>
      </SpecimenStage>
    );
  }

  if (item.id === "spinner" || item.id === "sonner") {
    return (
      <SpecimenStage
        title={item.id === "spinner" ? "Spinner state" : "Sonner state"}
        className="md:col-span-2"
      >
        <div className="flex items-center gap-3">
          <Spinner />
          <span className="text-sm text-muted-foreground">
            {item.id === "spinner" ? "Loading capture" : "Toast host mounted"}
          </span>
          {item.id === "sonner" ? <Toaster /> : null}
        </div>
      </SpecimenStage>
    );
  }

  return (
    <SpecimenStage title={item.label} className="md:col-span-2">
      {renderTinyPreview(item.id)}
    </SpecimenStage>
  );
}

function MenuExamples({ item }: { item: CatalogItem }) {
  if (item.id === "command") {
    return (
      <SpecimenStage title="Command list" className="md:col-span-2">
        <Command className="rounded-md border">
          <CommandInput placeholder="Search components..." />
          <CommandList>
            <CommandItem>Button</CommandItem>
            <CommandItem>Input</CommandItem>
            <CommandItem>Dialog</CommandItem>
          </CommandList>
        </Command>
      </SpecimenStage>
    );
  }

  if (item.id === "dropdown-menu") {
    return (
      <SpecimenStage title="Dropdown menu" className="md:col-span-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Open menu</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Catalog</DropdownMenuLabel>
            <DropdownMenuItem>Preview</DropdownMenuItem>
            <DropdownMenuItem>Open source</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem checked>Verified</DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SpecimenStage>
    );
  }

  if (item.id === "context-menu") {
    return (
      <SpecimenStage title="Context menu" className="md:col-span-2">
        <ContextMenu>
          <ContextMenuTrigger className="grid h-40 place-items-center border bg-muted/20 text-sm text-muted-foreground">
            Right click surface
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>Open</ContextMenuItem>
            <ContextMenuItem>Duplicate</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem>
              Inspect
              <ContextMenuShortcut>⌘I</ContextMenuShortcut>
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </SpecimenStage>
    );
  }

  if (item.id === "menubar") {
    return (
      <SpecimenStage title="Menubar" className="md:col-span-2">
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>New capture</MenubarItem>
              <MenubarItem>
                Save
                <MenubarShortcut>⌘S</MenubarShortcut>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Export</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>View</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>Preview</MenubarItem>
              <MenubarItem>Components</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </SpecimenStage>
    );
  }

  return (
    <SpecimenStage title={item.label} className="md:col-span-2">
      {renderTinyPreview(item.id)}
    </SpecimenStage>
  );
}

function DataExamples({ item }: { item: CatalogItem }) {
  if (item.id === "code") {
    return (
      <SpecimenStage title="Code" className="md:col-span-2">
        <div className="space-y-3 text-sm">
          <p>
            Import <Code>@kkb/ui/components/code</Code>
          </p>
          <p>
            Use <Code>item=button</Code> for direct catalog routes.
          </p>
        </div>
      </SpecimenStage>
    );
  }

  if (item.id === "kbd") {
    return (
      <SpecimenStage title="Keyboard groups" className="md:col-span-2">
        <div className="flex flex-wrap gap-3">
          <KbdGroup>
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </KbdGroup>
          <KbdGroup>
            <Kbd>Shift</Kbd>
            <Kbd>Tab</Kbd>
          </KbdGroup>
          <Kbd>Esc</Kbd>
        </div>
      </SpecimenStage>
    );
  }

  if (item.id === "chart") {
    return (
      <SpecimenStage title="Chart bars" className="md:col-span-2">
        <div
          className="flex h-64 items-end gap-2 border bg-muted/20 p-4"
          aria-label="Chart specimen"
        >
          {chartData.map((bar) => (
            <div key={bar.month} className="flex flex-1 flex-col items-center gap-2">
              <div className="w-full bg-foreground" style={{ height: `${bar.value}%` }} />
              <span className="font-mono text-xs text-muted-foreground">{bar.month}</span>
            </div>
          ))}
        </div>
      </SpecimenStage>
    );
  }

  if (item.id === "carousel") {
    return (
      <SpecimenStage title="Carousel" className="md:col-span-2">
        <CarouselDemo />
      </SpecimenStage>
    );
  }

  if (item.id.startsWith("json-render")) {
    return (
      <SpecimenStage title={item.label} className="md:col-span-2">
        <div className="grid gap-3 border bg-muted/20 p-4 font-mono text-xs">
          <span>{item.source}</span>
          <Code>{`{ "component": "${item.label}", "status": "registered" }`}</Code>
        </div>
      </SpecimenStage>
    );
  }

  return (
    <>
      <SpecimenStage title={`${item.label} dense values`}>
        <DataBench />
      </SpecimenStage>
      <SpecimenStage title={`${item.label} visual state`}>
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

function UtilitiesExamples({ item }: { item?: CatalogItem }) {
  return (
    <>
      <SpecimenStage title={`${item?.label ?? "Utility"} runtime surface`}>
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
      <SpecimenStage title={`${item?.label ?? "Utility"} source reference`}>
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
      <div className="grid gap-px border-t bg-border xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="grid gap-px bg-border md:grid-cols-2">{<DesignSystemCards />}</div>
        <div className="grid content-start gap-px bg-border">
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
            <div key={label} className={cn("min-h-28 border p-3 font-mono text-xs", className)}>
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
      <SpecimenStage title="Scoped instrument color" className="md:col-span-2">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="border border-audio-panel-border bg-audio-accent-softer p-4">
            <p className="font-mono text-sm text-audio-accent">audio blue</p>
            <div className="mt-4 flex h-20 items-end gap-1">
              {[28, 64, 42, 80, 54, 72, 36, 60].map((value) => (
                <div
                  key={value}
                  className="flex-1 bg-audio-accent"
                  style={{ height: `${value}%` }}
                />
              ))}
            </div>
          </div>
          <div className="border bg-[color:var(--oscilloscope-shoulder)] p-4 text-[color:var(--oscilloscope-glow)]">
            <p className="font-mono text-sm">P31 oscilloscope</p>
            <div className="mt-4 h-20 border border-[color:var(--oscilloscope-floor)] bg-[color:var(--oscilloscope-shoulder)] p-3">
              <div className="h-full w-full border-t-2 border-[color:var(--oscilloscope-trace)]" />
            </div>
          </div>
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
