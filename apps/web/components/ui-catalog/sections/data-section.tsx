import { Code } from "@kkb/ui/components/code";
import { Kbd, KbdGroup } from "@kkb/ui/components/kbd";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@kkb/ui/components/table";

import { ComponentCard } from "../component-card";
import { CarouselDemo } from "../demos/carousel-demo";

export const dataSectionItemCount = 4;

const dataRows = [
  { primitive: "Table", role: "structured rows", state: "server-owned" },
  { primitive: "Code", role: "inline tokens", state: "static" },
  { primitive: "Carousel", role: "manual paging", state: "client island" },
] as const;

const codeSample = `const sections = ["layout", "menu", "data"] as const;`;

export function DataSection() {
  return (
    <>
      <ComponentCard
        title="Table"
        description="Structured comparison rows for compact release and primitive summaries."
      >
        <div className="p-6">
          <div className="overflow-hidden rounded-md bg-muted/20">
            <Table>
              <TableCaption>Representative data-display coverage for issue #19.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Primitive</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dataRows.map((row) => (
                  <TableRow key={row.primitive}>
                    <TableCell className="font-medium">{row.primitive}</TableCell>
                    <TableCell>{row.role}</TableCell>
                    <TableCell>{row.state}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Code"
        description="Inline monospace snippets for lightweight tokens, commands, and config fragments."
      >
        <div className="space-y-4 p-6">
          <p className="text-sm leading-6 text-muted-foreground">
            Use <Code>server-owned sections</Code> and <Code>explicit client demos</Code> to keep
            hydration narrow.
          </p>
          <pre className="overflow-x-auto rounded-md bg-muted/20 p-4 text-sm leading-6">
            <code>{codeSample}</code>
          </pre>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Keyboard Shortcuts"
        description="Representative key patterns for command-style UIs without implying live route wiring."
      >
        <div className="space-y-4 p-6">
          <div className="flex items-center justify-between gap-4 rounded-md bg-muted/20 px-4 py-3">
            <span className="min-w-0 text-sm font-medium">Command palette pattern</span>
            <KbdGroup>
              <Kbd>⌘</Kbd>
              <Kbd>K</Kbd>
            </KbdGroup>
          </div>
          <div className="flex items-center justify-between gap-4 rounded-md bg-muted/20 px-4 py-3">
            <span className="min-w-0 text-sm font-medium">Section jump pattern</span>
            <KbdGroup>
              <Kbd>G</Kbd>
              <Kbd>M</Kbd>
            </KbdGroup>
          </div>
        </div>
      </ComponentCard>

      <ComponentCard title="Carousel" description="Local slide data with manual navigation only.">
        <CarouselDemo />
      </ComponentCard>
    </>
  );
}
