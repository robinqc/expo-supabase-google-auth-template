import { CrudFilterBar, CrudList } from "@/components/crud";
import { Button } from "@/components/ui";
import { Text } from "@/components/ui/Text";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useCrudItems } from "@/hooks/useCrudItems";
import { deleteCrudItem } from "@/lib/crud";
import { borderRadius, layouts, spacing, useThemedStyles } from "@/lib/styles";
import { showToast } from "@/lib/toast";
import { CrudFilters, CrudItem, SortOption, TableColumn, ViewMode } from "@/types/crud";
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

    // Table columns configuration
    const tableColumns: TableColumn<CrudItem>[] = [
        {
            id: "product",
            label: "PRODUCT",
            accessor: (item) => (
                <View style={{ gap: 4 }}>
                    <Text style={{ color: colors.foreground, fontSize: 14, fontWeight: "600" }}>{item.title}</Text>
                </View>
            ),
            width: 150,
            sticky: "left",
        },
        {
            id: "category",
            label: "CATEGORY",
            accessor: "category",
            width: 140,
        },
        {
            id: "status",
            label: "STATUS",
            accessor: (item) => (
                <View
                    style={{
                        paddingVertical: 4,
                        paddingHorizontal: 8,
                        backgroundColor: item.status === "active" ? colors.success + "20" : colors.foregroundSecondary + "20",
                        borderRadius: borderRadius.full,
                        alignSelf: "flex-start",
                    }}
                >
                    <Text style={{ color: item.status === "active" ? colors.success : colors.foregroundSecondary, fontSize: 11, fontWeight: "600", textTransform: "uppercase" }}>
                        {item.status}
                    </Text>
                </View>
            ),
            width: 110,
            align: "center",
        },
        {
            id: "subtitle",
            label: "DESCRIPTION",
            accessor: (item) => <Text style={{ color: colors.foregroundSecondary, fontSize: 13 }}>{item.subtitle || "-"}</Text>,
            width: 200,
        },
        {
            id: "actions",
            label: "ACTIONS",
            accessor: (item) => (
                <View style={{ flexDirection: "row", gap: 8, justifyContent: "center" }}>
                    <Button
                        size="sm"
                        variant="ghost"
                        icon="create-outline"
                        onPress={(e: any) => {
                            e.stopPropagation();
                            router.push({ pathname: "/crud/create", params: { id: item.id, mode: "edit" } });
                        }}
                    />
                    <Button
                        size="sm"
                        variant="ghost"
                        icon="trash-outline"
                        onPress={(e: any) => {
                            e.stopPropagation();
                            handleDelete(item);
                        }}
                    />
                </View>
            ),
            width: 120,
            align: "center",
        },
    ];

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
                columns={tableColumns}
                stickyColumn={{ position: "left", columnId: "product" }}
                emptyAction={
                    <Button variant="primary" onPress={() => router.push("/crud/create" as any)}>
                        Create your first item
                    </Button>
                }
            />
            <View style={{ height: 100 }} />
        </SafeAreaView>
    );
}
