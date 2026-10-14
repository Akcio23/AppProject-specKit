import { memo, useCallback } from 'react';
import { FlatList, ListRenderItem, StyleSheet, Text, View } from 'react-native';
import { Passage, Verse } from '@/types/bible';
import { spacing, typography, borderRadius, shadows } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';

interface Props {
  passage: Passage;
}

const VerseRow = memo(({ verse, textPrimary, borderSubtle, accentText, accentSoft }: {
  verse: Verse;
  textPrimary: string;
  borderSubtle: string;
  accentText: string;
  accentSoft: string;
}) => (
  <View style={[styles.row, { borderBottomColor: borderSubtle }]}>
    <View style={[styles.numberBadge, { backgroundColor: accentSoft }]}>
      <Text style={[styles.verseNumber, { color: accentText }]}>{verse.verse}</Text>
    </View>
    <Text style={[styles.verseText, { color: textPrimary }]}>{verse.text}</Text>
  </View>
));
VerseRow.displayName = 'VerseRow';

const keyExtractor = (v: Verse): string => `${v.bookId}-${v.chapter}-${v.verse}`;

/** Lista virtualizada dos versículos em formato editorial clean pastel. */
export const PassageView = memo(({ passage }: Props) => {
  const { theme } = useTheme();

  const renderItem: ListRenderItem<Verse> = useCallback(
    ({ item }) => (
      <VerseRow
        verse={item}
        textPrimary={theme.textPrimary}
        borderSubtle={theme.divider}
        accentText={theme.accentText}
        accentSoft={theme.accentSoft}
      />
    ),
    [theme],
  );

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
        <View
          style={[
            styles.header,
            shadows.soft,
            {
              backgroundColor: theme.surfaceCard,
              borderColor: theme.borderSubtle,
            },
          ]}
        >
          <Text
            style={[styles.reference, { color: theme.textPrimary }]}
            testID="passage-reference"
          >
            {passage.reference}
          </Text>
          <Text style={[styles.translation, { color: theme.textSecondary }]}>
            {passage.translationName}
          </Text>
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
    borderWidth: 1,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  reference: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 0.3,
  },
  translation: {
    fontSize: typography.fontSize.xs,
    marginTop: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: spacing.sm + 4,
    borderBottomWidth: 1,
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  numberBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.xs,
    marginTop: 2,
  },
  verseNumber: {
    fontSize: 11,
    fontWeight: typography.fontWeight.bold,
  },
  verseText: {
    flex: 1,
    fontSize: typography.fontSize.md,
    lineHeight: 26,
    letterSpacing: 0.2,
  },
});
