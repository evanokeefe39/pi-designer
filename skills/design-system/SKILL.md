---
name: design-system
description: Build complete, multi-medium design systems (color ramps, type/spacing scales, and per-target token exports for websites, reports, social carousels, and email newsletters) using the pi-designer tools.
---

# Design System

Use this skill when the user wants to create or extend a visual design system, generate a color palette, build design tokens, or produce styling for a website, report/PDF, social media carousel, or email newsletter.

**Upstream handoff:** this skill consumes a brief. If the user doesn't have
a complete brief yet (no brand color, no fonts, no direction), run
`design-research` first to gather inspiration and produce one. When the
user arrives with a finished brief, start here directly.

## Division of labor

You make the creative decisions. The pi-designer tools do the deterministic math and serialization. Do not hand-write hex ramps or CSS — call the tools.

## Workflow

1. **Get a brief.** You need at minimum a `name` and a primary `brand`
   color (hex). The brief may come from `design-research` (a JSON shape)
   or from the user directly. If the user describes a mood instead of a
   color ("calm, trustworthy, fintech") and no research phase was run,
   pick a fitting hex yourself and state your choice. Ask for `accent`,
   target mediums, and brand fonts if not given.

2. **Build tokens.** Call `build_design_system` with the brief. It returns the full token set as JSON (colors, typography, spacing, radii, shadows). Show the user the palette and key choices.

3. **Check accessibility.** Verify the palette is usable before exporting.
   For text-on-surface pairs, contrast should hit ≥4.5:1 (AA body) / ≥3:1
   (AA large text / UI components). Safe pairs: brand-700+ on neutral-50, or
   neutral-50 on brand-600+. If a pair fails, suggest a darker/lighter ramp
   stop rather than shipping an inaccessible combination. (Full cross-layer
   a11y — focus, semantics, motion — is the `design-accessibility` skill.)

4. **Export.** Call `export_design_system` with the returned JSON (as a string) and the chosen `targets` (`website`, `report`, `carousel`, `email`, or `["all"]`). Files are written under `outDir` (default `design-system/`).

## Tool reference

- `generate_palette { color, neutral? }` — one OKLCH ramp (50–950). Use for exploration or to preview a single color.
- `generate_scale { kind: "type" | "spacing", ratio?, baseStepPx? }` — a single modular scale.
- `build_design_system { name, brand, accent?, neutralTint?, typeRatio?, fontHeading?, fontBody? }` — the full set. Prefer this over assembling ramps by hand.
- `export_design_system { tokens, targets, outDir? }` — write files. `tokens` is the JSON string from `build_design_system`.

## Medium notes

- **website** → CSS variables + Tailwind v4 `@theme`. Import `tokens.css` or paste the `@theme` block into your Tailwind entry CSS.
- **report** → print stylesheet (A4, point sizing, color-adjust). For PDFs.
- **carousel** → fixed canvases (1080×1350 etc.) with safe areas + an HTML slide template. One idea per slide; keep headlines ≤ 8 words.
- **email** → resolved px/hex values and a table-based template with inline styles only. Never use rem or CSS variables in email.

## Color guidance

Ramps are perceptually uniform (OKLCH). For accessible text: brand-700+ on neutral-50, or neutral-50 on brand-600+. Use neutral ramps for surfaces and text, brand/accent for emphasis.

## Related

- `design-research` — upstream inspiration → brief phase for this skill.
- `../../knowledge/resources.md` — curated design-tool catalog.
- `../../knowledge/aesthetics.md` — visual style directions.
- `../../knowledge/principles.md` — motion, brand framework, biases, tips.
- `../../knowledge/workflows.md` — reference recipes (mixed-media poster, Cybercore).
