import { CursorClickIcon } from "@phosphor-icons/react/dist/csr/CursorClick";
import { DatabaseIcon } from "@phosphor-icons/react/dist/csr/Database";
import { GaugeIcon } from "@phosphor-icons/react/dist/csr/Gauge";
import { LayoutIcon } from "@phosphor-icons/react/dist/csr/Layout";
import { ListIcon } from "@phosphor-icons/react/dist/csr/List";
import { PaletteIcon } from "@phosphor-icons/react/dist/csr/Palette";
import { PulseIcon } from "@phosphor-icons/react/dist/csr/Pulse";
import { SidebarIcon } from "@phosphor-icons/react/dist/csr/Sidebar";
import { SquaresFourIcon } from "@phosphor-icons/react/dist/csr/SquaresFour";
import { StackIcon } from "@phosphor-icons/react/dist/csr/Stack";
import { TerminalIcon } from "@phosphor-icons/react/dist/csr/Terminal";
import type { Icon } from "@phosphor-icons/react/lib";

import type { CatalogCategory, CatalogItem } from "./catalog-data";

export const categoryIcons: Record<CatalogCategory, Icon> = {
  "Design System": PaletteIcon,
  Layout: LayoutIcon,
  Navigation: SidebarIcon,
  Input: CursorClickIcon,
  Feedback: PulseIcon,
  Overlay: StackIcon,
  Menu: ListIcon,
  Data: DatabaseIcon,
  Audio: GaugeIcon,
  Utilities: TerminalIcon,
};

export function CatalogItemIcon({ item, className }: { item: CatalogItem; className?: string }) {
  const IconComponent =
    item.kind === "view"
      ? SquaresFourIcon
      : item.kind === "utility"
        ? TerminalIcon
        : categoryIcons[item.category];

  return (
    <IconComponent aria-hidden="true" className={className} focusable="false" weight="regular" />
  );
}
