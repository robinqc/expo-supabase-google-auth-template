import { CrudFilterBar, CrudList } from "@/components/crud";
import { Button } from "@/components/ui";
import { HeaderView } from "@/components/ui/HeaderView";
import { Text } from "@/components/ui/Text";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useCrudItems } from "@/hooks/useCrudItems";
import { deleteCrudItem } from "@/lib/crud";
import { borderRadius, layouts, spacing, useThemedStyles } from "@/lib/styles";
import { showToast } from "@/lib/toast";
import { CrudFilters, CrudItem, SortOption, TableColumn, ViewMode } from "@/types/crud";
import { router } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, View } from "react-native";

export default function CrudScreen() {
    const { user } = useAuth();
    const { isDark, colors } = useTheme();
    const { t } = useTranslation();
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
        Alert.alert(t("crud.deleteItem"), t("crud.deleteConfirmation"), [
            { text: t("common.cancel"), style: "cancel" },
            {
                text: t("common.delete"),
                style: "destructive",
                onPress: async () => {
                    try {
                        if (!user?.id) return;
                        await deleteCrudItem(item.id, user.id);
                        showToast.success(t("crud.itemDeleted"));
                        refresh();
                    } catch (error) {
                        showToast.error(t("crud.deleteFailed"));
                        console.error("Error deleting item:", error);
                    }
                },
            },
        ]);
    };

    const handleFilterPress = () => {
        // TODO: Implement filter modal/bottom sheet
        showToast.info(t("crud.filterComingSoon"));
    };

    const sortableColumns = [{ id: "price", label: t("crud.price"), column: "price" }];

    // Table columns configuration
    const tableColumns: TableColumn<CrudItem>[] = [
        {
            id: "product",
            label: t("crud.product"),
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
            label: t("crud.category"),
            accessor: "category",
            width: 140,
        },
        {
            id: "status",
            label: t("crud.status"),
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
                        {t(`status.${item.status}`)}
                    </Text>
                </View>
            ),
            width: 110,
            align: "center",
        },
        {
            id: "subtitle",
            label: t("crud.description"),
            accessor: (item) => <Text style={{ color: colors.foregroundSecondary, fontSize: 13 }}>{item.subtitle || "-"}</Text>,
            width: 200,
        },
        {
            id: "actions",
            label: t("crud.actions"),
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
        <HeaderView
            title={t("crud.title")}
            actionButton={
                <Button size="sm" icon="add" onPress={() => router.push("/crud/create" as any)}>
                    {t("common.new")}
                </Button>
            }
            style={styles.container}
            fixed
        >
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
                emptyMessage={t("crud.noItemsFound")}
                sortableColumns={sortableColumns}
                columns={tableColumns}
                stickyColumn={{ position: "left", columnId: "product" }}
                emptyAction={
                    <Button variant="primary" onPress={() => router.push("/crud/create" as any)}>
                        {t("crud.createFirstItem")}
                    </Button>
                }
            />
        </HeaderView>
    );
}
