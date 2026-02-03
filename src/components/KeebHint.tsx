import type { KeebHintProps } from "../types";
import { useKeebsVisible } from "../context/KeebsContext";
import { parseShortcut } from "../utils/parseShortcut";
import { formatShortcut, useIsMac } from "../utils/formatShortcut";

/**
 * Component to display a keyboard shortcut hint
 * Use this for manual placement when autoHint is disabled in useKeebs
 *
 * @example
 * ```tsx
 * const { shortcut, isVisible } = useKeebs('Meta+K', handler, { autoHint: false });
 * return (
 *   <div className="flex gap-2">
 *     <button>Search</button>
 *     <KeebHint shortcut="Meta+K" visible={isVisible} />
 *   </div>
 * );
 * ```
 */
export function KeebHint({
  shortcut,
  visible: visibleProp,
  className = "",
  style,
  variant = "text",
}: KeebHintProps) {
  // Use context visibility if not explicitly provided
  const contextVisible = useKeebsVisible();
  const isVisible = visibleProp ?? contextVisible;

  // SSR-safe platform detection
  const isMacOS = useIsMac();

  // Parse and format the shortcut
  const parsed = parseShortcut(shortcut);
  const formatted = formatShortcut(parsed, isMacOS);

  const variantClass = variant === "badge" ? "keebs-hint--badge" : "";
  const visibilityClass = isVisible ? "keebs-hint--visible" : "";

  return (
    <span
      className={`keebs-hint ${variantClass} ${visibilityClass} ${className}`.trim()}
      style={style}
      aria-hidden="true"
    >
      {formatted}
    </span>
  );
}
