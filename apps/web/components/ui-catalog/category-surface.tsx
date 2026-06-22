"use client";

import { Badge } from "@kkb/ui/components/badge";

import type { CatalogCategory, CatalogItem } from "./catalog-data";
import { SurfaceHeader } from "./catalog-surface-shared";
import { DesignSystemCards } from "./design-system-surface";
import { UtilitiesExamples } from "./focused-specimens";
import { AudioSection } from "./sections/audio-section";
import { DataSection } from "./sections/data-section";
import { FeedbackSection } from "./sections/feedback-section";
import { InputSection } from "./sections/input-section";
import { LayoutSection } from "./sections/layout-section";
import { MenuSection } from "./sections/menu-section";
import { NavigationSection } from "./sections/navigation-section";
import { OverlaySection } from "./sections/overlay-section";

export function CategorySurface({ item }: { item: CatalogItem }) {
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
