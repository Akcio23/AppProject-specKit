import { memo, useCallback, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Share } from 'react-native';
import { Button, StateMessage } from '@/components/ui';
import { useRandomVerse } from '@/hooks/useRandomVerse';
import { useBibleStore } from '@/stores/useBibleStore';
import { useAppStore } from '@/stores/useAppStore';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';

interface Props {
  /** Abre a busca já com o capítulo do versículo exibido. */
  onReadChapter: (reference: string) => void;
}

/** Versículo do Dia em estilo editorial nobre e sagrado. */
export const VerseOfTheDayCard = memo(({ onReadChapter }: Props) => {
  const translationId = useBibleStore((s) => s.translationId);
  const { data, error, isPending, isFetching, refetch } = useRandomVerse(translationId);
  const { saveVerse, removeSavedVerse, isVerseSaved } = useAppStore();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isSaved = data ? isVerseSaved(data.reference) : false;

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
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.badgeWrapper}>
          <Text style={styles.badgeIcon}>✨</Text>
          <Text style={styles.badgeText}>PALAVRA DO DIA</Text>
        </View>

        {data ? (
          <View style={styles.headerActions}>
            <Pressable
              onPress={handleToggleFavorite}
              accessibilityLabel="Salvar versículo nos favoritos"
              style={({ pressed }) => [styles.iconBtn, pressed ? styles.iconBtnPressed : null]}
            >
              <Text style={styles.actionIcon}>{isSaved ? '❤️' : '🤍'}</Text>
            </Pressable>
            <Pressable
              onPress={handleShare}
              accessibilityLabel="Compartilhar versículo"
              style={({ pressed }) => [styles.iconBtn, pressed ? styles.iconBtnPressed : null]}
            >
              <Text style={styles.actionIcon}>📤</Text>
            </Pressable>
          </View>
        ) : null}
      </View>

      {toastMessage ? (
        <View style={styles.toastBox}>
          <Text style={styles.toastText}>{toastMessage}</Text>
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
          <View style={[styles.verseBody, isFetching ? styles.refreshing : null]}>
            <Text style={styles.openQuote}>“</Text>
            <Text style={styles.verseText} testID="verse-of-the-day-text">
              {data.verse.text}
            </Text>
            <Text style={styles.closeQuote}>”</Text>

            <View style={styles.metaRow}>
              <View style={styles.referenceBadge}>
                <Text style={styles.referenceText}>{data.reference}</Text>
              </View>
              <Text style={styles.translationText}>{data.translationName}</Text>
            </View>
          </View>

          {error ? <Text style={styles.inlineError}>{error.message}</Text> : null}

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
                variant="outline"
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
    backgroundColor: colors.surfaceDark,
    borderRadius: borderRadius.lg + 2,
    borderWidth: 1.5,
    borderColor: colors.borderGold,
    padding: spacing.md + 4,
    marginBottom: spacing.lg,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  badgeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSubtleDark,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 5,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.borderGold,
  },
  badgeIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  badgeText: {
    fontSize: typography.fontSize.xs - 1,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    letterSpacing: 1,
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceSubtleDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.94 }],
  },
  actionIcon: {
    fontSize: 16,
  },
  toastBox: {
    backgroundColor: colors.surfaceSubtleDark,
    borderRadius: borderRadius.md,
    paddingVertical: 6,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.primary,
    alignSelf: 'center',
  },
  toastText: {
    color: colors.primary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  verseBody: {
    backgroundColor: colors.surfaceSubtleDark,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  refreshing: {
    opacity: 0.5,
  },
  openQuote: {
    color: colors.primary,
    fontSize: 32,
    lineHeight: 32,
    fontWeight: typography.fontWeight.bold,
  },
  closeQuote: {
    color: colors.primary,
    fontSize: 32,
    lineHeight: 20,
    fontWeight: typography.fontWeight.bold,
    alignSelf: 'flex-end',
  },
  verseText: {
    color: colors.textPrimaryDark,
    fontSize: typography.fontSize.md + 1,
    lineHeight: 28,
    fontStyle: 'italic',
    marginVertical: spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    paddingTop: spacing.xs + 2,
    borderTopWidth: 1,
    borderTopColor: colors.borderDark,
  },
  referenceBadge: {
    backgroundColor: colors.backgroundDark,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.borderGold,
  },
  referenceText: {
    color: colors.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  translationText: {
    color: colors.textMutedDark,
    fontSize: typography.fontSize.xs,
  },
  inlineError: {
    color: colors.warning,
    fontSize: typography.fontSize.xs,
    marginBottom: spacing.sm,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  buttonWrapper: {
    flex: 1,
  },
});
