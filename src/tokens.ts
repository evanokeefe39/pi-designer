/**
 * Design-token model and builder.
 *
 * A `DesignTokens` object is the single source of truth that every target
 * exporter consumes. The builder turns a small, human-friendly brief into a
 * complete token set using the color and scale engines.
 */

import { type Ramp, generateNeutralRamp, generateRamp } from "./color";
import { type TypeStep, spacingScale, typeScale } from "./scale";

export interface Typography {
	fontFamilies: {
		heading: string;
		body: string;
		mono: string;
	};
	scale: Record<string, TypeStep>;
}

export interface DesignTokens {
	/** Human-readable design-system name. */
	name: string;
	/** Named color ramps (brand, accent, neutral, …) keyed by ramp name. */
	colors: Record<string, Ramp>;
	typography: Typography;
	/** Spacing scale in rem, keyed by step. */
	spacing: Record<string, string>;
	/** Border-radius tokens. */
	radii: Record<string, string>;
	/** Box-shadow tokens. */
	shadows: Record<string, string>;
}

/** Input brief for {@link buildDesignTokens}. Only `name` and `brand` required. */
export interface DesignBrief {
	name: string;
	/** Primary brand color, hex. */
	brand: string;
	/** Optional secondary/accent color, hex. */
	accent?: string;
	/** Optional hue to tint neutrals toward, hex. Omit for pure gray. */
	neutralTint?: string;
	/** Type-scale ratio (default 1.25). */
	typeRatio?: number;
	fontHeading?: string;
	fontBody?: string;
	fontMono?: string;
}

const DEFAULT_HEADING = "Inter, system-ui, sans-serif";
const DEFAULT_BODY = "Inter, system-ui, sans-serif";
const DEFAULT_MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";

/** Static radius tokens — sensible defaults shared by all systems. */
const RADII: Record<string, string> = {
	none: "0",
	sm: "0.125rem",
	md: "0.375rem",
	lg: "0.5rem",
	xl: "0.75rem",
	"2xl": "1rem",
	full: "9999px",
};

/** Static shadow tokens. */
const SHADOWS: Record<string, string> = {
	sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
	md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
	lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
	xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
};

/**
 * Build a complete design-token set from a brief.
 *
 * Precondition: `brief.brand` (and `accent`/`neutralTint` if given) are valid
 * hex colors — {@link generateRamp} throws otherwise.
 */
export function buildDesignTokens(brief: DesignBrief): DesignTokens {
	const colors: Record<string, Ramp> = {
		brand: generateRamp(brief.brand),
		neutral: generateNeutralRamp(brief.neutralTint ?? brief.brand),
	};
	if (brief.accent) {
		colors.accent = generateRamp(brief.accent);
	}

	return {
		name: brief.name,
		colors,
		typography: {
			fontFamilies: {
				heading: brief.fontHeading ?? DEFAULT_HEADING,
				body: brief.fontBody ?? DEFAULT_BODY,
				mono: brief.fontMono ?? DEFAULT_MONO,
			},
			scale: typeScale(brief.typeRatio ?? 1.25),
		},
		spacing: spacingScale(),
		radii: { ...RADII },
		shadows: { ...SHADOWS },
	};
}
