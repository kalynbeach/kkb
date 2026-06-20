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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@kkb/ui/components/carousel";

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
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@kkb/ui/components/command";
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
  Activity,
  ArrowLeft,
  Bell,
  Boxes,
  Check,
  ChevronRight,
  CircleAlert,
  Component,
  Copy,
  Database,
  Gauge,
  Grid2X2,
  LayoutPanelTop,
  Menu,
  MousePointer2,
  Palette,
  PanelLeft,
  Search,
  Sparkles,
  SquareStack,
  Terminal,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

import { AudioSection } from "./sections/audio-section";
import { DataSection } from "./sections/data-section";
import { FeedbackSection } from "./sections/feedback-section";
import { InputSection } from "./sections/input-section";
import { LayoutSection } from "./sections/layout-section";
import { MenuSection } from "./sections/menu-section";
import { NavigationSection } from "./sections/navigation-section";
import { OverlaySection } from "./sections/overlay-section";

type CatalogKind = "view" | "category" | "component" | "utility";
type CatalogLane = "core" | "instrument" | "support";
type CatalogCategory =
  | "Design System"
  | "Layout"
  | "Navigation"
  | "Input"
  | "Feedback"
  | "Overlay"
  | "Menu"
  | "Data"
  | "Audio"
  | "Utilities";

type CatalogItem = {
  id: string;
  label: string;
  kind: CatalogKind;
  category: CatalogCategory;
  source: string;
  description: string;
  keywords: readonly string[];
  important?: boolean;
};

const categoryOrder: readonly CatalogCategory[] = [
  "Design System",
  "Layout",
  "Navigation",
  "Input",
  "Feedback",
  "Overlay",
  "Menu",
  "Data",
  "Audio",
  "Utilities",
];

const categoryMeta: Record<CatalogCategory, { description: string; icon: React.ElementType }> = {
  "Design System": {
    description: "KKB colors, typography, radius, spacing, and scoped instrument tokens.",
    icon: Palette,
  },
  Layout: {
    description: "Structural primitives, panels, cards, scroll regions, and empty states.",
    icon: LayoutPanelTop,
  },
  Navigation: {
    description: "Route orientation, progressive disclosure, tabs, and paging affordances.",
    icon: PanelLeft,
  },
  Input: {
    description: "Actions, fields, selection controls, grouped inputs, and forms.",
    icon: MousePointer2,
  },
  Feedback: {
    description: "System status, loading, skeletons, badges, and notifications.",
    icon: Activity,
  },
  Overlay: {
    description: "Dialogs, sheets, drawers, popovers, hover cards, and tooltips.",
    icon: SquareStack,
  },
  Menu: {
    description: "Command, dropdown, context, and menubar interaction surfaces.",
    icon: Menu,
  },
  Data: {
    description: "Tables, code, keyboard hints, charts, carousel, and json-render surfaces.",
    icon: Database,
  },
  Audio: {
    description: "KKB audio primitives and the instrument-grade audio composition.",
    icon: Gauge,
  },
  Utilities: {
    description: "Public hooks, providers, direction utilities, and supporting exports.",
    icon: Terminal,
  },
};

const railGroups: readonly {
  label: string;
  description: string;
  categories: readonly CatalogCategory[];
}[] = [
  {
    label: "Core bench",
    description: "Daily product primitives and system rules.",
    categories: ["Design System", "Input", "Layout", "Feedback"],
  },
  {
    label: "Instrument bays",
    description: "Scoped surfaces with stronger local identity.",
    categories: ["Audio", "Data"],
  },
  {
    label: "Interaction support",
    description: "Navigation, overlays, menus, and utilities.",
    categories: ["Navigation", "Overlay", "Menu", "Utilities"],
  },
];

const corePrimitiveIds = new Set([
  "design-system",
  "button",
  "field",
  "input",
  "select",
  "dialog",
  "table",
  "tabs",
  "sidebar",
]);

const instrumentBayIds = new Set([
  "category-audio",
  "audio-player-controls",
  "audio-playhead",
  "audio-waveform",
  "audio-presenter",
  "audio-theme",
]);

const catalogItems: readonly CatalogItem[] = [
  {
    id: "preview",
    label: "Preview",
    kind: "view",
    category: "Design System",
    source: "apps/web/app/ui/page.tsx?item=preview",
    description: "Dense overview of the KKB UI library and design-system surface.",
    keywords: ["overview", "all", "library"],
    important: true,
  },
  {
    id: "design-system",
    label: "Design System",
    kind: "view",
    category: "Design System",
    source: "DESIGN.md + packages/ui/src/styles/globals.css",
    description: "Live KKB tokens: color, type, radius, spacing, and scoped instrument palettes.",
    keywords: ["tokens", "colors", "typography", "radius", "spacing"],
    important: true,
  },
  ...(
    [
      ["layout", "Layout", "Layout", "Curated layout primitives and structural surfaces."],
      ["navigation", "Navigation", "Navigation", "Route orientation and movement primitives."],
      ["input", "Input", "Input", "Controls, fields, and forms."],
      ["feedback", "Feedback", "Feedback", "Feedback and status primitives."],
      ["overlay", "Overlay", "Overlay", "Layered interaction primitives."],
      ["menu", "Menu", "Menu", "Command and menu primitives."],
      ["data", "Data", "Data", "Dense data-display primitives."],
      ["audio", "Audio", "Audio", "Audio player and waveform primitives."],
      ["utilities", "Utilities", "Utilities", "Non-visual public utilities and providers."],
    ] as const
  ).map(
    ([id, label, category, description]) =>
      ({
        id: `category-${id}`,
        label: `${label} category`,
        kind: "category",
        category: category as CatalogCategory,
        source: `apps/web/components/ui-catalog/sections/${id}-section.tsx`,
        description,
        keywords: [id, label, "category"],
      }) satisfies CatalogItem,
  ),
  ...(
    [
      ["accordion", "Accordion", "Navigation", "@kkb/ui/components/accordion", true],
      ["alert-dialog", "Alert Dialog", "Overlay", "@kkb/ui/components/alert-dialog", true],
      ["alert", "Alert", "Feedback", "@kkb/ui/components/alert", true],
      ["aspect-ratio", "Aspect Ratio", "Layout", "@kkb/ui/components/aspect-ratio", false],
      ["avatar", "Avatar", "Feedback", "@kkb/ui/components/avatar", false],
      ["badge", "Badge", "Feedback", "@kkb/ui/components/badge", true],
      ["breadcrumb", "Breadcrumb", "Navigation", "@kkb/ui/components/breadcrumb", true],
      ["button", "Button", "Input", "@kkb/ui/components/button", true],
      ["button-group", "Button Group", "Input", "@kkb/ui/components/button-group", true],
      ["calendar", "Calendar", "Input", "@kkb/ui/components/calendar", true],
      ["card", "Card", "Layout", "@kkb/ui/components/card", true],
      ["carousel", "Carousel", "Data", "@kkb/ui/components/carousel", true],
      ["chart", "Chart", "Data", "@kkb/ui/components/chart", true],
      ["checkbox", "Checkbox", "Input", "@kkb/ui/components/checkbox", true],
      ["code", "Code", "Data", "@kkb/ui/components/code", false],
      ["collapsible", "Collapsible", "Navigation", "@kkb/ui/components/collapsible", false],
      ["combobox", "Combobox", "Input", "@kkb/ui/components/combobox", true],
      ["command", "Command", "Menu", "@kkb/ui/components/command", true],
      ["context-menu", "Context Menu", "Menu", "@kkb/ui/components/context-menu", true],
      ["dialog", "Dialog", "Overlay", "@kkb/ui/components/dialog", true],
      ["direction", "Direction Provider", "Utilities", "@kkb/ui/components/direction", false],
      ["drawer", "Drawer", "Overlay", "@kkb/ui/components/drawer", true],
      ["dropdown-menu", "Dropdown Menu", "Menu", "@kkb/ui/components/dropdown-menu", true],
      ["empty", "Empty", "Layout", "@kkb/ui/components/empty", false],
      ["field", "Field", "Input", "@kkb/ui/components/field", true],
      ["form", "Form", "Input", "@kkb/ui/components/form", true],
      ["hover-card", "Hover Card", "Overlay", "@kkb/ui/components/hover-card", false],
      ["input", "Input", "Input", "@kkb/ui/components/input", true],
      ["input-group", "Input Group", "Input", "@kkb/ui/components/input-group", true],
      ["input-otp", "Input OTP", "Input", "@kkb/ui/components/input-otp", false],
      ["item", "Item", "Layout", "@kkb/ui/components/item", false],
      ["kbd", "Kbd", "Data", "@kkb/ui/components/kbd", false],
      ["label", "Label", "Input", "@kkb/ui/components/label", false],
      ["menubar", "Menubar", "Menu", "@kkb/ui/components/menubar", true],
      ["mode-toggle", "Mode Toggle", "Utilities", "@kkb/ui/components/mode-toggle", true],
      ["native-select", "Native Select", "Input", "@kkb/ui/components/native-select", false],
      [
        "navigation-menu",
        "Navigation Menu",
        "Navigation",
        "@kkb/ui/components/navigation-menu",
        true,
      ],
      ["pagination", "Pagination", "Navigation", "@kkb/ui/components/pagination", false],
      ["popover", "Popover", "Overlay", "@kkb/ui/components/popover", true],
      ["progress", "Progress", "Feedback", "@kkb/ui/components/progress", false],
      ["radio-group", "Radio Group", "Input", "@kkb/ui/components/radio-group", false],
      ["resizable", "Resizable", "Layout", "@kkb/ui/components/resizable", true],
      ["scroll-area", "Scroll Area", "Layout", "@kkb/ui/components/scroll-area", false],
      ["select", "Select", "Input", "@kkb/ui/components/select", true],
      ["separator", "Separator", "Layout", "@kkb/ui/components/separator", false],
      ["sheet", "Sheet", "Overlay", "@kkb/ui/components/sheet", true],
      ["sidebar", "Sidebar", "Navigation", "@kkb/ui/components/sidebar", true],
      ["skeleton", "Skeleton", "Feedback", "@kkb/ui/components/skeleton", false],
      ["slider", "Slider", "Input", "@kkb/ui/components/slider", false],
      ["sonner", "Sonner", "Feedback", "@kkb/ui/components/sonner", false],
      ["spinner", "Spinner", "Feedback", "@kkb/ui/components/spinner", false],
      ["switch", "Switch", "Input", "@kkb/ui/components/switch", false],
      ["table", "Table", "Data", "@kkb/ui/components/table", true],
      ["tabs", "Tabs", "Navigation", "@kkb/ui/components/tabs", true],
      ["textarea", "Textarea", "Input", "@kkb/ui/components/textarea", false],
      ["theme-provider", "Theme Provider", "Utilities", "@kkb/ui/components/theme-provider", false],
      ["toggle", "Toggle", "Input", "@kkb/ui/components/toggle", false],
      ["toggle-group", "Toggle Group", "Input", "@kkb/ui/components/toggle-group", true],
      ["tooltip", "Tooltip", "Overlay", "@kkb/ui/components/tooltip", false],
      [
        "audio-player-controls",
        "Audio Player Controls",
        "Audio",
        "@kkb/ui/components/audio/player-controls",
        true,
      ],
      ["audio-playhead", "Audio Playhead", "Audio", "@kkb/ui/components/audio/playhead", false],
      ["audio-waveform", "Audio Waveform", "Audio", "@kkb/ui/components/audio/waveform", true],
      ["audio-presenter", "Audio Presenter", "Audio", "@kkb/ui/components/audio/presenter", true],
      ["audio-theme", "Audio Theme", "Audio", "@kkb/ui/components/audio/theme", false],
      ["use-mobile", "useIsMobile", "Utilities", "@kkb/ui/hooks/use-mobile", false],
      ["json-render", "JSON Render", "Data", "@kkb/ui/json-render", true],
      ["json-render-catalog", "JSON Render Catalog", "Data", "@kkb/ui/json-render/catalog", false],
      [
        "json-render-registry",
        "JSON Render Registry",
        "Data",
        "@kkb/ui/json-render/registry",
        false,
      ],
    ] as const
  ).map(
    ([id, label, category, source, important]) =>
      ({
        id: String(id),
        label: String(label),
        kind:
          String(source).startsWith("@kkb/ui/hooks") || String(source).includes("json-render")
            ? "utility"
            : "component",
        category: category as CatalogCategory,
        source: String(source),
        description: componentDescription(String(id), String(label), String(category)),
        keywords: [String(id), String(label), String(category), String(source)],
        important: Boolean(important),
      }) satisfies CatalogItem,
  ),
];

const componentItems = catalogItems.filter((item) => item.kind === "component");
const utilityItems = catalogItems.filter((item) => item.kind === "utility");
const allSelectableItems = catalogItems;

function componentDescription(id: string, label: string, category: string) {
  if (id.startsWith("audio-")) {
    return `${label} belongs to the scoped audio presentation layer and uses KKB instrument tokens.`;
  }
  if (id.startsWith("json-render")) {
    return `${label} supports JSON-driven rendering and registry workflows.`;
  }
  return `${label} is part of the ${category.toLowerCase()} surface in @kkb/ui.`;
}

function itemFromId(id: string | null): CatalogItem {
  const fallback = catalogItems[0];

  if (!fallback) {
    throw new Error("Catalog requires at least one item.");
  }

  return allSelectableItems.find((item) => item.id === id) ?? fallback;
}

function groupedItems() {
  return categoryOrder.map((category) => ({
    category,
    items: catalogItems.filter((item) => item.category === category && item.kind !== "view"),
  }));
}

function itemLane(item: CatalogItem): CatalogLane {
  if (instrumentBayIds.has(item.id) || item.category === "Audio") {
    return "instrument";
  }

  if (corePrimitiveIds.has(item.id) || item.important) {
    return "core";
  }

  return "support";
}

function laneLabel(lane: CatalogLane) {
  switch (lane) {
    case "core":
      return "core";
    case "instrument":
      return "bay";
    case "support":
      return "support";
  }
}

function itemsForCategory(category: CatalogCategory) {
  return catalogItems.filter((item) => item.category === category && item.id !== "preview");
}

export function CatalogWorkbench() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchOpen, setSearchOpen] = React.useState(false);
  const selectedItem = itemFromId(searchParams.get("item"));

  const selectItem = React.useCallback(
    (id: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("item", id);
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
      setSearchOpen(false);
      window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
    },
    [pathname, router, searchParams],
  );

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen((current) => !current);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <main className="h-screen overflow-hidden bg-background text-foreground">
      <CatalogSearchDialog
        open={searchOpen}
        selectedItemId={selectedItem.id}
        onOpenChange={setSearchOpen}
        onSelect={selectItem}
      />

      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="flex min-h-16 items-center gap-3 px-4 md:px-6">
          <Button variant="ghost" size="icon" asChild className="shrink-0">
            <Link href="/" aria-label="Return home">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <div className="min-w-0 flex-1">
            <p className="font-mono text-xs text-muted-foreground">@kkb/ui / catalog</p>
            <h1 className="truncate font-mono text-lg font-semibold tracking-[-0.01em]">
              {selectedItem.label}
            </h1>
          </div>
          <Button
            type="button"
            variant="outline"
            className="hidden min-w-72 justify-start gap-2 text-muted-foreground md:inline-flex"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="size-4" />
            Search catalog...
            <KbdGroup className="ml-auto">
              <Kbd>⌘</Kbd>
              <Kbd>K</Kbd>
            </KbdGroup>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="md:hidden"
            onClick={() => setSearchOpen(true)}
            aria-label="Search catalog"
          >
            <Search className="size-4" />
          </Button>
          <ModeToggle />
        </div>
      </header>

      <div className="grid h-[calc(100vh-4rem)] overflow-hidden lg:grid-cols-[276px_minmax(0,1fr)]">
        <CatalogRail selectedItemId={selectedItem.id} onSelect={selectItem} />
        <section className="min-w-0 overflow-y-auto border-l bg-muted/20 p-3 md:p-5">
          <div className="min-h-full overflow-hidden rounded-lg border bg-background shadow-none">
            {selectedItem.id === "preview" ? (
              <PreviewSurface onSelect={selectItem} />
            ) : selectedItem.id === "design-system" ? (
              <DesignSystemSurface />
            ) : selectedItem.id.startsWith("category-") ? (
              <CategorySurface item={selectedItem} />
            ) : (
              <FocusedComponentSurface item={selectedItem} onSelect={selectItem} />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function CatalogSearchDialog({
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

function CatalogRail({
  selectedItemId,
  onSelect,
}: {
  selectedItemId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <aside className="hidden h-[calc(100vh-4rem)] overflow-hidden bg-sidebar text-sidebar-foreground lg:block">
      <div className="flex h-full flex-col border-r">
        <div className="border-b p-4">
          <button
            type="button"
            onClick={() => onSelect("preview")}
            className={cn(
              "flex min-h-11 w-full items-center justify-between rounded-md border px-3 text-left font-mono text-sm transition-colors",
              selectedItemId === "preview"
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-background text-foreground hover:bg-accent",
            )}
          >
            <span>Preview</span>
            <Grid2X2 className="size-4" />
          </button>
        </div>
        <ScrollArea className="min-h-0 flex-1">
          <nav aria-label="UI catalog" className="space-y-6 p-4">
            {railGroups.map((group) => (
              <div key={group.label} className="space-y-3">
                <div className="space-y-1 px-2">
                  <p className="font-mono text-[11px] text-foreground">{group.label}</p>
                  <p className="text-xs leading-5 text-muted-foreground">{group.description}</p>
                </div>
                <div className="space-y-4">
                  {group.categories.map((category) => {
                    const items = itemsForCategory(category);
                    const meta = categoryMeta[category];
                    const Icon = meta.icon;

                    return (
                      <div key={category} className="space-y-2">
                        <div className="flex items-center justify-between gap-3 px-2 font-mono text-[11px] text-muted-foreground">
                          <span className="flex min-w-0 items-center gap-2">
                            <Icon className="size-3.5" />
                            <span className="truncate">{category}</span>
                          </span>
                          <span>{items.length}</span>
                        </div>
                        <div className="space-y-1">
                          {items.map((item) => {
                            const lane = itemLane(item);

                            return (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => onSelect(item.id)}
                                className={cn(
                                  "flex min-h-9 w-full items-center gap-2 rounded-md px-2 text-left text-sm transition-colors",
                                  selectedItemId === item.id
                                    ? "bg-accent text-accent-foreground"
                                    : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
                                )}
                              >
                                <CatalogItemIcon item={item} className="size-3.5" />
                                <span className="min-w-0 flex-1 truncate">{item.label}</span>
                                {lane !== "support" ? (
                                  <span className="rounded-sm border px-1.5 py-0.5 font-mono text-[10px] leading-none text-muted-foreground">
                                    {laneLabel(lane)}
                                  </span>
                                ) : null}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </ScrollArea>
        <div className="border-t p-4">
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-md border bg-border text-center font-mono text-xs">
            <div className="bg-sidebar p-2">
              <p className="text-muted-foreground">components</p>
              <p className="mt-1 text-foreground">{componentItems.length}</p>
            </div>
            <div className="bg-sidebar p-2">
              <p className="text-muted-foreground">exports</p>
              <p className="mt-1 text-foreground">{componentItems.length + utilityItems.length}</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function PreviewSurface({ onSelect }: { onSelect: (id: string) => void }) {
  const coreItems = componentItems.filter((item) => corePrimitiveIds.has(item.id));
  const supportItems = [...componentItems, ...utilityItems].filter(
    (item) => itemLane(item) === "support",
  );

  return (
    <div>
      <div className="grid gap-4 bg-background p-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div className="min-w-0 space-y-2">
          <p className="font-mono text-xs text-muted-foreground">workbench index</p>
          <h2 className="font-mono text-2xl font-semibold tracking-[-0.02em]">
            KKB UI surface map
          </h2>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
            Start with the core bench primitives, then move into scoped instrument bays or
            supporting exports. The catalog is organized for shipping decisions, not just export
            inventory.
          </p>
        </div>
        <Button type="button" variant="outline" onClick={() => onSelect("design-system")}>
          Inspect tokens
        </Button>
      </div>
      <div className="grid gap-px border-t bg-border xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
        <SignatureBays onSelect={onSelect} />
        <CorePrimitiveIndex items={coreItems} onSelect={onSelect} />
      </div>
      <div className="border-t bg-muted/20 p-4 md:p-5">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
          <CategoryPriorityIndex onSelect={onSelect} />
          <SupportExportIndex items={supportItems} onSelect={onSelect} />
        </div>
      </div>
    </div>
  );
}

function SignatureBays({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <section className="bg-background p-5">
      <div className="grid gap-4">
        <div className="space-y-1">
          <p className="font-mono text-xs text-muted-foreground">signature instrument bays</p>
          <h3 className="font-mono text-lg font-semibold tracking-[-0.01em]">
            Scoped surfaces with local physics
          </h3>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <SignatureBayButton
            title="Audio bay"
            label="waveform, transport, presenter"
            description="Uses audio blue, tactile shell depth, and runtime player composition without turning blue into a general accent."
            action="Open audio bay"
            icon={Gauge}
            onOpen={() => onSelect("category-audio")}
          />
          <SignatureBayButton
            title="Oscilloscope bay"
            label="P31 trace rules"
            description="Future scope components should inherit the trace/glow/floor language documented in the design-system tokens."
            action="Inspect scope tokens"
            icon={Activity}
            onOpen={() => onSelect("design-system")}
          />
        </div>
      </div>
    </section>
  );
}

function SignatureBayButton({
  title,
  label,
  description,
  action,
  icon: Icon,
  onOpen,
}: {
  title: string;
  label: string;
  description: string;
  action: string;
  icon: React.ElementType;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group grid min-h-60 content-between border border-audio-panel-border bg-[linear-gradient(180deg,var(--audio-panel-start),var(--audio-panel-mid),var(--audio-panel-end))] p-4 text-left text-audio-title transition-colors hover:border-audio-accent focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      <span className="flex items-start justify-between gap-3">
        <span className="space-y-1">
          <span className="block font-mono text-xs text-audio-meta">{label}</span>
          <span className="block font-mono text-xl font-semibold tracking-[-0.02em]">{title}</span>
        </span>
        <Icon className="size-5 text-audio-accent" />
      </span>
      <span className="space-y-4">
        <span className="block text-sm leading-6 text-audio-meta">{description}</span>
        <span className="inline-flex items-center gap-2 font-mono text-xs text-audio-accent">
          {action}
          <ChevronRight className="size-3" />
        </span>
      </span>
    </button>
  );
}

function CorePrimitiveIndex({
  items,
  onSelect,
}: {
  items: readonly CatalogItem[];
  onSelect: (id: string) => void;
}) {
  return (
    <section className="bg-background p-5">
      <div className="space-y-4">
        <div className="space-y-1">
          <p className="font-mono text-xs text-muted-foreground">core bench primitives</p>
          <h3 className="font-mono text-lg font-semibold tracking-[-0.01em]">
            Start here when composing product UI
          </h3>
        </div>
        <div className="divide-y border">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              className="grid w-full gap-3 bg-background p-3 text-left transition-colors hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
            >
              <span className="min-w-0">
                <span className="flex items-center gap-2 font-mono text-sm font-semibold">
                  <CatalogItemIcon item={item} className="size-4" />
                  {item.label}
                </span>
                <span className="mt-1 block text-sm leading-5 text-muted-foreground">
                  {focusedIntent(item)}
                </span>
              </span>
              <span className="font-mono text-[11px] text-muted-foreground">{item.source}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryPriorityIndex({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <section className="grid gap-3 md:grid-cols-2">
      {railGroups.map((group) => (
        <div key={group.label} className="border bg-background p-4">
          <div className="space-y-1">
            <p className="font-mono text-sm font-semibold">{group.label}</p>
            <p className="text-sm leading-6 text-muted-foreground">{group.description}</p>
          </div>
          <div className="mt-4 grid gap-2">
            {group.categories.map((category) => {
              const meta = categoryMeta[category];
              const Icon = meta.icon;
              const id = `category-${category.toLowerCase().replaceAll(" ", "-")}`;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => onSelect(id)}
                  className="flex min-h-11 items-center gap-3 border px-3 text-left text-sm transition-colors hover:border-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  <Icon className="size-4 shrink-0 text-muted-foreground" />
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium">{category}</span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {itemsForCategory(category).length} exports
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
}

function SupportExportIndex({
  items,
  onSelect,
}: {
  items: readonly CatalogItem[];
  onSelect: (id: string) => void;
}) {
  return (
    <section className="border bg-background p-4">
      <div className="space-y-1">
        <p className="font-mono text-sm font-semibold">Supporting exports</p>
        <p className="text-sm leading-6 text-muted-foreground">
          Lower-frequency utilities remain available without dominating the first scan.
        </p>
      </div>
      <div className="mt-4 grid gap-1">
        {items.slice(0, 18).map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            className="flex min-h-8 items-center gap-2 rounded-md px-2 text-left text-sm text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            <CatalogItemIcon item={item} className="size-3.5 shrink-0" />
            <span className="min-w-0 flex-1 truncate">{item.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function SurfaceHeader({ item, action }: { item: CatalogItem; action?: React.ReactNode }) {
  return (
    <div className="grid gap-4 bg-background p-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
      <div className="min-w-0 space-y-2">
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-muted-foreground">
          <span>{item.category}</span>
          <ChevronRight className="size-3" />
          <span>{item.kind}</span>
        </div>
        <h2 className="font-mono text-2xl font-semibold tracking-[-0.02em] text-balance">
          {item.label}
        </h2>
        <p className="max-w-3xl text-sm leading-6 text-muted-foreground text-pretty">
          {item.description}
        </p>
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
          <div className="grid gap-2 rounded-md border bg-muted/20 p-3 font-mono text-xs">
            <span className="text-muted-foreground">source</span>
            <span className="break-all">{item.source}</span>
          </div>
        }
      />
      <div className="border-t bg-muted/20 p-4 md:p-6">
        <div className="grid gap-5 xl:grid-cols-[340px_minmax(0,1fr)]">
          <FocusedComponentGuide item={item} onSelect={onSelect} />
          <div className="grid min-w-0 gap-4 md:grid-cols-2">{renderFocusedExamples(item)}</div>
        </div>
      </div>
    </div>
  );
}

function FocusedComponentGuide({
  item,
  onSelect,
}: {
  item: CatalogItem;
  onSelect: (id: string) => void;
}) {
  const stateRows = focusedStateRows(item);
  const related = relatedItems(item);

  return (
    <aside className="space-y-4">
      <div className="border bg-background p-4">
        <p className="font-mono text-sm font-semibold">Use when</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{focusedIntent(item)}</p>
        <div className="mt-4 grid gap-2">
          <p className="font-mono text-xs text-muted-foreground">import contract</p>
          <Code className="w-full break-all whitespace-normal">{sourceInstruction(item)}</Code>
        </div>
      </div>

      <div className="border bg-background p-4">
        <p className="font-mono text-sm font-semibold">State coverage</p>
        <div className="mt-3 divide-y">
          {stateRows.map(([label, value]) => (
            <div key={label} className="grid gap-2 py-2 text-sm">
              <span className="font-mono text-xs text-muted-foreground">{label}</span>
              <span className="leading-5">{value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="border bg-background p-4">
        <p className="font-mono text-sm font-semibold">Related components</p>
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
    </aside>
  );
}

function focusedIntent(item: CatalogItem) {
  if (item.category === "Audio") {
    return "Use inside audio runtime surfaces where waveform, transport, or presenter behavior needs the scoped instrument palette.";
  }

  if (item.id.startsWith("json-render")) {
    return "Use for JSON-driven rendering paths where registry behavior and inspectable payload output matter.";
  }

  switch (item.category) {
    case "Input":
      return "Use when a user changes catalog state, filters source, confirms a choice, or enters structured data.";
    case "Feedback":
      return "Use when the interface needs to report status, verification progress, loading shape, or a recoverable problem.";
    case "Overlay":
      return "Use only when inline disclosure cannot carry the task without losing context.";
    case "Menu":
      return "Use for dense command surfaces where keyboard and pointer access need the same vocabulary.";
    case "Navigation":
      return "Use when users need route position, local orientation, or fast movement across catalog surfaces.";
    case "Data":
      return "Use when the surface needs dense, inspectable values without turning into prose.";
    case "Layout":
      return "Use to frame, group, or progressively reveal product UI without inventing app-local containers.";
    case "Utilities":
      return "Use as app infrastructure; keep these visible but lower priority than user-facing primitives.";
    case "Design System":
      return "Use as the source of truth for KKB tokens, typography, radius, and scoped instrument color.";
  }
}

function focusedStateRows(item: CatalogItem): readonly (readonly [string, string])[] {
  if (item.category === "Feedback") {
    return [
      ["default", "neutral status copy names the current system condition"],
      ["loading", "skeleton or progress shows what is being verified"],
      ["error", "message includes a concrete retry or inspection path"],
      ["success", "confirmation explains what changed and what remains"],
    ];
  }

  if (item.category === "Input") {
    return [
      ["default", "label, value, and help text are visible without relying on placeholder copy"],
      ["focus", "keyboard ring stays visible against the current surface"],
      ["disabled", "non-interactive state keeps the label legible"],
      ["invalid", "error copy says what to fix and preserves the user's value"],
    ];
  }

  if (item.category === "Audio") {
    return [
      ["idle", "transport and waveform show safe defaults before playback"],
      ["playing", "progress and controls use audio blue only inside this bay"],
      ["buffering", "loading feedback distinguishes unavailable audio from paused audio"],
      ["error", "device or media failures need a recovery path before shipping"],
    ];
  }

  return [
    ["default", "resting state matches the shared @kkb/ui primitive"],
    ["hover/focus", "pointer and keyboard affordances are visible"],
    ["active/selected", "selected state uses semantic tokens, not decoration"],
    ["edge case", "long labels and dense content must wrap or truncate deliberately"],
  ];
}

function sourceInstruction(item: CatalogItem) {
  if (item.source.startsWith("@kkb/ui/")) {
    return `import from "${item.source}"`;
  }

  return item.source;
}

function relatedItems(item: CatalogItem) {
  return catalogItems
    .filter(
      (candidate) =>
        candidate.id !== item.id &&
        candidate.kind !== "view" &&
        candidate.category === item.category &&
        (candidate.important || candidate.kind === item.kind),
    )
    .slice(0, 4);
}

function CategorySurface({ item }: { item: CatalogItem }) {
  if (item.category === "Audio") {
    return <InstrumentCategorySurface item={item} />;
  }

  return (
    <div>
      <SurfaceHeader item={item} />
      <div className="border-t bg-muted/20 p-4 md:p-6">
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
      <div className="grid gap-5 border-b border-audio-panel-border bg-[linear-gradient(180deg,var(--audio-panel-start),var(--audio-panel-mid),var(--audio-panel-end))] p-5 text-audio-title lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-3">
          <p className="font-mono text-xs text-audio-meta">{item.source}</p>
          <h2 className="font-mono text-2xl font-semibold tracking-[-0.02em]">{item.label}</h2>
          <p className="max-w-3xl text-sm leading-6 text-audio-meta">
            Audio components are promoted as an instrument bay: waveform, transport, presenter, and
            theme exports share local depth and blue signal language without changing the general
            product palette.
          </p>
        </div>
        <div className="grid content-start gap-2 border border-audio-panel-border bg-background/5 p-3 font-mono text-xs">
          <span className="text-audio-meta">bay contract</span>
          <span>audio blue stays scoped</span>
          <span>transport states need recovery</span>
          <span>presenter owns composition</span>
        </div>
      </div>
      <div className="bg-muted/20 p-4 md:p-6">
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
  if (item.category === "Audio") {
    return <AudioSection />;
  }

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
      return <ComponentPreviewTile item={item} />;
  }
}

function ComponentPreviewTile({
  item,
  compact = false,
  onOpen,
}: {
  item: CatalogItem;
  compact?: boolean;
  onOpen?: () => void;
}) {
  return (
    <article className="group flex h-full min-h-40 flex-col bg-background transition-colors hover:bg-accent/20">
      <div className="flex items-start justify-between gap-3 border-b p-4">
        <p className="min-w-0 truncate font-mono text-sm font-semibold">{item.label}</p>
        {onOpen ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="-mt-2 -mr-2 size-8 shrink-0"
            onClick={onOpen}
          >
            <CatalogItemIcon item={item} className="size-4 text-muted-foreground" />
            <span className="sr-only">Open {item.label}</span>
          </Button>
        ) : (
          <CatalogItemIcon item={item} className="size-4 shrink-0 text-muted-foreground" />
        )}
      </div>
      <div className="flex flex-1 items-center justify-center p-5">
        {renderTinyPreview(item.id)}
      </div>
      {!compact ? (
        <div className="border-t p-4 text-sm leading-6 text-muted-foreground">
          {item.description}
        </div>
      ) : null}
    </article>
  );
}

function renderTinyPreview(id: string) {
  switch (id) {
    case "button":
      return <Button size="sm">Action</Button>;
    case "badge":
      return <Badge>stable</Badge>;
    case "input":
      return <Input className="max-w-44" placeholder="Search" />;
    case "switch":
      return <Switch defaultChecked aria-label="Preview switch" />;
    case "checkbox":
      return <Checkbox defaultChecked aria-label="Preview checkbox" />;
    case "slider":
      return <Slider className="w-40" defaultValue={[64]} max={100} />;
    case "progress":
      return <Progress className="w-40" value={62} />;
    case "spinner":
      return <Spinner className="size-5" />;
    case "avatar":
      return (
        <Avatar>
          <AvatarFallback>KB</AvatarFallback>
        </Avatar>
      );
    case "skeleton":
      return <Skeleton className="h-16 w-40" />;
    case "separator":
      return <Separator className="w-40" />;
    case "kbd":
      return (
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      );
    case "code":
      return <Code>@kkb/ui</Code>;
    case "toggle":
      return <Toggle defaultPressed>Grid</Toggle>;
    case "toggle-group":
      return (
        <ToggleGroup type="single" defaultValue="a">
          <ToggleGroupItem value="a">A</ToggleGroupItem>
          <ToggleGroupItem value="b">B</ToggleGroupItem>
        </ToggleGroup>
      );
    case "mode-toggle":
      return <ModeToggle />;
    case "audio-waveform":
    case "audio-playhead":
    case "audio-player-controls":
    case "audio-presenter":
    case "audio-theme":
      return <div className="h-14 w-44 rounded-sm border bg-audio-accent-soft" />;
    default:
      return <Badge variant="outline">{id}</Badge>;
  }
}

function CatalogItemIcon({ item, className }: { item: CatalogItem; className?: string }) {
  const Icon =
    item.kind === "view"
      ? Grid2X2
      : item.kind === "utility"
        ? Terminal
        : categoryMeta[item.category].icon;
  return <Icon className={className} />;
}

function DesignSystemSurface() {
  return (
    <div>
      <SurfaceHeader item={itemFromId("design-system")} />
      <div className="border-t bg-muted/20 p-4 md:p-8">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="grid gap-5 md:grid-cols-2">{<DesignSystemCards />}</div>
          <div className="space-y-5">
            <TokenPanel
              title="Implementation contract"
              rows={[
                ["semantic tokens", "shadcn-compatible CSS variables"],
                ["studio names", "bench ink, rail gray, scope blue"],
                ["shape", "1-4px product radii"],
                ["motion", "stateful, reduced-motion aware"],
              ]}
            />
            <TokenPanel
              title="Scoped color rule"
              rows={[
                ["audio blue", "audio + waveform surfaces only"],
                ["P31 green", "oscilloscope traces only"],
                ["accent", "neutral product accent, not decoration"],
              ]}
            />
            <TokenPanel
              title="Instrument bay queue"
              rows={[
                ["audio", "promoted bay in this catalog"],
                ["oscilloscope", "future bay inherits P31 trace/glow/floor rules"],
                ["json render", "dense data utility, not a visual theme"],
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function DesignSystemCards() {
  return (
    <>
      <CatalogSpecimen title="Color tokens" description="Live semantic roles from globals.css.">
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
      </CatalogSpecimen>
      <CatalogSpecimen title="Typography" description="TX-02 for technical voice, Geist for prose.">
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
      </CatalogSpecimen>
      <CatalogSpecimen title="Radius" description="Sharp product surfaces with earned exceptions.">
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
      </CatalogSpecimen>
      <CatalogSpecimen title="Spacing" description="4px base scale for dense product rhythm.">
        <div className="space-y-3">
          {[1, 2, 3, 4, 6, 8].map((step) => (
            <div key={step} className="flex items-center gap-3">
              <span className="w-10 font-mono text-xs text-muted-foreground">{step * 4}px</span>
              <div className="h-3 bg-foreground" style={{ width: step * 16 }} />
            </div>
          ))}
        </div>
      </CatalogSpecimen>
    </>
  );
}

function CatalogSpecimen({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <article className="min-h-72 border bg-background">
      <header className="border-b p-4">
        <h3 className="font-mono text-base font-semibold">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
      </header>
      <div className="p-4">{children}</div>
    </article>
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
    <div className="rounded-md border bg-background p-4">
      <p className="font-mono text-sm font-semibold">{title}</p>
      <div className="mt-3 divide-y">
        {rows.map(([label, value]) => (
          <div key={label} className="grid gap-2 py-2 text-sm sm:grid-cols-[120px_minmax(0,1fr)]">
            <span className="font-mono text-xs text-muted-foreground">{label}</span>
            <span>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActionExamples() {
  return (
    <>
      <CatalogSpecimen
        title="Action cluster"
        description="Buttons, grouped controls, and toggles share one shape vocabulary."
      >
        <div className="space-y-4">
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
          <ToggleGroup type="multiple" defaultValue={["grid", "labels"]}>
            <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
            <ToggleGroupItem value="labels">Labels</ToggleGroupItem>
            <ToggleGroupItem value="stats">Stats</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </CatalogSpecimen>
      <CatalogSpecimen
        title="Toolbar"
        description="Compact product actions without decorative chrome."
      >
        <div className="flex flex-wrap items-center gap-2">
          <Toggle defaultPressed>
            <Grid2X2 className="size-4" />
            Grid
          </Toggle>
          <Toggle>
            <Bell className="size-4" />
            Watch checks
          </Toggle>
          <Button variant="outline" size="icon">
            <Copy className="size-4" />
            <span className="sr-only">Copy import path</span>
          </Button>
        </div>
      </CatalogSpecimen>
    </>
  );
}

function InputExamples() {
  return (
    <>
      <CatalogSpecimen title="Settings form" description="Core field and selection states.">
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="project-title">Project title</Label>
            <Input id="project-title" defaultValue="UI catalog hierarchy pass" />
            <p className="text-sm text-muted-foreground">
              Used in local reports and handoff notes.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="catalog-channel">Channel</Label>
              <Select defaultValue="preview">
                <SelectTrigger id="catalog-channel">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stable">Stable</SelectItem>
                  <SelectItem value="preview">Preview</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="native-density">Density</Label>
              <NativeSelect id="native-density" defaultValue="compact">
                <NativeSelectOption value="compact">Compact</NativeSelectOption>
                <NativeSelectOption value="roomy">Roomy</NativeSelectOption>
              </NativeSelect>
            </div>
          </div>
          <Textarea defaultValue="Favor @kkb/ui primitives first. Promote only the surfaces that carry KKB-specific instrument behavior." />
          <div className="grid gap-3 rounded-md border p-3">
            <Field orientation="horizontal">
              <Checkbox id="audit" defaultChecked />
              <FieldContent>
                <FieldLabel htmlFor="audit">Run audit after implementation</FieldLabel>
                <FieldDescription>Keep interaction states production-ready.</FieldDescription>
              </FieldContent>
            </Field>
            <Field orientation="horizontal">
              <Switch id="sticky" defaultChecked />
              <FieldContent>
                <FieldLabel htmlFor="sticky">Sticky rail</FieldLabel>
                <FieldDescription>Preserve spatial browsing on wide screens.</FieldDescription>
              </FieldContent>
            </Field>
          </div>
        </div>
      </CatalogSpecimen>
      <CatalogSpecimen
        title="Structured controls"
        description="Grouped search, OTP, combobox, radio, and slider states."
      >
        <div className="space-y-4">
          <InputGroup>
            <InputGroupAddon>
              <Search className="size-4" />
              <InputGroupText>Filter</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput defaultValue="audio waveform" />
            <InputGroupAddon align="inline-end">
              <InputGroupButton size="icon-xs" variant="ghost">
                <X />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
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
          <RadioGroup defaultValue="stable">
            <div className="flex items-center gap-2">
              <RadioGroupItem value="stable" id="stable" />
              <Label htmlFor="stable">Ship-ready</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="preview" id="preview" />
              <Label htmlFor="preview">Needs browser pass</Label>
            </div>
          </RadioGroup>
          <Slider defaultValue={[72]} max={100} />
        </div>
      </CatalogSpecimen>
    </>
  );
}

function LayoutExamples() {
  return (
    <>
      <CatalogSpecimen
        title="Panel primitives"
        description="Card, Aspect Ratio, Empty, Item, Scroll Area, and Separator."
      >
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
      </CatalogSpecimen>
      <CatalogSpecimen
        title="Lists and regions"
        description="Constrained scrolling, items, separators, empty states, and resizable panels."
      >
        <div className="space-y-4">
          <ScrollArea className="h-32 rounded-md border">
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
      </CatalogSpecimen>
    </>
  );
}

function NavigationExamples() {
  return (
    <>
      <CatalogSpecimen
        title="Navigation shell"
        description="Tabs, breadcrumbs, navigation menu, and pagination in one route context."
      >
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
            </TabsList>
            <TabsContent value="preview" className="border p-3 text-sm">
              All components grid.
            </TabsContent>
            <TabsContent value="tokens" className="border p-3 text-sm">
              Design system tokens.
            </TabsContent>
          </Tabs>
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
      </CatalogSpecimen>
      <CatalogSpecimen
        title="Sidebar"
        description="Real sidebar provider constrained inside the preview pane."
      >
        <div className="h-64 overflow-hidden rounded-md border">
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
                            <PanelLeft />
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
      </CatalogSpecimen>
    </>
  );
}

function DisclosureExamples() {
  return (
    <>
      <CatalogSpecimen title="Accordion" description="Progressive disclosure for compact details.">
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
      </CatalogSpecimen>
      <CatalogSpecimen title="Collapsible" description="Inline expansion without a modal.">
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
      </CatalogSpecimen>
    </>
  );
}

function OverlayExamples() {
  return (
    <>
      <CatalogSpecimen title="Modal family" description="Dialog, alert dialog, sheet, and drawer.">
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
        </div>
      </CatalogSpecimen>
      <CatalogSpecimen title="Contextual overlays" description="Popover, hover card, and tooltip.">
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
                  <Sparkles />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Polish affordance</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </CatalogSpecimen>
    </>
  );
}

function FeedbackExamples() {
  return (
    <>
      <CatalogSpecimen
        title="Status stack"
        description="Alerts, badges, progress, spinner, skeleton, avatar, and recovery copy."
      >
        <div className="space-y-4">
          <Alert>
            <CircleAlert className="size-4" />
            <AlertTitle>Catalog coverage ready</AlertTitle>
            <AlertDescription>
              Every public component export is visible in the workbench.
            </AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <CircleAlert className="size-4" />
            <AlertTitle>Browser verification failed</AlertTitle>
            <AlertDescription>
              Re-run the focused browser check after fixing overflow or clipped overlay findings.
            </AlertDescription>
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
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </CatalogSpecimen>
      <CatalogSpecimen title="Sonner" description="Toaster provider alignment with theme tokens.">
        <div className="space-y-3">
          <Toaster position="bottom-right" />
          <Button variant="outline" onClick={() => undefined}>
            Toast host mounted
          </Button>
          <p className="text-sm text-muted-foreground">
            The host is present; app events can trigger sonner messages.
          </p>
        </div>
      </CatalogSpecimen>
    </>
  );
}

function MenuExamples() {
  return (
    <>
      <CatalogSpecimen title="Menu surfaces" description="Dropdown, context menu, and menubar.">
        <div className="space-y-4">
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
          <ContextMenu>
            <ContextMenuTrigger className="grid h-24 place-items-center rounded-md border border-dashed text-sm text-muted-foreground">
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
      </CatalogSpecimen>
      <CatalogSpecimen
        title="Command pattern"
        description="The catalog search uses the same command primitive."
      >
        <Command className="rounded-md border">
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandItem>Button</CommandItem>
            <CommandItem>Dialog</CommandItem>
          </CommandList>
        </Command>
      </CatalogSpecimen>
    </>
  );
}

const chartData = [
  { month: "Jan", value: 52 },
  { month: "Feb", value: 86 },
  { month: "Mar", value: 68 },
  { month: "Apr", value: 44 },
  { month: "May", value: 72 },
];

function DataExamples() {
  return (
    <>
      <CatalogSpecimen
        title="Table + code"
        description="Dense rows, caption, source snippets, and keyboard hints."
      >
        <div className="space-y-4">
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
          <p className="text-sm">
            Import <Code>@kkb/ui/components/table</Code>
          </p>
          <KbdGroup>
            <Kbd>G</Kbd>
            <Kbd>U</Kbd>
          </KbdGroup>
        </div>
      </CatalogSpecimen>
      <CatalogSpecimen
        title="Chart + carousel"
        description="Compact chart specimen and paged content."
      >
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
          <Carousel className="mx-auto w-full max-w-xs">
            <CarouselContent>
              {[1, 2, 3].map((item) => (
                <CarouselItem key={item}>
                  <div className="grid h-24 place-items-center border bg-muted/30 font-mono">
                    0{item}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </CatalogSpecimen>
    </>
  );
}

function UtilitiesExamples() {
  return (
    <>
      <CatalogSpecimen
        title="Theme and direction"
        description="Mode toggle, theme provider contract, and direction provider coverage."
      >
        <div className="space-y-4">
          <ModeToggle />
          <DirectionProvider dir="rtl">
            <div className="rounded-md border p-3 text-sm">RTL provider specimen / مزامنة</div>
          </DirectionProvider>
          <p className="text-sm text-muted-foreground">
            ThemeProvider wraps the app; this page consumes its light/dark state.
          </p>
        </div>
      </CatalogSpecimen>
      <CatalogSpecimen
        title="Public utilities"
        description="Hooks and render registries are cataloged as public exports."
      >
        <div className="space-y-3">
          {utilityItems.map((item) => (
            <div key={item.id} className="rounded-md border p-3">
              <p className="font-mono text-sm">{item.label}</p>
              <p className="mt-1 break-all font-mono text-xs text-muted-foreground">
                {item.source}
              </p>
            </div>
          ))}
        </div>
      </CatalogSpecimen>
    </>
  );
}
