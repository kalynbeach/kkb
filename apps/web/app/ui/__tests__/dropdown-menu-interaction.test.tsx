import { describe, expect, test } from "bun:test";
import { Window } from "happy-dom";

const childProcessFlag = "KKB_DROPDOWN_INTERACTION_CHILD";

async function runDropdownInteraction() {
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
  const { Button } = await import("@kkb/ui/components/button");
  const { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } = await import(
    "@kkb/ui/components/dropdown-menu"
  );

  function Harness({ onSelect }: { onSelect: () => void }) {
    const [open, setOpen] = React.useState(false);

    return React.createElement(
      React.Fragment,
      null,
      React.createElement("span", { "data-testid": "dropdown-state" }, open ? "open" : "closed"),
      React.createElement(
        DropdownMenu,
        { open, onOpenChange: setOpen },
        React.createElement(
          DropdownMenuTrigger,
          { render: React.createElement(Button) },
          "Open menu",
        ),
        React.createElement(
          DropdownMenuContent,
          null,
          React.createElement(DropdownMenuItem, { onClick: onSelect }, "Choose item"),
        ),
      ),
    );
  }

  function dispatchPrimaryPress(target: Element) {
    React.act(() => {
      target.dispatchEvent(
        new window.MouseEvent("mousedown", {
          bubbles: true,
          button: 0,
          buttons: 1,
          cancelable: true,
        }),
      );
      target.dispatchEvent(
        new window.MouseEvent("mouseup", {
          bubbles: true,
          button: 0,
          cancelable: true,
        }),
      );
      target.dispatchEvent(
        new window.MouseEvent("click", { bubbles: true, button: 0, cancelable: true }),
      );
    });
  }

  async function flushUpdates() {
    await React.act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
  }

  const container = window.document.createElement("div");
  window.document.body.append(container);
  const root = createRoot(container);
  let selections = 0;

  React.act(() => {
    root.render(
      React.createElement(Harness, {
        onSelect: () => {
          selections += 1;
        },
      }),
    );
  });

  const trigger = window.document.querySelector('[data-slot="dropdown-menu-trigger"]');
  if (!trigger) {
    throw new Error("Expected dropdown trigger");
  }

  dispatchPrimaryPress(trigger);
  await flushUpdates();

  expect(trigger.hasAttribute("data-popup-open")).toBe(true);
  expect(window.document.querySelector('[data-testid="dropdown-state"]')?.textContent).toBe("open");
  const item = window.document.querySelector('[data-slot="dropdown-menu-item"]');
  if (!item) {
    throw new Error("Expected open dropdown item");
  }

  dispatchPrimaryPress(item);
  await flushUpdates();

  expect(selections).toBe(1);
  expect(trigger.hasAttribute("data-popup-open")).toBe(false);
  expect(window.document.querySelector('[data-testid="dropdown-state"]')?.textContent).toBe(
    "closed",
  );

  React.act(() => root.unmount());
  container.remove();
  window.close();
  for (const [key, value] of originalGlobals) {
    Object.defineProperty(globalThis, key, { configurable: true, value, writable: true });
  }
}

describe("DropdownMenu interaction contract", () => {
  test("opens, invokes the selected item callback, and closes", async () => {
    if (process.env[childProcessFlag] === "1") {
      await runDropdownInteraction();
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
      throw new Error(`Isolated DropdownMenu interaction failed:\n${output}`);
    }

    expect(result.exitCode).toBe(0);
  });
});
