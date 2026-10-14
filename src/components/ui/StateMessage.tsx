import { memo } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { StateMessageProps } from '@/types';
import { Button } from './Button';
import { spacing, typography } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';

const ICONS = { error: '⚠️', empty: '📖' } as const;

/** Feedback padronizado para estados de loading, erro e vazio. */
export const StateMessage = memo(
  ({ variant, message, onRetry, retryLabel = 'Tentar novamente', testID }: StateMessageProps) => {
    const { theme } = useTheme();

    return (
      <View testID={testID} style={styles.container} accessibilityLiveRegion="polite">
        {variant === 'loading' ? (
          <ActivityIndicator size="large" color={theme.accent} />
        ) : (
          <Text style={styles.icon}>{ICONS[variant]}</Text>
        )}
        <Text
          style={[
            styles.message,
            { color: variant === 'error' ? theme.textPrimary : theme.textSecondary },
          ]}
        >
          {message}
        </Text>
        {variant === 'error' && onRetry ? (
          <Button label={retryLabel} variant="outline" size="sm" onPress={onRetry} />
        ) : null}
      </View>
    );
  },
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
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
});
