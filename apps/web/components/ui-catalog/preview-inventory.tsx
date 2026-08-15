"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@kkb/ui/components/accordion";
import { Alert, AlertDescription, AlertTitle } from "@kkb/ui/components/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@kkb/ui/components/alert-dialog";
import { AspectRatio } from "@kkb/ui/components/aspect-ratio";
import { Avatar, AvatarFallback } from "@kkb/ui/components/avatar";
import { Badge } from "@kkb/ui/components/badge";
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
import { Card, CardContent, CardHeader, CardTitle } from "@kkb/ui/components/card";
import { Checkbox } from "@kkb/ui/components/checkbox";
import { Code } from "@kkb/ui/components/code";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@kkb/ui/components/collapsible";
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
} from "@kkb/ui/components/combobox";
import { Command, CommandInput, CommandItem, CommandList } from "@kkb/ui/components/command";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@kkb/ui/components/context-menu";
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
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@kkb/ui/components/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@kkb/ui/components/dropdown-menu";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@kkb/ui/components/empty";
import { Field, FieldDescription, FieldLabel } from "@kkb/ui/components/field";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@kkb/ui/components/form";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@kkb/ui/components/hover-card";
import { Input } from "@kkb/ui/components/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@kkb/ui/components/input-group";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@kkb/ui/components/input-otp";
import { Item, ItemContent, ItemDescription, ItemTitle } from "@kkb/ui/components/item";
import { Kbd, KbdGroup } from "@kkb/ui/components/kbd";
import { Label } from "@kkb/ui/components/label";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@kkb/ui/components/menubar";
import { ModeToggle } from "@kkb/ui/components/mode-toggle";
import { NativeSelect, NativeSelectOption } from "@kkb/ui/components/native-select";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@kkb/ui/components/navigation-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@kkb/ui/components/pagination";
import { Popover, PopoverContent, PopoverTitle, PopoverTrigger } from "@kkb/ui/components/popover";
import { Progress } from "@kkb/ui/components/progress";
import { RadioGroup, RadioGroupItem } from "@kkb/ui/components/radio-group";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@kkb/ui/components/resizable";
import { ScrollArea } from "@kkb/ui/components/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@kkb/ui/components/select";
import { Separator } from "@kkb/ui/components/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@kkb/ui/components/sheet";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarProvider,
} from "@kkb/ui/components/sidebar";
import { Skeleton } from "@kkb/ui/components/skeleton";
import { Slider } from "@kkb/ui/components/slider";
import { Toaster, toast } from "@kkb/ui/components/sonner";
import { Spinner } from "@kkb/ui/components/spinner";
import { Switch } from "@kkb/ui/components/switch";
import { Table, TableBody, TableCell, TableRow } from "@kkb/ui/components/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@kkb/ui/components/tabs";
import { Textarea } from "@kkb/ui/components/textarea";
import { Toggle } from "@kkb/ui/components/toggle";
import { ToggleGroup, ToggleGroupItem } from "@kkb/ui/components/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@kkb/ui/components/tooltip";
import { BellIcon } from "@phosphor-icons/react/dist/csr/Bell";
import { MagnifyingGlassIcon } from "@phosphor-icons/react/dist/csr/MagnifyingGlass";
import { useForm } from "react-hook-form";
import { CatalogCoverageChart } from "./catalog-chart";
import { itemFromId, type VisualCatalogId, visualCatalogIds } from "./catalog-data";
import { PlayerControlsDemo, PlayheadDemo, WaveformDemo } from "./demos/audio-demo";
import { CarouselDemo } from "./demos/carousel-demo";
import { CalendarDemo } from "./demos/select-calendar-demo";

export function PreviewInventory({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <section aria-label="Complete visual component preview" className="mt-8 border-t pt-6">
      <div className="columns-1 gap-4 sm:columns-2 xl:columns-3">
        {visualCatalogIds.map((id) => (
          <PreviewInventorySpecimen key={id} id={id} onSelect={onSelect} />
        ))}
      </div>
    </section>
  );
}

export function PreviewInventorySpecimen({
  id,
  onSelect,
}: {
  id: VisualCatalogId;
  onSelect: (id: string) => void;
}) {
  const item = itemFromId(id);
  const titleId = `preview-inventory-${id}-title`;

  return (
    <article
      aria-labelledby={titleId}
      data-catalog-covers={id}
      className="mb-4 inline-block w-full min-w-0 break-inside-avoid border-t border-border bg-muted/20 pt-2 align-top"
    >
      <button
        id={titleId}
        type="button"
        onClick={() => onSelect(id)}
        className="mb-3 min-h-8 px-1 text-left font-mono text-[11px] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        {item.label}
      </button>
      <div className="min-h-28 min-w-0 overflow-hidden bg-background p-3">{previewFor(id)}</div>
    </article>
  );
}

function previewFor(id: VisualCatalogId) {
  switch (id) {
    case "accordion":
      return (
        <Accordion type="single" collapsible defaultValue="preview">
          <AccordionItem value="preview">
            <AccordionTrigger>Preview</AccordionTrigger>
            <AccordionContent>Expanded component state.</AccordionContent>
          </AccordionItem>
        </Accordion>
      );
    case "alert-dialog":
      return (
        <AlertDialog>
          <AlertDialogTrigger render={<Button variant="destructive" size="sm" />}>
            Delete
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete preview capture?</AlertDialogTitle>
              <AlertDialogDescription>
                This removes the selected catalog capture.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    case "alert":
      return (
        <Alert>
          <BellIcon aria-hidden="true" focusable="false" className="size-4" />
          <AlertTitle>Catalog ready</AlertTitle>
          <AlertDescription>Visual coverage is current.</AlertDescription>
        </Alert>
      );
    case "aspect-ratio":
      return (
        <AspectRatio ratio={16 / 9}>
          <div className="grid size-full place-items-center border bg-muted font-mono text-xs">
            16 / 9
          </div>
        </AspectRatio>
      );
    case "avatar":
      return (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>KB</AvatarFallback>
          </Avatar>
          <Avatar size="sm">
            <AvatarFallback>UI</AvatarFallback>
          </Avatar>
        </div>
      );
    case "badge":
      return (
        <div className="flex flex-wrap gap-2">
          <Badge>ready</Badge>
          <Badge variant="secondary">secondary</Badge>
          <Badge variant="outline">outline</Badge>
        </div>
      );
    case "breadcrumb":
      return (
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/ui">UI</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Preview</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );
    case "button":
      return (
        <div className="flex flex-wrap gap-2">
          <Button size="sm">Primary</Button>
          <Button size="sm" variant="outline">
            Outline
          </Button>
        </div>
      );
    case "button-group":
      return (
        <ButtonGroup>
          <Button size="sm" variant="outline">
            Source
          </Button>
          <Button size="sm" variant="outline">
            States
          </Button>
        </ButtonGroup>
      );
    case "calendar":
      return <CalendarDemo />;
    case "card":
      return (
        <Card className="gap-3 py-3">
          <CardHeader className="px-3">
            <CardTitle className="text-sm">Specimen</CardTitle>
          </CardHeader>
          <CardContent className="px-3 text-sm text-muted-foreground">
            Contained content.
          </CardContent>
        </Card>
      );
    case "carousel":
      return <CarouselDemo />;
    case "chart":
      return (
        <CatalogCoverageChart
          accessibleTitle="Inventory monthly component coverage"
          showValueTable={false}
        />
      );
    case "checkbox":
      return (
        <div className="flex items-center gap-2">
          <Checkbox id="preview-checkbox" defaultChecked />
          <Label htmlFor="preview-checkbox">Verified</Label>
        </div>
      );
    case "code":
      return (
        <p className="text-sm">
          Import <Code>@kkb/ui/components/code</Code>
        </p>
      );
    case "collapsible":
      return (
        <Collapsible defaultOpen>
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-sm">Details</span>
            <CollapsibleTrigger render={<Button size="sm" variant="ghost" />}>
              Toggle
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="pt-2 text-sm text-muted-foreground">
            Open content.
          </CollapsibleContent>
        </Collapsible>
      );
    case "combobox":
      return (
        <Combobox items={["Button", "Input", "Chart"]} autoHighlight modal={false}>
          <ComboboxTrigger
            aria-label="Find component"
            render={<Button size="sm" variant="outline" />}
          >
            Find component
          </ComboboxTrigger>
          <ComboboxContent>
            <ComboboxInput
              aria-label="Find component"
              placeholder="Find component"
              showTrigger={false}
            />
            <ComboboxList>
              {(value: string) => (
                <ComboboxItem key={value} value={value}>
                  {value}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      );
    case "command":
      return (
        <Command className="border">
          <CommandInput placeholder="Search" />
          <CommandList>
            <CommandItem>Button</CommandItem>
            <CommandItem>Input</CommandItem>
          </CommandList>
        </Command>
      );
    case "context-menu":
      return (
        <ContextMenu>
          <ContextMenuTrigger
            render={<button type="button" />}
            className="grid h-20 w-full place-items-center border text-sm text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            Right click or press Shift+F10
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>Inspect</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      );
    case "dialog":
      return (
        <Dialog>
          <DialogTrigger render={<Button size="sm" variant="outline" />}>Open dialog</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Preview dialog</DialogTitle>
              <DialogDescription>Inspect a live catalog dialog.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button>Done</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    case "drawer":
      return (
        <Drawer>
          <DrawerTrigger asChild>
            <Button size="sm" variant="outline">
              Open drawer
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Preview drawer</DrawerTitle>
              <DrawerDescription>Inspect a live bottom-mounted surface.</DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <Button>Done</Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      );
    case "dropdown-menu":
      return (
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button size="sm" variant="outline" />}>
            Menu
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Preview</DropdownMenuItem>
            <DropdownMenuItem>Source</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    case "empty":
      return (
        <Empty className="min-h-28 border">
          <EmptyHeader>
            <EmptyTitle>No selection</EmptyTitle>
            <EmptyDescription>Choose a component.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      );
    case "field":
      return (
        <Field>
          <FieldLabel htmlFor="preview-field">Component</FieldLabel>
          <Input id="preview-field" defaultValue="Button" />
          <FieldDescription>Public visual export.</FieldDescription>
        </Field>
      );
    case "form":
      return <FormPreview />;
    case "hover-card":
      return (
        <HoverCard>
          <HoverCardTrigger render={<Button size="sm" variant="outline" />}>Hover</HoverCardTrigger>
          <HoverCardContent>Component metadata.</HoverCardContent>
        </HoverCard>
      );
    case "input":
      return <Input aria-label="Preview input" placeholder="Component name" />;
    case "input-group":
      return (
        <InputGroup>
          <InputGroupAddon>
            <MagnifyingGlassIcon aria-hidden="true" focusable="false" className="size-4" />
          </InputGroupAddon>
          <InputGroupInput aria-label="Preview filter" placeholder="Filter" />
        </InputGroup>
      );
    case "input-otp":
      return (
        <InputOTP maxLength={3} aria-label="Preview verification code">
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
        </InputOTP>
      );
    case "item":
      return (
        <Item className="border">
          <ItemContent>
            <ItemTitle>Audio waveform</ItemTitle>
            <ItemDescription>Focused specimen ready.</ItemDescription>
          </ItemContent>
        </Item>
      );
    case "kbd":
      return (
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      );
    case "label":
      return (
        <div className="grid gap-2">
          <Label htmlFor="preview-label">Source path</Label>
          <Input id="preview-label" defaultValue="@kkb/ui" />
        </div>
      );
    case "menubar":
      return (
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>New capture</MenubarItem>
              <MenubarItem>Save capture</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>View</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>Preview wall</MenubarItem>
              <MenubarItem>Focused specimen</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      );
    case "mode-toggle":
      return <ModeToggle />;
    case "native-select":
      return (
        <NativeSelect aria-label="Preview density" defaultValue="compact">
          <NativeSelectOption value="compact">Compact</NativeSelectOption>
          <NativeSelectOption value="roomy">Roomy</NativeSelectOption>
        </NativeSelect>
      );
    case "navigation-menu":
      return (
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Catalog</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="w-56 p-2">
                  <NavigationMenuLink className="block p-2 text-sm hover:bg-accent">
                    Components
                  </NavigationMenuLink>
                  <NavigationMenuLink className="block p-2 text-sm hover:bg-accent">
                    Design system
                  </NavigationMenuLink>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      );
    case "pagination":
      return (
        <Pagination>
          <PaginationContent>
            {[1, 2, 3].map((page) => (
              <PaginationItem key={page}>
                <PaginationLink href="#" isActive={page === 1}>
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
          </PaginationContent>
        </Pagination>
      );
    case "popover":
      return (
        <Popover>
          <PopoverTrigger render={<Button size="sm" variant="outline" />}>Popover</PopoverTrigger>
          <PopoverContent>
            <PopoverTitle className="sr-only">Preview controls</PopoverTitle>
            Contextual controls.
          </PopoverContent>
        </Popover>
      );
    case "progress":
      return <Progress value={68} aria-label="Catalog coverage" />;
    case "radio-group":
      return (
        <RadioGroup defaultValue="preview" aria-label="Preview mode">
          <div className="flex items-center gap-2">
            <RadioGroupItem id="preview-radio" value="preview" />
            <Label htmlFor="preview-radio">Preview</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem id="focused-radio" value="focused" />
            <Label htmlFor="focused-radio">Focused</Label>
          </div>
        </RadioGroup>
      );
    case "resizable":
      return (
        <ResizablePanelGroup className="min-h-28 border">
          <ResizablePanel defaultSize={38} className="grid place-items-center text-xs">
            rail
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={62} className="grid place-items-center text-xs">
            canvas
          </ResizablePanel>
        </ResizablePanelGroup>
      );
    case "scroll-area":
      return (
        <ScrollArea className="h-28 border p-3">
          <div className="space-y-3 pr-3 text-sm">
            {visualCatalogIds.slice(0, 8).map((componentId) => (
              <p key={componentId}>{itemFromId(componentId).label}</p>
            ))}
          </div>
        </ScrollArea>
      );
    case "select":
      return (
        <Select defaultValue="preview">
          <SelectTrigger aria-label="Catalog view">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="preview">Preview</SelectItem>
            <SelectItem value="focused">Focused</SelectItem>
          </SelectContent>
        </Select>
      );
    case "separator":
      return (
        <div className="space-y-3 text-sm">
          <span>Preview</span>
          <Separator />
          <span>Components</span>
        </div>
      );
    case "sheet":
      return (
        <Sheet>
          <SheetTrigger render={<Button size="sm" variant="outline" />}>Open sheet</SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Preview sheet</SheetTitle>
              <SheetDescription>Inspect source, category, and state metadata.</SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      );
    case "sidebar":
      return (
        <div className="h-36 overflow-hidden border">
          <SidebarProvider defaultOpen className="min-h-0">
            <Sidebar collapsible="none">
              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupLabel>Catalog</SidebarGroupLabel>
                </SidebarGroup>
              </SidebarContent>
            </Sidebar>
          </SidebarProvider>
        </div>
      );
    case "skeleton":
      return (
        <div className="space-y-2">
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-14 w-full" />
        </div>
      );
    case "slider":
      return <Slider defaultValue={[64]} max={100} getAriaLabel={() => "Preview density"} />;
    case "sonner":
      return (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => toast.success("Catalog preview verified")}
          >
            Show toast
          </Button>
          <Toaster position="bottom-right" />
        </div>
      );
    case "spinner":
      return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Spinner /> Loading
        </div>
      );
    case "switch":
      return (
        <div className="flex items-center gap-2">
          <Switch id="preview-switch" defaultChecked />
          <Label htmlFor="preview-switch">Enabled</Label>
        </div>
      );
    case "table":
      return (
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Button</TableCell>
              <TableCell>ready</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Chart</TableCell>
              <TableCell>ready</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
    case "tabs":
      return (
        <Tabs defaultValue="preview">
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="source">Source</TabsTrigger>
          </TabsList>
          <TabsContent value="preview" className="border p-2 text-sm">
            Live components
          </TabsContent>
          <TabsContent value="source" className="border p-2 text-sm">
            Public exports
          </TabsContent>
        </Tabs>
      );
    case "textarea":
      return <Textarea aria-label="Preview note" defaultValue="Component-specific specimen." />;
    case "toggle":
      return <Toggle defaultPressed>Grid</Toggle>;
    case "toggle-group":
      return (
        <ToggleGroup type="single" defaultValue="preview">
          <ToggleGroupItem value="preview">Preview</ToggleGroupItem>
          <ToggleGroupItem value="focused">Focused</ToggleGroupItem>
        </ToggleGroup>
      );
    case "tooltip":
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger render={<Button size="icon" variant="outline" aria-label="Status" />}>
              <BellIcon aria-hidden="true" focusable="false" className="size-4" />
            </TooltipTrigger>
            <TooltipContent>Catalog status</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    case "audio-player-controls":
      return <PlayerControlsDemo />;
    case "audio-playhead":
      return <PlayheadDemo />;
    case "audio-waveform":
      return <WaveformDemo />;
    default:
      return assertNever(id);
  }
}

function FormPreview() {
  const form = useForm<{ source: string }>({ defaultValues: { source: "@kkb/ui" } });

  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="source"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Source</FormLabel>
            <FormControl render={<Input {...field} />} />
            <FormDescription>Public package path.</FormDescription>
          </FormItem>
        )}
      />
    </Form>
  );
}

function assertNever(value: never): never {
  throw new Error(`Missing Preview specimen for ${value}`);
}
