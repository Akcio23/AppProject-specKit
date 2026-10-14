import { memo, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, spacing, borderRadius, typography, shadows } from '@/constants/theme';

export interface TopicTabItem<T extends string> {
  id: T;
  label: string;
  icon?: string;
  badgeCount?: number;
}

interface TopicMenuProps<T extends string> {
  tabs: TopicTabItem<T>[];
  activeTab: T;
  onSelectTab: (tabId: T) => void;
}

function TopicMenuComponent<T extends string>({
  tabs,
  activeTab,
  onSelectTab,
}: TopicMenuProps<T>) {
  const handlePress = useCallback(
    (tabId: T) => {
      try {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {
        // Fallback silencioso
      }
      onSelectTab(tabId);
    },
    [onSelectTab]
  );

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <Pressable
            key={tab.id}
            onPress={() => handlePress(tab.id)}
            style={({ pressed }) => [
              styles.tabItem,
              isActive && styles.tabItemActive,
              pressed && styles.tabItemPressed,
            ]}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
          >
            {tab.icon && (
              <Text style={[styles.tabIcon, isActive && styles.tabIconActive]}>
                {tab.icon}
              </Text>
            )}
            <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
              {tab.label}
            </Text>
            {typeof tab.badgeCount === 'number' && tab.badgeCount > 0 && (
              <View style={[styles.badge, isActive && styles.badgeActive]}>
                <Text style={[styles.badgeText, isActive && styles.badgeTextActive]}>
                  {tab.badgeCount}
                </Text>
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

export const TopicMenu = memo(TopicMenuComponent) as typeof TopicMenuComponent;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'rgba(17, 23, 38, 0.75)',
    borderRadius: borderRadius.full,
    padding: 4,
    borderWidth: 1.2,
    borderColor: colors.borderGlassDark,
    marginBottom: spacing.md,
    ...shadows.soft,
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.xs,
    borderRadius: borderRadius.full,
    gap: 4,
  },
  tabItemActive: {
    backgroundColor: colors.primary,
    ...shadows.glassGlow,
  },
  tabItemPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  tabIcon: {
    fontSize: 14,
  },
  tabIconActive: {
    color: '#080B11',
  },
  tabLabel: {
    fontSize: typography.fontSize.xs + 1,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondaryDark,
  },
  tabLabelActive: {
    color: '#080B11',
    fontWeight: typography.fontWeight.bold,
  },
  badge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: borderRadius.full,
    marginLeft: 2,
  },
  badgeActive: {
    backgroundColor: '#080B11',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
    color: colors.primaryLight,
  },
  badgeTextActive: {
    color: colors.primary,
  },
});
