import { describe, expect, test } from "bun:test";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, extname, join, relative, resolve } from "node:path";

const packageDirectory = resolve(import.meta.dir, "..");
const skillsDirectory = join(packageDirectory, "skills");
const artifactShellFile = join(skillsDirectory, "html-communication/assets/artifact-shell.html");
const ignoredMarkdownDirectories = new Set([".turbo", "node_modules"]);

type ScrollRegion = {
  clientWidth: number;
  scrollWidth: number;
  tabIndex: number;
};

function runArtifactShellScript(
  theme: string | undefined,
  {
    codeBlocks = [],
    tableWraps = [],
    withToggle = true,
  }: { codeBlocks?: ScrollRegion[]; tableWraps?: ScrollRegion[]; withToggle?: boolean } = {},
) {
  const animationFrames: (() => void)[] = [];
  const eventListeners = new Map<string, () => void>();
  const resizeObservedTargets = new Set<ScrollRegion>();
  const mutationObservation = {
    target: null as object | null,
    options: null as { childList?: boolean; subtree?: boolean; characterData?: boolean } | null,
  };
  let resizeObserverCallback: (() => void) | undefined;
  let mutationObserverCallback: (() => void) | undefined;
  const root = { dataset: {} as { theme?: string } };
  const toggle = withToggle
    ? {
        textContent: "",
        ariaLabel: "",
        setAttribute(name: string, value: string) {
          if (name === "aria-label") this.ariaLabel = value;
        },
        addEventListener(name: string, listener: () => void) {
          eventListeners.set(name, listener);
        },
      }
    : null;

  if (theme !== undefined) root.dataset.theme = theme;

  const documentStub = {
    body: {},
    documentElement: root,
    querySelector: () => toggle,
    querySelectorAll(selector: string) {
      const selectors = new Set(selector.split(",").map((part) => part.trim()));

      return [
        ...(selectors.has("pre") ? codeBlocks : []),
        ...(selectors.has(".table-wrap") ? tableWraps : []),
      ];
    },
  };
  const windowStub = {
    addEventListener(name: string, listener: () => void) {
      eventListeners.set(name, listener);
    },
    requestAnimationFrame(listener: () => void) {
      animationFrames.push(listener);
      return animationFrames.length;
    },
  };
  class ResizeObserverStub {
    constructor(listener: () => void) {
      resizeObserverCallback = listener;
    }

    observe(target: ScrollRegion) {
      resizeObservedTargets.add(target);
    }

    unobserve(target: ScrollRegion) {
      resizeObservedTargets.delete(target);
    }
  }
  class MutationObserverStub {
    constructor(listener: () => void) {
      mutationObserverCallback = listener;
    }

    observe(
      target: object,
      options: { childList?: boolean; subtree?: boolean; characterData?: boolean },
    ) {
      mutationObservation.target = target;
      mutationObservation.options = options;
    }
  }
  const artifactShell = readFileSync(artifactShellFile, "utf8");
  const script = artifactShell.match(/<script>([\s\S]*?)<\/script>/)?.[1];

  expect(script).toBeDefined();
  Function(
    "document",
    "window",
    "ResizeObserver",
    "MutationObserver",
    script ?? "",
  )(documentStub, windowStub, ResizeObserverStub, MutationObserverStub);

  return {
    eventListeners,
    observers: {
      animationFrames,
      mutationObservation,
      resizeObservedTargets,
      runAnimationFrames() {
        for (const callback of animationFrames.splice(0)) callback();
      },
      triggerMutation() {
        if (mutationObservation.target) mutationObserverCallback?.();
      },
      triggerResize(target: ScrollRegion) {
        if (resizeObservedTargets.has(target)) resizeObserverCallback?.();
      },
    },
    root,
    toggle,
  };
}

function markdownFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);

    if (entry.isDirectory()) {
      return ignoredMarkdownDirectories.has(entry.name) ? [] : markdownFiles(path);
    }

    return extname(entry.name) === ".md" ? [path] : [];
  });
}

function localMarkdownTargets(markdown: string): string[] {
  const targets: string[] = [];

  Bun.markdown.render(markdown, {
    link: (children, { href }) => {
      targets.push(href);
      return children;
    },
    image: (children, { src }) => {
      targets.push(src);
      return children;
    },
  });

  return targets
    .map((target) => target.trim())
    .filter(
      (target) =>
        target.length > 0 &&
        !target.startsWith("#") &&
        !target.startsWith("/") &&
        !/^[a-z][a-z\d+.-]*:/i.test(target),
    )
    .map((target) => target.split("#")[0] ?? "")
    .filter(Boolean);
}

const skillNames = readdirSync(skillsDirectory, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

describe("Markdown links", () => {
  test("finds local links and images outside code", () => {
    const markdown = [
      '[inline](./inline.md "Inline title")',
      "[reference][reference]",
      "![image](./image.png)",
      "`[inline code](./ignored-inline.md)`",
      "",
      "```markdown",
      "[fenced code](./ignored-fenced.md)",
      "```",
      "",
      "    [indented code](./ignored-indented.md)",
      "",
      "[reference]: ./reference.md",
    ].join("\n");

    expect(localMarkdownTargets(markdown)).toEqual([
      "./inline.md",
      "./reference.md",
      "./image.png",
    ]);
  });

  test("keeps local paths while ignoring anchors and external targets", () => {
    const markdown = [
      "[section](./document.md#section)",
      "[anchor](#section)",
      "[absolute](/document.md)",
      "[external](https://example.com)",
    ].join("\n");

    expect(localMarkdownTargets(markdown)).toEqual(["./document.md"]);
  });
});

describe("HTML communication artifact shell", () => {
  test("keeps its implementation bindings out of the global scope", () => {
    const artifactShell = readFileSync(artifactShellFile, "utf8");
    const script = artifactShell.match(/<script>([\s\S]*?)<\/script>/)?.[1];

    expect(script).toBeDefined();
    expect(() => Function(`${script}\n${script}`)).not.toThrow();
  });

  test("falls back to system mode when the configured theme is missing or invalid", () => {
    for (const theme of [undefined, "sepia"]) {
      const { root, toggle } = runArtifactShellScript(theme);

      expect(root.dataset.theme).toBe("system");
      expect(toggle?.textContent).toBe("Mode: system");
      expect(toggle?.ariaLabel).toBe("Color mode: system. Activate to change.");
    }
  });

  test("initializes the theme without the optional mode control", () => {
    const { root, toggle } = runArtifactShellScript(undefined, { withToggle: false });

    expect(root.dataset.theme).toBe("system");
    expect(toggle).toBeNull();
  });

  test("cycles the mode control through every mode", () => {
    const { eventListeners, root, toggle } = runArtifactShellScript("system");
    const click = eventListeners.get("click");

    click?.();
    expect(root.dataset.theme).toBe("light");
    click?.();
    expect(root.dataset.theme).toBe("dark");
    click?.();
    expect(root.dataset.theme).toBe("system");
    expect(toggle?.textContent).toBe("Mode: system");
    expect(toggle?.ariaLabel).toBe("Color mode: system. Activate to change.");
  });

  test("keeps only horizontally overflowing regions in the tab order", () => {
    const codeBlock = { clientWidth: 320, scrollWidth: 640, tabIndex: -1 };
    const tableWrap = { clientWidth: 320, scrollWidth: 320, tabIndex: -1 };
    const { eventListeners } = runArtifactShellScript("system", {
      codeBlocks: [codeBlock],
      tableWraps: [tableWrap],
    });

    expect(codeBlock.tabIndex).toBe(0);
    expect(tableWrap.tabIndex).toBe(-1);

    codeBlock.scrollWidth = 320;
    tableWrap.scrollWidth = 640;
    eventListeners.get("resize")?.();

    expect(codeBlock.tabIndex).toBe(-1);
    expect(tableWrap.tabIndex).toBe(0);
  });

  test("resynchronizes regions after layout and content changes", () => {
    const codeBlock = { clientWidth: 0, scrollWidth: 0, tabIndex: -1 };
    const codeBlocks = [codeBlock];
    const tableWraps: ScrollRegion[] = [];
    const { observers } = runArtifactShellScript("system", { codeBlocks, tableWraps });

    expect(observers.resizeObservedTargets.has(codeBlock)).toBe(true);
    expect(observers.mutationObservation).toMatchObject({
      target: expect.any(Object),
      options: { childList: true, subtree: true, characterData: true },
    });

    codeBlock.clientWidth = 320;
    codeBlock.scrollWidth = 640;
    observers.triggerResize(codeBlock);
    expect(codeBlock.tabIndex).toBe(0);

    const addedTableWrap = { clientWidth: 320, scrollWidth: 640, tabIndex: -1 };
    tableWraps.push(addedTableWrap);
    observers.triggerMutation();
    observers.triggerMutation();
    expect(observers.animationFrames).toHaveLength(1);
    expect(addedTableWrap.tabIndex).toBe(-1);

    observers.runAnimationFrames();
    expect(addedTableWrap.tabIndex).toBe(0);
    expect(observers.resizeObservedTargets.has(addedTableWrap)).toBe(true);

    codeBlocks.splice(0, 1);
    observers.triggerMutation();
    observers.runAnimationFrames();
    expect(observers.resizeObservedTargets.has(codeBlock)).toBe(false);
  });
});

describe("KKB agents package", () => {
  test("has no broken local Markdown links", () => {
    const brokenLinks = markdownFiles(packageDirectory).flatMap((markdownFile) => {
      const markdown = readFileSync(markdownFile, "utf8");

      return localMarkdownTargets(markdown)
        .filter((target) => !existsSync(resolve(dirname(markdownFile), target)))
        .map((target) => ({
          source: relative(packageDirectory, markdownFile),
          target,
        }));
    });

    expect(brokenLinks).toEqual([]);
  });
});

describe("KKB skills", () => {
  test("the package contains at least one skill", () => {
    expect(skillNames.length).toBeGreaterThan(0);
  });

  for (const skillName of skillNames) {
    describe(skillName, () => {
      const skillDirectory = join(skillsDirectory, skillName);
      const skillFile = join(skillDirectory, "SKILL.md");
      const metadataFile = join(skillDirectory, "agents/openai.yaml");

      test("has matching skill frontmatter", () => {
        expect(existsSync(skillFile)).toBe(true);

        const skill = readFileSync(skillFile, "utf8");
        const frontmatter = skill.match(/^---\n([\s\S]*?)\n---/);

        expect(frontmatter?.[1]).toBeDefined();
        expect(Bun.YAML.parse(frontmatter?.[1] ?? "")).toMatchObject({
          name: skillName,
          description: expect.stringMatching(/\S/),
        });
      });

      test("has valid matching OpenAI metadata", () => {
        expect(existsSync(metadataFile)).toBe(true);

        const metadata = Bun.YAML.parse(readFileSync(metadataFile, "utf8"));

        expect(metadata).toMatchObject({
          interface: {
            display_name: expect.stringMatching(/\S/),
            short_description: expect.stringMatching(/\S/),
            default_prompt: expect.stringContaining(`$${skillName}`),
          },
          policy: {
            allow_implicit_invocation: expect.any(Boolean),
          },
        });
      });
    });
  }
});
