import { memo, useCallback } from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { ButtonProps } from '@/types';
import { colors, spacing, borderRadius, typography } from '@/constants/theme';

export const Button = memo(
  ({
    label,
    onPress,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    testID,
  }: ButtonProps) => {
    const handlePress = useCallback(() => {
      if (!disabled && !loading) {
        onPress();
      }
    }, [disabled, loading, onPress]);

    const buttonStyle: StyleProp<ViewStyle> = [
      styles.base,
      styles[variant],
      styles[size],
      disabled ? styles.disabled : null,
    ];

    const textStyle: StyleProp<TextStyle> = [
      styles.textBase,
      styles[`${variant}Text` as keyof typeof styles] as TextStyle,
      styles[`${size}Text` as keyof typeof styles] as TextStyle,
      disabled ? styles.disabledText : null,
    ];

    return (
      <Pressable
        testID={testID}
        onPress={handlePress}
        disabled={disabled || loading}
        style={({ pressed }) => [
          buttonStyle,
          pressed && !disabled && !loading ? styles.pressed : null,
        ]}
      >
        {loading ? (
          <ActivityIndicator
            size="small"
            color={variant === 'outline' || variant === 'ghost' ? colors.primary : '#FFFFFF'}
          />
        ) : (
          <Text style={textStyle}>{label}</Text>
        )}
      </Pressable>
    );
  }
);

Button.displayName = 'Button';

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  sm: {
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.sm + 4,
  },
  md: {
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.md,
  },
  lg: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.985 }],
  },
  disabled: {
    opacity: 0.45,
  },
  textBase: {
    fontWeight: typography.fontWeight.semibold,
    textAlign: 'center',
  },
  primaryText: {
    color: '#0F172A',
    fontWeight: typography.fontWeight.bold,
  },
  secondaryText: {
    color: '#FFFFFF',
  },
  outlineText: {
    color: colors.primary,
  },
  ghostText: {
    color: colors.primaryLight,
  },
  smText: {
    fontSize: typography.fontSize.sm,
  },
  mdText: {
    fontSize: typography.fontSize.md,
  },
  lgText: {
    fontSize: typography.fontSize.lg,
  },
  disabledText: {
    color: colors.textMutedDark,
  },
});
