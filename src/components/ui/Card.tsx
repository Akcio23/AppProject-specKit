import { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CardProps } from '@/types';
import { spacing, borderRadius, typography, shadows } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';

export const Card = memo(({
  children,
  title,
  subtitle,
  testID,
  glow = false,
}: CardProps) => {
  const { theme } = useTheme();

  return (
    <View
      testID={testID}
      style={[
        styles.outerContainer,
        shadows.soft,
        {
          backgroundColor: theme.surfaceCard,
          borderColor: glow ? theme.accent : theme.borderSubtle,
        },
      ]}
    >
      <View style={styles.innerContent}>
        {title && (
          <Text style={[styles.title, { color: theme.textPrimary }]}>
            {title}
          </Text>
        )}
        {subtitle && (
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            {subtitle}
          </Text>
        )}
        <View style={styles.content}>{children}</View>
      </View>
    </View>
  );
});

Card.displayName = 'Card';

const styles = StyleSheet.create({
  outerContainer: {
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  innerContent: {
    padding: spacing.lg,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: typography.letterSpacing.tight,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  content: {
    marginTop: spacing.xs,
  },
});
