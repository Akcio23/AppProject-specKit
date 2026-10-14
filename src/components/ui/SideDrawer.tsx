import { memo, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { spacing, borderRadius, typography, shadows } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DRAWER_WIDTH = Math.min(310, Math.floor(SCREEN_WIDTH * 0.82));

export interface DrawerMenuItem {
  id: string;
  label: string;
  icon: string;
  badgeCount?: number;
}

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeId: string;
  onSelectMenu: (id: string) => void;
  onOpenSearch: () => void;
  savedCount?: number;
}

export const SideDrawer = memo(({
  isOpen,
  onClose,
  activeId,
  onSelectMenu,
  onOpenSearch,
  savedCount = 0,
}: SideDrawerProps) => {
  const insets = useSafeAreaInsets();
  const { theme, isDark, toggleTheme } = useTheme();
  const translateX = useRef(new Animated.Value(-DRAWER_WIDTH - 20)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isOpen) {
      try {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {
        // Fallback silencioso
      }

      Animated.parallel([
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
          bounciness: 2,
          speed: 16,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: -DRAWER_WIDTH - 20,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isOpen, translateX, backdropOpacity]);

  const handleClose = useCallback(() => {
    try {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Fallback
    }
    onClose();
  }, [onClose]);

  const handleItemPress = useCallback(
    (id: string) => {
      try {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {
        // Fallback
      }
      onSelectMenu(id);
      onClose();
    },
    [onSelectMenu, onClose]
  );

  const handleSearchPress = useCallback(() => {
    try {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Fallback
    }
    onClose();
    onOpenSearch();
  }, [onClose, onOpenSearch]);

  const menuItems: DrawerMenuItem[] = [
    { id: 'devocional', label: 'Devocional Diário', icon: '🕊️' },
    { id: 'temas', label: 'Temas & Meditações', icon: '✨' },
    {
      id: 'guardados',
      label: 'Versículos Guardados',
      icon: '❤️',
      badgeCount: savedCount > 0 ? savedCount : undefined,
    },
    { id: 'ajustes', label: 'Ajustes & Traduções', icon: '⚙️' },
  ];

  return (
    <View
      pointerEvents={isOpen ? 'auto' : 'none'}
      style={StyleSheet.absoluteFill}
    >
      {/* Backdrop suave */}
      <Animated.View
        style={[
          styles.backdrop,
          {
            opacity: backdropOpacity,
            backgroundColor: isDark ? 'rgba(0, 0, 0, 0.65)' : 'rgba(38, 30, 25, 0.40)',
          },
        ]}
      >
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={handleClose}
          accessibilityLabel="Fechar menu lateral"
        />
      </Animated.View>

      {/* Painel da Navbar lateral clean pastel */}
      <Animated.View
        style={[
          styles.drawerContainer,
          shadows.modal,
          {
            width: DRAWER_WIDTH,
            paddingTop: insets.top + spacing.md,
            paddingBottom: insets.bottom + spacing.md,
            transform: [{ translateX }],
            backgroundColor: theme.surfaceCard,
            borderRightColor: theme.borderSubtle,
          },
        ]}
      >
        <View style={styles.drawerInner}>
          {/* Header da Navbar Lateral */}
          <View style={styles.drawerHeader}>
            <View style={styles.brandRow}>
              <View
                style={[
                  styles.brandBadge,
                  { backgroundColor: theme.accentSoft, borderColor: theme.accent },
                ]}
              >
                <Text style={[styles.brandBadgeIcon, { color: theme.accentText }]}>✝</Text>
              </View>
              <View>
                <Text style={[styles.brandTitle, { color: theme.textPrimary }]}>
                  Bíblia Sagrada
                </Text>
                <Text style={[styles.brandSubtitle, { color: theme.textSecondary }]}>
                  Palavra Viva de Paz
                </Text>
              </View>
            </View>

            <Pressable
              onPress={handleClose}
              style={({ pressed }) => [
                styles.closeBtn,
                { backgroundColor: theme.surfaceSubtle, borderColor: theme.borderSubtle },
                pressed && styles.closeBtnPressed,
              ]}
              accessibilityLabel="Recolher navbar"
            >
              <Text style={[styles.closeBtnText, { color: theme.textSecondary }]}>✕</Text>
            </Pressable>
          </View>

          {/* Toggle de Tema Claro / Escuro Rápido */}
          <Pressable
            onPress={toggleTheme}
            style={({ pressed }) => [
              styles.themeToggleCard,
              {
                backgroundColor: theme.surfaceSubtle,
                borderColor: theme.borderSubtle,
              },
              pressed && styles.cardPressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Alternar tema entre claro e escuro"
          >
            <View style={styles.themeToggleLeft}>
              <Text style={styles.themeToggleIcon}>{isDark ? '🌙' : '☀️'}</Text>
              <View>
                <Text style={[styles.themeToggleTitle, { color: theme.textPrimary }]}>
                  {isDark ? 'Modo Escuro' : 'Modo Claro'}
                </Text>
                <Text style={[styles.themeToggleSubtitle, { color: theme.textMuted }]}>
                  {isDark ? 'Tons aveludados e serenos' : 'Tons claros de linho pastel'}
                </Text>
              </View>
            </View>
            <View
              style={[
                styles.themeSwitchPill,
                { backgroundColor: theme.accentSoft, borderColor: theme.accent },
              ]}
            >
              <Text style={[styles.themeSwitchText, { color: theme.accentText }]}>
                {isDark ? 'Mudar ☀️' : 'Mudar 🌙'}
              </Text>
            </View>
          </Pressable>

          {/* Ação rápida de Busca em destaque */}
          <Pressable
            onPress={handleSearchPress}
            style={({ pressed }) => [
              styles.searchActionCard,
              { backgroundColor: theme.surfaceSubtle, borderColor: theme.borderSubtle },
              pressed && styles.cardPressed,
            ]}
            accessibilityRole="button"
          >
            <Text style={styles.searchActionIcon}>🔍</Text>
            <View style={styles.searchActionTextWrapper}>
              <Text style={[styles.searchActionTitle, { color: theme.textPrimary }]}>
                Buscar na Bíblia
              </Text>
              <Text style={[styles.searchActionSubtitle, { color: theme.textMuted }]}>
                Livro, capítulo ou versículo
              </Text>
            </View>
            <Text style={[styles.searchActionArrow, { color: theme.textSecondary }]}>›</Text>
          </Pressable>

          {/* Separador minimalista */}
          <View style={[styles.divider, { backgroundColor: theme.divider }]} />

          {/* Lista de Navegação Principal */}
          <View style={styles.menuSection}>
            <Text style={[styles.sectionHeading, { color: theme.textMuted }]}>NAVEGAÇÃO</Text>
            {menuItems.map((item) => {
              const isActive = activeId === item.id;
              return (
                <Pressable
                  key={item.id}
                  onPress={() => handleItemPress(item.id)}
                  style={({ pressed }) => [
                    styles.menuItem,
                    isActive && {
                      backgroundColor: theme.surfaceSubtle,
                      borderColor: theme.borderSubtle,
                    },
                    pressed && styles.cardPressed,
                  ]}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: isActive }}
                >
                  <View style={styles.menuItemLeft}>
                    <Text style={styles.menuItemIcon}>{item.icon}</Text>
                    <Text
                      style={[
                        styles.menuItemLabel,
                        { color: isActive ? theme.textPrimary : theme.textSecondary },
                        isActive && styles.menuItemLabelActive,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </View>

                  {typeof item.badgeCount === 'number' && (
                    <View
                      style={[
                        styles.badgeBadge,
                        { backgroundColor: theme.accent },
                      ]}
                    >
                      <Text style={[styles.badgeBadgeText, { color: theme.accentText }]}>
                        {item.badgeCount}
                      </Text>
                    </View>
                  )}

                  {isActive && (
                    <View style={[styles.activeDot, { backgroundColor: theme.accent }]} />
                  )}
                </Pressable>
              );
            })}
          </View>

          {/* Rodapé da Navbar Lateral */}
          <View style={styles.footerSection}>
            <View
              style={[
                styles.devotionalQuoteBox,
                { backgroundColor: theme.surfaceSubtle, borderLeftColor: theme.accent },
              ]}
            >
              <Text style={[styles.quoteText, { color: theme.textSecondary }]}>
                “Lâmpada para os meus pés é tua palavra e luz para o meu caminho.”
              </Text>
              <Text style={[styles.quoteRef, { color: theme.accentText }]}>Salmos 119:105</Text>
            </View>
          </View>
        </View>
      </Animated.View>
    </View>
  );
});

SideDrawer.displayName = 'SideDrawer';

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  drawerContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    borderTopRightRadius: borderRadius.lg,
    borderBottomRightRadius: borderRadius.lg,
    overflow: 'hidden',
    borderRightWidth: 1,
  },
  drawerInner: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: 'space-between',
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: spacing.sm,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
  },
  brandBadge: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandBadgeIcon: {
    fontSize: 16,
    fontWeight: typography.fontWeight.bold,
  },
  brandTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: typography.letterSpacing.tight,
  },
  brandSubtitle: {
    fontSize: 11,
    fontWeight: typography.fontWeight.medium,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnPressed: {
    opacity: 0.7,
  },
  closeBtnText: {
    fontSize: 14,
    fontWeight: typography.fontWeight.bold,
  },
  themeToggleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginTop: spacing.sm,
  },
  themeToggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  themeToggleIcon: {
    fontSize: 18,
  },
  themeToggleTitle: {
    fontSize: typography.fontSize.xs + 2,
    fontWeight: typography.fontWeight.semibold,
  },
  themeToggleSubtitle: {
    fontSize: 10,
  },
  themeSwitchPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  themeSwitchText: {
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
  },
  searchActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginTop: spacing.sm,
  },
  searchActionIcon: {
    fontSize: 16,
    marginRight: spacing.sm,
  },
  searchActionTextWrapper: {
    flex: 1,
  },
  searchActionTitle: {
    fontSize: typography.fontSize.xs + 2,
    fontWeight: typography.fontWeight.semibold,
  },
  searchActionSubtitle: {
    fontSize: 10,
  },
  searchActionArrow: {
    fontSize: 18,
  },
  cardPressed: {
    opacity: 0.85,
  },
  divider: {
    height: 1,
    marginVertical: spacing.sm,
  },
  menuSection: {
    flex: 1,
    gap: spacing.xs,
  },
  sectionHeading: {
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: typography.letterSpacing.extraWide,
    marginBottom: spacing.xs,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
  },
  menuItemIcon: {
    fontSize: 16,
  },
  menuItemLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  menuItemLabelActive: {
    fontWeight: typography.fontWeight.bold,
  },
  badgeBadge: {
    paddingHorizontal: 7,
    paddingVertical: 1,
    borderRadius: borderRadius.full,
  },
  badgeBadgeText: {
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: borderRadius.full,
  },
  footerSection: {
    paddingTop: spacing.xs,
  },
  devotionalQuoteBox: {
    padding: spacing.md,
    borderRadius: borderRadius.sm,
    borderLeftWidth: 3,
  },
  quoteText: {
    fontSize: 11,
    fontStyle: 'italic',
    lineHeight: 16,
    marginBottom: 4,
  },
  quoteRef: {
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
  },
});
