---
name: design-style-recreate
description: Pick an existing graphic design style or aesthetic and recreate it via a structured AI prompt using known traits.
---

# Design Style Recreate

Use this skill when the user wants to **recreate a specific design
aesthetic** via AI image generation — Swiss Editorial, Brutalist Billboard,
Cybercore, Bento Grid, Mixed Media, or any style documented in
`knowledge/aesthetics.md`.

## Workflow

### 1. Identify the target style

Ask the user which aesthetic they want to recreate, or if they're unsure,
use `design-research` to find one that fits their project.

### 2. Read the style's traits

Open `knowledge/aesthetics.md` and read the entry for the chosen style.
Note the **key traits**: typography, layout rules, colour palette,
composition patterns, texture/effect signals.

### 3. Write the prompt

Build the prompt by converting the traits into descriptive language:

> An image in the [style name] style. [trait 1], [trait 2], [trait 3].
> Colours: [palette from style]. [specific subject or composition].

For example, for Brutalist Billboard:

> A poster in the Brutalist Billboard style. Oversized, heavy monospaced
> typography as the main visual. Stark black-and-white contrast. Raw,
> unadorned layout with exposed grid structure. No decorative elements.
> The word "DISRUPT" fills 80% of the canvas.

### 4. Generate and iterate

Generate with a recommended AI tool from `knowledge/resources.md`. Compare
the output against the style's traits and refine: adjust the prompt to
emphasise missed traits or reduce unwanted ones.

### 5. Offer the next step

If the result is intended for a brand or project, ask if they want to move
to `design-system` to build tokens from the chosen direction. Otherwise,
export the image asset and done.

## Example prompts by style

**Swiss Editorial:** "A magazine spread in Swiss Editorial style. Strict
grid layout, generous white space, asymmetrical composition. Sans-serif
typography (Akzidenz Grotesk style). Minimal colour: black text on white,
with a single red accent. Photography occupies the right two-thirds."

**Cybercore:** "A web page in Cybercore style. Dark background (#0a0a0a),
cyan (#00fff5) and magenta (#ff00ff) accents. Monospaced terminal font.
Glitch effects on the hero text. Scanline overlay across the whole image.
CRT screen vignette. Retro-futuristic hacker aesthetic."

**Bento Grid:** "A brand dashboard in Bento Grid style. Rectangular cards
of varying sizes in a 3×3 grid layout. Each card has rounded corners, a
subtle shadow, and contains one content type. Clean, organised, minimalist.
Japanese bento-box inspired composition."

## Related

- `design-research` — if the user hasn't chosen a style yet.
- `knowledge/aesthetics.md` — the full style reference.
- `knowledge/principles.md` — design concepts that may apply (halftone,
  dithering, ink bleed for the Mixed Media style).
