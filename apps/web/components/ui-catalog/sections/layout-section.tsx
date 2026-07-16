import { AspectRatio } from "@kkb/ui/components/aspect-ratio";
import { Badge } from "@kkb/ui/components/badge";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@kkb/ui/components/empty";
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
import { ScrollArea } from "@kkb/ui/components/scroll-area";
import { Separator } from "@kkb/ui/components/separator";
import { Layers3, ListFilter, Package2, ScrollText } from "lucide-react";

import { ComponentCard } from "../component-card";
import { ResizableDemo } from "../demos/resizable-demo";

const recentLayoutTokens = [
  {
    name: "Surface padding",
    value: "24px",
    detail: "Primary demo card padding token used across the catalog.",
  },
  {
    name: "Reading width",
    value: "72ch",
    detail: "Used for prose blocks and longer helper copy.",
  },
  {
    name: "Rail width",
    value: "240px",
    detail: "Matches the desktop navigation column in the catalog shell.",
  },
] as const;

export function LayoutSection() {
  return (
    <>
      <ComponentCard
        title="Card + Aspect Ratio"
        description="Foundational surface styling plus a fixed-ratio media frame."
        className="md:col-span-2"
      >
        <div className="grid gap-4 p-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="flex min-w-0 flex-col gap-4 rounded-md bg-muted/20 p-5">
            <div className="space-y-1">
              <p className="font-mono text-base font-semibold tracking-[-0.01em]">
                Release surface
              </p>
              <p className="text-sm leading-6 text-muted-foreground">
                Compact status panel using the base Card primitives directly.
              </p>
            </div>
            <div className="divide-y rounded-md border bg-background">
              <div className="flex items-center justify-between gap-3 px-3 py-2">
                <span className="min-w-0 truncate text-sm font-medium">ui-catalog</span>
                <Badge variant="outline">staged</Badge>
              </div>
              <div className="flex items-center justify-between gap-3 px-3 py-2">
                <span className="min-w-0 truncate text-sm font-medium">section files</span>
                <span className="shrink-0 font-mono text-xs text-muted-foreground">4 added</span>
              </div>
              <div className="flex items-center justify-between gap-3 px-3 py-2">
                <span className="min-w-0 truncate text-sm font-medium">status</span>
                <Badge>ready</Badge>
              </div>
            </div>
          </div>

          <AspectRatio ratio={16 / 10}>
            <div className="flex size-full flex-col justify-between rounded-md border bg-muted/40 p-5">
              <div className="flex items-center justify-between gap-3 font-mono text-xs text-muted-foreground">
                <span>media frame</span>
                <span>16:10</span>
              </div>
              <div className="space-y-2">
                <p className="font-mono text-lg font-semibold tracking-[-0.01em]">
                  Aspect-ratio shell
                </p>
                <p className="max-w-xs text-sm leading-6 text-muted-foreground">
                  A fixed canvas for screenshots, artwork, or embedded visual demos.
                </p>
              </div>
            </div>
          </AspectRatio>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Item Group"
        description="List rows, separators, and compact metadata actions for stacked content."
      >
        <div className="p-4">
          <ItemGroup className="rounded-md border-border/80">
            <Item variant="muted" size="sm">
              <ItemMedia variant="icon">
                <Layers3 className="size-4" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Catalog shell</ItemTitle>
                <ItemDescription>
                  Sticky rail, section counts, and anchored headings.
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <Badge variant="outline">core</Badge>
              </ItemActions>
            </Item>
            <ItemSeparator />
            <Item size="sm">
              <ItemMedia variant="icon">
                <Package2 className="size-4" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Shared primitives</ItemTitle>
                <ItemDescription>
                  Reused by server-rendered examples and later client demo islands.
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <span className="font-mono text-xs text-muted-foreground">2 files</span>
              </ItemActions>
            </Item>
            <ItemSeparator />
            <Item size="sm">
              <ItemMedia variant="icon">
                <ListFilter className="size-4" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Curated coverage</ItemTitle>
                <ItemDescription>
                  Focused cards rather than an exhaustive export dump.
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <Badge>selected</Badge>
              </ItemActions>
            </Item>
          </ItemGroup>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Scroll Area + Separator"
        description="Dense, readable metadata lists inside constrained surfaces."
      >
        <div className="p-4">
          <ScrollArea className="h-52 rounded-md border-border/80 bg-muted/20">
            <div className="space-y-4 p-4">
              {recentLayoutTokens.map((token, index) => (
                <div key={token.name} className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 space-y-1">
                      <p className="text-sm font-medium">{token.name}</p>
                      <p className="text-sm leading-6 text-muted-foreground">{token.detail}</p>
                    </div>
                    <span className="shrink-0 font-mono text-xs text-muted-foreground">
                      {token.value}
                    </span>
                  </div>
                  {index < recentLayoutTokens.length - 1 ? <Separator /> : null}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Resizable Panels"
        description="Adjustable workspace regions with explicit handles and constrained panel widths."
      >
        <ResizableDemo />
      </ComponentCard>

      <ComponentCard
        title="Empty States"
        description="Roomy fallback presentation with icon media and balanced copy."
      >
        <div className="flex h-full items-center p-5">
          <Empty className="min-h-52 rounded-md border-dashed bg-muted/20">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ScrollText className="size-5" />
              </EmptyMedia>
              <EmptyTitle>No blocks selected</EmptyTitle>
              <EmptyDescription>
                Start with a scaffold card, then swap in a focused demo once the section is ready.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </div>
      </ComponentCard>
    </>
  );
}
