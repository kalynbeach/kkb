"use client";

import { PreviewCard as PreviewCardPrimitive } from "@base-ui/react/preview-card";

import { cn } from "@kkb/ui/lib/utils";
import * as React from "react";

const HoverCardDelayContext = React.createContext({
  openDelay: 700,
  closeDelay: 300,
});

type HoverCardProps = Omit<PreviewCardPrimitive.Root.Props, "children"> & {
  children?: React.ReactNode;
  openDelay?: number;
  closeDelay?: number;
};

function HoverCard({ children, openDelay = 700, closeDelay = 300, ...props }: HoverCardProps) {
  return (
    <HoverCardDelayContext.Provider value={{ openDelay, closeDelay }}>
      <PreviewCardPrimitive.Root data-slot="hover-card" {...props}>
        {children}
      </PreviewCardPrimitive.Root>
    </HoverCardDelayContext.Provider>
  );
}

function HoverCardTrigger({ delay, closeDelay, ...props }: PreviewCardPrimitive.Trigger.Props) {
  const delays = React.useContext(HoverCardDelayContext);
  return (
    <PreviewCardPrimitive.Trigger
      data-slot="hover-card-trigger"
      delay={delay ?? delays.openDelay}
      closeDelay={closeDelay ?? delays.closeDelay}
      {...props}
    />
  );
}

function HoverCardContent({
  className,
  side = "bottom",
  sideOffset = 4,
  align = "center",
  alignOffset = 4,
  ...props
}: PreviewCardPrimitive.Popup.Props &
  Pick<PreviewCardPrimitive.Positioner.Props, "align" | "alignOffset" | "side" | "sideOffset">) {
  return (
    <PreviewCardPrimitive.Portal data-slot="hover-card-portal">
      <PreviewCardPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className="isolate z-50"
      >
        <PreviewCardPrimitive.Popup
          data-slot="hover-card-content"
          className={cn(
            "z-50 w-64 origin-(--transform-origin) rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-hidden duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            className,
          )}
          {...props}
        />
      </PreviewCardPrimitive.Positioner>
    </PreviewCardPrimitive.Portal>
  );
}

export { HoverCard, HoverCardContent, HoverCardTrigger };
