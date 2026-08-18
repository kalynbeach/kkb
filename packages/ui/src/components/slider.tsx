"use client";

import { Slider as SliderPrimitive } from "@base-ui/react/slider";
import { cn } from "@kkb/ui/lib/utils";

const SliderRoot = SliderPrimitive.Root;
const SliderControl = SliderPrimitive.Control;
const SliderTrack = SliderPrimitive.Track;
const SliderIndicator = SliderPrimitive.Indicator;
const SliderThumb = SliderPrimitive.Thumb;

interface SliderProps
  extends Omit<
    SliderPrimitive.Root.Props<readonly number[]>,
    "defaultValue" | "onValueChange" | "onValueCommitted" | "value"
  > {
  defaultValue?: number[];
  value?: number[];
  getAriaLabel?: SliderPrimitive.Thumb.Props["getAriaLabel"];
  getAriaValueText?: SliderPrimitive.Thumb.Props["getAriaValueText"];
  onValueChange?: (value: number[], eventDetails: SliderPrimitive.Root.ChangeEventDetails) => void;
  onValueCommitted?: (
    value: number[],
    eventDetails: SliderPrimitive.Root.CommitEventDetails,
  ) => void;
}

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  getAriaLabel,
  getAriaValueText,
  onValueChange,
  onValueCommitted,
  ...props
}: SliderProps) {
  const values = value ?? defaultValue ?? [min, max];

  return (
    <SliderRoot
      className={cn("data-horizontal:w-full data-vertical:h-full", className)}
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      thumbAlignment="edge"
      onValueChange={(nextValue, eventDetails) => onValueChange?.([...nextValue], eventDetails)}
      onValueCommitted={(nextValue, eventDetails) =>
        onValueCommitted?.([...nextValue], eventDetails)
      }
      {...props}
    >
      <SliderControl className="relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-vertical:h-full data-vertical:min-h-44 data-vertical:w-auto data-vertical:flex-col">
        <SliderTrack
          data-slot="slider-track"
          className="relative grow overflow-hidden rounded-full bg-muted select-none data-horizontal:h-1.5 data-horizontal:w-full data-vertical:h-full data-vertical:w-1.5"
        >
          <SliderIndicator
            data-slot="slider-range"
            className="bg-primary select-none data-horizontal:h-full data-vertical:w-full"
          />
        </SliderTrack>
        {Array.from({ length: values.length }, (_, index) => (
          <SliderThumb
            data-slot="slider-thumb"
            getAriaLabel={getAriaLabel}
            getAriaValueText={getAriaValueText}
            index={index}
            key={index}
            className="block size-4 shrink-0 rounded-full border border-primary bg-background shadow-sm ring-ring/50 transition-[color,box-shadow] select-none hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
          />
        ))}
      </SliderControl>
    </SliderRoot>
  );
}

export type { SliderProps };
export { Slider, SliderControl, SliderIndicator, SliderRoot, SliderThumb, SliderTrack };
