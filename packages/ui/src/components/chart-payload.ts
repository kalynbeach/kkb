function mapVisibleChartPayload<Item extends { type?: string }, Result>(
  payload: readonly Item[],
  render: (item: Item, visibleIndex: number) => Result,
) {
  const results: Result[] = [];

  for (const item of payload) {
    if (item.type !== "none") {
      results.push(render(item, results.length));
    }
  }

  return results;
}

export { mapVisibleChartPayload };
