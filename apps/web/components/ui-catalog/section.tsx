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
      className={cn("scroll-mt-36 space-y-5 md:scroll-mt-32", className)}
    >
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <h2 id={`${id}-heading`} className="text-2xl font-semibold tracking-tight">
            {title}
          </h2>
          <span className="inline-flex min-w-9 items-center justify-center rounded-full border px-2.5 py-1 text-xs font-medium text-muted-foreground">
            {itemCount}
          </span>
        </div>
        {description ? (
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">{children}</div>
    </section>
  );
}
