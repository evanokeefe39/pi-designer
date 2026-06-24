/**
 * Target registry. Each target turns a `DesignTokens` object into one or more
 * output files for a specific medium.
 */

import type { DesignTokens } from "../tokens";
import { carouselTarget } from "./carousel";
import { emailTarget } from "./email";
import { reportTarget } from "./report";
import { websiteTarget } from "./website";

/** A single generated file, relative path + contents. */
export interface OutputFile {
	path: string;
	content: string;
}

export type TargetFn = (tokens: DesignTokens) => OutputFile[];

export const TARGETS = {
	website: websiteTarget,
	report: reportTarget,
	carousel: carouselTarget,
	email: emailTarget,
} satisfies Record<string, TargetFn>;

export type TargetName = keyof typeof TARGETS;

export const TARGET_NAMES = Object.keys(TARGETS) as TargetName[];

/**
 * Run a set of targets, prefixing each file with its target directory.
 * @param targets target names, or "all" expanded by the caller
 */
export function runTargets(tokens: DesignTokens, targets: TargetName[]): OutputFile[] {
	const files: OutputFile[] = [];
	for (const name of targets) {
		for (const file of TARGETS[name](tokens)) {
			files.push({ path: `${name}/${file.path}`, content: file.content });
		}
	}
	return files;
}
