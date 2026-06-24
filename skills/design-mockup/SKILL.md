---
name: design-mockup
description: Craft a structured AI prompt to generate a device-framed website or app mockup from a description of the page layout.
---

# Design Mockup

Use this skill when the user wants a **website or app UI mockup** generated
via AI — for landing pages, dashboards, app screens, or feature showcases.
The mockup should be presented in a realistic device frame (browser, phone,
tablet) with no browser UI elements.

## Workflow

### 1. Gather the brief

Ask for:
- **Page type** (landing page, dashboard, product page, app screen, sign-up)
- **Layout sections** (hero, features, pricing, testimonials, grid, sidebar)
- **Colour palette** if known (or suggest based on mood)
- **Device** (desktop browser, mobile, tablet)
- **Mood / style** (clean, bold, dark, playful, corporate)

Read `knowledge/aesthetics.md` if they need help picking a visual style.

### 2. Read the relevant references

- `knowledge/resources.md` → AI Generation section — recommend a tool.
- `knowledge/aesthetics.md` — if they named or need an aesthetic.

### 3. Write the prompt

Use this structure:

> Website mockup of a [page type] for [project/topic]. Layout: [sections
> described]. Style: [aesthetic/mood]. Colours: [palette]. Device frame:
> [browser/mobile] only, no browser UI, no toolbar, clean device frame
> around the content. Photorealistic mockup presentation.

### 4. Generate and iterate

Generate and show the user. Common refinements: switch device type, adjust
the hero section layout, add specific UI elements (search bar, CTA button,
card grid), or change the colour scheme.

## Example prompt

> Website mockup of a landing page for a project management tool called
> "Flow." Layout: centred hero with headline + subtext + CTA button,
> below a 3-column feature grid with icons. Style: clean, modern,
> corporate-friendly. Colours: deep indigo (#1e1b4b), white, warm
> amber (#f59e0b). Desktop browser frame only, no browser UI, no toolbar,
> clean device frame. Photorealistic mockup presentation.

## Related

- `design-style-recreate` — apply a specific aesthetic to the mockup.
- `knowledge/resources.md` → Archives & Visual Inspiration — Mobbin,
  Dribbble for UI reference.
