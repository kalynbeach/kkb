import { ComponentCard } from "../component-card";
import {
  AlertDialogDrawerDemo,
  DialogSheetDemo,
  PopoverHoverCardTooltipDemo,
} from "../demos/overlay-demo";

export const overlaySectionItemCount = 3;

export function OverlaySection() {
  return (
    <>
      <ComponentCard
        title="Dialog + Sheet"
        description="Blocking modal confirmation plus a side-mounted supporting panel."
      >
        <DialogSheetDemo />
      </ComponentCard>

      <ComponentCard
        title="Alert Dialog + Drawer"
        description="Destructive confirmation and mobile-first action trays in one overlay family."
      >
        <AlertDialogDrawerDemo />
      </ComponentCard>

      <ComponentCard
        title="Popover + Hover Card + Tooltip"
        description="Contextual overlays for quick controls, previews, and terse helper copy."
      >
        <PopoverHoverCardTooltipDemo />
      </ComponentCard>
    </>
  );
}
