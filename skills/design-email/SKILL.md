---
name: design-email
description: Produce a finished email (subject + sections + CTA, inline styles only, MSO-safe) from the design system — a Layer 4 deliverable.
---

# Design Email

Use this skill when the user wants to **produce a finished HTML email** from
their design system — after `design-system` has exported the email template
(`email-template.html` + `email-tokens.json`). Email is the most constrained
medium: no rem, no CSS variables, no Flexbox/Grid, table-based layout,
inline styles only, MSO (Outlook) compatibility.

This is a Layer 4 deliverable. In its ideal form it composes L1 components
resolved to inline styles; the intermediate v1 (this version) inlines token
values directly.

## Workflow

### 1. Get the brief

Ask the user:

- **Email type** — newsletter, transactional, promotional, onboarding,
  announcement, re-engagement.
- **Audience** — who receives it?
- **Subject line** — the thing that gets opened. ≤ 50 chars, no spam words.
- **Preheader** — the preview text next to the subject. ≤ 100 chars.
- **Key message(s)** — what's the one thing the reader should take away?
- **CTA** — what action, where, how many CTAs (one is best).

If `design-brand-voice` has been run, read `brand-voice.md` for copy tone.

### 2. Read the design system

From the exported email target (default `design-system/`):

- `email-tokens.json` — resolved px/hex values ready for inline use:
  ```json
  {
    "colors": { "brand": { "50": "#eef2ff", ..., "600": "#4f46e5", "950": "#1e1b4b" } },
    "typography": { "heading": { "fontFamily": "Outfit, Arial, sans-serif" }, ... },
    "spacing": { "4": "16px", "6": "24px", "8": "32px" },
    "radii": { "md": "8px" }
  }
  ```
- `email-template.html` — table-based shell with `<!-- CONTENT -->`
  placeholder.

If the email export doesn't exist, ask the user to run `design-system` with
`targets: ["email"]` first.

### 3. Build the email structure

Every email needs these sections, top to bottom:

```
┌──────────────────────────┐
│  Preheader (hidden)      │  ← display:none, gets preview text
├──────────────────────────┤
│  HEADER                  │  ← logo/wordmark + optional tagline
├──────────────────────────┤
│  HERO                    │  ← headline + subtext + optional image
├──────────────────────────┤
│  BODY BLOCK 1            │  ← main message, can be text or multi-column
├──────────────────────────┤
│  BODY BLOCK 2 (optional) │  ← secondary message, feature, testimonial
├──────────────────────────┤
│  CTA                     │  ← bulletproof button (not an image)
├──────────────────────────┤
│  DIVIDER                 │  ← thin line, token color
├──────────────────────────┤
│  FOOTER                  │  ← unsubscribe, address, social icons
└──────────────────────────┘
```

### 4. Email rules (non-negotiable)

**Styling:**
- Inline styles only — `style="..."` on every element. No `<style>` blocks
  (Gmail strips them in some clients).
- No rem, no CSS variables, no `calc()`. All values are px or hex.
- No Flexbox, no Grid. Use `<table>` for layout.
- Background colours on `<td>`, not `<div>`.
- Font stack: always end with a web-safe fallback —
  `font-family: Outfit, Arial, Helvetica, sans-serif`.

**Bulletproof button (CTA):**
```html
<!-- ponytail: the only reliable CTA button across all email clients -->
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
  <tr>
    <td align="center" style="background-color: #4f46e5; border-radius: 8px; padding: 12px 32px;">
      <a href="https://example.com" target="_blank" style="color: #ffffff; font-size: 16px; font-family: Outfit, Arial, sans-serif; font-weight: 600; text-decoration: none; display: inline-block; line-height: 1.4;">
        Start building →
      </a>
    </td>
  </tr>
</table>
```

**Images:**
- Always `display:block; border:0; max-width:100%;` on `<img>`.
- Always `alt` text — many clients block images by default.
- Don't rely on images for the CTA or critical text.

**MSO (Outlook) quirks:**
- Wrap in `<!--[if mso]><table><tr><td><![endif]-->` / `<!--[if mso]></td></tr></table><![endif]-->`
  for Outlook-specific width constraints.
- Outlook ignores `border-radius` on `<td>` — use it on the `<a>` inside.
- Outlook ignores `max-width` — use `width` on the outer table.

### 5. Copy reference

If `brand-voice.md` exists, follow its content rules. Defaults:
- Scannable: short paragraphs, bold key phrases, bullet lists.
- One CTA per email — two maximum if they're the same action.
- Subject line: action-oriented, no ALL CAPS, no "FREE!!!".

### 6. Output

Write the filled email as `email.html`. Merge the section markup into the
`email-template.html` shell (replace `<!-- CONTENT -->`). Every element has
`style="..."` attributes with resolved px/hex values from `email-tokens.json`.

### 7. Hand off

> "Email ready at `email.html`. Subject: '[subject]'. Test in Litmus or
> Email on Acid before sending to production."

## Depends on

- `design-system` — for the email template and resolved tokens (required).
- `design-brand-voice` — for copy tone (optional, defaults applied).
- `design-components` (L1) — for clean composition (v1 inlines; upgrade tracked in `ISSUES.md`).

## Related

- `design-carousel`, `design-report` — sibling L4 deliverable skills.
- `design-accessibility` — check contrast on email elements.
- `../../knowledge/resources.md` — no email-specific tools curated yet.
