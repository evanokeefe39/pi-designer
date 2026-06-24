---
name: design-brand-voice
description: Define brand values, tone of voice, and content guidelines — the "why" layer that sits above the visual stack and determines which tokens, components, and copy get chosen.
---

# Design Brand Voice

Use this skill when the user wants to **define their brand's voice and
values** — what the brand sounds like and why — before or alongside the
visual design system. A brand without a voice is a palette without a message.

Run this early; everything downstream (copy in deliverables, component tone,
even palette choices) leans on it.

## Workflow

### 1. Discover the brand's core

Ask the user three grounding questions:

- **What does your brand *do* and *for whom*?** (industry, audience, product)
- **If your brand were a person at a dinner party, how would they behave?**
  (this surfaces voice faster than abstract adjectives)
- **What brands do you admire — and what specifically about them?** (not the
  logo, the *feeling* they give)

### 2. Define the brand values

From the answers, distil 3–5 brand values — each a noun, each with a short
sentence that makes it actionable. Values are principles that align every
product and copy decision.

Format:
> **Value:** one-sentence test. "Does this copy/feature/decision honour X?"

Example:
- **Clarity.** Does it make the thing obvious, not clever?
- **Warmth.** Does it feel like a person wrote it?
- **Precision.** Does it say exactly what it means, no filler?

### 3. Define voice & tone attributes

Map each value to a voice attribute. For each attribute, give a **do/don't**
pair so the rule is concrete.

Format:
> **Attribute:** *do this* / *not this*

Example:
- **Warm but precise:** "Here's your report." / "We are pleased to furnish the requested analysis."
- **Confident, not loud:** "Try it free." / "THE BEST TOOL EVER MADE!!!!"
- **Playful, not childish:** "Oops, that didn't work." / "Uh-oh, you broke it, silly goose!"

Read `knowledge/principles.md` → Brand-system framework for the 5-layer
model — voice lives inside Layer 1 (Brand Identity) and feeds into Layer 4
(Guidelines).

### 4. Create content rules

Define the mechanical rules that keep copy consistent across every
touchpoint. Cover at minimum:

| Rule | Example |
|------|---------|
| **Person** | First ("we") or second ("you")? Always address the user directly? |
| **Case** | Sentence case for headlines ("Build faster") or title case ("Build Faster")? |
| **Punctuation** | Oxford comma? Em dashes or en dashes? |
| **Emoji** | Allowed? In headings only? Never? |
| **CTA style** | Action verb ("Start building") or benefit-first ("Get your first report free")? |
| **Headline length** | Max words per headline for each medium. |

### 5. Write the brand-voice doc

Produce a `brand-voice.md` file with these sections, ready to reference
by every downstream skill that writes copy:

```markdown
# [Brand] — Brand Voice

## Values
- **Value 1.** Test / reason.
- ...

## Voice attributes
| Attribute | Do | Don't |
|-----------|-----|-------|
| ... | ... | ... |

## Content rules
| Rule | Decision |
|------|----------|
| Person | ... |
| CTA style | ... |
| Headline max | ... |
| ...
```

### 6. Hand off

> "Brand voice defined. Downstream skills (`design-system`, `design-carousel`,
> `design-email`, `design-report`) can reference `brand-voice.md` for copy."

## Related

- `knowledge/principles.md` → Brand-system framework (5 layers).
- `design-system` — voice informs token mood (a "loud" brand picks different ramps).
- `design-carousel`, `design-email`, `design-report` — these write copy in this voice.
- `design-research` — if the user hasn't done research, run it first for the brand direction.
