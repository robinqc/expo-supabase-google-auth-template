import { useTheme } from "@/contexts/ThemeContext";
import { layouts, spacing, useThemedStyles } from "@/lib/styles";
import { useThemeColors } from "@/lib/theme";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleProp, TouchableOpacity, View, ViewStyle } from "react-native";
import { Edge, SafeAreaView } from "react-native-safe-area-context";
import { Text } from "./Text";

export interface FormViewProps {
    title: string;
    onBack?: () => void;
    backIcon?: keyof typeof Ionicons.glyphMap;
    children: React.ReactNode;
    footer?: React.ReactNode;
    loading?: boolean;
    edges?: Edge[];
    containerStyle?: StyleProp<ViewStyle>;
    contentContainerStyle?: StyleProp<ViewStyle>;
    isModal?: boolean;
}

export function FormView({
    title,
    onBack,
    backIcon = "arrow-back",
    children,
    footer,
    loading = false,
    edges = ["top", "left", "right", "bottom"],
    containerStyle,
    contentContainerStyle,
    isModal = false,
}: FormViewProps) {
    const { isDark } = useTheme();
    const colors = useThemeColors();

    const styles = useThemedStyles((colors) => ({
        container: {
            flex: 1,
            backgroundColor: isModal ? "transparent" : colors.background,
        },
        header: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.md,
            borderBottomWidth: isModal ? 0 : 1,
            borderBottomColor: colors.border,
        },
        headerTitle: {
            flex: 1,
            textAlign: "left",
        },
        backButton: {
            marginRight: spacing.md,
            padding: 4,
        },
        formScrollView: {
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.lg,
        },
        footer: {
            paddingHorizontal: spacing.lg,
            paddingBottom: spacing.xl,
            paddingTop: spacing.md,
        },
    }));

    const content = (
        <KeyboardAvoidingView style={layouts.flex1} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <View style={styles.header}>
                {onBack && (
                    <TouchableOpacity onPress={onBack} style={styles.backButton} disabled={loading}>
                        <Ionicons name={backIcon} size={24} color={colors.icon} />
                    </TouchableOpacity>
                )}
                <Text variant="subheading" weight="extrabold" style={styles.headerTitle}>
                    {title}
                </Text>
                {onBack && !isModal && <View style={{ width: 32 }} />}
            </View>

            <ScrollView style={layouts.flex1} contentContainerStyle={contentContainerStyle} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                <View style={[styles.formScrollView, containerStyle]}>{children}</View>
            </ScrollView>

            {footer && <View style={styles.footer}>{footer}</View>}
        </KeyboardAvoidingView>
    );

    if (isModal) {
        return <View style={styles.container}>{content}</View>;
    }

    return (
        <SafeAreaView style={styles.container} edges={edges}>
            <StatusBar style={isDark ? "light" : "dark"} />
            {content}
        </SafeAreaView>
    );
}