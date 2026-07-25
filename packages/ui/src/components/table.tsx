"use client";

import { cn } from "@kkb/ui/lib/utils";
import * as React from "react";

function Table({ className, ...props }: React.ComponentProps<"table">) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = React.useState(false);
  const [overflowIndicator, setOverflowIndicator] = React.useState<"start" | "end" | null>(null);
  const [accessibleLabel, setAccessibleLabel] = React.useState("");

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const updateOverflowState = () => {
      const nextIsOverflowing = container.scrollWidth > container.clientWidth;
      const nextAccessibleLabel = container.querySelector("caption")?.textContent?.trim() ?? "";
      const isRtl =
        container.closest<HTMLElement>("[dir]")?.dir === "rtl" ||
        window.getComputedStyle(container).direction === "rtl";
      const maxScrollDistance = container.scrollWidth - container.clientWidth;
      const scrollDistance = isRtl
        ? Math.abs(container.scrollLeft)
        : Math.max(0, container.scrollLeft);
      const hasHiddenOverflow = nextIsOverflowing && scrollDistance < maxScrollDistance - 1;
      const nextOverflowIndicator = hasHiddenOverflow ? (isRtl ? "start" : "end") : null;

      setIsOverflowing((current) => (current === nextIsOverflowing ? current : nextIsOverflowing));
      setOverflowIndicator((current) =>
        current === nextOverflowIndicator ? current : nextOverflowIndicator,
      );
      setAccessibleLabel((current) =>
        current === nextAccessibleLabel ? current : nextAccessibleLabel,
      );
    };

    updateOverflowState();

    const resizeObserver = new ResizeObserver(updateOverflowState);
    resizeObserver.observe(container);
    const table = container.querySelector("table");
    if (table) {
      resizeObserver.observe(table);
    }

    const mutationObserver = new MutationObserver(updateOverflowState);
    mutationObserver.observe(container, {
      characterData: true,
      childList: true,
      subtree: true,
    });
    container.addEventListener("scroll", updateOverflowState, { passive: true });
    window.addEventListener("resize", updateOverflowState);

    return () => {
      mutationObserver.disconnect();
      resizeObserver.disconnect();
      container.removeEventListener("scroll", updateOverflowState);
      window.removeEventListener("resize", updateOverflowState);
    };
  }, []);

  return (
    <div className="relative w-full min-w-0 max-w-full" data-slot="table-wrapper">
      <div
        ref={containerRef}
        role={isOverflowing ? "region" : undefined}
        aria-label={isOverflowing ? accessibleLabel || "Scrollable table" : undefined}
        tabIndex={isOverflowing ? 0 : undefined}
        data-overflow={isOverflowing ? "horizontal" : undefined}
        data-overflow-indicator={overflowIndicator ?? undefined}
        data-slot="table-container"
        className="peer w-full overflow-x-auto overscroll-x-contain focus-visible:outline-none"
        style={
          overflowIndicator
            ? {
                maskImage:
                  overflowIndicator === "start"
                    ? "linear-gradient(to right, transparent 0, black 2rem, black 100%)"
                    : "linear-gradient(to right, black 0, black calc(100% - 2rem), transparent 100%)",
              }
            : undefined
        }
      >
        <table
          data-slot="table"
          className={cn("w-full caption-bottom text-sm", className)}
          {...props}
        />
      </div>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 peer-focus-visible:ring-[3px] peer-focus-visible:ring-inset peer-focus-visible:ring-ring/50"
      />
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return <thead data-slot="table-header" className={cn("[&_tr]:border-b", className)} {...props} />;
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  );
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn("bg-muted/50 border-t font-medium [&>tr]:last:border-b-0", className)}
      {...props}
    />
  );
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
        className,
      )}
      {...props}
    />
  );
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className,
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className,
      )}
      {...props}
    />
  );
}

function TableCaption({ className, ...props }: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("text-muted-foreground mt-4 text-sm", className)}
      {...props}
    />
  );
}

export { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow };
