/**
 * Social carousel target.
 *
 * Carousels are fixed-pixel canvases, not fluid layouts. This emits a JSON spec
 * of the common canvas sizes with per-platform safe zones (dead zones where
 * platform UI — profile pics, captions, engagement buttons — covers content),
 * plus a Tailwind CDN slide template wired to the design tokens.
 *
 * Safe zones sourced from AdaptlyPost, CampaignSwift, Postiv.ai (June 2026).
 * All designs share one token set (colors, typography, spacing) for consistency.
 */

import type { DesignTokens } from "../tokens";
import type { OutputFile } from "./index";

interface SafeZone {
	top: number;
	bottom: number;
	left: number;
	right: number;
}

interface Canvas {
	name: string;
	width: number;
	height: number;
	/** Dead zone (px) where platform UI covers content. Keep text/CTAs inside the remaining area. */
	deadZone: SafeZone;
}

/**
 * Per-platform canvases with research-backed dead zones (June 2026).
 * Instagram carousel posts have no persistent UI overlay when viewed full-screen,
 * but feed-preview cropping makes top/bottom ~250px risky for key content.
 */
const CANVASES: Canvas[] = [
	{
		name: "instagram-portrait",
		width: 1080,
		height: 1350,
		deadZone: { top: 250, bottom: 250, left: 0, right: 0 },
	},
	{
		name: "instagram-square",
		width: 1080,
		height: 1080,
		deadZone: { top: 200, bottom: 200, left: 0, right: 0 },
	},
	{
		name: "instagram-story",
		width: 1080,
		height: 1920,
		// Top: profile pic + time + close (220px). Bottom: reply bar + share (420px).
		deadZone: { top: 220, bottom: 420, left: 0, right: 0 },
	},
	{
		name: "tiktok-photo",
		width: 1080,
		height: 1920,
		// Top: profile + follow (108px). Bottom: captions + engagement (320px).
		// Right: like/comment/share stack (120px). Left: edge margin (60px).
		deadZone: { top: 108, bottom: 320, left: 60, right: 120 },
	},
	{
		name: "linkedin-square",
		width: 1080,
		height: 1080,
		// Profile bar top, engagement bottom. Central 880×880 safe.
		deadZone: { top: 100, bottom: 100, left: 80, right: 80 },
	},
	{
		name: "linkedin-portrait",
		width: 1080,
		height: 1350,
		deadZone: { top: 100, bottom: 100, left: 80, right: 80 },
	},
];

function carouselSpec(tokens: DesignTokens): string {
	const spec = {
		name: tokens.name,
		generatedBy: "pi-designer",
		sharedTokens:
			"tokens.json at .pi-designer/ root — all targets consume the same colors, typography, spacing.",
		canvases: CANVASES.map((c) => ({
			name: c.name,
			width: c.width,
			height: c.height,
			deadZone: c.deadZone,
			safeArea: {
				x: c.deadZone.left,
				y: c.deadZone.top,
				width: c.width - c.deadZone.left - c.deadZone.right,
				height: c.height - c.deadZone.top - c.deadZone.bottom,
			},
		})),
		palette: tokens.colors,
		typography: tokens.typography,
		spacing: tokens.spacing,
		guidance: {
			maxHeadingWords: 8,
			body: "Keep one idea per slide. Anchor all text, faces, logos, and CTAs inside the safe zone.",
			deadZone:
				"Dead zones are covered by platform UI (profile pics, captions, buttons). Never place key content there.",
			contrast: "Use brand-700+ text on neutral-50, or neutral-50 text on brand-600+.",
			tokenReuse:
				"All targets share .pi-designer/tokens.json — same colors, type, spacing across website, report, carousel, email.",
		},
	};
	return `${JSON.stringify(spec, null, 2)}\n`;
}

/**
 * Generate one Tailwind slide shell per canvas, each with dead-zone padding baked
 * into pt/pb/pl/pr so content stays clear of platform UI by construction.
 */
function slideTemplate(tokens: DesignTokens): string {
	const bg = tokens.colors.brand[600];
	const fg = tokens.colors.neutral[50];
	const accent = (tokens.colors.accent ?? tokens.colors.brand)[400];
	const font = tokens.typography.fontFamilies.body;
	const heading = tokens.typography.fontFamilies.heading;

	const canvasBlocks = CANVASES.map((c) => {
		const dz = c.deadZone;
		// Grid-line inset matches dead-zone padding so the Swiss Editorial border
		// sits exactly at the safe-area boundary.
		return `  <!-- ${c.name}: ${c.width}×${c.height} — dead zone t:${dz.top} b:${dz.bottom} l:${dz.left} r:${dz.right} -->
  <div class="slide w-[${c.width}px] h-[${c.height}px] pt-[${dz.top}px] pb-[${dz.bottom}px] pl-[${dz.left}px] pr-[${dz.right}px] flex flex-col relative overflow-hidden font-sans bg-[${bg}] text-[${fg}]" data-canvas="${c.name}" style="font-family:${font};--safe-top:${dz.top}px;--safe-bottom:${dz.bottom}px;--safe-left:${dz.left}px;--safe-right:${dz.right}px">
    <div class="absolute top-0 left-0 w-full h-[6px] bg-[${accent}]"></div>
    <div class="flex-1 flex flex-col justify-end relative z-10">
      <p class="uppercase tracking-[0.1em] text-2xl font-semibold mb-6 text-[${accent}]" style="font-family:${heading}">Eyebrow / series</p>
      <h1 class="text-[88px] leading-[1.05] font-bold" style="font-family:${heading}">Slide headline goes here</h1>
      <p class="text-4xl leading-relaxed mt-7 max-w-[85%]">Supporting sentence. One idea per slide.</p>
    </div>
    <div class="flex justify-between text-2xl opacity-50 pt-6 relative z-10">
      <span>context</span>
      <span>N/T</span>
    </div>
  </div>`;
	}).join("\n\n");

	return `<!-- ${tokens.name} — per-canvas slide templates. Generated by pi-designer. -->
<!-- Dead zones baked into pt/pb/pl/pr. Content inside flex-1 zone is safe. -->
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<script src="https://cdn.tailwindcss.com"><\/script>
<style>
  /* Swiss Editorial grid line — inset tracks per-canvas dead zone via CSS vars. */
  .slide::before {
    content: "";
    position: absolute;
    inset: var(--safe-top) var(--safe-right) var(--safe-bottom) var(--safe-left);
    border: 1px solid rgba(255,255,255,0.08);
    pointer-events: none;
    z-index: 0;
  }
</style>
</head>
<body>
${canvasBlocks}
</body>
</html>
`;
}

export function carouselTarget(tokens: DesignTokens): OutputFile[] {
	return [
		{ path: "carousel.json", content: carouselSpec(tokens) },
		{ path: "slide-template.html", content: slideTemplate(tokens) },
	];
}
