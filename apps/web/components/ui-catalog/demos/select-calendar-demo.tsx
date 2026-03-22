"use client";

import { Calendar } from "@kkb/ui/components/calendar";
import { Label } from "@kkb/ui/components/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@kkb/ui/components/select";
import { useState } from "react";

const densityOptions = [
  { value: "compact", label: "Compact" },
  { value: "comfortable", label: "Comfortable" },
  { value: "spacious", label: "Spacious" },
] as const;

type DensityValue = (typeof densityOptions)[number]["value"];

const calendarSummaryFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export function SelectDemo() {
  const [density, setDensity] = useState<DensityValue>("comfortable");

  function handleDensityChange(value: string) {
    const nextDensity = densityOptions.find((option) => option.value === value)?.value;
    if (nextDensity) {
      setDensity(nextDensity);
    }
  }

  return (
    <div className="space-y-4 p-6">
      <div className="space-y-2">
        <Label htmlFor="density-select">Preferred density</Label>
        <Select value={density} onValueChange={handleDensityChange}>
          <SelectTrigger id="density-select" className="w-full">
            <SelectValue placeholder="Pick density" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Canvas spacing</SelectLabel>
              {densityOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <p className="text-sm text-muted-foreground">
        Active spacing preset:{" "}
        <span className="font-medium text-foreground">
          {densityOptions.find((option) => option.value === density)?.label}
        </span>
      </p>
    </div>
  );
}

export function CalendarDemo() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date(2026, 2, 21));

  return (
    <div className="grid gap-4 p-4 sm:grid-cols-[auto_minmax(0,1fr)]">
      <div className="overflow-hidden rounded-xl border">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="mx-auto"
        />
      </div>
      <div className="space-y-2 rounded-xl border bg-muted/20 p-4">
        <p className="text-sm font-medium">Selected review date</p>
        <p className="text-sm leading-6 text-muted-foreground">
          {selectedDate ? calendarSummaryFormatter.format(selectedDate) : "No date selected"}
        </p>
        <p className="text-sm leading-6 text-muted-foreground">
          Use a compact single-date picker when the flow needs lightweight scheduling.
        </p>
      </div>
    </div>
  );
}
