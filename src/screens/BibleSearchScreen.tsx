import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, StateMessage, TextField } from '@/components/ui';
import { PassageView } from '@/components/features/bible';
import { usePassage } from '@/hooks/usePassage';
import { usePreferences } from '@/hooks/usePreferences';
import { RootStackScreenProps } from '@/navigation/types';
import { spacing, typography, borderRadius } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';

const EXAMPLES = [
  'João 3:16',
  'Salmos 23',
  'Filipenses 4:13',
  'Romanos 8:28',
  '1 Coríntios 13:4-7',
  'Isaías 40:31',
  'Salmos 91:1-2',
] as const;

/** Busca de passagens por referência em estética clean pastel. */
export function BibleSearchScreen({ route }: RootStackScreenProps<'BibleSearch'>) {
  const insets = useSafeAreaInsets();
  const { theme, isDark, toggleTheme } = useTheme();
  const initialReference = route.params?.initialReference ?? '';

  const [query, setQuery] = useState(initialReference);
  const [submitted, setSubmitted] = useState(initialReference);

  const { translationId } = usePreferences();
  const passage = usePassage(submitted, translationId);

  const handleSubmit = useCallback(() => {
    const trimmed = query.trim();
    if (trimmed.length > 0) setSubmitted(trimmed);
  }, [query]);

  const handleExample = useCallback((reference: string) => {
    setQuery(reference);
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
            Toque em um exemplo para ler instantaneamente ou digite uma referência acima:
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
              >
                <Text style={[styles.exampleText, { color: theme.textPrimary }]}>{ex}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      );
    }
    if (passage.isPending) {
      return <StateMessage variant="loading" message={`Buscando ${submitted}...`} />;
    }
    if (passage.error) {
      const canRetry = passage.error.code !== 'NOT_FOUND';
      return (
        <View style={styles.errorContainer}>
          <StateMessage
            variant="error"
            message={
              passage.error.code === 'NOT_FOUND'
                ? `Referência "${submitted}" não encontrada. Verifique se o nome do livro e capítulo estão corretos (ex.: João 3:16 ou Salmos 23).`
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

      {/* Barra de pesquisa clean */}
      <View style={styles.searchRow}>
        <View style={styles.inputWrapper}>
          <TextField
            value={query}
            onChangeText={setQuery}
            placeholder="Ex.: João 3:16 ou Salmos 23"
            onSubmitEditing={handleSubmit}
            autoFocus={initialReference.length === 0}
            accessibilityLabel="Referência bíblica"
            testID="bible-search-input"
          />
        </View>
        <Button
          label="Buscar"
          onPress={handleSubmit}
          disabled={query.trim().length === 0}
          loading={passage.isFetching}
          testID="bible-search-submit"
        />
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
          accessibilityLabel="Alternar tema"
        >
          <Text style={styles.themeToggleText}>{isDark ? '☀️' : '🌙'}</Text>
        </Pressable>
      </View>

      {/* Indicador discreto da versão ativa */}
      <View style={styles.versionBar}>
        <Text style={[styles.versionLabel, { color: theme.textMuted }]}>
          Versão:{' '}
          <Text style={[styles.versionHighlight, { color: theme.accentText }]}>
            {translationId.toUpperCase()}
          </Text>
        </Text>
        <Text style={[styles.versionHint, { color: theme.textMuted }]}>
          Troque de versão no menu Ajustes ⚙️
        </Text>
      </View>

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
  searchRow: {
    flexDirection: 'row',
    gap: spacing.xs + 2,
    alignItems: 'center',
  },
  inputWrapper: {
    flex: 1,
  },
  themeToggleBtn: {
    width: 40,
    height: 40,
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
  versionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.xs,
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
  },
  versionLabel: {
    fontSize: typography.fontSize.xs,
  },
  versionHighlight: {
    fontWeight: typography.fontWeight.bold,
  },
  versionHint: {
    fontSize: 10,
    fontStyle: 'italic',
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
