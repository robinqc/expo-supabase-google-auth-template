/**
 * Tint color palettes for the app.
 * Each tint defines a complete color cascade that affects the entire UI:
 * - Backgrounds (tinted whites/darks)
 * - Foregrounds/text (derived from tint)
 * - Muted colors (tinted grays)
 * - Borders (tinted)
 * - Icons (derived from tint)
 * - Primary/accent colors
 *
 * Tints: Amber, Bronze, Copper (default), Terracotta, Sienna
 */

export type TintName = "teal" | "bronze" | "copper" | "terracotta" | "sienna";

export const DEFAULT_TINT: TintName = "copper";

export const TINT_NAMES: TintName[] = ["teal", "bronze", "copper", "terracotta", "sienna"];

export interface TintMeta {
    label: string;
    swatch: string; // Color shown in picker
}

export const tintMeta: Record<TintName, TintMeta> = {
    teal: { label: "Teal", swatch: "#077287" },
    bronze: { label: "Bronze", swatch: "#ca8a04" },
    copper: { label: "Copper", swatch: "#ea580c" },
    terracotta: { label: "Terracotta", swatch: "#dc2626" },
    sienna: { label: "Sienna", swatch: "#92400e" },
};

/**
 * Full color cascade for each tint.
 * These override the base theme colors to create a cohesive tinted experience.
 * Excludes status/semantic colors that stay constant across tints.
 */
export interface TintColorOverrides {
    // Backgrounds
    background: string;
    backgroundSecondary: string;

    // Foreground (text)
    foreground: string;
    foregroundSecondary: string;
    foregroundTertiary: string;

    // Legacy text colors
    text: string;
    textSecondary: string;
    textTertiary: string;

    // Primary
    primary: string;
    primaryLight: string;
    primaryDark: string;

    // Accent
    accent: string;
    accentLight: string;

    // Semantic colors
    card: string;
    muted: string;
    mutedForeground: string;

    // UI elements
    border: string;
    ring: string;

    // Icon colors
    icon: string;
    iconSecondary: string;
    iconMuted: string;
}

export interface TintPalette {
    light: TintColorOverrides;
    dark: TintColorOverrides;
}

export const tints: Record<TintName, TintPalette> = {
    // Amber - Warm golden yellow tones
    teal: {
        light: {
            // Backgrounds
            background: "#f0f7f8",
            backgroundSecondary: "#fdfefe",

            // Foreground (text)
            foreground: "#032d36",
            foregroundSecondary: "#044451",
            foregroundTertiary: "#4d8b99ff",

            // Legacy text colors
            text: "#032d36",
            textSecondary: "#065a6c",
            textTertiary: "#207f93",

            // Primary
            primary: "#077287",
            primaryLight: "#2cb4d6",
            primaryDark: "#00505c",

            // Accent (complementary - sky blue)
            accent: "#c13b1b",
            accentLight: "#e15a3e",

            // Semantic colors
            card: "#ffffff",
            muted: "#e6f1f3",
            mutedForeground: "#73797a",

            // UI elements
            border: "#e6f1f3",
            ring: "#077287",

            // Icon colors
            icon: "#043944",
            iconSecondary: "#065a6c",
            iconMuted: "#6aaab7",
        },
        dark: {
            // Backgrounds
            background: "#18130a",
            backgroundSecondary: "#2d2312",

            // Foreground (text)
            foreground: "#fef3e2",
            foregroundSecondary: "#fcd34d",
            foregroundTertiary: "#a88a3d",

            // Legacy text colors
            text: "#fef3e2",
            textSecondary: "#fcd34d",
            textTertiary: "#a88a3d",

            // Primary
            primary: "#fbbf24",
            primaryLight: "#fcd34d",
            primaryDark: "#f59e0b",

            // Accent (complementary - sky blue)
            accent: "#38bdf8",
            accentLight: "#7dd3fc",

            // Semantic colors
            card: "#2d2312",
            muted: "#2d2312",
            mutedForeground: "#fcd34d",

            // UI elements
            border: "#78591c",
            ring: "#fbbf24",

            // Icon colors
            icon: "#fef3e2",
            iconSecondary: "#fcd34d",
            iconMuted: "#a88a3d",
        },
    },

    // Bronze - Rich metallic gold-brown tones
    bronze: {
        light: {
            // Backgrounds
            background: "#fdfcf5",
            backgroundSecondary: "#f7f3e3",

            // Foreground (text)
            foreground: "#1a1605",
            foregroundSecondary: "#6b5c1a",
            foregroundTertiary: "#9a8530",

            // Legacy text colors
            text: "#1a1605",
            textSecondary: "#6b5c1a",
            textTertiary: "#9a8530",

            // Primary
            primary: "#ca8a04",
            primaryLight: "#eab308",
            primaryDark: "#a16207",

            // Accent (complementary - indigo)
            accent: "#4f46e5",
            accentLight: "#6366f1",

            // Semantic colors
            card: "#ffffff",
            muted: "#f7f3e3",
            mutedForeground: "#6b5c1a",

            // UI elements
            border: "#fef08a",
            ring: "#ca8a04",

            // Icon colors
            icon: "#1a1605",
            iconSecondary: "#6b5c1a",
            iconMuted: "#9a8530",
        },
        dark: {
            // Backgrounds
            background: "#16140a",
            backgroundSecondary: "#2a2610",

            // Foreground (text)
            foreground: "#fef9c3",
            foregroundSecondary: "#fde047",
            foregroundTertiary: "#9a8530",

            // Legacy text colors
            text: "#fef9c3",
            textSecondary: "#fde047",
            textTertiary: "#9a8530",

            // Primary
            primary: "#facc15",
            primaryLight: "#fde047",
            primaryDark: "#eab308",

            // Accent (complementary - indigo)
            accent: "#818cf8",
            accentLight: "#a5b4fc",

            // Semantic colors
            card: "#2a2610",
            muted: "#2a2610",
            mutedForeground: "#fde047",

            // UI elements
            border: "#6b5c1a",
            ring: "#facc15",

            // Icon colors
            icon: "#fef9c3",
            iconSecondary: "#fde047",
            iconMuted: "#9a8530",
        },
    },

    // Copper - Warm orange-brown tones (DEFAULT - matches original theme)
    copper: {
        light: {
            // Backgrounds
            background: "#fdf8f3",
            backgroundSecondary: "#fef0e6",

            // Foreground (text)
            foreground: "#1c1310",
            foregroundSecondary: "#7c4a2d",
            foregroundTertiary: "#a8714d",

            // Legacy text colors
            text: "#1c1310",
            textSecondary: "#7c4a2d",
            textTertiary: "#a8714d",

            // Primary
            primary: "#ea580c",
            primaryLight: "#f97316",
            primaryDark: "#c2410c",

            // Accent (complementary - teal)
            accent: "#0d9488",
            accentLight: "#14b8a6",

            // Semantic colors
            card: "#ffffff",
            muted: "#fef0e6",
            mutedForeground: "#7c4a2d",

            // UI elements
            border: "#fed7aa",
            ring: "#ea580c",

            // Icon colors
            icon: "#1c1310",
            iconSecondary: "#7c4a2d",
            iconMuted: "#a8714d",
        },
        dark: {
            // Backgrounds
            background: "#1a120d",
            backgroundSecondary: "#2e1f16",

            // Foreground (text)
            foreground: "#ffedd5",
            foregroundSecondary: "#fdba74",
            foregroundTertiary: "#a8714d",

            // Legacy text colors
            text: "#ffedd5",
            textSecondary: "#fdba74",
            textTertiary: "#a8714d",

            // Primary
            primary: "#fb923c",
            primaryLight: "#fdba74",
            primaryDark: "#f97316",

            // Accent (complementary - teal)
            accent: "#2dd4bf",
            accentLight: "#5eead4",

            // Semantic colors
            card: "#2e1f16",
            muted: "#2e1f16",
            mutedForeground: "#fdba74",

            // UI elements
            border: "#7c4a2d",
            ring: "#fb923c",

            // Icon colors
            icon: "#ffedd5",
            iconSecondary: "#fdba74",
            iconMuted: "#a8714d",
        },
    },

    // Terracotta - Earthy red-orange tones
    terracotta: {
        light: {
            // Backgrounds
            background: "#fdf6f5",
            backgroundSecondary: "#fee8e6",

            // Foreground (text)
            foreground: "#1c0f0d",
            foregroundSecondary: "#7c2d26",
            foregroundTertiary: "#a84d45",

            // Legacy text colors
            text: "#1c0f0d",
            textSecondary: "#7c2d26",
            textTertiary: "#a84d45",

            // Primary
            primary: "#dc2626",
            primaryLight: "#ef4444",
            primaryDark: "#b91c1c",

            // Accent (complementary - cyan)
            accent: "#0891b2",
            accentLight: "#06b6d4",

            // Semantic colors
            card: "#ffffff",
            muted: "#fee8e6",
            mutedForeground: "#7c2d26",

            // UI elements
            border: "#fecaca",
            ring: "#dc2626",

            // Icon colors
            icon: "#1c0f0d",
            iconSecondary: "#7c2d26",
            iconMuted: "#a84d45",
        },
        dark: {
            // Backgrounds
            background: "#1a0d0b",
            backgroundSecondary: "#2e1714",

            // Foreground (text)
            foreground: "#fee2e2",
            foregroundSecondary: "#fca5a5",
            foregroundTertiary: "#a84d45",

            // Legacy text colors
            text: "#fee2e2",
            textSecondary: "#fca5a5",
            textTertiary: "#a84d45",

            // Primary
            primary: "#f87171",
            primaryLight: "#fca5a5",
            primaryDark: "#ef4444",

            // Accent (complementary - cyan)
            accent: "#22d3ee",
            accentLight: "#67e8f9",

            // Semantic colors
            card: "#2e1714",
            muted: "#2e1714",
            mutedForeground: "#fca5a5",

            // UI elements
            border: "#7c2d26",
            ring: "#f87171",

            // Icon colors
            icon: "#fee2e2",
            iconSecondary: "#fca5a5",
            iconMuted: "#a84d45",
        },
    },

    // Sienna - Deep burnt brown tones
    sienna: {
        light: {
            // Backgrounds
            background: "#faf8f6",
            backgroundSecondary: "#f2ebe5",

            // Foreground (text)
            foreground: "#1a1512",
            foregroundSecondary: "#5c4a3d",
            foregroundTertiary: "#8a7264",

            // Legacy text colors
            text: "#1a1512",
            textSecondary: "#5c4a3d",
            textTertiary: "#8a7264",

            // Primary
            primary: "#92400e",
            primaryLight: "#b45309",
            primaryDark: "#78350f",

            // Accent (complementary - violet)
            accent: "#7c3aed",
            accentLight: "#8b5cf6",

            // Semantic colors
            card: "#ffffff",
            muted: "#f2ebe5",
            mutedForeground: "#5c4a3d",

            // UI elements
            border: "#e8ddd3",
            ring: "#92400e",

            // Icon colors
            icon: "#1a1512",
            iconSecondary: "#5c4a3d",
            iconMuted: "#8a7264",
        },
        dark: {
            // Backgrounds
            background: "#171310",
            backgroundSecondary: "#2a231d",

            // Foreground (text)
            foreground: "#f2ebe5",
            foregroundSecondary: "#d6c4b8",
            foregroundTertiary: "#8a7264",

            // Legacy text colors
            text: "#f2ebe5",
            textSecondary: "#d6c4b8",
            textTertiary: "#8a7264",

            // Primary
            primary: "#c09e7f",
            primaryLight: "#d6c4b8",
            primaryDark: "#a8825d",

            // Accent (complementary - violet)
            accent: "#a78bfa",
            accentLight: "#c4b5fd",

            // Semantic colors
            card: "#2a231d",
            muted: "#2a231d",
            mutedForeground: "#d6c4b8",

            // UI elements
            border: "#5c4a3d",
            ring: "#c09e7f",

            // Icon colors
            icon: "#f2ebe5",
            iconSecondary: "#d6c4b8",
            iconMuted: "#8a7264",
        },
    },
};
