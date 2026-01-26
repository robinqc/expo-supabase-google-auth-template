/**
 * Single source of truth for all theme colors in Expo Supabase Starter.
 * These colors are injected as CSS variables at runtime via ThemeContext.
 */

export const themes = {
    light: {
        // Backgrounds
        background: "#f0ebe3", // Warm white
        backgroundSecondary: "#faf8f5", // Cream

        // Foreground (text)
        foreground: "#1c1917", // Warm black
        foregroundSecondary: "#78716c", // Warm gray
        foregroundTertiary: "#a8a29e", // Light warm gray

        // Legacy text colors (for backward compatibility during migration)
        text: "#1c1917",
        textSecondary: "#78716c",
        textTertiary: "#a8a29e",

        // Primary (purple)
        primary: "#1c1917", // Darker purple for light mode
        primaryLight: "#eca22bff",
        primaryDark: "#2d2723ff",

        // Accent (pink)
        accent: "#db2777", // Darker pink for light mode
        accentLight: "#ec4899",

        // Semantic colors
        card: "#ffffff",
        muted: "#f0ebe3",
        mutedForeground: "#78716c",
        destructive: "#dc2626",
        destructiveForeground: "#ffffff",

        // Status colors
        success: "#10b981",
        warning: "#f59e0b",
        error: "#ef4444",
        info: "#3b82f6",

        // UI elements
        border: "#e7e5e4", // Warm gray border
        ring: "#7c3aed", // Focus ring (primary color)
        rating: "#fbbf24", // Gold star color

        // Icon colors (matches foreground)
        icon: "#1c1917",
        iconSecondary: "#78716c",
        iconMuted: "#a8a29e",

        // Overlays (fixed, don't change with theme)
        overlay: "#000000",
        overlayForeground: "#ffffff",
    },
    dark: {
        // Backgrounds
        background: "#131317ff", // Dark blue-black
        backgroundSecondary: "#2a2a36ff", // Lighter dark blue

        // Foreground (text)
        foreground: "#ffffff", // White
        foregroundSecondary: "#9ca3af", // Light gray
        foregroundTertiary: "#6b7280", // Medium gray

        // Legacy text colors (for backward compatibility during migration)
        text: "#ffffff",
        textSecondary: "#9ca3af",
        textTertiary: "#6b7280",

        // Primary (purple)
        primary: "#f0ebe3", // Brighter purple for dark mode
        primaryLight: "#f6f0e7ff",
        primaryDark: "#dad4cbff",

        // Accent (pink)
        accent: "#ec4899", // Brighter pink for dark mode
        accentLight: "#f472b6",

        // Semantic colors
        card: "#1a1a2e",
        muted: "#1a1a2e",
        mutedForeground: "#9ca3af",
        destructive: "#ef4444",
        destructiveForeground: "#ffffff",

        // Status colors
        success: "#10b981",
        warning: "#f59e0b",
        error: "#ef4444",
        info: "#3b82f6",

        // UI elements
        border: "#374151", // Dark gray border
        ring: "#8b5cf6", // Focus ring (primary color)
        rating: "#fbbf24", // Gold star color

        // Icon colors (matches foreground)
        icon: "#ffffff",
        iconSecondary: "#9ca3af",
        iconMuted: "#6b7280",

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

export type ThemeKey = keyof typeof themes;
export type ColorKey = keyof Theme;