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
  ComboboxTrigger,
} from "@kkb/ui/components/combobox";
import { Command, CommandInput, CommandItem, CommandList } from "@kkb/ui/components/command";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
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
  DropdownMenuGroup,
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@kkb/ui/components/form";
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
  MenubarGroup,
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
import { Popover, PopoverContent, PopoverTitle, PopoverTrigger } from "@kkb/ui/components/popover";
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
import { Toaster, toast } from "@kkb/ui/components/sonner";
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
import { ArrowSquareOutIcon } from "@phosphor-icons/react/dist/csr/ArrowSquareOut";
import { BellIcon } from "@phosphor-icons/react/dist/csr/Bell";
import { CheckIcon } from "@phosphor-icons/react/dist/csr/Check";
import { CubeIcon } from "@phosphor-icons/react/dist/csr/Cube";
import { CubeFocusIcon } from "@phosphor-icons/react/dist/csr/CubeFocus";
import { DownloadIcon } from "@phosphor-icons/react/dist/csr/Download";
import { EnvelopeIcon } from "@phosphor-icons/react/dist/csr/Envelope";
import { GearIcon } from "@phosphor-icons/react/dist/csr/Gear";
import { MagnifyingGlassIcon } from "@phosphor-icons/react/dist/csr/MagnifyingGlass";
import { PlusIcon } from "@phosphor-icons/react/dist/csr/Plus";
import { SlidersHorizontalIcon } from "@phosphor-icons/react/dist/csr/SlidersHorizontal";
import { SpinnerGapIcon } from "@phosphor-icons/react/dist/csr/SpinnerGap";
import { SquaresFourIcon } from "@phosphor-icons/react/dist/csr/SquaresFour";
import { WarningCircleIcon } from "@phosphor-icons/react/dist/csr/WarningCircle";
import { XIcon } from "@phosphor-icons/react/dist/csr/X";
import * as React from "react";
import { useForm } from "react-hook-form";

import { CatalogCoverageChart } from "./catalog-chart";
import {
  type CatalogItem,
  componentItems,
  itemFromId,
  type VisualCatalogId,
  visualCatalogIds,
} from "./catalog-data";
import { CatalogItemIcon } from "./catalog-icons";
import { chartData } from "./catalog-preview-data";
import { DemoBoundary, SpecimenStage } from "./catalog-surface-shared";
import { PlayerControlsDemo, PlayheadDemo, WaveformDemo } from "./demos/audio-demo";
import { CarouselDemo } from "./demos/carousel-demo";
import { CalendarDemo } from "./demos/select-calendar-demo";
import { UtilitiesExamples } from "./utility-examples";

export function FocusedComponentSurface({ item }: { item: CatalogItem }) {
  return (
    <div
      className="min-h-full bg-background p-4 md:p-6"
      data-focused-component={item.entryType === "visual" ? item.id : undefined}
      data-supporting-entry={item.entryType !== "visual" ? item.entryType : undefined}
    >
      <div className="grid gap-x-8 gap-y-6 md:grid-cols-2">{renderFocusedExamples(item)}</div>
    </div>
  );
}

function renderFocusedExamples(item: CatalogItem) {
  return (
    <DemoBoundary key={item.id}>
      <FocusedExamplesSelection item={item} />
    </DemoBoundary>
  );
}

function FocusedExamplesSelection({ item }: { item: CatalogItem }) {
  if (item.entryType !== "visual") {
    return supportingExamplesFor(item);
  }

  const visualId = visualCatalogIds.find((id) => id === item.id);
  if (!visualId) {
    throw new Error(`Unknown visual catalog component: ${item.id}`);
  }

  return focusedExamplesFor(visualId, item);
}

function supportingExamplesFor(item: CatalogItem) {
  if (item.category === "Audio") {
    return <FocusedAudioExamples item={item} />;
  }

  if (item.entryType === "integration") {
    return <DataExamples item={item} />;
  }

  return <UtilitiesExamples item={item} />;
}

function focusedExamplesFor(visualId: VisualCatalogId, item: CatalogItem) {
  switch (visualId) {
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
      return <AccordionSpecimen />;
    case "collapsible":
      return <CollapsibleSpecimen />;
    case "alert-dialog":
      return <AlertDialogSpecimen />;
    case "drawer":
      return <DrawerSpecimen />;
    case "sheet":
      return <SheetSpecimen />;
    case "popover":
      return <PopoverSpecimen />;
    case "hover-card":
      return <HoverCardSpecimen />;
    case "tooltip":
      return <TooltipSpecimen />;
    case "toggle":
      return <ToggleSpecimen />;
    case "toggle-group":
      return <ToggleGroupSpecimen />;
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
    case "mode-toggle":
      return <UtilitiesExamples item={item} />;
    case "audio-player-controls":
    case "audio-playhead":
    case "audio-waveform":
      return <FocusedAudioExamples item={item} />;
  }

  visualId satisfies never;
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
              ["accent", "bg-audio-accent text-audio-accent-foreground"],
              ["panel", "bg-audio-panel text-audio-title"],
              ["control", "bg-audio-control text-audio-accent-foreground"],
              ["meta", "bg-audio-accent-softer text-foreground"],
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

  if (item.id === "audio-presenter") {
    return (
      <>
        <SpecimenStage title="Audio Presenter state derivation">
          <div className="grid gap-2 border p-3 text-sm">
            <div className="flex items-center justify-between gap-3">
              <span>runtime state</span>
              <Code>playing</Code>
            </div>
            <Separator />
            <div className="flex items-center justify-between gap-3">
              <span>presentation state</span>
              <Code>pause / 00:42</Code>
            </div>
          </div>
        </SpecimenStage>
        <SpecimenStage title="Audio Presenter source contract">
          <Code>{item.source}</Code>
        </SpecimenStage>
      </>
    );
  }

  throw new Error(`Missing focused audio specimen: ${item.id}`);
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
              <GearIcon aria-hidden="true" focusable="false" className="size-4" />
            </Button>
          </div>
        </div>
      </SpecimenStage>
      <SpecimenStage title="Icons and states">
        <div className="flex flex-wrap items-center gap-2">
          <Button>
            <PlusIcon aria-hidden="true" focusable="false" className="size-4" />
            Add source
          </Button>
          <Button variant="outline">
            Download
            <DownloadIcon aria-hidden="true" focusable="false" className="size-4" />
          </Button>
          <Button disabled>
            <SpinnerGapIcon aria-hidden="true" focusable="false" className="size-4 animate-spin" />
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
              <SquaresFourIcon aria-hidden="true" focusable="false" className="size-4" />
            </Button>
            <Button variant="outline" size="icon" aria-label="Tune">
              <SlidersHorizontalIcon aria-hidden="true" focusable="false" className="size-4" />
            </Button>
            <Button variant="outline" size="icon" aria-label="Confirm">
              <CheckIcon aria-hidden="true" focusable="false" className="size-4" />
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
            <Progress value={68} aria-label="Review progress" />
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
              <EnvelopeIcon aria-hidden="true" focusable="false" className="size-4" />
            </InputGroupAddon>
            <InputGroupInput id="input-email" placeholder="kalyn@example.com" />
          </InputGroup>
          <FieldDescription>Used for compact settings and route filters.</FieldDescription>
        </Field>
      </SpecimenStage>
      <SpecimenStage title="Grouped search">
        <Field>
          <FieldLabel htmlFor="grouped-search">Filter components</FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <MagnifyingGlassIcon aria-hidden="true" focusable="false" className="size-4" />
              <InputGroupText>Filter</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput id="grouped-search" defaultValue="button" />
            <InputGroupAddon align="inline-end">
              <InputGroupButton size="icon-xs" variant="ghost" aria-label="Clear filter">
                <XIcon aria-hidden="true" focusable="false" className="size-3" />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </Field>
      </SpecimenStage>
    </>
  );
}

function DialogSpecimen() {
  return (
    <>
      <SpecimenStage title="Trigger and modal">
        <Dialog>
          <DialogTrigger render={<Button />}>Open dialog</DialogTrigger>
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

function ToggleSpecimen() {
  return (
    <>
      <SpecimenStage title="Toggle states">
        <div className="flex flex-wrap items-center gap-2">
          <Toggle defaultPressed>
            <SquaresFourIcon aria-hidden="true" focusable="false" className="size-4" />
            Grid
          </Toggle>
          <Toggle aria-invalid>Invalid</Toggle>
          <Toggle disabled>Disabled</Toggle>
        </div>
      </SpecimenStage>
      <SpecimenStage title="Toggle variants">
        <div className="flex flex-wrap items-center gap-2">
          <Toggle variant="default">Default</Toggle>
          <Toggle variant="outline" defaultPressed>
            Outline
          </Toggle>
          <Toggle size="sm">Small</Toggle>
        </div>
      </SpecimenStage>
    </>
  );
}

function ToggleGroupSpecimen() {
  return (
    <>
      <SpecimenStage title="Toggle Group single choice">
        <ToggleGroup type="single" defaultValue="preview">
          <ToggleGroupItem value="preview">Preview</ToggleGroupItem>
          <ToggleGroupItem value="source">Source</ToggleGroupItem>
        </ToggleGroup>
      </SpecimenStage>
      <SpecimenStage title="Toggle Group multiple choice">
        <ToggleGroup type="multiple" defaultValue={["labels"]}>
          <ToggleGroupItem value="labels">Labels</ToggleGroupItem>
          <ToggleGroupItem value="stats">Stats</ToggleGroupItem>
          <ToggleGroupItem value="grid" disabled>
            Grid
          </ToggleGroupItem>
        </ToggleGroup>
      </SpecimenStage>
    </>
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

  if (item.id === "select") {
    return (
      <>
        <SpecimenStage title="Select states">
          <div className="grid gap-3">
            <Select defaultValue="preview">
              <SelectTrigger aria-label="Preview mode">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="preview">Preview</SelectItem>
                <SelectItem value="focused">Focused</SelectItem>
              </SelectContent>
            </Select>
            <Select disabled>
              <SelectTrigger aria-label="Disabled mode">
                <SelectValue placeholder="Disabled" />
              </SelectTrigger>
            </Select>
          </div>
        </SpecimenStage>
        <SpecimenStage title="Select field context">
          <Field>
            <FieldLabel>Catalog view</FieldLabel>
            <Select defaultValue="components">
              <SelectTrigger aria-label="Catalog view">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="components">Components</SelectItem>
                <SelectItem value="tokens">Tokens</SelectItem>
              </SelectContent>
            </Select>
            <FieldDescription>Single-choice popup selection.</FieldDescription>
          </Field>
        </SpecimenStage>
      </>
    );
  }

  if (item.id === "native-select") {
    return (
      <>
        <SpecimenStage title="Native Select states">
          <div className="grid gap-3">
            <NativeSelect defaultValue="compact" aria-label="Density">
              <NativeSelectOption value="compact">Compact</NativeSelectOption>
              <NativeSelectOption value="roomy">Roomy</NativeSelectOption>
            </NativeSelect>
            <NativeSelect disabled aria-label="Disabled density">
              <NativeSelectOption>Unavailable</NativeSelectOption>
            </NativeSelect>
          </div>
        </SpecimenStage>
        <SpecimenStage title="Native Select field context">
          <Field>
            <FieldLabel htmlFor="native-density">Density</FieldLabel>
            <NativeSelect id="native-density" defaultValue="balanced">
              <NativeSelectOption value="compact">Compact</NativeSelectOption>
              <NativeSelectOption value="balanced">Balanced</NativeSelectOption>
            </NativeSelect>
            <FieldDescription>Uses the platform selection surface.</FieldDescription>
          </Field>
        </SpecimenStage>
      </>
    );
  }

  if (item.id === "combobox") {
    return <ComboboxExamples />;
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
            <Slider defaultValue={[24]} max={100} getAriaLabel={() => "Low density"} />
            <Slider defaultValue={[64]} max={100} getAriaLabel={() => "Medium density"} />
            <Slider defaultValue={[92]} max={100} getAriaLabel={() => "High density"} />
          </div>
        </SpecimenStage>
        <SpecimenStage title="Slider density control">
          <Field>
            <FieldLabel>Preview density</FieldLabel>
            <Slider defaultValue={[72]} max={100} getAriaLabel={() => "Preview density"} />
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
            <Textarea aria-label="Empty handoff note" placeholder="Write a handoff note" />
            <Textarea
              aria-label="Completed handoff note"
              defaultValue="Focused routes should show component-specific states."
            />
            <Textarea
              aria-label="Locked handoff note"
              disabled
              defaultValue="Locked after publish."
            />
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

  if (item.id === "field") {
    return (
      <>
        <SpecimenStage title="Field anatomy">
          <Field>
            <FieldLabel htmlFor="field-source">Source path</FieldLabel>
            <Input id="field-source" defaultValue="@kkb/ui/components/input" />
            <FieldDescription>Label, control, and help text stay grouped.</FieldDescription>
          </Field>
        </SpecimenStage>
        <SpecimenStage title="Field validation state">
          <Field data-invalid>
            <FieldLabel htmlFor="field-invalid">Import path</FieldLabel>
            <Input id="field-invalid" aria-invalid defaultValue="missing" />
            <FieldDescription className="text-destructive">
              Use the public package export path.
            </FieldDescription>
          </Field>
        </SpecimenStage>
      </>
    );
  }

  if (item.id === "label") {
    return (
      <>
        <SpecimenStage title="Label associations">
          <div className="grid gap-2">
            <Label htmlFor="label-source">Source path</Label>
            <Input id="label-source" defaultValue="@kkb/ui/components/label" />
          </div>
        </SpecimenStage>
        <SpecimenStage title="Label with required control">
          <div className="grid gap-2">
            <Label htmlFor="label-required">
              Component name <span aria-hidden="true">*</span>
            </Label>
            <Input id="label-required" required aria-required="true" />
          </div>
        </SpecimenStage>
      </>
    );
  }

  if (item.id === "form") {
    return <FormSpecimen />;
  }

  if (item.id === "input-group") {
    return (
      <>
        <SpecimenStage title="Input Group addons">
          <InputGroup>
            <InputGroupAddon>
              <MagnifyingGlassIcon aria-hidden="true" focusable="false" className="size-4" />
              <InputGroupText>Filter</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput aria-label="Filter components" defaultValue="card" />
            <InputGroupAddon align="inline-end">
              <InputGroupButton size="icon-xs" variant="ghost" aria-label="Clear">
                <XIcon aria-hidden="true" focusable="false" className="size-3" />
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
          <InputOTP maxLength={6} aria-label="Segmented verification code">
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
            <FieldLabel htmlFor="verification-code">Verification code</FieldLabel>
            <InputOTP id="verification-code" maxLength={6}>
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
            <FieldDescription>Six slots with separator rhythm.</FieldDescription>
          </Field>
        </SpecimenStage>
      </>
    );
  }

  throw new Error(`Missing focused input specimen: ${item.id}`);
}

function ComboboxExamples() {
  const [selectedComponent, setSelectedComponent] = React.useState("button");

  return (
    <>
      <SpecimenStage title="Combobox search">
        <Combobox items={["button", "input", "audio waveform"]} autoHighlight modal={false}>
          <ComboboxTrigger aria-label="Open component search" render={<Button variant="outline" />}>
            Open component search
          </ComboboxTrigger>
          <ComboboxContent>
            <ComboboxInput
              aria-label="Search components"
              placeholder="Search components"
              showTrigger={false}
            />
            <ComboboxList>
              {(value: string) => (
                <ComboboxItem key={value} value={value}>
                  {value}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </SpecimenStage>
      <SpecimenStage title="Combobox field context">
        <Field>
          <FieldLabel htmlFor="focused-component-combobox-trigger">Component</FieldLabel>
          <Combobox
            items={["alert", "badge", "button", "audio waveform"]}
            value={selectedComponent}
            onValueChange={(value) => setSelectedComponent(value ?? "")}
            autoHighlight
            modal={false}
            defaultOpen
          >
            <ComboboxTrigger
              id="focused-component-combobox-trigger"
              render={<Button variant="outline" />}
            >
              {selectedComponent}
            </ComboboxTrigger>
            <ComboboxContent>
              <ComboboxInput
                aria-label="Search available components"
                placeholder="Find a component"
                showTrigger={false}
              />
              <ComboboxList>
                {(value: string) => (
                  <ComboboxItem key={value} value={value}>
                    {value}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
          <FieldDescription>Searchable single selection.</FieldDescription>
          <p aria-live="polite" className="text-sm text-muted-foreground">
            Selected: {selectedComponent || "none"}
          </p>
        </Field>
      </SpecimenStage>
    </>
  );
}

function FormSpecimen() {
  const form = useForm<{ title: string }>({ defaultValues: { title: "UI catalog route audit" } });

  return (
    <>
      <SpecimenStage title="Form field contract">
        <Form {...form}>
          <FormField
            control={form.control}
            name="title"
            rules={{ required: "Report title is required." }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Report title</FormLabel>
                <FormControl render={<Input {...field} />} />
                <FormDescription>Label and description IDs are composed by Form.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </Form>
      </SpecimenStage>
      <SpecimenStage title="Form provider boundary">
        <div className="grid gap-3 border p-3 text-sm">
          <Code>FormProvider</Code>
          <p className="text-muted-foreground">
            Form state and field relationships remain inside the shared provider contract.
          </p>
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
              <CubeIcon aria-hidden="true" focusable="false" className="size-5" />
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

  throw new Error(`Missing focused layout specimen: ${item.id}`);
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

  if (item.id === "sidebar") {
    return (
      <>
        <SpecimenStage title="Sidebar expanded state" className="md:col-span-2">
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
                              <CubeFocusIcon aria-hidden="true" focusable="false" />
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
        <SpecimenStage title="Sidebar navigation items">
          <div className="grid gap-1 border p-2 font-mono text-sm">
            <div className="bg-accent px-2 py-1.5">Preview</div>
            <div className="px-2 py-1.5 text-muted-foreground">Tokens</div>
            <div className="px-2 py-1.5 text-muted-foreground">Components</div>
          </div>
        </SpecimenStage>
      </>
    );
  }

  if (item.id === "navigation-menu") {
    return (
      <>
        <SpecimenStage title="Navigation Menu trigger">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Catalog</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-64 p-3">
                    <NavigationMenuLink className="block p-2 text-sm hover:bg-accent">
                      Components
                    </NavigationMenuLink>
                    <NavigationMenuLink className="block p-2 text-sm hover:bg-accent">
                      Tokens
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </SpecimenStage>
        <SpecimenStage title="Navigation Menu links">
          <NavigationMenu>
            <NavigationMenuList className="grid w-64 gap-1 border bg-popover p-2 text-popover-foreground">
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/ui?item=preview"
                  className="block p-2 text-sm hover:bg-accent"
                >
                  Components
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/ui?item=design-system"
                  className="block p-2 text-sm hover:bg-accent"
                >
                  Tokens
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </SpecimenStage>
      </>
    );
  }

  throw new Error(`Missing focused navigation specimen: ${item.id}`);
}

function AccordionSpecimen() {
  return (
    <>
      <SpecimenStage title="Accordion expanded state">
        <Accordion type="single" collapsible defaultValue="one">
          <AccordionItem value="one">
            <AccordionTrigger>What does Preview show?</AccordionTrigger>
            <AccordionContent>Every supported public visual component.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="two">
            <AccordionTrigger>What does search include?</AccordionTrigger>
            <AccordionContent>Views, components, and supporting entries.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </SpecimenStage>
      <SpecimenStage title="Accordion collapsed state">
        <Accordion type="single" collapsible>
          <AccordionItem value="one">
            <AccordionTrigger>Collapsed item</AccordionTrigger>
            <AccordionContent>Hidden until expanded.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </SpecimenStage>
    </>
  );
}

function CollapsibleSpecimen() {
  return (
    <>
      <SpecimenStage title="Collapsible open state">
        <Collapsible defaultOpen>
          <div className="flex items-center justify-between gap-4">
            <p className="font-mono text-sm">Implementation notes</p>
            <CollapsibleTrigger render={<Button variant="ghost" size="sm" />}>
              Toggle
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="pt-3 text-sm leading-6 text-muted-foreground">
            Keep demo islands focused and use shared primitives.
          </CollapsibleContent>
        </Collapsible>
      </SpecimenStage>
      <SpecimenStage title="Collapsible closed state">
        <Collapsible>
          <div className="flex items-center justify-between gap-4">
            <p className="font-mono text-sm">Source details</p>
            <CollapsibleTrigger render={<Button variant="outline" size="sm" />}>
              Reveal
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="pt-3 text-sm text-muted-foreground">
            @kkb/ui/components/collapsible
          </CollapsibleContent>
        </Collapsible>
      </SpecimenStage>
    </>
  );
}

function DrawerSpecimen() {
  return (
    <>
      <SpecimenStage title="Drawer trigger">
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline">Open drawer</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Mobile tray</DrawerTitle>
              <DrawerDescription>Bottom-mounted support surface.</DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <Button>Done</Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </SpecimenStage>
      <SpecimenStage title="Drawer bottom-sheet anatomy">
        <div className="border bg-background p-4">
          <div className="mx-auto mb-4 h-2 w-20 rounded-full bg-muted" />
          <p className="font-mono text-sm font-semibold">Mobile tray</p>
          <p className="mt-1 text-sm text-muted-foreground">Drag handle and stacked content.</p>
        </div>
      </SpecimenStage>
    </>
  );
}

function SheetSpecimen() {
  return (
    <>
      <SpecimenStage title="Sheet trigger">
        <Sheet>
          <SheetTrigger render={<Button variant="outline" />}>Open sheet</SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Component metadata</SheetTitle>
              <SheetDescription>Source, category, and states.</SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </SpecimenStage>
      <SpecimenStage title="Sheet side-panel anatomy">
        <div className="ml-auto min-h-44 w-3/4 border-l bg-background p-4 shadow-sm">
          <p className="font-mono text-sm font-semibold">Component metadata</p>
          <p className="mt-2 text-sm text-muted-foreground">Right-aligned supporting surface.</p>
        </div>
      </SpecimenStage>
    </>
  );
}

function PopoverSpecimen() {
  return (
    <>
      <SpecimenStage title="Popover trigger">
        <Popover>
          <PopoverTrigger render={<Button variant="outline" />}>Open popover</PopoverTrigger>
          <PopoverContent className="w-64">
            <PopoverTitle>Preview controls</PopoverTitle>
            <p className="mt-2 text-sm text-muted-foreground">Tune density and component state.</p>
          </PopoverContent>
        </Popover>
      </SpecimenStage>
      <SpecimenStage title="Popover content anatomy">
        <div className="w-64 border bg-popover p-4 text-popover-foreground shadow-sm">
          <p className="font-mono text-sm font-semibold">Preview controls</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Context stays anchored to its trigger.
          </p>
        </div>
      </SpecimenStage>
    </>
  );
}

function HoverCardSpecimen() {
  return (
    <>
      <SpecimenStage title="Hover Card trigger">
        <HoverCard>
          <HoverCardTrigger render={<Button variant="outline" />}>
            Hover for metadata
          </HoverCardTrigger>
          <HoverCardContent>
            <p className="font-mono text-sm">@kkb/ui/components/hover-card</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Preview metadata without leaving flow.
            </p>
          </HoverCardContent>
        </HoverCard>
      </SpecimenStage>
      <SpecimenStage title="Hover Card preview anatomy">
        <div className="w-72 border bg-popover p-4 text-popover-foreground shadow-sm">
          <p className="font-mono text-sm">Hover Card</p>
          <p className="mt-2 text-sm text-muted-foreground">Non-modal, pointer-adjacent detail.</p>
        </div>
      </SpecimenStage>
    </>
  );
}

function TooltipSpecimen() {
  return (
    <TooltipProvider>
      <SpecimenStage title="Tooltip trigger">
        <Tooltip>
          <TooltipTrigger
            render={<Button variant="outline" size="icon" aria-label="Show status tooltip" />}
          >
            <BellIcon aria-hidden="true" focusable="false" className="size-4" />
          </TooltipTrigger>
          <TooltipContent>Catalog status</TooltipContent>
        </Tooltip>
      </SpecimenStage>
      <SpecimenStage title="Tooltip content anatomy">
        <div className="inline-flex bg-primary px-3 py-1.5 text-xs text-primary-foreground">
          Catalog status
        </div>
      </SpecimenStage>
    </TooltipProvider>
  );
}

function AlertDialogSpecimen() {
  return (
    <>
      <SpecimenStage title="Destructive confirmation">
        <AlertDialog>
          <AlertDialogTrigger render={<Button variant="destructive" />}>
            Delete capture
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
      <SpecimenStage title="Decision anatomy">
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
            <CheckIcon aria-hidden="true" focusable="false" className="size-4" />
            <AlertTitle>Capture ready</AlertTitle>
            <AlertDescription>Waveform analysis completed.</AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <WarningCircleIcon aria-hidden="true" focusable="false" className="size-4" />
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
              <CheckIcon aria-hidden="true" focusable="false" className="size-3" />
              Default
            </Badge>
            <Badge variant="secondary">
              <CheckIcon aria-hidden="true" focusable="false" className="size-3" />
              Secondary
            </Badge>
            <Badge variant="destructive">
              <WarningCircleIcon aria-hidden="true" focusable="false" className="size-3" />
              Destructive
            </Badge>
            <Badge variant="outline">
              <CheckIcon aria-hidden="true" focusable="false" className="size-3" />
              Outline
            </Badge>
          </div>
        </SpecimenStage>
        <SpecimenStage title="Icon Right" bodyClassName="grid min-h-36 place-items-center">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>
              Default
              <CheckIcon aria-hidden="true" focusable="false" className="size-3" />
            </Badge>
            <Badge variant="secondary">
              Secondary
              <CheckIcon aria-hidden="true" focusable="false" className="size-3" />
            </Badge>
            <Badge variant="destructive">
              Destructive
              <XIcon aria-hidden="true" focusable="false" className="size-3" />
            </Badge>
            <Badge variant="outline">
              Outline
              <CheckIcon aria-hidden="true" focusable="false" className="size-3" />
            </Badge>
          </div>
        </SpecimenStage>
        <SpecimenStage title="With Spinner" bodyClassName="grid min-h-36 place-items-center">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>
              <SpinnerGapIcon
                aria-hidden="true"
                focusable="false"
                className="size-3 animate-spin"
              />
              Default
            </Badge>
            <Badge variant="secondary">
              <SpinnerGapIcon
                aria-hidden="true"
                focusable="false"
                className="size-3 animate-spin"
              />
              Secondary
            </Badge>
            <Badge variant="destructive">
              <SpinnerGapIcon
                aria-hidden="true"
                focusable="false"
                className="size-3 animate-spin"
              />
              Destructive
            </Badge>
            <Badge variant="outline">
              <SpinnerGapIcon
                aria-hidden="true"
                focusable="false"
                className="size-3 animate-spin"
              />
              Outline
            </Badge>
          </div>
        </SpecimenStage>
        <SpecimenStage title="render" bodyClassName="grid min-h-36 place-items-center">
          <div className="flex flex-wrap items-center gap-2">
            <Badge render={<a href="#badge-link" />}>
              Default
              <ArrowSquareOutIcon aria-hidden="true" focusable="false" className="size-3" />
            </Badge>
            <Badge variant="secondary" render={<a href="#badge-link-secondary" />}>
              Secondary
              <ArrowSquareOutIcon aria-hidden="true" focusable="false" className="size-3" />
            </Badge>
            <Badge variant="destructive" render={<a href="#badge-link-destructive" />}>
              Destructive
              <ArrowSquareOutIcon aria-hidden="true" focusable="false" className="size-3" />
            </Badge>
            <Badge variant="outline" render={<a href="#badge-link-outline" />}>
              Outline
              <ArrowSquareOutIcon aria-hidden="true" focusable="false" className="size-3" />
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
          <Progress value={28} aria-label="Initial progress" />
          <Progress value={64} aria-label="Current progress" />
          <Progress value={92} aria-label="Near-complete progress" />
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

  if (item.id === "spinner") {
    return (
      <SpecimenStage title="Spinner state" className="md:col-span-2">
        <div className="flex items-center gap-3">
          <Spinner />
          <span className="text-sm text-muted-foreground">Loading capture</span>
        </div>
      </SpecimenStage>
    );
  }

  if (item.id === "sonner") {
    return (
      <>
        <SpecimenStage title="Sonner toast trigger">
          <Button onClick={() => toast.success("Catalog verification complete")}>Show toast</Button>
          <Toaster position="bottom-right" />
        </SpecimenStage>
        <SpecimenStage title="Sonner toast anatomy">
          <div role="status" className="border bg-popover p-4 text-popover-foreground shadow-md">
            <p className="font-mono text-sm font-semibold">Catalog verification complete</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Inventory and specimen coverage are current.
            </p>
          </div>
        </SpecimenStage>
      </>
    );
  }

  throw new Error(`Missing focused feedback specimen: ${item.id}`);
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
            <DropdownMenuTrigger render={<Button variant="outline" />}>
              Open menu
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Catalog</DropdownMenuLabel>
                <DropdownMenuItem>Preview</DropdownMenuItem>
                <DropdownMenuItem>Open source</DropdownMenuItem>
                <DropdownMenuCheckboxItem checked>Verified</DropdownMenuCheckboxItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
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
              <CheckIcon aria-hidden="true" focusable="false" className="size-4" />
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
            <ContextMenuTrigger
              render={<button type="button" />}
              className="grid h-40 w-full place-items-center border bg-muted/20 text-sm text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              Right click or press Shift+F10
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuGroup>
                <ContextMenuItem>Open</ContextMenuItem>
                <ContextMenuItem>Duplicate</ContextMenuItem>
              </ContextMenuGroup>
              <ContextMenuSeparator />
              <ContextMenuGroup>
                <ContextMenuItem>
                  Inspect
                  <ContextMenuShortcut>⌘I</ContextMenuShortcut>
                </ContextMenuItem>
              </ContextMenuGroup>
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
                <MenubarGroup>
                  <MenubarItem>New capture</MenubarItem>
                  <MenubarItem>
                    Save
                    <MenubarShortcut>⌘S</MenubarShortcut>
                  </MenubarItem>
                </MenubarGroup>
                <MenubarSeparator />
                <MenubarGroup>
                  <MenubarItem>Export</MenubarItem>
                </MenubarGroup>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>View</MenubarTrigger>
              <MenubarContent>
                <MenubarGroup>
                  <MenubarItem>Preview</MenubarItem>
                  <MenubarItem>Components</MenubarItem>
                </MenubarGroup>
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

  throw new Error(`Missing focused menu specimen: ${item.id}`);
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
      <>
        <SpecimenStage title="Chart bars" className="md:col-span-2">
          <CatalogCoverageChart showValueTable={false} />
        </SpecimenStage>
        <SpecimenStage title="Chart accessible values">
          <Table>
            <TableCaption>Monthly component coverage.</TableCaption>
            <TableBody>
              {chartData.map(({ month, value }) => (
                <TableRow key={month}>
                  <TableCell>{month}</TableCell>
                  <TableCell>{value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </SpecimenStage>
      </>
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

  throw new Error(`Missing focused data specimen: ${item.id}`);
}
