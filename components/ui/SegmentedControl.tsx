import { useTheme } from "@/contexts/ThemeContext";
import { borderRadius, spacing, useThemedStyles } from "@/lib/styles";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleProp, View, ViewStyle } from "react-native";
import { Text } from "./Text";

interface Segment {
    value: string;
    label?: string;
    icon?: keyof typeof Ionicons.glyphMap;
}

interface SegmentedControlProps {
    segments: Segment[];
    value: string;
    onChange: (value: string) => void;
    size?: "sm" | "md";
    style?: StyleProp<ViewStyle>;
}

export function SegmentedControl({ segments, value, onChange, size = "md", style }: SegmentedControlProps) {
    const { colors } = useTheme();

    const styles = useThemedStyles((colors) => ({
        container: {
            backgroundColor: colors.backgroundSecondary,
            borderRadius: borderRadius.full,
            padding: size === "sm" ? spacing.xs : spacing.sm,
            flexDirection: "row",
        },
        segment: {
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: size === "sm" ? spacing.sm : spacing.md,
            paddingHorizontal: size === "sm" ? spacing.sm : spacing.md,
            borderRadius: borderRadius.full,
            flexDirection: "row",
        },
        activeSegment: {
            backgroundColor: colors.primaryDark,
        },
        segmentText: {
            color: colors.foregroundSecondary,
            fontSize: size === "sm" ? 12 : 14,
            fontWeight: "600",
        },
        activeSegmentText: {
            color: colors.background,
        },
        segmentIcon: {
            color: colors.foregroundSecondary,
            fontSize: size === "sm" ? 14 : 16,
        },
        activeSegmentIcon: {
            color: colors.background,
        },
    }));

    return (
        <View style={[styles.container, style]}>
            {segments.map((segment) => {
                const isActive = segment.value === value;
                return (
                    <Pressable
                        key={segment.value}
                        style={[styles.segment, isActive && styles.activeSegment]}
                        onPress={() => onChange(segment.value)}
                        accessibilityRole="radio"
                        accessibilityState={{ selected: isActive }}
                    >
                        {segment.icon && <Ionicons name={segment.icon} style={[styles.segmentIcon, isActive && styles.activeSegmentIcon]} />}
                        {segment.label && <Text style={[styles.segmentText, isActive && styles.activeSegmentText]}>{segment.label}</Text>}
                    </Pressable>
                );
            })}
        </View>
    );
}
