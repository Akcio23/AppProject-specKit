import { memo, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/hooks/useTheme';
import { spacing, typography } from '@/constants/theme';

export interface ProfileMetricsRowProps {
  savedCount: number;
  streakDays?: number;
  favoritesCount?: number;
  onPressSaved?: () => void;
  onPressDevotionals?: () => void;
  onPressFavorites?: () => void;
}

export const ProfileMetricsRow = memo(({
  savedCount,
  streakDays = 7,
  favoritesCount = 0,
  onPressSaved,
  onPressDevotionals,
  onPressFavorites,
}: ProfileMetricsRowProps) => {
  const { theme } = useTheme();

  const handleSaved = useCallback(() => {
    try {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Fallback
    }
    onPressSaved?.();
  }, [onPressSaved]);

  const handleDevotionals = useCallback(() => {
    try {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Fallback
    }
    onPressDevotionals?.();
  }, [onPressDevotionals]);

  const handleFavorites = useCallback(() => {
    try {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Fallback
    }
    onPressFavorites?.();
  }, [onPressFavorites]);

  return (
    <View style={styles.container}>
      {/* Coluna 1: Salvos */}
      <Pressable
        onPress={handleSaved}
        accessibilityRole="button"
        accessibilityLabel={`${savedCount} versículos salvos`}
        style={({ pressed }) => [
          styles.metricColumn,
          pressed && { opacity: 0.7 },
        ]}
      >
        <Text style={[styles.metricNumber, { color: theme.textPrimary }]}>
          {savedCount}
        </Text>
        <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>
          Salvos
        </Text>
      </Pressable>

      {/* Divisor 1 */}
      <View style={[styles.divider, { backgroundColor: theme.borderSubtle }]} />

      {/* Coluna 2: Devocionais / Dias de Caminhada */}
      <Pressable
        onPress={handleDevotionals}
        accessibilityRole="button"
        accessibilityLabel={`${streakDays} dias de devocionais`}
        style={({ pressed }) => [
          styles.metricColumn,
          pressed && { opacity: 0.7 },
        ]}
      >
        <Text style={[styles.metricNumber, { color: theme.textPrimary }]}>
          {streakDays}
        </Text>
        <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>
          Devocionais
        </Text>
      </Pressable>

      {/* Divisor 2 */}
      <View style={[styles.divider, { backgroundColor: theme.borderSubtle }]} />

      {/* Coluna 3: Favoritos */}
      <Pressable
        onPress={handleFavorites}
        accessibilityRole="button"
        accessibilityLabel={`${favoritesCount} reflexões favoritas`}
        style={({ pressed }) => [
          styles.metricColumn,
          pressed && { opacity: 0.7 },
        ]}
      >
        <Text style={[styles.metricNumber, { color: theme.textPrimary }]}>
          {favoritesCount}
        </Text>
        <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>
          Favoritos
        </Text>
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  metricColumn: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  metricNumber: {
    fontSize: 18,
    fontWeight: typography.fontWeight.bold,
    marginBottom: 2,
    letterSpacing: -0.2,
  },
  metricLabel: {
    fontSize: 12,
    letterSpacing: 0.4,
  },
  divider: {
    width: 1,
    height: 24,
    opacity: 0.6,
  },
});
