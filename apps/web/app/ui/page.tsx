import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@kkb/ui/components/empty";
import { ModeToggle } from "@kkb/ui/components/mode-toggle";
import Link from "next/link";

import { CatalogNav } from "./_components/catalog-nav";
import { ComponentCard } from "./_components/component-card";
import { Section } from "./_components/section";

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
    description: "Dialog and popover demos follow once the isolated client demo islands are added.",
  },
  {
    id: "menu",
    label: "Menu",
    description: "Menu patterns and command surfaces will layer onto this scaffold.",
  },
  {
    id: "data",
    label: "Data",
    description: "Tables, code, carousel, and related display components will land here.",
  },
  {
    id: "audio",
    label: "Audio",
    description:
      "Audio primitives and the composition demo will fill in after the scaffold is merged.",
  },
] as const;

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
                itemCount={0}
              >
                <ComponentCard
                  title="Section scaffold ready"
                  description="Shared card and section primitives are in place for follow-up demos."
                  className="md:col-span-2 xl:col-span-3"
                >
                  <Empty className="min-h-52 rounded-none border-0">
                    <EmptyHeader>
                      <EmptyTitle>{section.label} content lands next</EmptyTitle>
                      <EmptyDescription>
                        This section is intentionally empty in issue #18. Follow-up work adds the
                        real demos without rewriting the page shell.
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                </ComponentCard>
              </Section>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
