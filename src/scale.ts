/**
 * Modular scales for typography and spacing.
 *
 * A modular scale multiplies a base value by a ratio raised to an integer step:
 *   value(n) = base * ratio ** n
 * This produces harmonious, proportional sizes — the standard approach for type
 * scales (e.g. 1.25 "major third").
 */

const REM_BASE_PX = 16;

/** Round to a sensible precision for CSS rem values. */
function roundRem(px: number): number {
	return Math.round((px / REM_BASE_PX) * 1000) / 1000;
}

/**
 * Compute one step of a modular scale.
 * @param basePx base size in pixels
 * @param ratio scale ratio, must be > 0
 * @param step integer exponent (0 = base)
 * @throws {Error} when ratio <= 0
 */
export function modularStep(basePx: number, ratio: number, step: number): number {
	if (ratio <= 0) {
		throw new Error(`Modular scale ratio must be > 0, got ${ratio}.`);
	}
	return basePx * ratio ** step;
}

export interface TypeStep {
	/** Font size in rem (e.g. "1.25rem"). */
	size: string;
	/** Unitless line-height. */
	lineHeight: number;
}

/** Named type-scale steps mapped to their exponent relative to the base. */
const TYPE_STEPS: { name: string; step: number }[] = [
	{ name: "xs", step: -2 },
	{ name: "sm", step: -1 },
	{ name: "base", step: 0 },
	{ name: "lg", step: 1 },
	{ name: "xl", step: 2 },
	{ name: "2xl", step: 3 },
	{ name: "3xl", step: 4 },
	{ name: "4xl", step: 5 },
	{ name: "5xl", step: 6 },
];

/**
 * Larger text needs tighter line-height; body text needs looser. We interpolate
 * line-height down from 1.6 (small) toward 1.05 (display) as size grows.
 */
function lineHeightFor(step: number): number {
	const lh = 1.5 - step * 0.08;
	return Math.round(Math.min(1.6, Math.max(1.05, lh)) * 100) / 100;
}

/**
 * Build a typographic scale.
 * @param ratio modular ratio (default 1.25, a "major third")
 * @param basePx base font size in px (default 16)
 */
export function typeScale(ratio = 1.25, basePx = REM_BASE_PX): Record<string, TypeStep> {
	const out: Record<string, TypeStep> = {};
	for (const { name, step } of TYPE_STEPS) {
		out[name] = {
			size: `${roundRem(modularStep(basePx, ratio, step))}rem`,
			lineHeight: lineHeightFor(step),
		};
	}
	return out;
}

/**
 * A spacing scale on a fixed base unit. Keys mirror Tailwind's numeric spacing
 * (the number is multiples of the base step) for familiarity.
 */
const SPACING_MULTIPLES = [0, 0.5, 1, 2, 3, 4, 6, 8, 12, 16, 24, 32] as const;

/**
 * Build a spacing scale in rem.
 * @param baseStepPx the base spacing unit in px (default 4)
 * @throws {Error} when baseStepPx <= 0
 */
export function spacingScale(baseStepPx = 4): Record<string, string> {
	if (baseStepPx <= 0) {
		throw new Error(`Spacing base step must be > 0, got ${baseStepPx}.`);
	}
	const out: Record<string, string> = {};
	for (const m of SPACING_MULTIPLES) {
		const key = Number.isInteger(m) ? String(m) : String(m);
		out[key] = `${roundRem(baseStepPx * m)}rem`;
	}
	return out;
}
