"use client";

import { type ChartConfig, ChartContainer } from "@kkb/ui/components/chart";
import { cn } from "@kkb/ui/lib/utils";
import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { chartData } from "./catalog-preview-data";

const chartConfig = {
  value: {
    label: "Coverage",
    color: "var(--foreground)",
  },
} satisfies ChartConfig;

export function CatalogCoverageChart({
  className,
  showValueTable = true,
}: {
  className?: string;
  showValueTable?: boolean;
}) {
  const titleId = React.useId();
  const descriptionId = React.useId();

  return (
    <figure className={cn("min-w-0", className)}>
      <figcaption id={titleId} className="sr-only">
        Monthly component coverage
      </figcaption>
      <p id={descriptionId} className="sr-only">
        Bar chart comparing monthly component coverage.
      </p>
      <ChartContainer
        config={chartConfig}
        role="img"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        data-chart-semantics="named-image-with-value-table"
        className="min-h-40 w-full border bg-muted/20 p-2"
      >
        <BarChart
          accessibilityLayer={false}
          data={chartData}
          margin={{ left: 4, right: 4, top: 8 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} />
          <YAxis hide domain={[0, 100]} />
          <Bar dataKey="value" fill="var(--color-value)" radius={0} />
        </BarChart>
      </ChartContainer>
      {showValueTable ? (
        <table className="sr-only">
          <caption>Monthly component coverage values</caption>
          <thead>
            <tr>
              <th scope="col">Month</th>
              <th scope="col">Coverage</th>
            </tr>
          </thead>
          <tbody>
            {chartData.map((entry) => (
              <tr key={entry.month}>
                <th scope="row">{entry.month}</th>
                <td>{entry.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </figure>
  );
}
