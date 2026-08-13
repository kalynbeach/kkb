import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@kkb/ui/components/accordion";
import { AlertDialog, AlertDialogAction } from "@kkb/ui/components/alert-dialog";
import { Waveform } from "@kkb/ui/components/audio/waveform";
import { Button } from "@kkb/ui/components/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@kkb/ui/components/carousel";
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
} from "@kkb/ui/components/combobox";
import { Field, FieldLabel } from "@kkb/ui/components/field";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@kkb/ui/components/form";
import { Table, TableBody, TableCaption, TableCell, TableRow } from "@kkb/ui/components/table";
import { Window } from "happy-dom";
import { act, type ComponentProps, createRef, Fragment, useState } from "react";
import { createRoot, type Root } from "react-dom/client";
import { useForm } from "react-hook-form";

import { itemFromId } from "../../../components/ui-catalog/catalog-data";
import { CatalogSearchSession } from "../../../components/ui-catalog/catalog-search";
import { CarouselDemo } from "../../../components/ui-catalog/demos/carousel-demo";
import { CommandDemo } from "../../../components/ui-catalog/demos/command-demo";
import {
  DialogSheetDemo,
  PopoverHoverCardTooltipDemo,
} from "../../../components/ui-catalog/demos/overlay-demo";

type DomEnvironment = {
  cleanup: () => void;
  container: HTMLDivElement;
  document: Document;
  root: Root;
  window: Window;
};

const globalKeys = [
  "document",
  "window",
  "navigator",
  "HTMLElement",
  "HTMLButtonElement",
  "HTMLFormElement",
  "Element",
  "Node",
  "Event",
  "MouseEvent",
  "PointerEvent",
  "KeyboardEvent",
  "CustomEvent",
  "MutationObserver",
  "ResizeObserver",
  "IntersectionObserver",
  "getComputedStyle",
  "requestAnimationFrame",
  "cancelAnimationFrame",
  "IS_REACT_ACT_ENVIRONMENT",
] as const;

type GlobalKey = (typeof globalKeys)[number];

const originalGlobals = new Map<GlobalKey, unknown>();

class IntersectionObserverStub implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = "";
  readonly thresholds = [0];

  constructor(readonly callback: IntersectionObserverCallback) {}

  disconnect() {}

  observe(_target: Element) {
    this.callback([], this);
  }

  takeRecords() {
    return [];
  }

  unobserve(_target: Element) {}
}

function installDomGlobals(window: Window) {
  Object.defineProperties(window, {
    DOMException: { configurable: true, value: DOMException, writable: true },
    IntersectionObserver: {
      configurable: true,
      value: IntersectionObserverStub,
      writable: true,
    },
    SyntaxError: { configurable: true, value: SyntaxError, writable: true },
  });

  const assignments: Record<GlobalKey, unknown> = {
    document: window.document,
    window,
    navigator: window.navigator,
    HTMLElement: window.HTMLElement,
    HTMLButtonElement: window.HTMLButtonElement,
    HTMLFormElement: window.HTMLFormElement,
    Element: window.Element,
    Node: window.Node,
    Event: window.Event,
    MouseEvent: window.MouseEvent,
    PointerEvent: window.PointerEvent,
    KeyboardEvent: window.KeyboardEvent,
    CustomEvent: window.CustomEvent,
    MutationObserver: window.MutationObserver,
    ResizeObserver: window.ResizeObserver,
    IntersectionObserver: window.IntersectionObserver,
    getComputedStyle: window.getComputedStyle.bind(window),
    requestAnimationFrame: window.requestAnimationFrame.bind(window),
    cancelAnimationFrame: window.cancelAnimationFrame.bind(window),
    IS_REACT_ACT_ENVIRONMENT: true,
  };

  for (const key of globalKeys) {
    originalGlobals.set(key, globalThis[key]);
    Object.defineProperty(globalThis, key, {
      configurable: true,
      value: assignments[key],
      writable: true,
    });
  }
}

function restoreDomGlobals() {
  for (const key of globalKeys) {
    Object.defineProperty(globalThis, key, {
      configurable: true,
      value: originalGlobals.get(key),
      writable: true,
    });
  }

  originalGlobals.clear();
}

function setupDom(): DomEnvironment {
  const window = new Window({ url: "http://localhost/ui" });
  installDomGlobals(window);

  const container = window.document.createElement("div");
  window.document.body.append(container);

  const root = createRoot(container);

  return {
    cleanup: () => {
      act(() => {
        root.unmount();
      });
      container.remove();
      window.close();
      restoreDomGlobals();
    },
    container,
    document: window.document,
    root,
    window,
  };
}

function renderIntoDom(environment: DomEnvironment, element: React.ReactNode) {
  act(() => {
    environment.root.render(element);
  });
}

function dispatchPrimaryClick(target: Element, window: Window) {
  act(() => {
    target.dispatchEvent(
      new window.PointerEvent("pointerdown", {
        bubbles: true,
        button: 0,
        buttons: 1,
        cancelable: true,
        ctrlKey: false,
        isPrimary: true,
        pointerType: "mouse",
      }),
    );
    target.dispatchEvent(
      new window.PointerEvent("pointerup", {
        bubbles: true,
        button: 0,
        cancelable: true,
        ctrlKey: false,
        isPrimary: true,
        pointerType: "mouse",
      }),
    );
    target.dispatchEvent(
      new window.MouseEvent("mousedown", {
        bubbles: true,
        button: 0,
        buttons: 1,
        cancelable: true,
      }),
    );
    target.dispatchEvent(
      new window.MouseEvent("mouseup", { bubbles: true, button: 0, cancelable: true }),
    );
    target.dispatchEvent(
      new window.MouseEvent("click", { bubbles: true, button: 0, cancelable: true }),
    );
  });
}

function getButtonByText(environment: DomEnvironment, text: string) {
  const match = Array.from(environment.document.getElementsByTagName("button")).find((button) =>
    button.textContent?.includes(text),
  );

  expect(match).toBeDefined();

  return match as HTMLButtonElement;
}

function expectBodyText(environment: DomEnvironment, text: string) {
  expect(environment.document.body.textContent).toContain(text);
}

function WaveformContractHarness({ onSeek }: { onSeek: (seconds: number) => void }) {
  const legacyLiveProps: ComponentProps<typeof Waveform> & {
    getTimeline: () => { currentTime: number; duration: number };
  } = {
    currentTime: 0,
    duration: 0,
    getTimeline: () => ({ currentTime: 30, duration: 120 }),
    onSeek,
  };

  return <Waveform {...legacyLiveProps} />;
}

function OverflowingTableHarness({ direction }: { direction?: "ltr" | "rtl" }) {
  return (
    <div dir={direction}>
      <Table>
        <TableCaption>Signal readings</TableCaption>
        <TableBody>
          <TableRow>
            <TableCell>Channel A</TableCell>
            <TableCell>440 Hz</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

function KeyedFragmentCarouselHarness() {
  const [reversed, setReversed] = useState(false);
  const groups = reversed ? ["beta", "alpha"] : ["alpha", "beta"];

  return (
    <>
      <button type="button" onClick={() => setReversed((current) => !current)}>
        Reverse groups
      </button>
      <Carousel aria-label="Grouped projects">
        <CarouselContent>
          {groups.map((group) => (
            <Fragment key={group}>
              <Fragment key="slides">
                <CarouselItem data-group={group}>
                  <input aria-label={`${group} title`} defaultValue={group} />
                </CarouselItem>
              </Fragment>
            </Fragment>
          ))}
        </CarouselContent>
      </Carousel>
    </>
  );
}

function CarouselKeyboardHarness() {
  return (
    <Carousel aria-label="Featured projects">
      <CarouselContent>
        <Fragment key="nested-slides">
          <CarouselItem>
            <label htmlFor="carousel-title">Project title</label>
            <input id="carousel-title" defaultValue="KKB" />
          </CarouselItem>
        </Fragment>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

function AlertDialogActionHarness({ onAction }: { onAction: () => void }) {
  const [open, setOpen] = useState(true);

  return (
    <>
      <span data-testid="alert-dialog-state">{open ? "open" : "closed"}</span>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogAction onClick={onAction}>Confirm action</AlertDialogAction>
      </AlertDialog>
    </>
  );
}

function AccordionCollapsibleHarness() {
  return (
    <>
      <Accordion defaultValue="one">
        <AccordionItem value="one">
          <AccordionTrigger>Required disclosure</AccordionTrigger>
          <AccordionContent>Required content</AccordionContent>
        </AccordionItem>
      </Accordion>
      <Accordion collapsible defaultValue="one">
        <AccordionItem value="one">
          <AccordionTrigger>Optional disclosure</AccordionTrigger>
          <AccordionContent>Optional content</AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}

function CatalogSearchHarness() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Open catalog search
      </button>
      <button type="button" onClick={() => setOpen(false)}>
        Close catalog search
      </button>
      <CatalogSearchSession
        open={open}
        selectedItem={itemFromId("button")}
        onSelect={() => setOpen(false)}
      />
    </>
  );
}

function FocusedComboboxLabelHarness() {
  const [open, setOpen] = useState(true);

  return (
    <>
      <span data-testid="focused-combobox-state">{open ? "open" : "closed"}</span>
      <button type="button" onClick={() => setOpen(false)}>
        Close component options
      </button>
      <Field>
        <FieldLabel
          id="focused-component-combobox-label"
          htmlFor="focused-component-combobox-trigger"
        >
          Component
        </FieldLabel>
        <Combobox
          items={["alert", "badge", "button"]}
          value="button"
          open={open}
          onOpenChange={setOpen}
          modal={false}
        >
          <ComboboxTrigger
            id="focused-component-combobox-trigger"
            aria-labelledby="focused-component-combobox-label focused-component-combobox-trigger"
            render={<Button variant="outline" />}
          >
            button
          </ComboboxTrigger>
          <ComboboxContent>
            <ComboboxInput aria-label="Search available components" showTrigger={false} />
            <ComboboxList>
              {(value: string) => (
                <ComboboxItem key={value} value={value}>
                  {value}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </Field>
    </>
  );
}

function FormAriaHarness() {
  const methods = useForm({ defaultValues: { density: "" } });

  return (
    <Form {...methods}>
      <FormField
        control={methods.control}
        name="density"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Density</FormLabel>
            <FormControl render={<input {...field} />} />
            <FormDescription>Choose a density.</FormDescription>
            <FormMessage>Density is required.</FormMessage>
          </FormItem>
        )}
      />
    </Form>
  );
}

let domEnvironment: DomEnvironment | null = null;

beforeEach(() => {
  domEnvironment = setupDom();
});

afterEach(() => {
  domEnvironment?.cleanup();
  domEnvironment = null;
});

describe("interactive /ui demos", () => {
  test("Base render composition preserves one anchor, props, refs, and handlers", () => {
    const environment = domEnvironment as DomEnvironment;
    const anchorRef = createRef<HTMLAnchorElement>();
    let buttonClicks = 0;
    let anchorClicks = 0;

    renderIntoDom(
      environment,
      <Button
        className="composed-button"
        onClick={() => {
          buttonClicks += 1;
        }}
        render={
          <a
            href="/ui"
            onClick={() => {
              anchorClicks += 1;
            }}
            ref={anchorRef}
          />
        }
      >
        Open workbench
      </Button>,
    );

    const anchor = environment.document.querySelector("a[href='/ui']");
    expect(anchor).toBe(anchorRef.current);
    expect(anchor?.className).toContain("composed-button");
    expect(anchor?.querySelector("button")).toBeNull();

    if (!anchor) {
      throw new Error("Expected composed anchor");
    }

    dispatchPrimaryClick(anchor, environment.window);
    expect(buttonClicks).toBe(1);
    expect(anchorClicks).toBe(1);
  });

  test("FormControl renders one named input with linked description and message", () => {
    const environment = domEnvironment as DomEnvironment;
    renderIntoDom(environment, <FormAriaHarness />);

    const input = environment.document.querySelector<HTMLInputElement>(
      '[data-slot="form-control"]',
    );
    const label = environment.document.querySelector('[data-slot="form-label"]');
    const description = environment.document.querySelector('[data-slot="form-description"]');
    const message = environment.document.querySelector('[data-slot="form-message"]');

    expect(input?.tagName).toBe("INPUT");
    expect(label?.getAttribute("for")).toBe(input?.id);
    expect(input?.getAttribute("aria-describedby")).toBe(description?.id);
    expect(message?.textContent).toBe("Density is required.");
    expect(input?.parentElement?.querySelectorAll("input")).toHaveLength(1);
  });

  test("dialog demo flips local open state", () => {
    const environment = domEnvironment as DomEnvironment;
    renderIntoDom(environment, <DialogSheetDemo />);

    dispatchPrimaryClick(getButtonByText(environment, "Open dialog"), environment.window);

    expectBodyText(environment, "Modal dialogopen");
  });

  test("popover demo flips local open state", () => {
    const environment = domEnvironment as DomEnvironment;
    renderIntoDom(environment, <PopoverHoverCardTooltipDemo />);

    dispatchPrimaryClick(getButtonByText(environment, "Open popover"), environment.window);

    expectBodyText(environment, "Popoveropen");
  });

  test("alert dialog action composes its callback and dismisses", async () => {
    const environment = domEnvironment as DomEnvironment;
    let actionCalls = 0;
    renderIntoDom(
      environment,
      <AlertDialogActionHarness
        onAction={() => {
          actionCalls += 1;
        }}
      />,
    );

    expect(
      environment.document.querySelector('[data-testid="alert-dialog-state"]')?.textContent,
    ).toBe("open");

    dispatchPrimaryClick(getButtonByText(environment, "Confirm action"), environment.window);
    expect(actionCalls).toBe(1);
    expect(
      environment.document.querySelector('[data-testid="alert-dialog-state"]')?.textContent,
    ).toBe("closed");
  });

  test("single accordion only collapses when collapsible is enabled", () => {
    const environment = domEnvironment as DomEnvironment;
    renderIntoDom(environment, <AccordionCollapsibleHarness />);

    const required = getButtonByText(environment, "Required disclosure");
    const optional = getButtonByText(environment, "Optional disclosure");
    expect(required.getAttribute("aria-expanded")).toBe("true");
    expect(optional.getAttribute("aria-expanded")).toBe("true");

    dispatchPrimaryClick(required, environment.window);
    dispatchPrimaryClick(optional, environment.window);

    expect(required.getAttribute("aria-expanded")).toBe("true");
    expect(optional.getAttribute("aria-expanded")).toBe("false");
  });

  test("command demo opens command palette content", () => {
    const environment = domEnvironment as DomEnvironment;
    renderIntoDom(environment, <CommandDemo />);

    dispatchPrimaryClick(getButtonByText(environment, "Open command"), environment.window);

    expectBodyText(environment, "Catalog command");
    expectBodyText(environment, "Search local section actions.");
  });

  test("catalog search replaces stale input with a fresh session when reopened", () => {
    const environment = domEnvironment as DomEnvironment;
    renderIntoDom(environment, <CatalogSearchHarness />);
    dispatchPrimaryClick(getButtonByText(environment, "Open catalog search"), environment.window);

    const input = environment.document.querySelector<HTMLInputElement>(
      'input[placeholder="Search component, category, source..."]',
    );
    expect(input).not.toBeNull();
    expect(input?.getAttribute("aria-label")).toBe("Search KKB UI catalog");
    expectBodyText(environment, "Current catalog item");

    if (input) {
      input.value = "audio";
    }
    expect(input?.value).toBe("audio");

    dispatchPrimaryClick(getButtonByText(environment, "Close catalog search"), environment.window);
    dispatchPrimaryClick(getButtonByText(environment, "Open catalog search"), environment.window);

    const reopenedInput = environment.document.querySelector<HTMLInputElement>(
      'input[placeholder="Search component, category, source..."]',
    );
    expect(reopenedInput).not.toBe(input);
    expect(reopenedInput?.value).toBe("");
    expectBodyText(environment, "Pinned views and category browse");
  });

  test("keeps the focused Combobox label associated after its popup closes", async () => {
    const environment = domEnvironment as DomEnvironment;
    renderIntoDom(environment, <FocusedComboboxLabelHarness />);
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    const label = environment.document.querySelector(
      'label[for="focused-component-combobox-trigger"]',
    );
    const trigger = environment.document.querySelector<HTMLButtonElement>(
      "#focused-component-combobox-trigger",
    );

    expect(label?.textContent).toBe("Component");
    expect(trigger).not.toBeNull();
    expect(trigger?.hasAttribute("aria-label")).toBe(false);
    expect(trigger?.getAttribute("aria-labelledby")).toBe(
      "focused-component-combobox-label focused-component-combobox-trigger",
    );
    expect(trigger?.getAttribute("aria-expanded")).toBe("true");

    dispatchPrimaryClick(
      getButtonByText(environment, "Close component options"),
      environment.window,
    );
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(
      environment.document.querySelector('[data-testid="focused-combobox-state"]')?.textContent,
    ).toBe("closed");
    expect(environment.document.querySelector("#focused-component-combobox-trigger")).toBe(trigger);
    expect(environment.document.querySelector("#focused-component-combobox-label")).toBe(label);
    expect(label?.getAttribute("for")).toBe(trigger?.id);
  });

  test("uses reactive waveform props as the only interaction contract", () => {
    const environment = domEnvironment as DomEnvironment;
    const seekCalls: number[] = [];
    renderIntoDom(
      environment,
      <WaveformContractHarness onSeek={(seconds) => seekCalls.push(seconds)} />,
    );

    const waveform = environment.document.querySelector<HTMLElement>('[role="img"]');
    expect(waveform?.getAttribute("aria-label")).toBe("Audio waveform unavailable");

    if (waveform) {
      waveform.getBoundingClientRect = () =>
        ({ left: 0, width: 100 }) as ReturnType<HTMLElement["getBoundingClientRect"]>;
    }
    act(() => {
      waveform?.dispatchEvent(
        new environment.window.PointerEvent("pointerdown", { bubbles: true, clientX: 50 }),
      );
    });

    expect(seekCalls).toEqual([]);
  });

  test("wide tables expose a locally focusable named scroll region", async () => {
    const environment = domEnvironment as DomEnvironment;
    renderIntoDom(environment, <OverflowingTableHarness />);

    const container = environment.document.querySelector<HTMLElement>(
      '[data-slot="table-container"]',
    );
    expect(container).not.toBeNull();
    expect(container?.hasAttribute("role")).toBe(false);
    expect(container?.hasAttribute("tabindex")).toBe(false);

    if (container) {
      Object.defineProperties(container, {
        clientWidth: { configurable: true, value: 200 },
        scrollWidth: { configurable: true, value: 500 },
      });
    }

    const caption = container?.querySelector("caption");
    if (caption) {
      caption.textContent = "Updated signal readings";
    }
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(container?.getAttribute("role")).toBe("region");
    expect(container?.getAttribute("tabindex")).toBe("0");
    expect(container?.getAttribute("aria-label")).toBe("Updated signal readings");
    expect(container?.getAttribute("data-overflow-indicator")).toBe("end");
    expect(container?.style.maskImage).toContain("linear-gradient");
    const focusIndicator = environment.document.querySelector<HTMLElement>(
      '[data-slot="table-wrapper"] > [aria-hidden="true"]',
    );
    expect(container?.className).toContain("peer");
    expect(focusIndicator?.className).toContain("peer-focus-visible:ring-inset");

    if (container) {
      Object.defineProperty(container, "scrollWidth", { configurable: true, value: 200 });
    }
    act(() => {
      environment.window.dispatchEvent(new environment.window.Event("resize"));
    });

    expect(container?.hasAttribute("role")).toBe(false);
    expect(container?.hasAttribute("tabindex")).toBe(false);
    expect(container?.hasAttribute("data-overflow-indicator")).toBe(false);
    expect(container?.style.maskImage).toBe("");
  });

  test("uses a left-edge overflow cue that clears at the RTL scroll end", () => {
    const environment = domEnvironment as DomEnvironment;
    renderIntoDom(environment, <OverflowingTableHarness direction="rtl" />);

    const container = environment.document.querySelector<HTMLElement>(
      '[data-slot="table-container"]',
    );
    expect(container).not.toBeNull();
    if (container) {
      Object.defineProperties(container, {
        clientWidth: { configurable: true, value: 200 },
        scrollWidth: { configurable: true, value: 500 },
      });
    }

    act(() => {
      environment.window.dispatchEvent(new environment.window.Event("resize"));
    });

    expect(container?.getAttribute("data-overflow-indicator")).toBe("start");
    expect(container?.style.maskImage).toContain("to right, transparent");

    if (container) {
      container.scrollLeft = -300;
      act(() => {
        container.dispatchEvent(new environment.window.Event("scroll"));
      });
    }

    expect(container?.hasAttribute("data-overflow-indicator")).toBe(false);
    expect(container?.style.maskImage).toBe("");
  });

  test("carousel demo renders manual controls", () => {
    const environment = domEnvironment as DomEnvironment;
    renderIntoDom(environment, <CarouselDemo />);

    const previousButton = getButtonByText(environment, "Previous slide");
    const nextButton = getButtonByText(environment, "Next slide");

    expect(previousButton).toBeDefined();
    expect(nextButton).toBeDefined();
    expect(
      environment.document.querySelector('[data-slot="carousel"]')?.getAttribute("aria-label"),
    ).toBe("Component highlights");
    expectBodyText(environment, "Server sections");
  });

  test("preserves keyed nested Fragment slide identity when groups reorder", () => {
    const environment = domEnvironment as DomEnvironment;
    renderIntoDom(environment, <KeyedFragmentCarouselHarness />);

    const alphaInput = environment.document.querySelector<HTMLInputElement>(
      'input[aria-label="alpha title"]',
    );
    expect(alphaInput).not.toBeNull();
    if (alphaInput) {
      alphaInput.value = "edited alpha";
    }

    dispatchPrimaryClick(getButtonByText(environment, "Reverse groups"), environment.window);

    const slides = Array.from(
      environment.document.querySelectorAll<HTMLElement>('[data-slot="carousel-item"]'),
    );
    expect(slides.map((slide) => slide.dataset.group)).toEqual(["beta", "alpha"]);
    expect(slides.map((slide) => slide.querySelector<HTMLInputElement>("input")?.value)).toEqual([
      "beta",
      "edited alpha",
    ]);
    expect(slides.map((slide) => slide.getAttribute("aria-label"))).toEqual([
      "Slide 1 of 2",
      "Slide 2 of 2",
    ]);
  });

  test("carousel exposes structure without consuming descendant arrow keys", () => {
    const environment = domEnvironment as DomEnvironment;
    renderIntoDom(environment, <CarouselKeyboardHarness />);

    const carousel = environment.document.querySelector('[data-slot="carousel"]');
    const slide = environment.document.querySelector('[data-slot="carousel-item"]');
    const input = environment.document.querySelector<HTMLInputElement>("#carousel-title");

    expect(carousel?.getAttribute("role")).toBe("region");
    expect(carousel?.getAttribute("aria-roledescription")).toBe("carousel");
    expect(carousel?.hasAttribute("tabindex")).toBe(false);
    expect(slide?.getAttribute("role")).toBe("group");
    expect(slide?.getAttribute("aria-roledescription")).toBe("slide");
    expect(slide?.getAttribute("aria-label")).toBe("Slide 1 of 1");
    expect(input).not.toBeNull();

    const previousButton = getButtonByText(environment, "Previous slide");
    const nextButton = getButtonByText(environment, "Next slide");
    expect(previousButton.className).not.toContain("-left-12");
    expect(nextButton.className).not.toContain("-right-12");

    const arrowEvent = new environment.window.KeyboardEvent("keydown", {
      bubbles: true,
      cancelable: true,
      key: "ArrowRight",
    });
    input?.dispatchEvent(arrowEvent);

    expect(arrowEvent.defaultPrevented).toBe(false);
  });
});
