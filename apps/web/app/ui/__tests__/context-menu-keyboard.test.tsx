import { describe, expect, test } from "bun:test";
import { Window } from "happy-dom";

const childProcessFlag = "KKB_CONTEXT_MENU_KEYBOARD_CHILD";

async function runContextMenuKeyboardInteraction() {
  const window = new Window({ url: "http://localhost/ui?item=context-menu" });
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
    DOMRect: window.DOMRect,
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
  const { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } = await import(
    "@kkb/ui/components/context-menu"
  );

  const container = window.document.createElement("div");
  window.document.body.append(container);
  const root = createRoot(container);

  React.act(() => {
    root.render(
      <ContextMenu>
        <ContextMenuTrigger render={<button type="button" />}>
          Keyboard context target
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Inspect target</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>,
    );
  });

  const trigger = window.document.querySelector<HTMLButtonElement>(
    '[data-slot="context-menu-trigger"]',
  );
  expect(trigger).not.toBeNull();
  trigger?.focus();

  React.act(() => {
    trigger?.dispatchEvent(
      new window.KeyboardEvent("keydown", {
        bubbles: true,
        cancelable: true,
        key: "F10",
        shiftKey: true,
      }),
    );
  });
  await React.act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });

  expect(window.document.querySelector('[data-slot="context-menu-content"]')).not.toBeNull();
  expect(window.document.body.textContent).toContain("Inspect target");

  React.act(() => root.unmount());
  container.remove();
  window.close();
  for (const [key, value] of originalGlobals) {
    Object.defineProperty(globalThis, key, { configurable: true, value, writable: true });
  }
}

describe("ContextMenu keyboard contract", () => {
  test("opens a focused context target with Shift+F10", async () => {
    if (process.env[childProcessFlag] === "1") {
      await runContextMenuKeyboardInteraction();
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
      throw new Error(`Isolated ContextMenu keyboard test failed:\n${output}`);
    }

    expect(result.exitCode).toBe(0);
  });
});
