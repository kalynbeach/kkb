import {
  Activity,
  Database,
  Gauge,
  Grid2X2,
  LayoutPanelTop,
  Menu,
  MousePointer2,
  Palette,
  PanelLeft,
  SquareStack,
  Terminal,
} from "lucide-react";
import type { ElementType } from "react";

import type { CatalogCategory, CatalogItem } from "./catalog-data";

export const categoryIcons: Record<CatalogCategory, ElementType> = {
  "Design System": Palette,
  Layout: LayoutPanelTop,
  Navigation: PanelLeft,
  Input: MousePointer2,
  Feedback: Activity,
  Overlay: SquareStack,
  Menu,
  Data: Database,
  Audio: Gauge,
  Utilities: Terminal,
};

export function CatalogItemIcon({ item, className }: { item: CatalogItem; className?: string }) {
  const Icon =
    item.kind === "view"
      ? Grid2X2
      : item.kind === "utility"
        ? Terminal
        : categoryIcons[item.category];

  return <Icon className={className} />;
}
