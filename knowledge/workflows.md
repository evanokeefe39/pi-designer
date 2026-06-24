# Design workflows

> Reference recipes extracted from design/UI-UX social posts (~28 posts
> analysed as of 2026-06-24). These are *adaptable recipes* — tool-specific
> processes that don't generalise to their own skill. Every command-shaped
> workflow (`design-logo`, `design-brand-kit`, `design-product-render`,
> `design-mockup`, `design-storyboard`, `design-style-recreate`,
> `design-game-asset`, `design-system-specs`) has been promoted to its own
> skill under `skills/`.

---

## Mixed-media poster in Photoshop

*Recreate a layered, print-textured poster with ink bleed, masking tape, and
cutout elements.*

1. Set up a 16×20 in, 300 dpi, 16-bit Photoshop document.
2. Add paper and print textures using Screen, Soft Light, or Overlay blend modes.
3. Merge layers and apply a print plugin (PrintMachine) for the scanned/print look.
4. Re-apply the effect to the original layer, enable ink bleed, merge.
5. Place masking-tape PNGs over the composition, merge them to a single layer, clip the ink-bleed layer to the tape.
6. Duplicate the tape layer, move it above the bleed, adjust opacity and blend mode, add a drop shadow.
7. Place cutout images on a white-background layer, apply the same print effect.
8. Mask the cutouts, apply Bevel & Emboss and Drop Shadow layer styles.
9. Use the Rectangular Marquee tool to select and lift parts of the main image to new layers.
10. Use Edit > Transform > Warp to curl cutouts; apply layer styles.
11. Add a Levels adjustment layer to bring up black values.

**Key tools:** Photoshop, PrintMachine.
**Tips:** work in 16-bit; rename layers consistently (`DIGITAL PRINT`, `INK FADE`) to keep track.

---

## Cybercore aesthetic in Framer

*Build a web page with early-internet / hacker / retro-futurist visual language.*

1. Create a grid layout for content items (CDs, products, cards).
2. Apply a *dithered scan effect* to images that resolves clean on hover.
3. Implement interactive ASCII art components (ripples, break on cursor interaction).
4. Use monospaced fonts and high-contrast, terminal-inspired palettes (cyan/magenta/lime on dark).
5. Add subtle motion: scanlines, flicker, chromatic aberration.

**Key tools:** Framer.
**Reference style:** Cybercore (see `aesthetics.md`).

---

## See also

- For the curated tool catalog, see `resources.md`.
- For aesthetic style reference, see `aesthetics.md`.
- For design principles and concepts, see `principles.md`.
- For AI prompt-based asset generation skills: `design-logo`, `design-brand-kit`,
  `design-product-render`, `design-mockup`, `design-storyboard`, `design-style-recreate`.
- For game development assets: `design-game-asset`.
- For design system research: `design-system-specs`.
- For the full research → brief → token pipeline: `design-research` → `design-system`.
