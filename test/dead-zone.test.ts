import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { chromium } from "playwright";
import { describe, expect, it } from "vitest";
import { runTargets } from "../src/targets/index";
import { buildDesignTokens } from "../src/tokens";

// ponytail: generate .pi-designer/ in a temp dir so CI works without pre-existing artifacts.
const tmp = mkdtempSync(join(tmpdir(), "pi-designer-test-"));
const tokens = buildDesignTokens({
	name: "Test",
	brand: "#1e3a5f",
	accent: "#e8b830",
	neutralTint: "#1e3a5f",
});
const files = runTargets(tokens, ["carousel"]);
for (const f of files) {
	const parts = f.path.split("/");
	// ponytail: flatten into temp dir, no subdirs.
	const dest = join(tmp, parts.length > 1 ? parts[parts.length - 1] : parts[0]);
	writeFileSync(dest, f.content, "utf8");
}

// Build a minimal filled carousel with data-canvas attributes for testing.
const carouselHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><script src="https://cdn.tailwindcss.com"></script></head><body>
<div class="slide" data-canvas="instagram-portrait" style="width:1080px;height:1350px;padding-top:250px;padding-bottom:250px">
  <div class="flex-1"><h1>Title</h1><p>Body text here</p></div>
  <div class="footer"><span>footer</span></div>
</div>
<div class="slide" data-canvas="linkedin-square" style="width:1080px;height:1080px;padding-top:100px;padding-bottom:100px;padding-left:80px;padding-right:80px">
  <div class="flex-1"><h2>LinkedIn slide</h2><p>Safe content</p></div>
  <div class="footer"><span>link</span></div>
</div>
</body></html>`;
writeFileSync(join(tmp, "carousel.html"), carouselHtml);

const HTML_PATH = join(tmp, "carousel.html");
const SPEC_PATH = join(tmp, "carousel.json");

interface DeadZone {
	top: number;
	bottom: number;
	left: number;
	right: number;
}

function loadDeadZones(): Map<string, DeadZone> {
	const spec = JSON.parse(readFileSync(SPEC_PATH, "utf8"));
	const map = new Map<string, DeadZone>();
	for (const c of spec.canvases) {
		map.set(c.name, c.deadZone);
	}
	return map;
}

describe("dead-zone safety", () => {
	const deadZones = loadDeadZones();

	it("every slide has a known data-canvas attribute", async () => {
		const browser = await chromium.launch({ headless: true });
		const page = await browser.newPage();
		const html = readFileSync(HTML_PATH, "utf8");
		await page.setContent(html, { waitUntil: "networkidle" });

		const slides = await page.$$(".slide");
		expect(slides.length).toBe(2);

		for (const slide of slides) {
			const canvas = await slide.getAttribute("data-canvas");
			expect(canvas).not.toBeNull();
			if (canvas) expect(deadZones.has(canvas)).toBe(true);
		}
		await browser.close();
	}, 15000);

	it("no text content intersects the dead zone", async () => {
		const browser = await chromium.launch({ headless: true });
		const page = await browser.newPage();
		const html = readFileSync(HTML_PATH, "utf8");
		await page.setContent(html, { waitUntil: "networkidle" });

		const slides = await page.$$(".slide");

		for (let i = 0; i < slides.length; i++) {
			const canvas = await slides[i].getAttribute("data-canvas");
			if (!canvas) continue;
			const dz = deadZones.get(canvas);
			if (!dz) continue;

			const slideBox = await slides[i].boundingBox();
			if (!slideBox) continue;

			const deadRects = [
				{ x: 0, y: 0, w: slideBox.width, h: dz.top },
				{ x: 0, y: slideBox.height - dz.bottom, w: slideBox.width, h: dz.bottom },
				{ x: 0, y: 0, w: dz.left, h: slideBox.height },
				{ x: slideBox.width - dz.right, y: 0, w: dz.right, h: slideBox.height },
			].filter((r) => r.w > 0 && r.h > 0);

			const textSelectors = "h1, h2, h3, p, .stat, .stat-label, .eyebrow";
			const els = await slides[i].$$(textSelectors);

			for (const el of els) {
				const elBox = await el.boundingBox();
				if (!elBox) continue;

				const localX = elBox.x - slideBox.x;
				const localY = elBox.y - slideBox.y;
				const localRight = localX + elBox.width;
				const localBottom = localY + elBox.height;

				for (const dr of deadRects) {
					const overlaps =
						localX < dr.x + dr.w && localRight > dr.x && localY < dr.y + dr.h && localBottom > dr.y;
					expect(overlaps).toBe(false);
				}
			}
		}

		await browser.close();
	}, 15000);
});
