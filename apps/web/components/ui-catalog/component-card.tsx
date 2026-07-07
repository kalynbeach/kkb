import { cn } from "@kkb/ui/lib/utils";

type ComponentCardProps = {
  title: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
};

export function ComponentCard({ title, description, className, children }: ComponentCardProps) {
  return (
    <article
      className={cn(
        "flex h-full flex-col overflow-hidden border-t border-border/80 bg-card text-card-foreground",
        className,
      )}
      data-component-card="true"
    >
      <header className="border-b bg-muted/20 px-5 py-4">
        <h3 className="font-mono text-base leading-6 font-semibold tracking-[-0.01em]">{title}</h3>
        {description ? (
          <p className="mt-1 max-w-prose text-sm leading-6 text-muted-foreground">{description}</p>
        ) : null}
      </header>
      <div className="flex h-full flex-1 flex-col">{children}</div>
    </article>
  );
}
