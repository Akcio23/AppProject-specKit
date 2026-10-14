import { memo, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, Card, StateMessage } from '@/components/ui';
import { useRandomVerse } from '@/hooks/useRandomVerse';
import { useBibleStore } from '@/stores/useBibleStore';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';

interface Props {
  /** Abre a busca já com o capítulo do versículo exibido. */
  onReadChapter: (reference: string) => void;
}

/** P1 — Versículo aleatório exibido na tela inicial. */
export const VerseOfTheDayCard = memo(({ onReadChapter }: Props) => {
  const translationId = useBibleStore((s) => s.translationId);
  const { data, error, isPending, isFetching, refetch } = useRandomVerse(translationId);

  const handleAnother = useCallback(() => {
    void refetch();
  }, [refetch]);

  const handleReadChapter = useCallback(() => {
    if (data) onReadChapter(`${data.verse.bookName} ${data.verse.chapter}`);
  }, [data, onReadChapter]);

  return (
    <Card title="📖 Versículo do Dia" subtitle="Uma palavra aleatória das Escrituras para você">
      {isPending ? (
        <StateMessage variant="loading" message="Buscando um versículo..." />
      ) : error && !data ? (
        <StateMessage variant="error" message={error.message} onRetry={handleAnother} />
      ) : data ? (
        <>
          <View style={[styles.quoteBox, isFetching ? styles.refreshing : null]}>
            <Text style={styles.quoteMark}>“</Text>
            <Text style={styles.verseText} testID="verse-of-the-day-text">
              {data.verse.text}
            </Text>
            <Text style={styles.reference}>{data.reference}</Text>
            <Text style={styles.translation}>{data.translationName}</Text>
          </View>
          {error ? <Text style={styles.inlineError}>{error.message}</Text> : null}
          <View style={styles.buttonRow}>
            <View style={styles.buttonWrapper}>
              <Button
                label="Outro versículo"
                variant="primary"
                onPress={handleAnother}
                loading={isFetching}
                testID="verse-of-the-day-refresh"
              />
            </View>
            <View style={styles.buttonWrapper}>
              <Button label="Ler capítulo" variant="outline" onPress={handleReadChapter} />
            </View>
          </View>
        </>
      ) : null}
    </Card>
  );
});

VerseOfTheDayCard.displayName = 'VerseOfTheDayCard';

const styles = StyleSheet.create({
  quoteBox: {
    backgroundColor: colors.surfaceSubtleDark,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  refreshing: {
    opacity: 0.5,
  },
  quoteMark: {
    color: colors.primaryLight,
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    lineHeight: typography.fontSize.xxl,
  },
  verseText: {
    color: colors.textPrimaryDark,
    fontSize: typography.fontSize.md + 1,
    lineHeight: 26,
    fontStyle: 'italic',
  },
  reference: {
    color: colors.secondary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    marginTop: spacing.sm + 4,
  },
  translation: {
    color: colors.textMutedDark,
    fontSize: typography.fontSize.xs,
    marginTop: 2,
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
