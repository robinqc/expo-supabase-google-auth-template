import { useTheme } from '@/contexts/ThemeContext';
import { borderRadius, useThemedStyles } from '@/lib/styles';
import React from 'react';
import { Image, StyleProp, View, ViewStyle } from 'react-native';
import { Text } from './Text';

interface AvatarProps {
  name?: string;
  imageUrl?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export function Avatar({
  name,
  imageUrl,
  size = 48,
  style,
}: AvatarProps) {
  const { colors } = useTheme();

  const styles = useThemedStyles((colors) => ({
    container: {
      width: size,
      height: size,
      borderRadius: borderRadius.full,
      backgroundColor: colors.backgroundSecondary,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    image: {
      width: size,
      height: size,
      borderRadius: borderRadius.full,
    },
    fallbackText: {
      color: colors.foregroundSecondary,
      fontSize: size * 0.4,
      fontWeight: '700',
    },
  }));

  const getInitial = () => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  return (
    <View style={[styles.container, style]}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.image} />
      ) : (
        <Text style={styles.fallbackText}>{getInitial()}</Text>
      )}
    </View>
  );
}