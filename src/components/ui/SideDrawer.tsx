import { memo, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { colors, spacing, borderRadius, typography, shadows } from '@/constants/theme';

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
          bounciness: 3,
          speed: 15,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: -DRAWER_WIDTH - 20,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 200,
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
    { id: 'devocional', label: 'Santuário Devocional', icon: '🕊️' },
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
      {/* Backdrop escurecido translúcido */}
      <Animated.View
        style={[
          styles.backdrop,
          {
            opacity: backdropOpacity,
          },
        ]}
      >
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={handleClose}
          accessibilityLabel="Fechar menu lateral"
        />
      </Animated.View>

      {/* Painel da Navbar lateral retrátil */}
      <Animated.View
        style={[
          styles.drawerContainer,
          {
            width: DRAWER_WIDTH,
            paddingTop: insets.top + spacing.md,
            paddingBottom: insets.bottom + spacing.md,
            transform: [{ translateX }],
          },
        ]}
      >
        <BlurView
          intensity={65}
          tint="dark"
          style={styles.blurWrap}
        >
          <View style={styles.drawerInner}>
            {/* Header da Navbar Lateral */}
            <View style={styles.drawerHeader}>
              <View style={styles.brandRow}>
                <View style={styles.brandBadge}>
                  <Text style={styles.brandBadgeIcon}>✝</Text>
                </View>
                <View>
                  <Text style={styles.brandTitle}>Bíblia Sagrada</Text>
                  <Text style={styles.brandSubtitle}>Pão Diário da Palavra</Text>
                </View>
              </View>

              <Pressable
                onPress={handleClose}
                style={({ pressed }) => [
                  styles.closeBtn,
                  pressed && styles.closeBtnPressed,
                ]}
                accessibilityLabel="Recolher navbar"
              >
                <Text style={styles.closeBtnText}>‹</Text>
              </Pressable>
            </View>

            {/* Ação rápida de Busca em destaque */}
            <Pressable
              onPress={handleSearchPress}
              style={({ pressed }) => [
                styles.searchActionCard,
                pressed && styles.searchActionCardPressed,
              ]}
              accessibilityRole="button"
            >
              <Text style={styles.searchActionIcon}>🔍</Text>
              <View style={styles.searchActionTextWrapper}>
                <Text style={styles.searchActionTitle}>Buscar na Bíblia</Text>
                <Text style={styles.searchActionSubtitle}>Livro, capítulo ou versículo</Text>
              </View>
              <Text style={styles.searchActionArrow}>›</Text>
            </Pressable>

            {/* Separador sutil */}
            <View style={styles.divider} />

            {/* Lista de Navegação Principal */}
            <View style={styles.menuSection}>
              <Text style={styles.sectionHeading}>NAVEGAÇÃO</Text>
              {menuItems.map((item) => {
                const isActive = activeId === item.id;
                return (
                  <Pressable
                    key={item.id}
                    onPress={() => handleItemPress(item.id)}
                    style={({ pressed }) => [
                      styles.menuItem,
                      isActive && styles.menuItemActive,
                      pressed && styles.menuItemPressed,
                    ]}
                    accessibilityRole="tab"
                    accessibilityState={{ selected: isActive }}
                  >
                    <View style={styles.menuItemLeft}>
                      <Text style={styles.menuItemIcon}>{item.icon}</Text>
                      <Text
                        style={[
                          styles.menuItemLabel,
                          isActive && styles.menuItemLabelActive,
                        ]}
                      >
                        {item.label}
                      </Text>
                    </View>

                    {typeof item.badgeCount === 'number' && (
                      <View style={styles.badgeBadge}>
                        <Text style={styles.badgeBadgeText}>{item.badgeCount}</Text>
                      </View>
                    )}

                    {isActive && <View style={styles.activeDot} />}
                  </Pressable>
                );
              })}
            </View>

            {/* Rodapé da Navbar Lateral */}
            <View style={styles.footerSection}>
              <View style={styles.devotionalQuoteBox}>
                <Text style={styles.quoteText}>
                  “Lâmpada para os meus pés é tua palavra e luz, para o meu caminho.”
                </Text>
                <Text style={styles.quoteRef}>Salmos 119:105</Text>
              </View>

              <Pressable
                onPress={handleClose}
                style={({ pressed }) => [
                  styles.collapseFooterBtn,
                  pressed && styles.collapseFooterBtnPressed,
                ]}
              >
                <Text style={styles.collapseFooterText}>‹ Recolher Navbar</Text>
              </Pressable>
            </View>
          </View>
        </BlurView>
      </Animated.View>
    </View>
  );
});

SideDrawer.displayName = 'SideDrawer';

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(4, 6, 12, 0.70)',
  },
  drawerContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    borderTopRightRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
    overflow: 'hidden',
    borderRightWidth: 1.2,
    borderRightColor: colors.borderGlassDark,
    ...shadows.modal,
    backgroundColor: Platform.OS === 'android' ? 'rgba(12, 16, 26, 0.97)' : 'transparent',
  },
  blurWrap: {
    flex: 1,
    width: '100%',
  },
  drawerInner: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(12, 16, 26, 0.55)',
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: spacing.md,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
  },
  brandBadge: {
    width: 38,
    height: 38,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    borderWidth: 1.2,
    borderColor: colors.borderGold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandBadgeIcon: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: typography.fontWeight.bold,
  },
  brandTitle: {
    fontSize: typography.fontSize.md + 1,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: typography.letterSpacing.tight,
    color: colors.textPrimaryDark,
  },
  brandSubtitle: {
    fontSize: 11,
    color: colors.textSecondaryDark,
    fontWeight: typography.fontWeight.medium,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: colors.borderGlassDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnPressed: {
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    transform: [{ scale: 0.92 }],
  },
  closeBtnText: {
    fontSize: 24,
    color: colors.primary,
    fontWeight: typography.fontWeight.bold,
    lineHeight: 26,
    marginTop: -2,
  },
  searchActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(212, 175, 55, 0.10)',
    borderWidth: 1.2,
    borderColor: colors.borderGold,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginVertical: spacing.xs,
  },
  searchActionCardPressed: {
    backgroundColor: 'rgba(212, 175, 55, 0.18)',
    transform: [{ scale: 0.98 }],
  },
  searchActionIcon: {
    fontSize: 20,
    marginRight: spacing.sm,
  },
  searchActionTextWrapper: {
    flex: 1,
  },
  searchActionTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  searchActionSubtitle: {
    fontSize: 11,
    color: colors.textSecondaryDark,
    marginTop: 1,
  },
  searchActionArrow: {
    fontSize: 20,
    color: colors.primary,
    fontWeight: typography.fontWeight.bold,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderGlassDark,
    marginVertical: spacing.md,
  },
  menuSection: {
    flex: 1,
  },
  sectionHeading: {
    fontSize: 10,
    letterSpacing: typography.letterSpacing.extraWide,
    color: colors.textMutedDark,
    fontWeight: typography.fontWeight.heavy,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.xs + 2,
    backgroundColor: 'transparent',
  },
  menuItemActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: colors.borderGlassDark,
  },
  menuItemPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
  },
  menuItemIcon: {
    fontSize: 18,
  },
  menuItemLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondaryDark,
  },
  menuItemLabelActive: {
    color: colors.textPrimaryDark,
    fontWeight: typography.fontWeight.bold,
  },
  badgeBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  badgeBadgeText: {
    fontSize: 10,
    color: '#080B11',
    fontWeight: typography.fontWeight.heavy,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
  },
  footerSection: {
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderGlassDark,
  },
  devotionalQuoteBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: borderRadius.md,
    padding: spacing.sm + 2,
    marginBottom: spacing.md,
    borderLeftWidth: 2,
    borderLeftColor: colors.primary,
  },
  quoteText: {
    fontSize: 11,
    fontStyle: 'italic',
    color: colors.textMutedDark,
    lineHeight: 16,
  },
  quoteRef: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: typography.fontWeight.bold,
    marginTop: 4,
  },
  collapseFooterBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
  },
  collapseFooterBtnPressed: {
    opacity: 0.7,
  },
  collapseFooterText: {
    fontSize: typography.fontSize.xs,
    color: colors.textMutedDark,
    fontWeight: typography.fontWeight.semibold,
  },
});
