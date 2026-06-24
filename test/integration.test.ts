import { existsSync, mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import createExtension from "../src/index";
import { buildDesignTokens } from "../src/tokens";

/**
 * Drives the real extension factory through a minimal mock ExtensionAPI to
 * verify tool registration and end-to-end export against the actual runtime
 * (StringEnum + typebox + fs), not just the pure helpers.
 */
// Minimal mock of the host ExtensionAPI surface (untyped on purpose).
function mockPi(): any {
	const tools = new Map<string, any>();
	const commands = new Map<string, any>();
	return {
		tools,
		commands,
		registerTool: (t: any) => tools.set(t.name, t),
		registerCommand: (name: string, opts: any) => commands.set(name, opts),
		on: () => {},
		registerShortcut: () => {},
		registerFlag: () => {},
	};
}

describe("extension integration", () => {
	it("registers the four tools and the command", () => {
		const pi = mockPi();
		createExtension(pi);
		expect([...pi.tools.keys()].sort()).toEqual([
			"build_design_system",
			"export_design_system",
			"generate_palette",
			"generate_scale",
		]);
		expect(pi.commands.has("design-system")).toBe(true);
	});

	it("exports every target to disk via the export tool", async () => {
		const pi = mockPi();
		createExtension(pi);
		const out = mkdtempSync(join(tmpdir(), "pi-designer-"));
		const tokens = JSON.stringify(buildDesignTokens({ name: "Acme", brand: "#4f46e5" }));

		// Use the default outDir ("design-system") rooted at the mock cwd.
		const result = await pi.tools
			.get("export_design_system")
			.execute("call-1", { tokens, targets: ["all"] }, undefined, undefined, { cwd: out });

		expect(result.content[0].text).toContain("Wrote");
		for (const rel of [
			"website/tokens.css",
			"report/report.css",
			"carousel/carousel.json",
			"email/email-template.html",
		]) {
			expect(existsSync(join(out, "design-system", rel))).toBe(true);
		}
		expect(readFileSync(join(out, "design-system/website/tokens.css"), "utf8")).toContain(
			"--color-brand-500:",
		);
	});

	it("reports malformed tokens JSON instead of writing", async () => {
		const pi = mockPi();
		createExtension(pi);
		const result = await pi.tools
			.get("export_design_system")
			.execute("call-2", { tokens: "{not json", targets: ["website"] }, undefined, undefined, {
				cwd: mkdtempSync(join(tmpdir(), "pi-designer-")),
			});
		expect(result.content[0].text).toContain("Could not parse");
	});
});
