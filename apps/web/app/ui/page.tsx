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
    description:
      "Dialogs, drawers, and contextual overlays stay isolated inside small demo islands.",
  },
  {
    id: "menu",
    label: "Menu",
    description: "Dropdown, context, menubar, and command surfaces with isolated local state.",
  },
  {
    id: "data",
    label: "Data",
    description:
      "Tables, inline code, shortcut patterns, and carousel cards with narrow local state.",
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
                  Curated `@kkb/ui` primitives, isolated demo islands, and the full audio player
                  composition in one verification route.
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
