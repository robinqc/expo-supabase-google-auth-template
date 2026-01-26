import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/contexts/ThemeContext';
import { spacing, useThemedStyles } from '@/lib/styles';
import { CrudItem as CrudItemType, ViewMode } from '@/types/crud';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

interface CrudItemProps {
  item: CrudItemType;
  viewMode: ViewMode;
  onDelete?: (item: CrudItemType) => void;
  onPress?: (item: CrudItemType) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function CrudItem({
  item,
  viewMode,
  onDelete,
  onPress,
}: CrudItemProps) {
  const { colors } = useTheme();

  const handlePress = () => {
    if (onPress) {
      onPress(item);
    } else {
      router.push(`/crud/${item.id}`);
    }
  };

  const handleEdit = (e: any) => {
    e.stopPropagation();
    router.push({
      pathname: '/crud/create',
      params: { id: item.id, mode: 'edit' },
    });
  };

  const handleDelete = (e: any) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(item);
    }
  };

  const styles = useThemedStyles((colors) => ({
    // Grid View Styles
    gridContainer: {
      flex: 1,
    },
    gridContent: {
      padding: spacing.md,
      gap: spacing.md,
    },
    gridHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    gridActions: {
      flexDirection: 'row',
      gap: spacing.xs,
    },
    gridBody: {
      flex: 1,
      gap: spacing.xs,
    },
    gridTitle: {
      color: colors.foreground,
      fontSize: 16,
      fontWeight: '600',
      lineHeight: 20,
    },
    gridSubtitle: {
      color: colors.foregroundSecondary,
      fontSize: 12,
      lineHeight: 16,
    },
    gridFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: spacing.sm,
      borderTopWidth: 1,
      borderTopColor: colors.border + '20',
    },
    gridCategory: {
      color: colors.foregroundTertiary,
      fontSize: 10,
      fontFamily: 'monospace',
    },
    gridActionButtons: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
    
    // List View Styles
    listContainer: {
      flex: 1,
    },
    listContent: {
      padding: spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    listBody: {
      flex: 1,
      gap: spacing.xs,
    },
    listHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    listTitle: {
      color: colors.foreground,
      fontSize: 16,
      fontWeight: '600',
      flex: 1,
    },
    listSubtitle: {
      color: colors.foregroundSecondary,
      fontSize: 12,
    },
    listActions: {
      flexDirection: 'row',
      gap: spacing.xs,
    },
    
    // Common Styles
    iconButton: {
      padding: spacing.sm,
      borderRadius: 999,
      backgroundColor: 'transparent',
    },
    iconButtonHover: {
      backgroundColor: colors.muted,
    },
    moreButton: {
      padding: spacing.sm,
    },
    actionButton: {
      padding: spacing.sm,
      borderRadius: 999,
    },
  }));

  if (viewMode === 'grid') {
    return (
      <AnimatedPressable
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(200)}
        style={styles.gridContainer}
        onPress={handlePress}
      >
        <Card variant="outlined" padding="md" style={styles.gridContent}>
          <View style={styles.gridHeader}>
            <StatusBadge status={item.status} size="sm" />
            <Pressable
              style={styles.moreButton}
              onPress={handlePress}
              hitSlop={spacing.sm}
            >
              <Ionicons
                name="ellipsis-horizontal"
                size={18}
                color={colors.foregroundSecondary}
              />
            </Pressable>
          </View>

          <View style={styles.gridBody}>
            <Text style={styles.gridTitle} numberOfLines={2}>
              {item.title}
            </Text>
            {item.subtitle && (
              <Text style={styles.gridSubtitle} numberOfLines={2}>
                {item.subtitle}
              </Text>
            )}
          </View>

          <View style={styles.gridFooter}>
            <Text style={styles.gridCategory}>{item.category}</Text>
            <View style={styles.gridActionButtons}>
              <Pressable
                style={styles.actionButton}
                onPress={handleEdit}
                hitSlop={spacing.sm}
              >
                <Ionicons
                  name="create-outline"
                  size={14}
                  color={colors.foregroundSecondary}
                />
              </Pressable>
              <Pressable
                style={styles.actionButton}
                onPress={handleDelete}
                hitSlop={spacing.sm}
              >
                <Ionicons
                  name="trash-outline"
                  size={14}
                  color={colors.destructive}
                />
              </Pressable>
            </View>
          </View>
        </Card>
      </AnimatedPressable>
    );
  }

  // List View
  return (
    <AnimatedPressable
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(200)}
      style={styles.listContainer}
      onPress={handlePress}
    >
      <Card variant="outlined" padding="md" style={styles.listContent}>
        <Avatar name={item.title} size={48} />

        <View style={styles.listBody}>
          <View style={styles.listHeader}>
            <Text style={styles.listTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <StatusBadge status={item.status} size="sm" />
          </View>
          {item.subtitle && (
            <Text style={styles.listSubtitle} numberOfLines={1}>
              {item.subtitle}
            </Text>
          )}
        </View>

        <View style={styles.listActions}>
          <Pressable
            style={styles.iconButton}
            onPress={handleEdit}
            hitSlop={spacing.sm}
          >
            <Ionicons
              name="create-outline"
              size={16}
              color={colors.foregroundSecondary}
            />
          </Pressable>
          <Pressable
            style={styles.iconButton}
            onPress={handleDelete}
            hitSlop={spacing.sm}
          >
            <Ionicons
              name="trash-outline"
              size={16}
              color={colors.destructive}
            />
          </Pressable>
        </View>
      </Card>
    </AnimatedPressable>
  );
}