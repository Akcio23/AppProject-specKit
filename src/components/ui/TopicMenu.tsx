import { memo, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { spacing, borderRadius, typography, shadows } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';

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
  const { theme } = useTheme();

  const handlePress = useCallback(
    (tabId: T) => {
      try {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {
        // Fallback
      }
      onSelectTab(tabId);
    },
    [onSelectTab]
  );

  return (
    <View
      style={[
        styles.container,
        shadows.soft,
        {
          backgroundColor: theme.surfaceSubtle,
          borderColor: theme.borderSubtle,
        },
      ]}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <Pressable
            key={tab.id}
            onPress={() => handlePress(tab.id)}
            style={({ pressed }) => [
              styles.tabItem,
              isActive && { backgroundColor: theme.surfaceCard },
              pressed && styles.tabItemPressed,
            ]}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
          >
            {tab.icon && (
              <Text style={styles.tabIcon}>{tab.icon}</Text>
            )}
            <Text
              style={[
                styles.tabLabel,
                { color: isActive ? theme.textPrimary : theme.textSecondary },
                isActive && styles.tabLabelActive,
              ]}
            >
              {tab.label}
            </Text>
            {typeof tab.badgeCount === 'number' && tab.badgeCount > 0 && (
              <View
                style={[
                  styles.badge,
                  { backgroundColor: isActive ? theme.accent : theme.border },
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    { color: isActive ? theme.accentText : theme.textPrimary },
                  ]}
                >
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
    borderRadius: borderRadius.full,
    padding: 3,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderRadius: borderRadius.full,
    gap: 4,
  },
  tabItemPressed: {
    opacity: 0.85,
  },
  tabIcon: {
    fontSize: 13,
  },
  tabLabel: {
    fontSize: typography.fontSize.xs + 1,
    fontWeight: typography.fontWeight.medium,
  },
  tabLabelActive: {
    fontWeight: typography.fontWeight.bold,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: borderRadius.full,
    marginLeft: 2,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
  },
});
