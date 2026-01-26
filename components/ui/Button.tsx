import { useTheme } from "@/contexts/ThemeContext";
import { borderRadius, spacing } from "@/lib/styles";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, StyleSheet, TouchableOpacity, TouchableOpacityProps, View } from "react-native";
import { Text } from "./Text";

type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends Omit<TouchableOpacityProps, "style"> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    disabled?: boolean;
    icon?: keyof typeof Ionicons.glyphMap;
    iconPosition?: "left" | "right";
    children?: React.ReactNode;
    style?: TouchableOpacityProps["style"];
}

export function Button({ variant = "primary", size = "md", loading = false, disabled = false, icon, iconPosition = "left", children, style, ...props }: ButtonProps) {
    const { colors } = useTheme();

    const isDisabled = disabled || loading;

    // Size configurations
    const sizeConfig = {
        sm: {
            paddingVertical: spacing.sm,
            paddingHorizontal: spacing.md,
            fontSize: 14,
            iconSize: 16,
        },
        md: {
            paddingVertical: spacing.md,
            paddingHorizontal: spacing.lg,
            fontSize: 16,
            iconSize: 20,
        },
        lg: {
            paddingVertical: spacing.lg,
            paddingHorizontal: spacing.xl,
            fontSize: 18,
            iconSize: 24,
        },
    }[size];

    // Variant styles
    const variantStyles = {
        primary: {
            backgroundColor: isDisabled ? colors.foregroundSecondary : colors.foreground,
            textColor: colors.background,
        },
        secondary: {
            backgroundColor: isDisabled ? colors.muted : colors.backgroundSecondary,
            textColor: colors.foreground,
        },
        ghost: {
            backgroundColor: "transparent",
            textColor: colors.foreground,
        },
        destructive: {
            backgroundColor: isDisabled ? colors.muted : colors.destructive,
            textColor: colors.destructiveForeground,
        },
    }[variant];

    const buttonStyle = [
        styles.button,
        {
            backgroundColor: variantStyles.backgroundColor,
            paddingVertical: sizeConfig.paddingVertical,
            paddingHorizontal: sizeConfig.paddingHorizontal,
            opacity: isDisabled ? 0.5 : 1,
        },
        style,
    ];

    const renderContent = () => {
        if (loading) {
            return <ActivityIndicator size="small" color={variantStyles.textColor} />;
        }

        const iconElement = icon ? (
            <Ionicons
                name={icon}
                size={sizeConfig.iconSize}
                color={variantStyles.textColor}
                style={children && iconPosition === "left" ? styles.iconLeft : children && iconPosition === "right" ? styles.iconRight : undefined}
            />
        ) : null;

        if (!children) {
            return iconElement;
        }

        return (
            <View style={styles.content}>
                {iconPosition === "left" && iconElement}
                <Text
                    style={{
                        color: variantStyles.textColor,
                        fontSize: sizeConfig.fontSize,
                        fontWeight: "600",
                    }}
                >
                    {children}
                </Text>
                {iconPosition === "right" && iconElement}
            </View>
        );
    };

    return (
        <TouchableOpacity style={buttonStyle} disabled={isDisabled} activeOpacity={0.7} {...props}>
            {renderContent()}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        borderRadius: borderRadius.full,
        alignItems: "center",
        justifyContent: "center",
    },
    content: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    iconLeft: {
        marginRight: spacing.sm,
    },
    iconRight: {
        marginLeft: spacing.sm,
    },
});
