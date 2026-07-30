import { describe, expect, test } from "bun:test";
import { Window } from "happy-dom";

const childProcessFlag = "KKB_BASE_WRAPPER_CONTRACTS_CHILD";

async function runBaseWrapperContracts() {
  const window = new Window({ url: "http://localhost/ui" });
  const originalGlobals = new Map<string, unknown>();
  const globals = {
    document: window.document,
    window,
    navigator: window.navigator,
    HTMLElement: window.HTMLElement,
    HTMLButtonElement: window.HTMLButtonElement,
    Element: window.Element,
    Node: window.Node,
    Event: window.Event,
    MouseEvent: window.MouseEvent,
    PointerEvent: window.PointerEvent,
    KeyboardEvent: window.KeyboardEvent,
    CustomEvent: window.CustomEvent,
    MutationObserver: window.MutationObserver,
    ResizeObserver: window.ResizeObserver,
    getComputedStyle: window.getComputedStyle.bind(window),
    requestAnimationFrame: window.requestAnimationFrame.bind(window),
    cancelAnimationFrame: window.cancelAnimationFrame.bind(window),
    IS_REACT_ACT_ENVIRONMENT: true,
  };

  for (const [key, value] of Object.entries(globals)) {
    originalGlobals.set(key, Reflect.get(globalThis, key));
    Object.defineProperty(globalThis, key, { configurable: true, value, writable: true });
  }

  const React = await import("react");
  const { createRoot } = await import("react-dom/client");
  const {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger,
  } = await import("@kkb/ui/components/navigation-menu");
  const { RadioGroup, RadioGroupItem } = await import("@kkb/ui/components/radio-group");
  const { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } = await import(
    "@kkb/ui/components/select"
  );
  const { ToggleGroup, ToggleGroupItem } = await import("@kkb/ui/components/toggle-group");

  const radioValues: string[] = [];
  const selectValues: string[] = [];
  const singleToggleValues: string[] = [];
  const multipleToggleValues: string[][] = [];

  function Harness() {
    return (
      <>
        <NavigationMenu viewport={false} defaultValue="navigation-item">
          <NavigationMenuList>
            <NavigationMenuItem value="navigation-item">
              <NavigationMenuTrigger>Open navigation</NavigationMenuTrigger>
              <NavigationMenuContent>Viewport content</NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <Select defaultOpen onValueChange={(value) => selectValues.push(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Choose density" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="compact">Compact</SelectItem>
          </SelectContent>
        </Select>
        <RadioGroup onValueChange={(value) => radioValues.push(value)}>
          <RadioGroupItem value="radio-value" aria-label="Radio value" />
        </RadioGroup>
        <ToggleGroup onValueChange={(value) => singleToggleValues.push(value)}>
          <ToggleGroupItem value="single-value">Single value</ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup type="multiple" onValueChange={(value) => multipleToggleValues.push(value)}>
          <ToggleGroupItem value="multiple-one">Multiple one</ToggleGroupItem>
          <ToggleGroupItem value="multiple-two">Multiple two</ToggleGroupItem>
        </ToggleGroup>
      </>
    );
  }

  function dispatchPrimaryPress(target: Element) {
    React.act(() => {
      target.dispatchEvent(
        new window.PointerEvent("pointerdown", {
          bubbles: true,
          button: 0,
          buttons: 1,
          cancelable: true,
          isPrimary: true,
          pointerType: "mouse",
        }),
      );
      target.dispatchEvent(
        new window.PointerEvent("pointerup", {
          bubbles: true,
          button: 0,
          cancelable: true,
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

  const container = window.document.createElement("div");
  window.document.body.append(container);
  const root = createRoot(container);

  React.act(() => root.render(<Harness />));
  await React.act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });

  const menu = window.document.querySelector('[data-slot="navigation-menu"]');
  expect(menu?.getAttribute("data-viewport")).toBe("false");
  expect(window.document.querySelector('[data-slot="navigation-menu-viewport"]')).not.toBeNull();
  expect(
    window.document.querySelector('[data-slot="navigation-menu-content"]')?.textContent,
  ).toContain("Viewport content");

  const selectItem = window.document.querySelector('[data-slot="select-item"]');
  const radio = window.document.querySelector('[data-slot="radio-group-item"]');
  const buttons = Array.from(window.document.querySelectorAll("button"));
  const buttonByText = (text: string) =>
    buttons.find((button) => button.textContent?.includes(text));

  if (!selectItem || !radio) {
    throw new Error("Expected open Select item and RadioGroup item");
  }

  dispatchPrimaryPress(selectItem);
  dispatchPrimaryPress(radio);
  for (const label of ["Single value", "Multiple one", "Multiple two"]) {
    const button = buttonByText(label);
    if (!button) {
      throw new Error(`Expected ${label} ToggleGroup item`);
    }
    dispatchPrimaryPress(button);
  }

  await React.act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });

  expect(selectValues).toEqual(["compact"]);
  expect(radioValues).toEqual(["radio-value"]);
  expect(singleToggleValues).toEqual(["single-value"]);
  expect(multipleToggleValues).toEqual([["multiple-one"], ["multiple-one", "multiple-two"]]);

  React.act(() => root.unmount());
  container.remove();
  window.close();
  for (const [key, value] of originalGlobals) {
    Object.defineProperty(globalThis, key, { configurable: true, value, writable: true });
  }
}

describe("Base wrapper contracts", () => {
  test("preserves NavigationMenu viewport anatomy and public callback value shapes", async () => {
    if (process.env[childProcessFlag] === "1") {
      await runBaseWrapperContracts();
      return;
    }

    const result = Bun.spawnSync({
      cmd: ["bun", "test", import.meta.path],
      env: { ...process.env, [childProcessFlag]: "1" },
      stderr: "pipe",
      stdout: "pipe",
    });

    if (result.exitCode !== 0) {
      const output = `${result.stdout.toString()}\n${result.stderr.toString()}`.trim();
      throw new Error(`Isolated Base wrapper contract test failed:\n${output}`);
    }

    expect(result.exitCode).toBe(0);
  });
});
