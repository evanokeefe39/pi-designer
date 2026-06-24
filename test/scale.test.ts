import { describe, expect, it } from "vitest";
import { modularStep, spacingScale, typeScale } from "../src/scale";

describe("modularStep", () => {
	it("step 0 returns the base", () => {
		expect(modularStep(16, 1.25, 0)).toBe(16);
	});

	it("applies the ratio per step", () => {
		expect(modularStep(16, 1.25, 1)).toBeCloseTo(20);
		expect(modularStep(16, 1.25, 2)).toBeCloseTo(25);
	});

	// Edge case: a non-positive ratio is meaningless.
	it("throws on ratio <= 0", () => {
		expect(() => modularStep(16, 0, 1)).toThrow(/ratio/);
		expect(() => modularStep(16, -1, 1)).toThrow(/ratio/);
	});
});

describe("typeScale", () => {
	const scale = typeScale();

	it("has named steps with rem sizes and line-heights", () => {
		expect(scale.base.size).toBe("1rem");
		expect(scale.base.lineHeight).toBeGreaterThan(1);
		expect(scale["5xl"].size.endsWith("rem")).toBe(true);
	});

	it("grows from base upward", () => {
		expect(Number.parseFloat(scale.lg.size)).toBeGreaterThan(1);
		expect(Number.parseFloat(scale.sm.size)).toBeLessThan(1);
	});
});

describe("spacingScale", () => {
	it("zero maps to 0rem and 4 maps to 1rem at default base", () => {
		const s = spacingScale();
		expect(s["0"]).toBe("0rem");
		expect(s["4"]).toBe("1rem");
	});

	// Edge case: base step must be positive.
	it("throws on base step <= 0", () => {
		expect(() => spacingScale(0)).toThrow(/base step/);
	});
});
