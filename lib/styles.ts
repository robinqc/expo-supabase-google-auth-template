import { useTheme } from '@/contexts/ThemeContext';
import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { Theme } from './themes';

/**
 * Spacing scale for consistent layout
 */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

/**
 * Border radius scale
 */
export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

/**
 * Typography presets using system fonts
 */
export const typography = {
  // Headings
  heading: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '800' as const,
  } as TextStyle,
  
  subheading: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700' as const,
  } as TextStyle,
  
  title: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600' as const,
  } as TextStyle,
  
  // Body text
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400' as const,
  } as TextStyle,
  
  bodyMedium: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500' as const,
  } as TextStyle,
  
  bodySemibold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600' as const,
  } as TextStyle,
  
  // Small text
  caption: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400' as const,
  } as TextStyle,
  
  label: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500' as const,
  } as TextStyle,
} as const;

/**
 * Common shadow styles
 */
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  } as ViewStyle,
  
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  } as ViewStyle,
  
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  } as ViewStyle,
} as const;

/**
 * Common flex layouts
 */
export const layouts = {
  row: {
    flexDirection: 'row',
  } as ViewStyle,
  
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  } as ViewStyle,
  
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  
  flex1: {
    flex: 1,
  } as ViewStyle,
} as const;

/**
 * Type for style factory function
 */
type StyleFactory<T> = (colors: Theme) => T;

/**
 * Hook to create themed styles using StyleSheet.create
 * 
 * @example
 * const styles = useThemedStyles((colors) => ({
 *   container: {
 *     backgroundColor: colors.background,
 *     padding: spacing.md,
 *   },
 *   title: {
 *     ...typography.heading,
 *     color: colors.foreground,
 *   },
 * }));
 */
export function useThemedStyles<T extends StyleSheet.NamedStyles<T>>(
  factory: StyleFactory<T>
): T {
  const { colors } = useTheme();
  return StyleSheet.create(factory(colors));
}

/**
 * Create a themed style object without StyleSheet.create
 * Useful for dynamic styles or when you need to merge with other styles
 * 
 * @example
 * const dynamicStyle = createThemedStyle((colors) => ({
 *   backgroundColor: isActive ? colors.primary : colors.background,
 * }));
 */
export function createThemedStyle<T extends ViewStyle | TextStyle | ImageStyle>(
  factory: StyleFactory<T>,
  colors: Theme
): T {
  return factory(colors);
}