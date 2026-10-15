import { memo, useCallback } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/hooks/useTheme';
import { BottomNavRoute } from '@/types';
import { spacing, shadows } from '@/constants/theme';

export interface CurvedBottomNavProps {
  activeRoute?: BottomNavRoute;
  onSelectRoute?: (route: BottomNavRoute) => void;
  onPressHome?: () => void;
  onPressSearch?: () => void;
  onPressCreate?: () => void;
  onPressInbox?: () => void;
  onPressProfile?: () => void;
}

interface NavItemConfig {
  route: BottomNavRoute;
  iconName: keyof typeof Feather.glyphMap;
  accessibilityLabel: string;
}

const NAV_ITEMS: NavItemConfig[] = [
  { route: 'home', iconName: 'home', accessibilityLabel: 'Início' },
  { route: 'search', iconName: 'search', accessibilityLabel: 'Buscar' },
  { route: 'create', iconName: 'plus', accessibilityLabel: 'Criar ou Adicionar' },
  { route: 'inbox', iconName: 'mail', accessibilityLabel: 'Mensagens ou Devocionais' },
  { route: 'profile', iconName: 'user', accessibilityLabel: 'Meu Perfil' },
];

export const CurvedBottomNav = memo(({
  activeRoute = 'profile',
  onSelectRoute,
  onPressHome,
  onPressSearch,
  onPressCreate,
  onPressInbox,
  onPressProfile,
}: CurvedBottomNavProps) => {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();

  const handlePress = useCallback((route: BottomNavRoute) => {
    try {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Fallback
    }

    onSelectRoute?.(route);

    if (route === 'home') onPressHome?.();
    if (route === 'search') onPressSearch?.();
    if (route === 'create') onPressCreate?.();
    if (route === 'inbox') onPressInbox?.();
    if (route === 'profile') onPressProfile?.();
  }, [onSelectRoute, onPressHome, onPressSearch, onPressCreate, onPressInbox, onPressProfile]);

  // Cor de fundo do rodapé: conforme modelo, uma cor escura elegante e imersiva
  const navBg = isDark ? '#161412' : '#23201D';
  const iconActiveColor = '#FFFFFF';
  const iconInactiveColor = isDark ? '#8A8179' : '#A3998F';

  return (
    <View
      style={[
        styles.container,
        shadows.modal,
        {
          backgroundColor: navBg,
          paddingBottom: Math.max(insets.bottom, spacing.sm),
        },
      ]}
      accessibilityRole="tablist"
      accessibilityLabel="Barra de navegação inferior"
    >
      <View style={styles.contentRow}>
        {NAV_ITEMS.map((item) => {
          const isActive = activeRoute === item.route;
          return (
            <Pressable
              key={item.route}
              onPress={() => handlePress(item.route)}
              accessibilityRole="tab"
              accessibilityLabel={item.accessibilityLabel}
              accessibilityState={{ selected: isActive }}
              style={({ pressed }) => [
                styles.navButton,
                pressed && { opacity: 0.7 },
              ]}
            >
              <Feather
                name={item.iconName}
                size={item.route === 'create' ? 24 : 20}
                color={isActive ? iconActiveColor : iconInactiveColor}
              />
              {isActive && (
                <View style={styles.activeDot} />
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 12,
    paddingHorizontal: spacing.md,
    position: 'relative',
    width: '100%',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 48,
  },
  navButton: {
    flex: 1,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  activeDot: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
});
