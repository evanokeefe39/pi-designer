---
name: design-storyboard
description: Craft a structured AI prompt to generate a commercial storyboard as a 3×3 grid of sequential scenes.
---

# Design Storyboard

Use this skill when the user wants a **storyboard** for a commercial, brand
video, product walkthrough, or narrative sequence — presented as a 3×3 grid
of consecutive scenes ready for presentation.

## Workflow

### 1. Gather the scene sequence

Ask the user to describe the narrative:
- **What's being communicated** (product launch, brand story, tutorial, ad)
- **Scene list** — describe each scene in order (3–9 scenes; 3×3 grid fits 9)
- **Visual style** (cinematic, flat illustration, 3D render, sketchy, moody)
- **Colour palette** if known

If they have fewer than 3 scenes, mention 3×3 can hold up to 9 and ask if
they want to expand. If they have more than 9, split into multiple boards.

### 2. Read the relevant references

- `knowledge/resources.md` → AI Generation section — recommend a tool.
- `knowledge/aesthetics.md` — if they named or need an aesthetic for the
  visual style of the frames.

### 3. Write the prompt

Use this structure:

> Storyboard for [project/video]. 3×3 grid layout, 9 panels reading left
> to right, top to bottom. Scenes: [1] [description], [2] [description],
> ... [9] [description]. Style: [visual style]. Colours: [palette].
> Consistent character style across all panels. Clean, professional
> storyboard layout, no text in panels, panel borders visible.

### 4. Generate and iterate

Generate and check: are all scenes present? Are characters/visuals
consistent across panels? Refine by clarifying scene specifics or adjusting
the style prompt.

## Example prompt

> Storyboard for a 30-second coffee brand commercial. 3×3 grid, 9 panels.
> Scenes: [1] Wide shot of a misty mountain coffee farm at dawn, [2] Close
> up of coffee cherries being hand-picked, [3] Farmer carrying basket
> through rows, [4] Medium shot of beans drying on a patio, [5] Roasting
> drum turning, steam rising, [6] Cupping table with steam and warm light,
> [7] Person pouring from a ceramic pour-over, [8] Steam swirling in
> morning light, [9] Final shot — cup on a wooden table, tagline space.
> Style: cinematic, warm tones, soft contrast. Colours: deep browns,
> warm amber, soft cream. Consistent cinematic style across all panels.
> Clean storyboard layout, no text.

## Related

- `knowledge/aesthetics.md` — visual style reference for the frames.
- `knowledge/principles.md` — motion principles if the storyboard has
  animation intent.
