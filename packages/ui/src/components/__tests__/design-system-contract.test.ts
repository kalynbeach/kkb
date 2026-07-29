import { describe, expect, test } from "bun:test";
import { createElement } from "react";
import { renderToString } from "react-dom/server";

import { Badge } from "../badge";
import { buttonVariants } from "../button-variants";
import { Code } from "../code";
import { Slider } from "../slider";

function styleBlock(styles: string, selector: ":root" | ".dark") {
  const escapedSelector = selector.replace(".", "\\.");
  const match = styles.match(new RegExp(`${escapedSelector}\\s*\\{([\\s\\S]*?)\\n\\}`));

  if (!match?.[1]) {
    throw new Error(`Missing ${selector} style block`);
  }

  return match[1];
}

function oklchValue(block: string, token: string) {
  const match = block.match(new RegExp(`--${token}:\\s*oklch\\(([^)]+)\\)`));

  if (!match?.[1]) {
    throw new Error(`Missing --${token} OKLCH value`);
  }

  return match[1].trim().split(/\s+/).slice(0, 3).map(Number) as [number, number, number];
}

function relativeLuminance([lightness, chroma, hue]: [number, number, number]) {
  const hueRadians = (hue * Math.PI) / 180;
  const a = chroma * Math.cos(hueRadians);
  const b = chroma * Math.sin(hueRadians);
  const lPrime = lightness + 0.3963377774 * a + 0.2158037573 * b;
  const mPrime = lightness - 0.1055613458 * a - 0.0638541728 * b;
  const sPrime = lightness - 0.0894841775 * a - 1.291485548 * b;
  const l = lPrime ** 3;
  const m = mPrime ** 3;
  const s = sPrime ** 3;
  const linearRgb = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];

  return 0.2126 * linearRgb[0] + 0.7152 * linearRgb[1] + 0.0722 * linearRgb[2];
}

function contrastRatio(foreground: [number, number, number], background: [number, number, number]) {
  const luminances = [relativeLuminance(foreground), relativeLuminance(background)].sort(
    (left, right) => right - left,
  );

  return ((luminances[0] ?? 0) + 0.05) / ((luminances[1] ?? 0) + 0.05);
}

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

  test("publishes radius-none geometry and accessible paired status tokens", async () => {
    const styles = await Bun.file(new URL("../../styles/globals.css", import.meta.url)).text();
    const light = styleBlock(styles, ":root");
    const dark = styleBlock(styles, ".dark");

    expect(light).toMatch(/--radius:\s*0;/);
    expect(styles).toContain("--radius-xs: calc(var(--radius) * 0.4)");
    expect(styles).toContain("--color-success: var(--success)");
    expect(styles).toContain("--color-success-foreground: var(--success-foreground)");
    expect(styles).toContain("--color-warning: var(--warning)");
    expect(styles).toContain("--color-warning-foreground: var(--warning-foreground)");
    expect(styles).toContain("--color-scrim: var(--scrim)");

    for (const block of [light, dark]) {
      expect(
        contrastRatio(oklchValue(block, "muted-foreground"), oklchValue(block, "muted")),
      ).toBeGreaterThanOrEqual(4.5);
      expect(
        contrastRatio(oklchValue(block, "success-foreground"), oklchValue(block, "success")),
      ).toBeGreaterThanOrEqual(4.5);
      expect(
        contrastRatio(oklchValue(block, "warning-foreground"), oklchValue(block, "warning")),
      ).toBeGreaterThanOrEqual(4.5);
    }
  });

  test("representative structure is square while documented mechanics stay round", async () => {
    const componentSource = async (name: string) =>
      Bun.file(new URL(`../${name}`, import.meta.url)).text();
    const [
      dialog,
      sheet,
      alertDialog,
      drawer,
      checkbox,
      calendar,
      carousel,
      chart,
      combobox,
      inputOtp,
      navigationMenu,
      slider,
      tooltip,
      waveform,
    ] = await Promise.all([
      componentSource("dialog.tsx"),
      componentSource("sheet.tsx"),
      componentSource("alert-dialog.tsx"),
      componentSource("drawer.tsx"),
      componentSource("checkbox.tsx"),
      componentSource("calendar.tsx"),
      componentSource("carousel.tsx"),
      componentSource("chart.tsx"),
      componentSource("combobox.tsx"),
      componentSource("input-otp.tsx"),
      componentSource("navigation-menu.tsx"),
      componentSource("slider.tsx"),
      componentSource("tooltip.tsx"),
      componentSource("audio/waveform.tsx"),
    ]);

    for (const overlay of [dialog, sheet, alertDialog, drawer]) {
      expect(overlay).toContain("bg-scrim");
      expect(overlay).not.toContain("bg-black/50");
    }

    expect(checkbox).not.toContain("rounded-[4px]");
    expect(calendar).not.toMatch(/rounded-[lr]-md/);
    expect(carousel).not.toContain("rounded-full");
    expect(chart).not.toContain("rounded-[2px]");
    expect(inputOtp).not.toMatch(/rounded-[lr]-md/);
    expect(navigationMenu).not.toContain("rounded-tl-sm");
    expect(tooltip).not.toContain("rounded-[2px]");
    expect(waveform).not.toContain("rounded-[2px]");

    expect(combobox).toContain('data-slot="combobox-chip"');
    expect(combobox).toContain("rounded-full");
    expect(drawer).toContain("rounded-full");
    expect(slider).toContain("rounded-full");
  });

  test("published audio utilities and reduced-motion behavior are defined", async () => {
    const styles = await Bun.file(new URL("../../styles/globals.css", import.meta.url)).text();

    expect(styles).toContain("--color-audio-panel: var(--audio-panel-mid)");
    expect(styles).toContain("--color-audio-control: var(--audio-control-mid)");
    expect(styles).toContain("--audio-label: var(--audio-shell-label)");
    expect(styles).toMatch(/\.audio-panel\s*{[^}]*--audio-label:\s*var\(--audio-panel-label\)/s);
    expect(styles).toMatch(/\.audio-shell\s*{[^}]*@apply\s+border\s/s);
    expect(styles).toMatch(/\.audio-transport-button\s*{[^}]*@apply(?![^}]*rounded-)/s);
    expect(styles).toContain("@media (prefers-reduced-motion: reduce)");
    expect(styles).toMatch(/\.animate-marquee\s*{[^}]*animation:\s*none/s);
  });
});
