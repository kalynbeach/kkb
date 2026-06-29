import { describe, expect, test } from "bun:test";
import { renderToString } from "react-dom/server";

import { itemFromId } from "../../../components/ui-catalog/catalog-data";
import { CatalogCompactNav } from "../../../components/ui-catalog/catalog-rail";
import { CategorySurface } from "../../../components/ui-catalog/category-surface";
import { LayoutSection } from "../../../components/ui-catalog/sections/layout-section";
import UiPage from "../page";

function renderUiPageHtml() {
  return renderToString(<UiPage />).replaceAll("<!-- -->", "");
}

describe("/ui page", () => {
  test("renders the catalog workbench suspense fallback during server string rendering", () => {
    const html = renderUiPageHtml();

    expect(html).toContain("@kkb/ui / catalog");
    expect(html).toContain("UI catalog");
    expect(html).toContain("Loading catalog workbench");
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
  });
});
