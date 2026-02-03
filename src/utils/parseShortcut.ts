import type { ParsedShortcut } from "../types";

/**
 * Parses a shortcut string like "Meta+K" into a structured object
 *
 * @example
 * parseShortcut("Meta+K") // { meta: true, control: false, alt: false, shift: false, key: 'k' }
 * parseShortcut("Ctrl+Shift+P") // { meta: false, control: true, alt: false, shift: true, key: 'p' }
 */
export function parseShortcut(shortcut: string): ParsedShortcut {
  const parts = shortcut.split("+").map((p) => p.trim());

  const result: ParsedShortcut = {
    meta: false,
    control: false,
    alt: false,
    shift: false,
    key: "",
  };

  for (const part of parts) {
    const upper = part.toLowerCase();

    if (
      part === "Meta" ||
      upper === "meta" ||
      upper === "cmd" ||
      upper === "command"
    ) {
      result.meta = true;
    } else if (part === "Control" || upper === "control" || upper === "ctrl") {
      result.control = true;
    } else if (part === "Alt" || upper === "alt" || upper === "option") {
      result.alt = true;
    } else if (part === "Shift" || upper === "shift") {
      result.shift = true;
    } else {
      // This is the main key
      result.key = part.toLowerCase();
    }
  }

  return result;
}

/**
 * Validates a shortcut string format
 */
export function validateShortcut(shortcut: string): {
  valid: boolean;
  error?: string;
} {
  if (!shortcut || typeof shortcut !== "string") {
    return { valid: false, error: "Shortcut must be a non-empty string" };
  }

  const parts = shortcut
    .split("+")
    .map((p) => p.trim())
    .filter(Boolean);

  if (parts.length === 0) {
    return { valid: false, error: "Shortcut cannot be empty" };
  }

  const nonModifiers = parts.filter((p) => {
    const upper = p.toLowerCase();
    return ![
      "meta",
      "cmd",
      "command",
      "control",
      "ctrl",
      "alt",
      "option",
      "shift",
    ].includes(upper);
  });

  if (nonModifiers.length === 0) {
    return { valid: false, error: "Shortcut must include a non-modifier key" };
  }

  if (nonModifiers.length > 1) {
    return {
      valid: false,
      error: "Shortcut can only have one non-modifier key",
    };
  }

  return { valid: true };
}

/**
 * Checks if the currently pressed keys match a parsed shortcut
 */
export function matchesShortcut(
  event: KeyboardEvent,
  parsed: ParsedShortcut,
): boolean {
  const keyMatches = event.key.toLowerCase() === parsed.key.toLowerCase();
  const metaMatches = event.metaKey === parsed.meta;
  const ctrlMatches = event.ctrlKey === parsed.control;
  const altMatches = event.altKey === parsed.alt;
  const shiftMatches = event.shiftKey === parsed.shift;

  return keyMatches && metaMatches && ctrlMatches && altMatches && shiftMatches;
}
