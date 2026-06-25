import { chromium } from "playwright";
import { describe, expect, it } from "vitest";

// ponytail: inline fixture so CI doesn't need .pi-designer/ on disk.
const fixture = `<!DOCTYPE html><html><head><meta charset="utf-8"><script src="https://cdn.tailwindcss.com"><\/script></head><body>
<div class="slide w-[1080px] h-[1350px] pt-[250px] pb-[250px] flex flex-col relative overflow-hidden font-sans" data-canvas="instagram-portrait">
  <div class="flex-1 flex flex-col justify-end relative z-10">
    <h1 class="text-[88px] leading-[1.05] font-bold">Title</h1>
    <p class="text-4xl leading-relaxed">Body text here</p>
  </div>
  <div class="flex justify-between text-2xl opacity-50 pt-6 relative z-10"><span>ctx</span><span>1/2</span></div>
</div>
<div class="slide w-[1080px] h-[1350px] pt-[250px] pb-[250px] flex flex-col relative overflow-hidden font-sans" data-canvas="instagram-portrait">
  <div class="flex-1 flex flex-col justify-end relative z-10">
    <h2 class="text-[52px] leading-[1.1] font-bold">Second</h2>
    <p class="text-4xl leading-relaxed">More body text</p>
  </div>
  <div class="flex justify-between text-2xl opacity-50 pt-6 relative z-10"><span>ctx</span><span>2/2</span></div>
</div>
</body></html>`;

describe("carousel layout validation", () => {
	it("loads Tailwind CDN successfully", async () => {
		const browser = await chromium.launch({ headless: true });
		const page = await browser.newPage();
		await page.setContent(fixture, { waitUntil: "networkidle" });
		// Tailwind injects classes into a <style> tag; verify .flex works via Tailwind
		const display = await page.$eval(".slide", (el) => getComputedStyle(el).display);
		expect(display).toBe("flex");
		await browser.close();
	}, 15000);

	it("renders without footer overlapping content on any slide", async () => {
		const browser = await chromium.launch({ headless: true });
		const page = await browser.newPage();
		await page.setContent(fixture, { waitUntil: "networkidle" });

		const slides = await page.$$(".slide");
		expect(slides.length).toBe(2);

		for (let i = 0; i < slides.length; i++) {
			const content = await slides[i].$(".content");
			const contentBox = content ? await content.boundingBox() : null;

			const footer = await slides[i].$(".footer");
			const footerBox = footer ? await footer.boundingBox() : null;

			if (contentBox && footerBox) {
				const contentBottom = contentBox.y + contentBox.height;
				expect(footerBox.y).toBeGreaterThanOrEqual(contentBottom - 1);
			}
		}

		await browser.close();
	}, 15000);

	it("screenshots each slide at correct dimensions", async () => {
		const browser = await chromium.launch({ headless: true });
		const page = await browser.newPage();
		await page.setContent(fixture, { waitUntil: "networkidle" });

		const slides = await page.$$(".slide");
		for (const slide of slides) {
			const box = await slide.boundingBox();
			expect(box).not.toBeNull();
			if (box) {
				expect(box.width).toBe(1080);
				expect(box.height).toBe(1350);
			}
		}

		await browser.close();
	}, 15000);
});
