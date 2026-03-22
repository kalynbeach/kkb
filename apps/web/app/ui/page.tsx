import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@kkb/ui/components/empty";
import { ModeToggle } from "@kkb/ui/components/mode-toggle";
import Link from "next/link";

import { CatalogNav } from "./_components/catalog-nav";
import { ComponentCard } from "./_components/component-card";
import { Section } from "./_components/section";
import { DataSection, dataSectionItemCount } from "./_components/sections/data-section";
import { FeedbackSection, feedbackSectionItemCount } from "./_components/sections/feedback-section";
import { InputSection, inputSectionItemCount } from "./_components/sections/input-section";
import { LayoutSection, layoutSectionItemCount } from "./_components/sections/layout-section";
import { MenuSection, menuSectionItemCount } from "./_components/sections/menu-section";
import {
  NavigationSection,
  navigationSectionItemCount,
} from "./_components/sections/navigation-section";
import { OverlaySection, overlaySectionItemCount } from "./_components/sections/overlay-section";

const catalogSections = [
  {
    id: "layout",
    label: "Layout",
    description:
      "Shell primitives, spacing helpers, and structural building blocks land here next.",
  },
  {
    id: "navigation",
    label: "Navigation",
    description: "Tabs, breadcrumbs, accordions, and related navigation demos fill this section.",
  },
  {
    id: "input",
    label: "Input",
    description:
      "Form controls and selection patterns arrive here once the core catalog cards ship.",
  },
  {
    id: "feedback",
    label: "Feedback",
    description: "Status, loading, and progress patterns will populate this section.",
  },
  {
    id: "overlay",
    label: "Overlay",
    description: "Dialogs, drawers, and contextual overlays stay isolated inside small demo islands.",
  },
  {
    id: "menu",
    label: "Menu",
    description: "Dropdown, context, menubar, and command surfaces with isolated local state.",
  },
  {
    id: "data",
    label: "Data",
    description: "Tables, inline code, shortcut patterns, and carousel cards with narrow local state.",
  },
  {
    id: "audio",
    label: "Audio",
    description:
      "Audio primitives and the composition demo will fill in after the scaffold is merged.",
  },
] as const;

const sectionItemCounts = {
  layout: layoutSectionItemCount,
  navigation: navigationSectionItemCount,
  input: inputSectionItemCount,
  feedback: feedbackSectionItemCount,
  overlay: overlaySectionItemCount,
  menu: menuSectionItemCount,
  data: dataSectionItemCount,
  audio: 0,
} as const;

function SectionPlaceholder({ label }: { label: string }) {
  return (
    <ComponentCard
      title="Section scaffold ready"
      description="Shared card and section primitives are in place for follow-up demos."
      className="md:col-span-2 xl:col-span-3"
    >
      <Empty className="min-h-52 rounded-none border-0">
        <EmptyHeader>
          <EmptyTitle>{label} content lands next</EmptyTitle>
          <EmptyDescription>
            This section stays deferred while follow-up catalog demos land in later task work.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </ComponentCard>
  );
}

function renderSectionContent(sectionId: (typeof catalogSections)[number]["id"]) {
  switch (sectionId) {
    case "layout":
      return <LayoutSection />;
    case "navigation":
      return <NavigationSection />;
    case "input":
      return <InputSection />;
    case "feedback":
      return <FeedbackSection />;
    case "overlay":
      return <OverlaySection />;
    case "menu":
      return <MenuSection />;
    case "data":
      return <DataSection />;
    case "audio":
      return <SectionPlaceholder label="Audio" />;
  }
}

export default function UiPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="border-b">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-3">
              <Link
                href="/"
                className="inline-flex items-center font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
              >
                ← Home
              </Link>
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">UI catalog</h1>
                <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                  Shared scaffold for the curated `@kkb/ui` component catalog. Section content lands
                  in follow-up issues without changing the route shell.
                </p>
              </div>
            </div>
            <ModeToggle />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10">
          <CatalogNav sections={catalogSections} />
          <div className="space-y-12">
            {catalogSections.map((section) => (
              <Section
                key={section.id}
                id={section.id}
                title={section.label}
                description={section.description}
                itemCount={sectionItemCounts[section.id]}
              >
                {renderSectionContent(section.id)}
              </Section>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
