---
name: design-patterns
description: Compose components into a pattern library (LoginForm, HeroSection, PricingTable, NavHeader…) — the Layer 2 building blocks that Layer 4 deliverables compose from.
---

# Design Patterns

Use this skill when the user wants to **build a pattern library from their
component library** — after `design-components` has produced the Layer 1
atoms (Button, Input, Card, etc.). Patterns are compositions of components
that solve recurring UX problems: a login form, a hero section, a pricing
table, a nav header. A pattern = components + layout + interaction + states.

Do NOT use this if no component library exists — run `design-components`
first.

## Workflow

### 1. Get the components

The component library should exist at `components/ui/` with a barrel export
(`index.ts`). Read it to know which components are available. If it doesn't
exist yet, run `design-components` first.

### 2. Identify the needed patterns

Ask the user which patterns they need, or default to the standard set for
their project type:

| Project type | Default patterns |
|-------------|-----------------|
| Web app / SaaS | LoginForm, SignUpForm, NavHeader, Footer, EmptyState, ErrorState, DataTable, SettingsForm |
| Landing page | HeroSection, FeatureGrid, PricingTable, TestimonialRow, FAQ, CTA banner, Footer |
| Dashboard | StatGrid, DataTable, FilterBar, TabPanel, ActivityFeed |

### 3. Define each pattern

For each pattern, write a single `.tsx` file containing:

- **Layout** — the arrangement of components (flex, grid, fixed),
  responsive at `sm`/`md`/`lg` breakpoints.
- **Composition** — which L1 components, how they're arranged.
- **States** — loading (skeleton), empty, error, success. Every
  data-dependent pattern gets all four states.
- **Interaction** — form validation, keyboard nav, focus order.
- **Tokens** — spacing and typography reference the design-system CSS variables.

Structure each pattern file:

```tsx
// patterns/hero-section.tsx
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  headline: string;
  subtext: string;
  ctaLabel: string;
  ctaHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  className?: string;
}

export function HeroSection({
  headline,
  subtext,
  ctaLabel,
  ctaHref = "#",
  secondaryLabel,
  secondaryHref = "#",
  className,
}: HeroSectionProps) {
  return (
    <section
      className={cn(
        "flex flex-col items-center justify-center gap-[var(--spacing-6)] px-[var(--spacing-4)] py-24 text-center md:py-32",
        className
      )}
    >
      <h1 className="font-[var(--font-heading)] text-4xl font-bold tracking-tight text-[var(--color-neutral-900)] md:text-6xl">
        {headline}
      </h1>
      <p className="max-w-[42rem] text-lg text-[var(--color-neutral-600)]">
        {subtext}
      </p>
      <div className="flex gap-[var(--spacing-4)]">
        <Button size="lg" asChild>
          <a href={ctaHref}>{ctaLabel}</a>
        </Button>
        {secondaryLabel && (
          <Button variant="ghost" size="lg" asChild>
            <a href={secondaryHref}>{secondaryLabel}</a>
          </Button>
        )}
      </div>
    </section>
  );
}
```

### Pattern reference

| Pattern | What it solves | Composes |
|---------|---------------|----------|
| **LoginForm** | email + password + submit + "forgot?" link | Input, Button, Label, Checkbox |
| **SignUpForm** | name + email + password + confirm + submit | Input, Button, Label |
| **HeroSection** | headline + subtext + primary CTA + optional secondary CTA | Button, Badge (optional eyebrow) |
| **PricingTable** | 3–4 columns: plan name, price, features, CTA | Card, Button, Badge, Icon |
| **NavHeader** | logo + nav links + optional CTA + mobile hamburger | Button, Icon |
| **Footer** | multi-column: links, social, copyright | Icon |
| **EmptyState** | icon + heading + description + action button | Icon, Button |
| **ErrorState** | icon + heading + description + retry button | Icon, Button |
| **DataTable** | sortable headers, row hover, pagination, loading/empty states | Card (wrapper), Input (search), Select (per-page), Badge |
| **StatGrid** | 2–4 stat cards in a grid | Card |
| **TestimonialRow** | quote + avatar + name + title in a card | Card, Avatar |
| **FAQ** | accordion of question + answer pairs | Button (toggle), Icon (chevron) |

### 4. Write the pattern files

Create a `patterns/` directory (or `components/patterns/`) and write each
pattern file. Include a barrel `patterns/index.ts` that re-exports
everything.

### 5. Accessibility checklist (per pattern)

Before considering a pattern done, the agent verifies:
- Keyboard navigation order is logical (Tab through).
- Icon-only buttons have `aria-label`.
- Form errors are announced (not just colour).
- States (loading, empty, error) are present for data-dependent patterns.
- Prefers `prefers-reduced-motion` for any animated entrance.

Full cross-layer accessibility audit is `design-accessibility` — this step
is a quick sanity check, not the full audit.

### 6. Hand off

> "Pattern library built at `patterns/`. Layer 4 deliverables
> (`design-carousel`, `design-email`, `design-report`) can compose from
> these patterns."

## Depends on

- `design-components` (L1) — patterns are built from components.
- `design-system` (L0) — tokens the components consume.

## Related

- `design-components` — Layer 1 atoms.
- `design-accessibility` — full cross-layer audit (keyboard, motion, contrast).
- `design-carousel`, `design-email`, `design-report` — L4 deliverables that compose these patterns.
