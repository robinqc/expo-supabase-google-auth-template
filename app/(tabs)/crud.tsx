import { CrudFilterBar, CrudList } from "@/components/crud";
import { Button } from "@/components/ui";
import { Text } from "@/components/ui/Text";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useCrudItems } from "@/hooks/useCrudItems";
import { deleteCrudItem } from "@/lib/crud";
import { layouts, spacing, useThemedStyles } from "@/lib/styles";
import { showToast } from "@/lib/toast";
import { CrudFilters, SortOption, ViewMode } from "@/types/crud";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Alert, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CrudScreen() {
    const { user } = useAuth();
    const { isDark, colors } = useTheme();
    const [viewMode, setViewMode] = useState<ViewMode>("list");
    const [sortOption, setSortOption] = useState<SortOption>("newest");
    const [filters, setFilters] = useState<CrudFilters>({});

    const styles = useThemedStyles((colors) => ({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        header: {
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.md,
            ...layouts.rowBetween,
        },
    }));

    const { items, loading, refreshing, hasMore, refresh, loadMore } = useCrudItems({
        sort: sortOption,
        filters,
        enabled: !!user,
    });

    const handleDelete = async (item: any) => {
        Alert.alert("Delete Item", "Are you sure you want to delete this item?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: async () => {
                    try {
                        if (!user?.id) return;
                        await deleteCrudItem(item.id, user.id);
                        showToast.success("Item deleted");
                        refresh();
                    } catch (error) {
                        showToast.error("Failed to delete item");
                        console.error("Error deleting item:", error);
                    }
                },
            },
        ]);
    };

    const handleFilterPress = () => {
        // TODO: Implement filter modal/bottom sheet
        showToast.info("Filter feature coming soon");
    };

    const sortableColumns = [{ id: "price", label: "Price", column: "price" }];

    return (
        <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
            <StatusBar style={isDark ? "light" : "dark"} />

            {/* Header */}
            <View style={styles.header}>
                <Text variant="heading" weight="extrabold">
                    CRUD
                </Text>
                <Button size="sm" icon="add" onPress={() => router.push("/crud/create" as any)}>
                    New
                </Button>
            </View>

            {/* Filter Bar */}
            <CrudFilterBar
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                sortOption={sortOption}
                onSortChange={setSortOption}
                onFilterPress={handleFilterPress}
                sortableColumns={sortableColumns}
            />

            {/* List */}
            <CrudList
                items={items}
                viewMode={viewMode}
                loading={loading}
                refreshing={refreshing}
                onRefresh={refresh}
                onLoadMore={loadMore}
                hasMore={hasMore}
                onItemDelete={handleDelete}
                emptyMessage="No items found"
                sortableColumns={sortableColumns}
                emptyAction={
                    <Button variant="primary" onPress={() => router.push("/crud/create" as any)}>
                        Create your first item
                    </Button>
                }
            />
        </SafeAreaView>
    );
}
