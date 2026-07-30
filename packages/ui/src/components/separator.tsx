"use client";

import { Separator as SeparatorPrimitive } from "@base-ui/react/separator";
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
  ...props
}: SeparatorProps) {
  return (
    <SeparatorPrimitive
      data-slot="separator"
      orientation={orientation}
      role={decorative ? "none" : (role ?? "separator")}
      className={cn(
        "shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:h-full data-vertical:w-px",
        className,
      )}
      {...props}
    />
  );
}

export type { SeparatorProps };
export { Separator };
