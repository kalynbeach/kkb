import { describe, expect, test } from "bun:test";

import {
  categoryId,
  componentItems,
  itemFromId,
  itemsForCategory,
  utilityItems,
} from "../catalog-data";

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
  });

  test("keeps audio as an instrument category with component exports", () => {
    expect(itemsForCategory("Audio").map((item) => item.id)).toContain("audio-waveform");
    expect(itemsForCategory("Audio").map((item) => item.id)).toContain("audio-presenter");
  });
});
