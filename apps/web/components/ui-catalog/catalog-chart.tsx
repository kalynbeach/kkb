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
  accessibleTitle = "Monthly component coverage",
  className,
  showValueTable = true,
}: {
  accessibleTitle?: string;
  className?: string;
  showValueTable?: boolean;
}) {
  const descriptionId = React.useId();

  return (
    <figure
      aria-describedby={descriptionId}
      data-chart-semantics={showValueTable ? "named-figure-with-value-table" : "named-figure"}
      className={cn("min-w-0", className)}
    >
      <figcaption className="sr-only">{accessibleTitle}</figcaption>
      <p id={descriptionId} className="sr-only">
        Bar chart comparing monthly component coverage.
      </p>
      <ChartContainer
        config={chartConfig}
        aria-hidden="true"
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
          <caption>{accessibleTitle} values</caption>
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
