"use client";

import { DirectionProvider } from "@kkb/ui/components/direction";
import { ModeToggle } from "@kkb/ui/components/mode-toggle";

import type { CatalogItem } from "./catalog-data";
import { utilityItems } from "./catalog-data";
import { SpecimenStage } from "./catalog-surface-shared";

export function UtilitiesExamples({ item }: { item?: CatalogItem }) {
  if (item?.id === "direction") {
    return (
      <>
        <SpecimenStage title="Direction Provider runtime surface">
          <DirectionProvider dir="rtl">
            <div className="rounded-md border p-3 text-sm">RTL provider specimen</div>
          </DirectionProvider>
        </SpecimenStage>
        <SpecimenStage title="Direction Provider source reference">
          <UtilitySourceList />
        </SpecimenStage>
      </>
    );
  }

  if (item?.id === "mode-toggle") {
    return (
      <>
        <SpecimenStage title="Mode Toggle control">
          <ModeToggle />
        </SpecimenStage>
        <SpecimenStage title="Mode Toggle source reference">
          <UtilitySourceList />
        </SpecimenStage>
      </>
    );
  }

  if (item?.id === "theme-provider") {
    return (
      <>
        <SpecimenStage title="Theme Provider app boundary">
          <div className="space-y-2 border p-3 text-sm">
            <p className="font-mono text-sm">ThemeProvider</p>
            <p className="text-muted-foreground">
              Wraps app surfaces; component pages consume its light and dark mode state.
            </p>
          </div>
        </SpecimenStage>
        <SpecimenStage title="Theme Provider source reference">
          <UtilitySourceList />
        </SpecimenStage>
      </>
    );
  }

  if (item?.id === "use-mobile") {
    return (
      <>
        <SpecimenStage title="useIsMobile breakpoint">
          <div className="grid gap-2 border p-3 font-mono text-xs">
            <span>mobile breakpoint: 768px</span>
            <span>used by responsive shell primitives</span>
          </div>
        </SpecimenStage>
        <SpecimenStage title="useIsMobile source reference">
          <UtilitySourceList />
        </SpecimenStage>
      </>
    );
  }

  return (
    <>
      <SpecimenStage title={`${item?.label ?? "Utility"} runtime surface`}>
        <div className="space-y-4">
          <ModeToggle />
          <DirectionProvider dir="rtl">
            <div className="rounded-md border p-3 text-sm">RTL provider specimen</div>
          </DirectionProvider>
          <p className="text-sm text-muted-foreground">
            ThemeProvider wraps the app; this page consumes its light/dark state.
          </p>
        </div>
      </SpecimenStage>
      <SpecimenStage title={`${item?.label ?? "Utility"} source reference`}>
        <UtilitySourceList />
      </SpecimenStage>
    </>
  );
}

function UtilitySourceList() {
  return (
    <div className="space-y-2">
      {utilityItems.map((item) => (
        <div key={item.id} className="border p-3">
          <p className="font-mono text-sm">{item.label}</p>
          <p className="mt-1 break-all font-mono text-xs text-muted-foreground">{item.source}</p>
        </div>
      ))}
    </div>
  );
}
