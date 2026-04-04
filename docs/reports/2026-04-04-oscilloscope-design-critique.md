# Oscilloscope Design Critique

**Date:** 2026-04-04
**Page:** `/oscilloscope`
**Branch:** `feature/oscilloscope-v1`

---

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Good status badges; no canvas loading state during WebGPU init |
| 2 | Match System / Real World | 3 | Domain terms (Hz, bloom, trail) appropriate for audio audience |
| 3 | User Control and Freedom | 2 | No undo/reset for parameter changes; no way to return to defaults |
| 4 | Consistency and Standards | 3 | Highly consistent internally; almost monotonous |
| 5 | Error Prevention | 2 | Frequency inputs accept any number with no min/max bounds |
| 6 | Recognition Rather Than Recall | 3 | Controls always visible; preset names descriptive |
| 7 | Flexibility and Efficiency | 1 | No keyboard shortcuts, no custom preset saving, no shareable config |
| 8 | Aesthetic and Minimalist Design | 2 | Monospace-uppercase-badge pattern adds visual noise without adding info |
| 9 | Error Recovery | 3 | Mic and WebGPU errors are clear and specific |
| 10 | Help and Documentation | 1 | Minimal hint text ("Persistence.", "Glow."); no tooltips or explanations |
| **Total** | | **23/40** | **Acceptable** |

---

## Anti-Patterns Verdict

**Verdict: Borderline.** Trips several AI-slop tells, but some are defensible given the oscilloscope context.

**Tells found:**

1. **Emerald-on-dark with glowing accents** — `shadow-[0_0_80px_rgba(16,185,129,0.08)]`, emerald radial gradient background, `bg-emerald-400/10` badges. Close cousin of the cyan-on-dark AI palette.
2. **Glassmorphism everywhere** — `backdrop-blur-sm`, `bg-black/30`, semi-transparent cards with `border-white/10`. Every surface uses the frosted glass treatment.
3. **Monospace typography as lazy "technical" shorthand** — Every label, title, badge, and control uses monospace uppercase with wide tracking. Reads as "I want this to look techy" rather than an intentional typographic decision.
4. **Same card pattern repeated** — Source, Preset, Signal, Visual cards are visually identical containers.

**What's defensible:** The green trace on black canvas genuinely mimics real phosphor oscilloscopes — functional, not decorative. Dark backgrounds make sense for visualization tools. The domain is legitimately technical.

**The test:** If you showed this to someone and said "AI made a WebGPU oscilloscope demo," they'd say "yeah, looks like it." The monospace + emerald + glass combination is the giveaway.

---

## Overall Impression

The oscilloscope canvas itself is genuinely impressive — real-time WebGPU Lissajous rendering with bloom and trail is substantive engineering. But the UI chrome wrapping it looks like a template. Every surface uses the same visual treatment (dark glass card + monospace uppercase + emerald accent), which flattens hierarchy and makes the interface feel generic despite the unique content inside it.

**Biggest opportunity:** Let the canvas breathe. The visualization is the product — the surrounding UI should recede, not compete with identical visual weight everywhere.

---

## What's Working

1. **Progressive disclosure in controls** — Signal card correctly appears only in oscillator mode and hides for mic. Conditional UI reduces cognitive load without hiding functionality behind menus.

2. **Status communication** — The stage status system (`compact` vs `alert`) elegantly handles multiple states (checking, requesting, error, active) without layout shifts. Mic error messages are specific and non-blaming.

3. **Responsive layout** — The `xl:grid-cols-[minmax(0,1fr)_22rem]` breakpoint stacks cleanly on mobile. The canvas maintains its 1:1 aspect ratio. Controls become a natural vertical scroll below the stage.

---

## Priority Issues

### [P2] Typographic Monotony — Everything Screams "Technical" at the Same Volume

**What:** Every text element uses `font-mono uppercase tracking-[0.14em-0.24em]` — page title, card titles, badges, labels, hints. There's no typographic hierarchy beyond size.

**Why it matters:** When everything is monospace uppercase, nothing stands out. Labels like "TRAIL" and "BLOOM" have the same visual weight as the page title "OSCILLOSCOPE" and status badges "WEBGPU." Users can't scan — they must read linearly.

**Fix:** Reserve monospace uppercase for metadata badges and data values (Hz readouts, slider values). Use a proportional font for card titles, labels, and body text. Create 3 clear tiers: page title > section labels > control labels/hints.

**Suggested command:** `/typeset`

### [P2] One-Note Color Palette — Emerald Everywhere

**What:** The entire interface exists on a single color axis: black -> dark emerald -> emerald -> white. Backgrounds, accents, badges, canvas glow, status indicators — all emerald.

**Why it matters:** With only one hue, color can't communicate. The WebGPU badge, the compact status bar, and the canvas border all use emerald green, but they mean different things. There's no color-based wayfinding or visual anchoring.

**Fix:** Keep emerald for the canvas and its immediate chrome (functionally motivated — phosphor green). Introduce a neutral or warm secondary for the UI chrome. Let the controls panel use a different tonal range so the canvas stands out as the focal point.

**Suggested command:** `/colorize`

### [P2] Visual Noise from Uniform Glass Cards

**What:** Every card uses `border-white/10 bg-black/20 backdrop-blur-sm` with identical padding, header borders, and structure. The stage card and each control card look like siblings.

**Why it matters:** The stage (the actual product) should dominate the visual hierarchy. Instead, it's one glass card among five glass cards. The controls sidebar has nearly as much visual presence as the visualization itself.

**Fix:** Differentiate the stage from controls. The stage card could lose its card chrome entirely — let the canvas sit more directly in the page. Controls could use lighter, flatter containers (or even just spacing/dividers) instead of full bordered cards.

**Suggested command:** `/distill`

### [P2] No Power-User Affordances

**What:** No keyboard shortcuts for source switching, preset cycling, or parameter adjustment. No way to save custom parameter combinations. No URL-encoded state for sharing configurations.

**Why it matters:** The primary audience (dev/design collaborators per .impeccable.md) will want to quickly compare presets, fine-tune parameters, and share interesting configurations. Currently every interaction requires precise mouse targeting.

**Fix:** Add keyboard shortcuts (1-4 for presets, Tab to cycle source, arrow keys on focused sliders). Encode config in URL hash so configurations are shareable/bookmarkable. Consider a "reset to preset" button.

**Suggested command:** `/delight`

### [P3] Hint Text Is Too Terse to Help

**What:** Control hints are single-word labels: "Persistence.", "Glow.", "X axis, Hz.", "Live analyser input." The stage description is "XY view."

**Why it matters:** A first-time visitor won't know what "Trail" persistence means visually, or why Bloom matters, or what the relationship between Oscillator A/B frequencies and the visual pattern is. The hints confirm the label but don't explain the control.

**Fix:** Expand hints to one sentence that describes the visual effect: "How long the trace lingers on screen" instead of "Persistence." Add a brief sentence to the page subtitle explaining what Lissajous patterns are and how the controls shape them.

**Suggested command:** `/clarify`

---

## Cognitive Load Assessment

Ran the 8-item checklist:

- [x] Single focus — canvas dominates
- [x] Chunking — controls in groups of 1-2
- [x] Grouping — related controls co-located in cards
- [ ] Visual hierarchy — badges, labels, and titles compete at similar weights
- [x] One thing at a time
- [x] Minimal choices — max 4 presets, 2 sources
- [x] Working memory — no cross-screen recall needed
- [x] Progressive disclosure — signal controls conditional on source

**1 failure = Low cognitive load (good).** The hierarchy issue is real but manageable.

---

## Persona Red Flags

### Alex (Power User)

- No keyboard shortcuts for any control. Must click toggle buttons, open select dropdown, drag sliders.
- No way to save or bookmark a parameter configuration — if Alex finds an interesting frequency ratio, they can't preserve it.
- Frequency inputs are `type="number"` without up/down keyboard step behavior tuned to useful increments.
- No "reset to preset defaults" button after manual adjustments.

### Jordan (First-Timer)

- "XY view" means nothing without context. No explanation of Lissajous patterns.
- "Bloom" and "Trail" labels are vague — "Persistence." and "Glow." hints don't clarify.
- Oscillator A/B frequency relationship to the visual pattern is unexplained. Jordan won't know why changing 220 to 110 makes the pattern different.
- No visible help link or explanation section.

### Dev/Design Collaborator (Project-Specific)

- **Profile:** Internal team member evaluating the oscilloscope component for quality and reuse potential.
- **Behaviors:** Inspects the component to understand capabilities, tests parameter ranges, evaluates visual fidelity and polish.
- **Red flags:** The uniform glass-card UI makes the oscilloscope feel like a prototype demo rather than a polished showcase. No component documentation, no API surface visibility. Can't easily tell which parts come from `@kkb/audio` vs the web app. The interface doesn't communicate "this is a reusable, high-quality component" — it communicates "this is a dark-mode demo page."

---

## Minor Observations

- **Stage card "XY view." description** is redundant with the "XY" badge. One should be removed.
- **Fallback `<select>` element** (`aria-hidden="true" hidden`) — good practice for form semantics but the `name="oscilloscopePreset"` suggests form submission support that doesn't exist.
- **Mobile layout** works well structurally but the canvas becomes small enough that fine Lissajous details are hard to see. No pinch-to-zoom or fullscreen option.
- **No favicon or meta title** specific to the oscilloscope page for tab identification.
- **Slider value badges** (Trail: `64`, Bloom: `0.75`) are useful but their `variant="outline"` styling matches other structural badges, blurring the distinction between metadata and live values.

---

## Action Plan

User choices: **visual hierarchy first**, **studio-minimal tone** (Ableton/Logic Pro direction), **all issues**.

### Execution Order

1. **`/distill`** — Strip glass-card chrome from the stage. Let the canvas sit more directly in the page. Flatten controls sidebar (spacing/dividers instead of bordered cards). Remove redundant "XY" badge since description already says "XY view."

2. **`/typeset`** — Break monospace-uppercase monotony. Reserve monospace for data values (Hz readouts, slider numbers, badges). Use proportional font for card titles, labels, and hint text. Create 3 clear typographic tiers: page title > section headers > control labels/hints.

3. **`/colorize`** — Shift UI chrome to neutral grays (studio-minimal). Keep emerald exclusively for the canvas and its immediate border. Slider value badges, status indicators, and card borders should use neutral tones so the visualization is the only source of color.

4. **`/clarify`** — Expand terse hint text: "Persistence." becomes "How long the trace lingers." Add one-sentence Lissajous explanation to subtitle. Make Oscillator A/B labels indicate axis mapping more clearly.

5. **`/delight`** — Add keyboard shortcuts (1-4 for presets, arrow keys on sliders), "Reset" button per control card, URL hash encoding for shareable configs.

6. **`/polish`** — Final pass: remove redundant stage description vs badge, differentiate live-value badges from structural badges, verify mobile canvas sizing.
