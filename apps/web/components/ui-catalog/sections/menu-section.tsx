import { ComponentCard } from "../component-card";
import { CommandDemo } from "../demos/command-demo";
import { ContextMenuDemo, DropdownMenuDemo, MenubarDemo } from "../demos/menu-demo";

export function MenuSection() {
  return (
    <>
      <ComponentCard
        title="Dropdown Menu"
        description="Button-triggered actions, toggles, and single-choice options in a compact surface."
      >
        <DropdownMenuDemo />
      </ComponentCard>

      <ComponentCard
        title="Context Menu"
        description="Surface-specific actions that open near the current selection."
      >
        <ContextMenuDemo />
      </ComponentCard>

      <ComponentCard
        title="Menubar"
        description="Desktop-style command grouping for denser app-like surfaces."
      >
        <MenubarDemo />
      </ComponentCard>

      <ComponentCard
        title="Command"
        description="Local command palette state with grouped actions and no route-level shortcut wiring."
      >
        <CommandDemo />
      </ComponentCard>
    </>
  );
}
