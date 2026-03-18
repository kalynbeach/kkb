import { describe, expect, test } from "bun:test";

const readFile = (path: string) => Bun.file(new URL(path, import.meta.url)).text();

const FORBIDDEN_AUDIO_COLOR_LITERAL = /#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})|\brgba\(/;

describe("shared audio theme tokens", () => {
  test("defines audio theme tokens in globals.css for light and dark themes", async () => {
    const css = await readFile("../../../styles/globals.css");

    expect(css).toContain("--audio-shell-border");
    expect(css).toContain("--audio-panel-border");
    expect(css).toContain("--audio-accent");
    expect(css).toContain("--audio-status-error");
    expect(css).toContain("--color-audio-accent");
    expect(css).toContain(":root");
    expect(css).toContain(".dark");
  });

  test("does not use raw hex or rgba values in shared audio components", async () => {
    const files = await Promise.all([
      readFile("../player-controls.tsx"),
      readFile("../waveform.tsx"),
      readFile("../playhead.tsx"),
    ]);

    for (const file of files) {
      expect(file).not.toMatch(FORBIDDEN_AUDIO_COLOR_LITERAL);
    }
  });
});
