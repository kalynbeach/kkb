import { describe, expect, test } from "bun:test";
import { createElement } from "react";
import { renderToString } from "react-dom/server";

import { Badge } from "../badge";
import { buttonVariants } from "../button-variants";
import { Code } from "../code";
import { Slider } from "../slider";

describe("design-system style contracts", () => {
  test("destructive variants consume their paired semantic foreground", () => {
    const buttonClassName = buttonVariants({ variant: "destructive" });
    const badgeHtml = renderToString(createElement(Badge, { variant: "destructive" }, "Error"));

    expect(buttonClassName).toContain("text-destructive-foreground");
    expect(buttonClassName).toContain("hover:bg-destructive-hover");
    expect(buttonClassName).not.toContain("text-white");
    expect(badgeHtml).toContain("text-destructive-foreground");
    expect(badgeHtml).toContain("hover:bg-destructive-hover");
    expect(badgeHtml).not.toContain("text-white");
  });

  test("code and slider surfaces use semantic color roles", () => {
    const codeHtml = renderToString(createElement(Code, null, "bun test"));
    const sliderHtml = renderToString(createElement(Slider, { defaultValue: [50] }));

    expect(codeHtml).toContain("bg-muted");
    expect(codeHtml).not.toContain("bg-gray-alpha-100");
    expect(sliderHtml).toContain("bg-background");
    expect(sliderHtml).not.toContain("bg-white");
  });

  test("published audio utilities and reduced-motion behavior are defined", async () => {
    const styles = await Bun.file(new URL("../../styles/globals.css", import.meta.url)).text();

    expect(styles).toContain("--color-audio-panel: var(--audio-panel-mid)");
    expect(styles).toContain("--color-audio-control: var(--audio-control-mid)");
    expect(styles).toContain("--audio-label: var(--audio-shell-label)");
    expect(styles).toMatch(/\.audio-panel\s*{[^}]*--audio-label:\s*var\(--audio-panel-label\)/s);
    expect(styles).toContain("@media (prefers-reduced-motion: reduce)");
    expect(styles).toMatch(/\.animate-marquee\s*{[^}]*animation:\s*none/s);
  });
});
