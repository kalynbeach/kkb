export type CatalogKind = "view" | "category" | "component" | "utility";
export type CatalogEntryType =
  | "view"
  | "category"
  | "visual"
  | "provider"
  | "hook"
  | "presenter"
  | "theme"
  | "integration";
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
  entryType: CatalogEntryType;
  category: CatalogCategory;
  source: string;
  description: string;
  keywords: readonly string[];
  important?: boolean;
  experimental?: boolean;
};

type VisualDefinition = readonly [
  id: string,
  label: string,
  category: CatalogCategory,
  source: `@kkb/ui/components/${string}`,
  important: boolean,
];

type SecondaryDefinition = readonly [
  id: string,
  label: string,
  category: CatalogCategory,
  source: `@kkb/ui/${string}`,
  entryType: Exclude<CatalogEntryType, "view" | "category" | "visual">,
  experimental: boolean,
];

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
    description: "Tables, code, keyboard hints, charts, and carousel surfaces.",
  },
  Audio: {
    description: "KKB audio primitives and the instrument-grade audio composition.",
  },
  Utilities: {
    description: "Public hooks, providers, direction utilities, and supporting exports.",
  },
};

export const visualComponentDefinitions = [
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
  ["navigation-menu", "Navigation Menu", "Navigation", "@kkb/ui/components/navigation-menu", true],
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
  [
    "audio-seek-timeline",
    "Audio Seek Timeline",
    "Audio",
    "@kkb/ui/components/audio/seek-timeline",
    true,
  ],
] as const satisfies readonly VisualDefinition[];

export type VisualCatalogId = (typeof visualComponentDefinitions)[number][0];

export const visualCatalogIds = visualComponentDefinitions.map(
  ([id]) => id,
) as readonly VisualCatalogId[];

export const secondaryDefinitions = [
  [
    "direction",
    "Direction Provider",
    "Utilities",
    "@kkb/ui/components/direction",
    "provider",
    false,
  ],
  [
    "theme-provider",
    "Theme Provider",
    "Utilities",
    "@kkb/ui/components/theme-provider",
    "provider",
    false,
  ],
  ["use-mobile", "useIsMobile", "Utilities", "@kkb/ui/hooks/use-mobile", "hook", false],
  [
    "audio-presenter",
    "Audio Presenter",
    "Audio",
    "@kkb/ui/components/audio/presenter",
    "presenter",
    false,
  ],
  ["audio-theme", "Audio Theme", "Audio", "@kkb/ui/components/audio/theme", "theme", false],
  ["json-render", "JSON Render", "Data", "@kkb/ui/json-render", "integration", true],
  [
    "json-render-catalog",
    "JSON Render Catalog",
    "Data",
    "@kkb/ui/json-render/catalog",
    "integration",
    true,
  ],
  [
    "json-render-registry",
    "JSON Render Registry",
    "Data",
    "@kkb/ui/json-render/registry",
    "integration",
    true,
  ],
] as const satisfies readonly SecondaryDefinition[];

const viewItems: readonly CatalogItem[] = [
  {
    id: "preview",
    label: "Preview",
    kind: "view",
    entryType: "view",
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
    entryType: "view",
    category: "Design System",
    source: "DESIGN.md + packages/ui/src/styles/globals.css",
    description: "Live KKB tokens: color, type, radius, spacing, and scoped instrument palettes.",
    keywords: ["tokens", "colors", "typography", "radius", "spacing"],
    important: true,
  },
];

const categoryItems: readonly CatalogItem[] = (
  [
    ["layout", "Layout", "Layout", "Curated layout primitives and structural surfaces."],
    ["navigation", "Navigation", "Navigation", "Route orientation and movement primitives."],
    ["input", "Input", "Input", "Controls, fields, and forms."],
    ["feedback", "Feedback", "Feedback", "Feedback and status primitives."],
    ["overlay", "Overlay", "Overlay", "Layered interaction primitives."],
    ["menu", "Menu", "Menu", "Command and menu primitives."],
    ["data", "Data", "Data", "Dense data-display primitives."],
    ["audio", "Audio", "Audio", "Audio player and seek timeline primitives."],
    ["utilities", "Utilities", "Utilities", "Non-visual public utilities and providers."],
  ] as const
).map(([id, label, category, description]) => {
  const source =
    id === "utilities"
      ? "apps/web/components/ui-catalog/utility-examples.tsx"
      : `apps/web/components/ui-catalog/sections/${id}-section.tsx`;

  return {
    id: `category-${id}`,
    label: `${label} category`,
    kind: "category",
    entryType: "category",
    category,
    source,
    description,
    keywords: [id, label, "category"],
  } satisfies CatalogItem;
});

const visualItems: readonly CatalogItem[] = visualComponentDefinitions.map(
  ([id, label, category, source, important]) => ({
    id,
    label,
    kind: "component",
    entryType: "visual",
    category,
    source,
    description: componentDescription(id, label, category),
    keywords: [id, label, category, source],
    important,
  }),
);

const supportingItems: readonly CatalogItem[] = secondaryDefinitions.map(
  ([id, label, category, source, entryType, experimental]) => ({
    id,
    label,
    kind: "utility",
    entryType,
    category,
    source,
    description: supportingDescription(label, entryType, experimental),
    keywords: [
      id,
      label,
      category,
      source,
      entryType,
      experimental ? "experimental" : "supporting",
    ],
    experimental,
  }),
);

export const catalogItems: readonly CatalogItem[] = [
  ...viewItems,
  ...categoryItems,
  ...visualItems,
  ...supportingItems,
];

export const componentItems = catalogItems.filter(
  (item): item is CatalogItem & { entryType: "visual" } => item.entryType === "visual",
);
export const secondaryItems = catalogItems.filter((item) => item.kind === "utility");
export const allSelectableItems = catalogItems;

export type CatalogItemResolution = {
  item: CatalogItem;
  missingItemId: string | null;
};

export function componentDescription(id: string, label: string, category: string) {
  if (id.startsWith("audio-")) {
    return `${label} belongs to the scoped audio presentation layer and uses KKB instrument tokens.`;
  }
  return `${label} is part of the ${category.toLowerCase()} surface in @kkb/ui.`;
}

function supportingDescription(label: string, entryType: CatalogEntryType, experimental: boolean) {
  if (experimental) {
    return `${label} is an experimental adapter integration outside the active design-system roadmap.`;
  }

  return `${label} is a supporting ${entryType} export rather than a visual component.`;
}

export function resolveCatalogItem(id: string | null): CatalogItemResolution {
  const fallback = catalogItems[0];

  if (!fallback) {
    throw new Error("Catalog requires at least one item.");
  }

  if (!id) {
    return { item: fallback, missingItemId: null };
  }

  const item = allSelectableItems.find((candidate) => candidate.id === id);

  return item ? { item, missingItemId: null } : { item: fallback, missingItemId: id };
}

export function itemFromId(id: string | null): CatalogItem {
  return resolveCatalogItem(id).item;
}

export function itemsForCategory(category: CatalogCategory) {
  return catalogItems.filter(
    (item) => item.category === category && item.kind !== "category" && item.kind !== "view",
  );
}

export function categoryId(category: CatalogCategory) {
  return `category-${category.toLowerCase().replaceAll(" ", "-")}`;
}
