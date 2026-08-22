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
  }: { codeBlocks?: ScrollRegion[]; tableWraps?: ScrollRegion[] } = {},
) {
  const eventListeners = new Map<string, () => void>();
  const root = { dataset: {} as { theme?: string } };
  const toggle = {
    textContent: "",
    ariaLabel: "",
    setAttribute(name: string, value: string) {
      if (name === "aria-label") this.ariaLabel = value;
    },
    addEventListener(name: string, listener: () => void) {
      eventListeners.set(name, listener);
    },
  };

  if (theme !== undefined) root.dataset.theme = theme;

  const documentStub = {
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
  };
  const artifactShell = readFileSync(artifactShellFile, "utf8");
  const script = artifactShell.match(/<script>([\s\S]*?)<\/script>/)?.[1];

  expect(script).toBeDefined();
  Function("document", "window", script ?? "")(documentStub, windowStub);

  return { eventListeners, root, toggle };
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
  test("falls back to system mode when the configured theme is missing or invalid", () => {
    for (const theme of [undefined, "sepia"]) {
      const { root, toggle } = runArtifactShellScript(theme);

      expect(root.dataset.theme).toBe("system");
      expect(toggle.textContent).toBe("Mode: system");
      expect(toggle.ariaLabel).toBe("Color mode: system. Activate to change.");
    }
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
