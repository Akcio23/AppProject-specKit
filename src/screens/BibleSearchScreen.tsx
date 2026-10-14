import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, StateMessage, TextField } from '@/components/ui';
import { PassageView, TranslationPicker } from '@/components/features/bible';
import { usePassage } from '@/hooks/usePassage';
import { useTranslations } from '@/hooks/useTranslations';
import { useBibleStore } from '@/stores/useBibleStore';
import { RootStackScreenProps } from '@/navigation/types';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';

const EXAMPLES = ['João 3:16', 'Salmos 23', 'Mateus 25:31-33,46', 'Romanos 8:28'] as const;

/** P2/P3 — Busca de passagens por referência com seleção de tradução. */
export function BibleSearchScreen({ route }: RootStackScreenProps<'BibleSearch'>) {
  const insets = useSafeAreaInsets();
  const initialReference = route.params?.initialReference ?? '';

  const [query, setQuery] = useState(initialReference);
  const [submitted, setSubmitted] = useState(initialReference);

  const translationId = useBibleStore((s) => s.translationId);
  const setTranslationId = useBibleStore((s) => s.setTranslationId);

  const translations = useTranslations();
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
        <View>
          <StateMessage variant="empty" message="Digite uma referência ou toque em um exemplo:" />
          <View style={styles.examples}>
            {EXAMPLES.map((ex) => (
              <Pressable
                key={ex}
                onPress={() => handleExample(ex)}
                style={({ pressed }) => [styles.example, pressed ? styles.examplePressed : null]}
                accessibilityRole="button"
              >
                <Text style={styles.exampleText}>{ex}</Text>
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
        <StateMessage
          variant="error"
          message={passage.error.message}
          onRetry={canRetry ? handleRetry : undefined}
        />
      );
    }
    return <PassageView passage={passage.data} />;
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={styles.searchRow}>
        <View style={styles.inputWrapper}>
          <TextField
            value={query}
            onChangeText={setQuery}
            placeholder="Ex.: João 3:16"
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
      </View>

      {translations.data ? (
        <TranslationPicker
          translations={translations.data}
          selectedId={translationId}
          onSelect={setTranslationId}
        />
      ) : translations.error ? (
        <Text style={styles.hint}>Não foi possível carregar as traduções.</Text>
      ) : null}

      <View style={styles.body}>{renderBody()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  searchRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  inputWrapper: {
    flex: 1,
  },
  hint: {
    color: colors.textMutedDark,
    fontSize: typography.fontSize.xs,
    paddingVertical: spacing.sm,
  },
  body: {
    flex: 1,
    marginTop: spacing.sm,
  },
  examples: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  example: {
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: spacing.xs + 2,
  },
  examplePressed: {
    backgroundColor: colors.surfaceSubtleDark,
  },
  exampleText: {
    color: colors.primaryLight,
    fontSize: typography.fontSize.sm,
  },
});
