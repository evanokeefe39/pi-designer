# pi-designer

A [pi coding-agent](https://github.com/badlogic/pi-mono) extension for building **design systems** — from one brand color to a complete, multi-medium token set for **websites, reports, social carousels, and email newsletters**.

The model makes the creative calls (palette direction, voice, layout). pi-designer does the deterministic work: perceptually-even color ramps, modular type and spacing scales, and faithful per-medium exporters.

## Why

Most design-token tools are browser apps that only target the web. pi-designer lives in your agent/terminal and exports for four mediums that each have different rules — print color fidelity, fixed carousel canvases, inline-only email. Color ramps use the **OKLCH** color space (perceptually uniform, the same approach as Tailwind v4) so every stop reads as one coherent hue.

## Install

pi-designer is a git-installable pi package — no build step, no npm publish:

```bash
pi install git:github.com/evanokeefe39/pi-designer
```

Or, for local development, point pi at the checkout:

```bash
pi -e ./src/index.ts
```

## Usage

Run the command to scaffold a brief and learn the workflow:

```
/design-system
```

Then just talk to the agent. It has four tools:

| Tool | What it does |
| --- | --- |
| `generate_palette` | 11-stop (50–950) OKLCH ramp from a base hex color |
| `generate_scale` | Modular type scale (xs–5xl) or spacing scale |
| `build_design_system` | Full token set (colors, type, spacing, radii, shadows) from a brief |
| `export_design_system` | Write tokens to per-target files on disk |

Example prompt:

> Build a design system called "Acme" with brand color #4f46e5 and accent #f59e0b, then export it for website and email into ./design-system.

### Output per target

- **website** — `tokens.css` (CSS custom properties) + `tailwind-theme.css` (Tailwind v4 `@theme`)
- **report** — `report.css` (A4 `@page`, point sizing, `print-color-adjust: exact`, page-break helpers)
- **carousel** — `carousel.json` (canvas sizes + safe areas for IG/Story/LinkedIn) + `slide-template.html`
- **email** — `email-tokens.json` (resolved px/hex values) + `email-template.html` (table-based, inline styles only)

## Development

```bash
npm install
npm run check   # tsc type-check
npm run lint    # biome
npm test        # vitest
```

## License

[MIT](./LICENSE)
