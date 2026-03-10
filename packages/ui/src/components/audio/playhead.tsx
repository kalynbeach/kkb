import { cn } from "@kkb/ui/lib/utils";

type PlayheadProps = {
  progressPercent: number;
  className?: string;
};

function Playhead({ progressPercent, className }: PlayheadProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-y-0 z-20 w-0.5 -translate-x-1/2 bg-white/95 shadow-[0_0_0_1px_rgba(15,23,42,0.28)]", className)}
      style={{ left: `${progressPercent}%` }}
    />
  );
}

export { Playhead }
