---
name: design-product-render
description: Craft a structured AI prompt to turn a product sketch or concept into a photorealistic render with specified materials, lighting, and colours.
---

# Design Product Render

Use this skill when the user wants a **photorealistic product render** from
a rough sketch, wireframe, or concept description — for mockups,
presentations, or e-commerce visuals.

## Workflow

### 1. Gather the brief

Ask for:
- **Product description** (what it is: bottle, device, furniture, etc.)
- **Material** (glass, matte plastic, brushed metal, leather, etc.)
- **Accent colours** if specified
- **Lighting** (studio, soft, dramatic, natural, backlit)
- **Angle / perspective** (hero shot, top-down, ¾ view)
- **Background** (solid, gradient, contextual scene, transparent)
- **Sketch reference** if available (user describes or provides it)

### 2. Read the relevant references

- `knowledge/resources.md` → AI Generation section — recommend a tool
  (Midjourney for high fidelity, Gemini for fast iteration, Krea for
  style transfer from sketch).

### 3. Write the prompt

Use this structure:

> Photorealistic product render of a [product description]. Material:
> [material]. Colour: [accent]. Lighting: [style]. Angle: [perspective].
> Background: [background]. [Add texture or surface details]. Product
> photography style, sharp focus, no text or labels.

### 4. Generate and iterate

Generate and show the user. Refine by adjusting: material specularity,
lighting intensity, background depth, or adding environmental context.

## Example prompt

> Photorealistic product render of a matte black ceramic coffee cup with
> a warm terracotta interior glaze. Lighting: soft studio lighting from
> the left, subtle rim light. Angle: ¾ view slightly above. Background:
> warm beige gradient. Ceramic texture visible, smooth surface, product
> photography style, sharp focus, no text.

## Related

- `design-mockup` — for website/app UI mockups (different domain).
- `knowledge/aesthetics.md` — mood/style direction for the product context.
