---
name: design-research
description: Research phase for design-system projects — gather archival visual inspiration, surface aesthetic directions, and produce a brand brief for the design-system skill.
---

# Design Research

Use this skill when the user wants to **find a visual direction** for a
project but hasn't pinned down a brief yet — they describe a mood, a
product, an audience, or just "I need a look."

Do NOT use this if the user already arrives with a complete brief (hex,
fonts, targets) — skip straight to `design-system`.

## Workflow

### 1. Understand the project

Ask enough to know the **domain** (web app, landing page, social, print,
report, game UI), the **audience** (enterprise, consumer, creative), and
any **mood keywords** ("calm," "loud," "premium," "playful"). If the user
already has a brand colour or aesthetic in mind, note it.

### 2. Run the archival inspiration protocol

For deeper visual research, run this 3-site loop to gather references:

1. <https://publicdomainreview.org> — find old art, strange symbols,
   forgotten visuals. Note colours, textures, and details for prompt
   language.
2. <https://archive.org> — study layout, type, and print texture from
   scans of old books, posters, and magazines.
3. <https://www.magnumphotos.com> — study how photographers frame light
   and composition; helps AI visuals feel less synthetic.

Synthesise what you found into 2–3 visual directions for the user.

### 3. Surface aesthetic directions

Read `../../knowledge/aesthetics.md` and consider what fits the audience and
mood. Present 1–3 candidates with a sentence on why each fits. If the
user named a specific aesthetic ("I want Brutalist"), just read its
traits and apply them.

### 4. Point to relevant tools

From `../../knowledge/resources.md`: palette tools (Khroma, Coolors),
moodboarding (Pinterest, Milanote), typography (Google Fonts, Fonts In
Use), UI references (Mobbin, Dribbble), stock/archives (Unsplash,
Archives.design).

### 5. Apply relevant principles

From `../../knowledge/principles.md`: motion principles, 5-layer brand
framework, cognitive biases, atomic tips that apply to the task.

### 6. Produce the brief

Write a brief in the JSON shape `build_design_system` expects:

```json
{
  "name": "ProjectName",
  "brand": "#hex",
  "accent": "#hex",
  "neutralTint": "#hex",
  "typeRatio": 1.25,
  "fontHeading": "FontName, system-ui, sans-serif",
  "fontBody": "FontName, system-ui, sans-serif"
}
```

State your creative choices briefly: "I chose #2563eb (blue) for trust,
accent #f59e0b (amber) for warmth, Inter for body, Outfit for headings."

**Alternate brief source — match an existing brand:** if the user wants to
align with a known brand, pull specs from <https://getdesign.md> (a
DESIGN.md file with the brand's palette, typography, form elements, and
spacing). Read the palette + fonts from it and translate them into the
brief above. The DESIGN.md can also be dropped into the project root for
AI-assisted UI generation.

### 7. Hand off to `design-system`

> "Here's the brief. Handing off to design-system for tokens and export."

The user can modify the brief before the handoff.

## Related

- `design-system` — consumes the brief, generates tokens, exports files.
- `../../knowledge/resources.md`, `../../knowledge/aesthetics.md`, `../../knowledge/principles.md`, `../../knowledge/workflows.md`.
