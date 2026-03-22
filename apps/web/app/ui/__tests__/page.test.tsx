import { describe, expect, test } from "bun:test";
import { renderToString } from "react-dom/server";

import { Section } from "../../../components/ui-catalog/section";
import { LayoutSection } from "../../../components/ui-catalog/sections/layout-section";
import UiPage from "../page";

function renderUiPageHtml() {
  return renderToString(<UiPage />).replaceAll("<!-- -->", "");
}

describe("/ui page", () => {
  test("renders representative cards for the core catalog sections", () => {
    const html = renderUiPageHtml();

    expect(html).toContain("Card + Aspect Ratio");
    expect(html).toContain("Resizable Panels");
    expect(html).toContain("Tabs");
    expect(html).toContain("Navigation Menu");
    expect(html).toContain("Buttons");
    expect(html).toContain("OTP + Select");
    expect(html).toContain("Calendar");
    expect(html).toContain("Alerts");
  });

  test("renders overlay #19 cards instead of the placeholder shell", () => {
    const html = renderUiPageHtml();

    expect(html).toContain("Dialog + Sheet");
    expect(html).toContain("Alert Dialog + Drawer");
    expect(html).toContain("Popover + Hover Card + Tooltip");
    expect(html).not.toContain("Overlay content lands next");
  });

  test("renders menu #19 cards instead of the placeholder shell", () => {
    const html = renderUiPageHtml();

    expect(html).toContain("Dropdown Menu");
    expect(html).toContain("Context Menu");
    expect(html).toContain("Menubar");
    expect(html).toContain("Command");
    expect(html).toContain(
      "Dropdown, context, menubar, and command surfaces with isolated local state.",
    );
    expect(html).not.toContain("Dropdown Menu + Context Menu");
    expect(html).not.toContain("Menu content lands next");
  });

  test("renders data #19 cards instead of the placeholder shell", () => {
    const html = renderUiPageHtml();

    expect(html).toContain("Table");
    expect(html).toContain("Code");
    expect(html).toContain("Keyboard Shortcuts");
    expect(html).toContain("Carousel");
    expect(html).toContain(
      "Tables, inline code, shortcut patterns, and carousel cards with narrow local state.",
    );
    expect(html).toContain(
      "Representative key patterns for command-style UIs without implying live route wiring.",
    );
    expect(html).not.toContain("Open command palette");
    expect(html).not.toContain("Jump to menu section");
    expect(html).not.toContain("Data content lands next");
  });

  test("renders audio cards and the composition demo instead of the placeholder shell", () => {
    const html = renderUiPageHtml();

    expect(html).toContain("Waveform");
    expect(html).toContain("Playhead");
    expect(html).toContain("Player Controls");
    expect(html).toContain("Audio Composition");
    expect(html).toContain("Test Tone (AAC)");
    expect(html).toContain("Playlist");
    expect(html).not.toContain("Audio content lands next");
    expect(html).not.toContain("Section scaffold ready");
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
