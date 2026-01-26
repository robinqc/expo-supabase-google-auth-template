import { useTheme } from '@/contexts/ThemeContext';
import { typography } from '@/lib/styles';
import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';

type TextVariant = 'heading' | 'subheading' | 'title' | 'body' | 'bodyMedium' | 'bodySemibold' | 'caption' | 'label';
type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold' | 'extrabold';
type TextColor = 'primary' | 'secondary' | 'tertiary' | 'accent' | 'error' | 'success' | 'warning' | 'info' | 'white';
type TextAlign = 'left' | 'center' | 'right' | 'justify';

export interface TextProps extends Omit<RNTextProps, 'style'> {
  variant?: TextVariant;
  weight?: TextWeight;
  color?: TextColor;
  align?: TextAlign;
  style?: RNTextProps['style'];
  children: React.ReactNode;
}

// Map weights to system font weights
const fontWeightMap: Record<TextWeight, number> = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
};

export function Text({
  variant = 'body',
  weight,
  color = 'primary',
  align = 'left',
  style,
  children,
  ...props
}: TextProps) {
  const { colors } = useTheme();

  // Get base variant style
  const baseStyle = typography[variant];

  // Determine font weight
  const fontWeight = weight ? fontWeightMap[weight] : baseStyle.fontWeight;

  // Get text color
  const textColor = {
    primary: colors.foreground,
    secondary: colors.foregroundSecondary,
    tertiary: colors.foregroundTertiary,
    accent: colors.accent,
    error: colors.error,
    success: colors.success,
    warning: colors.warning,
    info: colors.info,
    white: '#ffffff',
  }[color];

  const computedStyle: any = [
    baseStyle,
    { color: textColor, textAlign: align },
    fontWeight && { fontWeight },
    style,
  ];

  return (
    <RNText style={computedStyle} {...props}>
      {children}
    </RNText>
  );
}