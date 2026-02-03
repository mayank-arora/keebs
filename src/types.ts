/**
 * Modifier keys that can trigger hint visibility
 */
export type ModifierKey = "Meta" | "Control" | "Alt" | "Shift";

/**
 * Parsed representation of a keyboard shortcut
 */
export interface ParsedShortcut {
  meta: boolean;
  control: boolean;
  alt: boolean;
  shift: boolean;
  key: string;
}

/**
 * Map of shortcut IDs to shortcut strings
 */
export type ShortcutMap = Record<string, string>;

/**
 * Configuration options for the KeebsProvider
 */
export interface KeebsConfig {
  /** Keys that trigger hint visibility when held (default: ['Meta', 'Control']) */
  triggerKeys?: ModifierKey[];
  /** Delay in ms before hints appear (default: 300) */
  delay?: number;
  /** Theme for default styles (default: 'auto') */
  theme?: "light" | "dark" | "auto";
  /** Globally disable all shortcuts */
  disabled?: boolean;
  /** Default shortcut mappings (id -> shortcut string) */
  shortcuts?: ShortcutMap;
  /** User overrides for shortcuts (takes precedence over shortcuts) */
  overrides?: ShortcutMap;
}

/**
 * A registered shortcut in the registry
 */
export interface RegisteredShortcut {
  id: string;
  shortcut: string;
  parsed: ParsedShortcut;
  handler: () => void;
  element: HTMLElement | null;
}

/**
 * Options for the useKeebs hook
 */
export interface UseKeebsOptions {
  /** Whether to auto-inject hint element (default: true) */
  autoHint?: boolean;
  /** Custom hint position relative to element */
  hintPosition?: "after" | "before";
  /** Disable the shortcut */
  disabled?: boolean;
}

/**
 * Return type for useKeebs hook when autoHint is false
 */
export interface UseKeebsReturn {
  /** Ref to attach to the target element */
  ref: React.RefCallback<HTMLElement>;
  /** The formatted shortcut string for display */
  shortcut: string;
  /** Whether hints are currently visible */
  isVisible: boolean;
}

/**
 * Context value provided by KeebsProvider
 */
export interface KeebsContextValue {
  /** Whether hints should be visible */
  hintsVisible: boolean;
  /** Register a new shortcut */
  register: (shortcut: RegisteredShortcut) => void;
  /** Unregister a shortcut by id */
  unregister: (id: string) => void;
  /** Current theme */
  theme: "light" | "dark" | "auto";
  /** Trigger keys configuration */
  triggerKeys: ModifierKey[];
  /** Whether shortcuts are globally disabled */
  disabled: boolean;
  /** Toggle global disabled state */
  setDisabled: (disabled: boolean) => void;
  /** Resolve a shortcut ID to its string (with overrides applied) */
  resolveShortcut: (id: string) => string | undefined;
  /** Get all registered shortcuts (for editor UI) */
  getRegisteredShortcuts: () => ShortcutMap;
  /** Update a shortcut override */
  updateShortcut: (id: string, shortcut: string) => void;
  /** Reset a shortcut to its default */
  resetShortcut: (id: string) => void;
  /** Reset all shortcuts to defaults */
  resetAllShortcuts: () => void;
}

/**
 * Props for the KeebHint component
 */
export interface KeebHintProps {
  /** The shortcut string to display */
  shortcut: string;
  /** Whether the hint is visible */
  visible?: boolean;
  /** Additional CSS class */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Visual variant */
  variant?: "text" | "badge";
}
