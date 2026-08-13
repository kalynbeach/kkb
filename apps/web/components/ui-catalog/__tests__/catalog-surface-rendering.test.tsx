import { describe, expect, test } from "bun:test";
import { renderToString } from "react-dom/server";
import { CatalogCoverageChart } from "../catalog-chart";
import {
  type CatalogItem,
  componentItems,
  itemFromId,
  secondaryItems,
  visualCatalogIds,
} from "../catalog-data";
import { chartData } from "../catalog-preview-data";
import { CatalogRail } from "../catalog-rail";
import { CatalogSurface } from "../catalog-surfaces";
import { PreviewWall } from "../preview-wall";
import { InputSection } from "../sections/input-section";

function renderCatalogSurfaceHtml(item: CatalogItem) {
  return renderToString(
    <CatalogSurface selectedItem={item} onSelect={() => undefined} />,
  ).replaceAll("<!-- -->", "");
}

function specimenTitlesFor(item: CatalogItem) {
  const html = renderCatalogSurfaceHtml(item);

  return [...html.matchAll(/<h3[^>]*>(.*?)<\/h3>/g)].map(
    (match) => match[1]?.replaceAll(/<[^>]*>/g, "") ?? "",
  );
}

function rangeInputLabels(html: string) {
  return [...html.matchAll(/<input[^>]*>/g)]
    .map(([input]) => input)
    .filter((input) => input?.includes('type="range"'))
    .map((input) => input?.match(/aria-label="([^"]+)"/)?.[1]);
}

describe("ui catalog focused surfaces", () => {
  test("renders focused specimens for every visual and supporting route", () => {
    for (const item of [...componentItems, ...secondaryItems]) {
      const html = renderCatalogSurfaceHtml(item);

      expect(specimenTitlesFor(item).length).toBeGreaterThan(0);
      if (item.entryType === "visual") {
        expect(html).toContain(`data-focused-component="${item.id}"`);
      } else {
        expect(html).toContain(`data-supporting-entry="${item.entryType}"`);
      }
      expect(html).not.toContain("Missing focused specimen");
      expect(html).not.toContain("Demo unavailable");
    }
  });

  test("keeps every visual and supporting entry available in desktop navigation", () => {
    const html = renderToString(
      <CatalogRail selectedItemId="preview" onSelect={() => undefined} />,
    );
    const navigableIds = [...html.matchAll(/data-catalog-item="([^"]+)"/g)].map(
      (match) => match[1],
    );

    expect(new Set(navigableIds)).toEqual(
      new Set([...componentItems, ...secondaryItems].map((item) => item.id)),
    );
  });

  test("renders explicit Preview coverage for every supported visual component", () => {
    const html = renderToString(<PreviewWall onSelect={() => undefined} />);
    const coveredIds = [...html.matchAll(/data-catalog-covers="([^"]+)"/g)].map(
      (match) => match[1],
    );

    expect(coveredIds).toEqual(visualCatalogIds);
    expect(new Set(coveredIds).size).toBe(visualCatalogIds.length);
  });

  test("names every catalog Slider range input through the thumb contract", () => {
    const focusedSlider = renderCatalogSurfaceHtml(itemFromId("slider"));
    const previewWall = renderToString(<PreviewWall onSelect={() => undefined} />);
    const inputSection = renderToString(<InputSection />);

    expect(rangeInputLabels(focusedSlider)).toEqual([
      "Low density",
      "Medium density",
      "High density",
      "Preview density",
    ]);
    expect(rangeInputLabels(previewWall)).toHaveLength(4);
    expect(rangeInputLabels(previewWall)).toContain("Density");
    expect(rangeInputLabels(previewWall)).toContain("Preview density");
    expect(rangeInputLabels(previewWall)).toContain("Volume");
    expect(rangeInputLabels(inputSection)).toEqual(["Density"]);
  });

  test("renders the initial theme geometry and state acceptance surface", () => {
    const designSystem = itemFromId("design-system");
    const html = renderCatalogSurfaceHtml(designSystem);

    expect(specimenTitlesFor(designSystem)).toEqual([
      "Semantic color",
      "Typography",
      "Geometry",
      "Spacing",
      "Interaction and status states",
      "Scoped instrument color",
      "Implementation",
      "State contract",
      "Scoped color",
    ]);
    expect(html).toContain("radius-none structure");
    expect(html).toContain("bg-success");
    expect(html).toContain("text-success-foreground");
    expect(html).toContain("bg-warning");
    expect(html).toContain("text-warning-foreground");
    expect(html).toContain('aria-busy="true"');
    expect(html).toContain('aria-invalid="true"');
    expect(html).toContain("Destructive: this action cannot be undone.");
  });

  test("does not reuse focused specimen signatures across catalog entries", () => {
    const signatures = new Map<string, string[]>();

    for (const item of [...componentItems, ...secondaryItems]) {
      const signature = specimenTitlesFor(item).join(" | ");
      signatures.set(signature, [...(signatures.get(signature) ?? []), item.id]);
    }

    const unintendedDuplicates = [...signatures.values()].filter((ids) => ids.length > 1);

    expect(unintendedDuplicates).toEqual([]);
  });

  test("renders specific high-priority specimen sheets", () => {
    expect(specimenTitlesFor(itemFromId("button"))).toEqual([
      "Variants and sizes",
      "Icons and states",
      "Action row",
    ]);
    expect(specimenTitlesFor(itemFromId("card"))).toEqual([
      "Default Size",
      "Small Size",
      "Content Edge to Edge",
      "Custom Spacing",
      "Footer Actions",
    ]);
    expect(specimenTitlesFor(itemFromId("badge"))).toEqual([
      "Variants",
      "Icon Left",
      "Icon Right",
      "With Spinner",
      "render",
      "Long Text",
    ]);
    expect(specimenTitlesFor(itemFromId("input"))).toEqual([
      "Text field states",
      "Label and help text",
      "Grouped search",
    ]);
    expect(specimenTitlesFor(itemFromId("dialog"))).toEqual([
      "Trigger and modal",
      "Open-state anatomy",
    ]);
    expect(specimenTitlesFor(itemFromId("table"))).toEqual([
      "Compact data table",
      "Caption and keyboard",
    ]);
    expect(specimenTitlesFor(itemFromId("select"))).toEqual([
      "Select states",
      "Select field context",
    ]);
    expect(specimenTitlesFor(itemFromId("combobox"))).toEqual([
      "Combobox search",
      "Combobox field context",
    ]);
    expect(specimenTitlesFor(itemFromId("drawer"))).toEqual([
      "Drawer trigger",
      "Drawer bottom-sheet anatomy",
    ]);
  });

  test("renders semantic chart content and mode-safe audio swatches", () => {
    const chartHtml = renderCatalogSurfaceHtml(itemFromId("chart"));
    const standaloneChartHtml = renderToString(<CatalogCoverageChart />).replaceAll("<!-- -->", "");
    const previewHtml = renderToString(<PreviewWall onSelect={() => undefined} />);
    const audioThemeHtml = renderCatalogSurfaceHtml(itemFromId("audio-theme"));

    expect(chartHtml.match(/role="img"/g)).toHaveLength(1);
    expect(chartHtml).not.toContain('role="application"');
    expect(chartHtml).toContain('data-chart-semantics="named-image-with-value-table"');
    expect(chartHtml).toContain("Bar chart comparing monthly component coverage.");
    expect(chartHtml).not.toContain("Bar chart showing Jan 52");
    expect(chartHtml).toContain("Monthly component coverage.");
    expect(standaloneChartHtml).toContain("Monthly component coverage values");
    for (const { month, value } of chartData) {
      expect(chartHtml).toContain(month);
      expect(chartHtml.match(new RegExp(`>${value}<`, "g"))).toHaveLength(1);
      expect(standaloneChartHtml.match(new RegExp(`>${value}<`, "g"))).toHaveLength(1);
    }
    expect(chartHtml).not.toContain('aria-label="Chart specimen"');
    expect(previewHtml).toContain("Curated monthly component coverage");
    expect(previewHtml).toContain("Inventory monthly component coverage");
    expect(previewHtml.match(/<table class="sr-only">/g)).toHaveLength(1);
    expect(previewHtml).toContain("text-audio-accent-foreground");
    expect(audioThemeHtml).toContain("text-audio-accent-foreground");
    expect(audioThemeHtml).not.toContain("bg-audio-accent text-primary");
    expect(previewHtml).toContain('aria-label="Find component"');
  });

  test("associates focused labels and exposes keyboard-operable context and toast controls", () => {
    const inputHtml = renderCatalogSurfaceHtml(itemFromId("input"));
    const comboboxHtml = renderCatalogSurfaceHtml(itemFromId("combobox"));
    const contextMenuHtml = renderCatalogSurfaceHtml(itemFromId("context-menu"));
    const sonnerHtml = renderCatalogSurfaceHtml(itemFromId("sonner"));

    expect(inputHtml).toContain('for="grouped-search"');
    expect(inputHtml).toContain('id="grouped-search"');
    expect(comboboxHtml).toContain('for="focused-component-combobox-trigger"');
    expect(comboboxHtml).toContain('id="focused-component-combobox-trigger"');
    expect(comboboxHtml).not.toContain('aria-label="Selected component"');
    expect(contextMenuHtml).toContain('data-slot="context-menu-trigger"');
    expect(contextMenuHtml).toContain('type="button"');
    expect(contextMenuHtml).toContain("Shift+F10");
    expect(sonnerHtml).toContain("Show toast");
    expect(sonnerHtml).toContain("Catalog verification complete");
  });

  test("differentiates curated and inventory controls with labelled regions", () => {
    const previewHtml = renderToString(<PreviewWall onSelect={() => undefined} />);

    expect(previewHtml).toContain('aria-label="Curated form specimens"');
    expect(previewHtml).toContain('aria-label="Curated audio specimens"');
    expect(previewHtml).toContain('aria-labelledby="preview-inventory-radio-group-title"');
    expect(previewHtml).toContain('aria-labelledby="preview-inventory-switch-title"');
    expect(previewHtml).toContain(
      'aria-labelledby="preview-inventory-audio-player-controls-title"',
    );
    expect(previewHtml).toContain('id="preview-inventory-radio-group-title"');
    expect(previewHtml).toContain('id="preview-inventory-switch-title"');
    expect(previewHtml).toContain('id="preview-inventory-audio-player-controls-title"');
  });

  test("keeps static tooltip anatomy out of the accessibility tree", () => {
    const tooltipHtml = renderCatalogSurfaceHtml(itemFromId("tooltip"));

    expect(tooltipHtml).toContain("Tooltip content anatomy");
    expect(tooltipHtml).not.toContain('role="tooltip"');
  });

  test("names focused textarea, input-group, OTP, and progress controls", () => {
    const textareaHtml = renderCatalogSurfaceHtml(itemFromId("textarea"));
    const inputGroupHtml = renderCatalogSurfaceHtml(itemFromId("input-group"));
    const otpHtml = renderCatalogSurfaceHtml(itemFromId("input-otp"));
    const progressHtml = renderCatalogSurfaceHtml(itemFromId("progress"));
    const cardHtml = renderCatalogSurfaceHtml(itemFromId("card"));

    expect(textareaHtml).toContain('aria-label="Empty handoff note"');
    expect(textareaHtml).toContain('aria-label="Completed handoff note"');
    expect(textareaHtml).toContain('aria-label="Locked handoff note"');
    expect(inputGroupHtml).toContain('aria-label="Filter components"');
    expect(otpHtml).toContain('aria-label="Segmented verification code"');
    expect(otpHtml).toContain('for="verification-code"');
    expect(otpHtml).toContain('id="verification-code"');
    expect(progressHtml).toContain('aria-label="Initial progress"');
    expect(progressHtml).toContain('aria-label="Current progress"');
    expect(progressHtml).toContain('aria-label="Near-complete progress"');
    expect(cardHtml).toContain('aria-label="Review progress"');
  });

  test("renders named specimens for compact menu, navigation, and data routes", () => {
    expect(specimenTitlesFor(itemFromId("dropdown-menu"))).toEqual([
      "Dropdown menu trigger",
      "Dropdown menu anatomy",
    ]);
    expect(specimenTitlesFor(itemFromId("context-menu"))).toEqual([
      "Context menu trigger",
      "Context menu anatomy",
    ]);
    expect(specimenTitlesFor(itemFromId("menubar"))).toEqual([
      "Menubar trigger",
      "Menubar menu anatomy",
    ]);
    expect(specimenTitlesFor(itemFromId("tabs"))).toEqual(["Tabs states", "Tabs density"]);
    expect(specimenTitlesFor(itemFromId("code"))).toEqual(["Inline code", "Code in dense copy"]);
    expect(specimenTitlesFor(itemFromId("carousel"))).toEqual([
      "Carousel viewport",
      "Carousel controls",
    ]);
    expect(specimenTitlesFor(itemFromId("json-render-registry"))).toEqual([
      "JSON Render Registry source",
      "JSON Render Registry contract",
    ]);
  });
});
