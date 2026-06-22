"use client";

import type { CatalogItem } from "./catalog-data";
import { CategorySurface } from "./category-surface";
import { DesignSystemSurface } from "./design-system-surface";
import { FocusedComponentSurface } from "./focused-specimens";
import { PreviewWall } from "./preview-wall";

export function CatalogSurface({
  selectedItem,
  onSelect,
}: {
  selectedItem: CatalogItem;
  onSelect: (id: string) => void;
}) {
  if (selectedItem.id === "preview") {
    return <PreviewWall onSelect={onSelect} />;
  }

  if (selectedItem.id === "design-system") {
    return <DesignSystemSurface />;
  }

  if (selectedItem.id.startsWith("category-")) {
    return <CategorySurface item={selectedItem} />;
  }

  return <FocusedComponentSurface item={selectedItem} onSelect={onSelect} />;
}
