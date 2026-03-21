import { describe, expect, test } from "bun:test";
import { renderToString } from "react-dom/server";

import { Section } from "../_components/section";
import { LayoutSection } from "../_components/sections/layout-section";
import UiPage from "../page";

describe("/ui page", () => {
  test("renders representative cards for the core catalog sections", () => {
    const html = renderToString(<UiPage />).replaceAll("<!-- -->", "");

    expect(html).toContain("Card + Aspect Ratio");
    expect(html).toContain("Tabs");
    expect(html).toContain("Buttons");
    expect(html).toContain("Alerts");
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
