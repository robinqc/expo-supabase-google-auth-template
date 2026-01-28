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

export type TintName = "teal" | "amber" | "earthGreen" | "purple" | "sienna";

export const DEFAULT_TINT: TintName = "earthGreen";

export const TINT_NAMES: TintName[] = ["teal", "amber", "earthGreen", "purple", "sienna"];

export interface TintMeta {
    label: string;
    swatch: string; // Color shown in picker
}

export const tintMeta: Record<TintName, TintMeta> = {
    teal: { label: "Teal", swatch: "#077287" },
    earthGreen: { label: "Earth Green", swatch: "#3f7f63" },
    amber: { label: "Amber", swatch: "#ca8a04" },
    purple: { label: "Purple", swatch: "#6b5ca5" },
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
            background: "#0E1A21",
            backgroundSecondary: "#142732",

            // Foreground (text)
            foreground: "#e6f1f3",
            foregroundSecondary: "#cde3e7",
            foregroundTertiary: "#b5d5db",

            // Legacy text colors
            text: "#E6F1F5",
            textSecondary: "#A9C6D3",
            textTertiary: "#6F8F9E",

            // Primary
            primary: "#519cab",
            primaryLight: "#6aaab7",
            primaryDark: "#00505c",

            // Accent (complementary - sky blue)
            accent: "#38bdf8",
            accentLight: "#7dd3fc",

            // Semantic colors
            card: "#1A3442",
            muted: "#214A5D",
            mutedForeground: "#e6f1f3",

            // UI elements
            border: "#2B4F63",
            ring: "#077287",

            // Icon colors
            icon: "#e6f1f3",
            iconSecondary: "#cde3e7",
            iconMuted: "#b5d5db",
        },
    },

    amber: {
        light: {
            // Backgrounds
            background: "#f8f5f0",
            backgroundSecondary: "#fdfefe",

            // Foreground (text)
            foreground: "#2f2618",
            foregroundSecondary: "#443824",
            foregroundTertiary: "#8a7a5c",

            // Legacy text colors
            text: "#2f2618",
            textSecondary: "#5a4a30",
            textTertiary: "#7f6a3f",

            // Primary
            primary: "#c0841a",
            primaryLight: "#e2b85c",
            primaryDark: "#8f5f10",

            // Accent (deep complementary – burnt umber)
            accent: "#92400e",
            accentLight: "#b45309",

            // Semantic colors
            card: "#ffffff",
            muted: "#f1ede4",
            mutedForeground: "#757269",

            // UI elements
            border: "#f1ede4",
            ring: "#c0841a",

            // Icon colors
            icon: "#443824",
            iconSecondary: "#5a4a30",
            iconMuted: "#a58f63",
        },

        dark: {
            // Backgrounds
            background: "#1c160c",
            backgroundSecondary: "#261d10",

            // Foreground (text)
            foreground: "#f1ede4",
            foregroundSecondary: "#e2d9c3",
            foregroundTertiary: "#cbbd9a",

            // Legacy text colors
            text: "#f1ede4",
            textSecondary: "#d6c9ab",
            textTertiary: "#9f8d63",

            // Primary
            primary: "#e2b85c",
            primaryLight: "#f0cf85",
            primaryDark: "#8f5f10",

            // Accent (soft gold highlight)
            accent: "#fbbf24",
            accentLight: "#fde68a",

            // Semantic colors
            card: "#2a2114",
            muted: "#3a2d19",
            mutedForeground: "#f1ede4",

            // UI elements
            border: "#4a3a21",
            ring: "#c0841a",

            // Icon colors
            icon: "#f1ede4",
            iconSecondary: "#e2d9c3",
            iconMuted: "#cbbd9a",
        },
    },

    // Copper - Warm orange-brown tones (DEFAULT - matches original theme)
    earthGreen: {
        light: {
            // Backgrounds
            background: "#f3f7f2",
            backgroundSecondary: "#fdfefe",

            // Foreground (text)
            foreground: "#1f2f24",
            foregroundSecondary: "#2e4436",
            foregroundTertiary: "#6b8f7a",

            // Legacy text colors
            text: "#1f2f24",
            textSecondary: "#3c5a47",
            textTertiary: "#5f8a72",

            // Primary
            primary: "#3f7f63",
            primaryLight: "#6fb899",
            primaryDark: "#2a5a45",

            // Accent (earthy complement – clay / rust)
            accent: "#b4532a",
            accentLight: "#d9774a",

            // Semantic colors
            card: "#ffffff",
            muted: "#e6efe9",
            mutedForeground: "#6f7572",

            // UI elements
            border: "#e6efe9",
            ring: "#3f7f63",

            // Icon colors
            icon: "#2e4436",
            iconSecondary: "#3c5a47",
            iconMuted: "#7aa693",
        },

        dark: {
            // Backgrounds
            background: "#121b16",
            backgroundSecondary: "#18261f",

            // Foreground (text)
            foreground: "#e6efe9",
            foregroundSecondary: "#cfe2d6",
            foregroundTertiary: "#b4cfc0",

            // Legacy text colors
            text: "#e6efe9",
            textSecondary: "#b6cdbf",
            textTertiary: "#7f9c8c",

            // Primary
            primary: "#7fbfa3",
            primaryLight: "#9fd7be",
            primaryDark: "#2a5a45",

            // Accent (soft mossy contrast)
            accent: "#84cc16",
            accentLight: "#bef264",

            // Semantic colors
            card: "#1d3329",
            muted: "#244236",
            mutedForeground: "#e6efe9",

            // UI elements
            border: "#2f4d3f",
            ring: "#3f7f63",

            // Icon colors
            icon: "#e6efe9",
            iconSecondary: "#cfe2d6",
            iconMuted: "#b4cfc0",
        },
    },

    purple: {
        light: {
            // Backgrounds
            background: "#f4f3f8",
            backgroundSecondary: "#fdfefe",

            // Foreground (text)
            foreground: "#2a2438",
            foregroundSecondary: "#3c3350",
            foregroundTertiary: "#7b6f96",

            // Legacy text colors
            text: "#2a2438",
            textSecondary: "#4a3f66",
            textTertiary: "#6f63a6",

            // Primary
            primary: "#6b5ca5",
            primaryLight: "#9a8fd1",
            primaryDark: "#4a3f7a",

            // Accent (warm complementary – rose / plum)
            accent: "#b83280",
            accentLight: "#d66aa9",

            // Semantic colors
            card: "#ffffff",
            muted: "#ebe9f2",
            mutedForeground: "#6f6d78",

            // UI elements
            border: "#ebe9f2",
            ring: "#6b5ca5",

            // Icon colors
            icon: "#3c3350",
            iconSecondary: "#4a3f66",
            iconMuted: "#8f85b3",
        },

        dark: {
            // Backgrounds
            background: "#14121d",
            backgroundSecondary: "#1b1830",

            // Foreground (text)
            foreground: "#ebe9f2",
            foregroundSecondary: "#d6d2e5",
            foregroundTertiary: "#beb9d6",

            // Legacy text colors
            text: "#ebe9f2",
            textSecondary: "#c9c4df",
            textTertiary: "#8d88b0",

            // Primary
            primary: "#9a8fd1",
            primaryLight: "#b6adeb",
            primaryDark: "#4a3f7a",

            // Accent (cool contrast – lavender glow)
            accent: "#a78bfa",
            accentLight: "#c4b5fd",

            // Semantic colors
            card: "#201c36",
            muted: "#2a2550",
            mutedForeground: "#ebe9f2",

            // UI elements
            border: "#342f5e",
            ring: "#6b5ca5",

            // Icon colors
            icon: "#ebe9f2",
            iconSecondary: "#d6d2e5",
            iconMuted: "#beb9d6",
        },
    },

    sienna: {
        light: {
            // Backgrounds
            background: "#f8f2ee",
            backgroundSecondary: "#fffdfb",

            // Foreground (text)
            foreground: "#3a1f14",
            foregroundSecondary: "#543022",
            foregroundTertiary: "#8b5a44ff",

            // Legacy text colors
            text: "#3a1f14",
            textSecondary: "#6a3b28",
            textTertiary: "#9a5b3c",

            // Primary (sienna)
            primary: "#a0522d", // classic sienna
            primaryLight: "#c7794fff",
            primaryDark: "#6f2f14",

            // Accent (complementary – cool blue)
            accent: "#2563eb",
            accentLight: "#60a5fa",

            // Semantic colors
            card: "#ffffff",
            muted: "#efe3dc",
            mutedForeground: "#7b6e68",

            // UI elements
            border: "#efe3dc",
            ring: "#a0522d",

            // Icon colors
            icon: "#4a2618",
            iconSecondary: "#6a3b28",
            iconMuted: "#b68a73",
        },
        dark: {
            // Backgrounds
            background: "#1b120e",
            backgroundSecondary: "#261a14",

            // Foreground (text)
            foreground: "#f4ebe6",
            foregroundSecondary: "#e6d6cc",
            foregroundTertiary: "#d2bfb2",

            // Legacy text colors
            text: "#f4ebe6",
            textSecondary: "#d2bfb2",
            textTertiary: "#a88f80",

            // Primary
            primary: "#d08b64",
            primaryLight: "#e3a87f",
            primaryDark: "#6f2f14",

            // Accent (cool contrast)
            accent: "#38bdf8",
            accentLight: "#7dd3fc",

            // Semantic colors
            card: "#2c1e17",
            muted: "#3a261d",
            mutedForeground: "#f4ebe6",

            // UI elements
            border: "#4a3126",
            ring: "#d08b64",

            // Icon colors
            icon: "#f4ebe6",
            iconSecondary: "#e6d6cc",
            iconMuted: "#d2bfb2",
        },
    },
};
