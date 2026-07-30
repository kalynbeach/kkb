import { describe, expect, test } from "bun:test";
import { renderToString } from "react-dom/server";

import { itemFromId } from "../../../components/ui-catalog/catalog-data";
import { CatalogItemIcon } from "../../../components/ui-catalog/catalog-icons";
import { CatalogCompactNav } from "../../../components/ui-catalog/catalog-rail";
import { CategorySurface } from "../../../components/ui-catalog/category-surface";
import { LayoutSection } from "../../../components/ui-catalog/sections/layout-section";
import UiPage from "../page";

async function renderUiPageHtml() {
  const page = await UiPage({ searchParams: Promise.resolve({}) });
  return renderToString(page).replaceAll("<!-- -->", "");
}

describe("/ui page", () => {
  test("renders the catalog workbench suspense fallback during server string rendering", async () => {
    const html = await renderUiPageHtml();

    expect(html).toContain("@kkb/ui / catalog");
    expect(html).toContain("UI catalog");
    expect(html).toContain("Loading catalog workbench");
  });

  test("redirects invalid item queries without dropping other search parameters", async () => {
    let redirectError: unknown;

    try {
      await UiPage({
        searchParams: Promise.resolve({
          item: "not-a-catalog-item",
          mode: "compact",
          tag: ["one", "two"],
        }),
      });
    } catch (error) {
      redirectError = error;
    }

    expect(redirectError).toMatchObject({
      digest: "NEXT_REDIRECT;replace;/ui?mode=compact&tag=one&tag=two;307;",
    });
  });

  test("keeps category surfaces two-up on desktop before widening to three columns", () => {
    const html = renderToString(
      <CategorySurface item={itemFromId("category-layout")} />,
    ).replaceAll("<!-- -->", "");

    expect(html).toContain("md:grid-cols-2 xl:grid-cols-3");
  });

  test("treats the layout showcase as a featured card on desktop", () => {
    const html = renderToString(<LayoutSection />).replaceAll("<!-- -->", "");

    expect(html).toContain("md:col-span-2");
  });

  test("renders compact category browse navigation for mobile catalog inspection", () => {
    const html = renderToString(
      <CatalogCompactNav selectedItem={itemFromId("button")} onSelect={() => undefined} />,
    ).replaceAll("<!-- -->", "");

    expect(html).toContain("UI catalog sections");
    expect(html).toContain("Design System");
    expect(html).toContain("Input");
    expect(html).toContain("Audio");
    expect(html).toContain('aria-current="page"');
    expect(html).toContain("underline-offset-4");
  });

  test("treats catalog utility icons as decorative current-color geometry", () => {
    const html = renderToString(
      <CatalogItemIcon item={itemFromId("button")} className="size-4 text-muted-foreground" />,
    );

    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('focusable="false"');
    expect(html).toContain('class="size-4 text-muted-foreground"');
    expect(html).toContain('fill="currentColor"');
    expect(html).not.toContain("aria-label");
  });

  test("uses Phosphor across the migrated top-level workbench glyph boundary", async () => {
    const source = async (path: string) => Bun.file(new URL(path, import.meta.url)).text();
    const [workbench, search, icons, surfaceShared, command, modeToggle] = await Promise.all([
      source("../../../components/ui-catalog/catalog-workbench.tsx"),
      source("../../../components/ui-catalog/catalog-search.tsx"),
      source("../../../components/ui-catalog/catalog-icons.tsx"),
      source("../../../components/ui-catalog/catalog-surface-shared.tsx"),
      source("../../../../../packages/ui/src/components/command.tsx"),
      source("../../../../../packages/ui/src/components/mode-toggle.tsx"),
    ]);

    for (const file of [workbench, search, icons, surfaceShared, command, modeToggle]) {
      expect(file).toContain("@phosphor-icons/react");
      expect(file).not.toContain("lucide-react");
    }

    expect(workbench).toContain('aria-label="Return home"');
    expect(workbench).toContain('aria-label="Search catalog"');
    expect(search).toContain('aria-label="Search KKB UI catalog"');
    expect(search).toContain("Current catalog item");
    expect(command).toContain('className="size-5 shrink-0 opacity-50"');
    expect(modeToggle).toContain("Toggle theme");
    expect(modeToggle).toContain("motion-reduce:transition-none");
  });
});
