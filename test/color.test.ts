import { describe, expect, it } from "vitest";
import {
	RAMP_STOPS,
	clampChroma,
	generateNeutralRamp,
	generateRamp,
	hexToOklch,
	hexToRgb,
	oklchToHex,
	rgbToHex,
} from "../src/color";

const HEX = /^#[0-9a-f]{6}$/;

describe("hex parsing", () => {
	it("round-trips 6-digit hex", () => {
		expect(rgbToHex(hexToRgb("#4f46e5"))).toBe("#4f46e5");
	});

	// Edge case: shorthand hex expands by doubling nibbles.
	it("expands shorthand hex", () => {
		expect(hexToRgb("#abc")).toEqual(hexToRgb("#aabbcc"));
	});

	it("accepts hex without leading #", () => {
		expect(hexToRgb("4f46e5")).toEqual(hexToRgb("#4f46e5"));
	});

	// Edge case: invalid input throws rather than producing a wrong color.
	it("throws on invalid hex", () => {
		expect(() => hexToRgb("nope")).toThrow(/Invalid hex/);
		expect(() => hexToRgb("#12")).toThrow(/Invalid hex/);
	});
});

describe("OKLCH conversion", () => {
	it("round-trips a color within tolerance", () => {
		const out = oklchToHex(hexToOklch("#4f46e5"));
		const a = hexToRgb("#4f46e5");
		const b = hexToRgb(out);
		expect(Math.abs(a.r - b.r)).toBeLessThanOrEqual(2);
		expect(Math.abs(a.g - b.g)).toBeLessThanOrEqual(2);
		expect(Math.abs(a.b - b.b)).toBeLessThanOrEqual(2);
	});

	// Edge case: out-of-gamut chroma is reduced, never increased.
	it("clampChroma never raises chroma", () => {
		const c = clampChroma({ l: 0.95, c: 0.4, h: 250 });
		expect(c.c).toBeLessThanOrEqual(0.4);
		expect(c.l).toBe(0.95);
		expect(c.h).toBe(250);
	});
});

describe("generateRamp", () => {
	const ramp = generateRamp("#4f46e5");

	it("produces every stop as valid hex", () => {
		for (const stop of RAMP_STOPS) {
			expect(ramp[stop]).toMatch(HEX);
		}
	});

	it("is monotonically darker from 50 to 950", () => {
		const lightness = RAMP_STOPS.map((s) => hexToOklch(ramp[s]).l);
		for (let i = 1; i < lightness.length; i++) {
			expect(lightness[i]).toBeLessThan(lightness[i - 1]);
		}
	});

	it("preserves hue across stops (mid range)", () => {
		const base = hexToOklch("#4f46e5").h;
		// Very light/dark stops carry near-zero chroma, so hue is unstable there;
		// check the chromatic middle of the ramp.
		for (const stop of [300, 400, 500, 600, 700] as const) {
			expect(Math.abs(hexToOklch(ramp[stop]).h - base)).toBeLessThan(8);
		}
	});
});

describe("generateNeutralRamp", () => {
	it("pure gray when no tint given", () => {
		const ramp = generateNeutralRamp();
		expect(hexToOklch(ramp[500]).c).toBeLessThan(0.002);
	});

	it("low but non-zero chroma when tinted", () => {
		const ramp = generateNeutralRamp("#4f46e5");
		const c = hexToOklch(ramp[500]).c;
		expect(c).toBeGreaterThan(0);
		expect(c).toBeLessThan(0.03);
	});
});
