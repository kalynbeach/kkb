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
        "pointer-events-none absolute inset-y-0 z-20 w-px -translate-x-1/2 bg-audio-accent shadow-[0_0_6px_var(--audio-accent-glow),0_0_2px_var(--audio-accent)]",
        className,
      )}
      style={{ left: `${progressPercent}%` }}
    />
  );
}

export { Playhead };
