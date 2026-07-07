import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { Window } from "happy-dom";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";

import { CarouselDemo } from "../../../components/ui-catalog/demos/carousel-demo";
import { CommandDemo } from "../../../components/ui-catalog/demos/command-demo";
import { DropdownMenuDemo } from "../../../components/ui-catalog/demos/menu-demo";
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
        ctrlKey: false,
      }),
    );
    target.dispatchEvent(new window.MouseEvent("mousedown", { bubbles: true, button: 0 }));
    target.dispatchEvent(new window.MouseEvent("mouseup", { bubbles: true, button: 0 }));
    target.dispatchEvent(new window.MouseEvent("click", { bubbles: true, button: 0 }));
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

let domEnvironment: DomEnvironment | null = null;

beforeEach(() => {
  domEnvironment = setupDom();
});

afterEach(() => {
  domEnvironment?.cleanup();
  domEnvironment = null;
});

describe("interactive /ui demos", () => {
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

  test("dropdown menu demo updates trigger state", () => {
    const environment = domEnvironment as DomEnvironment;
    renderIntoDom(environment, <DropdownMenuDemo />);

    const trigger = getButtonByText(environment, "Open menu");

    dispatchPrimaryClick(trigger, environment.window);

    expect(trigger.getAttribute("aria-expanded")).toBe("true");
  });

  test("command demo opens command palette content", () => {
    const environment = domEnvironment as DomEnvironment;
    renderIntoDom(environment, <CommandDemo />);

    dispatchPrimaryClick(getButtonByText(environment, "Open command"), environment.window);

    expectBodyText(environment, "Catalog command");
    expectBodyText(environment, "Search local section actions.");
  });

  test("carousel demo renders manual controls", () => {
    const environment = domEnvironment as DomEnvironment;
    renderIntoDom(environment, <CarouselDemo />);

    const previousButton = getButtonByText(environment, "Previous slide");
    const nextButton = getButtonByText(environment, "Next slide");

    expect(previousButton).toBeDefined();
    expect(nextButton).toBeDefined();
    expectBodyText(environment, "Server sections");
  });
});
