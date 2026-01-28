import { useTheme } from "@/contexts/ThemeContext";
import { layouts, spacing, useThemedStyles } from "@/lib/styles";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { ScrollView, ScrollViewProps, StyleProp, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "./Text";

interface HeaderViewProps {
    title: string;
    actionButton?: React.ReactNode;
    children: React.ReactNode;
    scrollViewProps?: ScrollViewProps;
    style?: StyleProp<ViewStyle>;
    fixed?: boolean;
}

export function HeaderView({ title, actionButton, children, scrollViewProps, style, fixed = false }: HeaderViewProps) {
    const { isDark } = useTheme();

    const styles = useThemedStyles((colors) => ({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        header: {
            paddingHorizontal: spacing.md,
            paddingTop: spacing.md,
            ...layouts.rowBetween,
        },
        content: {
            flex: 1,
        },
    }));

    return (
        <SafeAreaView style={[styles.container, style]} edges={["top", "left", "right"]}>
            <StatusBar style={isDark ? "light" : "dark"} />
            <View style={styles.header}>
                <Text variant="heading" weight="extrabold">
                    {title}
                </Text>
                {actionButton}
            </View>
            {fixed ? (
                <View style={styles.content}>{children}</View>
            ) : (
                <ScrollView style={styles.content} {...scrollViewProps}>
                    {children}
                </ScrollView>
            )}
        </SafeAreaView>
    );
}
