import { memo, useCallback, useRef } from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  TextStyle,
  Animated,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { ButtonProps } from '@/types';
import { colors, spacing, borderRadius, typography, shadows } from '@/constants/theme';

export const Button = memo(
  ({
    label,
    onPress,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    testID,
    hapticFeedback = true,
  }: ButtonProps) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = useCallback(() => {
      if (disabled || loading) return;

      if (hapticFeedback) {
        try {
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } catch {
          // Fallback silencioso em plataformas sem suporte a vibração
        }
      }

      Animated.spring(scaleAnim, {
        toValue: 0.965,
        useNativeDriver: true,
        speed: 50,
        bounciness: 4,
      }).start();
    }, [disabled, loading, hapticFeedback, scaleAnim]);

    const handlePressOut = useCallback(() => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 40,
        bounciness: 6,
      }).start();
    }, [scaleAnim]);

    const handlePress = useCallback(() => {
      if (!disabled && !loading) {
        onPress();
      }
    }, [disabled, loading, onPress]);

    const buttonStyle: StyleProp<ViewStyle> = [
      styles.base,
      styles[variant],
      styles[size],
      variant === 'primary' && !disabled ? shadows.glassGlow : null,
      disabled ? styles.disabled : null,
    ];

    const textStyle: StyleProp<TextStyle> = [
      styles.textBase,
      styles[`${variant}Text` as keyof typeof styles] as TextStyle,
      styles[`${size}Text` as keyof typeof styles] as TextStyle,
      disabled ? styles.disabledText : null,
    ];

    return (
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Pressable
          testID={testID}
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={disabled || loading}
          style={buttonStyle}
        >
          {loading ? (
            <ActivityIndicator
              size="small"
              color={
                variant === 'outline' || variant === 'ghost' || variant === 'glass'
                  ? colors.primary
                  : '#080B11'
              }
            />
          ) : (
            <Text style={textStyle}>{label}</Text>
          )}
        </Pressable>
      </Animated.View>
    );
  }
);

Button.displayName = 'Button';

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.full,
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
  glass: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1.2,
    borderColor: colors.borderGlassDark,
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
    paddingVertical: spacing.xs + 3,
    paddingHorizontal: spacing.md,
  },
  md: {
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.lg,
  },
  lg: {
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.xl,
  },
  disabled: {
    opacity: 0.45,
  },
  textBase: {
    fontWeight: typography.fontWeight.semibold,
    textAlign: 'center',
    letterSpacing: typography.letterSpacing.normal,
  },
  primaryText: {
    color: '#080B11',
    fontWeight: typography.fontWeight.bold,
  },
  secondaryText: {
    color: '#FFFFFF',
    fontWeight: typography.fontWeight.semibold,
  },
  glassText: {
    color: colors.textPrimaryDark,
    fontWeight: typography.fontWeight.semibold,
  },
  outlineText: {
    color: colors.primary,
    fontWeight: typography.fontWeight.semibold,
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
