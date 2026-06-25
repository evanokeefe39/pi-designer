---
name: design-icons
description: Build or source a style-consistent icon set (stroke weight, grid, corner radius) matching the brand — the Layer 1b atom subset.
---

# Design Icons

Use this skill when the user needs an **icon set that matches their brand** —
after `design-system` has tokens and the brand direction is clear. Icons are
a special atom subset (Layer 1b) because a set must be coherent: same stroke
weight, same grid, same corner radius. Piecemeal icons look broken.

Do NOT use this to grab a one-off icon — that's trivial. Use this when the
user needs a full set for their project.

## Workflow

### 1. Pick the icon family

Match the family to the brand mood. Read `../../knowledge/resources.md` → UI
Component Libraries → React Icons for the available sets.

| Brand mood | Icon family | Style |
|-----------|------------|-------|
| Modern, clean, SaaS | **Lucide** | Outline, consistent 24px grid, MIT license |
| Friendly, playful | **Phosphor** | Six weights per icon, rounded and friendly |
| Minimal, premium | **Heroicons** (v2) | Outline + solid, 24px, Tailwind-native |
| Developer, technical | **Feather** | Thin stroke (1.5px), minimal, 24px |
| Enterprise, formal | **Material (Outlined)** | Google's system, very complete, 24dp |
| Creative, editorial | **Tabler** | 2px stroke, many unique icons, MIT |

If none fit, the user can commission custom SVGs — same rules below apply.

### 2. Choose the icon roster

List the icons the project actually needs. Don't grab the full 1,000-icon
set — pick ~30–60 that cover every affordance:

| Category | Typical icons |
|----------|--------------|
| **Navigation** | home, search, menu, arrow-left, arrow-right, chevron-down, x (close), plus |
| **Actions** | edit, delete, copy, download, upload, share, bookmark, settings, filter |
| **Feedback** | check-circle, alert-triangle, info, x-circle, loader, external-link |
| **Content** | image, file, folder, link, map-pin, calendar, clock, user, mail, phone |
| **Social** | github, twitter, linkedin, youtube, instagram (only the ones the brand uses) |
| **Commerce** | shopping-cart, credit-card, truck, tag, percent, gift |

The agent should enumerate the set in a `icons.ts` file:

```ts
// icons.ts — the project's icon roster, all from one family
export {
  Home, Search, Menu, ArrowLeft, ArrowRight, ChevronDown, X, Plus,
  Edit, Trash2 as Delete, Copy, Download, Upload, Share, Bookmark, Settings, Filter,
  CheckCircle, AlertTriangle, Info, XCircle, Loader, ExternalLink,
  Image, File, Folder, Link, MapPin, Calendar, Clock, User, Mail, Phone,
  Github, Twitter, Linkedin, Youtube, Instagram,
  ShoppingCart, CreditCard, Truck, Tag, Percent, Gift,
} from "lucide-react";
```

### 3. Enforce consistency

Write an `IconWrapper` component that normalises every icon to the same
dimensions and stroke. This is the single point of control — if you change
the wrapper, every icon updates.

```tsx
// icon-wrapper.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

interface IconWrapperProps {
  icon: React.ElementType;
  className?: string;
  size?: number; // default 20 — match the component size scale
}

export function Icon({ icon: IconComponent, className, size = 20 }: IconWrapperProps) {
  return (
    <IconComponent
      className={cn("shrink-0 text-current", className)}
      size={size}
      strokeWidth={2} // ponytail: constant across set. Change once here.
      aria-hidden="true"
    />
  );
}
```

Use `<Icon icon={Search} />` everywhere instead of raw `<Search />`.

### 4. Size mapping

Map icon sizes to the component size scale so icons and text stay proportional:

| Component size | Icon size |
|---------------|-----------|
| `sm` | 16px |
| `md` (default) | 20px |
| `lg` | 24px |

The `Icon` component's default (20px) pairs with `md` components.

### 5. Output

If the project already has `components/ui/` from `design-components`, write
`components/ui/icon-wrapper.tsx` and `components/ui/icons.ts` there. Add
`Icon` to the barrel export.

If starting fresh, create the files wherever the project keeps its shared UI.

### 6. Hand off

> "Icon set ready at `components/ui/icons.ts`. All icons use the `Icon`
> wrapper — consistent 20px default, stroke 2, one family. Components and
> patterns can import from the roster directly."

## Depends on

- `design-system` — for brand tokens (the icon family choice follows the mood).
- `design-research` — for the brand direction that picks the family.
- `../../knowledge/resources.md` → React Icons.

## Related

- `design-components` — components use icons for affordances (Button icon-left, Input icon).
- `design-patterns` — patterns use icons in nav, empty states, alerts.
