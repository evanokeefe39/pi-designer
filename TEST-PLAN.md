# Test Plan — pi-designer

## Current coverage summary

| Module | Test file | Coverage quality |
|--------|-----------|-----------------|
| `color.ts` | `test/color.test.ts` | Good: hex parse, OKLCH round-trip, ramp generation, neutral ramp, gamut clamp |
| `scale.ts` | `test/scale.test.ts` | Good: modularStep, typeScale, spacingScale, edge-case throws |
| `tokens.ts` | `test/targets.test.ts` (partial) | Thin: only checks keys exist, no edge cases |
| `targets/*.ts` | `test/targets.test.ts` | Basic smoke: one content assertion per target + all-targets run |
| `shared.ts` | _none_ | Untested |
| `index.ts` | `test/integration.test.ts` | Good start: registration, disk export, malformed JSON. Missing edge cases |
| Skills (17) | _none_ | No skill-level tests |

---

## 1. Unit test plan

### 1.1 `color.ts` — OKLCH color engine

Already well-covered. Add:

| ID | Test | Why |
|----|------|-----|
| C-01 | `hexToRgb` / `rgbToHex` round-trip on black `#000000` and white `#ffffff` | Boundary values |
| C-02 | `hexToRgb` throws on empty string, `#`, `#abcde` (5 chars) | Fuzz the parser |
| C-03 | `oklchToHex` for pure achromatic input `{l:0.5, c:0, h:0}` | Chroma-zero edge |
| C-04 | `generateRamp` with near-gamut-edge base color (e.g. `#ff0000` pure red) | OKLCH reds have known gamut issues |
| C-05 | `generateRamp` with very dark base `#111111` | Chroma near zero at base — verify ramp stays stable |
| C-06 | `generateRamp` with very light base `#fefefe` | Same, light end |
| C-07 | `generateNeutralRamp` with tint → every stop has same hue (±1°) | Tint consistency |
| C-08 | `clampChroma` on already-in-gamut color → returns identity (same ref or deep-equal) | No-op path |
| C-09 | `clampChroma` on extreme out-of-gamut → converges within 24 iterations | Performance invariant |

### 1.2 `scale.ts` — Modular scales

Already well-covered. Add:

| ID | Test | Why |
|----|------|-----|
| S-01 | `typeScale` with custom ratio `1.5` (perfect fifth) → `5xl` > `2xl` > `base` > `sm` | Custom ratio |
| S-02 | `typeScale` with ratio `1.0` → all steps equal base | Degenerate ratio |
| S-03 | `spacingScale` with custom base `8` → `"4"` = `2rem` | Custom base |
| S-04 | `spacingScale` output keys match `SPACING_MULTIPLES` | All expected keys present |
| S-05 | `modularStep` negative step → value < base | Downward scale works |

### 1.3 `tokens.ts` — Design token model & builder

| ID | Test | Why |
|----|------|-----|
| T-01 | `buildDesignTokens` with only `name` + `brand` → no accent color key | Minimal input |
| T-02 | `buildDesignTokens` with `accent` → `colors.accent` exists with 11 stops | Accent ramp generation |
| T-03 | `buildDesignTokens` with `neutralTint` different from `brand` → neutral uses tint hue | Tint override |
| T-04 | `buildDesignTokens` with `typeRatio: 1.333` → scale reflects custom ratio | Custom typography |
| T-05 | `buildDesignTokens` with all three custom fonts → `fontFamilies` match input | Custom fonts |
| T-06 | `buildDesignTokens` without optional fonts → defaults applied | Default fallbacks |
| T-07 | `buildDesignTokens` → output shape matches `DesignTokens` interface | Structural completeness |
| T-08 | `buildDesignTokens` name field preserved exactly | Name passthrough |
| T-09 | Duplicate `buildDesignTokens` calls produce structurally identical output (idempotent) | Idempotency |
| T-10 | `buildDesignTokens` with invalid hex brand → throws from `generateRamp` | Error propagation |

### 1.4 `targets/shared.ts` — CSS variable helpers

| ID | Test | Why |
|----|------|-----|
| SH-01 | `cssVariableLines` → output array has > 0 lines, every line is non-empty string | Basic shape |
| SH-02 | `cssVariableLines` → contains `--color-brand-500`, `--font-heading`, `--space-4`, `--radius-md`, `--shadow-md` | All token categories |
| SH-03 | `cssVariableLines` with custom indent `"    "` → every line starts with 4 spaces | Indent override |
| SH-04 | `cssVariableLines` → no duplicate variable names | Uniqueness |
| SH-05 | `fileHeader` → contains design system name and medium string | Header content |
| SH-06 | `fileHeader` → starts with `/*` and ends with `*/` | Valid comment |

### 1.5 `targets/website.ts` — Website exporter

| ID | Test | Why |
|----|------|-----|
| W-01 | `websiteTarget` → `tokens.css` wraps variables in `:root {}` block | CSS structure |
| W-02 | `websiteTarget` → `tailwind-theme.css` wraps in `@theme {}` block | Tailwind structure |
| W-03 | `websiteTarget` → Tailwind file uses `--color-*`, `--font-*`, `--text-*`, `--spacing-*`, `--radius-*`, `--shadow-*` namespaces | Correct Tailwind v4 namespacing |
| W-04 | `websiteTarget` → spacing keys with `.` (e.g. `0.5`) become `_` in variable names | Key sanitization |
| W-05 | `websiteTarget` → `tokens.css` and `tailwind-theme.css` share same hex values for color-500 | Consistency across files |

### 1.6 `targets/report.ts` — Print/PDF exporter

| ID | Test | Why |
|----|------|-----|
| R-01 | `reportTarget` → contains `@page` rule with A4 or letter dimensions | Print page size |
| R-02 | `reportTarget` → contains `print-color-adjust: exact` | Color fidelity |
| R-03 | `reportTarget` → uses `pt` units for font sizes (not rem) | Print-appropriate units |
| R-04 | `reportTarget` → contains page-break helper classes | Pagination support |
| R-05 | `reportTarget` → no `@theme` block (Tailwind not used in print) | Medium isolation |

### 1.7 `targets/carousel.ts` — Social carousel exporter

| ID | Test | Why |
|----|------|-----|
| CA-01 | `carouselTarget` → JSON is valid parseable JSON | Valid JSON |
| CA-02 | `carouselTarget` → contains at least one canvas with `width`, `height`, `safeArea` | Canvas spec shape |
| CA-03 | `carouselTarget` → canvas dimensions are positive integers | Valid dimensions |
| CA-04 | `carouselTarget` → `safeArea` has `top`, `bottom`, `left`, `right` keys | Safe area shape |
| CA-05 | `carouselTarget` → HTML template has no hardcoded hex values (references tokens) | Token-connected |
| CA-06 | `carouselTarget` → HTML template uses rem units for spacing | Rem for web |
| CA-07 | `carouselTarget` → JSON canvases include `instagram-portrait` (1080×1920) if present | Platform coverage |

### 1.8 `targets/email.ts` — HTML email exporter

| ID | Test | Why |
|----|------|-----|
| E-01 | `emailTarget` → output is valid HTML (parseable, has `<html>`, `<body>`) | Well-formed |
| E-02 | `emailTarget` → uses `<table>` for layout (no flexbox/grid) | MSO compatibility |
| E-03 | `emailTarget` → has `role="presentation"` on layout tables | Screen reader safe |
| E-04 | `emailTarget` → no `rem` units anywhere (only `px`) | Email unit constraint |
| E-05 | `emailTarget` → no `var(--` anywhere (no CSS custom properties) | Inline-only |
| E-06 | `emailTarget` → all colors are hex (no `rgb()`, `hsl()`) | Email color format |
| E-07 | `emailTarget` → has `<!DOCTYPE html>` and XML namespace | Email doctype |
| E-08 | `emailTarget` → contains viewport meta or `[if mso]` conditional comments | MSO handling |

### 1.9 `index.ts` — Extension entry point

| ID | Test | Why |
|----|------|-----|
| I-01 | `export_design_system` with single target `["website"]` → writes only `website/` directory | Partial target set |
| I-02 | `export_design_system` with `["website", "email"]` → writes both directories | Multiple targets |
| I-03 | `export_design_system` with custom `outDir` → files written to that directory | Custom output dir |
| I-04 | `export_design_system` with empty `targets` array → writes 0 files, doesn't crash | Empty targets |
| I-05 | `export_design_system` with `"all"` + other targets → deduplicated, `all` wins | All override |
| I-06 | `export_design_system` with valid tokens + non-existent outDir parent → `mkdir` creates it | Auto-created dirs |
| I-07 | `/design-system` command → writes `design-brief.json` with expected shape | Command output |
| I-08 | `/design-system` command run twice → second call doesn't overwrite (flag `wx`) | Idempotent command |
| I-09 | `generate_palette` → returns 11-stop ramp, every stop is valid hex | Palette shape |
| I-10 | `generate_palette` with `neutral: true` → returns low-chroma ramp | Neutral flag |
| I-11 | `generate_scale` kind `"type"` → returns object with `base`, `xs`, `5xl` keys | Type scale shape |
| I-12 | `generate_scale` kind `"spacing"` → returns object with `"0"`, `"4"`, `"32"` keys | Spacing scale shape |
| I-13 | `build_design_system` → returns JSON with all top-level token categories | Full token output |

---

## 2. E2E skill scenario tests

Skills are LLM-instruction documents (SKILL.md). E2E tests for skills validate
that the *pipeline* — not the LLM reasoning — produces correct outputs when the
deterministic tools are called with expected inputs. Each scenario chains 2+
skills.

### 2.1 `design-research` → `design-system` (L0 pipeline)

**Scenario:** User wants a fintech brand → research phase produces brief →
system builds tokens.

| ID | Test | How to validate |
|----|------|----------------|
| E2E-01 | `knowledge/aesthetics.md` exists and is valid markdown with at least 5 entries | File read + heading count |
| E2E-02 | `knowledge/resources.md` exists and contains "AI Generation", "Palette", "Typography" sections | Section presence |
| E2E-03 | `knowledge/principles.md` exists and is non-empty | File read |
| E2E-04 | Given a hand-written brief matching the research output shape, `build_design_system` produces valid tokens → `export_design_system` writes all 4 targets | Golden-file: input brief → token assertions → disk output assertions |
| E2E-05 | The research → system chain: begin with `knowledge/aesthetics.md` entry ("Swiss Editorial"), derive a brief, build + export → output CSS uses the correct font stack and neutral palette for that aesthetic | Golden-file per aesthetic |

### 2.2 `design-system` → `design-accessibility` (L0 audit)

**Scenario:** Tokens built → accessibility audit checks contrast pairs.

| ID | Test | How to validate |
|----|------|----------------|
| E2E-06 | Compute WCAG contrast ratio for `neutral-900` on `neutral-50` from a known palette → result ≥ 4.5:1 | Math assertion |
| E2E-07 | Compute contrast for `brand-600` on `neutral-50` → verify ratio is computable (not NaN, not Infinity) | Math assertion |
| E2E-08 | Given tokens with known hex values, the 8 required pairs from `design-accessibility/SKILL.md` are all computable | Pair coverage |
| E2E-09 | Contrast ratio formula matches WCAG 2.1 spec: `(L1 + 0.05) / (L2 + 0.05)` with correct sRGB→linear luminance | Formula correctness |

### 2.3 `design-system` → `design-components` (L0 → L1)

**Scenario:** Tokens exported → component library generated.

| ID | Test | How to validate |
|----|------|----------------|
| E2E-10 | CSS variables file (`tokens.css`) contains all variables that `design-components/SKILL.md` expects to reference | Cross-reference variable names in SKILL.md vs. actual CSS output |
| E2E-11 | Every `--color-*-*` variable in tokens.css has a valid hex value | Regex scan |

### 2.4 `design-system` → `design-carousel` (L0 → L4)

**Scenario:** Carousel template exported → filled with content.

| ID | Test | How to validate |
|----|------|----------------|
| E2E-12 | `carousel.json` canvas dimensions match the SKILL.md documented sizes (1080×1920, 1080×1080, 1200×627) | JSON assertion |
| E2E-13 | `slide-template.html` validates as HTML5 (no unclosed tags, valid structure) | HTML parse |
| E2E-14 | Carousel tokens resolved to inline values: pick a `--color-brand-500` from tokens.css → find the hex in slide-template or validate it's referenceable | Token resolution |

### 2.5 `design-brand-voice` → `design-system` → `design-email` (Voice → L0 → L4)

**Scenario:** Brand voice defined → tokens built → email uses voice rules.

| ID | Test | How to validate |
|----|------|----------------|
| E2E-15 | `brand-voice.md` output template (from SKILL.md) has required sections: Values, Voice & Tone, Content Rules | Template validation |
| E2E-16 | Email template does not exceed safe width (600px is industry standard) | Content check |
| E2E-17 | Email template subject line placeholder ≤ 50 chars | Template check |

### 2.6 `design-system` → `design-icons` (L0 → L1b)

**Scenario:** Tokens built → icon family chosen.

| ID | Test | How to validate |
|----|------|----------------|
| E2E-18 | `knowledge/resources.md` lists at least the icon families from the SKILL.md table (Lucide, Phosphor, Heroicons, Feather, Material, Tabler) | Reference completeness |

### 2.7 `design-components` → `design-patterns` (L1 → L2)

**Scenario:** Components exist → patterns composed.

| ID | Test | How to validate |
|----|------|----------------|
| E2E-19 | `design-patterns/SKILL.md` references components that `design-components/SKILL.md` defines | Cross-skill consistency |

### 2.8 `design-research` → `design-style-recreate` → `design-brand-kit` (Research → Image prompt → Brand kit)

**Scenario:** Research identifies aesthetic → style recreation prompt → brand kit image.

| ID | Test | How to validate |
|----|------|----------------|
| E2E-20 | `design-style-recreate/SKILL.md` aesthetics table references map to entries in `knowledge/aesthetics.md` | Cross-reference validation |
| E2E-21 | `design-brand-kit/SKILL.md` prompt template contains bento-grid layout description | Template check |

### 2.9 `design-logo` → `design-product-render` → `design-mockup` (Image generation chain)

**Scenario:** Logo generated → product render → device mockup.

| ID | Test | How to validate |
|----|------|----------------|
| E2E-22 | Each image-generation SKILL.md (logo, product-render, mockup, storyboard, game-asset, style-recreate, brand-kit) references `knowledge/resources.md` → AI Generation section | Cross-reference |
| E2E-23 | Each image-generation SKILL.md has a prompt template with at least a structure description | Completeness |

### 2.10 `design-storyboard` → `design-game-asset` (Sequential image generation)

**Scenario:** Storyboard → game asset pipeline.

| ID | Test | How to validate |
|----|------|----------------|
| E2E-24 | `design-storyboard/SKILL.md` describes 3×3 grid layout | Template structure |
| E2E-25 | `design-game-asset/SKILL.md` references flow artboards and character state progression | Workflow completeness |

---

## 3. Infrastructure / validation tests

| ID | Test | Why |
|----|------|-----|
| INF-01 | All 17 skill directories contain a `SKILL.md` with valid YAML frontmatter (`name`, `description` fields) | Metadata integrity |
| INF-02 | No two skills share the same `name` in frontmatter | Uniqueness |
| INF-03 | Every skill `name` matches its directory name (e.g. `skills/design-foo/SKILL.md` → `name: design-foo`) | Consistency |
| INF-04 | `knowledge/` directory: all `.md` files are parseable and non-empty | Knowledge integrity |
| INF-05 | `src/targets/index.ts` `TARGET_NAMES` matches the keys of `TARGETS` exactly | Registry consistency |
| INF-06 | `src/index.ts` `StarterBrief` JSON is valid parseable JSON with required `name` and `brand` fields | Starter brief validity |
| INF-07 | `package.json` `pi.extensions` and `pi.skills` paths resolve to existing files/directories | Package integrity |
| INF-08 | TypeScript compiles cleanly: `tsc --noEmit` exits 0 | Build health |
| INF-09 | `biome check` exits 0 (lint) | Code quality |

---

## 4. Priority ordering

### Phase 1 — Fill unit test gaps (no new infrastructure needed)

1. **`tokens.ts`** (T-01 through T-10) — highest-value gap, core model
2. **`targets/shared.ts`** (SH-01 through SH-06) — untested shared code
3. **`index.ts` edge cases** (I-01 through I-13) — extension-level coverage
4. **`targets/email.ts`** (E-01 through E-08) — most constrained medium
5. **`color.ts` edge cases** (C-01 through C-09) — low-priority polish

### Phase 2 — E2E skill pipeline tests

6. **Contrast math** (E2E-06 through E2E-09) — computable, deterministic
7. **Golden-file pipelines** (E2E-04, E2E-05) — research → system → export
8. **Cross-skill consistency** (E2E-10, E2E-19, E2E-20, E2E-22) — reference integrity
9. **Template validation** (E2E-12 through E2E-17, E2E-21, E2E-23 through E2E-25)

### Phase 3 — Infrastructure

10. **Skill metadata** (INF-01 through INF-04) — read-only validation
11. **Package integrity** (INF-05 through INF-09) — build-time checks
