import { memo, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { useTranslations } from '@/hooks/useTranslations';
import { useBibleStore } from '@/stores/useBibleStore';
import { spacing, borderRadius, typography } from '@/constants/theme';
import { Translation } from '@/types/bible';
import { useTheme } from '@/hooks/useTheme';

const POPULAR_ORDER = ['almeida', 'kjv', 'web', 'bbe', 'clementine'];

export const SettingsTranslationList = memo(() => {
  const { theme } = useTheme();
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
        <ActivityIndicator color={theme.accent} size="small" />
        <Text style={[styles.stateText, { color: theme.textSecondary }]}>
          Carregando versões disponíveis...
        </Text>
      </View>
    );
  }

  if (error || !translations) {
    return (
      <View style={styles.stateBox}>
        <Text style={[styles.stateErrorText, { color: theme.textPrimary }]}>
          Não foi possível listar todas as traduções da API.
        </Text>
        <Pressable
          onPress={() => void refetch()}
          style={[styles.retryBtn, { backgroundColor: theme.surfaceSubtle }]}
        >
          <Text style={[styles.retryBtnText, { color: theme.accentText }]}>
            Tentar novamente
          </Text>
        </Pressable>
      </View>
    );
  }

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
              {
                backgroundColor: theme.surfaceCard,
                borderColor: isSelected ? theme.accent : theme.borderSubtle,
              },
              isSelected && { backgroundColor: theme.surfaceSubtle },
              pressed && styles.cardPressed,
            ]}
            accessibilityRole="radio"
            accessibilityState={{ selected: isSelected }}
          >
            <View style={styles.radioRow}>
              <View
                style={[
                  styles.radioCircle,
                  { borderColor: isSelected ? theme.accent : theme.border },
                ]}
              >
                {isSelected && (
                  <View style={[styles.radioInner, { backgroundColor: theme.accent }]} />
                )}
              </View>

              <View style={styles.cardContent}>
                <View style={styles.titleRow}>
                  <Text
                    style={[
                      styles.name,
                      { color: isSelected ? theme.textPrimary : theme.textSecondary },
                      isSelected && styles.nameSelected,
                    ]}
                  >
                    {item.name}
                  </Text>
                  {isSelected && (
                    <View
                      style={[
                        styles.activeBadge,
                        { backgroundColor: theme.accentSoft, borderColor: theme.accent },
                      ]}
                    >
                      <Text style={[styles.activeBadgeText, { color: theme.accentText }]}>
                        EM USO
                      </Text>
                    </View>
                  )}
                </View>

                <View style={styles.tagRow}>
                  <View
                    style={[
                      styles.langBadge,
                      { backgroundColor: theme.surfaceSubtle, borderColor: theme.borderSubtle },
                    ]}
                  >
                    <Text style={[styles.langText, { color: theme.textMuted }]}>
                      {item.language}
                    </Text>
                  </View>
                  <Text style={[styles.idText, { color: theme.textMuted }]}>
                    Código: {item.id.toUpperCase()}
                  </Text>
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
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
  },
  stateText: {
    fontSize: typography.fontSize.sm,
  },
  stateErrorText: {
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  retryBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  retryBtnText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  card: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
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
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  cardContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    flex: 1,
  },
  nameSelected: {
    fontWeight: typography.fontWeight.bold,
  },
  activeBadge: {
    paddingHorizontal: spacing.xs + 3,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    marginLeft: spacing.xs,
  },
  activeBadgeText: {
    fontSize: 9,
    fontWeight: typography.fontWeight.bold,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  langBadge: {
    borderWidth: 1,
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 1,
    borderRadius: borderRadius.xs,
  },
  langText: {
    fontSize: 10,
  },
  idText: {
    fontSize: 10,
  },
});
