import { describe, it, expect } from "vitest";
import {
  parseShortcut,
  validateShortcut,
  matchesShortcut,
} from "../src/utils/parseShortcut";

describe("parseShortcut", () => {
  it("parses simple shortcut", () => {
    const result = parseShortcut("Meta+K");
    expect(result).toEqual({
      meta: true,
      control: false,
      alt: false,
      shift: false,
      key: "k",
    });
  });

  it("parses complex shortcut with multiple modifiers", () => {
    const result = parseShortcut("Ctrl+Shift+P");
    expect(result).toEqual({
      meta: false,
      control: true,
      alt: false,
      shift: true,
      key: "p",
    });
  });

  it("handles Cmd alias for Meta", () => {
    const result = parseShortcut("Cmd+S");
    expect(result.meta).toBe(true);
    expect(result.key).toBe("s");
  });

  it("handles Option alias for Alt", () => {
    const result = parseShortcut("Option+Space");
    expect(result.alt).toBe(true);
    expect(result.key).toBe("space");
  });

  it("is case insensitive for modifiers", () => {
    const result = parseShortcut("META+shift+K");
    expect(result.meta).toBe(true);
    expect(result.shift).toBe(true);
  });
});

describe("validateShortcut", () => {
  it("validates correct shortcut", () => {
    expect(validateShortcut("Meta+K")).toEqual({ valid: true });
  });

  it("rejects empty shortcut", () => {
    expect(validateShortcut("")).toEqual({
      valid: false,
      error: "Shortcut must be a non-empty string",
    });
  });

  it("rejects modifier-only shortcut", () => {
    expect(validateShortcut("Meta+Shift")).toEqual({
      valid: false,
      error: "Shortcut must include a non-modifier key",
    });
  });

  it("rejects multiple non-modifier keys", () => {
    expect(validateShortcut("Meta+A+B")).toEqual({
      valid: false,
      error: "Shortcut can only have one non-modifier key",
    });
  });
});

describe("matchesShortcut", () => {
  it("matches correct key combination", () => {
    const event = {
      key: "k",
      metaKey: true,
      ctrlKey: false,
      altKey: false,
      shiftKey: false,
    } as KeyboardEvent;

    const parsed = parseShortcut("Meta+K");
    expect(matchesShortcut(event, parsed)).toBe(true);
  });

  it("does not match wrong key", () => {
    const event = {
      key: "j",
      metaKey: true,
      ctrlKey: false,
      altKey: false,
      shiftKey: false,
    } as KeyboardEvent;

    const parsed = parseShortcut("Meta+K");
    expect(matchesShortcut(event, parsed)).toBe(false);
  });

  it("does not match missing modifier", () => {
    const event = {
      key: "k",
      metaKey: false,
      ctrlKey: false,
      altKey: false,
      shiftKey: false,
    } as KeyboardEvent;

    const parsed = parseShortcut("Meta+K");
    expect(matchesShortcut(event, parsed)).toBe(false);
  });
});
