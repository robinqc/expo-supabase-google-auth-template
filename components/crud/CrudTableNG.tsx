import { Text } from "@/components/ui/Text";
import { useTheme } from "@/contexts/ThemeContext";
import { spacing, useThemedStyles } from "@/lib/styles";
import { CrudItem as CrudItemType, StickyColumnConfig, TableColumn } from "@/types/crud";
import _ from "lodash";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    ActivityIndicator,
    Animated,
    FlatList,
    RefreshControl,
    ScrollView,
    TouchableOpacity,
    View,
} from "react-native";

// Create AnimatedFlatList for native-driven scroll events
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList) as any;

// Constants for consistent sizing
const HEADER_HEIGHT = 44;
const ROW_HEIGHT = 56;
const DEFAULT_COLUMN_WIDTH = 120;
const DEFAULT_FIXED_COLUMN_WIDTH = 150;

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

    // Animated scroll position for syncing fixed column vertically
    const scrollY = useRef(new Animated.Value(0)).current;

    // Sorting state
    const [direction, setDirection] = useState<"asc" | "desc" | null>(null);
    const [selectedColumn, setSelectedColumn] = useState<string | null>(null);
    const [tableData, setTableData] = useState<T[]>([]);

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

    const fixedColumnWidth = fixedColumn?.width ?? fixedColumn?.minWidth ?? DEFAULT_FIXED_COLUMN_WIDTH;

    // Calculate total width of scrollable columns for FlatList contentContainerStyle
    const scrollableContentWidth = useMemo(() => {
        return scrollableColumns.reduce((total, col) => {
            return total + (col.width ?? col.minWidth ?? DEFAULT_COLUMN_WIDTH);
        }, 0);
    }, [scrollableColumns]);

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

    // Arrow indicator for sort direction
    const renderSortArrow = useCallback(
        (columnId: string) => {
            if (selectedColumn !== columnId) return null;
            return (
                <Text
                    style={{
                        color: colors.foreground,
                        fontSize: 10,
                        marginLeft: 4,
                        transform: [{ rotate: direction === "desc" ? "180deg" : "0deg" }],
                    }}
                >
                    ^
                </Text>
            );
        },
        [selectedColumn, direction, colors.foreground],
    );

    // Styles using themed styles hook
    const styles = useThemedStyles((colors) => ({
        container: {
            flex: 1,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.background,
            borderRadius: spacing.xs,
            overflow: "hidden",
        },
        // Scrollable header row
        headerRow: {
            flexDirection: "row",
            backgroundColor: colors.muted,
            borderBottomWidth: 2,
            borderBottomColor: colors.border,
            height: HEADER_HEIGHT,
        },
        headerCell: {
            paddingHorizontal: spacing.md,
            justifyContent: "center",
            height: HEADER_HEIGHT,
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
        // Scrollable data row
        dataRow: {
            flexDirection: "row",
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
            height: ROW_HEIGHT,
        },
        dataCell: {
            paddingHorizontal: spacing.md,
            justifyContent: "center",
            height: ROW_HEIGHT,
            borderRightWidth: 1,
            borderRightColor: colors.border,
        },
        cellText: {
            color: colors.foreground,
            fontSize: 14,
        },
        // Fixed column overlay
        fixedColumnContainer: {
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            backgroundColor: colors.background,
            borderRightWidth: 2,
            borderRightColor: colors.border,
            zIndex: 10,
        },
        fixedHeaderCell: {
            backgroundColor: colors.muted,
            paddingHorizontal: spacing.md,
            justifyContent: "center",
            height: HEADER_HEIGHT,
            borderBottomWidth: 2,
            borderBottomColor: colors.border,
        },
        fixedColumnBody: {
            flex: 1,
            overflow: "hidden",
        },
        fixedDataCell: {
            paddingHorizontal: spacing.md,
            justifyContent: "center",
            height: ROW_HEIGHT,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
            backgroundColor: colors.background,
        },
        // Empty and loading states
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
        loadingContainer: {
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: spacing.xxl,
        },
        footer: {
            paddingVertical: spacing.lg,
            alignItems: "center",
        },
    }));

    // Render scrollable header row
    const renderScrollableHeader = useCallback(() => {
        return (
            <View style={styles.headerRow}>
                {scrollableColumns.map((column) => {
                    const width = column.width ?? column.minWidth ?? DEFAULT_COLUMN_WIDTH;
                    return (
                        <TouchableOpacity
                            key={column.id}
                            style={[styles.headerCell, { width }]}
                            onPress={() => sortTable(column)}
                            activeOpacity={0.7}
                        >
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Text
                                    style={[
                                        styles.headerText,
                                        column.align === "center" && { textAlign: "center" },
                                        column.align === "right" && { textAlign: "right" },
                                    ]}
                                    numberOfLines={1}
                                >
                                    {column.label}
                                </Text>
                                {renderSortArrow(column.id)}
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    }, [scrollableColumns, styles, sortTable, renderSortArrow]);

    // Render scrollable data row
    const renderScrollableRow = useCallback(
        ({ item }: { item: T }) => {
            return (
                <TouchableOpacity
                    style={styles.dataRow}
                    onPress={() => onItemPress?.(item)}
                    activeOpacity={onItemPress ? 0.7 : 1}
                    disabled={!onItemPress}
                >
                    {scrollableColumns.map((column) => {
                        const width = column.width ?? column.minWidth ?? DEFAULT_COLUMN_WIDTH;

                        let content: React.ReactNode;
                        if (typeof column.accessor === "function") {
                            content = column.accessor(item);
                        } else {
                            const value = item[column.accessor as keyof T];
                            content = (
                                <Text
                                    style={[
                                        styles.cellText,
                                        column.align === "center" && { textAlign: "center" },
                                        column.align === "right" && { textAlign: "right" },
                                    ]}
                                    numberOfLines={2}
                                >
                                    {String(value ?? "")}
                                </Text>
                            );
                        }

                        return (
                            <View key={column.id} style={[styles.dataCell, { width }]}>
                                {content}
                            </View>
                        );
                    })}
                </TouchableOpacity>
            );
        },
        [scrollableColumns, styles, onItemPress],
    );

    // Render fixed header
    const renderFixedHeader = useCallback(() => {
        if (!fixedColumn) return null;

        return (
            <TouchableOpacity
                style={[styles.fixedHeaderCell, { width: fixedColumnWidth }]}
                onPress={() => sortTable(fixedColumn)}
                activeOpacity={0.7}
            >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text
                        style={[
                            styles.headerText,
                            fixedColumn.align === "center" && { textAlign: "center" },
                            fixedColumn.align === "right" && { textAlign: "right" },
                        ]}
                        numberOfLines={1}
                    >
                        {fixedColumn.label}
                    </Text>
                    {renderSortArrow(fixedColumn.id)}
                </View>
            </TouchableOpacity>
        );
    }, [fixedColumn, fixedColumnWidth, styles, sortTable, renderSortArrow]);

    // Render fixed cell content
    const renderFixedCellContent = useCallback(
        (item: T) => {
            if (!fixedColumn) return null;

            let content: React.ReactNode;
            if (typeof fixedColumn.accessor === "function") {
                content = fixedColumn.accessor(item);
            } else {
                const value = item[fixedColumn.accessor as keyof T];
                content = (
                    <Text
                        style={[
                            styles.cellText,
                            fixedColumn.align === "center" && { textAlign: "center" },
                            fixedColumn.align === "right" && { textAlign: "right" },
                        ]}
                        numberOfLines={2}
                    >
                        {String(value ?? "")}
                    </Text>
                );
            }

            return content;
        },
        [fixedColumn, styles.cellText],
    );

    // Render empty state
    const renderEmpty = useCallback(() => {
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
    }, [loading, colors.foreground, emptyMessage, emptyAction, styles]);

    // Render footer (loading more indicator)
    const renderFooter = useCallback(() => {
        if (!hasMore) return null;
        return (
            <View style={styles.footer}>
                <ActivityIndicator size="small" color={colors.foreground} />
            </View>
        );
    }, [hasMore, colors.foreground, styles.footer]);

    // Native-driven scroll handler for syncing fixed column
    const handleScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: true }
    );

    // Early return for initial loading with no data
    if (loading && tableData.length === 0) {
        return <View style={styles.container}>{renderEmpty()}</View>;
    }

    return (
        <View style={styles.container}>
            {/* Horizontal scroll wrapper for left/right scrolling */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={true}
                bounces={false}
                contentContainerStyle={{
                    paddingLeft: fixedColumn ? fixedColumnWidth : 0,
                    minWidth: scrollableContentWidth + (fixedColumn ? fixedColumnWidth : 0),
                }}
            >
                {/* Vertical FlatList with sticky header */}
                <AnimatedFlatList
                    data={tableData}
                    keyExtractor={keyExtractor}
                    ListHeaderComponent={renderScrollableHeader}
                    stickyHeaderIndices={[0]}
                    renderItem={renderScrollableRow}
                    ListEmptyComponent={renderEmpty}
                    ListFooterComponent={renderFooter}
                    onEndReached={hasMore ? onLoadMore : undefined}
                    onEndReachedThreshold={0.5}
                    refreshControl={
                        onRefresh ? (
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                tintColor={colors.foreground}
                                colors={[colors.foreground]}
                            />
                        ) : undefined
                    }
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    showsVerticalScrollIndicator={true}
                    style={{ width: scrollableContentWidth }}
                />
            </ScrollView>

            {/* Fixed Column Overlay */}
            {fixedColumn && (
                <View
                    style={[styles.fixedColumnContainer, { width: fixedColumnWidth }]}
                    pointerEvents="box-none"
                >
                    {/* Fixed Header (stays at top, doesn't translate) */}
                    {renderFixedHeader()}

                    {/* Fixed Body Cells (scroll with content via translateY) */}
                    <View style={styles.fixedColumnBody}>
                        <Animated.View
                            style={{
                                transform: [
                                    {
                                        translateY: Animated.multiply(scrollY, -1),
                                    },
                                ],
                            }}
                        >
                            {tableData.map((item) => (
                                <TouchableOpacity
                                    key={keyExtractor(item)}
                                    style={[styles.fixedDataCell, { width: fixedColumnWidth }]}
                                    onPress={() => onItemPress?.(item)}
                                    activeOpacity={onItemPress ? 0.7 : 1}
                                    disabled={!onItemPress}
                                >
                                    {renderFixedCellContent(item)}
                                </TouchableOpacity>
                            ))}
                            {/* Footer spacer to match FlatList footer */}
                            {hasMore && <View style={{ height: 50 }} />}
                        </Animated.View>
                    </View>
                </View>
            )}
        </View>
    );
}
