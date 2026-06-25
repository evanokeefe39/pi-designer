import { mkdirSync, readFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
/**
 * pi-designer carousel screenshot tool.
 * Renders carousel.html slides to PNG via headless Chromium.
 * Usage: npx tsx src/screenshot.ts path/to/carousel.html -o path/to/output/
 */
import { chromium } from "playwright";

async function screenshotCarousel(htmlPath: string, outDir: string): Promise<void> {
	const absHtml = resolve(htmlPath);
	const html = readFileSync(absHtml, "utf8");
	mkdirSync(outDir, { recursive: true });

	const browser = await chromium.launch({ headless: true });
	const page = await browser.newPage();

	// ponytail: element.screenshot scrolls into view, no manual clip math needed.
	await page.setContent(html, { waitUntil: "networkidle" });

	const slides = await page.$$(".slide");
	console.log(`Found ${slides.length} slides`);

	for (let i = 0; i < slides.length; i++) {
		const outPath = join(outDir, `slide-${String(i + 1).padStart(2, "0")}.png`);
		await slides[i].screenshot({ path: outPath, type: "png" });
		const box = await slides[i].boundingBox();
		console.log(
			`  slide-${String(i + 1).padStart(2, "0")}.png (${Math.round(box?.width ?? 0)}×${Math.round(box?.height ?? 0)})`,
		);
	}

	await browser.close();
	console.log(`Done — ${slides.length} slides → ${outDir}/`);
}

// CLI — defaults to .pi-designer/carousel/carousel.html → .pi-designer/screenshots/
const args = process.argv.slice(2);
const htmlIdx = args.findIndex((a) => a.endsWith(".html"));
const outIdx = args.indexOf("-o");

const htmlPath =
	htmlIdx !== -1 ? args[htmlIdx] : join(resolve("."), ".pi-designer/carousel/carousel.html");
const outDir = outIdx !== -1 ? args[outIdx + 1] : join(dirname(htmlPath), "..", "screenshots");
screenshotCarousel(htmlPath, outDir).catch((err) => {
	console.error(err);
	process.exit(1);
});
