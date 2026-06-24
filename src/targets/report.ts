/**
 * Report target: print-oriented stylesheet.
 *
 * Reports are paged media. This emits `@page` rules, point-based type sizing,
 * `print-color-adjust: exact` so brand colors survive printing, and page-break
 * helpers — concerns that website CSS ignores.
 */

import type { DesignTokens } from "../tokens";
import type { OutputFile } from "./index";
import { cssVariableLines, fileHeader } from "./shared";

/** rem (16px base) -> pt for print sizing. */
function remToPt(rem: string): string {
	const n = Number.parseFloat(rem);
	return `${Math.round(n * 16 * 0.75 * 100) / 100}pt`;
}

function reportCss(tokens: DesignTokens): string {
	const body = tokens.typography.scale.base;
	const h1 = tokens.typography.scale["3xl"];
	const h2 = tokens.typography.scale["2xl"];

	return `${fileHeader(tokens, "report / print")}
:root {
${cssVariableLines(tokens).join("\n")}
}

@page {
  size: A4;
  margin: 20mm 18mm;
}

html {
  print-color-adjust: exact;
  -webkit-print-color-adjust: exact;
}

body {
  font-family: var(--font-body);
  font-size: ${remToPt(body.size)};
  line-height: ${body.lineHeight};
  color: var(--color-neutral-900);
}

h1, h2, h3 {
  font-family: var(--font-heading);
  color: var(--color-brand-700);
  break-after: avoid;
}

h1 { font-size: ${remToPt(h1.size)}; }
h2 { font-size: ${remToPt(h2.size)}; }

/* Edge case: keep tables and figures from splitting across pages. */
table, figure { break-inside: avoid; }

.page-break { break-before: page; }
`;
}

export function reportTarget(tokens: DesignTokens): OutputFile[] {
	return [{ path: "report.css", content: reportCss(tokens) }];
}
