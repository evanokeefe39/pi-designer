# pi-designer

A [pi coding-agent](https://github.com/badlogic/pi-mono) extension for building **design systems** — from one brand color to a complete, multi-medium token set for **websites, reports, social carousels, and email newsletters**.

The model makes the creative calls (palette direction, voice, layout). pi-designer does the deterministic work: perceptually-even color ramps, modular type and spacing scales, and faithful per-medium exporters.

## Why

Most design-token tools are browser apps that only target the web. pi-designer lives in your agent/terminal and exports for four mediums that each have different rules — print color fidelity, fixed carousel canvases, inline-only email. Color ramps use the **OKLCH** color space (perceptually uniform, the same approach as Tailwind v4) so every stop reads as one coherent hue.

The extension also ships a **curated knowledge layer** — design resources, aesthetic styles, principles, and workflows extracted from social-media design content — so the agent can research inspiration and pick a direction before generating tokens.

## Design building-block stack

The skills map to a natural stack from most primitive to most composed:

```
   Brand values & voice   (the WHY — cross-cutting, sits above everything)
            │
            ▼
 Tokens ──→ Components ──→ Patterns ──→ Templates ──→ Deliverables
  (L0)        (L1)          (L2)          (L3)          (L4)
   │            │              │
   └────────────┴──────────────┴── Accessibility (cross-cutting check at every layer)
```

- **Layer 0 — Tokens (primitives).** Raw values: color ramps, type scale,
  spacing scale, radii, shadows, motion. What `design-system` generates.
  *Filled in v0.1.*
- **Layer 1 — Components (atoms).** Smallest reusable blocks built from
  tokens. A Button = `brand-600` + `radius-md` + `font-body` + hover/focus
  behavior. Button, Input, Card, Badge, Avatar, Tooltip. *Implemented in v0.3.*
- **Layer 1b — Icons.** A special atom subset. An icon set must be
  coherent — same stroke weight, grid, corner radius — you can't grab
  them piecemeal. *Implemented in v0.3.*
- **Layer 2 — Patterns (molecules/organisms).** Compositions of components
  that solve recurring UX problems: LoginForm, PricingTable, HeroSection,
  NavHeader, EmptyState. *Implemented in v0.3.*
- **Layer 3 — Templates / Layouts.** Page or canvas skeletons with
  structure but placeholder content. `design-system`'s export targets ship
  Layer 3 templates today — but they ship **empty.**
- **Layer 4 — Deliverables.** The finished, shipped artifact: a filled
  6-slide carousel with copy + brand images, a finished email with real
  sections. *Implemented in v0.3 (v1 inlines tokens; v2 composes components).*

**Cross-cutting:** Accessibility (contrast at L0, focus/semantics at L1,
keyboard nav at L2 — enabled by `design-accessibility`) and Brand values &
voice (the "why" that picks which tokens and copy get chosen —
`design-brand-voice`). Both implemented in v0.3.

**Dependency:** each layer consumes the one below. You can't cleanly
compose a L4 deliverable (e.g. a carousel) from L1/L2 components that
 don't exist — it would inline styles and reinvent the system per slide.
v0.3 ships all layers with component-composition as the upgrade path
(see `ISSUES.md`).

## Install

pi-designer is a git-installable pi package — no build step, no npm publish:

```bash
pi install git:github.com/evanokeefe39/pi-designer
```

Or, for local development, point pi at the checkout:

```bash
pi -e ./src/index.ts
```

## Usage

pi-designer provides **17 skills**, each implementing exactly one workflow.
The full research-to-token pipeline:

```
design-research ──→ design-system ──→ export
```

### Skills overview

**Implemented:**

| Skill | What it does |
|-------|-------------|
| `design-research` | Gather archival inspiration, surface aesthetic directions, produce a brand brief. |
| `design-logo` | Craft an AI prompt for a styled logo. |
| `design-brand-kit` | Craft an AI prompt for a brand-kit IMAGE (bento-grid composite). Not a guidelines doc. |
| `design-product-render` | Craft an AI prompt for a photorealistic product render. |
| `design-mockup` | Craft an AI prompt for a device-framed website mockup. |
| `design-storyboard` | Craft an AI prompt for a 3×3 commercial storyboard grid. |
| `design-style-recreate` | Recreate a specific design aesthetic (Swiss, Brutalist, Cybercore…) via AI prompt. |
| `design-game-asset` | Generate consistent game characters (states + remixes) and environment variants. |
| `design-system` | Build design tokens from a brief (with accessibility check) and export to website/report/carousel/email. |

**Also implemented (v0.3 — all layers closed):**

| Skill | Layer | What it does |
|-------|-------|-------------|
| `design-brand-voice` | cross (why) | Define brand values, tone of voice, and content rules. |
| `design-components` | L1 | Build a component library (Button, Input, Card, Badge…) from tokens. |
| `design-icons` | L1b | Source a style-consistent icon set matching the brand. |
| `design-patterns` | L2 | Compose components into patterns (LoginForm, HeroSection, PricingTable…). |
| `design-accessibility` | cross | WCAG contrast audit, focus/keyboard/motion checks across every layer. |
| `design-carousel` | L4 | Filled social carousel slides from the design system. |
| `design-email` | L4 | Finished email (inline styles, MSO-safe) from the system. |
| `design-report` | L4 | Finished report/PDF (A4, print fidelity) from the system. |

All 17 skills are now implemented. Layer 4 deliverables in v1 inline token
values directly; v2 upgrades to component composition when L1/L2 are in
the project tree (see `ISSUES.md`).

### Slash commands

| Command | What it does |
|---------|-------------|
| `/design-system` | Scaffold a starter brand brief + explain the pi-designer workflow. |

Just talk to the agent — it will use the right skill automatically. The agent
has access to these tools:

| Tool | What it does |
| --- | --- |
| `generate_palette` | 11-stop (50–950) OKLCH ramp from a base hex color |
| `generate_scale` | Modular type scale (xs–5xl) or spacing scale |
| `build_design_system` | Full token set (colors, type, spacing, radii, shadows) from a brief |
| `export_design_system` | Write tokens to per-target files on disk |

Example prompt:

> Build a design system called "Acme" with brand color #4f46e5 and accent #f59e0b, then export it for website and email into ./design-system.

### Output per target

- **website** — `tokens.css` (CSS custom properties) + `tailwind-theme.css` (Tailwind v4 `@theme`)
- **report** — `report.css` (A4 `@page`, point sizing, `print-color-adjust: exact`, page-break helpers)
- **carousel** — `carousel.json` (canvas sizes + safe areas for IG/Story/LinkedIn) + `slide-template.html`
- **email** — `email-tokens.json` (resolved px/hex values) + `email-template.html` (table-based, inline styles only)

## Knowledge layer

Four curated reference docs under `knowledge/`, extracted from design/UI-UX
social media content (see [CREDITS.md](./CREDITS.md) for the creators whose
public tips and workflows made this possible):

| Doc | What it covers |
|-----|---------------|
| `resources.md` | ~60 deduped design tools and sites — palette generators, moodboarding, fonts, UI libraries, AI gen, archives, game dev, UX biases. Categorised with URLs and purpose. |
| `aesthetics.md` | 12 visual styles (Swiss Editorial, Brutalist Billboard, Cybercore, Bento Grid, Mixed Media…) with key traits and when-to-use. |
| `principles.md` | Motion principles, 5-layer brand framework, design concepts (ink bleed, halftone, dithering…), cognitive biases for UX, atomic tips by domain. |
| `workflows.md` | Reference recipes — mixed-media poster (Photoshop), Cybercore aesthetic (Framer). Command-shaped workflows are their own skills (see above). |

## Resources

The tools, sites, and references the creators recommend —
categorised highlights from the knowledge layer (`knowledge/resources.md`
has the full ~100-entry catalogue).

### Design Platforms
| Tool | URL | What for |
|------|-----|----------|
| Figma | <https://figma.com> | Industry-standard collaborative UI/UX design |
| Figma Weave | <https://weave.figma.com> | Node-based AI workflow canvas |
| Penpot | <https://penpot.app> | Open-source design platform |
| Canva | <https://canva.com> | Browser-based design for rapid assets |
| Webflow | <https://webflow.com> | Visual web development without code |

### Color & Typography
| Tool | URL | What for |
|------|-----|----------|
| Khroma | <https://khroma.co> | AI palette generator that learns your taste |
| Coolors | <https://coolors.co> | Palette generation and exploration |
| Huemint | <https://huemint.com> | ML-driven color palette generator |
| Google Fonts | <https://fonts.google.com> | Free web fonts |
| Fontshare | <https://fontshare.com> | Quality free fonts |
| Fonts In Use | <https://fontsinuse.com> | Real-world typography in context |
| Typewolf | <https://typewolf.com> | Curated font recommendations |

### Moodboarding & Inspiration
| Tool | URL | What for |
|------|-----|----------|
| Cosmos | <https://cosmos.so> | Visual moodboarding and stock imagery |
| Milanote | <https://milanote.com> | Collaborative moodboards |
| Are.na | <https://are.na> | Channel-based visual collection |
| Dribbble | <https://dribbble.com> | Design project showcase |
| Mobbin | <https://mobbin.com> | Real-world app screens and flows |
| Archives.design | <https://archives.design> | Graphic design history archive |

### UI Components
| Tool | URL | What for |
|------|-----|----------|
| shadcn/ui | <https://ui.shadcn.com> | Copy-paste React components |
| ReactBits | <https://reactbits.dev> | Animated interactive components |
| Aceternity UI | <https://ui.aceternity.com> | Modern UI components |
| Magic UI | <https://magicui.design> | Landing page components |
| React Icons | <https://react-icons.github.io> | Icon sets for React |

### AI Image & Code Generation
| Tool | URL | What for |
|------|-----|----------|
| Midjourney | <https://midjourney.com> | AI image generation |
| Krea AI | <https://krea.ai> | Real-time AI image gen & enhancement |
| Recraft | <https://recraft.ai> | AI vector art and 3D generation |
| v0 | <https://v0.dev> | Prompts to production React/Tailwind UI |
| Lovable | <https://lovable.dev> | Chat-driven app and website builder |

### 3D, Motion & Prototyping
| Tool | URL | What for |
|------|-----|----------|
| Blender | <https://blender.org> | Free, open-source 3D creation suite |
| Spline | <https://spline.design> | Browser-based 3D design |
| Rive | <https://rive.app> | Interactive runtime animations |
| Motion by Zajno | <https://motion.zajno.com> | Interactive motion design principles |
| LottieFiles | <https://lottiefiles.com> | Lightweight vector animations |

### Accessibility & Handoff
| Tool | URL | What for |
|------|-----|----------|
| Stark | <https://getstark.co> | WCAG contrast, focus, alt text checker |
| axe DevTools | <https://deque.com/axe> | Industry-standard WCAG testing |
| WAVE | <https://wave.webaim.org> | Free web accessibility evaluation |
| Storybook | <https://storybook.js.org> | UI component explorer and docs |

### Dev Tools & Game Dev
| Tool | URL | What for |
|------|-----|----------|
| Framer | <https://framer.com> | Web design & prototyping |
| Taste Lab | <https://tastelab.io> | Extract design tokens from any website |
| delphi.tools | <https://delphi.tools> | Free no-login web utility tools |
| GameUI Database | <https://gameuidatabase.com> | Game interface reference |
| Steam Tag Helper | <https://steamtaghelper.com> | Steam store tag analysis |

### Design-System Specs & UX
| Tool | URL | What for |
|------|-----|----------|
| getdesign.md | <https://getdesign.md> | Design-system specs / DESIGN.md files |
| Cognitive Bias Index | <https://cognitivebiasindex.com> | Bias reference for UX |
| Nudges.fyi | <https://www.nudges.fyi> | Biases and heuristics in AI |
| Laws of UX | <https://lawsofux.com> | Best practices for UI design |

## Development

```bash
npm install
npm run check   # tsc type-check
npm run lint    # biome
npm test        # vitest
```

## License

[MIT](./LICENSE)
