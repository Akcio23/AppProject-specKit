import { memo, useState } from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { TextFieldProps } from '@/types';
import { spacing, borderRadius, typography } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';

export const TextField = memo(
  ({
    value,
    onChangeText,
    placeholder,
    onSubmitEditing,
    autoFocus = false,
    accessibilityLabel,
    testID,
    autoCapitalize = 'words',
    keyboardType = 'default',
    maxLength,
  }: TextFieldProps) => {
    const { theme } = useTheme();
    const [focused, setFocused] = useState(false);

    return (
      <TextInput
        testID={testID}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.textMuted}
        onSubmitEditing={onSubmitEditing}
        autoFocus={autoFocus}
        returnKeyType="search"
        autoCorrect={false}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        maxLength={maxLength}
        accessibilityLabel={accessibilityLabel ?? placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[
          styles.input,
          {
            backgroundColor: theme.surfaceSubtle,
            borderColor: focused ? theme.accent : theme.borderSubtle,
            color: theme.textPrimary,
          },
          focused ? styles.focused : null,
        ]}
      />
    );
  },
);

TextField.displayName = 'TextField';

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md + 2,
    paddingVertical: spacing.sm + 4,
    fontSize: typography.fontSize.md,
  },
  focused: {
    borderWidth: 1.5,
  },
});
