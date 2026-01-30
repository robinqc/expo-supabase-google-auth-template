import { useTheme } from "@/contexts/ThemeContext";
import { borderRadius, shadows, spacing } from "@/lib/styles";
import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";

type CardVariant = "default" | "elevated" | "outlined";

export interface CardProps extends Omit<ViewProps, "style"> {
    variant?: CardVariant;
    padding?: keyof typeof spacing;
    style?: ViewProps["style"];
    children: React.ReactNode;
}

export function Card({ variant = "default", padding = "md", style, children, ...props }: CardProps) {
    const { colors } = useTheme();

    const variantStyles = {
        default: {
            backgroundColor: colors.card,
        },
        elevated: {
            backgroundColor: colors.card,
            ...shadows.md,
        },
        outlined: {
            backgroundColor: colors.card,
            borderWidth: 1,
            borderColor: colors.border,
        },
    }[variant];

    const cardStyle = [styles.card, variantStyles, { padding: spacing[padding] }, style];

    return (
        <View style={cardStyle} {...props}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: borderRadius.lg,
    },
});
