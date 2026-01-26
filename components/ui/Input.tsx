import { useTheme } from "@/contexts/ThemeContext";
import { borderRadius, spacing, useThemedStyles } from "@/lib/styles";
import React, { useState } from "react";
import { Control, useController } from "react-hook-form";
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
    control?: Control<any>;
    name?: string;
}

const inputStyles = {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    fontSize: 16,
};

export function BaseInput({ label, error, helperText, containerStyle, children }: Pick<InputProps, "label" | "error" | "helperText" | "containerStyle" | "children">) {
    const styles = useThemedStyles((colors) => ({
        label: {
            marginBottom: spacing.xs,
            color: colors.foregroundSecondary,
            fontSize: 14,
        },
        helperText: {
            marginTop: spacing.xs,
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

export const PasswordInput: React.FC<InputProps> = ({ value, onChangeText, style, onSubmitEditing, ref, error, control, name, ...props }) => {
    const [showPassword, setShowPassword] = useState(false);
    const { colors } = useTheme();

    // Use useController if control and name are provided
    const controller = control && name ? useController({ control, name }) : null;

    const inputValue = controller ? controller.field.value : value;
    const inputOnChange = controller ? controller.field.onChange : onChangeText;
    const inputOnBlur = controller ? controller.field.onBlur : props.onBlur;
    const inputRef = controller ? controller.field.ref : ref;

    return (
        <BaseInput label={props.label} error={error || controller?.fieldState.error?.message} helperText={props.helperText} containerStyle={props.containerStyle}>
            <View
                style={
                    [
                        {
                            backgroundColor: colors.backgroundSecondary,
                            borderColor: error || controller?.fieldState.error ? colors.error : colors.border,
                            borderWidth: error || controller?.fieldState.error ? 1 : 0,
                            flexDirection: "row",
                            alignItems: "center",
                            borderRadius: borderRadius.lg,
                        },
                        style,
                    ] as any
                }
            >
                <TextInput
                    placeholderTextColor={colors.foregroundSecondary}
                    ref={inputRef as any}
                    {...props}
                    style={[
                        inputStyles,
                        {
                            flex: 1,
                            color: colors.foreground,
                        },
                    ]}
                    value={inputValue}
                    onChangeText={inputOnChange}
                    autoCapitalize="none"
                    onBlur={inputOnBlur}
                    onSubmitEditing={onSubmitEditing}
                    secureTextEntry={!showPassword}
                />
                <Button variant="ghost" icon={showPassword ? "eye-off" : "eye"} size="sm" onPress={() => setShowPassword(!showPassword)} />
            </View>
        </BaseInput>
    );
};

export const Input: React.FC<InputProps> = ({ value, error, onChangeText, onSubmitEditing, style, ref, control, name, ...props }) => {
    const { colors } = useTheme();

    // Use useController if control and name are provided
    const controller = control && name ? useController({ control, name }) : null;

    const inputValue = controller ? controller.field.value : value;
    const inputOnChange = controller ? controller.field.onChange : onChangeText;
    const inputOnBlur = controller ? controller.field.onBlur : props.onBlur;
    const inputRef = controller ? controller.field.ref : ref;

    return (
        <BaseInput label={props.label} error={error || controller?.fieldState.error?.message} helperText={props.helperText} containerStyle={props.containerStyle}>
            <TextInput
                placeholderTextColor={colors.foregroundSecondary}
                ref={inputRef as any}
                value={inputValue}
                onChangeText={inputOnChange}
                onBlur={inputOnBlur}
                onSubmitEditing={onSubmitEditing}
                {...props}
                style={[
                    inputStyles,
                    {
                        backgroundColor: colors.backgroundSecondary,
                        color: colors.foreground,
                        borderColor: error || controller?.fieldState.error ? colors.error : colors.border,
                        borderWidth: error || controller?.fieldState.error ? 1 : 0,
                        borderRadius: borderRadius.lg,
                    },
                    style,
                ]}
            />
        </BaseInput>
    );
};
