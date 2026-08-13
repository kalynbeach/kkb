import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  catalogItems,
  categoryId,
  componentItems,
  itemFromId,
  itemsForCategory,
  resolveCatalogItem,
  secondaryItems,
  visualCatalogIds,
} from "../catalog-data";
import { getCatalogSearchGroups, searchCatalogItems } from "../catalog-search-index";

function workspaceRoot() {
  return process.cwd().endsWith("/apps/web") ? resolve(process.cwd(), "../..") : process.cwd();
}

type UiPackageExports = Record<string, string>;

const catalogEligibleExportPrefixes = ["./components/", "./hooks/", "./json-render"];
const catalogExcludedExports = new Set(["./lib/*", "./styles/*.css"]);

function uiPackageExports() {
  const root = workspaceRoot();
  return (
    JSON.parse(readFileSync(resolve(root, "packages/ui/package.json"), "utf8")) as {
      exports: UiPackageExports;
    }
  ).exports;
}

function isCatalogEligibleExport(subpath: string) {
  return catalogEligibleExportPrefixes.some((prefix) => subpath.startsWith(prefix));
}

function publicSubpathsForExport(subpath: string, target: string) {
  if (!subpath.includes("*") && !target.includes("*")) {
    return [`@kkb/ui/${subpath.slice(2)}`];
  }

  const [subpathPrefix, subpathSuffix] = subpath.split("*");
  const [targetPrefix, targetSuffix] = target.split("*");

  if (subpathPrefix === undefined || targetPrefix === undefined || targetSuffix === undefined) {
    throw new Error(`Unsupported @kkb/ui export pattern: ${subpath} -> ${target}`);
  }

  const targetDirectory = resolve(workspaceRoot(), "packages/ui", targetPrefix);
  const files = [
    ...new Bun.Glob(`**/*${targetSuffix}`).scanSync({ cwd: targetDirectory, onlyFiles: true }),
  ].filter((path) => !path.includes("/__tests__/") && !path.startsWith("__tests__/"));

  return files.map((path) => {
    const wildcardValue = path.slice(0, -targetSuffix.length);
    return `@kkb/ui/${subpathPrefix.slice(2)}${wildcardValue}${subpathSuffix ?? ""}`;
  });
}

function publicCatalogEligibleSubpaths() {
  return Object.entries(uiPackageExports())
    .filter(([subpath]) => isCatalogEligibleExport(subpath))
    .flatMap(([subpath, target]) => publicSubpathsForExport(subpath, target))
    .sort();
}

describe("ui catalog data", () => {
  test("derives bidirectional inventory parity from catalog-eligible package exports", () => {
    const catalogExportSubpaths = catalogItems
      .filter((item) => item.source.startsWith("@kkb/ui/"))
      .map((item) => item.source)
      .sort();

    expect(catalogExportSubpaths).toEqual(publicCatalogEligibleSubpaths());
    expect(new Set(catalogExportSubpaths).size).toBe(catalogExportSubpaths.length);
  });

  test("classifies every package export as catalog-eligible or intentionally excluded", () => {
    for (const subpath of Object.keys(uiPackageExports())) {
      const classifications = [
        isCatalogEligibleExport(subpath),
        catalogExcludedExports.has(subpath),
      ].filter(Boolean);

      expect(classifications).toHaveLength(1);
    }
  });

  test("keeps eligible hooks and integrations synchronized with catalog data", () => {
    const expectedSupportingSubpaths = publicCatalogEligibleSubpaths().filter(
      (source) => source.startsWith("@kkb/ui/hooks/") || source.startsWith("@kkb/ui/json-render"),
    );
    const catalogSupportingSubpaths = catalogItems
      .map((item) => item.source)
      .filter(
        (source) => source.startsWith("@kkb/ui/hooks/") || source.startsWith("@kkb/ui/json-render"),
      )
      .sort();

    expect(expectedSupportingSubpaths.some((source) => source.startsWith("@kkb/ui/hooks/"))).toBe(
      true,
    );
    expect(
      expectedSupportingSubpaths.some((source) => source.startsWith("@kkb/ui/json-render")),
    ).toBe(true);
    expect(catalogSupportingSubpaths).toEqual(expectedSupportingSubpaths);
  });

  test("classifies every public visual component and supporting export explicitly", () => {
    expect(componentItems.map((item) => item.id)).toEqual(visualCatalogIds);
    expect(componentItems.every((item) => item.entryType === "visual")).toBe(true);
    expect(
      secondaryItems.map(({ id, entryType, experimental }) => ({
        id,
        entryType,
        experimental: Boolean(experimental),
      })),
    ).toEqual([
      { id: "direction", entryType: "provider", experimental: false },
      { id: "theme-provider", entryType: "provider", experimental: false },
      { id: "use-mobile", entryType: "hook", experimental: false },
      { id: "audio-presenter", entryType: "presenter", experimental: false },
      { id: "audio-theme", entryType: "theme", experimental: false },
      { id: "json-render", entryType: "integration", experimental: true },
      { id: "json-render-catalog", entryType: "integration", experimental: true },
      { id: "json-render-registry", entryType: "integration", experimental: true },
    ]);
    expect(itemFromId("mode-toggle").entryType).toBe("visual");
  });

  test("backs URL item selection with stable category ids and preview fallback", () => {
    expect(categoryId("Design System")).toBe("category-design-system");
    expect(categoryId("Audio")).toBe("category-audio");
    expect(itemFromId("missing").id).toBe("preview");
    expect(resolveCatalogItem("missing")).toEqual({
      item: itemFromId("preview"),
      missingItemId: "missing",
    });
  });

  test("keeps category source paths backed by local files", () => {
    const root = workspaceRoot();
    const categoryItems = catalogItems.filter((item) => item.kind === "category");

    for (const item of categoryItems) {
      expect(existsSync(resolve(root, item.source))).toBe(true);
    }
  });

  test("keeps visual audio components primary and support contracts secondary", () => {
    const audioItems = itemsForCategory("Audio");

    expect(audioItems.find((item) => item.id === "audio-waveform")?.entryType).toBe("visual");
    expect(audioItems.find((item) => item.id === "audio-presenter")?.entryType).toBe("presenter");
    expect(audioItems.find((item) => item.id === "audio-theme")?.entryType).toBe("theme");
  });

  test("ranks exact button component matches before related results", () => {
    expect(
      searchCatalogItems("button")
        .slice(0, 2)
        .map((item) => item.id),
    ).toEqual(["button", "button-group"]);
  });

  test("distinguishes the Input component from the Input category", () => {
    const resultIds = searchCatalogItems("input").map((item) => item.id);

    expect(resultIds[0]).toBe("input");
    expect(resultIds.indexOf("category-input")).toBeGreaterThan(resultIds.indexOf("input"));
  });

  test("keeps secondary exact matches searchable without promoting them by default", () => {
    expect(searchCatalogItems("audio presenter")[0]?.id).toBe("audio-presenter");
    expect(searchCatalogItems("").indexOf(itemFromId("audio-presenter"))).toBeGreaterThan(
      searchCatalogItems("").indexOf(itemFromId("audio-waveform")),
    );
  });

  test("keeps the default search list flat and view-first", () => {
    expect(
      searchCatalogItems("")
        .slice(0, 2)
        .map((item) => item.id),
    ).toEqual(["preview", "design-system"]);
  });

  test("returns no results for unknown queries", () => {
    expect(searchCatalogItems("not-a-real-component")).toEqual([]);
  });

  test("groups empty search around pinned views, current category, and category browse", () => {
    const groups = getCatalogSearchGroups("", itemFromId("button"));

    expect(groups.map((group) => group.heading)).toEqual(["Pinned", "Input", "Browse categories"]);
    expect(groups[0]?.items.map((item) => item.id)).toEqual(["preview", "design-system"]);
    expect(groups[1]?.items.map((item) => item.id)).toContain("button");
    expect(groups[2]?.items.map((item) => item.id)).toContain("category-audio");
  });
});
