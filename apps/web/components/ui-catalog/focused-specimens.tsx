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
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldSet,
} from "@kkb/ui/components/field";
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
import {
  Bell,
  Boxes,
  Check,
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

import { type CatalogItem, componentItems, itemFromId } from "./catalog-data";
import { CatalogItemIcon } from "./catalog-icons";
import {
  chartData,
  DemoBoundary,
  renderTinyPreview,
  SpecimenStage,
} from "./catalog-surface-shared";
import {
  AudioCompositionDemo,
  PlayerControlsDemo,
  PlayheadDemo,
  WaveformDemo,
} from "./demos/audio-demo";
import { CarouselDemo } from "./demos/carousel-demo";
import { CalendarDemo } from "./demos/select-calendar-demo";
import { UtilitiesExamples } from "./utility-examples";

export function FocusedComponentSurface({
  item,
}: {
  item: CatalogItem;
}) {
  return (
    <div className="min-h-full bg-background p-4 md:p-6">
      <div className="grid gap-x-8 gap-y-6 md:grid-cols-2">{renderFocusedExamples(item)}</div>
    </div>
  );
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
    case "calendar":
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

  if (item.id === "audio-theme") {
    return (
      <>
        <SpecimenStage title="Audio theme tokens">
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["accent", "bg-audio-accent text-primary"],
              ["panel", "bg-audio-panel text-audio-title"],
              ["control", "bg-audio-control text-primary"],
              ["meta", "bg-audio-accent-softer text-audio-accent"],
            ].map(([label, className]) => (
              <div key={label} className={`min-h-24 border p-3 font-mono text-xs ${className}`}>
                {label}
              </div>
            ))}
          </div>
        </SpecimenStage>
        <SpecimenStage title="Audio theme application">
          <WaveformDemo />
        </SpecimenStage>
      </>
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
      <SpecimenStage title="Default Size" bodyClassName="grid min-h-72 place-items-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Playback surface</CardTitle>
            <CardDescription>Bordered panel with action slot.</CardDescription>
            <CardAction>
              <Badge>ready</Badge>
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className="grid min-h-28 place-items-center border bg-background font-mono text-sm">
              content
            </div>
          </CardContent>
          <CardFooter className="justify-between gap-2">
            <span className="font-mono text-xs text-muted-foreground">24px padding</span>
            <Button size="sm">Open</Button>
          </CardFooter>
        </Card>
      </SpecimenStage>
      <SpecimenStage title="Small Size" bodyClassName="grid min-h-72 place-items-center p-6">
        <Card className="w-full max-w-md gap-4 py-4">
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
      </SpecimenStage>
      <SpecimenStage
        title="Content Edge to Edge"
        bodyClassName="grid min-h-72 place-items-center p-6"
      >
        <Card className="w-full max-w-md overflow-hidden py-0">
          <div className="grid h-32 place-items-center bg-foreground text-background">
            <p className="font-mono text-sm">media</p>
          </div>
          <CardHeader>
            <CardTitle>Signal capture</CardTitle>
            <CardDescription>Content can own the top edge.</CardDescription>
          </CardHeader>
        </Card>
      </SpecimenStage>
      <SpecimenStage title="Custom Spacing" bodyClassName="grid min-h-72 place-items-center p-6">
        <Card className="w-full max-w-md gap-4 p-4">
          <div className="flex flex-wrap gap-2">
            {["16px", "20px", "24px", "32px"].map((space) => (
              <Badge key={space} variant="outline">
                {space}
              </Badge>
            ))}
          </div>
          <CardHeader className="px-0">
            <CardTitle>Release Health</CardTitle>
            <CardDescription>Track readiness across launch signals.</CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            <div className="grid grid-cols-[1fr_auto] gap-3 bg-muted/50 p-3">
              <span className="text-sm text-muted-foreground">Checks passed</span>
              <span className="font-mono text-sm">24 / 26</span>
            </div>
          </CardContent>
        </Card>
      </SpecimenStage>
      <SpecimenStage title="Footer Actions" bodyClassName="grid min-h-72 place-items-center p-6">
        <Card className="w-full max-w-md">
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

function InputExamples({ item }: { item: CatalogItem }) {
  if (item.id === "calendar") {
    return (
      <>
        <SpecimenStage title="Calendar month grid" className="md:col-span-2">
          <CalendarDemo />
        </SpecimenStage>
        <SpecimenStage title="Calendar field context">
          <Field>
            <FieldLabel htmlFor="calendar-review">Review window</FieldLabel>
            <Input id="calendar-review" defaultValue="2026-06-22 to 2026-06-29" />
            <FieldDescription>Use calendar selection beside explicit text state.</FieldDescription>
          </Field>
        </SpecimenStage>
      </>
    );
  }

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

  if (item.id === "checkbox") {
    return (
      <>
        <SpecimenStage title="Checkbox states">
          <div className="flex flex-wrap items-center gap-4">
            <Checkbox id="checkbox-on" defaultChecked aria-label="Checked state" />
            <Checkbox id="checkbox-off" aria-label="Unchecked state" />
            <Checkbox id="checkbox-disabled" disabled aria-label="Disabled state" />
            <Checkbox id="checkbox-invalid" aria-invalid aria-label="Invalid state" />
          </div>
        </SpecimenStage>
        <SpecimenStage title="Checkbox field row">
          <Field orientation="horizontal">
            <Checkbox id="checkbox-row" defaultChecked />
            <FieldContent>
              <FieldLabel htmlFor="checkbox-row">Include browser notes</FieldLabel>
              <FieldDescription>Attach verification context to the handoff.</FieldDescription>
            </FieldContent>
          </Field>
        </SpecimenStage>
      </>
    );
  }

  if (item.id === "radio-group") {
    return (
      <>
        <SpecimenStage title="Radio Group options">
          <RadioGroup defaultValue="focused">
            {["preview", "focused", "tokens"].map((value) => (
              <div key={value} className="flex items-center gap-2 text-sm">
                <RadioGroupItem id={`radio-${value}`} value={value} />
                <Label htmlFor={`radio-${value}`}>{value}</Label>
              </div>
            ))}
          </RadioGroup>
        </SpecimenStage>
        <SpecimenStage title="Radio Group review state">
          <RadioGroup defaultValue="ready">
            <FieldSet className="gap-3">
              <Field orientation="horizontal">
                <RadioGroupItem id="radio-ready" value="ready" />
                <FieldContent>
                  <FieldLabel htmlFor="radio-ready">Ship-ready</FieldLabel>
                  <FieldDescription>Single choice with explicit label copy.</FieldDescription>
                </FieldContent>
              </Field>
            </FieldSet>
          </RadioGroup>
        </SpecimenStage>
      </>
    );
  }

  if (item.id === "switch") {
    return (
      <>
        <SpecimenStage title="Switch states">
          <div className="flex flex-wrap items-center gap-5">
            <Switch id="switch-on" defaultChecked aria-label="Enabled" />
            <Switch id="switch-off" aria-label="Disabled state" />
            <Switch id="switch-disabled" disabled aria-label="Locked" />
          </div>
        </SpecimenStage>
        <SpecimenStage title="Switch setting row">
          <Field orientation="horizontal">
            <FieldContent>
              <FieldLabel htmlFor="switch-watch">Watch browser checks</FieldLabel>
              <FieldDescription>Keep the monitor active while reviewing routes.</FieldDescription>
            </FieldContent>
            <Switch id="switch-watch" defaultChecked />
          </Field>
        </SpecimenStage>
      </>
    );
  }

  if (item.id === "slider") {
    return (
      <>
        <SpecimenStage title="Slider values">
          <div className="grid gap-5">
            <Slider defaultValue={[24]} max={100} aria-label="Low density" />
            <Slider defaultValue={[64]} max={100} aria-label="Medium density" />
            <Slider defaultValue={[92]} max={100} aria-label="High density" />
          </div>
        </SpecimenStage>
        <SpecimenStage title="Slider density control">
          <Field>
            <FieldLabel>Preview density</FieldLabel>
            <Slider defaultValue={[72]} max={100} aria-label="Preview density" />
            <FieldDescription>Range controls stay labeled and bounded.</FieldDescription>
          </Field>
        </SpecimenStage>
      </>
    );
  }

  if (item.id === "textarea") {
    return (
      <>
        <SpecimenStage title="Textarea states">
          <div className="grid gap-3">
            <Textarea placeholder="Write a handoff note" />
            <Textarea defaultValue="Focused routes should show component-specific states." />
            <Textarea disabled defaultValue="Locked after publish." />
          </div>
        </SpecimenStage>
        <SpecimenStage title="Textarea review note">
          <Field>
            <FieldLabel htmlFor="textarea-note">Review note</FieldLabel>
            <Textarea id="textarea-note" defaultValue="Replace broad templates before PR." />
            <FieldDescription>Use for longer inspectable prose.</FieldDescription>
          </Field>
        </SpecimenStage>
      </>
    );
  }

  if (item.id === "field" || item.id === "label") {
    return (
      <>
        <SpecimenStage title={`${item.label} anatomy`}>
          <Field>
            <FieldLabel htmlFor={`${item.id}-source`}>Source path</FieldLabel>
            <Input id={`${item.id}-source`} defaultValue="@kkb/ui/components/input" />
            <FieldDescription>Label, control, and help text stay grouped.</FieldDescription>
          </Field>
        </SpecimenStage>
        <SpecimenStage title={`${item.label} validation`}>
          <Field data-invalid>
            <FieldLabel htmlFor={`${item.id}-invalid`}>Import path</FieldLabel>
            <Input id={`${item.id}-invalid`} aria-invalid defaultValue="missing" />
            <FieldDescription className="text-destructive">
              Use the public package export path.
            </FieldDescription>
          </Field>
        </SpecimenStage>
      </>
    );
  }

  if (item.id === "form") {
    return (
      <>
        <SpecimenStage title="Form layout">
          <div className="grid gap-4">
            <Field>
              <FieldLabel htmlFor="form-title">Report title</FieldLabel>
              <Input id="form-title" defaultValue="UI catalog route audit" />
            </Field>
            <Field orientation="horizontal">
              <Checkbox id="form-include" defaultChecked />
              <FieldContent>
                <FieldLabel htmlFor="form-include">Include screenshots</FieldLabel>
                <FieldDescription>Submit supporting browser evidence.</FieldDescription>
              </FieldContent>
            </Field>
          </div>
        </SpecimenStage>
        <SpecimenStage title="Form submission row">
          <div className="flex flex-wrap items-center justify-between gap-3 border p-3">
            <p className="text-sm text-muted-foreground">Two required fields complete.</p>
            <div className="flex gap-2">
              <Button variant="outline">Reset</Button>
              <Button>Submit</Button>
            </div>
          </div>
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
    <SpecimenStage title={item.label} className="md:col-span-2">
      {renderTinyPreview(item.id)}
    </SpecimenStage>
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
      <>
        <SpecimenStage title="Tabs states" className="md:col-span-2">
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
        <SpecimenStage title="Tabs density">
          <Tabs defaultValue="source">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="source">Source</TabsTrigger>
              <TabsTrigger value="states">States</TabsTrigger>
            </TabsList>
            <TabsContent value="source" className="border p-3 font-mono text-xs">
              @kkb/ui/components/tabs
            </TabsContent>
            <TabsContent value="states" className="border p-3 text-sm text-muted-foreground">
              Compact tab lists keep focused specimens in one panel.
            </TabsContent>
          </Tabs>
        </SpecimenStage>
      </>
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
                <Button variant="outline" size="icon" aria-label="Show notification tooltip">
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
            <Button variant="outline" size="icon" aria-label="Show notification tooltip">
              <Bell className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Notification state</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
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
      <>
        <SpecimenStage title="Variants" bodyClassName="grid min-h-36 place-items-center">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="ghost">Ghost</Badge>
            <Badge variant="link">Link</Badge>
          </div>
        </SpecimenStage>
        <SpecimenStage title="Icon Left" bodyClassName="grid min-h-36 place-items-center">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>
              <Check className="size-3" />
              Default
            </Badge>
            <Badge variant="secondary">
              <Check className="size-3" />
              Secondary
            </Badge>
            <Badge variant="destructive">
              <CircleAlert className="size-3" />
              Destructive
            </Badge>
            <Badge variant="outline">
              <Check className="size-3" />
              Outline
            </Badge>
          </div>
        </SpecimenStage>
        <SpecimenStage title="Icon Right" bodyClassName="grid min-h-36 place-items-center">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>
              Default
              <Check className="size-3" />
            </Badge>
            <Badge variant="secondary">
              Secondary
              <Check className="size-3" />
            </Badge>
            <Badge variant="destructive">
              Destructive
              <X className="size-3" />
            </Badge>
            <Badge variant="outline">
              Outline
              <Check className="size-3" />
            </Badge>
          </div>
        </SpecimenStage>
        <SpecimenStage title="With Spinner" bodyClassName="grid min-h-36 place-items-center">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>
              <Loader2 className="size-3 animate-spin" />
              Default
            </Badge>
            <Badge variant="secondary">
              <Loader2 className="size-3 animate-spin" />
              Secondary
            </Badge>
            <Badge variant="destructive">
              <Loader2 className="size-3 animate-spin" />
              Destructive
            </Badge>
            <Badge variant="outline">
              <Loader2 className="size-3 animate-spin" />
              Outline
            </Badge>
          </div>
        </SpecimenStage>
        <SpecimenStage title="asChild" bodyClassName="grid min-h-36 place-items-center">
          <div className="flex flex-wrap items-center gap-2">
            <Badge asChild>
              <a href="#badge-link">
                Default
                <ExternalLink className="size-3" />
              </a>
            </Badge>
            <Badge asChild variant="secondary">
              <a href="#badge-link-secondary">
                Secondary
                <ExternalLink className="size-3" />
              </a>
            </Badge>
            <Badge asChild variant="destructive">
              <a href="#badge-link-destructive">
                Destructive
                <ExternalLink className="size-3" />
              </a>
            </Badge>
            <Badge asChild variant="outline">
              <a href="#badge-link-outline">
                Outline
                <ExternalLink className="size-3" />
              </a>
            </Badge>
          </div>
        </SpecimenStage>
        <SpecimenStage title="Long Text" bodyClassName="grid min-h-36 place-items-center">
          <Badge variant="secondary" className="max-w-full whitespace-normal text-left">
            A badge with a lot of text to see how it wraps
          </Badge>
        </SpecimenStage>
      </>
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
      <>
        <SpecimenStage title="Dropdown menu trigger">
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
        <SpecimenStage title="Dropdown menu anatomy">
          <div className="w-56 border bg-popover p-1 text-popover-foreground shadow-sm">
            <p className="px-2 py-1.5 font-mono text-xs">Catalog</p>
            <div className="px-2 py-1.5 text-sm">Preview</div>
            <div className="px-2 py-1.5 text-sm">Open source</div>
            <Separator className="my-1" />
            <div className="flex items-center justify-between px-2 py-1.5 text-sm">
              Verified
              <Check className="size-4" />
            </div>
          </div>
        </SpecimenStage>
      </>
    );
  }

  if (item.id === "context-menu") {
    return (
      <>
        <SpecimenStage title="Context menu trigger">
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
        <SpecimenStage title="Context menu anatomy">
          <div className="w-56 border bg-popover p-1 text-popover-foreground shadow-sm">
            <div className="px-2 py-1.5 text-sm">Open</div>
            <div className="px-2 py-1.5 text-sm">Duplicate</div>
            <Separator className="my-1" />
            <div className="flex items-center justify-between px-2 py-1.5 text-sm">
              Inspect
              <span className="font-mono text-xs text-muted-foreground">⌘I</span>
            </div>
          </div>
        </SpecimenStage>
      </>
    );
  }

  if (item.id === "menubar") {
    return (
      <>
        <SpecimenStage title="Menubar trigger">
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
        <SpecimenStage title="Menubar menu anatomy">
          <div className="w-56 border bg-popover p-1 text-popover-foreground shadow-sm">
            <div className="px-2 py-1.5 text-sm">New capture</div>
            <div className="flex items-center justify-between px-2 py-1.5 text-sm">
              Save
              <span className="font-mono text-xs text-muted-foreground">⌘S</span>
            </div>
            <Separator className="my-1" />
            <div className="px-2 py-1.5 text-sm">Export</div>
          </div>
        </SpecimenStage>
      </>
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
      <>
        <SpecimenStage title="Inline code">
          <div className="space-y-3 text-sm">
            <p>
              Import <Code>@kkb/ui/components/code</Code>
            </p>
            <p>
              Use <Code>item=button</Code> for direct catalog routes.
            </p>
          </div>
        </SpecimenStage>
        <SpecimenStage title="Code in dense copy">
          <div className="grid gap-3 border bg-muted/20 p-3 text-sm">
            <p>
              Keep package paths legible beside prose: <Code>@kkb/ui/json-render</Code>.
            </p>
            <p className="font-mono text-xs text-muted-foreground">
              Code stays compact without taking over the whole surface.
            </p>
          </div>
        </SpecimenStage>
      </>
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
      <>
        <SpecimenStage title="Carousel viewport" className="md:col-span-2">
          <CarouselDemo />
        </SpecimenStage>
        <SpecimenStage title="Carousel controls">
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm">
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
            <span className="font-mono text-xs text-muted-foreground">slide 1 / 5</span>
          </div>
        </SpecimenStage>
      </>
    );
  }

  if (item.id.startsWith("json-render")) {
    return (
      <>
        <SpecimenStage title={`${item.label} source`}>
          <div className="grid gap-3 border bg-muted/20 p-4 font-mono text-xs">
            <span>{item.source}</span>
            <Code>{`{ "component": "${item.label}", "status": "registered" }`}</Code>
          </div>
        </SpecimenStage>
        <SpecimenStage title={`${item.label} contract`}>
          <div className="grid gap-2 border p-3 text-sm">
            <div className="flex items-center justify-between gap-3">
              <span>registry entry</span>
              <Badge variant="outline">stable</Badge>
            </div>
            <Separator />
            <p className="text-muted-foreground">
              JSON render routes stay compact, but expose source and registration state.
            </p>
          </div>
        </SpecimenStage>
      </>
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
