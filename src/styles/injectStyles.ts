/**
 * AUTO-GENERATED - DO NOT EDIT
 * Generated from keebs.css by scripts/build-styles.ts
 * Run: pnpm build:styles
 */

export const KEEBS_STYLES = "/**\n * Keebs - Default Styles\n * \n * This is the source of truth for all styles.\n * Run `pnpm build:styles` to generate the injection file.\n */\n\n:root {\n  --keebs-hint-font-size: 0.75rem;\n  --keebs-hint-font-family: system-ui, -apple-system, sans-serif;\n  --keebs-hint-font-weight: 500;\n  --keebs-hint-color: #6b7280;\n  --keebs-hint-bg: transparent;\n  --keebs-hint-border: none;\n  --keebs-hint-border-radius: 4px;\n  --keebs-hint-padding: 0 0.25rem;\n  --keebs-hint-margin: 0 0.375rem;\n  --keebs-hint-transition-duration: 150ms;\n}\n\n@media (prefers-color-scheme: dark) {\n  :root {\n    --keebs-hint-color: #9ca3af;\n  }\n}\n\n.keebs-theme-light {\n  --keebs-hint-color: #6b7280;\n}\n\n.keebs-theme-dark {\n  --keebs-hint-color: #9ca3af;\n}\n\n.keebs-hint {\n  display: inline-flex;\n  align-items: center;\n  font-size: var(--keebs-hint-font-size);\n  font-family: var(--keebs-hint-font-family);\n  font-weight: var(--keebs-hint-font-weight);\n  color: var(--keebs-hint-color);\n  background: var(--keebs-hint-bg);\n  border: var(--keebs-hint-border);\n  border-radius: var(--keebs-hint-border-radius);\n  padding: var(--keebs-hint-padding);\n  margin: var(--keebs-hint-margin);\n  opacity: 0;\n  transform: translateX(-4px);\n  transition:\n    opacity var(--keebs-hint-transition-duration) ease-out,\n    transform var(--keebs-hint-transition-duration) ease-out;\n  pointer-events: none;\n  user-select: none;\n  white-space: nowrap;\n}\n\n.keebs-hint--visible {\n  opacity: 1;\n  transform: translateX(0);\n}\n\n.keebs-hint--badge {\n  --keebs-hint-bg: #f3f4f6;\n  --keebs-hint-border: 1px solid #e5e7eb;\n  --keebs-hint-padding: 0.125rem 0.375rem;\n}\n\n@media (prefers-color-scheme: dark) {\n  .keebs-hint--badge {\n    --keebs-hint-bg: #374151;\n    --keebs-hint-border: 1px solid #4b5563;\n  }\n}\n\n.keebs-theme-dark .keebs-hint--badge {\n  --keebs-hint-bg: #374151;\n  --keebs-hint-border: 1px solid #4b5563;\n}\n\n.keebs-theme-light .keebs-hint--badge {\n  --keebs-hint-bg: #f3f4f6;\n  --keebs-hint-border: 1px solid #e5e7eb;\n}\n\n.keebs-hint-wrapper {\n  display: inline-flex;\n  align-items: center;\n}\n";

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
