/**
 * Single source of truth for all theme colors in Expo Supabase Starter.
 * These colors are injected as CSS variables at runtime via ThemeContext.
 *
 * Base themes define the semantic color structure.
 * Tints override most colors to create a cohesive tinted experience.
 * Only status colors (success, warning, error, info), destructive, rating,
 * and overlay colors remain constant across tints.
 */

import { tints, TintName, DEFAULT_TINT } from "./tints";

/**
 * Base themes - these define the fixed/semantic colors that don't change with tint.
 * Most colors are overridden by the selected tint.
 */
export const baseThemeColors = {
  light: {
    // Semantic colors that stay constant
    destructive: "#dc2626",
    destructiveForeground: "#ffffff",

    // Status colors
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    info: "#3b82f6",

    // Fixed UI elements
    rating: "#fbbf24", // Gold star color

    // Overlays (fixed, don't change with theme)
    overlay: "#000000",
    overlayForeground: "#ffffff",
  },
  dark: {
    // Semantic colors that stay constant
    destructive: "#ef4444",
    destructiveForeground: "#ffffff",

    // Status colors
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    info: "#3b82f6",

    // Fixed UI elements
    rating: "#fbbf24", // Gold star color

    // Overlays (fixed, don't change with theme)
    overlay: "#000000",
    overlayForeground: "#ffffff",
  },
};

export type Theme = {
    background: string;
    backgroundSecondary: string;
    foreground: string;
    foregroundSecondary: string;
    foregroundTertiary: string;
    text: string;
    textSecondary: string;
    textTertiary: string;
    primary: string;
    primaryLight: string;
    primaryDark: string;
    accent: string;
    accentLight: string;
    card: string;
    muted: string;
    mutedForeground: string;
    destructive: string;
    destructiveForeground: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    border: string;
    ring: string;
    rating: string;
    icon: string;
    iconSecondary: string;
    iconMuted: string;
    overlay: string;
    overlayForeground: string;
};

export type ThemeKey = "light" | "dark";
export type ColorKey = keyof Theme;

/**
 * Get theme colors with the selected tint applied.
 * Merges base theme colors (status, destructive, overlay) with
 * tint-specific colors (backgrounds, foregrounds, primary, accent, etc.).
 */
export function getThemeColors(
  colorScheme: "light" | "dark",
  tintName: TintName = DEFAULT_TINT
): Theme {
  const baseColors = baseThemeColors[colorScheme];
  const tintColors = tints[tintName][colorScheme];

  return {
    ...tintColors,
    ...baseColors,
  };
}
