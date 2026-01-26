import { useTheme } from '@/contexts/ThemeContext';
import { borderRadius, spacing, useThemedStyles } from '@/lib/styles';
import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { Text } from './Text';

interface StatusBadgeProps {
  status: 'active' | 'archived' | 'draft' | string;
  size?: 'sm' | 'md';
  style?: StyleProp<ViewStyle>;
  customColor?: {
    background: string;
    text: string;
    border: string;
  };
}

export function StatusBadge({
  status,
  size = 'md',
  style,
  customColor,
}: StatusBadgeProps) {
  const { colors } = useTheme();

  // Default status colors
  const getStatusColors = () => {
    if (customColor) return customColor;

    switch (status) {
      case 'active':
        return {
          background: colors.success + '15', // 15% opacity
          text: colors.success,
          border: colors.success + '30', // 30% opacity
        };
      case 'archived':
        return {
          background: colors.foregroundTertiary + '15',
          text: colors.foregroundTertiary,
          border: colors.foregroundTertiary + '30',
        };
      case 'draft':
        return {
          background: colors.warning + '15',
          text: colors.warning,
          border: colors.warning + '30',
        };
      default:
        return {
          background: colors.muted,
          text: colors.foregroundSecondary,
          border: colors.border,
        };
    }
  };

  const statusColors = getStatusColors();

  const styles = useThemedStyles((colors) => ({
    badge: {
      backgroundColor: statusColors.background,
      borderWidth: 1,
      borderColor: statusColors.border,
      borderRadius: borderRadius.full,
      paddingHorizontal: size === 'sm' ? spacing.sm : spacing.md,
      paddingVertical: size === 'sm' ? spacing.xs : spacing.sm,
      alignSelf: 'flex-start',
    },
    text: {
      color: statusColors.text,
      fontSize: size === 'sm' ? 10 : 12,
      fontWeight: '600',
      textTransform: 'capitalize',
    },
  }));

  return (
    <View style={[styles.badge, style]}>
      <Text style={styles.text}>{status}</Text>
    </View>
  );
}