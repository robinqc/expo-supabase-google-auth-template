import { useTheme } from "@/contexts/ThemeContext";
import { borderRadius, spacing, useThemedStyles } from "@/lib/styles";
import { SortOption, SortableColumn } from "@/types/crud";
import { Button, Text } from "@robin-ux/native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, TouchableOpacity, View } from "react-native";

interface CrudSortButtonProps {
    value: SortOption;
    onChange: (value: SortOption) => void;
    sortableColumns?: SortableColumn[];
}

export function CrudSortButton({ value, onChange, sortableColumns = [] }: CrudSortButtonProps) {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const [isVisible, setIsVisible] = useState(false);
    const styles = useThemedStyles((colors) => ({
        modalOverlay: {
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0)",
        },
        dialogContainer: {
            position: "absolute",
            backgroundColor: colors.backgroundSecondary,
            borderRadius: 22,
            padding: spacing.xs,
            width: 200,
            elevation: 1,
            borderWidth: 0,
        },
        option: {
            paddingVertical: spacing.sm,
            paddingHorizontal: spacing.md,
            borderRadius: borderRadius.full,
        },
        optionSelected: {
            backgroundColor: colors.muted,
        },
        optionText: {
            fontSize: 14,
            color: colors.foreground,
        },
        optionTextSelected: {
            fontWeight: "600",
            color: colors.foreground,
        },
    }));

    const sortOptions = [
        { id: "newest", label: t("crud.newest") },
        { id: "oldest", label: t("crud.oldest") },
        { id: "alphabetical", label: t("crud.alphabetical") },
        ...sortableColumns,
    ];

    const currentOption = sortOptions.find((opt) => opt.id === value) || sortOptions[0];

    const handlePress = () => {
        setIsVisible(true);
    };

    const handleSelect = (optionId: SortOption) => {
        onChange(optionId);
        setIsVisible(false);
    };

    const renderDialog = () => {
        if (!isVisible) return null;

        return (
            <>
                <Pressable
                    onPress={() => setIsVisible(false)}
                    style={{
                        position: "absolute",
                        top: -1000,
                        left: -1000,
                        right: -1000,
                        bottom: -1000,
                        zIndex: 99,
                    }}
                />
                <View
                    style={[
                        styles.dialogContainer,
                        {
                            zIndex: 100,
                        },
                    ]}
                >
                    {sortOptions.map((option) => (
                        <TouchableOpacity key={option.id} style={[styles.option, value === option.id && styles.optionSelected]} onPress={() => handleSelect(option.id)}>
                            <Text style={[styles.optionText, value === option.id && styles.optionTextSelected]}>{option.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </>
        );
    };

    return (
        <View style={{ zIndex: isVisible ? 1000 : 1 }}>
            <Button variant="secondary" size="sm" icon="swap-vertical" iconPosition="right" onPress={handlePress}>
                {currentOption.label}
            </Button>
            {renderDialog()}
        </View>
    );
}
