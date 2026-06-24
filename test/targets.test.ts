import { describe, expect, it } from "vitest";
import { TARGET_NAMES, runTargets } from "../src/targets/index";
import { buildDesignTokens } from "../src/tokens";

const tokens = buildDesignTokens({
	name: "Acme",
	brand: "#4f46e5",
	accent: "#f59e0b",
});

describe("buildDesignTokens", () => {
	it("includes brand, accent, and neutral ramps", () => {
		expect(Object.keys(tokens.colors)).toEqual(
			expect.arrayContaining(["brand", "accent", "neutral"]),
		);
	});

	it("includes typography, spacing, radii, shadows", () => {
		expect(tokens.typography.scale.base).toBeDefined();
		expect(tokens.spacing["4"]).toBeDefined();
		expect(tokens.radii.md).toBeDefined();
		expect(tokens.shadows.md).toBeDefined();
	});
});

describe("targets", () => {
	it("website emits CSS variables and a Tailwind @theme block", () => {
		const files = runTargets(tokens, ["website"]);
		const css = files.find((f) => f.path.endsWith("tokens.css"));
		const theme = files.find((f) => f.path.endsWith("tailwind-theme.css"));
		expect(css?.content).toContain("--color-brand-500:");
		expect(theme?.content).toContain("@theme");
	});

	it("report emits print rules", () => {
		const [file] = runTargets(tokens, ["report"]);
		expect(file.content).toContain("@page");
		expect(file.content).toContain("print-color-adjust");
	});

	it("carousel emits a canvas spec and a slide template", () => {
		const files = runTargets(tokens, ["carousel"]);
		const spec = files.find((f) => f.path.endsWith(".json"));
		expect(spec?.content).toContain("instagram-portrait");
		expect(JSON.parse(spec?.content ?? "{}").canvases.length).toBeGreaterThan(0);
	});

	it("email emits px values and inline-styled table markup (no rem, no CSS vars)", () => {
		const files = runTargets(tokens, ["email"]);
		const template = files.find((f) => f.path.endsWith(".html"));
		expect(template?.content).toContain('role="presentation"');
		expect(template?.content).not.toContain("var(--");
		expect(template?.content).not.toMatch(/\drem/);
	});

	it("runs every registered target without error", () => {
		const files = runTargets(tokens, [...TARGET_NAMES]);
		expect(files.length).toBeGreaterThanOrEqual(TARGET_NAMES.length);
		for (const f of files) {
			expect(f.content.length).toBeGreaterThan(0);
		}
	});
});
