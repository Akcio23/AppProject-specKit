import { memo, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { spacing, typography } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';

export interface ThemePillSwitchProps {
  isDark?: boolean;
  onToggle?: () => void;
  compact?: boolean;
}

const SWITCH_WIDTH = 48;
const SWITCH_HEIGHT = 26;
const THUMB_SIZE = 20;
const TRANSLATE_DISTANCE = SWITCH_WIDTH - THUMB_SIZE - 6; // 22px

export const ThemePillSwitch = memo(({
  compact = false,
  isDark: propIsDark,
  onToggle: propOnToggle,
}: ThemePillSwitchProps) => {
  const { theme, isDark: storeIsDark, toggleTheme: storeToggleTheme } = useTheme();

  const isDark = propIsDark !== undefined ? propIsDark : storeIsDark;
  const onToggle = propOnToggle || storeToggleTheme;

  const animatedValue = useRef(new Animated.Value(isDark ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: isDark ? 1 : 0,
      bounciness: 4,
      speed: 16,
      useNativeDriver: true,
    }).start();
  }, [isDark, animatedValue]);

  const handlePress = useCallback(() => {
    try {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Fallback
    }
    onToggle();
  }, [onToggle]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, TRANSLATE_DISTANCE],
  });

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="switch"
      accessibilityState={{ checked: isDark }}
      accessibilityLabel={`Alternar tema. Tema atual: ${isDark ? 'Escuro' : 'Claro'}`}
      style={({ pressed }) => [
        styles.container,
        compact ? styles.containerCompact : styles.containerExpanded,
        pressed && styles.pressed,
      ]}
    >
      {!compact && (
        <View style={styles.labelGroup}>
          <Feather
            name={isDark ? 'moon' : 'sun'}
            size={16}
            color={theme.textSecondary}
            style={styles.leadingIcon}
          />
          <Text style={[styles.labelText, { color: theme.textSecondary }]}>
            {isDark ? 'Dark mode' : 'Light mode'}
          </Text>
        </View>
      )}

      {/* Track do Switch */}
      <View
        style={[
          styles.track,
          {
            backgroundColor: isDark ? theme.surfaceSubtle : theme.borderSubtle,
            borderColor: theme.borderSubtle,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.thumb,
            {
              backgroundColor: isDark ? theme.accent : theme.surfaceCard,
              transform: [{ translateX }],
            },
          ]}
        >
          {isDark ? (
            <Ionicons name="moon" size={11} color={theme.accentText} />
          ) : (
            <Ionicons name="sunny" size={11} color={theme.textPrimary} />
          )}
        </Animated.View>
      </View>
    </Pressable>
  );
});

ThemePillSwitch.displayName = 'ThemePillSwitch';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  containerExpanded: {
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: spacing.xs,
  },
  containerCompact: {
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.8,
  },
  labelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  leadingIcon: {
    marginRight: 2,
  },
  labelText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  track: {
    width: SWITCH_WIDTH,
    height: SWITCH_HEIGHT,
    borderRadius: SWITCH_HEIGHT / 2,
    borderWidth: 1,
    padding: 2,
    justifyContent: 'center',
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 1.5,
    elevation: 2,
  },
});
