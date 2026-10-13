import React, { memo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Card } from '@/components/ui';
import { useAppStore } from '@/stores/useAppStore';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';

export const WelcomeScreen = memo(() => {
  const insets = useSafeAreaInsets();
  const { counter, incrementCounter, resetCounter } = useAppStore();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + spacing.md,
          paddingBottom: insets.bottom + spacing.md,
        },
      ]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>React Native + Spec Kit</Text>
          </View>
          <Text style={styles.title}>App Mobile Foundation</Text>
          <Text style={styles.subtitle}>
            Construído sob a metodologia Spec-Driven Development e os mais altos padrões do ecossistema mobile.
          </Text>
        </View>

        {/* Card de Demonstração de Estado Reativo (Zustand) */}
        <Card
          title="⚡ Estado Reativo (Zustand)"
          subtitle="Testando a integração reativa do client state sem boilerplate"
        >
          <View style={styles.counterBox}>
            <Text style={styles.counterLabel}>Valor do Contador</Text>
            <Text style={styles.counterValue}>{counter}</Text>
          </View>
          <View style={styles.buttonRow}>
            <View style={styles.buttonWrapper}>
              <Button
                label="Incrementar (+1)"
                variant="primary"
                onPress={incrementCounter}
              />
            </View>
            <View style={styles.buttonWrapper}>
              <Button
                label="Resetar"
                variant="outline"
                onPress={resetCounter}
              />
            </View>
          </View>
        </Card>

        {/* Card de Arquitetura & Qualidade */}
        <Card
          title="🛡️ Pilares da Arquitetura"
          subtitle="Conformidade estrita com a Constituição do Projeto"
        >
          <View style={styles.pillarItem}>
            <Text style={styles.pillarIcon}>💎</Text>
            <View style={styles.pillarTextWrapper}>
              <Text style={styles.pillarTitle}>TypeScript Estrito</Text>
              <Text style={styles.pillarDesc}>Zero tolerância a 'any' e interfaces tipadas ponta a ponta.</Text>
            </View>
          </View>
          <View style={styles.pillarItem}>
            <Text style={styles.pillarIcon}>🧱</Text>
            <View style={styles.pillarTextWrapper}>
              <Text style={styles.pillarTitle}>Componentes Modulares</Text>
              <Text style={styles.pillarDesc}>Primitivos visuais em src/components/ui/ desacoplados da regra.</Text>
            </View>
          </View>
          <View style={styles.pillarItem}>
            <Text style={styles.pillarIcon}>🚀</Text>
            <View style={styles.pillarTextWrapper}>
              <Text style={styles.pillarTitle}>New Architecture Ready</Text>
              <Text style={styles.pillarDesc}>Preparado para renderização de alta fidelidade e TurboModules.</Text>
            </View>
          </View>
        </Card>
      </ScrollView>
    </View>
  );
});

WelcomeScreen.displayName = 'WelcomeScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
    paddingHorizontal: spacing.md,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  header: {
    marginBottom: spacing.lg,
    marginTop: spacing.sm,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceSubtleDark,
    borderColor: colors.borderDark,
    borderWidth: 1,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    marginBottom: spacing.sm,
  },
  badgeText: {
    color: colors.primaryLight,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  title: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimaryDark,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textMutedDark,
    lineHeight: 20,
  },
  counterBox: {
    alignItems: 'center',
    backgroundColor: colors.surfaceSubtleDark,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  counterLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textMutedDark,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  counterValue: {
    fontSize: 44,
    fontWeight: typography.fontWeight.bold,
    color: colors.secondary,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  buttonWrapper: {
    flex: 1,
  },
  pillarItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm + 4,
  },
  pillarIcon: {
    fontSize: 20,
    marginRight: spacing.sm,
  },
  pillarTextWrapper: {
    flex: 1,
  },
  pillarTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimaryDark,
  },
  pillarDesc: {
    fontSize: typography.fontSize.xs,
    color: colors.textMutedDark,
    marginTop: 2,
  },
});
