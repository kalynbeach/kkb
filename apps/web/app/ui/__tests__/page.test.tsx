import { describe, expect, test } from "bun:test";
import { renderToString } from "react-dom/server";

import { Section } from "../../../components/ui-catalog/section";
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

  test("keeps section cards two-up on desktop before widening to three columns", () => {
    const html = renderToString(
      <Section id="layout" title="Layout" itemCount={4}>
        <div>one</div>
      </Section>,
    ).replaceAll("<!-- -->", "");

    expect(html).toContain("md:grid-cols-2 2xl:grid-cols-3");
  });

  test("treats the layout showcase as a featured card on desktop", () => {
    const html = renderToString(<LayoutSection />).replaceAll("<!-- -->", "");

    expect(html).toContain("md:col-span-2");
  });
});
