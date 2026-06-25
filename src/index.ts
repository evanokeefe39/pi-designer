/**
 * pi-designer — a pi coding-agent extension for building design systems.
 *
 * Division of labor: the model makes the creative choices (which colors, what
 * voice, how many slides); this extension provides the deterministic machinery
 * — perceptually-even color ramps, modular scales, and faithful per-medium
 * token exporters (website, report, carousel, email).
 *
 * Registered tools:
 *   generate_palette      — OKLCH ramp (50–950) from a base color
 *   generate_scale        — modular type or spacing scale
 *   build_design_system   — full token set from a brief
 *   export_design_system  — write tokens to per-target files on disk
 *
 * Slash command:
 *   /design-system        — drop a starter brief in the project and explain next steps
 */

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { StringEnum } from "@earendil-works/pi-ai";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";
import { generateNeutralRamp, generateRamp } from "./color";
import { spacingScale, typeScale } from "./scale";
import { TARGET_NAMES, type TargetName, runTargets } from "./targets/index";
import { type DesignTokens, buildDesignTokens } from "./tokens";

function text(s: string) {
	return { content: [{ type: "text" as const, text: s }], details: undefined };
}

const STARTER_BRIEF = `{
  "name": "Acme",
  "brand": "#4f46e5",
  "accent": "#f59e0b",
  "neutralTint": "#4f46e5",
  "typeRatio": 1.25,
  "fontHeading": "Inter, system-ui, sans-serif",
  "fontBody": "Inter, system-ui, sans-serif"
}
`;

export default function (pi: ExtensionAPI) {
	pi.registerTool({
		name: "generate_palette",
		label: "Generate palette",
		description:
			"Generate an 11-stop (50–950) color ramp from a base hex color using the perceptually-uniform OKLCH color space. Hue is preserved across all stops.",
		promptSnippet: "Generate a perceptually-even color ramp from a hex color.",
		parameters: Type.Object({
			color: Type.String({ description: "Base color as hex, e.g. #4f46e5" }),
			neutral: Type.Optional(
				Type.Boolean({ description: "Produce a low-chroma neutral ramp tinted toward `color`." }),
			),
		}),
		async execute(_id, params) {
			const ramp = params.neutral ? generateNeutralRamp(params.color) : generateRamp(params.color);
			return { ...text(JSON.stringify(ramp, null, 2)), details: { ramp } };
		},
	});

	pi.registerTool({
		name: "generate_scale",
		label: "Generate scale",
		description:
			"Generate a modular scale. kind=type returns a named font-size scale (xs–5xl) with line-heights; kind=spacing returns a spacing scale in rem.",
		promptSnippet: "Generate a modular type or spacing scale.",
		parameters: Type.Object({
			kind: StringEnum(["type", "spacing"] as const),
			ratio: Type.Optional(Type.Number({ description: "Type-scale ratio (default 1.25)." })),
			baseStepPx: Type.Optional(
				Type.Number({ description: "Spacing base step in px (default 4)." }),
			),
		}),
		async execute(_id, params) {
			const scale =
				params.kind === "type" ? typeScale(params.ratio) : spacingScale(params.baseStepPx);
			return { ...text(JSON.stringify(scale, null, 2)), details: { scale } };
		},
	});

	pi.registerTool({
		name: "build_design_system",
		label: "Build design system",
		description:
			"Build a complete design-token set (colors, typography, spacing, radii, shadows) from a brief. Returns JSON to pass to export_design_system. Required: name, brand (hex).",
		promptSnippet: "Build a full design-token set from a brief.",
		parameters: Type.Object({
			name: Type.String(),
			brand: Type.String({ description: "Primary brand color, hex." }),
			accent: Type.Optional(Type.String({ description: "Secondary/accent color, hex." })),
			neutralTint: Type.Optional(Type.String({ description: "Hue to tint neutrals toward, hex." })),
			typeRatio: Type.Optional(Type.Number()),
			fontHeading: Type.Optional(Type.String()),
			fontBody: Type.Optional(Type.String()),
			fontMono: Type.Optional(Type.String()),
		}),
		async execute(_id, params) {
			const tokens = buildDesignTokens(params);
			return { ...text(JSON.stringify(tokens, null, 2)), details: { tokens } };
		},
	});

	pi.registerTool({
		name: "export_design_system",
		label: "Export design system",
		description:
			"Write a design-token set to per-target files under .pi-designer/. Writes brief.json, tokens.json, and per-target files. `tokens` is the JSON from build_design_system. `targets` selects mediums (website, report, carousel, email) or use ['all'].",
		promptSnippet: "Export design tokens to .pi-designer/",
		parameters: Type.Object({
			tokens: Type.String({ description: "Design tokens as a JSON string." }),
			targets: Type.Array(StringEnum(["website", "report", "carousel", "email", "all"] as const)),
			brief: Type.Optional(
				Type.String({
					description: "Brief JSON as a string (saved alongside tokens for resumability).",
				}),
			),
		}),
		async execute(_id, params, _signal, _onUpdate, ctx) {
			let tokens: DesignTokens;
			try {
				tokens = JSON.parse(params.tokens) as DesignTokens;
			} catch (err) {
				return text(`Could not parse tokens JSON: ${(err as Error).message}`);
			}

			const selected: TargetName[] = params.targets.includes("all")
				? [...TARGET_NAMES]
				: (params.targets.filter((t) => t !== "all") as TargetName[]);

			const root = resolve(ctx.cwd, ".pi-designer");
			await mkdir(root, { recursive: true });

			// Save brief for resumability
			if (params.brief) {
				await writeFile(join(root, "brief.json"), params.brief, "utf8");
			}
			// Save full tokens
			await writeFile(join(root, "tokens.json"), JSON.stringify(tokens, null, 2), "utf8");

			const files = runTargets(tokens, selected);
			for (const file of files) {
				const dest = join(root, file.path);
				await mkdir(dirname(dest), { recursive: true });
				await writeFile(dest, file.content, "utf8");
			}

			const written = files.map((f) => `  .pi-designer/${f.path}`).join("\n");
			return text(`Wrote ${files.length} file(s) for [${selected.join(", ")}]:\n${written}`);
		},
	});

	pi.registerCommand("design-system", {
		description:
			"Scaffold a design-system brief under .pi-designer/ and explain the pi-designer workflow.",
		handler: async (_args, ctx) => {
			const root = resolve(ctx.cwd, ".pi-designer");
			await mkdir(root, { recursive: true });
			const briefPath = join(root, "brief.json");
			await writeFile(briefPath, STARTER_BRIEF, { flag: "wx" }).catch(() => {
				// Edge case: don't clobber an existing brief.
			});
			ctx.ui.notify(
				"pi-designer: edit .pi-designer/brief.json, then ask me to build and export your design system.",
				"info",
			);
		},
	});
}
