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
      "Default and compact card",
      "Edge-to-edge media",
      "Footer actions",
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
});
