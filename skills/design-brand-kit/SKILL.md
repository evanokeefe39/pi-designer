---
name: design-brand-kit
description: Craft a structured AI prompt to generate a brand-kit IMAGE — logo, colours, typography, and graphic elements arranged in a bento-grid layout. Produces an AI image, not a brand guidelines document.
---

# Design Brand Kit

Use this skill when the user wants a **brand-kit image** — a single AI-generated
image that shows multiple brand elements (logo, colour palette, typography
specimens, icons, patterns) arranged in a bento-grid layout.

> **What this is not:** this generates an *AI image* of a brand kit on a
> board, not a structured brand-guidelines document. For token sets and
> exportable specs use `design-system`; for brand values and voice use
> `design-brand-voice`.

## Workflow

### 1. Gather the brief

Ask for:
- **Brand name**
- **Core colours** (primary, accent)
- **Typography** (heading and body fonts if chosen, or leave as suggestion)
- **Elements to include** (logo, colour swatches, type specimens, icon set,
  pattern, mood image)

### 2. Read the relevant references

- `knowledge/aesthetics.md` → Bento Grid — review the layout traits.
- `knowledge/resources.md` → AI Generation section — recommend a tool.

### 3. Write the prompt

Use this structure:

> Brand kit board for [brand]. Bento-grid layout with [N] panels:
> panel 1: logo, panel 2: colour palette [hexes], panel 3: typography
> specimens [font names], panel 4: [other element]. Style: clean,
> organised, presentation-ready. Colours: [palette]. No text on panels
> unless specified.

### 4. Generate and iterate

Generate and show the user. If the layout is off, adjust: specify the
grid dimensions ("3×2 grid"), or simplify to fewer elements.

## Example prompt

> Brand kit board for "Terra". 2×2 bento-grid layout: panel 1 — leaf
> logo mark; panel 2 — colour palette (#2d6a4f, #52b788, #d8f3dc);
> panel 3 — typography specimens (Fraunces headings, Inter body);
> panel 4 — botanical pattern swatch. Clean, organised, presentation-ready.
> Earthy greens, warm neutrals.

## Related

- `design-logo` — logo-only prompt (simpler, single output).
- `design-style-recreate` — apply an aesthetic to brand visuals.
- `knowledge/aesthetics.md` → Bento Grid.
