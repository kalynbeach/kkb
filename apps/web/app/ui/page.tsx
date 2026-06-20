import { ModeToggle } from "@kkb/ui/components/mode-toggle";
import Link from "next/link";

import { CatalogNav } from "@/components/ui-catalog/catalog-nav";
import { Section } from "@/components/ui-catalog/section";
import {
  AudioSection,
  audioSectionItemCount,
} from "@/components/ui-catalog/sections/audio-section";
import { DataSection, dataSectionItemCount } from "@/components/ui-catalog/sections/data-section";
import {
  FeedbackSection,
  feedbackSectionItemCount,
} from "@/components/ui-catalog/sections/feedback-section";
import {
  InputSection,
  inputSectionItemCount,
} from "@/components/ui-catalog/sections/input-section";
import {
  LayoutSection,
  layoutSectionItemCount,
} from "@/components/ui-catalog/sections/layout-section";
import { MenuSection, menuSectionItemCount } from "@/components/ui-catalog/sections/menu-section";
import {
  NavigationSection,
  navigationSectionItemCount,
} from "@/components/ui-catalog/sections/navigation-section";
import {
  OverlaySection,
  overlaySectionItemCount,
} from "@/components/ui-catalog/sections/overlay-section";

const catalogSections = [
  {
    id: "layout",
    label: "Layout",
    description:
      "Shell primitives, spacing helpers, and structural building blocks for app surfaces.",
  },
  {
    id: "navigation",
    label: "Navigation",
    description: "Tabs, breadcrumbs, accordions, and route-orientation primitives for dense flows.",
  },
  {
    id: "input",
    label: "Input",
    description: "Form controls and selection patterns with keyboard-first defaults.",
  },
  {
    id: "feedback",
    label: "Feedback",
    description: "Status, loading, and progress patterns for system visibility.",
  },
  {
    id: "overlay",
    label: "Overlay",
    description: "Dialogs, drawers, and contextual overlays isolated inside focused demo islands.",
  },
  {
    id: "menu",
    label: "Menu",
    description: "Dropdown, context, menubar, and command surfaces with local state only.",
  },
  {
    id: "data",
    label: "Data",
    description: "Tables, inline code, shortcut patterns, and compact collection affordances.",
  },
  {
    id: "audio",
    label: "Audio",
    description:
      "Waveform, transport primitives, and the full player composition using live app wiring.",
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
  audio: audioSectionItemCount,
} as const;

const catalogSectionsWithCounts = catalogSections.map((section) => ({
  ...section,
  itemCount: sectionItemCounts[section.id],
}));

const totalItemCount = catalogSectionsWithCounts.reduce(
  (total, section) => total + section.itemCount,
  0,
);

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
      return <AudioSection />;
  }
}

export default function UiPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="border-b bg-background">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-3">
              <Link
                href="/"
                className="inline-flex items-center font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                ← home
              </Link>
              <div className="space-y-2">
                <h1 className="font-mono text-3xl font-semibold tracking-[-0.02em] text-balance sm:text-4xl">
                  UI catalog
                </h1>
                <p className="max-w-2xl text-sm leading-6 text-muted-foreground text-pretty sm:text-base">
                  Browse the `@kkb/ui` system through focused primitives, interactive demo islands,
                  and the full audio player composition.
                </p>
              </div>
            </div>
            <ModeToggle />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-10 grid gap-px overflow-hidden rounded-lg border bg-border md:grid-cols-3">
          <div className="bg-background p-4">
            <p className="font-mono text-xs text-muted-foreground">coverage</p>
            <p className="mt-2 font-mono text-lg font-semibold">{totalItemCount} primitives</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Curated examples, not an export dump.
            </p>
          </div>
          <div className="bg-background p-4">
            <p className="font-mono text-xs text-muted-foreground">structure</p>
            <p className="mt-2 font-mono text-lg font-semibold">
              {catalogSections.length} sections
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Anchored for fast browsing and review.
            </p>
          </div>
          <div className="bg-background p-4">
            <p className="font-mono text-xs text-muted-foreground">source</p>
            <p className="mt-2 font-mono text-lg font-semibold">@kkb/ui</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Shared primitives before app-local UI.
            </p>
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
          <CatalogNav sections={catalogSectionsWithCounts} totalItemCount={totalItemCount} />
          <div className="space-y-16">
            {catalogSectionsWithCounts.map((section) => (
              <Section
                key={section.id}
                id={section.id}
                title={section.label}
                description={section.description}
                itemCount={section.itemCount}
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
