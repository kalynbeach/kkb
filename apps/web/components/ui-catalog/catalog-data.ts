export type CatalogKind = "view" | "category" | "component" | "utility";
export type CatalogLane = "core" | "instrument" | "support";
export type CatalogCategory =
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

export type CatalogItem = {
  id: string;
  label: string;
  kind: CatalogKind;
  category: CatalogCategory;
  source: string;
  description: string;
  keywords: readonly string[];
  important?: boolean;
};

export const categoryOrder: readonly CatalogCategory[] = [
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

export const categoryMeta: Record<CatalogCategory, { description: string }> = {
  "Design System": {
    description: "KKB colors, typography, radius, spacing, and scoped instrument tokens.",
  },
  Layout: {
    description: "Structural primitives, panels, cards, scroll regions, and empty states.",
  },
  Navigation: {
    description: "Route orientation, progressive disclosure, tabs, and paging affordances.",
  },
  Input: {
    description: "Actions, fields, selection controls, grouped inputs, and forms.",
  },
  Feedback: {
    description: "System status, loading, skeletons, badges, and notifications.",
  },
  Overlay: {
    description: "Dialogs, sheets, drawers, popovers, hover cards, and tooltips.",
  },
  Menu: {
    description: "Command, dropdown, context, and menubar interaction surfaces.",
  },
  Data: {
    description: "Tables, code, keyboard hints, charts, carousel, and json-render surfaces.",
  },
  Audio: {
    description: "KKB audio primitives and the instrument-grade audio composition.",
  },
  Utilities: {
    description: "Public hooks, providers, direction utilities, and supporting exports.",
  },
};

export const railGroups: readonly {
  label: string;
  categories: readonly CatalogCategory[];
}[] = [
  {
    label: "Core bench",
    categories: ["Design System", "Input", "Layout", "Feedback"],
  },
  {
    label: "Instrument bays",
    categories: ["Audio", "Data"],
  },
  {
    label: "Interaction support",
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

export const catalogItems: readonly CatalogItem[] = [
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

export const componentItems = catalogItems.filter((item) => item.kind === "component");
export const utilityItems = catalogItems.filter((item) => item.kind === "utility");
export const allSelectableItems = catalogItems;

export function componentDescription(id: string, label: string, category: string) {
  if (id.startsWith("audio-")) {
    return `${label} belongs to the scoped audio presentation layer and uses KKB instrument tokens.`;
  }
  if (id.startsWith("json-render")) {
    return `${label} supports JSON-driven rendering and registry workflows.`;
  }
  return `${label} is part of the ${category.toLowerCase()} surface in @kkb/ui.`;
}

export function itemFromId(id: string | null): CatalogItem {
  const fallback = catalogItems[0];

  if (!fallback) {
    throw new Error("Catalog requires at least one item.");
  }

  return allSelectableItems.find((item) => item.id === id) ?? fallback;
}

export function groupedItems() {
  return categoryOrder.map((category) => ({
    category,
    items: catalogItems.filter((item) => item.category === category && item.kind !== "view"),
  }));
}

export function itemLane(item: CatalogItem): CatalogLane {
  if (instrumentBayIds.has(item.id) || item.category === "Audio") {
    return "instrument";
  }

  if (corePrimitiveIds.has(item.id) || item.important) {
    return "core";
  }

  return "support";
}

export function laneLabel(lane: CatalogLane) {
  switch (lane) {
    case "core":
      return "core";
    case "instrument":
      return "bay";
    case "support":
      return "support";
  }
}

export function itemsForCategory(category: CatalogCategory) {
  return catalogItems.filter((item) => item.category === category && item.id !== "preview");
}

export function categoryId(category: CatalogCategory) {
  return `category-${category.toLowerCase().replaceAll(" ", "-")}`;
}

export function focusedIntent(item: CatalogItem) {
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

export function sourceInstruction(item: CatalogItem) {
  if (item.source.startsWith("@kkb/ui/")) {
    return `import from "${item.source}"`;
  }

  return item.source;
}

export function relatedItems(item: CatalogItem) {
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
