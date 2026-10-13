import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CardProps } from '@/types';
import { colors, spacing, borderRadius, typography } from '@/constants/theme';

export const Card = memo(({ children, title, subtitle, testID }: CardProps) => {
  return (
    <View testID={testID} style={styles.card}>
      {title && <Text style={styles.title}>{title}</Text>}
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      <View style={styles.content}>{children}</View>
    </View>
  );
});

Card.displayName = 'Card';

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceDark,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.borderDark,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimaryDark,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textMutedDark,
    marginBottom: spacing.md,
  },
  content: {
    marginTop: spacing.xs,
  },
});
