import { useTheme } from "@/contexts/ThemeContext";
import { layouts, spacing, useThemedStyles } from "@/lib/styles";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { ScrollView, ScrollViewProps, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "./Text";

interface HeaderViewProps {
    title: string;
    actionButton?: React.ReactNode;
    children: React.ReactNode;
    scrollViewProps?: ScrollViewProps;
}

export function HeaderView({ title, actionButton, children, scrollViewProps }: HeaderViewProps) {
    const { isDark } = useTheme();

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
        content: {
            flex: 1,
        },
    }));

    return (
        <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
            <StatusBar style={isDark ? "light" : "dark"} />
            <View style={styles.header}>
                <Text variant="heading" weight="extrabold">
                    {title}
                </Text>
                {actionButton}
            </View>
            <ScrollView style={styles.content} {...scrollViewProps}>
                {children}
            </ScrollView>
        </SafeAreaView>
    );
}
