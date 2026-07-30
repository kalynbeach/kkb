"use client";

import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group";
import { cn } from "@kkb/ui/lib/utils";
import type { VariantProps } from "class-variance-authority";
import * as React from "react";

import { toggleVariants } from "./toggle-variants";

const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants> & {
    spacing?: number;
    orientation?: "horizontal" | "vertical";
  }
>({
  size: "default",
  variant: "default",
  spacing: 0,
  orientation: "horizontal",
});

type SharedToggleGroupProps = Omit<
  ToggleGroupPrimitive.Props<string>,
  "defaultValue" | "multiple" | "onValueChange" | "value"
> &
  VariantProps<typeof toggleVariants> & {
    spacing?: number;
    orientation?: "horizontal" | "vertical";
  };

type SingleToggleGroupProps = SharedToggleGroupProps & {
  type?: "single";
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string, eventDetails: ToggleGroupPrimitive.ChangeEventDetails) => void;
};

type MultipleToggleGroupProps = SharedToggleGroupProps & {
  type: "multiple";
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[], eventDetails: ToggleGroupPrimitive.ChangeEventDetails) => void;
};

type ToggleGroupProps = SingleToggleGroupProps | MultipleToggleGroupProps;

function ToggleGroup({
  className,
  variant,
  size,
  spacing = 0,
  orientation = "horizontal",
  children,
  type = "single",
  value,
  defaultValue,
  onValueChange,
  ...props
}: ToggleGroupProps) {
  const multiple = type === "multiple";
  const baseValue = multiple
    ? (value as string[] | undefined)
    : typeof value === "string"
      ? [value]
      : undefined;
  const baseDefaultValue = multiple
    ? (defaultValue as string[] | undefined)
    : typeof defaultValue === "string"
      ? [defaultValue]
      : undefined;

  return (
    <ToggleGroupPrimitive
      data-slot="toggle-group"
      data-variant={variant}
      data-size={size}
      data-spacing={spacing}
      style={{ "--gap": spacing } as React.CSSProperties}
      className={cn(
        "group/toggle-group flex w-fit items-center gap-[--spacing(var(--gap))] rounded-md data-vertical:flex-col data-vertical:items-stretch data-[spacing=0]:data-[variant=outline]:shadow-xs",
        className,
      )}
      multiple={multiple}
      orientation={orientation}
      value={baseValue}
      defaultValue={baseDefaultValue}
      onValueChange={(nextValue, eventDetails) => {
        if (multiple) {
          (onValueChange as MultipleToggleGroupProps["onValueChange"])?.(nextValue, eventDetails);
        } else {
          (onValueChange as SingleToggleGroupProps["onValueChange"])?.(
            nextValue[0] ?? "",
            eventDetails,
          );
        }
      }}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ variant, size, spacing, orientation }}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive>
  );
}

function ToggleGroupItem({
  className,
  children,
  variant,
  size,
  ...props
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>) {
  const context = React.useContext(ToggleGroupContext);

  return (
    <TogglePrimitive
      data-slot="toggle-group-item"
      data-variant={context.variant || variant}
      data-size={context.size || size}
      data-spacing={context.spacing}
      className={cn(
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        "w-auto min-w-0 shrink-0 px-3 focus:z-10 focus-visible:z-10",
        "data-[spacing=0]:rounded-none data-[spacing=0]:shadow-none group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:border-l-0 group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-l group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:border-t-0 group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-t group-data-horizontal/toggle-group:data-[spacing=0]:first:rounded-l-md group-data-horizontal/toggle-group:data-[spacing=0]:last:rounded-r-md group-data-vertical/toggle-group:data-[spacing=0]:first:rounded-t-md group-data-vertical/toggle-group:data-[spacing=0]:last:rounded-b-md",
        className,
      )}
      {...props}
    >
      {children}
    </TogglePrimitive>
  );
}

export type { ToggleGroupProps };
export { ToggleGroup, ToggleGroupItem };
