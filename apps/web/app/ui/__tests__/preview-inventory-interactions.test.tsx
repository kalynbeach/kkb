import { describe, expect, test } from "bun:test";
import { Window } from "happy-dom";

const childProcessFlag = "KKB_PREVIEW_INVENTORY_INTERACTIONS_CHILD";

async function runPreviewInventoryInteractions() {
  const window = new Window({ url: "http://localhost/ui?item=preview" });
  const originalGlobals = new Map<string, unknown>();
  const globals = {
    document: window.document,
    window,
    navigator: window.navigator,
    HTMLElement: window.HTMLElement,
    HTMLButtonElement: window.HTMLButtonElement,
    HTMLDivElement: window.HTMLDivElement,
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
  const { PreviewInventorySpecimen } = await import(
    "../../../components/ui-catalog/preview-inventory"
  );

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

  const previouslyIncompleteTriggerCases = [
    ["alert-dialog", "Delete", "Delete preview capture?"],
    ["dialog", "Open dialog", "Preview dialog"],
    ["drawer", "Open drawer", "Preview drawer"],
    ["menubar", "File", "New capture"],
    ["navigation-menu", "Catalog", "Design system"],
    ["sheet", "Open sheet", "Preview sheet"],
  ] as const;

  for (const [id, triggerLabel, content] of previouslyIncompleteTriggerCases) {
    const container = window.document.createElement("div");
    window.document.body.append(container);
    const root = createRoot(container);

    React.act(() => {
      root.render(<PreviewInventorySpecimen id={id} onSelect={() => undefined} />);
    });

    const trigger = Array.from(container.querySelectorAll("button")).find((button) =>
      button.textContent?.includes(triggerLabel),
    );
    expect(trigger).toBeDefined();
    expect(window.document.body.textContent).not.toContain(content);

    if (!trigger) {
      throw new Error(`Missing ${triggerLabel} trigger`);
    }

    dispatchPrimaryPress(trigger);
    await React.act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(window.document.body.textContent).toContain(content);

    React.act(() => root.unmount());
    container.remove();
    await React.act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
  }

  window.close();
  for (const [key, value] of originalGlobals) {
    Object.defineProperty(globalThis, key, { configurable: true, value, writable: true });
  }
}

describe("Preview inventory interactions", () => {
  test("opens content for the previously incomplete overlay and menu specimens", async () => {
    if (process.env[childProcessFlag] === "1") {
      await runPreviewInventoryInteractions();
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
      throw new Error(`Isolated Preview interaction test failed:\n${output}`);
    }

    expect(result.exitCode).toBe(0);
  });
});
