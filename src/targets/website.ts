/** Website target: CSS custom properties + Tailwind v4 `@theme` block. */

import type { DesignTokens } from "../tokens";
import type { OutputFile } from "./index";
import { cssVariableLines, fileHeader } from "./shared";

function tokensCss(tokens: DesignTokens): string {
	return `${fileHeader(tokens, "website")}\n:root {\n${cssVariableLines(tokens).join("\n")}\n}\n`;
}

/**
 * Tailwind v4 reads design tokens from an `@theme` block; variable names there
 * (`--color-*`, `--font-*`, `--text-*`, `--spacing-*`, `--radius-*`,
 * `--shadow-*`) generate matching utility classes automatically.
 */
function tailwindTheme(tokens: DesignTokens): string {
	const lines: string[] = [];
	for (const [name, ramp] of Object.entries(tokens.colors)) {
		for (const [stop, hex] of Object.entries(ramp)) {
			lines.push(`  --color-${name}-${stop}: ${hex};`);
		}
	}
	lines.push(`  --font-heading: ${tokens.typography.fontFamilies.heading};`);
	lines.push(`  --font-body: ${tokens.typography.fontFamilies.body};`);
	lines.push(`  --font-mono: ${tokens.typography.fontFamilies.mono};`);
	for (const [tname, step] of Object.entries(tokens.typography.scale)) {
		lines.push(`  --text-${tname}: ${step.size};`);
	}
	for (const [key, value] of Object.entries(tokens.spacing)) {
		// Tailwind v4 uses --spacing-* as the namespace.
		lines.push(`  --spacing-${key.replace(".", "_")}: ${value};`);
	}
	for (const [key, value] of Object.entries(tokens.radii)) {
		lines.push(`  --radius-${key}: ${value};`);
	}
	for (const [key, value] of Object.entries(tokens.shadows)) {
		lines.push(`  --shadow-${key}: ${value};`);
	}
	return `${fileHeader(tokens, "website / Tailwind v4")}\n@theme {\n${lines.join("\n")}\n}\n`;
}

export function websiteTarget(tokens: DesignTokens): OutputFile[] {
	return [
		{ path: "tokens.css", content: tokensCss(tokens) },
		{ path: "tailwind-theme.css", content: tailwindTheme(tokens) },
	];
}
