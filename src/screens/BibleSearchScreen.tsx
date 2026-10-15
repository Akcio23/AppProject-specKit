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
  const { theme, isDark, toggleTheme } = useTheme();
  const initialReference = route.params?.initialReference ?? '';

  const parsedInitial = parseBibleReference(initialReference);
  const [selectedBook, setSelectedBook] = useState<BibleBook | null>(parsedInitial.book);
  const [chapterText, setChapterText] = useState<string>(parsedInitial.chapter);
  const [submitted, setSubmitted] = useState<string>(initialReference);

  const { translationId } = usePreferences();
  const passage = usePassage(submitted, translationId);

  const handleSubmit = useCallback(() => {
    if (!selectedBook) return;
    const chapter = chapterText.trim();
    if (chapter.length === 0) return;
    const fullRef = `${selectedBook.name} ${chapter}`;
    setSubmitted(fullRef);
  }, [selectedBook, chapterText]);

  const handleClear = useCallback(() => {
    setSelectedBook(null);
    setChapterText('');
    setSubmitted('');
  }, []);

  const handleExample = useCallback((reference: string) => {
    const parsed = parseBibleReference(reference);
    setSelectedBook(parsed.book);
    setChapterText(parsed.chapter);
    setSubmitted(reference);
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

    return <PassageView passage={passage.data} />;
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.background,
          paddingBottom: insets.bottom + spacing.sm,
        },
      ]}
    >
      <StatusBar barStyle={theme.statusBar} backgroundColor={theme.background} />

      {/* Barra Superior com Identificação e Alternador de Tema */}
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          <Text style={[styles.topBarTitle, { color: theme.textPrimary }]}>
            Bíblia Sagrada
          </Text>
          <View
            style={[
              styles.versionBadge,
              {
                backgroundColor: theme.accentSoft,
                borderColor: theme.accent,
              },
            ]}
          >
            <Text style={[styles.versionBadgeText, { color: theme.textPrimary }]}>
              {translationId.toUpperCase()} (PT)
            </Text>
          </View>
        </View>

        <Pressable
          onPress={toggleTheme}
          style={({ pressed }) => [
            styles.themeToggleBtn,
            {
              backgroundColor: theme.surfaceCard,
              borderColor: theme.borderSubtle,
            },
            pressed && styles.themeToggleBtnPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Alternar entre modo claro e escuro"
        >
          <Text style={styles.themeToggleText}>{isDark ? '☀️' : '🌙'}</Text>
        </Pressable>
      </View>

      {/* Motor de Busca Controlado: Livro Pré-definido + Entrada Livre de Capítulo */}
      <ControlledBibleSearch
        selectedBook={selectedBook}
        chapterText={chapterText}
        onSelectBook={setSelectedBook}
        onChangeChapterText={setChapterText}
        onSubmit={handleSubmit}
        onClear={submitted.length > 0 ? handleClear : undefined}
        isLoading={passage.isFetching}
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
    paddingTop: spacing.md,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs + 2,
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
  },
  topBarTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
  versionBadge: {
    borderWidth: 1,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 1,
  },
  versionBadgeText: {
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
  },
  themeToggleBtn: {
    width: 38,
    height: 38,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeToggleBtnPressed: {
    opacity: 0.7,
  },
  themeToggleText: {
    fontSize: 16,
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
