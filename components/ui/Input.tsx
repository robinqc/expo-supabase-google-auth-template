import { useTheme } from "@/contexts/ThemeContext";
import { borderRadius, spacing, useThemedStyles } from "@/lib/styles";
import React from "react";
import { TextInput, TextInputProps, View } from "react-native";
import { Text } from "./Text";

export interface InputProps extends Omit<TextInputProps, "style"> {
    label?: string;
    error?: string;
    helperText?: string;
    inputStyle?: TextInputProps["style"];
    style?: any;
    containerStyle?: any;
    ref?: React.RefObject<TextInput | null>;
    // add element at the end of the input
    endElement?: React.ReactNode;
}

export function Input({ label, error, helperText, style, inputStyle, containerStyle, ref, endElement, ...props }: InputProps) {
    const { colors } = useTheme();

    const styles = useThemedStyles((colors) => ({
        label: {
            marginBottom: spacing.xs,
            color: colors.foregroundSecondary,
            fontSize: 14,
        },
        input: {
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.md,
            borderRadius: borderRadius.lg,
            fontSize: 16,
        },
        helperText: {
            marginTop: spacing.xs,
        },
        inputContainer: {
            flexDirection: "row",
            width: "100%",
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
        },
    }));

    return (
        <View style={containerStyle}>
            {label && (
                <Text variant="body" weight="medium" style={styles.label}>
                    {label}
                </Text>
            )}
            <View
                style={[
                    {
                        backgroundColor: colors.backgroundSecondary,
                        color: colors.foreground,
                        borderColor: error ? colors.error : colors.border,
                        borderWidth: error ? 1 : 0,
                        flex: 1,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "stretch",
                        borderRadius: borderRadius.lg,
                    },
                    style,
                ]}
            >
                <TextInput
                    placeholderTextColor={colors.foregroundSecondary}
                    ref={ref as any}
                    {...props}
                    style={[
                        styles.input,
                        {
                            flex: 1,
                        },
                        inputStyle,
                    ]}
                />
                {endElement ? endElement : null}
            </View>
            {error && (
                <Text variant="caption" color="error" style={styles.helperText}>
                    {error}
                </Text>
            )}
            {!error && helperText && (
                <Text variant="caption" color="secondary" style={styles.helperText}>
                    {helperText}
                </Text>
            )}
        </View>
    );
}
