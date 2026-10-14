import { memo, useCallback } from 'react';
import { FlatList, ListRenderItem, Pressable, StyleSheet, Text } from 'react-native';
import { Translation } from '@/types/bible';
import { spacing, typography, borderRadius } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';

interface Props {
  translations: Translation[];
  selectedId: string;
  onSelect: (translationId: string) => void;
}

interface ChipProps {
  translation: Translation;
  selected: boolean;
  onSelect: (translationId: string) => void;
  accentSoft: string;
  accent: string;
  accentText: string;
  surfaceSubtle: string;
  borderSubtle: string;
  textPrimary: string;
  textMuted: string;
}

const TranslationChip = memo(({
  translation,
  selected,
  onSelect,
  accentSoft,
  accent,
  accentText,
  surfaceSubtle,
  borderSubtle,
  textPrimary,
  textMuted,
}: ChipProps) => {
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
        {
          backgroundColor: selected ? accentSoft : surfaceSubtle,
          borderColor: selected ? accent : borderSubtle,
        },
        pressed && styles.chipPressed,
      ]}
    >
      <Text
        style={[
          styles.chipId,
          { color: selected ? accentText : textPrimary },
        ]}
      >
        {translation.id.toUpperCase()}
      </Text>
      <Text
        style={[
          styles.chipLang,
          { color: selected ? accentText : textMuted },
        ]}
      >
        {translation.language}
      </Text>
    </Pressable>
  );
});
TranslationChip.displayName = 'TranslationChip';

const keyExtractor = (t: Translation): string => t.id;

/** Seletor horizontal de traduções em formato de chips limpos. */
export const TranslationPicker = memo(({ translations, selectedId, onSelect }: Props) => {
  const { theme } = useTheme();

  const renderItem: ListRenderItem<Translation> = useCallback(
    ({ item }) => (
      <TranslationChip
        translation={item}
        selected={item.id === selectedId}
        onSelect={onSelect}
        accentSoft={theme.accentSoft}
        accent={theme.accent}
        accentText={theme.accentText}
        surfaceSubtle={theme.surfaceSubtle}
        borderSubtle={theme.borderSubtle}
        textPrimary={theme.textPrimary}
        textMuted={theme.textMuted}
      />
    ),
    [selectedId, onSelect, theme],
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
    borderWidth: 1,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: spacing.xs + 2,
    alignItems: 'center',
  },
  chipPressed: {
    opacity: 0.8,
  },
  chipId: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  chipLang: {
    fontSize: 10,
  },
});
