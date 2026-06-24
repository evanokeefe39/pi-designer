/**
 * OKLCH-based color engine.
 *
 * We use the OKLCH color space (Björn Ottosson's OKLab in cylindrical form)
 * because it is perceptually uniform: stepping lightness produces visually even
 * ramps, unlike HSL. This matches the approach taken by Tailwind v4 and modern
 * palette tools (ColorRamp, Tailwind Theme Maker).
 *
 * References:
 *   https://bottosson.github.io/posts/oklab/
 */

/** RGB channels in the 0–255 range. */
export interface Rgb {
	r: number;
	g: number;
	b: number;
}

/** OKLCH color: lightness 0–1, chroma >= 0, hue in degrees 0–360. */
export interface Oklch {
	l: number;
	c: number;
	h: number;
}

/** Tailwind-style ramp stops, light to dark. */
export const RAMP_STOPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

export type RampStop = (typeof RAMP_STOPS)[number];

/**
 * Target OKLCH lightness per stop. Tuned to approximate Tailwind v4's ramps so
 * generated palettes feel familiar and contrast-balanced.
 */
const STOP_LIGHTNESS: Record<RampStop, number> = {
	50: 0.971,
	100: 0.936,
	200: 0.885,
	300: 0.808,
	400: 0.704,
	500: 0.637,
	600: 0.577,
	700: 0.505,
	800: 0.444,
	900: 0.396,
	950: 0.262,
};

/**
 * Chroma multiplier per stop. Extremes (very light / very dark) carry less
 * chroma to stay in the sRGB gamut and avoid muddy or neon-looking shades.
 */
const STOP_CHROMA_SCALE: Record<RampStop, number> = {
	50: 0.18,
	100: 0.3,
	200: 0.55,
	300: 0.78,
	400: 0.95,
	500: 1.0,
	600: 0.98,
	700: 0.9,
	800: 0.78,
	900: 0.65,
	950: 0.45,
};

const HEX_RE = /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

/**
 * Parse a hex string (`#abc`, `abc`, `#aabbcc`, `aabbcc`) into RGB.
 * @throws {Error} when the string is not a valid 3- or 6-digit hex color.
 *
 * Edge case (see inventory): short hex is expanded by doubling each nibble.
 */
export function hexToRgb(hex: string): Rgb {
	const match = HEX_RE.exec(hex.trim());
	if (!match) {
		throw new Error(`Invalid hex color: "${hex}". Expected #rgb or #rrggbb.`);
	}
	let body = match[1];
	if (body.length === 3) {
		// Edge case: expand shorthand (#abc -> #aabbcc).
		body = body
			.split("")
			.map((ch) => ch + ch)
			.join("");
	}
	return {
		r: Number.parseInt(body.slice(0, 2), 16),
		g: Number.parseInt(body.slice(2, 4), 16),
		b: Number.parseInt(body.slice(4, 6), 16),
	};
}

/** Serialize RGB back to a `#rrggbb` lowercase hex string. */
export function rgbToHex({ r, g, b }: Rgb): string {
	const channel = (v: number): string =>
		Math.round(clamp(v, 0, 255))
			.toString(16)
			.padStart(2, "0");
	return `#${channel(r)}${channel(g)}${channel(b)}`;
}

function clamp(value: number, min: number, max: number): number {
	return Math.min(max, Math.max(min, value));
}

// --- sRGB <-> linear-light transfer functions ---

function srgbToLinear(c: number): number {
	const cs = c / 255;
	return cs <= 0.04045 ? cs / 12.92 : ((cs + 0.055) / 1.055) ** 2.4;
}

function linearToSrgb(c: number): number {
	const cs = c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;
	return cs * 255;
}

// --- linear sRGB <-> OKLab (Ottosson matrices) ---

export function rgbToOklch(rgb: Rgb): Oklch {
	const r = srgbToLinear(rgb.r);
	const g = srgbToLinear(rgb.g);
	const b = srgbToLinear(rgb.b);

	const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
	const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
	const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);

	const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
	const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
	const bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;

	const c = Math.hypot(a, bb);
	let h = (Math.atan2(bb, a) * 180) / Math.PI;
	if (h < 0) h += 360;
	return { l: L, c, h };
}

/** Convert OKLCH to linear-light sRGB (0–1, unclamped). Internal helper. */
function oklchToLinearRgb({ l: L, c, h }: Oklch): { r: number; g: number; b: number } {
	const hr = (h * Math.PI) / 180;
	const a = c * Math.cos(hr);
	const b = c * Math.sin(hr);

	const l_ = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
	const m_ = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
	const s_ = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;

	return {
		r: 4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
		g: -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
		b: -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_,
	};
}

const GAMUT_EPSILON = 1e-4;

function inGamut(oklch: Oklch): boolean {
	const { r, g, b } = oklchToLinearRgb(oklch);
	const lo = -GAMUT_EPSILON;
	const hi = 1 + GAMUT_EPSILON;
	return r >= lo && r <= hi && g >= lo && g <= hi && b >= lo && b <= hi;
}

/**
 * Reduce chroma (keeping lightness and hue fixed) until the color fits inside
 * the sRGB gamut. Binary search converges quickly.
 *
 * Edge case (see inventory): out-of-gamut OKLCH values would otherwise clip to
 * desaturated or wrong-hue RGB; this keeps the hue stable.
 */
export function clampChroma(oklch: Oklch): Oklch {
	if (inGamut(oklch)) return oklch;
	let lo = 0;
	let hi = oklch.c;
	for (let i = 0; i < 24; i++) {
		const mid = (lo + hi) / 2;
		if (inGamut({ ...oklch, c: mid })) {
			lo = mid;
		} else {
			hi = mid;
		}
	}
	return { ...oklch, c: lo };
}

/** Convert OKLCH to RGB (0–255), gamut-mapped and clamped. */
export function oklchToRgb(oklch: Oklch): Rgb {
	const mapped = clampChroma(oklch);
	const lin = oklchToLinearRgb(mapped);
	return {
		r: clamp(linearToSrgb(lin.r), 0, 255),
		g: clamp(linearToSrgb(lin.g), 0, 255),
		b: clamp(linearToSrgb(lin.b), 0, 255),
	};
}

export function oklchToHex(oklch: Oklch): string {
	return rgbToHex(oklchToRgb(oklch));
}

export function hexToOklch(hex: string): Oklch {
	return rgbToOklch(hexToRgb(hex));
}

/** A full color ramp: stop -> hex string. */
export type Ramp = Record<RampStop, string>;

/**
 * Generate an 11-stop ramp (50–950) from a base color. The base color's hue is
 * preserved across every stop; lightness and chroma follow the tuned curves
 * above so the ramp reads as one coherent hue from tint to shade.
 */
export function generateRamp(baseHex: string): Ramp {
	const base = hexToOklch(baseHex);
	const ramp = {} as Ramp;
	for (const stop of RAMP_STOPS) {
		const oklch: Oklch = {
			l: STOP_LIGHTNESS[stop],
			c: base.c * STOP_CHROMA_SCALE[stop],
			h: base.h,
		};
		ramp[stop] = oklchToHex(oklch);
	}
	return ramp;
}

/**
 * Generate a low-chroma neutral ramp. If `tintHex` is given, neutrals are
 * subtly tinted toward that hue (a common design-system technique); otherwise
 * pure gray.
 */
export function generateNeutralRamp(tintHex?: string): Ramp {
	const hue = tintHex ? hexToOklch(tintHex).h : 0;
	const ramp = {} as Ramp;
	for (const stop of RAMP_STOPS) {
		const oklch: Oklch = {
			l: STOP_LIGHTNESS[stop],
			// Tiny chroma so neutrals feel warm/cool without reading as colored.
			c: tintHex ? 0.006 + 0.004 * STOP_CHROMA_SCALE[stop] : 0,
			h: hue,
		};
		ramp[stop] = oklchToHex(oklch);
	}
	return ramp;
}
