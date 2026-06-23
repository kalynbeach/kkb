import { describe, expect, test } from "bun:test";

import {
  categoryId,
  componentItems,
  itemFromId,
  itemsForCategory,
  resolveCatalogItem,
  utilityItems,
} from "../catalog-data";
import { getCatalogSearchGroups } from "../catalog-search";
import { searchCatalogItems } from "../catalog-search-index";

const publicComponentIds = [
  "accordion",
  "alert-dialog",
  "alert",
  "aspect-ratio",
  "avatar",
  "badge",
  "breadcrumb",
  "button",
  "button-group",
  "calendar",
  "card",
  "carousel",
  "chart",
  "checkbox",
  "code",
  "collapsible",
  "combobox",
  "command",
  "context-menu",
  "dialog",
  "direction",
  "drawer",
  "dropdown-menu",
  "empty",
  "field",
  "form",
  "hover-card",
  "input",
  "input-group",
  "input-otp",
  "item",
  "kbd",
  "label",
  "menubar",
  "mode-toggle",
  "native-select",
  "navigation-menu",
  "pagination",
  "popover",
  "progress",
  "radio-group",
  "resizable",
  "scroll-area",
  "select",
  "separator",
  "sheet",
  "sidebar",
  "skeleton",
  "slider",
  "sonner",
  "spinner",
  "switch",
  "table",
  "tabs",
  "textarea",
  "theme-provider",
  "toggle",
  "toggle-group",
  "tooltip",
  "audio-player-controls",
  "audio-playhead",
  "audio-waveform",
  "audio-presenter",
  "audio-theme",
] as const;

describe("ui catalog data", () => {
  test("keeps the public component inventory visible to the catalog", () => {
    const componentIds = new Set(componentItems.map((item) => item.id));

    for (const id of publicComponentIds) {
      expect(componentIds.has(id)).toBe(true);
    }
  });

  test("catalogs public utilities separately from visual components", () => {
    expect(utilityItems.map((item) => item.id)).toEqual([
      "use-mobile",
      "json-render",
      "json-render-catalog",
      "json-render-registry",
    ]);
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

  test("keeps audio as an instrument category with component exports", () => {
    expect(itemsForCategory("Audio").map((item) => item.id)).toContain("audio-waveform");
    expect(itemsForCategory("Audio").map((item) => item.id)).toContain("audio-presenter");
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
