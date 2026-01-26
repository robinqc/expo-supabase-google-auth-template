import { useTheme } from '@/contexts/ThemeContext';
import { spacing, useThemedStyles } from '@/lib/styles';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { Text } from './Text';

interface DetailRowProps {
  label: string;
  value: string | React.ReactNode;
  icon?: keyof typeof Ionicons.glyphMap;
  showDivider?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function DetailRow({
  label,
  value,
  icon,
  showDivider = true,
  style,
}: DetailRowProps) {
  const { colors } = useTheme();

  const styles = useThemedStyles((colors) => ({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: spacing.md,
      borderBottomWidth: showDivider ? 1 : 0,
      borderBottomColor: colors.border + '20', // 20% opacity
    },
    label: {
      color: colors.foregroundSecondary,
      fontSize: 14,
    },
    valueContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    value: {
      color: colors.foreground,
      fontSize: 14,
      fontWeight: '500',
    },
  }));

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.valueContainer}>
        {icon && (
          <Ionicons name={icon} size={14} color={colors.foregroundSecondary} />
        )}
        {typeof value === 'string' ? (
          <Text style={styles.value}>{value}</Text>
        ) : (
          value
        )}
      </View>
    </View>
  );
}