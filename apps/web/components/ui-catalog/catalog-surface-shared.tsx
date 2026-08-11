"use client";

import { cn } from "@kkb/ui/lib/utils";
import { CaretRightIcon } from "@phosphor-icons/react/dist/csr/CaretRight";
import * as React from "react";

import type { CatalogItem } from "./catalog-data";

export function SurfaceHeader({ item, action }: { item: CatalogItem; action?: React.ReactNode }) {
  return (
    <div className="grid gap-3 bg-background px-4 py-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-muted-foreground">
          <span>{item.category}</span>
          <CaretRightIcon
            aria-hidden="true"
            className="size-3"
            focusable="false"
            weight="regular"
          />
          <span>{item.entryType}</span>
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
  bodyClassName,
  children,
}: {
  title: string;
  description?: string;
  className?: string;
  bodyClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("min-w-0 bg-background", className)}>
      <header className="mb-2 px-1">
        <h3 className="font-mono text-xs text-muted-foreground">{title}</h3>
        {description ? (
          <p className="mt-1 max-w-prose text-sm leading-5 text-muted-foreground">{description}</p>
        ) : null}
      </header>
      <div className={cn("min-h-36 bg-muted/25 p-4", bodyClassName)}>{children}</div>
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
