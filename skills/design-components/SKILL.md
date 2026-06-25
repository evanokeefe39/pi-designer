---
name: design-components
description: Build a UI component library (Button, Input, Card, Badge…) from design tokens — the Layer 1 building blocks that Layer 2 patterns and Layer 4 deliverables compose from.
---

# Design Components

Use this skill when the user wants to **build a component library from their
design tokens** — after `design-system` has exported tokens (or the tokens are
in memory from `build_design_system`). Components are the smallest reusable
blocks: Button, Input, Card, Badge, Avatar, Tooltip, and more. Each component
is a token expression plus interaction behaviour.

Do NOT use this if no tokens exist yet — run `design-system` first.

## Workflow

### 1. Get the tokens

Tokens come from one of two sources:

- **On disk:** read `tokens.css` (CSS custom properties) and note the
  available variables: `--color-brand-*`, `--color-neutral-*`,
  `--font-heading`, `--font-body`, `--radius-*`, `--spacing-*`,
  `--shadow-*`. These are what the components reference.
- **In memory:** if `build_design_system` was just called, note the JSON
  output directly — color stops, type scale, spacing scale, radii, shadows.

The component library references tokens by their CSS variable names so
everything stays connected — change the token, the whole library updates.

### 2. Enumerate the needed components

Ask the user which components they need, or default to the standard set for
their project type:

| Project type | Default components |
|-------------|-------------------|
| Web app / SaaS | Button, Input, Textarea, Select, Checkbox, Radio, Switch, Card, Badge, Avatar, Tag, Divider, Spinner, Tooltip, Label, Alert, Modal |
| Landing page | Button, Input, Card, Badge, Avatar, Tag, Divider |
| Dashboard | all of SaaS + DataTable, Stat, ProgressBar, Tabs |

**Always include** at minimum: Button, Input, Card. Everything else composes
from these three.

### 3. Define each component

For each component, write a single `.tsx` file (or `.svelte`, `.vue` —
match the user's stack) containing:

- **Variants:** e.g. Button gets `primary`, `secondary`, `ghost`, `destructive`.
- **Sizes:** `sm`, `md`, `lg`. Map to the spacing scale.
- **States:** `default`, `hover`, `focus`, `disabled`, `loading` (where applicable).
- **Props:** TypeScript interface with sensible defaults.
- **Tokens:** every color, radius, spacing, font reference uses a CSS variable
  from the design system.

Use this structure for every component:

```tsx
// Button.tsx — ponytail: cva for variants, Tailwind for layout.
// If the project isn't Tailwind, switch to CSS modules or styled-components.
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-[var(--radius-md)] font-[var(--font-body)] text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-500)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--color-brand-600)] text-white hover:bg-[var(--color-brand-700)]",
        secondary:
          "bg-[var(--color-neutral-100)] text-[var(--color-neutral-900)] hover:bg-[var(--color-neutral-200)]",
        ghost:
          "text-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-100)]",
        destructive:
          "bg-red-600 text-white hover:bg-red-700",
      },
      size: {
        sm: "h-8 px-[var(--spacing-3)] text-xs",
        md: "h-10 px-[var(--spacing-4)] text-sm",
        lg: "h-12 px-[var(--spacing-6)] text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

export function Button({
  className,
  variant,
  size,
  loading,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Spinner className="mr-2" /> : null}
      {children}
    </button>
  );
}
```

### Token-to-CSS mapping

When writing components, map design-system tokens to CSS like this:

| Token | CSS variable |
|-------|-------------|
| Brand color stops | `var(--color-brand-50)` … `var(--color-brand-950)` |
| Neutral stops | `var(--color-neutral-50)` … `var(--color-neutral-950)` |
| Accent stops | `var(--color-accent-50)` … `var(--color-accent-950)` |
| Heading font | `var(--font-heading)` |
| Body font | `var(--font-body)` |
| Radii | `var(--radius-sm)`, `var(--radius-md)`, `var(--radius-lg)`, `var(--radius-xl)` |
| Spacing | `var(--spacing-1)` … `var(--spacing-16)` |
| Shadows | `var(--shadow-sm)`, `var(--shadow-md)`, `var(--shadow-lg)` |

If using Tailwind with the exported `tailwind-theme.css`, you can reference
tailwind classes directly (e.g. `bg-brand-600`, `text-neutral-50`) instead
of raw CSS variables — `export_design_system` generates the `@theme` block
that registers them.

### 4. Write the component files

Create a `components/ui/` directory (or whatever the project uses) and
write each component file. For dependencies (e.g. `Spinner` used in
`Button`), define the dependency first or stub it.

Also create a `components/ui/index.ts` barrel that re-exports everything:

```ts
export { Button, type ButtonProps } from "./button";
export { Input, type InputProps } from "./input";
export { Card, type CardProps } from "./card";
// ...
```

And a `lib/utils.ts` with `cn()` if it doesn't exist:

```ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
```

### 5. Document usage

For each component, note in a comment or a companion `components.md`:
- When to use it vs. a plain element
- Which variant to use in which context
- Accessibility notes (focus ring, aria labels, keyboard activation)

### 6. Hand off

> "Component library built at `components/ui/`. Layer 2 patterns
> (`design-patterns`) and Layer 4 deliverables (`design-carousel`,
> `design-email`, `design-report`) can import these directly."

## Depends on

- `design-system` — Layer 0 tokens must exist (on disk or in memory).

## Related

- `design-icons` — icons are a Layer 1b atom subset, import them into components.
- `design-patterns` — Layer 2, composes these components into layouts.
- `design-accessibility` — checks these for focus rings, contrast, semantics.
- `../../knowledge/resources.md` → UI Component Libraries — reference designs.
