import { useState, useCallback } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { BibleBook, BIBLE_BOOKS_PT } from '@/constants/bibleBooksPt';
import { borderRadius, spacing, typography } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui';
import { BookPickerModal } from './BookPickerModal';

export interface ControlledBibleSearchProps {
  selectedBook: BibleBook | null;
  chapterText: string;
  onSelectBook: (book: BibleBook) => void;
  onChangeChapterText: (text: string) => void;
  onSubmit: () => void;
  onClear?: () => void;
  isLoading?: boolean;
}

export function ControlledBibleSearch({
  selectedBook,
  chapterText,
  onSelectBook,
  onChangeChapterText,
  onSubmit,
  onClear,
  isLoading = false,
}: ControlledBibleSearchProps) {
  const { theme } = useTheme();
  const [pickerVisible, setPickerVisible] = useState(false);

  const handleOpenPicker = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPickerVisible(true);
  }, []);

  const handleClosePicker = useCallback(() => {
    setPickerVisible(false);
  }, []);

  const handleBookPicked = useCallback(
    (book: BibleBook) => {
      onSelectBook(book);
    },
    [onSelectBook],
  );

  const canSubmit = Boolean(selectedBook && chapterText.trim().length > 0);

  const referencePreview = selectedBook
    ? `${selectedBook.name} ${chapterText.trim()}`
    : '';

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
      <View style={styles.inputsRow}>
        {/* Seletor de Livro Pré-definido */}
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

        {/* Entrada Livre de Capítulo / Versículo */}
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
      </View>

      {/* Atalhos Rápidos de Livros Populares */}
      <View style={styles.quickBooksRow}>
        <Text style={[styles.quickBooksLabel, { color: theme.textMuted }]}>
          Livros Populares:
        </Text>
        <View style={styles.quickBooksList}>
          {['Salmos', 'João', 'Mateus', 'Romanos', 'Gênesis'].map((bookName) => {
            const isSelected = selectedBook?.name === bookName;
            return (
              <Pressable
                key={bookName}
                onPress={() => {
                  void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  const found = BIBLE_BOOKS_PT.find((b) => b.name === bookName);
                  if (found) onSelectBook(found);
                }}
                style={[
                  styles.quickBookChip,
                  {
                    backgroundColor: isSelected
                      ? theme.accent
                      : theme.surfaceSubtle,
                    borderColor: isSelected
                      ? theme.accent
                      : theme.borderSubtle,
                  },
                ]}
                accessibilityRole="button"
                accessibilityLabel={`Selecionar ${bookName}`}
              >
                <Text
                  style={[
                    styles.quickBookText,
                    {
                      color: isSelected
                        ? theme.textPrimary
                        : theme.textSecondary,
                      fontWeight: isSelected
                        ? typography.fontWeight.bold
                        : typography.fontWeight.medium,
                    },
                  ]}
                >
                  {bookName}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Barra de Resumo & Preview da Referência */}
      <View style={styles.footerRow}>
        <View style={styles.previewContainer}>
          {selectedBook ? (
            <View style={styles.previewActive}>
              <Text style={[styles.previewLabel, { color: theme.textMuted }]}>
                Consulta:
              </Text>
              <View
                style={[
                  styles.previewPill,
                  {
                    backgroundColor: theme.surfaceSubtle,
                    borderColor: theme.borderSubtle,
                  },
                ]}
              >
                <Text
                  style={[styles.previewText, { color: theme.textPrimary }]}
                  numberOfLines={1}
                >
                  {referencePreview || `${selectedBook.name} (informe o capítulo)`}
                </Text>
              </View>
            </View>
          ) : (
            <Text style={[styles.hintText, { color: theme.textMuted }]}>
              Selecione o livro acima para começar 👆
            </Text>
          )}
        </View>

        <View style={styles.actionsContainer}>
          {selectedBook && onClear && (
            <Pressable
              onPress={onClear}
              style={({ pressed }) => [
                styles.clearButton,
                pressed && styles.triggerPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Limpar seleção"
            >
              <Text style={[styles.clearText, { color: theme.textMuted }]}>
                Limpar
              </Text>
            </Pressable>
          )}

          <Button
            label="Ler Texto"
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
  cardContainer: {
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    padding: spacing.sm + 2,
    marginBottom: spacing.xs,
  },
  inputsRow: {
    flexDirection: 'row',
    gap: spacing.xs + 2,
    alignItems: 'flex-start',
  },
  bookSelectorWrapper: {
    flex: 1.3,
  },
  chapterInputWrapper: {
    flex: 1,
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
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
    paddingTop: spacing.xs,
    gap: spacing.sm,
  },
  previewContainer: {
    flex: 1,
  },
  previewActive: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  previewLabel: {
    fontSize: 11,
  },
  previewPill: {
    borderWidth: 1,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.xs + 4,
    paddingVertical: 2,
  },
  previewText: {
    fontSize: 11,
    fontWeight: typography.fontWeight.semibold,
  },
  hintText: {
    fontSize: 11,
    fontStyle: 'italic',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
  },
  clearButton: {
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
  },
  clearText: {
    fontSize: typography.fontSize.xs,
  },
  quickBooksRow: {
    marginTop: spacing.xs + 2,
    paddingTop: spacing.xs,
    gap: 4,
  },
  quickBooksLabel: {
    fontSize: 10,
    fontWeight: typography.fontWeight.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  quickBooksList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 2,
  },
  quickBookChip: {
    borderWidth: 1,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.xs + 4,
    paddingVertical: 3,
  },
  quickBookText: {
    fontSize: 11,
  },
});
