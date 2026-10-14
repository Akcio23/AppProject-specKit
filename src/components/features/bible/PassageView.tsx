import { memo, useCallback } from 'react';
import { FlatList, ListRenderItem, StyleSheet, Text, View } from 'react-native';
import { Passage, Verse } from '@/types/bible';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';

interface Props {
  passage: Passage;
}

const VerseRow = memo(({ verse }: { verse: Verse }) => (
  <View style={styles.row}>
    <Text style={styles.verseNumber}>{verse.verse}</Text>
    <Text style={styles.verseText}>{verse.text}</Text>
  </View>
));
VerseRow.displayName = 'VerseRow';

/* Alturas variáveis (texto livre) inviabilizam getItemLayout; compensamos com
   keyExtractor estável, itens memoizados e janela de renderização reduzida. */
const keyExtractor = (v: Verse): string => `${v.bookId}-${v.chapter}-${v.verse}`;

/** P2 — Lista virtualizada dos versículos de uma passagem. */
export const PassageView = memo(({ passage }: Props) => {
  const renderItem: ListRenderItem<Verse> = useCallback(({ item }) => <VerseRow verse={item} />, []);

  return (
    <FlatList
      data={passage.verses}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      maxToRenderPerBatch={15}
      windowSize={7}
      initialNumToRender={15}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.reference} testID="passage-reference">
            {passage.reference}
          </Text>
          <Text style={styles.translation}>{passage.translationName}</Text>
        </View>
      }
    />
  );
});

PassageView.displayName = 'PassageView';

const styles = StyleSheet.create({
  content: {
    paddingBottom: spacing.xxl,
  },
  header: {
    backgroundColor: colors.surfaceDark,
    borderColor: colors.borderDark,
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  reference: {
    color: colors.textPrimaryDark,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
  },
  translation: {
    color: colors.primaryLight,
    fontSize: typography.fontSize.xs,
    marginTop: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderDark,
  },
  verseNumber: {
    color: colors.secondary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    width: spacing.lg + 4,
    paddingTop: 3,
  },
  verseText: {
    flex: 1,
    color: colors.textPrimaryDark,
    fontSize: typography.fontSize.md,
    lineHeight: 25,
  },
});
