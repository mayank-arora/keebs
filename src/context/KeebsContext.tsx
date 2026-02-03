import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  type ReactNode,
} from "react";
import type {
  KeebsContextValue,
  KeebsConfig,
  ModifierKey,
  RegisteredShortcut,
  ShortcutMap,
} from "../types";
import { matchesShortcut } from "../utils/parseShortcut";
import { injectStyles } from "../styles/injectStyles";

const KeebsContext = createContext<KeebsContextValue | null>(null);

export interface KeebsProviderProps extends KeebsConfig {
  children: ReactNode;
}

/**
 * Provider component that manages keyboard shortcut state and visibility
 */
export function KeebsProvider({
  children,
  triggerKeys = ["Meta", "Control"],
  delay = 300,
  theme = "auto",
  disabled: initialDisabled = false,
  shortcuts: defaultShortcuts = {},
  overrides: initialOverrides = {},
}: KeebsProviderProps) {
  // Auto-inject CSS styles on first mount
  injectStyles();

  const [hintsVisible, setHintsVisible] = useState(false);
  const [disabled, setDisabled] = useState(initialDisabled);
  const [overrides, setOverrides] = useState<ShortcutMap>(initialOverrides);

  const registryRef = useRef<Map<string, RegisteredShortcut>>(new Map());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const modifierHeldRef = useRef(false);

  // Merge default shortcuts with overrides
  const resolvedShortcuts = useMemo(
    () => ({
      ...defaultShortcuts,
      ...overrides,
    }),
    [defaultShortcuts, overrides],
  );

  // Resolve a shortcut ID to its string
  const resolveShortcut = useCallback(
    (id: string): string | undefined => {
      return resolvedShortcuts[id];
    },
    [resolvedShortcuts],
  );

  // Get all registered shortcut IDs with their current values
  const getRegisteredShortcuts = useCallback((): ShortcutMap => {
    const result: ShortcutMap = {};
    for (const [id, reg] of registryRef.current) {
      result[id] = resolvedShortcuts[reg.shortcut] ?? reg.shortcut;
    }
    return result;
  }, [resolvedShortcuts]);

  // Update a shortcut override
  const updateShortcut = useCallback((id: string, shortcut: string) => {
    setOverrides((prev) => ({ ...prev, [id]: shortcut }));
  }, []);

  // Reset a single shortcut to default
  const resetShortcut = useCallback((id: string) => {
    setOverrides((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  // Reset all shortcuts to defaults
  const resetAllShortcuts = useCallback(() => {
    setOverrides({});
  }, []);

  // Check if a key is one of our trigger keys
  const isTriggerKey = useCallback(
    (key: string): boolean => {
      const keyMap: Record<string, ModifierKey> = {
        Meta: "Meta",
        Control: "Control",
        Alt: "Alt",
        Shift: "Shift",
      };
      const mapped = keyMap[key];
      return mapped ? triggerKeys.includes(mapped) : false;
    },
    [triggerKeys],
  );

  // Handle keydown - start timer for hint visibility
  useEffect(() => {
    // SSR guard
    if (typeof window === "undefined") return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Skip if globally disabled
      if (disabled) return;

      // Check if this is a registered shortcut being triggered
      for (const shortcut of registryRef.current.values()) {
        if (matchesShortcut(event, shortcut.parsed)) {
          event.preventDefault();
          shortcut.handler();
          return;
        }
      }

      // Check if it's a trigger key being held
      if (isTriggerKey(event.key) && !modifierHeldRef.current) {
        modifierHeldRef.current = true;

        // Start the delay timer
        timerRef.current = setTimeout(() => {
          setHintsVisible(true);
        }, delay);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (isTriggerKey(event.key)) {
        modifierHeldRef.current = false;

        // Clear timer and hide hints
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
        setHintsVisible(false);
      }
    };

    // Also hide on blur (user switches windows)
    const handleBlur = () => {
      modifierHeldRef.current = false;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      setHintsVisible(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isTriggerKey, delay, disabled]);

  const register = useCallback((shortcut: RegisteredShortcut) => {
    const existing = registryRef.current.get(shortcut.id);
    if (existing && process.env.NODE_ENV === "development") {
      console.warn(
        `[keebs] Shortcut "${shortcut.shortcut}" is already registered. The new registration will override the previous one.`,
      );
    }

    // Check for conflicts with same shortcut string but different IDs
    for (const [id, registered] of registryRef.current) {
      if (id !== shortcut.id && registered.shortcut === shortcut.shortcut) {
        if (process.env.NODE_ENV === "development") {
          console.warn(
            `[keebs] Shortcut conflict: "${shortcut.shortcut}" is registered by multiple components. Last registration wins.`,
          );
        }
      }
    }

    registryRef.current.set(shortcut.id, shortcut);
  }, []);

  const unregister = useCallback((id: string) => {
    registryRef.current.delete(id);
  }, []);

  const value: KeebsContextValue = {
    hintsVisible,
    register,
    unregister,
    theme,
    triggerKeys,
    disabled,
    setDisabled,
    resolveShortcut,
    getRegisteredShortcuts,
    updateShortcut,
    resetShortcut,
    resetAllShortcuts,
  };

  return (
    <KeebsContext.Provider value={value}>{children}</KeebsContext.Provider>
  );
}

/**
 * Hook to access the Keebs context
 */
export function useKeebsContext(): KeebsContextValue {
  const context = useContext(KeebsContext);
  if (!context) {
    throw new Error("useKeebsContext must be used within a KeebsProvider");
  }
  return context;
}

/**
 * Hook to check if hints are currently visible
 */
export function useKeebsVisible(): boolean {
  const { hintsVisible } = useKeebsContext();
  return hintsVisible;
}

/**
 * Hook to control global disabled state and access shortcut editor functions
 */
export function useKeebsControl() {
  const {
    disabled,
    setDisabled,
    updateShortcut,
    resetShortcut,
    resetAllShortcuts,
    getRegisteredShortcuts,
  } = useKeebsContext();

  return {
    disabled,
    setDisabled,
    updateShortcut,
    resetShortcut,
    resetAllShortcuts,
    getRegisteredShortcuts,
  };
}
