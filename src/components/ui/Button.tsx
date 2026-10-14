import { memo, useCallback, useRef } from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  Animated,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { ButtonProps } from '@/types';
import { spacing, borderRadius, typography, shadows } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';

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
    const { theme } = useTheme();
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = useCallback(() => {
      if (disabled || loading) return;

      if (hapticFeedback) {
        try {
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } catch {
          // Fallback silencioso
        }
      }

      Animated.spring(scaleAnim, {
        toValue: 0.97,
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

    // Cores dinâmicas de acordo com o tema e a variante pastel
    let btnBg = theme.accent;
    let textColor = theme.accentText;
    let borderColor = 'transparent';

    if (variant === 'secondary') {
      btnBg = theme.surfaceSubtle;
      textColor = theme.textPrimary;
      borderColor = theme.borderSubtle;
    } else if (variant === 'outline') {
      btnBg = 'transparent';
      textColor = theme.textPrimary;
      borderColor = theme.border;
    } else if (variant === 'ghost') {
      btnBg = 'transparent';
      textColor = theme.textSecondary;
    } else if (variant === 'glass') {
      btnBg = theme.surfaceSubtle;
      textColor = theme.textPrimary;
      borderColor = theme.borderSubtle;
    }

    return (
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Pressable
          testID={testID}
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={disabled || loading}
          style={[
            styles.base,
            styles[size],
            variant === 'primary' && !disabled ? shadows.soft : null,
            {
              backgroundColor: btnBg,
              borderColor,
              borderWidth: borderColor !== 'transparent' ? 1 : 0,
              opacity: disabled ? 0.45 : 1,
            },
          ]}
        >
          {loading ? (
            <ActivityIndicator size="small" color={textColor} />
          ) : (
            <Text
              style={[
                styles.textBase,
                styles[`${size}Text`],
                { color: textColor },
              ]}
            >
              {label}
            </Text>
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
  textBase: {
    fontWeight: typography.fontWeight.semibold,
    textAlign: 'center',
    letterSpacing: typography.letterSpacing.normal,
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
});
