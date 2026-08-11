"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import type { Separator as SeparatorPrimitive } from "@base-ui/react/separator";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "@kkb/ui/lib/utils";
import type * as React from "react";

interface SeparatorProps extends Omit<SeparatorPrimitive.Props, "role"> {
  decorative?: boolean;
  role?: React.AriaRole;
}

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  role,
  render,
  style,
  ...props
}: SeparatorProps) {
  const state = { orientation };
  const resolvedClassName = typeof className === "function" ? className(state) : className;
  const resolvedStyle = typeof style === "function" ? style(state) : style;
  const baseProps = {
    "data-slot": "separator",
    "data-orientation": orientation,
    "data-horizontal": orientation === "horizontal" ? "" : undefined,
    "data-vertical": orientation === "vertical" ? "" : undefined,
    role: decorative ? "none" : (role ?? "separator"),
    "aria-orientation": decorative ? undefined : orientation,
    className: cn(
      "shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:h-full data-vertical:w-px",
      resolvedClassName,
    ),
    style: resolvedStyle,
  } as React.ComponentProps<"div">;

  return useRender({
    defaultTagName: "div",
    render,
    state,
    props: mergeProps<"div">(baseProps, props),
  });
}

export type { SeparatorProps };
export { Separator };
