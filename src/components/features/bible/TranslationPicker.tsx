import { memo, useCallback } from 'react';
import { FlatList, ListRenderItem, Pressable, StyleSheet, Text } from 'react-native';
import { Translation } from '@/types/bible';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';

interface Props {
  translations: Translation[];
  selectedId: string;
  onSelect: (translationId: string) => void;
}

interface ChipProps {
  translation: Translation;
  selected: boolean;
  onSelect: (translationId: string) => void;
}

const TranslationChip = memo(({ translation, selected, onSelect }: ChipProps) => {
  const handlePress = useCallback(() => onSelect(translation.id), [onSelect, translation.id]);

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={`${translation.name} (${translation.language})`}
      testID={`translation-chip-${translation.id}`}
      style={({ pressed }) => [
        styles.chip,
        selected ? styles.chipSelected : null,
        pressed ? styles.chipPressed : null,
      ]}
    >
      <Text style={[styles.chipId, selected ? styles.chipTextSelected : null]}>
        {translation.id.toUpperCase()}
      </Text>
      <Text style={[styles.chipLang, selected ? styles.chipTextSelected : null]}>
        {translation.language}
      </Text>
    </Pressable>
  );
});
TranslationChip.displayName = 'TranslationChip';

const keyExtractor = (t: Translation): string => t.id;

/** P3 — Seletor horizontal de traduções. */
export const TranslationPicker = memo(({ translations, selectedId, onSelect }: Props) => {
  const renderItem: ListRenderItem<Translation> = useCallback(
    ({ item }) => (
      <TranslationChip translation={item} selected={item.id === selectedId} onSelect={onSelect} />
    ),
    [selectedId, onSelect],
  );

  return (
    <FlatList
      horizontal
      data={translations}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      extraData={selectedId}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.list}
    />
  );
});

TranslationPicker.displayName = 'TranslationPicker';

const styles = StyleSheet.create({
  list: {
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  chip: {
    backgroundColor: colors.surfaceSubtleDark,
    borderColor: colors.borderDark,
    borderWidth: 1,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: spacing.xs + 2,
    alignItems: 'center',
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryLight,
  },
  chipPressed: {
    opacity: 0.8,
  },
  chipId: {
    color: colors.textPrimaryDark,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  chipLang: {
    color: colors.textMutedDark,
    fontSize: 10,
  },
  chipTextSelected: {
    color: '#0F172A',
  },
});
