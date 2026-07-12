import { allSelectableItems, type CatalogItem, itemFromId, itemsForCategory } from "./catalog-data";

export type CatalogSearchMatch = {
  item: CatalogItem;
  score: number;
};

export type CatalogSearchGroup = {
  heading: string;
  items: readonly CatalogItem[];
};

const kindPriority: Record<CatalogItem["kind"], number> = {
  view: 0,
  component: 1,
  category: 2,
  utility: 3,
};

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function words(value: string) {
  return normalize(value).split(" ").filter(Boolean);
}

function defaultOrder(items: readonly CatalogItem[]) {
  return [...items].sort((left, right) => {
    if (left.id === "preview") {
      return -1;
    }

    if (right.id === "preview") {
      return 1;
    }

    if (left.id === "design-system") {
      return -1;
    }

    if (right.id === "design-system") {
      return 1;
    }

    const kindDifference = kindPriority[left.kind] - kindPriority[right.kind];

    if (kindDifference !== 0) {
      return kindDifference;
    }

    return left.label.localeCompare(right.label);
  });
}

function scoreItem(item: CatalogItem, rawQuery: string) {
  const query = normalize(rawQuery);

  if (!query) {
    return 1;
  }

  const queryWords = words(rawQuery);
  const label = normalize(item.label);
  const id = normalize(item.id);
  const source = normalize(item.source);
  const keywordText = normalize(item.keywords.join(" "));
  const description = normalize(item.description);
  const itemWords = new Set([...words(item.label), ...words(item.id)]);

  if (label === query || id === query) {
    return 10_000;
  }

  if (label.startsWith(query) || id.startsWith(query)) {
    return 9_000;
  }

  if (itemWords.has(query)) {
    return 8_000;
  }

  if (queryWords.every((word) => itemWords.has(word))) {
    return 7_500;
  }

  if (queryWords.every((word) => keywordText.includes(word))) {
    return 7_000;
  }

  if (queryWords.every((word) => source.includes(word))) {
    return 6_000;
  }

  if (queryWords.every((word) => description.includes(word))) {
    return 5_000;
  }

  return 0;
}

export function rankCatalogSearch(
  query: string,
  items: readonly CatalogItem[] = allSelectableItems,
): CatalogSearchMatch[] {
  if (!query.trim()) {
    return defaultOrder(items).map((item) => ({ item, score: 1 }));
  }

  const matches: CatalogSearchMatch[] = [];

  for (const item of items) {
    const score = scoreItem(item, query);

    if (score > 0) {
      matches.push({ item, score });
    }
  }

  return matches.sort((left, right) => {
    const scoreDifference = right.score - left.score;

    if (scoreDifference !== 0) {
      return scoreDifference;
    }

    const kindDifference = kindPriority[left.item.kind] - kindPriority[right.item.kind];

    if (kindDifference !== 0) {
      return kindDifference;
    }

    const importantDifference = Number(right.item.important) - Number(left.item.important);

    if (importantDifference !== 0) {
      return importantDifference;
    }

    return left.item.label.localeCompare(right.item.label);
  });
}

export function searchCatalogItems(query: string, items?: readonly CatalogItem[]) {
  return rankCatalogSearch(query, items).map((match) => match.item);
}

export function getCatalogSearchGroups(
  query: string,
  selectedItem: CatalogItem,
): CatalogSearchGroup[] {
  if (!query) {
    return emptySearchGroups(selectedItem);
  }

  const grouped = new Map<string, CatalogItem[]>();

  for (const { item } of rankCatalogSearch(query).slice(0, 24)) {
    const heading = searchResultHeading(item);
    grouped.set(heading, [...(grouped.get(heading) ?? []), item]);
  }

  return [...grouped].map(([heading, items]) => ({ heading, items }));
}

function emptySearchGroups(selectedItem: CatalogItem): CatalogSearchGroup[] {
  const pinned = [itemFromId("preview"), itemFromId("design-system")];

  const currentCategory =
    selectedItem.category === "Design System" ? [] : itemsForCategory(selectedItem.category);

  const categoryItems = allSelectableItems.filter((item) => item.kind === "category");

  return [
    { heading: "Pinned", items: pinned },
    {
      heading:
        selectedItem.category === "Design System" ? "Core components" : selectedItem.category,
      items:
        currentCategory.length > 0
          ? currentCategory
          : allSelectableItems
              .filter((item) => item.important && item.kind === "component")
              .slice(0, 10),
    },
    { heading: "Browse categories", items: categoryItems },
  ].filter((group) => group.items.length > 0);
}

function searchResultHeading(item: CatalogItem) {
  switch (item.kind) {
    case "view":
      return "Views";
    case "category":
      return "Categories";
    case "component":
    case "utility":
      return item.category;
  }
}
