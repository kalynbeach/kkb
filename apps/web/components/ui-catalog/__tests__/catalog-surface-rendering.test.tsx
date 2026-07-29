import { describe, expect, test } from "bun:test";
import { renderToString } from "react-dom/server";

import { type CatalogItem, componentItems, itemFromId, utilityItems } from "../catalog-data";
import { CatalogSurface } from "../catalog-surfaces";

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

describe("ui catalog focused surfaces", () => {
  test("renders focused specimen headings for every component and utility route", () => {
    for (const item of [...componentItems, ...utilityItems]) {
      expect(specimenTitlesFor(item).length).toBeGreaterThan(0);
    }
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

  test("keeps broad duplicate rendered specimen signatures limited", () => {
    const signatures = new Map<string, string[]>();

    for (const item of [...componentItems, ...utilityItems]) {
      const signature = specimenTitlesFor(item).join(" | ");
      signatures.set(signature, [...(signatures.get(signature) ?? []), item.id]);
    }

    const broadDuplicates = [...signatures.values()].filter((ids) => ids.length > 3);

    expect(broadDuplicates).toEqual([]);
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
      "asChild",
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
