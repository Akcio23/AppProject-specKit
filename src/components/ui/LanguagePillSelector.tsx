import { memo, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/hooks/useTheme';
import { usePreferences } from '@/hooks/usePreferences';
import { AppLanguage, LanguageOption } from '@/types';
import { typography, shadows } from '@/constants/theme';

export interface LanguagePillSelectorProps {
  currentLanguage?: AppLanguage;
  onSelectLanguage?: (lang: AppLanguage) => void;
  compact?: boolean;
  showIcon?: boolean;
}

const LANGUAGES: LanguageOption[] = [
  { code: 'pt', label: 'Português', shortLabel: 'PT', defaultTranslationId: 'almeida' },
  { code: 'en', label: 'English', shortLabel: 'EN', defaultTranslationId: 'kjv' },
  { code: 'es', label: 'Español', shortLabel: 'ES', defaultTranslationId: 'valera' },
];

export const LanguagePillSelector = memo(({
  currentLanguage: propCurrentLang,
  onSelectLanguage: propOnSelect,
  compact = false,
  showIcon = true,
}: LanguagePillSelectorProps) => {
  const { theme } = useTheme();
  const { currentLanguage: storeLang, setLanguage: storeSetLanguage } = usePreferences();

  const activeLang = propCurrentLang ?? storeLang;
  const onSelect = propOnSelect ?? storeSetLanguage;

  const handleSelect = useCallback((lang: AppLanguage) => {
    try {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Fallback
    }
    onSelect(lang);
  }, [onSelect]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.surfaceSubtle,
          borderColor: theme.borderSubtle,
        },
        compact && styles.containerCompact,
      ]}
      accessibilityRole="tablist"
      accessibilityLabel="Seletor de idioma do aplicativo"
    >
      {showIcon && (
        <View style={styles.iconContainer}>
          <Feather name="globe" size={compact ? 12 : 14} color={theme.textMuted} />
        </View>
      )}

      {LANGUAGES.map((item) => {
        const isSelected = activeLang === item.code;
        return (
          <Pressable
            key={item.code}
            onPress={() => handleSelect(item.code)}
            accessibilityRole="tab"
            accessibilityLabel={`Mudar idioma para ${item.label}`}
            accessibilityState={{ selected: isSelected }}
            style={({ pressed }) => [
              styles.pillItem,
              compact && styles.pillItemCompact,
              isSelected && [
                styles.pillItemActive,
                shadows.soft,
                {
                  backgroundColor: theme.surfaceCard,
                  borderColor: theme.borderSubtle,
                },
              ],
              pressed && { opacity: 0.75 },
            ]}
          >
            <Text
              style={[
                styles.pillText,
                compact && styles.pillTextCompact,
                {
                  color: isSelected ? theme.textPrimary : theme.textMuted,
                  fontWeight: isSelected ? typography.fontWeight.bold : typography.fontWeight.medium,
                },
              ]}
            >
              {item.shortLabel}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 3,
    borderRadius: 24,
    borderWidth: 1,
    alignSelf: 'center',
  },
  containerCompact: {
    padding: 2,
    borderRadius: 18,
  },
  iconContainer: {
    paddingHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pillItem: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pillItemCompact: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 14,
  },
  pillItemActive: {
    borderWidth: 1,
  },
  pillText: {
    fontSize: typography.fontSize.xs,
    letterSpacing: 0.8,
  },
  pillTextCompact: {
    fontSize: 10,
    letterSpacing: 0.5,
  },
});
