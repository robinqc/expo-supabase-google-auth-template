import { useTheme } from "@/contexts/ThemeContext";
import { borderRadius, spacing, useThemedStyles } from "@/lib/styles";
import React, { useState } from "react";
import { TextInput, TextInputProps, View } from "react-native";
import { Button } from "./Button";
import { Text } from "./Text";

export interface InputProps extends Omit<TextInputProps, "style"> {
    label?: string;
    error?: string;
    helperText?: string;
    style?: TextInputProps["style"];
    containerStyle?: any;
    ref?: React.RefObject<TextInput | null>;
    // add element at the end of the input
    endElement?: React.ReactNode;
    children?: React.ReactNode;
}

const inputStyles = {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    fontSize: 16,
};

export function BaseInput({ label, error, helperText, style, containerStyle, ref, endElement, children, ...props }: InputProps) {
    const styles = useThemedStyles((colors) => ({
        label: {
            marginBottom: spacing.xs,
            color: colors.foregroundSecondary,
            fontSize: 14,
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
            {children}
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

export const PasswordInput: React.FC<InputProps> = ({ value, onChangeText, style, onSubmitEditing, ref, error, ...props }) => {
    const [showPassword, setShowPassword] = useState(false);
    const { colors } = useTheme();

    return (
        <BaseInput value={value} error={error} onChangeText={onChangeText} onSubmitEditing={onSubmitEditing} ref={ref} {...props}>
            <View
                style={
                    [
                        {
                            backgroundColor: colors.backgroundSecondary,
                            // @ts-ignore
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
                    ] as any
                }
            >
                <TextInput
                    placeholderTextColor={colors.foregroundSecondary}
                    ref={ref as any}
                    {...props}
                    style={[
                        inputStyles,
                        {
                            flex: 1,
                        },
                    ]}
                    secureTextEntry={!showPassword}
                />
                <Button variant="ghost" icon={showPassword ? "eye-off" : "eye"} size="sm" onPress={() => setShowPassword(!showPassword)} />
            </View>
        </BaseInput>
    );
};

export const Input: React.FC<InputProps> = ({ value, error, onChangeText, onSubmitEditing, style, ref, ...props }) => {
    const { colors } = useTheme();
    return (
        <BaseInput value={value} error={error} onChangeText={onChangeText} onSubmitEditing={onSubmitEditing} ref={ref} {...props}>
            <TextInput
                placeholderTextColor={colors.foregroundSecondary}
                ref={ref as any}
                {...props}
                style={[
                    inputStyles,
                    {
                        backgroundColor: colors.backgroundSecondary,
                        // @ts-ignore
                        color: colors.foreground,
                        borderColor: error ? colors.error : colors.border,
                        borderWidth: error ? 1 : 0,
                        flex: 1,
                        flexDirection: "row",
                        alignItems: "center",
                        borderRadius: borderRadius.lg,
                    },
                    style,
                ]}
            />
        </BaseInput>
    );
};
