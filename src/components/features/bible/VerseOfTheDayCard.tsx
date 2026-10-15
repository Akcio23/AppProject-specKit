import { memo, useCallback, useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Share } from 'react-native';
import { Button, StateMessage } from '@/components/ui';
import { useRandomVerse } from '@/hooks/useRandomVerse';
import { usePreferences } from '@/hooks/usePreferences';
import { useSavedVerses } from '@/hooks/useSavedVerses';
import { spacing, typography, borderRadius, shadows } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';

interface Props {
  /** Abre a busca já com o capítulo do versículo exibido. */
  onReadChapter: (reference: string) => void;
}

/** Versículo do Dia em estilo editorial limpo, calmo e sereno. */
export const VerseOfTheDayCard = memo(({ onReadChapter }: Props) => {
  const { theme } = useTheme();
  const { translationId } = usePreferences();
  const { data, error, isPending, isFetching, refetch } = useRandomVerse(translationId);
  const { saveVerse, removeSavedVerse, savedVerses } = useSavedVerses();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isSaved = useMemo(() => {
    if (!data) return false;
    return savedVerses.some(
      (v) => v.reference.toLowerCase().trim() === data.reference.toLowerCase().trim(),
    );
  }, [data, savedVerses]);

  const showFeedback = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleAnother = useCallback(() => {
    void refetch();
  }, [refetch]);

  const handleReadChapter = useCallback(() => {
    if (data) onReadChapter(`${data.verse.bookName} ${data.verse.chapter}`);
  }, [data, onReadChapter]);

  const handleToggleFavorite = useCallback(() => {
    if (!data) return;
    if (isSaved) {
      removeSavedVerse(data.reference);
      showFeedback('Versículo removido dos favoritos');
    } else {
      saveVerse({
        reference: data.reference,
        text: data.verse.text,
        translation: data.translationName,
      });
      showFeedback('Guardado no coração com sucesso! ❤️');
    }
  }, [data, isSaved, removeSavedVerse, saveVerse]);

  const handleShare = useCallback(async () => {
    if (!data) return;
    try {
      await Share.share({
        message: `“${data.verse.text}”\n\n— ${data.reference} (${data.translationName})\nCompartilhado via Bíblia Sagrada Mobile`,
        title: `Versículo do Dia: ${data.reference}`,
      });
    } catch {
      // Ignora cancelamentos
    }
  }, [data]);

  return (
    <View
      style={[
        styles.card,
        shadows.soft,
        {
          backgroundColor: theme.surfaceCard,
          borderColor: theme.borderSubtle,
        },
      ]}
    >
      <View style={styles.cardHeader}>
        <View style={styles.badgeWrapper}>
          <Text style={[styles.badgeText, { color: theme.textMuted }]}>
            PALAVRA DO DIA
          </Text>
        </View>

        {data ? (
          <View style={styles.headerActions}>
            <Pressable
              onPress={handleToggleFavorite}
              accessibilityLabel="Salvar versículo nos favoritos"
              style={({ pressed }) => [
                styles.iconBtn,
                { backgroundColor: theme.surfaceSubtle, borderColor: theme.borderSubtle },
                pressed && styles.iconBtnPressed,
              ]}
            >
              <Text style={styles.actionIcon}>{isSaved ? '❤️' : '🤍'}</Text>
            </Pressable>
            <Pressable
              onPress={handleShare}
              accessibilityLabel="Compartilhar versículo"
              style={({ pressed }) => [
                styles.iconBtn,
                { backgroundColor: theme.surfaceSubtle, borderColor: theme.borderSubtle },
                pressed && styles.iconBtnPressed,
              ]}
            >
              <Text style={styles.actionIcon}>📤</Text>
            </Pressable>
          </View>
        ) : null}
      </View>

      {toastMessage ? (
        <View style={[styles.toastBox, { backgroundColor: theme.surfaceSubtle }]}>
          <Text style={[styles.toastText, { color: theme.textSecondary }]}>
            {toastMessage}
          </Text>
        </View>
      ) : null}

      {isPending ? (
        <StateMessage variant="loading" message="Buscando uma palavra de paz..." />
      ) : error && !data ? (
        <StateMessage
          variant="error"
          message="Não foi possível buscar a Palavra no momento. Verifique sua conexão."
          onRetry={handleAnother}
          retryLabel="Tentar novamente"
        />
      ) : data ? (
        <>
          <View style={[styles.verseBody, isFetching && styles.refreshing]}>
            <Text
              style={[styles.verseText, { color: theme.textPrimary }]}
              testID="verse-of-the-day-text"
            >
              “{data.verse.text}”
            </Text>

            <View style={styles.metaRow}>
              <View
                style={[
                  styles.referenceBadge,
                  { backgroundColor: theme.accentSoft, borderColor: theme.accent },
                ]}
              >
                <Text style={[styles.referenceText, { color: theme.accentText }]}>
                  {data.reference}
                </Text>
              </View>
              <Text style={[styles.translationText, { color: theme.textMuted }]}>
                {data.translationName}
              </Text>
            </View>
          </View>

          {error ? (
            <Text style={[styles.inlineError, { color: theme.textMuted }]}>
              {error.message}
            </Text>
          ) : null}

          <View style={styles.buttonRow}>
            <View style={styles.buttonWrapper}>
              <Button
                label="Outro Versículo"
                variant="primary"
                size="md"
                onPress={handleAnother}
                loading={isFetching}
                testID="verse-of-the-day-refresh"
              />
            </View>
            <View style={styles.buttonWrapper}>
              <Button
                label="Ler Capítulo"
                variant="secondary"
                size="md"
                onPress={handleReadChapter}
              />
            </View>
          </View>
        </>
      ) : null}
    </View>
  );
});

VerseOfTheDayCard.displayName = 'VerseOfTheDayCard';

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.md,
    borderWidth: 1,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  badgeWrapper: {
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: typography.letterSpacing.extraWide,
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnPressed: {
    opacity: 0.7,
  },
  actionIcon: {
    fontSize: 14,
  },
  toastBox: {
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.sm,
  },
  toastText: {
    fontSize: typography.fontSize.xs,
    textAlign: 'center',
  },
  verseBody: {
    paddingVertical: spacing.xs,
  },
  refreshing: {
    opacity: 0.5,
  },
  verseText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.regular,
    lineHeight: 28,
    fontStyle: 'italic',
    letterSpacing: 0.2,
    marginBottom: spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  referenceBadge: {
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  referenceText: {
    fontSize: typography.fontSize.xs + 1,
    fontWeight: typography.fontWeight.bold,
  },
  translationText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
  },
  inlineError: {
    fontSize: typography.fontSize.xs,
    marginBottom: spacing.sm,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  buttonWrapper: {
    flex: 1,
  },
});
