"use client";

import { Badge } from "@kkb/ui/components/badge";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@kkb/ui/components/resizable";

const panelNotes = [
  "Keep section shells server-owned.",
  "Hydrate only interaction-heavy surfaces.",
  "Use explicit demo islands per primitive family.",
] as const;

export function ResizableDemo() {
  return (
    <div className="h-64 p-4">
      <div className="h-full overflow-hidden rounded-xl border">
        <ResizablePanelGroup>
          <ResizablePanel defaultSize={28} minSize={20}>
            <div className="flex h-full flex-col gap-4 bg-muted/20 p-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">Inspector rail</p>
                <p className="text-sm leading-6 text-muted-foreground">
                  Narrow metadata column for layout controls and release notes.
                </p>
              </div>
              <Badge variant="outline" className="w-fit">
                220px target
              </Badge>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={44} minSize={30}>
            <div className="flex h-full flex-col justify-between bg-background p-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">Preview canvas</p>
                <p className="text-sm leading-6 text-muted-foreground">
                  Main surface stays flexible while the side panels compress first.
                </p>
              </div>
              <div className="rounded-lg border border-dashed bg-muted/30 p-4 text-sm text-muted-foreground">
                Drag the handle to rebalance the workspace.
              </div>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={28} minSize={20}>
            <div className="flex h-full flex-col gap-3 bg-muted/20 p-4">
              <p className="text-sm font-medium">Session notes</p>
              <ul className="space-y-2 text-sm leading-6 text-muted-foreground">
                {panelNotes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
