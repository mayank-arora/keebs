import { useState, useEffect } from "react";
import type { ParsedShortcut } from "../types";

/**
 * Detects if the current platform is macOS
 * Returns false during SSR to avoid hydration mismatch
 */
export function isMac(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return false;
  }
  return /Mac|iPod|iPhone|iPad/.test(navigator.platform);
}

/**
 * React hook for SSR-safe platform detection
 * Returns false on server, then updates on client
 */
export function useIsMac(): boolean {
  const [isMacOS, setIsMacOS] = useState(false);

  useEffect(() => {
    setIsMacOS(isMac());
  }, []);

  return isMacOS;
}

/**
 * Formats a parsed shortcut for display using platform-specific symbols
 *
 * On Mac: ⌘K, ⌥⇧P
 * On Windows/Linux: Ctrl+K, Alt+Shift+P
 */
export function formatShortcut(parsed: ParsedShortcut, mac?: boolean): string {
  const isMacPlatform = mac ?? isMac();
  const parts: string[] = [];

  if (isMacPlatform) {
    // Mac uses symbols, no separators
    if (parsed.control) parts.push("⌃");
    if (parsed.alt) parts.push("⌥");
    if (parsed.shift) parts.push("⇧");
    if (parsed.meta) parts.push("⌘");
    parts.push(parsed.key.toUpperCase());
    return parts.join("");
  } else {
    // Windows/Linux uses text with + separators
    if (parsed.control) parts.push("Ctrl");
    if (parsed.alt) parts.push("Alt");
    if (parsed.shift) parts.push("Shift");
    if (parsed.meta) parts.push("Win");
    parts.push(parsed.key.toUpperCase());
    return parts.join("+");
  }
}
