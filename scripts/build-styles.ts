#!/usr/bin/env node
/**
 * Generates injectStyles.ts from keebs.css
 *
 * This keeps CSS as the source of truth while enabling
 * auto-injection at runtime for zero-config consumer experience.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const stylesDir = join(__dirname, "..", "src", "styles");

const css = readFileSync(join(stylesDir, "keebs.css"), "utf-8");

const output = `/**
 * AUTO-GENERATED - DO NOT EDIT
 * Generated from keebs.css by scripts/build-styles.ts
 * Run: pnpm build:styles
 */

export const KEEBS_STYLES = ${JSON.stringify(css)};

let stylesInjected = false;

/**
 * Injects Keebs CSS styles into the document head.
 * Safe to call multiple times - only injects once.
 */
export function injectStyles(): void {
  if (typeof document === 'undefined') return;
  if (stylesInjected) return;

  const style = document.createElement('style');
  style.setAttribute('data-keebs', 'true');
  style.textContent = KEEBS_STYLES;
  document.head.appendChild(style);
  stylesInjected = true;
}
`;

writeFileSync(join(stylesDir, "injectStyles.ts"), output);
console.log("✓ Generated injectStyles.ts from keebs.css");
