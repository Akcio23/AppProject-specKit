import { memo, useState } from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { TextFieldProps } from '@/types';
import { colors, spacing, borderRadius, typography } from '@/constants/theme';

export const TextField = memo(
  ({
    value,
    onChangeText,
    placeholder,
    onSubmitEditing,
    autoFocus = false,
    accessibilityLabel,
    testID,
  }: TextFieldProps) => {
    const [focused, setFocused] = useState(false);

    return (
      <TextInput
        testID={testID}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMutedDark}
        onSubmitEditing={onSubmitEditing}
        autoFocus={autoFocus}
        returnKeyType="search"
        autoCorrect={false}
        autoCapitalize="words"
        accessibilityLabel={accessibilityLabel ?? placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[styles.input, focused ? styles.focused : null]}
      />
    );
  },
);

TextField.displayName = 'TextField';

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.surfaceSubtleDark,
    borderColor: colors.borderDark,
    borderWidth: 1.5,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    color: colors.textPrimaryDark,
    fontSize: typography.fontSize.md,
  },
  focused: {
    borderColor: colors.primary,
  },
});
