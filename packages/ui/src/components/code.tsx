import { cn } from "@kkb/ui/lib/utils";
import type { JSX } from "react";

export function Code({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}): JSX.Element {
  return (
    <code className={cn("rounded bg-muted px-1.5 py-1 font-mono font-semibold", className)}>
      {children}
    </code>
  );
}
