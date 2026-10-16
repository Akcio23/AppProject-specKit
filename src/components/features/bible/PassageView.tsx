import { memo, useCallback, useRef } from 'react';
import {
  FlatList,
  ListRenderItem,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Passage, Verse } from '@/types/bible';
import { spacing, typography, borderRadius, shadows } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';

import { Feather } from '@expo/vector-icons';

interface Props {
  passage: Passage;
  onScrollDirectionChange?: (direction: 'up' | 'down') => void;
  onNavigateChapter?: (direction: 'prev' | 'next') => void;
  hasPrevChapter?: boolean;
  hasNextChapter?: boolean;
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
export const PassageView = memo(({
  passage,
  onScrollDirectionChange,
  onNavigateChapter,
  hasPrevChapter = false,
  hasNextChapter = false,
}: Props) => {
  const { theme } = useTheme();
  const lastOffsetYRef = useRef<number>(0);
  const lastDirectionRef = useRef<'up' | 'down'>('up');

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (!onScrollDirectionChange) return;

      const currentY = event.nativeEvent.contentOffset.y;
      const diff = currentY - lastOffsetYRef.current;

      // Perto do topo: sempre expande
      if (currentY <= 15) {
        if (lastDirectionRef.current !== 'up') {
          lastDirectionRef.current = 'up';
          onScrollDirectionChange('up');
        }
        lastOffsetYRef.current = currentY;
        return;
      }

      // Limiar seguro para evitar oscilações em micro-toques
      const SCROLL_THRESHOLD = 15;
      if (Math.abs(diff) > SCROLL_THRESHOLD) {
        const newDirection: 'up' | 'down' = diff > 0 ? 'down' : 'up';
        if (newDirection !== lastDirectionRef.current) {
          lastDirectionRef.current = newDirection;
          onScrollDirectionChange(newDirection);
        }
        lastOffsetYRef.current = currentY;
      }
    },
    [onScrollDirectionChange],
  );

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
      onScroll={handleScroll}
      scrollEventThrottle={16}
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
      ListFooterComponent={
        onNavigateChapter ? (
          <View style={styles.chapterNavigation}>
            <Pressable
              onPress={() => onNavigateChapter('prev')}
              disabled={!hasPrevChapter}
              style={({ pressed }) => [
                styles.navChapterButton,
                {
                  backgroundColor: theme.surfaceCard,
                  borderColor: theme.borderSubtle,
                  opacity: hasPrevChapter ? (pressed ? 0.7 : 1) : 0.35,
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Capítulo anterior"
            >
              <Feather name="chevron-left" size={16} color={theme.textPrimary} />
              <Text style={[styles.navChapterText, { color: theme.textPrimary }]}>
                Cap. Anterior
              </Text>
            </Pressable>

            <Pressable
              onPress={() => onNavigateChapter('next')}
              disabled={!hasNextChapter}
              style={({ pressed }) => [
                styles.navChapterButton,
                {
                  backgroundColor: theme.surfaceCard,
                  borderColor: theme.borderSubtle,
                  opacity: hasNextChapter ? (pressed ? 0.7 : 1) : 0.35,
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Próximo capítulo"
            >
              <Text style={[styles.navChapterText, { color: theme.textPrimary }]}>
                Próximo Cap.
              </Text>
              <Feather name="chevron-right" size={16} color={theme.textPrimary} />
            </Pressable>
          </View>
        ) : null
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
  chapterNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.lg,
    paddingTop: spacing.sm,
  },
  navChapterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.sm,
    gap: 6,
    minHeight: 46,
  },
  navChapterText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
});
