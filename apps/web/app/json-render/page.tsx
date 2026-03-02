import { JsonRenderDemo } from "./demo";
import { cardSpec, dashboardSpec, formSpec, tabsSpec } from "./examples";

export default function JsonRenderPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-4xl space-y-12">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">json-render</h1>
          <p className="text-muted-foreground">
            JSON specs rendered as React component trees with shadcn/ui
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Card + Content</h2>
          <p className="text-sm text-muted-foreground">
            Static spec with Card, Stack, Heading, and Text components.
          </p>
          <JsonRenderDemo spec={cardSpec} />
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Dashboard Layout</h2>
          <p className="text-sm text-muted-foreground">
            Grid layout with metrics, badges, progress bars, and a data table.
          </p>
          <JsonRenderDemo spec={dashboardSpec} />
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Interactive Form</h2>
          <p className="text-sm text-muted-foreground">
            Two-way state bindings with $bindState, $template expressions, and
            visibility conditions.
          </p>
          <JsonRenderDemo spec={formSpec} />
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Tabbed Navigation</h2>
          <p className="text-sm text-muted-foreground">
            Tabs with visibility-controlled content panels and an accordion FAQ.
          </p>
          <JsonRenderDemo spec={tabsSpec} />
        </section>
      </div>
    </div>
  );
}
