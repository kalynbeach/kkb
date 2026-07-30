import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@kkb/ui/components/accordion";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@kkb/ui/components/breadcrumb";
import { Button } from "@kkb/ui/components/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@kkb/ui/components/collapsible";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@kkb/ui/components/pagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@kkb/ui/components/tabs";
import { ChevronRight, Compass, LayoutTemplate, PanelsTopLeft } from "lucide-react";

import { ComponentCard } from "../component-card";
import { NavigationMenuDemo } from "../demos/navigation-menu-demo";

export function NavigationSection() {
  return (
    <>
      <ComponentCard
        title="Tabs"
        description="Compact, stateful view switching for related panels."
      >
        <div className="p-6">
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="tokens">Tokens</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="rounded-md bg-muted/20 p-4">
              <p className="text-sm font-medium">Release overview</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Core sections are server-rendered first, with heavier demo islands landing later.
              </p>
            </TabsContent>
            <TabsContent value="activity" className="rounded-md bg-muted/20 p-4">
              <p className="text-sm font-medium">Recent activity</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Section scaffolding, page shell, and nav behavior all shipped ahead of demos.
              </p>
            </TabsContent>
            <TabsContent value="tokens" className="rounded-md bg-muted/20 p-4">
              <p className="text-sm font-medium">Navigation tokens</p>
              <p className="mt-1 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                active / muted / accent
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Accordion + Collapsible"
        description="Progressive disclosure for FAQs, release notes, and dense side details."
      >
        <div className="space-y-4 p-6">
          <Accordion
            type="single"
            collapsible
            defaultValue="scope"
            className="rounded-md bg-muted/20 px-4"
          >
            <AccordionItem value="scope">
              <AccordionTrigger>What ships in the current catalog pass?</AccordionTrigger>
              <AccordionContent>
                Layout, navigation, input, and feedback cards with representative examples.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="defer">
              <AccordionTrigger>What still needs signoff?</AccordionTrigger>
              <AccordionContent>
                Final browser QA still needs a clean pass across anchors, focus, mobile overflow,
                and theme toggle behavior.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Collapsible defaultOpen className="rounded-md bg-muted/20 p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">Navigation state note</p>
                <p className="text-sm text-muted-foreground">
                  Active-section tracking stays isolated inside the client nav boundary.
                </p>
              </div>
              <CollapsibleTrigger render={<Button variant="ghost" size="sm" />}>
                Details
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="pt-3">
              <p className="text-sm leading-6 text-muted-foreground">
                Section content remains server-owned, so later demo islands only hydrate where
                interaction actually matters.
              </p>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Breadcrumbs"
        description="Route context and drill-down position with light chrome."
      >
        <div className="space-y-5 p-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/ui">UI</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Navigation</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="grid gap-3 rounded-md bg-muted/20 p-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Compass className="size-4" />
              Route context stays lightweight and readable.
            </div>
            <div className="flex items-center gap-2">
              <PanelsTopLeft className="size-4" />
              Useful for nested docs or settings flows.
            </div>
          </div>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Navigation Menu"
        description="Compact top-level exploration with nested content and lightweight links."
      >
        <NavigationMenuDemo />
      </ComponentCard>

      <ComponentCard
        title="Pagination"
        description="Simple page stepping and overflow handling for long collections."
      >
        <div className="space-y-4 p-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <LayoutTemplate className="size-4" />
            Page 3 of 8
          </div>
          <Pagination className="justify-start">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#pagination" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#pagination">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#pagination">2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#pagination" isActive>
                  3
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#pagination">8</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#pagination" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <span>dense lists</span>
            <ChevronRight className="size-3" />
            <span>stable affordances</span>
          </div>
        </div>
      </ComponentCard>
    </>
  );
}
