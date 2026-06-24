# Design principles & concepts

> Reusable rules, concepts, and tips extracted from design/UI-UX social posts
> (~28 posts analysed as of 2026-06-24). Use this doc when the user asks about
> design theory, motion rules, brand system structure, cognitive biases in UX,
> or needs a quick tip reference.

---

## Motion principles

Fundamental rules for animation in UI — when and how elements should move.

| Principle | What it is | Application |
|-----------|------------|-------------|
| **Easing** | Acceleration and deceleration of an animation to make it feel natural. No easing = robotic. | Ease-out for elements entering the screen (UI panels, modals). Ease-in-out for looping or transitional motion. Avoid linear except for progress bars or mechanical indicators. |
| **Offset & delay** | Staggering the animation start of related elements to create a sense of order and hierarchy. | Stagger cards in a grid, list items, or step indicators. Delay grows with distance from the focal point. Creates a ripple or wave effect. |
| **Fade-in / fade-out** | Appearance or disappearance by adjusting transparency over time. | Use for overlays, modals, tooltips. Often combined with a small scale or slide for weight. Pure fade can feel flat — pair it with a transform. |
| **Masking** | Using a shape or element to hide or reveal parts of another element over time. | Loading transitions, image reveals, creative intros. A circle expanding from the centre is a common reveal pattern. |

**Reference:** <https://motion.zajno.com> — interactive playground for all four principles.

---

## Brand-system framework (five layers)

From the social post on scalable brand systems — treat branding as an operating
system, not a logo.

| Layer | What it covers |
|-------|---------------|
| **1. Brand Identity** | Visual language — logos, typography, color systems. What the brand *looks* like. |
| **2. Brand Hierarchy** | Rules governing type scales, spacing, and layout structure. Ensures consistent information weight across touchpoints. |
| **3. Brand Components** | Reusable assets — icons, graphic elements, UI patterns. Building blocks, not one-offs. |
| **4. Brand Guidelines** | Documentation that aligns teams and protects consistency. Defines how the system works so every project doesn't start from zero. |
| **5. Brand Infrastructure** | Underlying tools, workflows, and documentation that turn branding into an operating system. The connective tissue between layers 1–4. |

**Key insight:** most brands stop at layer 1 (a logo + a color). Scalable
brands go through all five. The boundary between 4 and 5 is where most teams
stall — guidelines without infrastructure rot.

---

## Design concepts

### Print & texture

| Concept | Explanation |
|---------|-------------|
| **Ink bleed** | A printing effect where ink spreads slightly into paper fibres, creating a soft, organic edge. Simulated digitally for mixed-media or print-style designs. |
| **Dot gain** | A printing phenomenon where halftone dots increase in size, making the printed image appear darker than the digital proof. |
| **Halftone** | A reprographic technique that simulates continuous-tone imagery through dots of varying size or spacing. Still used in screen printing, comics, and retro effects. |
| **Dithering** | A technique that creates the illusion of colour depth in images with a limited palette by arranging available colours in patterns. Common in pixel art, retro GIFs, and low-bit displays. |
| **Blind emboss** | A design technique where a shape or text is raised from a surface, with the interior colour matching the background. Subtle tactile effect with no colour contrast. |

### Layout & composition

| Concept | Explanation |
|---------|-------------|
| **Hero section** | The primary, above-the-fold area of a website designed to capture attention and communicate the core message. Typically headline + subtext + CTA + visual. |
| **Bento grid** | A layout style inspired by Japanese bento boxes — rectangular cards of varying sizes in a balanced, compartmentalised grid. One content type per card. |
| **Procedural graphics** | Computer graphics created using rules and algorithms rather than manual asset creation. Generates variation without manual re-authoring. |
| **Generative art** | Art created through an autonomous system (often code or algorithms), where the artist defines rules and the system produces the output. |
| **ASCII art** | Images created using printable ASCII characters. Still used in terminals, CLI tools, and retro aesthetics. |

### Colour fundamentals

| Concept | Explanation |
|---------|-------------|
| **Hex code** | A six-digit, three-byte hexadecimal number (`#RRGGBB`) used in HTML, CSS, and design software to represent colours. Each pair is 00–FF (0–255). |
| **Colour palette** | A curated selection of colours used in a design project to ensure visual harmony and brand consistency. Typically includes a primary, neutral, accent, and semantic colours. |
| **AI-driven colour inspiration** | Using ML to suggest palettes, layouts, and visual styles based on a seed input like an image or mood. Tools: Khroma, Coolors, Adobe Color. |

### UX / research

| Concept | Explanation |
|---------|-------------|
| **UX/UI research** | The process of gathering design inspiration and studying existing user flows to inform product decisions. Mobbin and Dribbble are common sources. |
| **Prompt engineering** | Crafting detailed, specific text inputs to guide AI models (image gen, code gen) toward a desired output. Specificity matters more than length. |

---

## Cognitive biases for UX design

These biases affect how users perceive and interact with interfaces. Naming a
bias gives you a lever to test against, not a prescription to follow.

| Bias | What it is | UX implication |
|------|------------|---------------|
| **Anchoring effect** | Relying too heavily on the first piece of information encountered. | The first price, number, or option shown sets the user's expectation. Place the option you want chosen first. |
| **Availability heuristic** | Judging likelihood based on how easily examples come to mind. | Vivid testimonials or recent reviews carry disproportionate weight. Surface recent positive evidence. |
| **Confirmation bias** | Seeking or interpreting information that confirms existing beliefs. | Users will skim past disconfirming data. Don't rely on warnings alone — use friction for destructive actions. |
| **Ambiguity effect** | Avoiding options where outcomes are unknown or uncertain. | A/B test results, progress indicators, and clear CTAs reduce ambiguity. Hidden costs or unclear next steps increase abandonment. |
| **Actor-observer bias** | Attributing others' behaviour to personality, your own to situation. | When a user errors, they blame the UI (situation). When they succeed, they credit themselves. Error messages should not blame the user. |
| **Calibration failure** | Miscalibrated trust in AI — either algorithm aversion (distrust) or uncritical acceptance (over-reliance). | For AI features: show confidence indicators, let users override, and avoid silent automation of important decisions. |

**References:** <https://cognitivebiasindex.com> (full index),
<https://www.nudges.fyi> (biases and heuristics in AI).

---

## Atomic tips (by domain)

### Brand & identity

- Don't stop at visual identity — scalable brands require structure (see 5-layer framework above).
- Use hierarchy to ensure information flows consistently across touchpoints.
- Turn design elements into reusable building blocks for teams.
- Document system rules to prevent projects from starting from zero.
- Treat branding as an operating system to maintain coherence during growth.

### Typography

- Use Fonts In Use to research typography choices in professional work.
- Check your design's accessibility by using contrast checkers for text readability.
- For brand kits, consider a bento-grid layout to organise multiple type treatments.

### Colour

- Use AI colour tools (Khroma, Coolors) to generate palettes based on your taste.
- Search for inspiration by inputting specific colour combinations to see how they're used in real-world designs.
- Use AI-powered asset managers (Cosmic) to auto-tag saved inspiration by colour and style.

### Motion

- Ease-out for elements entering the screen; ease-in-out for looping transitions.
- Offset animation delays to create hierarchy — stagger cards in a grid.
- Pure fade can feel flat — pair it with a transform (scale, slide) for weight.
- Study interactive examples (Motion by Zajno) to see how easing and masking behave in practice.

### Layout & UI

- Use a clear hierarchy to guide the user's eye from header to CTA.
- Consider multiple images or varied text placements for a more dynamic hero section.
- Use dedicated web utility tools (delphi.tools) for quick tasks like QR generation or contrast checking.
- For dashboards and feature showcases, the bento grid pattern works well.
- Pre-built UI component libraries (shadcn/ui, ReactBits) speed up development and maintain consistency.

### AI prompt design

- Use specific, descriptive language in prompts to guide the AI's aesthetic output.
- Include details about colour palette, typography, composition, and texture.
- For website mockups, instruct the AI to remove browser UI and frame the screenshot in a device mockup.
- For product renders from sketches, specify materials and accent colours.
- Experiment with different hero-section arrangements when using AI to generate layout alternatives.

### Game UI & dev

- Use GameUI Database to find visual inspiration for game interfaces.
- Study existing pitch decks on HeyGlitch to improve your own game's presentation.
- Analyse similar games on Steam Tag Helper to find the most effective store tags.
- Use public databases (Alan Game Dev Resources) to find publishers, QA firms, and translators.
- Leverage community management articles (Victoria Tran) to improve player engagement.

### Workflow & process

- Use 16-bit documents for the best results when applying ink bleed or print effects.
- Rename layers consistently to keep track of multi-step processes.
- Use the Warp tool on cutouts to add depth and tactile feel to compositions.
- Apply drop shadows to physical-object elements (tape, stamps) to sell the illusion.
- Use design.md files (getdesign.md) to provide your AI assistant with precise design instructions for consistent UI generation.
- Leverage existing design systems from established brands to speed up development.

---

## See also

- For tools and sites, see `resources.md`.
- For visual style directions, see `aesthetics.md`.
- For step-by-step process recipes, see `workflows.md`.
