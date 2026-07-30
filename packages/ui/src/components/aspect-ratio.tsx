import { cn } from "@kkb/ui/lib/utils";
import type * as React from "react";

function AspectRatio({
  ratio,
  className,
  style,
  ...props
}: React.ComponentProps<"div"> & { ratio: number }) {
  return (
    <div
      data-slot="aspect-ratio"
      className={cn("relative aspect-(--ratio)", className)}
      style={{ ...style, "--ratio": ratio } as React.CSSProperties}
      {...props}
    />
  );
}

export { AspectRatio };
