---
name: design-accessibility
description: Cross-cutting WCAG accessibility audit — contrast at L0, focus/semantics at L1, keyboard/motion at L2 — with per-layer pass/fail and suggested fixes.
---

# Design Accessibility

Use this skill when the user wants to **audit their design system for
accessibility** — after tokens (L0), components (L1), and patterns (L2)
exist. Accessibility is not a separate deliverable; it's a constraint checked
against every layer. This skill does the check, reports per-layer
pass/fail, and suggests fixes.

Run this after `design-system` (minimum — contrast check) or after the
full L0/L1/L2 stack is built for a complete audit.

## Workflow

### 1. Layer 0 — Contrast audit

Read the token file (`tokens.css` or the `build_design_system` output). For
every text-on-surface color pair, compute the WCAG contrast ratio.

**The math:** relative luminance → contrast ratio (L1 + 0.05) / (L2 + 0.05).
Use the standard sRGB → linear formula. Do not guess.

**Check these pairs** at minimum:

| Text role | Text stop | Surface stop |
|-----------|----------|--------------|
| Body on white | `neutral-900` | `neutral-50` |
| Body on brand | `neutral-50` | `brand-600` |
| Subtle text | `neutral-500` | `neutral-50` |
| Muted on brand | `neutral-300` | `brand-600` |
| Brand on dark | `brand-400` | `neutral-900` |
| Accent on white | `accent-600` | `neutral-50` |
| Link text | `brand-600` | `neutral-50` |
| Error text | `#dc2626` | `neutral-50` |

**Thresholds:**

| Level | Ratio | Applies to |
|-------|-------|-----------|
| AA body | ≥ 4.5:1 | Normal text (< 18pt / < 24px, or < 14pt bold) |
| AA large | ≥ 3:1 | Large text (≥ 18pt or ≥ 14pt bold) |
| AAA body | ≥ 7:1 | Normal text (enhanced) |
| AAA large | ≥ 4.5:1 | Large text (enhanced) |

For every pair that fails, suggest a fix: use a darker/lighter stop from the
same ramp. E.g. `brand-600` on `neutral-50` fails → try `brand-700`.

The agent writes a table:

```
| Pair | Text | Surface | Ratio | Threshold | Pass? | Fix |
|------|------|---------|-------|-----------|-------|-----|
| Body  | neutral-900 | neutral-50 | 16.2:1 | AA 4.5:1 | ✅ | — |
| Body on brand | neutral-50 | brand-600 | 3.8:1 | AA 4.5:1 | ❌ | Use neutral-50 on brand-700 (5.6:1) |
```

### 2. Layer 1 — Component audit

Read the component files from `components/ui/`. Check every interactive
component:

| Check | What to look for |
|-------|-----------------|
| **Focus rings** | Every interactive element (Button, Input, Select, Checkbox, Radio, Switch) has a visible `focus-visible` ring. No `outline: none` without a replacement. |
| **Keyboard activation** | Buttons fire on `Enter` and `Space`. Links fire on `Enter`. Custom controls (Switch, Tabs) respect `Arrow` keys. |
| **Touch target** | Interactive elements ≥ 44×44px (WCAG 2.5.5) or have enough padding to hit that. |
| **Semantic roles** | Button is `<button>`, not `<div onclick>`. Inputs have `<label>` associated via `htmlFor`/`id`. |
| **Disabled state** | Disabled elements use the `disabled` attribute and `aria-disabled`, not just opacity. |

Report each violation with the file, line, and fix.

### 3. Layer 2 — Pattern audit

Read the pattern files from `patterns/`. Check:

| Check | What to look for |
|-------|-----------------|
| **Keyboard nav** | Tab order follows visual order. No keyboard traps (modal closes on `Escape`, focus returns to trigger). |
| **ARIA labels** | Icon-only buttons have `aria-label`. Forms have accessible error messages (`aria-describedby` linking to the error). |
| **Error identification** | Form errors are not indicated by colour alone — include text and `aria-invalid`. |
| **Reduced motion** | Any animation/transition is wrapped in `@media (prefers-reduced-motion: no-preference)`. |
| **Heading hierarchy** | Headings don't skip levels (no `<h1>` → `<h3>`). |

Patterns that render data-dependent content (DataTable, ActivityFeed) must
include loading, empty, and error states — an empty screen with no message
is an accessibility failure.

### 4. Produce the audit report

Write an `accessibility-report.md` with:

```markdown
# Accessibility Audit — [Project]

## Summary
- L0 (Contrast): X/Y pairs pass AA
- L1 (Components): X violations
- L2 (Patterns): X violations

## L0 — Contrast
| Pair | Ratio | Pass? | Fix |
|------|-------|-------|-----|
| ... | ... | ... | ... |

## L1 — Components
| File | Violation | Fix |
|------|-----------|-----|
| ... | ... | ... |

## L2 — Patterns
| File | Violation | Fix |
|------|-----------|-----|
| ... | ... | ... |
```

### 5. Hand off

> "Accessibility audit complete. Report at `accessibility-report.md`.
> X violations total — address per-layer before shipping."

## Depends on

- `design-system` (L0) — the contrast math uses the generated color ramps.
- `design-components` (L1) — what's being checked.
- `design-patterns` (L2) — what's being checked.

## Related

- `../../knowledge/principles.md` → Cognitive biases (bias-aware UX informs accessible patterns).
- Every deliverable skill (`design-carousel`, `design-email`, `design-report`) should be run through this before shipping.
