import { memo } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { StateMessageProps } from '@/types';
import { Button } from './Button';
import { colors, spacing, typography } from '@/constants/theme';

const ICONS = { error: '⚠️', empty: '📖' } as const;

/** Feedback padronizado para estados de loading, erro e vazio. */
export const StateMessage = memo(
  ({ variant, message, onRetry, retryLabel = 'Tentar novamente', testID }: StateMessageProps) => (
    <View testID={testID} style={styles.container} accessibilityLiveRegion="polite">
      {variant === 'loading' ? (
        <ActivityIndicator size="large" color={colors.primaryLight} />
      ) : (
        <Text style={styles.icon}>{ICONS[variant]}</Text>
      )}
      <Text style={[styles.message, variant === 'error' ? styles.error : null]}>{message}</Text>
      {variant === 'error' && onRetry ? (
        <Button label={retryLabel} variant="outline" size="sm" onPress={onRetry} />
      ) : null}
    </View>
  ),
);

StateMessage.displayName = 'StateMessage';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    gap: spacing.sm + 4,
  },
  icon: {
    fontSize: typography.fontSize.xxl,
  },
  message: {
    color: colors.textMutedDark,
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
  error: {
    color: colors.textPrimaryDark,
  },
});
