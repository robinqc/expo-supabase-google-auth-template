import { useTheme } from "@/contexts/ThemeContext";
import { getThemeColors as getThemeColorsFromTint } from "@/lib/themes";
import { TintName, DEFAULT_TINT } from "@/lib/tints";

/**
 * Hook to get theme-aware colors for use in places where
 * Tailwind classes don't work (icons, ActivityIndicator, RefreshControl, etc.)
 * 
 * @returns The current theme's color palette
 */
export function useThemeColors() {
  const { colors } = useTheme();
  return colors;
}

/**
 * Returns theme colors without hook (for use outside components)
 * 
 * @param isDark - Whether to return dark or light theme colors
 * @param tintName - Optional tint name (defaults to copper)
 * @returns The requested theme's color palette
 */
export function getStaticThemeColors(isDark: boolean, tintName: TintName = DEFAULT_TINT) {
  const colorScheme = isDark ? "dark" : "light";
  return getThemeColorsFromTint(colorScheme, tintName);
}
