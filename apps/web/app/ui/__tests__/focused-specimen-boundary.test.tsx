import { describe, expect, test } from "bun:test";
import { Window } from "happy-dom";

const childProcessFlag = "KKB_FOCUSED_SPECIMEN_BOUNDARY_CHILD";

async function runFocusedSpecimenBoundaryInteraction() {
  const window = new Window({ url: "http://localhost/ui?item=unknown-visual" });
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
  const { FocusedComponentSurface } = await import(
    "../../../components/ui-catalog/focused-specimens"
  );
  const { itemFromId } = await import("../../../components/ui-catalog/catalog-data");
  const container = window.document.createElement("div");
  window.document.body.append(container);
  const root = createRoot(container);
  const invalidVisualItem = { ...itemFromId("button"), id: "unknown-visual" };
  const originalConsoleError = console.error;

  console.error = () => undefined;
  try {
    React.act(() => root.render(<FocusedComponentSurface item={invalidVisualItem} />));
    await React.act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(window.document.body.textContent).toContain("Demo unavailable");
    expect(window.document.body.textContent).toContain("This demo failed in isolation.");
  } finally {
    console.error = originalConsoleError;
    React.act(() => root.unmount());
    container.remove();
    window.close();
    for (const [key, value] of originalGlobals) {
      Object.defineProperty(globalThis, key, { configurable: true, value, writable: true });
    }
  }
}

describe("Focused specimen boundary", () => {
  test("catches visual selection failures below DemoBoundary", async () => {
    if (process.env[childProcessFlag] === "1") {
      await runFocusedSpecimenBoundaryInteraction();
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
      throw new Error(`Isolated focused specimen boundary test failed:\n${output}`);
    }

    expect(result.exitCode).toBe(0);
  });
});
