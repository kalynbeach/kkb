"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@kkb/ui/components/breadcrumb";
import { Button } from "@kkb/ui/components/button";
import { ButtonGroup } from "@kkb/ui/components/button-group";
import { Checkbox } from "@kkb/ui/components/checkbox";
import { Command, CommandInput, CommandItem, CommandList } from "@kkb/ui/components/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@kkb/ui/components/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@kkb/ui/components/dropdown-menu";
import { Field, FieldLabel } from "@kkb/ui/components/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@kkb/ui/components/input-group";
import { Kbd, KbdGroup } from "@kkb/ui/components/kbd";
import { NativeSelect, NativeSelectOption } from "@kkb/ui/components/native-select";
import { Popover, PopoverContent, PopoverTitle, PopoverTrigger } from "@kkb/ui/components/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@kkb/ui/components/select";
import { Slider } from "@kkb/ui/components/slider";
import { Switch } from "@kkb/ui/components/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@kkb/ui/components/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@kkb/ui/components/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@kkb/ui/components/tooltip";
import { cn } from "@kkb/ui/lib/utils";
import { Bell, Download, ExternalLink, Loader2, Plus, Search, Settings } from "lucide-react";
import type { ReactNode } from "react";

import { chartData } from "./catalog-preview-data";
import { PlayerControlsDemo, WaveformDemo } from "./demos/audio-demo";

export function PreviewWall({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <div className="min-h-full bg-background p-4 md:p-6">
      <div className="grid auto-rows-min gap-x-8 gap-y-6 md:grid-cols-12">
        <PreviewCell className="md:col-span-12 xl:col-span-4">
          <TokenTypeStrip onSelect={onSelect} />
        </PreviewCell>
        <PreviewCell className="md:col-span-7 xl:col-span-4">
          <ActionPreview />
        </PreviewCell>
        <PreviewCell className="md:col-span-5 xl:col-span-4">
          <NavigationPreview />
        </PreviewCell>
        <PreviewCell className="md:col-span-6 xl:col-span-4">
          <FormPreview />
        </PreviewCell>
        <PreviewCell className="md:col-span-6 xl:col-span-4">
          <MenuOverlayPreview />
        </PreviewCell>
        <PreviewCell className="md:col-span-7 xl:col-span-4">
          <DataPreview />
        </PreviewCell>
        <PreviewCell className="md:col-span-12">
          <AudioPreview />
        </PreviewCell>
      </div>
    </div>
  );
}

function PreviewCell({ className, children }: { className?: string; children: ReactNode }) {
  return <section className={cn("min-w-0", className)}>{children}</section>;
}

function TokenTypeStrip({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        {[
          ["paper", "bg-background text-foreground"],
          ["ink", "bg-foreground text-background"],
          ["rail", "bg-muted text-muted-foreground"],
          ["primary", "bg-primary text-primary-foreground"],
          ["audio", "bg-audio-accent text-primary"],
          ["border", "bg-border text-foreground"],
        ].map(([label, className]) => (
          <button
            key={label}
            type="button"
            onClick={() => onSelect("design-system")}
            className={cn("min-h-16 border p-2 text-left font-mono text-[11px]", className)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="border p-3">
        <p className="font-mono text-xl font-semibold tracking-[-0.02em]">TX-02 specimen</p>
        <p className="mt-1 text-sm leading-5 text-muted-foreground">
          Geist body copy stays quiet beside technical labels.
        </p>
      </div>
    </div>
  );
}

function ActionPreview() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button>Run checks</Button>
        <Button variant="secondary">Save note</Button>
        <Button variant="outline">
          <ExternalLink className="size-4" />
          Open
        </Button>
        <Button variant="ghost">Dismiss</Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm">
          <Plus className="size-4" />
          Add
        </Button>
        <Button size="sm" variant="outline">
          Export
          <Download className="size-4" />
        </Button>
        <Button size="icon" variant="outline" aria-label="Settings">
          <Settings className="size-4" />
        </Button>
        <Button disabled>
          <Loader2 className="size-4 animate-spin" />
          Syncing
        </Button>
      </div>
      <ButtonGroup>
        <Button variant="outline">Source</Button>
        <Button variant="outline">States</Button>
        <Button variant="outline">Tokens</Button>
      </ButtonGroup>
    </div>
  );
}

function NavigationPreview() {
  return (
    <div className="space-y-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">KKB</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>UI</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Tabs defaultValue="preview">
        <TabsList>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="tokens">Tokens</TabsTrigger>
          <TabsTrigger value="audio">Audio</TabsTrigger>
        </TabsList>
        <TabsContent value="preview" className="border p-3 text-sm">
          Component wall
        </TabsContent>
        <TabsContent value="tokens" className="border p-3 text-sm">
          Token specimens
        </TabsContent>
        <TabsContent value="audio" className="border p-3 text-sm">
          Audio primitives
        </TabsContent>
      </Tabs>
    </div>
  );
}

function FormPreview() {
  return (
    <div className="space-y-4">
      <div className="grid gap-3">
        <Field>
          <FieldLabel htmlFor="catalog-filter">Filter</FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <Search className="size-4" />
            </InputGroupAddon>
            <InputGroupInput id="catalog-filter" defaultValue="audio waveform" />
          </InputGroup>
        </Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Select defaultValue="preview">
            <SelectTrigger aria-label="Preview mode">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="preview">Preview</SelectItem>
              <SelectItem value="focused">Focused</SelectItem>
            </SelectContent>
          </Select>
          <NativeSelect defaultValue="compact" aria-label="Density">
            <NativeSelectOption value="compact">Compact</NativeSelectOption>
            <NativeSelectOption value="roomy">Roomy</NativeSelectOption>
          </NativeSelect>
        </div>
        <div className="flex flex-wrap items-center gap-4 border p-3">
          <Field orientation="horizontal" className="w-auto">
            <Checkbox id="preview-verified" defaultChecked />
            <FieldLabel htmlFor="preview-verified">Verified</FieldLabel>
          </Field>
          <Switch id="preview-enabled" defaultChecked aria-label="Enabled" />
          <Slider
            defaultValue={[72]}
            max={100}
            className="min-w-32 flex-1"
            getAriaLabel={() => "Density"}
          />
        </div>
      </div>
    </div>
  );
}

function MenuOverlayPreview() {
  return (
    <TooltipProvider>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" />}>
              Dropdown
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuLabel>Inspect</DropdownMenuLabel>
                <DropdownMenuItem>Copy import</DropdownMenuItem>
                <DropdownMenuCheckboxItem checked>Show states</DropdownMenuCheckboxItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
            </DropdownMenuContent>
          </DropdownMenu>
          <Popover>
            <PopoverTrigger render={<Button variant="outline" />}>Popover</PopoverTrigger>
            <PopoverContent className="w-64">
              <PopoverTitle className="sr-only">Contextual controls</PopoverTitle>
              <p className="text-sm">Density, token, and state controls stay contextual.</p>
            </PopoverContent>
          </Popover>
          <Dialog>
            <DialogTrigger render={<Button variant="outline" />}>Dialog</DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Inspect component</DialogTitle>
                <DialogDescription>Focused modal example.</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button>Done</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Tooltip>
            <TooltipTrigger render={<Button variant="outline" size="icon" aria-label="Status" />}>
              <Bell className="size-4" />
            </TooltipTrigger>
            <TooltipContent>Status</TooltipContent>
          </Tooltip>
        </div>
        <Command className="rounded-md border">
          <CommandInput placeholder="Navigate..." />
          <CommandList>
            <CommandItem>Button</CommandItem>
            <CommandItem>Input</CommandItem>
            <CommandItem>Audio Waveform</CommandItem>
          </CommandList>
        </Command>
      </div>
    </TooltipProvider>
  );
}

function DataPreview() {
  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Primitive</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {["Table", "Code", "Kbd"].map((name) => (
            <TableRow key={name}>
              <TableCell>{name}</TableCell>
              <TableCell>covered</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3">
        <div className="flex h-24 items-end gap-1 border bg-muted/20 p-3" aria-label="Chart">
          {chartData.map((bar) => (
            <div key={bar.month} className="flex h-full flex-1 flex-col justify-end gap-1">
              <div className="flex min-h-0 flex-1 items-end self-stretch">
                <div className="w-full bg-foreground" style={{ height: `${bar.value}%` }} />
              </div>
              <span className="font-mono text-[10px] text-muted-foreground">{bar.month}</span>
            </div>
          ))}
        </div>
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </div>
    </div>
  );
}

function AudioPreview() {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_280px]">
        <WaveformDemo />
        <PlayerControlsDemo />
      </div>
    </div>
  );
}
