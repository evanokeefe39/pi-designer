# Plan: pi-designer v0.1

## Intent
Give the pi coding agent the ability to generate complete, multi-medium design
systems from a brand brief, so a user can go from one color to production-ready
tokens for websites, reports, carousels, and email without leaving the agent.

## Context Package
### Relevant existing code
- New repo. Conventions taken from pi (`badlogic/pi-mono`, scope `@earendil-works/*`):
  extensions are `.ts` modules exporting `default (pi: ExtensionAPI)`, loaded via
  jiti (no build), declared in package.json `"pi"` block, git-installable.

### Architectural constraints
- No build step; distribute `.ts` source.
- Runtime deps in `dependencies` (pi installs `--omit=dev`); pi packages are peers.
- Color math in OKLCH (perceptually uniform; matches Tailwind v4 and ColorRamp).

### Prior decisions (this session)
- Distribution: git install. Scope: token engine + exporters. License: MIT.

### Anti-patterns to avoid
- Overproduction: only the four mediums asked for; no speculative config.
- Hand-rolled HSL ramps (perceptually uneven) — rejected in favor of OKLCH.

## Behavioral Contracts
- GIVEN a valid hex, WHEN generate_palette runs, THEN it returns 11 valid hex
  stops, monotonically darker, hue preserved across the chromatic mid-range.
- GIVEN a brief, WHEN build_design_system runs, THEN it returns colors (brand,
  neutral, optional accent), typography, spacing, radii, shadows.
- GIVEN tokens + targets, WHEN export_design_system runs, THEN per-target files
  are written under outDir.
- GIVEN target=website, THEN output contains CSS vars and a Tailwind `@theme`.
- GIVEN target=email, THEN output uses px/hex only — no rem, no CSS variables.

## Edge Case Inventory
- Shorthand hex (#abc) → expanded. (test)
- Invalid hex → throws. (test)
- Out-of-gamut OKLCH → chroma reduced, hue/lightness preserved. (test)
- Modular ratio <= 0, spacing base <= 0 → throw. (test)
- Malformed tokens JSON in export → reported, nothing written. (handled in tool)
- Existing design-brief.json → /design-system does not clobber it. (wx flag)

## Definition of Done
- [x] All behavioral contracts have tests
- [x] All edge cases have tests or explicit handling
- [x] Linter passes with zero warnings
- [x] No undocumented dependencies (only `typebox` runtime; pi packages peer)
- [x] Reasoning trace written (below)
- [x] Assumption log written (below)
- [x] This plan updated and items marked complete
- [x] Public repo created with master protection, squash-only, linear history

## Negative Space
- Out of scope for v0.1: dark-mode variants, contrast auto-checking, Figma/Style
  Dictionary export, font loading, image generation.
- Reserved for humans: brand/creative choices (the model proposes, user decides).

## Open Questions
(empty)

## Reasoning Trace
- OKLCH over HSL: HSL lightness is not perceptually uniform, so equal-step ramps
  look uneven. OKLCH gives even ramps and matches the tools users already know
  (Tailwind v4, ColorRamp). Cost: ~120 lines of color-space math, no dependency.
- Gamut mapping by chroma binary-search keeps hue stable when a requested
  lightness/chroma falls outside sRGB — better than naive RGB clipping which
  shifts hue.
- Pure serializers returning `OutputFile[]`, with disk I/O isolated in the tool
  (poka-yoke: I/O behind a boundary, serializers stay testable without a fs).
- No color library dependency: avoids the dev/prod dependency pitfall entirely
  and keeps the install tiny.

## Assumption Log
- Tool `execute` signature ordered `(id, params, signal, onUpdate, ctx)` per the
  canonical extensions.md; the examples README shows a different order. Verified
  against installed `@earendil-works/pi-coding-agent` types before finalizing.
- `master` (not `main`) as the default branch, per the explicit request.
- npm scope not reserved; distribution is git-only for v0.1 (publish deferred).

## Review
v0.1 complete. Token engine (OKLCH ramps, modular scales) + four exporters
(website, report, carousel, email) implemented, tested, linted, type-checked.
Repo public with master protection (PR required, linear history, squash-only).
