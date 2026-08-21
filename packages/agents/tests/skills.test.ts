import { describe, expect, test } from "bun:test";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";

const skillsDirectory = resolve(import.meta.dir, "../skills");

function markdownFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);

    if (entry.isDirectory()) {
      return markdownFiles(path);
    }

    return extname(entry.name) === ".md" ? [path] : [];
  });
}

function localMarkdownTargets(markdown: string): string[] {
  return [...markdown.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)]
    .map((match) => match[1]?.trim())
    .filter((target): target is string => Boolean(target))
    .map((target) => target.replace(/^<|>$/g, "").split(/\s+["']/)[0] ?? "")
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

      test("has no broken local Markdown links", () => {
        for (const markdownFile of markdownFiles(skillDirectory)) {
          const markdown = readFileSync(markdownFile, "utf8");

          for (const target of localMarkdownTargets(markdown)) {
            expect(existsSync(resolve(dirname(markdownFile), target))).toBe(true);
          }
        }
      });
    });
  }
});
