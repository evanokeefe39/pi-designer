---
name: design-carousel
description: Produce a filled social carousel (slides + copy + brand visuals) from the design system — a Layer 4 deliverable. Depends on L1/L2 for clean composition; v1 inlines token values.
---

# Design Carousel

Use this skill when the user wants to **produce a finished social carousel**
from their design system — after `design-system` has exported the carousel
template (`carousel.json` + `slide-template.html`). A carousel is a sequence
of fixed-canvas slides, one idea per slide, with brand copy and visuals.

This is a Layer 4 deliverable. In its ideal form it composes L1 components
and L2 patterns; the intermediate v1 (this version) inlines token values
directly — functional, but the component composition upgrade is tracked in
`ISSUES.md`.

## Workflow

### 1. Get the brief

Ask the user:

- **Topic / campaign** — what's the carousel about?
- **Audience** — who's reading it?
- **Number of slides** — typically 4–10. Fewer is better.
- **Key message per slide** — one idea per slide, in order.
- **Call to action** — what should the viewer do after slide N?

If `design-brand-voice` has been run, read `brand-voice.md` for the copy
tone and content rules (headline max, CTA style, emoji policy).

### 2. Read the design system

From the exported carousel template directory (default `design-system/`):

- `carousel.json` — canvas sizes and safe areas per platform:
  ```json
  {
    "instagram-story": { "width": 1080, "height": 1920, "safeArea": { "top": 200, "bottom": 200, "left": 80, "right": 80 } },
    "instagram-post":  { "width": 1080, "height": 1080, "safeArea": { ... } },
    "linkedin":        { "width": 1200, "height": 627,  "safeArea": { ... } }
  }
  ```
- `slide-template.html` — the empty slide shell with canvas dimensions, safe
  areas, and token references.

If the carousel export doesn't exist, ask the user to run `design-system`
with `targets: ["carousel"]` first.

Also read `tokens.css` (or the equivalent) for the token values to inline.

### 3. Compose each slide

For each slide, produce a self-contained HTML block. The slide sits inside
the fixed canvas from the template with safe-area padding. Structure:

```
┌─────────────────────────────┐
│  safe-area top              │
│                             │
│  EYEBROW / slide number     │
│  HEADLINE (≤ 8 words)       │
│  subtext / stat / quote     │
│                             │
│  [visual — icon or graphic] │
│                             │
│  CTA (on last slide only)   │
│                             │
│  safe-area bottom           │
└─────────────────────────────┘
```

**Slide types:**

| Type | When to use | Contains |
|------|------------|----------|
| **Title** | Slide 1 | Campaign name + one-line hook + brand mark |
| **Stat** | Data point | Big number + short label + source |
| **Quote** | Testimonial | Quote + attribution + role |
| **Feature** | Product feature | Icon + feature name + one-line benefit |
| **How-to** | Step in a process | Step number + instruction + icon |
| **CTA** | Last slide | Recap + action button + handle/URL |

**Slide rules:**
- One idea per slide. If you can't say it in one sentence, split it.
- Headline ≤ 8 words. The viewer's thumb is already moving.
- Body text ≤ 30 words per slide.
- Brand voice for all copy — read `brand-voice.md` if it exists.
- Every slide uses token variables for colours, type, and spacing.
- Visuals: use brand-colour blocks, large icons, or solid backgrounds if
  no image assets exist.

### 4. Copy reference (brand voice)

If `brand-voice.md` exists, follow its content rules. If not, default to:
- Second person ("you"), sentence case, action-verb CTAs.
- One CTA, on the last slide only.
- Emoji in moderation — one per slide max, only if the brand permits.

### 5. Output

Write the filled carousel as `carousel.html` — a single file with all
slides, each inside its platform canvas. Structure:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>[Campaign] — Carousel</title>
  <link rel="stylesheet" href="tokens.css">
  <style>
    /* slide containers, safe areas, typography using token variables */
  </style>
</head>
<body>
  <!-- Slide 1: Instagram Story -->
  <div class="slide" style="width:1080px;height:1920px;">
    <div class="safe-area">
      <!-- slide content -->
    </div>
  </div>
  <!-- Slide 2 ... -->
</body>
</html>
```

If L1 components and L2 patterns exist, import them instead of duplicating
markup — the `design-carousel` upgrade path is tracked in `ISSUES.md`.

### 6. Hand off

> "Carousel ready at `carousel.html` — N slides, [platform]. Ready for
> screenshot or social scheduling."

## Depends on

- `design-system` — for the carousel template and tokens (required).
- `design-brand-voice` — for copy tone (optional, defaults applied).
- `design-components`, `design-patterns` — for clean composition (v1 inlines; upgrade tracked in `ISSUES.md`).

## Related

- `design-email`, `design-report` — sibling L4 deliverable skills.
- `design-accessibility` — check contrast on carousel slides.
- `knowledge/aesthetics.md` — visual style for slide backgrounds/graphics.
