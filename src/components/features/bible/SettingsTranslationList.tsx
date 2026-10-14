import { memo, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { useTranslations } from '@/hooks/useTranslations';
import { useBibleStore } from '@/stores/useBibleStore';
import { colors, spacing, borderRadius, typography } from '@/constants/theme';
import { Translation } from '@/types/bible';

// Traduções populares de referência para ordenação ou fallback
const POPULAR_ORDER = ['almeida', 'kjv', 'web', 'bbe', 'clementine'];

export const SettingsTranslationList = memo(() => {
  const { data: translations, isPending, error, refetch } = useTranslations();
  const translationId = useBibleStore((s) => s.translationId);
  const setTranslationId = useBibleStore((s) => s.setTranslationId);

  const handleSelect = useCallback(
    (id: string) => {
      setTranslationId(id);
    },
    [setTranslationId],
  );

  if (isPending) {
    return (
      <View style={styles.stateBox}>
        <ActivityIndicator color={colors.primary} size="small" />
        <Text style={styles.stateText}>Carregando versões disponíveis...</Text>
      </View>
    );
  }

  if (error || !translations) {
    return (
      <View style={styles.stateBox}>
        <Text style={styles.stateErrorText}>
          Não foi possível listar todas as traduções da API.
        </Text>
        <Pressable onPress={() => void refetch()} style={styles.retryBtn}>
          <Text style={styles.retryBtnText}>Tentar novamente</Text>
        </Pressable>
      </View>
    );
  }

  // Ordena colocando a tradução ativa e as mais conhecidas no topo
  const sortedTranslations = [...translations].sort((a, b) => {
    if (a.id === translationId) return -1;
    if (b.id === translationId) return 1;
    const indexA = POPULAR_ORDER.indexOf(a.id);
    const indexB = POPULAR_ORDER.indexOf(b.id);
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    return a.language.localeCompare(b.language);
  });

  return (
    <View style={styles.list}>
      {sortedTranslations.map((item: Translation) => {
        const isSelected = item.id === translationId;
        return (
          <Pressable
            key={item.id}
            onPress={() => handleSelect(item.id)}
            style={({ pressed }) => [
              styles.card,
              isSelected ? styles.cardSelected : null,
              pressed ? styles.cardPressed : null,
            ]}
            accessibilityRole="radio"
            accessibilityState={{ selected: isSelected }}
          >
            <View style={styles.radioRow}>
              <View style={[styles.radioCircle, isSelected ? styles.radioCircleSelected : null]}>
                {isSelected && <View style={styles.radioInner} />}
              </View>

              <View style={styles.cardContent}>
                <View style={styles.titleRow}>
                  <Text style={[styles.name, isSelected ? styles.nameSelected : null]}>
                    {item.name}
                  </Text>
                  {isSelected && (
                    <View style={styles.activeBadge}>
                      <Text style={styles.activeBadgeText}>EM USO</Text>
                    </View>
                  )}
                </View>

                <View style={styles.tagRow}>
                  <View style={styles.langBadge}>
                    <Text style={styles.langText}>{item.language}</Text>
                  </View>
                  <Text style={styles.idText}>Código: {item.id.toUpperCase()}</Text>
                </View>
              </View>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
});

SettingsTranslationList.displayName = 'SettingsTranslationList';

const styles = StyleSheet.create({
  list: {
    gap: spacing.sm,
  },
  stateBox: {
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceDark,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.borderDark,
    gap: spacing.sm,
  },
  stateText: {
    color: colors.textMutedDark,
    fontSize: typography.fontSize.xs,
  },
  stateErrorText: {
    color: colors.warning,
    fontSize: typography.fontSize.xs,
    textAlign: 'center',
  },
  retryBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  retryBtnText: {
    color: colors.primary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  card: {
    backgroundColor: colors.surfaceDark,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.borderDark,
    padding: spacing.md,
  },
  cardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceSubtleDark,
  },
  cardPressed: {
    opacity: 0.85,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.textMutedDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    borderColor: colors.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  cardContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  name: {
    fontSize: typography.fontSize.sm + 1,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimaryDark,
    flex: 1,
  },
  nameSelected: {
    color: colors.primary,
  },
  activeBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    marginLeft: spacing.xs,
  },
  activeBadgeText: {
    color: '#0F172A',
    fontSize: 9,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 0.5,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  langBadge: {
    backgroundColor: colors.surfaceDark,
    borderWidth: 1,
    borderColor: colors.borderDark,
    paddingHorizontal: spacing.xs + 3,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  langText: {
    fontSize: 10,
    color: colors.textMutedDark,
    fontWeight: typography.fontWeight.medium,
  },
  idText: {
    fontSize: 10,
    color: colors.textMutedDark,
  },
});
