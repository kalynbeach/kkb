import { AspectRatio } from "@kkb/ui/components/aspect-ratio";
import { Badge } from "@kkb/ui/components/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@kkb/ui/components/card";
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

export const layoutSectionItemCount = 4;

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
    value: "220px",
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
        <div className="grid gap-4 p-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <Card className="gap-4 border-dashed bg-muted/20 py-0">
            <CardHeader className="border-b py-5">
              <CardTitle>Release surface</CardTitle>
              <CardDescription>
                Compact status panel using the base Card primitives directly.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 py-0 pb-6">
              <div className="flex items-center justify-between rounded-lg border bg-background px-3 py-2">
                <span className="text-sm font-medium">ui-catalog</span>
                <Badge variant="outline">staged</Badge>
              </div>
              <div className="flex items-center justify-between rounded-lg border bg-background px-3 py-2">
                <span className="text-sm font-medium">section files</span>
                <span className="font-mono text-xs text-muted-foreground">4 added</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border bg-background px-3 py-2">
                <span className="text-sm font-medium">status</span>
                <Badge>ready</Badge>
              </div>
            </CardContent>
          </Card>

          <AspectRatio ratio={16 / 10}>
            <div className="flex size-full flex-col justify-between rounded-xl border bg-[linear-gradient(140deg,oklch(0.97_0_0)_0%,oklch(0.93_0.01_260)_100%)] p-5 dark:bg-[linear-gradient(140deg,oklch(0.23_0.01_260)_0%,oklch(0.18_0.02_250)_100%)]">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-muted-foreground">
                <span>media frame</span>
                <span>16:10</span>
              </div>
              <div className="space-y-2">
                <p className="text-lg font-semibold tracking-tight">Aspect-ratio shell</p>
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
          <ItemGroup className="rounded-xl border">
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
          <ScrollArea className="h-52 rounded-xl border">
            <div className="space-y-4 p-4">
              {recentLayoutTokens.map((token, index) => (
                <div key={token.name} className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{token.name}</p>
                      <p className="text-sm leading-6 text-muted-foreground">{token.detail}</p>
                    </div>
                    <span className="font-mono text-xs text-muted-foreground">{token.value}</span>
                  </div>
                  {index < recentLayoutTokens.length - 1 ? <Separator /> : null}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Empty States"
        description="Roomy fallback presentation with icon media and balanced copy."
      >
        <div className="flex h-full items-center p-6">
          <Empty className="min-h-52 rounded-xl border">
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
