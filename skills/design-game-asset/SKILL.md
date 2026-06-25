---
name: design-game-asset
description: Generate a consistent set of game characters and environment backgrounds using AI flow artboards — base character, states, remixes, and world variants.
---

# Design Game Asset

Use this skill when the user wants to **generate a consistent set of game
assets** — characters with multiple states (baby, grown, withered),
character variants in the same style, and environment backgrounds with
different world states (day, rainy, night).

## Workflow

### 1. Gather the brief

Ask for:
- **Character concept** (human, creature, robot, etc.) and base description
- **States needed** (e.g. idle, walking, damaged, evolved, baby → adult)
- **World / environment** (forest, city, desert, dungeon, abstract)
- **World states** (day, night, rainy, snowy, magic, ruined)
- **Style** (pixel art, 2D illustration, 3D rendered, hand-drawn, flat)
- **Colour palette** if known

### 2. Read the relevant references

- `../../knowledge/resources.md` → AI Generation section — recommend a tool
  (Modyfi for flow artboards, Midjourney for high-consistency characters,
  Krea for style transfer).
- `../../knowledge/resources.md` → Game UI & Game Development section — GameUI
  Database for UI reference.

### 3. Generate the base

Generate the base character. Use a tool with a flow/workflow mode (Modyfi)
if available, so each state connects to the same source. If not, manually
keep the base character as a reference for each subsequent generation.

### 4. Generate character states

For each state, prompt with the base character description + the specific
state modifier. Keep as much of the prompt identical as possible
(character features, style, colour palette) — only change the state,
age, or condition.

> [base character], [state modifier]. Same style, same colours, same
> [character details]. No background or transparent background.

### 5. Remix for variant characters

Change one or two defining traits (colour, accessory, size) while keeping
the core prompt structure identical. This creates a varied cast that still
reads as a consistent family.

### 6. Generate world states

For each environment variant, prompt with the same scene description
and only change the lighting/time-of-day/weather modifier.

> [scene description]. [world state modifier]. Same perspective, same
> composition. [Style keywords].

### 7. Deliver

Present the asset set with a note on what changed between variants and
suggestions for export format (PNG with transparency for characters,
JPEG or PNG for backgrounds).

## Related

- `../../knowledge/resources.md` → Game UI & Game Development.
- `../../knowledge/aesthetics.md` — for pixel art or other game-appropriate
  aesthetic references.
