"use client";

import { cn } from "@kkb/ui/lib/utils";
import { ChevronRight } from "lucide-react";
import * as React from "react";

import { type CatalogItem, itemFromId } from "./catalog-data";
import { CatalogItemIcon } from "./catalog-icons";

export const chartData = [
  { month: "Jan", value: 52 },
  { month: "Feb", value: 86 },
  { month: "Mar", value: 68 },
  { month: "Apr", value: 44 },
  { month: "May", value: 72 },
] as const;

export function SurfaceHeader({ item, action }: { item: CatalogItem; action?: React.ReactNode }) {
  return (
    <div className="grid gap-3 bg-background px-4 py-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-muted-foreground">
          <span>{item.category}</span>
          <ChevronRight className="size-3" />
          <span>{item.kind}</span>
        </div>
        <h2 className="mt-1 truncate font-mono text-xl font-semibold tracking-[-0.02em]">
          {item.label}
        </h2>
      </div>
      {action}
    </div>
  );
}

export function SpecimenStage({
  title,
  description,
  className,
  children,
}: {
  title: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("min-w-0 border bg-background", className)}>
      <header className="border-b px-3 py-2">
        <h3 className="font-mono text-sm font-semibold">{title}</h3>
        {description ? (
          <p className="mt-1 text-sm leading-5 text-muted-foreground">{description}</p>
        ) : null}
      </header>
      <div className="p-4">{children}</div>
    </section>
  );
}

type DemoBoundaryProps = {
  resetKey: string;
  children: React.ReactNode;
};

type DemoBoundaryState = {
  hasError: boolean;
};

export class DemoBoundary extends React.Component<DemoBoundaryProps, DemoBoundaryState> {
  state: DemoBoundaryState = { hasError: false };

  static getDerivedStateFromError(): DemoBoundaryState {
    return { hasError: true };
  }

  componentDidUpdate(previousProps: DemoBoundaryProps) {
    if (previousProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <SpecimenStage title="Demo unavailable">
          <div className="min-h-40 border border-dashed p-4 text-sm text-muted-foreground">
            This demo failed in isolation. The catalog remains usable; open another component or
            inspect the console for the failing specimen.
          </div>
        </SpecimenStage>
      );
    }

    return this.props.children;
  }
}

export function renderTinyPreview(id: string) {
  return <StaticTinyPreview item={itemFromId(id)} />;
}

function StaticTinyPreview({ item }: { item: CatalogItem }) {
  if (item.category === "Audio") {
    return (
      <span
        aria-hidden="true"
        className="flex h-10 w-20 items-end gap-1 border border-audio-panel-border bg-audio-accent-softer p-1"
      >
        {[24, 56, 36, 72, 48, 64].map((value) => (
          <span key={value} className="flex-1 bg-audio-accent" style={{ height: `${value}%` }} />
        ))}
      </span>
    );
  }

  if (item.category === "Data") {
    return (
      <span aria-hidden="true" className="flex h-10 w-20 items-end gap-1 border bg-muted/20 p-1">
        {[40, 80, 55, 70].map((value) => (
          <span key={value} className="flex-1 bg-foreground" style={{ height: `${value}%` }} />
        ))}
      </span>
    );
  }

  if (item.category === "Input") {
    return (
      <span aria-hidden="true" className="grid h-10 w-20 gap-1 border bg-muted/20 p-2">
        <span className="h-1.5 w-12 bg-muted-foreground/50" />
        <span className="h-3 border bg-background" />
      </span>
    );
  }

  if (item.category === "Overlay" || item.category === "Menu") {
    return (
      <span aria-hidden="true" className="relative h-10 w-20 border bg-muted/20">
        <span className="absolute top-2 left-2 h-5 w-10 border bg-background" />
        <span className="absolute right-2 bottom-2 h-5 w-10 border bg-background" />
      </span>
    );
  }

  if (item.category === "Navigation") {
    return (
      <span aria-hidden="true" className="grid h-10 w-20 gap-1 border bg-muted/20 p-2">
        <span className="h-1.5 w-14 bg-foreground" />
        <span className="h-1.5 w-10 bg-muted-foreground/50" />
        <span className="h-1.5 w-12 bg-muted-foreground/50" />
      </span>
    );
  }

  if (item.category === "Feedback") {
    return (
      <span aria-hidden="true" className="flex h-10 w-20 items-center gap-1 border bg-muted/20 p-2">
        <span className="size-3 rounded-full bg-foreground" />
        <span className="grid flex-1 gap-1">
          <span className="h-1.5 bg-muted-foreground/60" />
          <span className="h-1.5 w-10 bg-muted-foreground/40" />
        </span>
      </span>
    );
  }

  if (item.category === "Layout") {
    return (
      <span aria-hidden="true" className="grid h-10 w-20 grid-cols-[1fr_1.4fr] gap-1 border p-1">
        <span className="bg-muted" />
        <span className="grid gap-1">
          <span className="bg-muted" />
          <span className="bg-muted" />
        </span>
      </span>
    );
  }

  return (
    <span aria-hidden="true" className="grid size-10 place-items-center border bg-muted/20">
      <CatalogItemIcon item={item} className="size-4 text-muted-foreground" />
    </span>
  );
}
