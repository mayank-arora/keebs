import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useKeebsContext } from "../context/KeebsContext";
import { parseShortcut } from "../utils/parseShortcut";
import { formatShortcut, useIsMac } from "../utils/formatShortcut";
import type {
  UseKeebsOptions,
  UseKeebsReturn,
  RegisteredShortcut,
} from "../types";

/**
 * Hook to register a keyboard shortcut with visual hint
 *
 * @param shortcut - The keyboard shortcut string (e.g., "Meta+K", "Ctrl+Shift+P")
 * @param handler - Function to call when shortcut is triggered
 * @param options - Additional configuration options
 * @returns Ref to attach to the target element and state for manual hint rendering
 *
 * @example
 * ```tsx
 * function SearchButton() {
 *   const keebRef = useKeebs('Meta+K', () => openSearch());
 *   return <button ref={keebRef}>Search</button>;
 * }
 * ```
 */
export function useKeebs(
  shortcut: string,
  handler: () => void,
  options: UseKeebsOptions = {},
): UseKeebsReturn {
  const { autoHint = true, hintPosition = "after", disabled = false } = options;
  const { register, unregister, hintsVisible } = useKeebsContext();

  const id = useId();
  const parsed = parseShortcut(shortcut);

  // SSR-safe platform detection
  const isMacOS = useIsMac();
  const formatted = formatShortcut(parsed, isMacOS);

  const elementRef = useRef<HTMLElement | null>(null);
  const hintElementRef = useRef<HTMLElement | null>(null);

  // Track when element is assigned to trigger hint injection
  const [element, setElement] = useState<HTMLElement | null>(null);

  // Register shortcut on mount, unregister on unmount
  useEffect(() => {
    if (disabled) return;

    const registration: RegisteredShortcut = {
      id,
      shortcut,
      parsed,
      handler,
      element: elementRef.current,
    };

    register(registration);

    return () => {
      unregister(id);
    };
  }, [id, shortcut, handler, disabled, register, unregister, parsed]);

  // Handle auto-injection of hint element
  useEffect(() => {
    if (!autoHint || !element || disabled) return;

    // Create hint container
    const hintContainer = document.createElement("span");
    hintContainer.className = "keebs-hint-wrapper";
    hintContainer.setAttribute("data-keebs-hint", "true");

    // Insert hint as sibling
    if (hintPosition === "after") {
      element.parentNode?.insertBefore(hintContainer, element.nextSibling);
    } else {
      element.parentNode?.insertBefore(hintContainer, element);
    }

    hintElementRef.current = hintContainer;

    return () => {
      hintContainer.remove();
      hintElementRef.current = null;
    };
  }, [autoHint, hintPosition, disabled, element]);

  // Update hint content and visibility
  useEffect(() => {
    if (!hintElementRef.current) return;

    const hint = hintElementRef.current;
    hint.textContent = formatted;
    hint.className = `keebs-hint ${hintsVisible ? "keebs-hint--visible" : ""}`;
    hint.setAttribute("aria-hidden", "true");
  }, [formatted, hintsVisible]);

  const ref = useCallback((node: HTMLElement | null) => {
    elementRef.current = node;
    setElement(node);
  }, []);

  return {
    ref,
    shortcut: formatted,
    isVisible: hintsVisible,
  };
}
