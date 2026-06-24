---
name: design-logo
description: Craft a structured AI prompt to generate a styled logo for a brand, then generate and iterate.
---

# Design Logo

Use this skill when the user wants to **generate a logo via AI image
generation** — for a brand, project, or product — with a specific style,
industry, or aesthetic direction.

## Workflow

### 1. Gather the brief

Ask for:
- **Brand name**
- **Industry / niche** (fintech, gaming, creative studio, cafe, etc.)
- **Style keywords** (minimal, playful, premium, vintage, geometric, etc.)
- **Colour palette** if known (or pick one from mood)

### 2. Read the relevant references

- `knowledge/aesthetics.md` — look up the style if they named one.
- `knowledge/resources.md` → AI Generation section — recommend a tool
  (Midjourney, Gemini, Krea, Kittl).

### 3. Write the prompt

Use this structure:

> A logo for [brand], a [industry] company. Style: [style keywords].
> Colours: [palette]. [Composition: icon+text / lettermark / emblem].
> Clean background, high contrast, vector-style, no text artefacts.

### 4. Generate and iterate

Generate with the recommended AI tool, show the user, and refine. Offer
variant prompts (different style, different palette, different composition)
if the user wants options.

## Example prompt

> A logo for "Pulse", a fintech startup. Style: minimal, geometric, premium.
> Colours: deep navy (#1e293b) and electric blue (#3b82f6). Icon+text
> layout. Clean white background, sharp vector style, no text artefacts.

## Related

- `design-brand-kit` — multiple brand elements in one image.
- `knowledge/aesthetics.md` — for style traits.
- `knowledge/resources.md` — AI Generation section for tool recommendations.
