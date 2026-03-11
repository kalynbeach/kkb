import { cn } from "@kkb/ui/lib/utils";
import type { Ref } from "react";

type PlayheadProps = {
  progressPercent: number;
  className?: string;
  nodeRef?: Ref<HTMLDivElement>;
};

function Playhead({ progressPercent, className, nodeRef }: PlayheadProps) {
  return (
    <div
      ref={nodeRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-y-0 z-20 w-px -translate-x-1/2 bg-[rgba(120,184,255,0.8)] shadow-[0_0_6px_rgba(120,184,255,0.5),0_0_2px_rgba(120,184,255,0.8)]",
        className,
      )}
      style={{ left: `${progressPercent}%` }}
    />
  );
}

export { Playhead };
