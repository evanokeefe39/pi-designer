# Plan: pi-designer knowledge layer (v0.2)

## Intent

Incorporate the design/UI-UX knowledge captured by the
`scrape-ig-saved-list` pipeline (Instagram posts → Gemini `analysis.json`)
into pi-designer as a committed **knowledge layer**, and add the skills that
use it — so the agent can go from *research/inspiration* → *brief* →
*tokens* → *export* instead of only the last two steps.

Scraping and ingestion are **out of scope** for this repo. The knowledge is
captured once (now) by reading the existing `analysis.json` files, curating
them by hand into committed markdown, and never referencing the scraping
repo by path. Future re-scrapes are ad hoc; re-curation is manual.

## Design building-block layers

The skills map to a stack from most primitive to most composed:

```
   Brand values & voice   (the WHY — cross-cutting, sits above everything)
            │
            ▼
 Tokens ──→ Components ──→ Patterns ──→ Templates ──→ Deliverables
  (L0)        (L1)          (L2)          (L3)          (L4)
   │            │              │
   └────────────┴──────────────┴── Accessibility (cross-cutting)
```

- **L0 Tokens** — raw values (color ramps, type scale, spacing, radii).
  `design-system` fills this. (DONE)
- **L1 Components** — atoms built from tokens (Button, Input, Card).
  `design-components` placeholder. (GAP)
- **L1b Icons** — coherent icon set. `design-icons` placeholder. (GAP)
- **L2 Patterns** — compositions of components (LoginForm, HeroSection).
  `design-patterns` placeholder. (GAP)
- **L3 Templates** — page/canvas skeletons. `design-system` export targets
  ship these EMPTY today.
- **L4 Deliverables** — filled artifacts (carousel, email, report content).
  Not scaffolded; depends on L1/L2 being filled. (GAP, see ISSUE-002)
- **Cross-cutting** — Accessibility (`design-accessibility`, GAP) and Brand
  voice (`design-brand-voice`, GAP).

Dependency: each layer consumes the one below. You can't cleanly compose a
L4 deliverable (e.g. `design-carousel`) from L1/L2 that don't exist — it
would inline styles per slide and reinvent the system.

## Context Package

### Relevant existing code
- `skills/design-system/SKILL.md` — the deterministic core: brief → tokens →
  export. Tools: `generate_palette`, `generate_scale`, `build_design_system`,
  `export_design_system`. Four targets (website, report, carousel, email).
- `src/` — color (OKLCH), scale, tokens, targets. **Untouched** in v0.2.
- `tasks/plans/pi-designer-v0.1.md` — the v0.1 plan this builds on.
- `package.json` `"pi".skills` points at `./skills/`.

### Source of the knowledge (read-only, this session only)
`scrape-ig-saved-list/data/BxcAvPURKHDxFWzTs/<post_id>/analysis.json`
(Gemini schema v2). ~28 of 521 posts analyzed so far. Per post:
`resources[]`, `workflow_steps[]`, `concepts[]`, `tips[]`, `tools_apps[]`,
`content_type`, `value_score`, `domains`, `tags`.

Current yield (grows as more posts get analyzed — re-curate ad hoc later):
- 71 resources (with duplicates to dedup: ReactBits vs React Bits, Adobe
  Color vs Adobe Colors, Google Fonts ×3, Pinterest ×2).
- 10 workflows, 50 concepts, 73 tips.
- Domains: graphic_design, ui_ux, ai_tools, dev_tools, frontend, color,
  typography, branding.

### Architectural constraints
- No new runtime dependencies. Knowledge = markdown files; skills = SKILL.md.
- No build step (repo distributes `.ts` source). Knowledge is static `.md`.
- Nothing in pi-designer references `scrape-ig-saved-list` by path. The
  curation *reads* it once; the committed output stands alone.
- OKLCH token math in `src/` stays the deterministic core — skills layer
  *above* it, they don't change it.

### Prior decisions (this session)
- Ingestion: one-time hand curation into pi-designer (hybrid, minus the
  generator script — scraping is out of scope). Re-curation is manual/ad hoc.
- Location: knowledge docs committed inside pi-designer, no path references.
- Skills: extend/overwrite existing + add new as it makes sense; old and new
  info combined where sensible.

### Anti-patterns to avoid
- Shipping a generator script or any coupling to the scraping repo.
- A live DB query tool — DB is personal/local, not shippable.
- Pre-generating knowledge for posts not yet analyzed (wait, then re-curate).
- Skills that duplicate the deterministic tools instead of wrapping them.

## Knowledge layer (committed under `knowledge/`)

Four markdown reference docs, curated by hand from the analyses. Each is
self-contained: category → items with purpose + URL where known. No
post-level metadata, no personal data, no gated-content triggers.

### `knowledge/resources.md`
Categorized catalog of design tools/sites/repos, deduped. Categories:
- **Palettes & color** — Khroma, Coolors, Adobe Color, The Colorist Archive.
- **Moodboarding** — Pinterest, Milanote, Are.na, Cosmos.
- **Typography & fonts** — Google Fonts, Fontshare, DaFont, Fonts In Use.
- **UI component libraries** — shadcn/ui, ReactBits, Aceternity UI, Magic UI,
  Cult UI, Skiper UI, Watermelon UI, React Icons.
- **Stock imagery & textures** — Unsplash, Freepik, Public Work, Magnum Photos.
- **Archives & inspiration** — archives.design, Cari Institute, Internet
  Archive, Public Domain Review, Dribbble, Mobbin, Soot.
- **AI generation** — Midjourney, Krea AI, Canva AI, Gemini, Kittl, Higgsfield.
- **Motion** — Motion by Zajno (interactive principles).
- **Game UI & game dev** — GameUI Database, HeyGlitch pitch decks, Steam Tag
  Helper, Alan/Victoria Tran game-dev resources.
- **Design-system specs** — getdesign.md, DESIGN.md format.
- **Dev/design tools** — delphi.tools, Artkit (ASCIIT/Glassify/IMGTRACK),
  Framer, Tooqoos, Vector Halftone Maker, Claude Code, Google Stitch.

### `knowledge/aesthetics.md`
Aesthetic/style reference — "what look fits what." Each style: one-line
characterization + when to reach for it. From the concepts data:
Swiss Editorial, Brutalist Billboard, Cybercore, Bento/Bento-grid,
Floating Node, Architectural Split, Googie Kitsch, Nu-Brutalism, Mixed
Media, Pixel-inspired composition, Geometric System, Generative/Procedural.

### `knowledge/principles.md`
Reusable rules and concepts (not styles). Sections:
- **Motion principles** — easing, offset & delay, fade-in/out, masking.
- **Brand-system framework** — the five layers (identity, hierarchy,
  components, guidelines, infrastructure) + the "branding as an operating
  system" tip set.
- **Design concepts** — halftone, dithering, ink bleed, dot gain, blind
  emboss, hero-section hierarchy, color palette / hex code fundamentals.
- **Cognitive biases for UX** — anchoring, availability, confirmation,
  ambiguity effect, actor-observer bias, AI calibration failure
  (Nudges.fyi / Cognitive Bias Index as the live references).
- **Atomic tips** — the actionable one-liners, grouped by domain.

### `knowledge/workflows.md`
Reference recipes only — command-shaped workflows are extracted into skills.
Keeps only two tool-specific playbooks: mixed-media poster (Photoshop) and
Cybercore aesthetic (Framer).

## Skills (under `skills/`)

Each skill = exactly one workflow. No sub-procedures, no hidden second paths.
Old deterministic tools are kept and wrapped, not replaced.

### `skills/design-research/` (new) — inspiration + visual research → brief
Wraps the visual inspiration research protocol. Procedure:
1. Understand the project domain, audience, and mood.
2. Run the **archival inspiration protocol** — 3-site loop (Public Domain
   Review → Internet Archive → Magnum Photos) to gather visual references.
3. Consult `knowledge/aesthetics.md` to surface 1–3 aesthetic directions.
4. Consult `knowledge/principles.md` (motion, brand framework, biases) where
   relevant.
5. Point to relevant tools from `knowledge/resources.md`.
6. Produce a brand brief JSON for `design-system`.

### `skills/design-logo/` (new) — AI prompt for a styled logo
Define brand/industry/style → select logo prompt template → fill in brand
name, style keywords → generate → iterate.

### `skills/design-brand-kit/` (new) — AI prompt for a brand kit bento grid
Choose brand colours/type/elements → write bento-grid prompt → generate
composite brand-kit graphic.

### `skills/design-product-render/` (new) — AI prompt for a product render
Start with sketch or concept → specify materials/accent colours/lighting →
write photorealistic render prompt → generate → refine.

### `skills/design-mockup/` (new) — AI prompt for a website mockup
Describe page structure → write mockup prompt (no browser UI, device
framed) → generate → review layout fidelity.

### `skills/design-storyboard/` (new) — AI prompt for a storyboard grid
Define scene sequence → write 3×3 grid prompt → generate panels.

### `skills/design-style-recreate/` (new) — recreate an aesthetic via AI
Pick a target aesthetic (Swiss, Brutalist, Cybercore, etc.) → read its
traits from `aesthetics.md` → build a precise prompt with palette,
typography, composition → generate → compare → refine.

### `skills/design-game-asset/` (new) — generate consistent game assets
Generate base character → connect to flow artboard for states → remix
for character variety → generate environment variants (day/night/rainy).

### `skills/design-system-specs/` — DROPPED (folded into design-research)
Failed the command-shaped test: its core step ("visit getdesign.md") can't
be performed by the agent and the rest is a lookup. The one useful step
(pull specs from a known brand to seed a brief) was folded into
`design-research` step 6 as an alternate brief source.

### `skills/design-system/` (rewritten) — brief → tokens → (a11y check) → export
Kept as the deterministic core. Lightly rewritten: documented the handoff
from `design-research` (consume its brief), and added an accessibility
check step (verify contrast before export — full cross-layer a11y is the
`design-accessibility` placeholder). All tool refs and medium notes
unchanged.

### Placeholder skills (Layers 1–2, a11y, voice — NOT yet implemented)
Scaffolded to fill gaps vs the industry design-system model (see layer
diagram above + `ISSUES.md`). Each is a stub with intended scope.
- `skills/design-components/` (L1) — component library from tokens.
- `skills/design-icons/` (L1b) — style-consistent icon set.
- `skills/design-patterns/` (L2) — pattern library composed of components.
- `skills/design-accessibility/` (cross) — WCAG audit + fixes per layer.
- `skills/design-brand-voice/` (cross, the why) — brand values + tone + rules.
Dependency order: tokens (done) → components + icons → patterns → deliverables.

### Why this set (14 skills: 9 implemented + 5 placeholder)
Each skill maps to one distinct command the agent can execute. The 5
prompt-based skills (logo, brand-kit, product-render, mockup, storyboard)share the same meta-pattern but have different output types and prompt
structures — each earns its own trigger rather than a branching
sub-procedure. design-lookup was dropped (the agent answers reference
questions naturally from the knowledge docs without a skill file).

## Build steps (in order)

1. **Curate `knowledge/resources.md`** — dedup the 71 resources, categorize,
   prune dead/empty URLs, keep purpose one-liners. [DONE]
2. **Curate `knowledge/aesthetics.md`** — the ~12 styles with
   characterizations + when-to-use. [DONE]
3. **Curate `knowledge/principles.md`** — motion, brand framework, concepts,
   biases, grouped tips. [DONE]
4. **Curate `knowledge/workflows.md`** — remove command-shaped workflows
   (promoted to skills), keep only reference recipes (mixed-media poster,
   Cybercore in Framer).
5. **Write `skills/design-research/SKILL.md`** — inspiration + visual research → brief.
6. **Write `skills/design-logo/SKILL.md`** — AI prompt for styled logo.
7. **Write `skills/design-brand-kit/SKILL.md`** — AI prompt for brand kit bento grid.
8. **Write `skills/design-product-render/SKILL.md`** — AI prompt for product render.
9. **Write `skills/design-mockup/SKILL.md`** — AI prompt for website mockup.
10. **Write `skills/design-storyboard/SKILL.md`** — AI prompt for storyboard.
11. **Write `skills/design-style-recreate/SKILL.md`** — recreate an aesthetic via AI.
12. **Write `skills/design-game-asset/SKILL.md`** — generate consistent game assets.
13. **Write `skills/design-system-specs/SKILL.md`** — find & apply design system specs.
14. **Rewrite `skills/design-system/SKILL.md`** — add design-research handoff; keep tools/medium notes.
15. **Update `README.md`** — mention all 10 skills and the knowledge layer.
16. **Sanity check** — `npm run check` + `npm run lint`.
17. **Update plan doc** — finalise decisions.

### Step 10 iteration (pre-built into this plan)
Phase 1 of curation (step 4) extracted workflows from analysis.json. The
iteration step is built into the design: every command-shaped workflow from
workflows.md gets its own skill; only genuinely tool-specific recipes
(mixed-media, Cybercore in Framer) stay as reference docs.

## Behavioral Contracts

- GIVEN the knowledge docs, WHEN the user asks a reference question
  ("find me a palette tool"), THEN the agent reads the relevant
  `knowledge/` doc and answers directly — no skill file needed for this.
- GIVEN a vague mood ("calm fintech"), WHEN design-research runs, THEN it
  runs the archival inspiration protocol, surfaces 2–3 aesthetic directions
  from `aesthetics.md`, and produces a brief for design-system.
- GIVEN "create a logo for [brand] in [style]", WHEN design-logo runs,
  THEN it produces a structured AI prompt, recommends a tool, and generates.
- GIVEN a complete brand brief, WHEN design-system runs, THEN behavior is
  unchanged from v0.1 (tokens + export via the four tools).
- GIVEN any skill or knowledge doc, THEN no committed file references
  `scrape-ig-saved-list` or an absolute machine path.

## Edge Case Inventory

- Duplicate resources (ReactBits/React Bits, Adobe Color/Colors, Google Fonts
  ×3, Pinterest ×2) → merged to one entry each. (curation)
- Resources with empty URLs (PrintMachine, Claude Code, Google Stitch,
  Geometric System) → kept with empty url + purpose; not invented. (curation)
- Gated-content posts → only the *named* resource is extracted; the gate
  trigger itself is never committed. (curation)
- Aesthetic terms that overlap (Bento-grid vs Bento Box, Mixed Media vs
  Graphic Design Style) → merged/cross-referenced. (curation)
- Future re-scrape → re-curation is manual; docs note "curated as of
  <date>, ~N posts" header so staleness is visible. (doc header)

## Workflows → skills (the seed relationship)

Skills **are** workflows. Every command-shaped workflow extracted from
analysis.json is now its own skill. The two remaining recipes in
`workflows.md` (mixed-media poster, Cybercore in Framer) are tool-specific
and kept as reference docs.

The 5 prompt-based skills (logo, brand-kit, product-render, mockup,
storyboard) share a meta-pattern but have distinct output types and prompt
structures — each earns its own trigger rather than a shared
sub-procedure. If usage data shows they're always called together, they
could merge later.

design-lookup was dropped: the agent answers reference questions directly
from `knowledge/` docs without needing a skill file for it.

## Out of scope (explicit)

- Any script that reads `analysis.json` at build/runtime.
- Shipping `results.db` or a query tool.
- Re-running the Gemini analysis or the Apify scraper.
- Touching `src/` token/export math.