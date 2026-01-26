import { useTheme } from '@/contexts/ThemeContext';
import { borderRadius, spacing, useThemedStyles } from '@/lib/styles';
import React from 'react';
import { Control, useController } from 'react-hook-form';
import { StyleProp, TextInput, TextInputProps, View, ViewStyle } from 'react-native';
import { Text } from './Text';

interface TextAreaProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  helperText?: string;
  minHeight?: number;
  maxHeight?: number;
  style?: StyleProp<ViewStyle>;
  control?: Control<any>;
  name?: string;
}

export function TextArea({
  label,
  error,
  helperText,
  minHeight = 120,
  maxHeight,
  style,
  control,
  name,
  value,
  onChangeText,
  onBlur,
  ...props
}: TextAreaProps) {
  const { colors } = useTheme();

  // Use useController if control and name are provided
  const controller = control && name ? useController({ control, name }) : null;

  const inputValue = controller ? controller.field.value : value;
  const inputOnChange = controller ? controller.field.onChange : onChangeText;
  const inputOnBlur = controller ? controller.field.onBlur : onBlur;
  const inputRef = controller ? controller.field.ref : undefined;

  const styles = useThemedStyles((colors) => ({
    container: {
      width: '100%',
    },
    label: {
      marginBottom: spacing.xs,
      color: colors.foregroundSecondary,
      fontSize: 14,
    },
    textArea: {
      backgroundColor: colors.backgroundSecondary,
      borderRadius: borderRadius.lg,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      color: colors.foreground,
      fontSize: 16,
      minHeight: minHeight,
      maxHeight: maxHeight,
      textAlignVertical: 'top',
      borderWidth: error || controller?.fieldState.error ? 1 : 0,
      borderColor: error || controller?.fieldState.error ? colors.error : 'transparent',
    },
    helperText: {
      marginTop: spacing.xs,
      fontSize: 12,
    },
  }));

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text variant="body" weight="medium" style={styles.label}>
          {label}
        </Text>
      )}
      <TextInput
        ref={inputRef as any}
        value={inputValue}
        onChangeText={inputOnChange}
        onBlur={inputOnBlur}
        placeholderTextColor={colors.foregroundSecondary}
        multiline
        {...props}
        style={styles.textArea}
      />
      {(error || controller?.fieldState.error?.message) && (
        <Text variant="caption" color="error" style={styles.helperText}>
          {error || controller?.fieldState.error?.message}
        </Text>
      )}
      {!error && !controller?.fieldState.error && helperText && (
        <Text variant="caption" color="secondary" style={styles.helperText}>
          {helperText}
        </Text>
      )}
    </View>
  );
}