import { cn } from "@kkb/ui/lib/utils";

type SectionProps = {
  id: string;
  title: string;
  description?: string;
  itemCount: number;
  className?: string;
  children: React.ReactNode;
};

export function Section({ id, title, description, itemCount, className, children }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={cn("scroll-mt-36 space-y-6 md:scroll-mt-32", className)}
    >
      <div className="grid gap-3 border-t pt-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
        <div className="space-y-2">
          <p className="font-mono text-xs text-muted-foreground">section / {id}</p>
          <h2
            id={`${id}-heading`}
            className="font-mono text-2xl font-semibold tracking-[-0.01em] text-balance"
          >
            {title}
          </h2>
          {description ? (
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground text-pretty">
              {description}
            </p>
          ) : null}
        </div>
        <span className="inline-flex min-h-9 items-center justify-center rounded-md border bg-background px-3 font-mono text-xs text-muted-foreground">
          {itemCount} demos
        </span>
      </div>
      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">{children}</div>
    </section>
  );
}
