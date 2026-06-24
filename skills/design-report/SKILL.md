---
name: design-report
description: Produce a finished report/PDF from the design system — filled content, print fidelity, A4 @page — a Layer 4 deliverable.
---

# Design Report

Use this skill when the user wants to **produce a finished report or PDF**
from their design system — after `design-system` has exported the report
template (`report.css`). Reports target print: A4 pages, `@page` rules,
`print-color-adjust: exact`, page-break helpers, point sizing.

This is a Layer 4 deliverable. In its ideal form it composes L1 components
and L2 patterns; the intermediate v1 (this version) inlines token values.

## Workflow

### 1. Get the brief

Ask the user:

- **Report type** — annual, research, proposal, white paper, case study,
  investor update.
- **Audience** — who reads it, what they need from it.
- **Sections** — the outline (cover, TOC, body sections, appendices).
- **Data** — tables, charts, figures to include. Where does the data live?
- **Tone** — formal/academic, executive/business, editorial/story-driven.

If `design-brand-voice` has been run, read `brand-voice.md` for tone.

### 2. Read the design system

From the exported report target (default `design-system/`):

- `report.css` — print stylesheet with `@page` A4, point sizing,
  `print-color-adjust: exact`, page-break helpers. Read it to understand
  the available print classes.
- `tokens.css` (or equivalent) — CSS custom properties for colours,
  typography, spacing.

If the report export doesn't exist, ask the user to run `design-system`
with `targets: ["report"]` first.

### 3. Build the report structure

A report page is an A4 canvas (210mm × 297mm, or 595pt × 842pt at 72dpi).
Structure each section as a standalone page or page group:

```
┌─────────────────────┐
│  COVER              │  title, subtitle, date, author, brand
├─────────────────────┤
│  TABLE OF CONTENTS  │  auto-generated from headings
├─────────────────────┤
│  EXECUTIVE SUMMARY  │  key findings, one page max
├─────────────────────┤
│  BODY SECTION 1     │  h2 + paragraphs + figure/caption
├─────────────────────┤
│  BODY SECTION 2     │  h2 + data table + stat highlights
├─────────────────────┤
│  …                  │
├─────────────────────┤
│  CONCLUSION         │  summary + recommendations
├─────────────────────┤
│  APPENDICES         │  data sources, methodology, glossary
└─────────────────────┘
```

### 4. Report rules

**Print sizing:**
- Body: 10–11pt. Use `pt`, not `px` or `rem`.
- Headings: 14–24pt, descending by level (h1 > h2 > h3).
- Margins: 2cm all sides (or 1in). Mirror margins for binding:
  `@page { margin-left: 2.5cm; margin-right: 2cm; }`
- Line height: 1.5–1.6 for body text, 1.2 for headings.

**Page breaks:**
```
.page-break { page-break-before: always; }
.avoid-break { page-break-inside: avoid; }
```
- New section = new page.
- Tables under 10 rows: `page-break-inside: avoid`.
- Figures with captions: wrap in `avoid-break`.
- Widow/orphan control: `p { widows: 3; orphans: 3; }`

**Print colour:**
- Use `print-color-adjust: exact` so brand colours survive the printer.
- No `var()` — resolve token values to hex/pt in the output. Print
  stylesheets can technically use CSS variables in modern browsers, but
  PDF renderers are inconsistent. Inline the resolved values.
- Avoid dark backgrounds for body pages (ink cost, readability).

**Accessibility (print):**
- All images get `alt` text (screen readers in PDF).
- Tables have `<thead>`, `<th scope="col">`, `<caption>`.
- Headings form a logical hierarchy.

### 5. Patterns reference (report-native)

These are report-specific patterns not covered by the general L2 pattern
library — the agent inlines them unless `design-patterns` has been run.

| Pattern | Structure | Print note |
|---------|-----------|-----------|
| **Cover page** | title + subtitle + date + author + brand mark, vertically centred | Full-bleed brand colour background OK here |
| **TOC** | auto-generated from `h1`–`h3` with dot leaders and page numbers | `page-break-after: always` |
| **Stat highlight** | big number + label + optional trend arrow | `avoid-break`, keep on same page as context |
| **Data table** | `<thead>` + `<tbody>`, alternating row fill, column alignment | `font-size: 9pt`, horizontal rules only |
| **Figure + caption** | image/chart + `figcaption` below | `avoid-break`, centre on page |
| **Pull quote** | large quote + attribution, indented | `font-size: 14pt`, brand colour, `avoid-break` |
| **Side comment / callout** | bordered box with note | `page-break-inside: avoid`, contrasting background |
| **Footnotes** | superscript in body, list at page bottom | use CSS `counter()` for auto-numbering |

### 6. Copy reference

If `brand-voice.md` exists, follow its content rules. Report defaults:
- Third person, formal but not stilted.
- Section headers are descriptive, not clever ("Q3 Revenue by Region", not
  "Show Me the Money").
- Acronyms defined on first use.

### 7. Output

Write the filled report as `report.html`. Merge sections into a single
HTML document with `<link rel="stylesheet" href="design-system/report.css">`
and inline the resolved token values where CSS variables aren't reliable
in print.

Test by opening in a browser and printing to PDF.

### 8. Hand off

> "Report ready at `report.html`. Open in browser → Print → Save as PDF.
> N pages, N sections."

## Depends on

- `design-system` — for the report CSS and tokens (required).
- `design-brand-voice` — for report tone (optional, defaults applied).
- `design-components`, `design-patterns` — for clean composition (v1 inlines; upgrade tracked in `ISSUES.md`).

## Related

- `design-carousel`, `design-email` — sibling L4 deliverable skills.
- `design-accessibility` — check contrast, table semantics, heading hierarchy.
- `knowledge/principles.md` → Print & texture concepts.
