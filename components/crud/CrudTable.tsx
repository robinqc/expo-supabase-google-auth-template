import { Text } from "@/components/ui/Text";
import { useTheme } from "@/contexts/ThemeContext";
import { spacing, useThemedStyles } from "@/lib/styles";
import { CrudItem as CrudItemType, StickyColumnConfig, TableColumn } from "@/types/crud";
import _ from "lodash";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, ScrollView, TouchableOpacity, View } from "react-native";

interface CrudTableProps<T = CrudItemType> {
    items: T[];
    columns: TableColumn<T>[];
    stickyColumn?: StickyColumnConfig;
    loading?: boolean;
    refreshing?: boolean;
    onRefresh?: () => void;
    onLoadMore?: () => void;
    hasMore?: boolean;
    onItemPress?: (item: T) => void;
    onItemDelete?: (item: T) => void;
    emptyMessage?: string;
    emptyAction?: React.ReactNode;
    keyExtractor?: (item: T) => string;
}

export function CrudTable<T extends CrudItemType = CrudItemType>({
    items,
    columns,
    stickyColumn,
    loading = false,
    refreshing = false,
    onRefresh,
    onLoadMore,
    hasMore = false,
    onItemPress,
    onItemDelete,
    emptyMessage = "No items found",
    emptyAction,
    keyExtractor = (item) => item.id,
}: CrudTableProps<T>) {
    const { colors } = useTheme();

    // Sorting state
    const [direction, setDirection] = useState<"asc" | "desc" | null>(null);
    const [selectedColumn, setSelectedColumn] = useState<string | null>(null);
    const [tableData, setTableData] = useState<T[]>([]);

    // Refs for scroll synchronization
    const fixedListRef = useRef<FlatList>(null);
    const scrollableListRef = useRef<FlatList>(null);

    const styles = useThemedStyles((colors) => ({
        container: {
            flex: 1,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.background,
            borderRadius: spacing.xs,
            overflow: "hidden",
        },
        rowContainer: {
            flexDirection: "row",
        },
        headerRow: {
            flexDirection: "row",
            backgroundColor: colors.muted,
            borderBottomWidth: 2,
            borderBottomColor: colors.border,
        },
        headerCell: {
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
            justifyContent: "center",
            minHeight: 44,
            borderRightWidth: 1,
            borderRightColor: colors.border,
        },
        headerText: {
            color: colors.foregroundSecondary,
            fontSize: 11,
            fontWeight: "700",
            textTransform: "uppercase",
            letterSpacing: 0.5,
        },
        headerTextCenter: {
            textAlign: "center",
        },
        headerTextRight: {
            textAlign: "right",
        },
        fixedColumnHeader: {
            backgroundColor: colors.muted,
            borderBottomWidth: 2,
            borderBottomColor: colors.border,
            borderRightWidth: 2,
            borderRightColor: colors.border,
            minHeight: 44,
        },
        fixedColumnCell: {
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
            justifyContent: "center",
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
            borderRightWidth: 2,
            borderRightColor: colors.border,
            backgroundColor: colors.background,
            minHeight: 56,
        },
        scrollableCell: {
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
            justifyContent: "center",
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
            borderRightWidth: 1,
            borderRightColor: colors.border,
            minHeight: 56,
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
        arrowImage: {
            width: 12,
            height: 12,
            tintColor: colors.foregroundSecondary,
        },
    }));

    // Update table data when items change
    useEffect(() => {
        setTableData(items);
    }, [items]);

    // Determine fixed and scrollable columns
    const fixedColumn = useMemo(() => {
        if (!stickyColumn) return null;
        return columns.find((col) => col.id === stickyColumn.columnId) || null;
    }, [columns, stickyColumn]);

    const scrollableColumns = useMemo(() => {
        if (!stickyColumn) return columns;
        return columns.filter((col) => col.id !== stickyColumn.columnId);
    }, [columns, stickyColumn]);

    // Sort table function
    const sortTable = useCallback(
        (column: TableColumn<T>) => {
            const newDirection = direction === "desc" ? "asc" : "desc";

            // Get the sort key
            let sortKey: string;
            if (typeof column.accessor === "function") {
                // Can't sort on function accessors easily, skip for now
                return;
            } else {
                sortKey = String(column.accessor);
            }

            const sortedData = _.orderBy(tableData, [sortKey], [newDirection]);

            setSelectedColumn(column.id);
            setDirection(newDirection);
            setTableData(sortedData);
        },
        [direction, tableData],
    );

    // Arrow rotation for sort indicator
    const arrowRotation = useMemo(
        () => ({
            transform: [{ rotate: direction === "desc" ? "270deg" : "90deg" }],
        }),
        [direction],
    );

    // Render table header
    const renderTableHeader = useCallback(
        (cols: TableColumn<T>[], isFixedHeader: boolean) => (
            <View style={styles.headerRow}>
                {cols.map((column) => (
                    <TouchableOpacity
                        key={column.id}
                        style={[
                            styles.headerCell,
                            isFixedHeader && styles.fixedColumnHeader,
                            {
                                width: column.width,
                                minWidth: column.minWidth,
                                flex: column.flex,
                            },
                        ]}
                        onPress={() => sortTable(column)}
                    >
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Text style={[styles.headerText, column.align === "center" && styles.headerTextCenter, column.align === "right" && styles.headerTextRight]}>
                                {column.label}{" "}
                            </Text>
                            {selectedColumn === column.id && <Text style={[styles.headerText, arrowRotation]}>▶</Text>}
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        ),
        [arrowRotation, selectedColumn, sortTable, styles],
    );

    // Render fixed column cell
    const renderFixedColumnCell = useCallback(
        (item: T) => {
            if (!fixedColumn) return null;

            let content: React.ReactNode;
            if (typeof fixedColumn.accessor === "function") {
                content = fixedColumn.accessor(item);
            } else {
                const value = item[fixedColumn.accessor as keyof T];
                content = <Text style={{ color: colors.foreground, fontSize: 14 }}>{String(value ?? "")}</Text>;
            }

            return (
                <View
                    style={[
                        styles.fixedColumnCell,
                        {
                            width: fixedColumn.width,
                            minWidth: fixedColumn.minWidth,
                        },
                    ]}
                >
                    {content}
                </View>
            );
        },
        [fixedColumn, colors, styles],
    );

    // Render scrollable row
    const renderScrollableRow = useCallback(
        (item: T) => {
            return (
                <View style={styles.rowContainer}>
                    {scrollableColumns.map((column) => {
                        let content: React.ReactNode;
                        if (typeof column.accessor === "function") {
                            content = column.accessor(item);
                        } else {
                            const value = item[column.accessor as keyof T];
                            content = (
                                <Text
                                    style={{
                                        color: colors.foreground,
                                        fontSize: 14,
                                        textAlign: column.align || "left",
                                    }}
                                >
                                    {String(value ?? "")}
                                </Text>
                            );
                        }

                        return (
                            <View
                                key={column.id}
                                style={[
                                    styles.scrollableCell,
                                    {
                                        width: column.width,
                                        minWidth: column.minWidth,
                                        flex: column.flex,
                                    },
                                ]}
                            >
                                {content}
                            </View>
                        );
                    })}
                </View>
            );
        },
        [scrollableColumns, colors, styles],
    );

    const renderFooter = (showSpinner = true) => {
        if (!hasMore) return null;
        return <View style={[styles.footer, !showSpinner && { height: 50, opacity: 0 }]}>{showSpinner && <ActivityIndicator size="small" color={colors.foreground} />}</View>;
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

    // Track which list is being scrolled to avoid loops
    const scrollLeader = useRef<"fixed" | "scrollable" | null>(null);

    const onFixedScroll = (e: any) => {
        if (scrollLeader.current === "scrollable") return;
        scrollLeader.current = "fixed";
        scrollableListRef.current?.scrollToOffset({
            offset: e.nativeEvent.contentOffset.y,
            animated: false,
        });
    };

    const onScrollableScroll = (e: any) => {
        if (scrollLeader.current === "fixed") return;
        scrollLeader.current = "scrollable";
        fixedListRef.current?.scrollToOffset({
            offset: e.nativeEvent.contentOffset.y,
            animated: false,
        });
    };

    const onScrollEnd = () => {
        scrollLeader.current = null;
    };

    if (loading && tableData.length === 0) {
        return <View style={styles.container}>{renderEmpty()}</View>;
    }

    return (
        <View style={styles.container}>
            <View style={[styles.rowContainer, { flex: 1 }]}>
                {/* Fixed First Column */}
                {fixedColumn && stickyColumn?.position === "left" && (
                    <View style={{ width: fixedColumn.width }}>
                        {renderTableHeader([fixedColumn], true)}
                        <FlatList
                            ref={fixedListRef}
                            data={tableData}
                            keyExtractor={keyExtractor}
                            renderItem={({ item }) => renderFixedColumnCell(item)}
                            scrollEnabled={true}
                            showsVerticalScrollIndicator={false}
                            scrollEventThrottle={16}
                            onScroll={onFixedScroll}
                            onMomentumScrollEnd={onScrollEnd}
                            onScrollEndDrag={onScrollEnd}
                            ListFooterComponent={() => renderFooter(false)}
                            style={{ flex: 1 }}
                        />
                    </View>
                )}

                {/* Scrollable Columns */}
                <ScrollView horizontal showsHorizontalScrollIndicator={true} style={{ flex: 1 }}>
                    <View style={{ flex: 1 }}>
                        {renderTableHeader(scrollableColumns, false)}
                        <FlatList
                            ref={scrollableListRef}
                            data={tableData}
                            keyExtractor={keyExtractor}
                            renderItem={({ item }) => renderScrollableRow(item)}
                            ListEmptyComponent={renderEmpty}
                            ListFooterComponent={() => renderFooter(true)}
                            onEndReached={onLoadMore}
                            onEndReachedThreshold={0.5}
                            refreshControl={
                                onRefresh ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.foreground} colors={[colors.foreground]} /> : undefined
                            }
                            showsVerticalScrollIndicator={true}
                            scrollEventThrottle={16}
                            onScroll={onScrollableScroll}
                            onMomentumScrollEnd={onScrollEnd}
                            onScrollEndDrag={onScrollEnd}
                            style={{ flex: 1 }}
                        />
                    </View>
                </ScrollView>
            </View>
        </View>
    );
}
