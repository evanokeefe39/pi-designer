# Issues

## ISSUE-001: Fill placeholder design-system skills (Layers 1–2, a11y, voice) ✅

All 5 placeholder skills implemented in v0.3:

| Skill | Layer | Gap it fills | Status |
|-------|-------|--------------|--------|
| `design-components` | L1 — components | component library (Button, Input, Card…) built from tokens | ✅ implemented |
| `design-icons` | L1b — icons | style-consistent icon set (sourced or custom) | ✅ implemented |
| `design-patterns` | L2 — patterns | pattern library (LoginForm, HeroSection…) composed of components | ✅ implemented |
| `design-accessibility` | cross-cutting | WCAG audit + fixes applied at every layer | ✅ implemented |
| `design-brand-voice` | cross-cutting (why) | brand values + tone of voice + content rules | ✅ implemented |

Each skill has a full actionable workflow the agent follows. Components
and patterns reference design-system tokens via CSS variables; deliverable
skills can optionally import them directly (with L1/L2 composition as the
upgrade path — see ISSUE-002).

The dependency chain is now complete: tokens (L0) → components + icons
(L1/L1b) → patterns (L2), with accessibility and brand voice cutting across
the stack.

---

## ISSUE-002: Layer 4 deliverable skills — v1 inlines, v2 composes

All three deliverable skills are now implemented:

| Skill | What it produces | Status |
|-------|-----------------|--------|
| `design-carousel` | filled multi-slide carousel (real copy + brand visuals, one idea per slide) | ✅ implemented (v1 — inlines token values) |
| `design-email` | finished email (subject + sections + CTA, inline styles only, MSO-safe) | ✅ implemented (v1 — inlines token values) |
| `design-report` | filled report/PDF (real content, A4, print fidelity) | ✅ implemented (v1 — inlines token values) |

**v1 approach:** each skill reads tokens from the design-system export
(`tokens.css`, `email-tokens.json`, etc.) and inlines them by value into
the deliverable. Functional, but duplicates style logic per deliverable.

**v2 upgrade path:** when a project has run `design-components` and
`design-patterns`, the deliverable skills should import those components
and patterns directly instead of inlining. Tracked as a future enhancement
— not a blocker for usage.