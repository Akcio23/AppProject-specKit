import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StateMessage } from '@/components/ui';
import { ControlledBibleSearch, PassageView } from '@/components/features/bible';
import { usePassage } from '@/hooks/usePassage';
import { usePreferences } from '@/hooks/usePreferences';
import { RootStackScreenProps } from '@/navigation/types';
import { spacing, typography, borderRadius } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { BibleBook, parseBibleReference } from '@/constants/bibleBooksPt';

const EXAMPLES = [
  'João 3:16',
  'Salmos 23',
  'Filipenses 4:13',
  'Romanos 8:28',
  '1 Coríntios 13:4-7',
  'Isaías 40:31',
  'Salmos 91:1-2',
] as const;

/**
 * Motor de busca bíblica controlado com seleção pré-definida de livros
 * e preenchimento flexível de capítulo e versículo (Tradução Almeida - PT-BR).
 */
export function BibleSearchScreen({ route }: RootStackScreenProps<'BibleSearch'>) {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const initialReference = route.params?.initialReference ?? '';

  const parsedInitial = parseBibleReference(initialReference);
  const [selectedBook, setSelectedBook] = useState<BibleBook | null>(parsedInitial.book);
  const [chapterText, setChapterText] = useState<string>(parsedInitial.chapter);
  const [submitted, setSubmitted] = useState<string>(initialReference);

  const { translationId } = usePreferences();
  const passage = usePassage(submitted, translationId);
  const [isSearchCollapsed, setIsSearchCollapsed] = useState(false);

  const handleScrollDirection = useCallback((direction: 'up' | 'down') => {
    setIsSearchCollapsed(direction === 'down');
  }, []);

  const handleSubmit = useCallback(() => {
    if (!selectedBook) return;
    const chapter = chapterText.trim();
    if (chapter.length === 0) {
      // Livros de 1 capítulo só na Bíblia (retorna o livro inteiro)
      const SINGLE_CHAPTER_BOOKS: Record<string, string> = {
        OBA: '1:1-21',
        PHM: '1:1-25',
        '2JN': '1:1-13',
        '3JN': '1:1-14',
        JUD: '1:1-25',
      };
      const singleRange = SINGLE_CHAPTER_BOOKS[selectedBook.id];
      if (singleRange) {
        setSubmitted(`${selectedBook.name} ${singleRange}`);
      } else {
        // Demais livros: inicia no capítulo 1
        setSubmitted(`${selectedBook.name} 1`);
      }
    } else {
      setSubmitted(`${selectedBook.name} ${chapter}`);
    }
  }, [selectedBook, chapterText]);

  const currentChapter = passage.data?.verses[0]?.chapter;
  const currentBookName = passage.data?.verses[0]?.bookName ?? selectedBook?.name;

  const handleNavigateChapter = useCallback(
    (direction: 'prev' | 'next') => {
      if (!currentChapter || !currentBookName) return;
      const targetChapter = direction === 'next' ? currentChapter + 1 : currentChapter - 1;
      if (targetChapter < 1) return;
      setChapterText(String(targetChapter));
      setSubmitted(`${currentBookName} ${targetChapter}`);
    },
    [currentChapter, currentBookName],
  );

  const handleClear = useCallback(() => {
    setSelectedBook(null);
    setChapterText('');
    setSubmitted('');
    setIsSearchCollapsed(false);
  }, []);

  const handleExample = useCallback((reference: string) => {
    const parsed = parseBibleReference(reference);
    setSelectedBook(parsed.book);
    setChapterText(parsed.chapter);
    setSubmitted(reference);
    setIsSearchCollapsed(false);
  }, []);

  const handleRetry = useCallback(() => {
    void passage.refetch();
  }, [passage]);

  const renderBody = () => {
    if (submitted.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>
            📖 Passagens Sugeridas
          </Text>
          <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
            Selecione o livro e capítulo acima ou toque em uma das passagens recomendadas:
          </Text>
          <View style={styles.examples}>
            {EXAMPLES.map((ex) => (
              <Pressable
                key={ex}
                onPress={() => handleExample(ex)}
                style={({ pressed }) => [
                  styles.example,
                  {
                    backgroundColor: theme.surfaceCard,
                    borderColor: theme.borderSubtle,
                  },
                  pressed && styles.examplePressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel={`Ler passagem sugerida: ${ex}`}
              >
                <Text style={[styles.exampleText, { color: theme.textPrimary }]}>
                  {ex}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      );
    }

    if (passage.isPending) {
      return (
        <StateMessage
          variant="loading"
          message={`Buscando ${submitted}...`}
        />
      );
    }

    if (passage.error) {
      const canRetry = passage.error.code !== 'NOT_FOUND';
      return (
        <View style={styles.errorContainer}>
          <StateMessage
            variant="error"
            message={
              passage.error.code === 'NOT_FOUND'
                ? `A referência "${submitted}" não foi encontrada. Verifique se o capítulo existe neste livro (ex.: Salmos possui 150 capítulos).`
                : passage.error.message
            }
            onRetry={canRetry ? handleRetry : undefined}
            retryLabel="Tentar novamente"
          />
        </View>
      );
    }

    return (
      <PassageView
        passage={passage.data}
        onScrollDirectionChange={handleScrollDirection}
        onNavigateChapter={handleNavigateChapter}
        hasPrevChapter={Boolean(currentChapter && currentChapter > 1)}
        hasNextChapter={Boolean(currentChapter)}
      />
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.background,
          paddingTop: spacing.xs,
          paddingBottom: insets.bottom + spacing.sm,
        },
      ]}
    >
      <StatusBar barStyle={theme.statusBar} backgroundColor={theme.background} />

      {/* Motor de Busca Controlado: Livro Pré-definido + Entrada Livre de Capítulo */}
      <ControlledBibleSearch
        selectedBook={selectedBook}
        chapterText={chapterText}
        onSelectBook={setSelectedBook}
        onChangeChapterText={setChapterText}
        onSubmit={handleSubmit}
        onClear={submitted.length > 0 ? handleClear : undefined}
        isLoading={passage.isFetching}
        isCollapsed={isSearchCollapsed}
        onExpandRequest={() => setIsSearchCollapsed(false)}
        currentChapter={currentChapter}
      />

      {/* Conteúdo da Passagem ou Sugestões */}
      <View style={styles.body}>{renderBody()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  body: {
    flex: 1,
    marginTop: spacing.xs,
  },
  emptyContainer: {
    paddingTop: spacing.md,
  },
  emptyTitle: {
    fontSize: typography.fontSize.sm + 1,
    fontWeight: typography.fontWeight.bold,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: typography.fontSize.xs,
    lineHeight: 18,
    marginBottom: spacing.md,
  },
  errorContainer: {
    paddingTop: spacing.lg,
  },
  examples: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  example: {
    borderWidth: 1,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: spacing.xs + 3,
  },
  examplePressed: {
    opacity: 0.8,
  },
  exampleText: {
    fontSize: typography.fontSize.xs + 1,
    fontWeight: typography.fontWeight.medium,
  },
});
