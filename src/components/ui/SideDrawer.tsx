import { memo, useEffect, useRef, useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { spacing, borderRadius, typography, shadows } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { useSessionStore } from '@/stores/useSessionStore';
import { Avatar } from './Avatar';
import { ThemePillSwitch } from './ThemePillSwitch';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const EXPANDED_DRAWER_WIDTH = Math.min(300, Math.floor(SCREEN_WIDTH * 0.82));
const COLLAPSED_DRAWER_WIDTH = 76;

export type SidebarVariant = 'expanded' | 'collapsed';

export interface DrawerMenuItem {
  id: string;
  label: string;
  iconName: keyof typeof Feather.glyphMap;
  badgeCount?: number;
}

export interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeId: string;
  onSelectMenu: (id: string) => void;
  onOpenSearch: () => void;
  onPressSignIn?: () => void;
  onPressSignUp?: () => void;
  onPressProfile?: () => void;
  savedCount?: number;
  variant?: SidebarVariant;
  onToggleVariant?: () => void;
}

export const SideDrawer = memo(({
  isOpen,
  onClose,
  activeId,
  onSelectMenu,
  onOpenSearch,
  onPressSignIn,
  onPressSignUp,
  onPressProfile,
  savedCount = 0,
  variant: propVariant,
  onToggleVariant,
}: SideDrawerProps) => {
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useTheme();
  const { status, user, signOut } = useSessionStore();

  const [internalVariant, setInternalVariant] = useState<SidebarVariant>('expanded');
  const activeVariant = propVariant || internalVariant;
  const isCollapsed = activeVariant === 'collapsed';

  const currentWidth = isCollapsed ? COLLAPSED_DRAWER_WIDTH : EXPANDED_DRAWER_WIDTH;

  const translateX = useRef(new Animated.Value(-EXPANDED_DRAWER_WIDTH - 20)).current;
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
          toValue: -EXPANDED_DRAWER_WIDTH - 20,
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

  const handleToggleVariantInternal = useCallback(() => {
    try {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Fallback
    }
    if (onToggleVariant) {
      onToggleVariant();
    } else {
      setInternalVariant((prev) => (prev === 'expanded' ? 'collapsed' : 'expanded'));
    }
  }, [onToggleVariant]);

  // Itens de navegação sem o Dashboard, com ícones renovados (book-open, compass, bookmark)
  const menuItems: DrawerMenuItem[] = [
    { id: 'devocional', label: 'Devocional Diário', iconName: 'book-open' },
    { id: 'temas', label: 'Temas & Meditações', iconName: 'compass' },
    {
      id: 'guardados',
      label: 'Versículos Guardados',
      iconName: 'bookmark',
      badgeCount: savedCount > 0 ? savedCount : undefined,
    },
  ];

  const isAuthenticated = status === 'authenticated' && !!user;

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

      {/* Painel da Sidebar com estrutura Duck UI e paleta Clean Pastel */}
      <Animated.View
        style={[
          styles.drawerContainer,
          shadows.modal,
          {
            width: currentWidth,
            paddingTop: insets.top + spacing.md,
            paddingBottom: insets.bottom + spacing.md,
            transform: [{ translateX }],
            backgroundColor: theme.surfaceCard,
            borderRightColor: theme.borderSubtle,
          },
        ]}
      >
        <View style={[styles.drawerInner, isCollapsed && styles.drawerInnerCollapsed]}>
          {/* Header da Sidebar (Exibindo apenas Nome e Foto, sem e-mail) */}
          <View style={[styles.headerRow, isCollapsed && styles.headerRowCollapsed]}>
            <Pressable
              onPress={isAuthenticated ? () => { handleClose(); onPressProfile?.(); } : handleToggleVariantInternal}
              style={({ pressed }) => [
                styles.brandLogoBox,
                pressed && { opacity: 0.8 },
              ]}
              accessibilityLabel="Perfil ou alternar modo do menu"
            >
              {isAuthenticated && user ? (
                <Avatar name={user.name} photoUrl={user.photoUrl} size="md" />
              ) : (
                <View
                  style={[
                    styles.logoBadge,
                    { backgroundColor: theme.accentSoft, borderColor: theme.accent },
                  ]}
                >
                  <Text style={[styles.logoIconText, { color: theme.accentText }]}>✝</Text>
                </View>
              )}
            </Pressable>

            {!isCollapsed && (
              <Pressable
                onPress={isAuthenticated ? () => { handleClose(); onPressProfile?.(); } : undefined}
                style={styles.headerInfo}
              >
                <Text style={[styles.headerTitle, { color: theme.textPrimary }]} numberOfLines={1}>
                  {isAuthenticated && user ? user.name : 'Bíblia Sagrada'}
                </Text>
              </Pressable>
            )}

            {!isCollapsed && (
              <Pressable
                onPress={handleClose}
                style={({ pressed }) => [
                  styles.closeBtn,
                  { backgroundColor: theme.surfaceSubtle, borderColor: theme.borderSubtle },
                  pressed && { opacity: 0.7 },
                ]}
                accessibilityLabel="Fechar menu lateral"
              >
                <Feather name="x" size={16} color={theme.textSecondary} />
              </Pressable>
            )}
          </View>

          {/* Barra de Busca em formato Pílula / Botão Compacto */}
          <Pressable
            onPress={handleSearchPress}
            style={({ pressed }) => [
              isCollapsed ? styles.searchBoxCollapsed : styles.searchBoxExpanded,
              {
                backgroundColor: theme.surfaceSubtle,
                borderColor: theme.borderSubtle,
              },
              pressed && styles.cardPressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Buscar na Bíblia"
          >
            <Feather name="search" size={17} color={theme.textMuted} />
            {!isCollapsed && (
              <Text style={[styles.searchPlaceholder, { color: theme.textMuted }]}>
                Procurar...
              </Text>
            )}
          </Pressable>

          {/* Lista Vertical de Itens de Navegação */}
          <View style={styles.menuList}>
            {menuItems.map((item) => {
              const isActive = activeId === item.id;
              const hasBadge = typeof item.badgeCount === 'number' && item.badgeCount > 0;

              return (
                <Pressable
                  key={item.id}
                  onPress={() => handleItemPress(item.id)}
                  style={({ pressed }) => [
                    isCollapsed ? styles.menuItemCollapsed : styles.menuItemExpanded,
                    isActive && {
                      backgroundColor: theme.surfaceSubtle,
                      borderColor: theme.borderSubtle,
                    },
                    pressed && styles.cardPressed,
                  ]}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: isActive }}
                  accessibilityLabel={item.label}
                >
                  <View style={styles.menuItemContent}>
                    <Feather
                      name={item.iconName}
                      size={18}
                      color={isActive ? theme.textPrimary : theme.textSecondary}
                    />
                    {!isCollapsed && (
                      <Text
                        style={[
                          styles.menuItemLabel,
                          { color: isActive ? theme.textPrimary : theme.textSecondary },
                          isActive && styles.menuItemLabelActive,
                        ]}
                      >
                        {item.label}
                      </Text>
                    )}
                  </View>

                  {/* Badge de versículos guardados com UX elegante */}
                  {!isCollapsed && hasBadge && (
                    <View
                      style={[
                        styles.badgePill,
                        {
                          backgroundColor: theme.accentSoft,
                          borderColor: theme.accent,
                        },
                      ]}
                    >
                      <Feather name="bookmark" size={10} color={theme.accentText} style={{ marginRight: 3 }} />
                      <Text style={[styles.badgePillText, { color: theme.accentText }]}>
                        {item.badgeCount}
                      </Text>
                    </View>
                  )}

                  {/* Indicador sutil para modo rail compacto */}
                  {isCollapsed && hasBadge && (
                    <View
                      style={[
                        styles.collapsedBadgeDot,
                        { backgroundColor: theme.accent, borderColor: theme.surfaceCard },
                      ]}
                    />
                  )}
                </Pressable>
              );
            })}
          </View>

          {/* Rodapé Fixo no Estilo Duck UI */}
          <View style={styles.footer}>
            <View style={[styles.divider, { backgroundColor: theme.divider }]} />

            {/* Botão de Configurações do Perfil (no rodapé, perto do logout e tema) */}
            {isAuthenticated && (
              <Pressable
                onPress={() => {
                  try {
                    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  } catch {
                    // Fallback
                  }
                  handleClose();
                  onPressProfile?.();
                }}
                style={({ pressed }) => [
                  isCollapsed ? styles.actionRowCollapsed : styles.actionRowExpanded,
                  pressed && { opacity: 0.7 },
                ]}
                accessibilityRole="button"
                accessibilityLabel="Abrir configurações do perfil"
              >
                <Feather name="settings" size={18} color={theme.textPrimary} />
                {!isCollapsed && (
                  <View style={styles.profileActionContent}>
                    <Text style={[styles.actionLabel, { color: theme.textPrimary }]}>
                      Configurações do Perfil
                    </Text>
                    <Feather name="chevron-right" size={14} color={theme.textMuted} />
                  </View>
                )}
              </Pressable>
            )}

            {/* Ação de Logout ou Login/Cadastro */}
            {isAuthenticated ? (
              <Pressable
                onPress={() => {
                  try {
                    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  } catch {
                    // Fallback
                  }
                  void signOut();
                }}
                style={({ pressed }) => [
                  isCollapsed ? styles.actionRowCollapsed : styles.actionRowExpanded,
                  pressed && { opacity: 0.7 },
                ]}
                accessibilityRole="button"
                accessibilityLabel="Sair da conta"
              >
                <Feather name="log-out" size={18} color={theme.danger || theme.textSecondary} />
                {!isCollapsed && (
                  <Text style={[styles.actionLabel, { color: theme.textSecondary }]}>
                    Logout
                  </Text>
                )}
              </Pressable>
            ) : (
              <View style={[isCollapsed ? styles.actionRowCollapsed : styles.actionRowExpanded]}>
                <Pressable
                  onPress={() => {
                    handleClose();
                    onPressSignIn?.();
                  }}
                  style={({ pressed }) => [
                    styles.guestActionBtn,
                    pressed && { opacity: 0.7 },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel="Entrar na conta"
                >
                  <Feather name="log-in" size={18} color={theme.textPrimary} />
                  {!isCollapsed && (
                    <Text style={[styles.actionLabel, { color: theme.textPrimary }]}>
                      Entrar
                    </Text>
                  )}
                </Pressable>

                {!isCollapsed && onPressSignUp && (
                  <Pressable
                    onPress={() => {
                      handleClose();
                      onPressSignUp();
                    }}
                    style={({ pressed }) => [
                      styles.signUpPill,
                      { backgroundColor: theme.accentSoft, borderColor: theme.accent },
                      pressed && { opacity: 0.8 },
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel="Criar nova conta"
                  >
                    <Text style={[styles.signUpPillText, { color: theme.accentText }]}>
                      Cadastrar
                    </Text>
                  </Pressable>
                )}
              </View>
            )}

            {/* Alternador de Tema customizado com Pílula e ícones Sol/Lua */}
            <View style={styles.themeContainer}>
              <ThemePillSwitch compact={isCollapsed} />
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
    borderTopRightRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
    overflow: 'hidden',
    borderRightWidth: 1,
  },
  drawerInner: {
    flex: 1,
    paddingHorizontal: spacing.md + 2,
    justifyContent: 'space-between',
  },
  drawerInnerCollapsed: {
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  headerRowCollapsed: {
    justifyContent: 'center',
  },
  brandLogoBox: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIconText: {
    fontSize: 18,
    fontWeight: typography.fontWeight.bold,
  },
  headerInfo: {
    flex: 1,
    marginLeft: spacing.sm + 4,
    marginRight: spacing.xs,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: typography.letterSpacing.tight,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBoxExpanded: {
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
  },
  searchBoxCollapsed: {
    width: 42,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  searchPlaceholder: {
    fontSize: typography.fontSize.sm,
    marginLeft: spacing.sm,
  },
  menuList: {
    flex: 1,
    marginTop: spacing.lg,
    gap: spacing.xs + 2,
  },
  menuItemExpanded: {
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md - 2,
  },
  menuItemCollapsed: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  menuItemLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  menuItemLabelActive: {
    fontWeight: typography.fontWeight.semibold,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
  },
  badgePillText: {
    fontSize: 11,
    fontWeight: typography.fontWeight.bold,
  },
  collapsedBadgeDot: {
    position: 'absolute',
    top: 6,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
  },
  footer: {
    paddingBottom: spacing.xs,
  },
  divider: {
    height: 1,
    marginBottom: spacing.sm,
  },
  profileActionContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionRowExpanded: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    gap: spacing.sm + 2,
  },
  actionRowCollapsed: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
  },
  actionLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  guestActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  signUpPill: {
    marginLeft: 'auto',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  signUpPillText: {
    fontSize: 11,
    fontWeight: typography.fontWeight.bold,
  },
  themeContainer: {
    marginTop: spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  cardPressed: {
    opacity: 0.82,
  },
});
