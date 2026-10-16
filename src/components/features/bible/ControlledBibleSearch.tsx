import { useState, useCallback, useEffect } from 'react';
import {
  LayoutAnimation,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  UIManager,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import type { BibleBook } from '@/constants/bibleBooksPt';
import { borderRadius, spacing, typography } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui';
import { BookPickerModal } from './BookPickerModal';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export interface ControlledBibleSearchProps {
  selectedBook: BibleBook | null;
  chapterText: string;
  onSelectBook: (book: BibleBook) => void;
  onChangeChapterText: (text: string) => void;
  onSubmit: () => void;
  onClear?: () => void;
  isLoading?: boolean;
  isCollapsed?: boolean;
  onExpandRequest?: () => void;
  currentChapter?: number;
}

function formatCollapsedTitle(
  bookName: string,
  chapterInput: string,
  currentChapter?: number,
): string {
  const cleanInput = chapterInput.trim();
  const effectiveChapter = cleanInput || (currentChapter ? String(currentChapter) : '');

  if (!effectiveChapter) {
    return bookName;
  }

  if (/^cap[íi]tulo\b/i.test(effectiveChapter)) {
    return `${bookName}, ${effectiveChapter}`;
  }

  return `${bookName}, Capítulo ${effectiveChapter}`;
}

export function ControlledBibleSearch({
  selectedBook,
  chapterText,
  onSelectBook,
  onChangeChapterText,
  onSubmit,
  isLoading = false,
  isCollapsed = false,
  onExpandRequest,
  currentChapter,
}: ControlledBibleSearchProps) {
  const { theme } = useTheme();
  const [pickerVisible, setPickerVisible] = useState(false);

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [isCollapsed]);

  const handleOpenPicker = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (isCollapsed) {
      onExpandRequest?.();
    }
    setPickerVisible(true);
  }, [isCollapsed, onExpandRequest]);

  const handleClosePicker = useCallback(() => {
    setPickerVisible(false);
  }, []);

  const handleBookPicked = useCallback(
    (book: BibleBook) => {
      onSelectBook(book);
    },
    [onSelectBook],
  );

  const canSubmit = Boolean(selectedBook);

  // Modo Colapsado: some tudo da pesquisa e deixa fixo apenas o título do livro
  if (isCollapsed) {
    const collapsedTitle = selectedBook
      ? formatCollapsedTitle(selectedBook.name, chapterText, currentChapter)
      : 'Bíblia Sagrada';

    return (
      <Pressable
        onPress={() => {
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onExpandRequest?.();
        }}
        style={({ pressed }) => [
          styles.fixedTitleBar,
          {
            backgroundColor: theme.surfaceCard,
            borderColor: theme.borderSubtle,
          },
          pressed && styles.triggerPressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel="Toque para reabrir a barra de pesquisa completa"
      >
        <View style={styles.fixedTitleContent}>
          <Text style={styles.bookIcon}>📖</Text>
          <Text
            style={[styles.fixedTitleText, { color: theme.textPrimary }]}
            numberOfLines={1}
          >
            {collapsedTitle}
          </Text>
        </View>

        <View style={styles.fixedTitleAction}>
          <Text style={[styles.fixedTitleHint, { color: theme.textMuted }]}>
            Pesquisar
          </Text>
          <Feather name="chevron-down" size={16} color={theme.textMuted} />
        </View>

        <BookPickerModal
          visible={pickerVisible}
          selectedBookId={selectedBook?.id}
          onSelect={handleBookPicked}
          onClose={handleClosePicker}
        />
      </Pressable>
    );
  }

  return (
    <View
      style={[
        styles.cardContainer,
        {
          backgroundColor: theme.surfaceCard,
          borderColor: theme.borderSubtle,
        },
      ]}
    >
      {/* Linha Superior: Livro Sagrado */}
      <View style={styles.bookSelectorWrapper}>
        <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
          Livro Sagrado
        </Text>
        <Pressable
          onPress={handleOpenPicker}
          style={({ pressed }) => [
            styles.bookTrigger,
            {
              backgroundColor: theme.surfaceSubtle,
              borderColor: selectedBook ? theme.accent : theme.borderSubtle,
            },
            pressed && styles.triggerPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel={
            selectedBook
              ? `Livro selecionado: ${selectedBook.name}. Toque para alterar.`
              : 'Toque para escolher o livro bíblico.'
          }
        >
          <View style={styles.triggerContent}>
            <Text style={styles.bookIcon}>📖</Text>
            <Text
              style={[
                styles.bookTriggerText,
                {
                  color: selectedBook
                    ? theme.textPrimary
                    : theme.textMuted,
                  fontWeight: selectedBook
                    ? typography.fontWeight.bold
                    : typography.fontWeight.regular,
                },
              ]}
              numberOfLines={1}
            >
              {selectedBook ? selectedBook.name : 'Escolher Livro'}
            </Text>
          </View>
          <Feather
            name="chevron-down"
            size={16}
            color={selectedBook ? theme.textPrimary : theme.textMuted}
          />
        </Pressable>
      </View>

      {/* Linha Inferior: Quadrado de Capítulo / Versículo + Botão */}
      <View style={styles.bottomRow}>
        <View style={styles.chapterInputWrapper}>
          <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
            Capítulo / Versículo
          </Text>
          <View
            style={[
              styles.chapterInputBox,
              {
                backgroundColor: theme.surfaceSubtle,
                borderColor: theme.borderSubtle,
              },
            ]}
          >
            <TextInput
              style={[styles.chapterInput, { color: theme.textPrimary }]}
              value={chapterText}
              onChangeText={onChangeChapterText}
              placeholder="Ex: 3 ou 3:16"
              placeholderTextColor={theme.textMuted}
              keyboardType="numbers-and-punctuation"
              returnKeyType="search"
              onSubmitEditing={canSubmit ? onSubmit : undefined}
              accessibilityLabel="Número do capítulo ou versículo"
              testID="controlled-chapter-input"
            />
            {chapterText.length > 0 && (
              <Pressable
                onPress={() => onChangeChapterText('')}
                hitSlop={6}
                accessibilityLabel="Limpar capítulo"
              >
                <Feather name="x" size={14} color={theme.textMuted} />
              </Pressable>
            )}
          </View>
        </View>

        <View style={styles.buttonWrapper}>
          <Button
            label={chapterText.trim().length > 0 ? "Ler Texto" : "Ler Livro"}
            onPress={onSubmit}
            disabled={!canSubmit}
            loading={isLoading}
            testID="controlled-search-submit"
          />
        </View>
      </View>

      {/* Modal Deslizante de Seleção */}
      <BookPickerModal
        visible={pickerVisible}
        selectedBookId={selectedBook?.id}
        onSelect={handleBookPicked}
        onClose={handleClosePicker}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fixedTitleBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 3,
    marginBottom: spacing.xs,
    minHeight: 46,
  },
  fixedTitleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  fixedTitleText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  fixedTitleAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  fixedTitleHint: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
  },
  cardContainer: {
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    padding: spacing.sm + 2,
    marginBottom: spacing.xs,
  },
  bookSelectorWrapper: {
    width: '100%',
    marginBottom: spacing.xs + 2,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  chapterInputWrapper: {
    flex: 1,
  },
  buttonWrapper: {
    justifyContent: 'flex-end',
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: typography.fontWeight.medium,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bookTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs + 4,
    minHeight: 44,
  },
  triggerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  bookIcon: {
    fontSize: 14,
  },
  bookTriggerText: {
    fontSize: typography.fontSize.xs + 1,
    flex: 1,
  },
  triggerPressed: {
    opacity: 0.8,
  },
  chapterInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs + 2,
    minHeight: 44,
  },
  chapterInput: {
    flex: 1,
    fontSize: typography.fontSize.xs + 1,
    paddingVertical: 0,
  },
});
