import { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { spacing, typography, borderRadius } from '@/constants/theme';

export interface FormErrorProps {
  message?: string | null;
}

export const FormError = memo(({ message }: FormErrorProps) => {
  if (!message) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>⚠️</Text>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
});

FormError.displayName = 'FormError';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(229, 115, 115, 0.12)',
    borderColor: 'rgba(229, 115, 115, 0.35)',
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  icon: {
    fontSize: 14,
  },
  text: {
    flex: 1,
    color: '#D32F2F',
    fontSize: typography.fontSize.xs,
    lineHeight: 18,
  },
});
