import { Text } from "@/components/ui/Text";
import { useTheme } from "@/contexts/ThemeContext";
import { spacing, useThemedStyles } from "@/lib/styles";
import { CrudItem as CrudItemType, SortableColumn, ViewMode } from "@/types/crud";
import React from "react";
import { ActivityIndicator, FlatList, RefreshControl, View } from "react-native";
import { CrudItem } from "./CrudItem";

interface CrudListProps<T = CrudItemType> {
    items: T[];
    viewMode: ViewMode;
    loading?: boolean;
    refreshing?: boolean;
    onRefresh?: () => void;
    onLoadMore?: () => void;
    hasMore?: boolean;
    onItemPress?: (item: T) => void;
    onItemDelete?: (item: T) => void;
    renderItem?: (item: T, viewMode: ViewMode) => React.ReactNode;
    emptyMessage?: string;
    emptyAction?: React.ReactNode;
    keyExtractor?: (item: T) => string;
    sortableColumns?: SortableColumn[];
}

export function CrudList<T extends CrudItemType = CrudItemType>({
    items,
    viewMode,
    loading = false,
    refreshing = false,
    onRefresh,
    onLoadMore,
    hasMore = false,
    onItemPress,
    onItemDelete,
    renderItem,
    emptyMessage = "No items found",
    emptyAction,
    keyExtractor = (item) => item.id,
}: CrudListProps<T>) {
    const { colors } = useTheme();

    const styles = useThemedStyles((colors) => ({
        container: {
            flex: 1,
        },
        contentContainer: {
            padding: spacing.md,
            gap: spacing.md,
        },
        columnWrapper: {
            gap: spacing.md,
        },
        emptyContainer: {
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: spacing.xxl,
            gap: spacing.md,
        },
        emptyText: {
            color: colors.foregroundSecondary,
            fontSize: 14,
        },
        footer: {
            paddingVertical: spacing.lg,
            alignItems: "center",
        },
        loadingContainer: {
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: spacing.xxl,
        },
    }));

    const renderItemWrapper = ({ item }: { item: T }) => {
        if (renderItem) {
            return <>{renderItem(item, viewMode)}</>;
        }
        return <CrudItem item={item as CrudItemType} viewMode={viewMode} onPress={onItemPress as any} onDelete={onItemDelete as any} />;
    };

    const renderFooter = () => {
        if (!hasMore) return null;
        return (
            <View style={styles.footer}>
                <ActivityIndicator size="small" color={colors.foreground} />
            </View>
        );
    };

    const renderEmpty = () => {
        if (loading) {
            return (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.foreground} />
                </View>
            );
        }

        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>{emptyMessage}</Text>
                {emptyAction}
            </View>
        );
    };

    if (loading && items.length === 0) {
        return <View style={styles.container}>{renderEmpty()}</View>;
    }

    return (
        <FlatList
            data={items}
            renderItem={renderItemWrapper}
            keyExtractor={keyExtractor}
            numColumns={viewMode === "grid" ? 2 : 1}
            key={viewMode} // Force remount when changing view mode
            contentContainerStyle={styles.contentContainer}
            columnWrapperStyle={viewMode === "grid" ? styles.columnWrapper : undefined}
            ListEmptyComponent={renderEmpty}
            ListFooterComponent={renderFooter}
            onEndReached={onLoadMore}
            onEndReachedThreshold={0.5}
            refreshControl={onRefresh ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.foreground} colors={[colors.foreground]} /> : undefined}
            showsVerticalScrollIndicator={false}
        />
    );
}
