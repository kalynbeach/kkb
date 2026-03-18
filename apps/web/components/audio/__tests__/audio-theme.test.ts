import { describe, expect, test } from "bun:test";

const readFile = (path: string) => Bun.file(new URL(path, import.meta.url)).text();

const FORBIDDEN_AUDIO_COLOR_LITERAL = /#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})|\brgba\(/;

describe("web audio theme tokens", () => {
  test("does not use raw hex or rgba values in web audio shell components", async () => {
    const files = await Promise.all([
      readFile("../player-shell.tsx"),
      readFile("../player-client.tsx"),
      readFile("../track-selector.tsx"),
    ]);

    for (const file of files) {
      expect(file).not.toMatch(FORBIDDEN_AUDIO_COLOR_LITERAL);
    }
  });
});
