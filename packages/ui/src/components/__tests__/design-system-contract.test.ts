import { describe, expect, test } from "bun:test";
import { createElement } from "react";
import { renderToString } from "react-dom/server";

import { AspectRatio } from "../aspect-ratio";
import { Badge } from "../badge";
import { buttonVariants } from "../button-variants";
import { Code } from "../code";
import { Label } from "../label";
import { Progress } from "../progress";
import { Separator } from "../separator";
import { Slider } from "../slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../tabs";
import { toggleVariants } from "../toggle-variants";

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
      expect(
        contrastRatio(oklchValue(block, "destructive"), oklchValue(block, "background")),
      ).toBeGreaterThanOrEqual(4.5);
      expect(
        contrastRatio(
          oklchValue(block, "destructive-foreground"),
          oklchValue(block, "destructive"),
        ),
      ).toBeGreaterThanOrEqual(4.5);
      expect(
        contrastRatio(
          oklchValue(block, "destructive-foreground"),
          oklchValue(block, "destructive-hover"),
        ),
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

  test("native foundations preserve aspect ratio and label association", () => {
    const aspectRatioHtml = renderToString(
      createElement(AspectRatio, { ratio: 16 / 9, "aria-label": "Preview" }),
    );
    const labelHtml = renderToString(createElement(Label, { htmlFor: "frequency" }, "Frequency"));

    expect(aspectRatioHtml).toContain('data-slot="aspect-ratio"');
    expect(aspectRatioHtml).toContain("--ratio:1.7777777777777777");
    expect(labelHtml).toContain('for="frequency"');
    expect(labelHtml).not.toContain("font-mono");
  });

  test("slider range SSR preserves two named inputs and per-thumb accessible text", () => {
    const sliderHtml = renderToString(
      createElement(Slider, {
        defaultValue: [20, 80],
        getAriaLabel: (index) => (index === 0 ? "Minimum density" : "Maximum density"),
        getAriaValueText: (_formattedValue, value, index) =>
          `${index === 0 ? "Minimum" : "Maximum"}: ${value}%`,
        name: "density",
      }),
    );

    expect(sliderHtml.match(/<input[^>]+type="range"/g)).toHaveLength(2);
    expect(sliderHtml.match(/name="density"/g)).toHaveLength(2);
    expect(sliderHtml).toContain('aria-label="Minimum density"');
    expect(sliderHtml).toContain('aria-label="Maximum density"');
    expect(sliderHtml).toContain('aria-valuetext="Minimum: 20%"');
    expect(sliderHtml).toContain('aria-valuetext="Maximum: 80%"');
  });

  test("separator defaults to decorative and exposes semantic opt-in", () => {
    const decorativeHtml = renderToString(createElement(Separator));
    const semanticHtml = renderToString(createElement(Separator, { decorative: false }));

    expect(decorativeHtml).toContain('role="none"');
    expect(decorativeHtml).not.toContain("aria-orientation");
    expect(semanticHtml).toContain('role="separator"');
  });

  test("tabs forward vertical orientation to Base Root", () => {
    const tabsHtml = renderToString(
      createElement(
        Tabs,
        { defaultValue: "one", orientation: "vertical" },
        createElement(
          TabsList,
          null,
          createElement(TabsTrigger, { value: "one" }, "One"),
          createElement(TabsTrigger, { value: "two" }, "Two"),
        ),
        createElement(TabsContent, { value: "one" }, "Panel one"),
        createElement(TabsContent, { value: "two" }, "Panel two"),
      ),
    );

    expect(tabsHtml).toContain('data-orientation="vertical"');
    expect(tabsHtml).toContain('aria-orientation="vertical"');
  });

  test("progress retains KKB thickness, colors, and Base anatomy", () => {
    const progressHtml = renderToString(createElement(Progress, { value: 64 }));

    expect(progressHtml).toContain('data-slot="progress"');
    expect(progressHtml).toContain('data-slot="progress-track"');
    expect(progressHtml).toContain('data-slot="progress-indicator"');
    expect(progressHtml).toContain("h-2");
    expect(progressHtml).toContain("bg-primary/20");
    expect(progressHtml).not.toContain("h-1.5");
  });

  test("toggle variants use Base pressed state from the shared source", () => {
    const classes = toggleVariants();

    expect(classes).toContain("data-pressed:bg-accent");
    expect(classes).not.toContain("data-[state=on]");
  });

  test("owned primitives contain no direct Radix contracts", async () => {
    const names = [
      "accordion",
      "alert-dialog",
      "aspect-ratio",
      "avatar",
      "badge",
      "breadcrumb",
      "button-group",
      "button",
      "checkbox",
      "collapsible",
      "context-menu",
      "dialog",
      "direction",
      "dropdown-menu",
      "form",
      "hover-card",
      "item",
      "label",
      "menubar",
      "navigation-menu",
      "popover",
      "progress",
      "radio-group",
      "scroll-area",
      "select",
      "separator",
      "sheet",
      "sidebar",
      "slider",
      "switch",
      "tabs",
      "toggle-group",
      "toggle",
      "toggle-variants",
      "tooltip",
    ];

    const sources = await Promise.all(
      names.map((name) =>
        Bun.file(
          new URL(`../${name}.${name === "toggle-variants" ? "ts" : "tsx"}`, import.meta.url),
        ).text(),
      ),
    );

    for (const source of sources) {
      expect(source).not.toContain('from "radix-ui"');
      expect(source).not.toContain("@radix-ui/");
      expect(source).not.toContain("--radix-");
      expect(source).not.toContain("asChild");
    }

    const joinedSources = sources.join("\n");
    expect(joinedSources).toContain("@base-ui/react");
    expect(joinedSources).not.toContain("PopoverAnchor");
    expect(sources[names.indexOf("navigation-menu")]).toContain(
      'data-slot="navigation-menu-viewport"',
    );
    expect(sources[names.indexOf("toggle-variants")]).toContain("data-pressed");
    expect(sources[names.indexOf("toggle")]).toContain('from "./toggle-variants"');
    expect(sources[names.indexOf("toggle-group")]).toContain('from "./toggle-variants"');
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
