import { memo, useState, useCallback } from 'react';
import { View, TextInput, Text, StyleSheet, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/hooks/useTheme';
import { spacing, typography, borderRadius } from '@/constants/theme';

export interface PasswordFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  onSubmitEditing?: () => void;
  testID?: string;
}

export const PasswordField = memo(
  ({
    value,
    onChangeText,
    placeholder = 'Digite sua senha',
    label,
    error,
    onSubmitEditing,
    testID,
  }: PasswordFieldProps) => {
    const { theme } = useTheme();
    const [isVisible, setIsVisible] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const toggleVisibility = useCallback(() => {
      try {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {
        // Fallback
      }
      setIsVisible((prev) => !prev);
    }, []);

    return (
      <View style={styles.container}>
        {label ? (
          <Text style={[styles.label, { color: theme.textSecondary }]}>{label}</Text>
        ) : null}

        <View
          style={[
            styles.inputRow,
            {
              backgroundColor: theme.surfaceSubtle,
              borderColor: error
                ? '#E57373'
                : isFocused
                  ? theme.accent
                  : theme.borderSubtle,
            },
          ]}
        >
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={theme.textMuted}
            secureTextEntry={!isVisible}
            autoCapitalize="none"
            autoCorrect={false}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onSubmitEditing={onSubmitEditing}
            testID={testID}
            style={[styles.input, { color: theme.textPrimary }]}
          />

          <Pressable
            onPress={toggleVisibility}
            hitSlop={8}
            accessibilityLabel={isVisible ? 'Ocultar senha' : 'Ver senha'}
            style={styles.eyeBtn}
          >
            <Text style={styles.eyeIcon}>{isVisible ? '🙈' : '👁️'}</Text>
          </Pressable>
        </View>

        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : null}
      </View>
    );
  },
);

PasswordField.displayName = 'PasswordField';

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.xs,
    letterSpacing: typography.letterSpacing.wide,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    height: 48,
  },
  input: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    paddingVertical: 0,
  },
  eyeBtn: {
    padding: spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeIcon: {
    fontSize: 16,
  },
  errorText: {
    color: '#E57373',
    fontSize: typography.fontSize.xs,
    marginTop: 4,
  },
});
