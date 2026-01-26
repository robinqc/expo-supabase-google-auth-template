import { useTheme } from "@/contexts/ThemeContext";
import { themes } from "@/lib/themes";

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
 * @returns The requested theme's color palette
 */
export function getThemeColors(isDark: boolean) {
  return isDark ? themes.dark : themes.light;
}