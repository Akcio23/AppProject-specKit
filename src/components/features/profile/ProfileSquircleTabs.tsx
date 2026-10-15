import { memo, useCallback } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/hooks/useTheme';
import { ProfileTabId } from '@/types';
import { spacing, shadows } from '@/constants/theme';

export interface ProfileSquircleTabsProps {
  activeTab: ProfileTabId;
  onSelectTab: (tab: ProfileTabId) => void;
}

interface TabConfig {
  id: ProfileTabId;
  iconName: keyof typeof Feather.glyphMap;
  accessibilityLabel: string;
}

const TABS: TabConfig[] = [
  { id: 'favorites', iconName: 'heart', accessibilityLabel: 'Versículos Favoritos e Salvos' },
  { id: 'settings', iconName: 'sliders', accessibilityLabel: 'Configurações da Conta e Segurança' },
];

export const ProfileSquircleTabs = memo(({
  activeTab,
  onSelectTab,
}: ProfileSquircleTabsProps) => {
  const { theme } = useTheme();

  const handlePress = useCallback((tab: ProfileTabId) => {
    try {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Fallback
    }
    onSelectTab(tab);
  }, [onSelectTab]);

  return (
    <View
      style={styles.container}
      accessibilityRole="tablist"
      accessibilityLabel="Seções do perfil"
    >
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <Pressable
            key={tab.id}
            onPress={() => handlePress(tab.id)}
            accessibilityRole="tab"
            accessibilityLabel={tab.accessibilityLabel}
            accessibilityState={{ selected: isActive }}
            style={({ pressed }) => [
              styles.squircleButton,
              shadows.soft,
              {
                backgroundColor: isActive ? theme.surfaceCard : theme.surfaceSubtle,
                borderColor: isActive ? theme.accent : theme.borderSubtle,
              },
              pressed && { opacity: 0.75 },
            ]}
          >
            <Feather
              name={tab.iconName}
              size={20}
              color={isActive ? theme.accentText || theme.textPrimary : theme.textMuted}
            />
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
    justifyContent: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  squircleButton: {
    width: 78,
    height: 48,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
