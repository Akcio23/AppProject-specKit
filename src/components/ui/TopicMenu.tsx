import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors, spacing, borderRadius, typography } from '@/constants/theme';

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

export function TopicMenu<T extends string>({
  tabs,
  activeTab,
  onSelectTab,
}: TopicMenuProps<T>) {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <Pressable
            key={tab.id}
            onPress={() => onSelectTab(tab.id)}
            style={({ pressed }) => [
              styles.tabItem,
              isActive ? styles.tabItemActive : null,
              pressed ? styles.tabItemPressed : null,
            ]}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
          >
            {tab.icon && (
              <Text style={[styles.tabIcon, isActive ? styles.tabIconActive : null]}>
                {tab.icon}
              </Text>
            )}
            <Text style={[styles.tabLabel, isActive ? styles.tabLabelActive : null]}>
              {tab.label}
            </Text>
            {typeof tab.badgeCount === 'number' && tab.badgeCount > 0 && (
              <View style={[styles.badge, isActive ? styles.badgeActive : null]}>
                <Text style={[styles.badgeText, isActive ? styles.badgeTextActive : null]}>
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

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceDark,
    borderRadius: borderRadius.full,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.borderDark,
    marginBottom: spacing.md,
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
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  tabItemPressed: {
    opacity: 0.85,
  },
  tabIcon: {
    fontSize: 14,
  },
  tabIconActive: {
    color: '#0F172A',
  },
  tabLabel: {
    fontSize: typography.fontSize.xs + 1,
    fontWeight: typography.fontWeight.medium,
    color: colors.textMutedDark,
  },
  tabLabelActive: {
    color: '#0F172A',
    fontWeight: typography.fontWeight.bold,
  },
  badge: {
    backgroundColor: colors.surfaceSubtleDark,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: borderRadius.full,
    marginLeft: 2,
  },
  badgeActive: {
    backgroundColor: '#0F172A',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  badgeTextActive: {
    color: colors.primaryLight,
  },
});
