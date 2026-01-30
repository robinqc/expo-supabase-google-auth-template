import { useTheme } from "@/contexts/ThemeContext";
import { spacing, useThemedStyles } from "@/lib/styles";
import { SortOption, SortableColumn, ViewMode } from "@/types/crud";
import { Button, SegmentedControl } from "@robin-ux/native";
import React from "react";
import { View } from "react-native";
import { CrudSortButton } from "./CrudSortButton";

interface CrudFilterBarProps {
    viewMode: ViewMode;
    onViewModeChange: (mode: ViewMode) => void;
    sortOption: SortOption;
    onSortChange: (sort: SortOption) => void;
    onFilterPress?: () => void;
    sortableColumns?: SortableColumn[];
}

export function CrudFilterBar({ viewMode, onViewModeChange, sortOption, onSortChange, onFilterPress, sortableColumns }: CrudFilterBarProps) {
    const { colors } = useTheme();

    const styles = useThemedStyles((colors) => ({
        container: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.md,
            gap: spacing.md,
            zIndex: 10,
        },
        leftSection: {
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.sm,
            flex: 1,
        },
        rightSection: {
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.sm,
        },
    }));

    const viewSegments = [
        { value: "list", icon: "list" as const },
        { value: "grid", icon: "grid" as const },
        { value: "table", icon: "menu" as const },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.leftSection}>
                {onFilterPress && <Button variant="secondary" size="sm" icon="filter" onPress={onFilterPress}></Button>}
                <CrudSortButton value={sortOption} onChange={onSortChange} sortableColumns={sortableColumns} />
            </View>
            <View style={styles.rightSection}>
                <SegmentedControl segments={viewSegments} value={viewMode} onChange={(value) => onViewModeChange(value as ViewMode)} size="sm" />
            </View>
        </View>
    );
}
