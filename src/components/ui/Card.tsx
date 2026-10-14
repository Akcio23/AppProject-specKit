import { memo } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { CardProps } from '@/types';
import { colors, spacing, borderRadius, typography, shadows } from '@/constants/theme';

export const Card = memo(({
  children,
  title,
  subtitle,
  testID,
  glass = true,
  glow = false,
}: CardProps) => {
  const cardBorderColor = glow ? colors.borderGold : colors.borderGlassDark;
  const shadowStyle = glow ? shadows.glassGlow : shadows.soft;

  const content = (
    <View style={[styles.innerContent, glow && styles.glowInner]}>
      {title && <Text style={styles.title}>{title}</Text>}
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      <View style={styles.content}>{children}</View>
    </View>
  );

  return (
    <View
      testID={testID}
      style={[
        styles.outerContainer,
        shadowStyle,
        {
          borderColor: cardBorderColor,
          backgroundColor: Platform.OS === 'android' || !glass ? colors.surfaceDark : 'transparent',
        },
      ]}
    >
      {glass ? (
        <BlurView intensity={35} tint="dark" style={styles.blurView}>
          {content}
        </BlurView>
      ) : (
        content
      )}
    </View>
  );
});

Card.displayName = 'Card';

const styles = StyleSheet.create({
  outerContainer: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1.2,
    marginBottom: spacing.md,
  },
  blurView: {
    width: '100%',
  },
  innerContent: {
    padding: spacing.lg,
    backgroundColor: 'rgba(17, 23, 38, 0.45)',
  },
  glowInner: {
    backgroundColor: 'rgba(212, 175, 55, 0.03)',
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: typography.letterSpacing.tight,
    color: colors.textPrimaryDark,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondaryDark,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  content: {
    marginTop: spacing.xs,
  },
});
