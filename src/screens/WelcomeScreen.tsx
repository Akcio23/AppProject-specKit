import { memo, useCallback, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Share, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { SideDrawer } from '@/components/ui';
import {
  VerseOfTheDayCard,
  DevotionalTopics,
  SettingsTranslationList,
} from '@/components/features/bible';
import { useAppStore } from '@/stores/useAppStore';
import { RootStackScreenProps } from '@/navigation/types';
import { spacing, typography, borderRadius, shadows } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';

type MainTopic = 'devocional' | 'temas' | 'guardados' | 'ajustes';

export const WelcomeScreen = memo(({ navigation }: RootStackScreenProps<'Welcome'>) => {
  const insets = useSafeAreaInsets();
  const { theme, isDark, toggleTheme } = useTheme();
  const { savedVerses, removeSavedVerse } = useAppStore();
  const [activeTopic, setActiveTopic] = useState<MainTopic>('devocional');
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const handleOpenDrawer = useCallback(() => {
    try {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Fallback
    }
    setIsDrawerOpen(true);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setIsDrawerOpen(false);
  }, []);

  const handleSelectDrawerMenu = useCallback((id: string) => {
    setActiveTopic(id as MainTopic);
  }, []);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return { title: 'Abençoada Manhã 🌅', subtitle: 'Comece seu dia na presença do Pai.' };
    }
    if (hour >= 12 && hour < 18) {
      return { title: 'Boa Tarde de Paz ☀️', subtitle: 'Que a graça divina guie seus passos.' };
    }
    return { title: 'Serena Noite de Luz 🌙', subtitle: 'Descanse seu coração na Palavra.' };
  }, []);

  const openSearch = useCallback(() => {
    try {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Fallback
    }
    navigation.navigate('BibleSearch');
  }, [navigation]);

  const openPassage = useCallback(
    (reference: string) => navigation.navigate('BibleSearch', { initialReference: reference }),
    [navigation],
  );

  const handleShareSaved = useCallback(async (reference: string, text: string, translation: string) => {
    try {
      await Share.share({
        message: `“${text}”\n\n— ${reference} (${translation})\nBíblia Sagrada Mobile`,
        title: reference,
      });
    } catch {
      // Ignora cancelamentos
    }
  }, []);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.background,
          paddingTop: insets.top + spacing.sm,
          paddingBottom: insets.bottom + spacing.xs,
        },
      ]}
    >
      <StatusBar
        barStyle={theme.statusBar}
        backgroundColor={theme.background}
      />

      {/* Cabeçalho Minimalista & Arejado */}
      <View style={styles.headerRow}>
        <Pressable
          onPress={handleOpenDrawer}
          style={({ pressed }) => [
            styles.headerIconBtn,
            { backgroundColor: theme.surfaceCard, borderColor: theme.borderSubtle },
            pressed && styles.btnPressed,
          ]}
          accessibilityLabel="Abrir menu lateral"
        >
          <View style={[styles.hamburgerLine, { backgroundColor: theme.textPrimary }]} />
          <View style={[styles.hamburgerLine, { width: 12, backgroundColor: theme.textPrimary }]} />
          <View style={[styles.hamburgerLine, { backgroundColor: theme.textPrimary }]} />
        </Pressable>

        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
            {greeting.title}
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
            {greeting.subtitle}
          </Text>
        </View>

        <View style={styles.headerRightActions}>
          {/* Botão de Alternância de Tema Claro / Escuro Rápido */}
          <Pressable
            onPress={toggleTheme}
            style={({ pressed }) => [
              styles.headerIconBtn,
              { backgroundColor: theme.surfaceCard, borderColor: theme.borderSubtle },
              pressed && styles.btnPressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
          >
            <Text style={styles.headerActionIcon}>{isDark ? '☀️' : '🌙'}</Text>
          </Pressable>

          {/* Botão de Busca */}
          <Pressable
            onPress={openSearch}
            style={({ pressed }) => [
              styles.headerIconBtn,
              { backgroundColor: theme.surfaceCard, borderColor: theme.borderSubtle },
              pressed && styles.btnPressed,
            ]}
            accessibilityLabel="Abrir busca da Bíblia"
          >
            <Text style={styles.headerActionIcon}>🔍</Text>
          </Pressable>
        </View>
      </View>

      {/* Conteúdo Separado por Tópico */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTopic === 'devocional' && (
          <View style={styles.topicPane}>
            {/* Palavra do Dia com design editorial pastel */}
            <VerseOfTheDayCard onReadChapter={openPassage} />

            {/* Cartão de Meditação e Oração Diária em tons pastéis */}
            <View
              style={[
                styles.prayerCard,
                shadows.soft,
                {
                  backgroundColor: theme.surfaceCard,
                  borderColor: theme.borderSubtle,
                },
              ]}
            >
              <View style={styles.prayerHeader}>
                <Text style={styles.prayerIcon}>🙏</Text>
                <Text style={[styles.prayerTitle, { color: theme.textPrimary }]}>
                  Momento de Oração
                </Text>
              </View>
              <Text style={[styles.prayerText, { color: theme.textSecondary }]}>
                “Senhor, que a Tua palavra habite ricamente em meu coração hoje. Concede-me sabedoria para as decisões, serenidade nas provações e amor em cada atitude. Amém.”
              </Text>
            </View>

            {/* Rodapé Devocional Minimalista */}
            <View style={[styles.footer, { borderTopColor: theme.divider }]}>
              <Text style={[styles.footerQuote, { color: theme.textMuted }]}>
                “Lâmpada para os meus pés é a tua palavra e luz para o meu caminho.”
              </Text>
              <Text style={[styles.footerRef, { color: theme.textSecondary }]}>Salmos 119:105</Text>
            </View>
          </View>
        )}

        {activeTopic === 'temas' && (
          <View style={styles.topicPane}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
                Palavras para Cada Momento
              </Text>
              <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
                Selecione uma meditação para ler passagens inspiradoras
              </Text>
            </View>
            <DevotionalTopics onSelectTopic={openPassage} mode="grid" />
          </View>
        )}

        {activeTopic === 'guardados' && (
          <View style={styles.topicPane}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
                Versículos Guardados
              </Text>
              <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
                Palavras que você salvou no coração para orar e meditar
              </Text>
            </View>

            {savedVerses.length === 0 ? (
              <View
                style={[
                  styles.emptySavedBox,
                  shadows.soft,
                  {
                    backgroundColor: theme.surfaceCard,
                    borderColor: theme.borderSubtle,
                  },
                ]}
              >
                <Text style={styles.emptySavedIcon}>📖</Text>
                <Text style={[styles.emptySavedTitle, { color: theme.textPrimary }]}>
                  Nenhum versículo guardado ainda
                </Text>
                <Text style={[styles.emptySavedText, { color: theme.textSecondary }]}>
                  Quando encontrar um versículo tocante, toque no coração ❤️ para guardá-lo aqui.
                </Text>
              </View>
            ) : (
              <View style={styles.savedList}>
                {savedVerses.map((item) => (
                  <View
                    key={item.reference}
                    style={[
                      styles.savedCard,
                      shadows.soft,
                      {
                        backgroundColor: theme.surfaceCard,
                        borderColor: theme.borderSubtle,
                      },
                    ]}
                  >
                    <View style={styles.savedCardHeader}>
                      <View
                        style={[
                          styles.savedRefBadge,
                          {
                            backgroundColor: theme.accentSoft,
                            borderColor: theme.accent,
                          },
                        ]}
                      >
                        <Text style={[styles.savedReference, { color: theme.accentText }]}>
                          {item.reference}
                        </Text>
                      </View>
                      <View style={styles.savedActionsRow}>
                        <Pressable
                          onPress={() => handleShareSaved(item.reference, item.text, item.translation)}
                          hitSlop={8}
                          accessibilityLabel="Compartilhar versículo"
                          style={[
                            styles.actionSmallBtn,
                            {
                              backgroundColor: theme.surfaceSubtle,
                              borderColor: theme.borderSubtle,
                            },
                          ]}
                        >
                          <Text style={styles.actionSmallIcon}>📤</Text>
                        </Pressable>
                        <Pressable
                          onPress={() => removeSavedVerse(item.reference)}
                          hitSlop={8}
                          accessibilityLabel="Remover dos favoritos"
                          style={[
                            styles.actionSmallBtn,
                            {
                              backgroundColor: theme.surfaceSubtle,
                              borderColor: theme.borderSubtle,
                            },
                          ]}
                        >
                          <Text style={[styles.actionSmallIcon, { color: theme.textMuted }]}>✕</Text>
                        </Pressable>
                      </View>
                    </View>

                    <Text style={[styles.savedVerseText, { color: theme.textPrimary }]}>
                      “{item.text}”
                    </Text>
                    <Text style={[styles.savedTranslation, { color: theme.textMuted }]}>
                      {item.translation}
                    </Text>

                    <Pressable
                      onPress={() => openPassage(item.reference)}
                      style={({ pressed }) => [
                        styles.readChapterLink,
                        pressed && styles.btnPressed,
                      ]}
                    >
                      <Text style={[styles.readChapterLinkText, { color: theme.textSecondary }]}>
                        Ler passagem completa →
                      </Text>
                    </Pressable>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {activeTopic === 'ajustes' && (
          <View style={styles.topicPane}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
                Versão & Ajustes
              </Text>
              <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
                Escolha a tradução das Escrituras para sua leitura diária
              </Text>
            </View>

            <View
              style={[
                styles.infoBanner,
                {
                  backgroundColor: theme.surfaceCard,
                  borderColor: theme.borderSubtle,
                  borderLeftColor: theme.accent,
                },
              ]}
            >
              <Text style={styles.infoBannerIcon}>💡</Text>
              <Text style={[styles.infoBannerText, { color: theme.textSecondary }]}>
                A versão selecionada é aplicada na Palavra do Dia e nas buscas bíblicas.
              </Text>
            </View>

            <SettingsTranslationList />

            <View
              style={[
                styles.appInfoCard,
                shadows.soft,
                {
                  backgroundColor: theme.surfaceCard,
                  borderColor: theme.borderSubtle,
                },
              ]}
            >
              <Text style={[styles.appInfoTitle, { color: theme.textPrimary }]}>
                📖 Sobre o Bíblia Sagrada Mobile
              </Text>
              <Text style={[styles.appInfoText, { color: theme.textSecondary }]}>
                Um aplicativo devocional com design sereno em tons pastéis e dados bíblicos fornecidos pela API pública bible-api.com. Criado para inspirar paz, reflexão e comunhão.
              </Text>
              <Text style={[styles.appInfoVersion, { color: theme.textMuted }]}>
                Versão 1.1.0 • Design Clean Pastel
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Navbar lateral retrátil */}
      <SideDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        activeId={activeTopic}
        onSelectMenu={handleSelectDrawerMenu}
        onOpenSearch={openSearch}
        savedCount={savedVerses.length}
      />
    </View>
  );
});

WelcomeScreen.displayName = 'WelcomeScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    marginTop: spacing.xs,
  },
  headerCenter: {
    flex: 1,
    paddingHorizontal: spacing.sm,
  },
  headerTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: typography.letterSpacing.tight,
  },
  headerSubtitle: {
    fontSize: typography.fontSize.xs,
    marginTop: 2,
  },
  headerRightActions: {
    flexDirection: 'row',
    gap: spacing.xs + 2,
  },
  headerIconBtn: {
    width: 38,
    height: 38,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.96 }],
  },
  hamburgerLine: {
    width: 16,
    height: 2,
    borderRadius: 1,
    marginVertical: 1.5,
  },
  headerActionIcon: {
    fontSize: 16,
  },
  topicPane: {
    paddingTop: spacing.xs,
  },
  sectionHeader: {
    marginBottom: spacing.md,
    paddingHorizontal: spacing.xs,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: typography.fontSize.xs,
    lineHeight: 18,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderLeftWidth: 3,
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  infoBannerIcon: {
    fontSize: 16,
  },
  infoBannerText: {
    flex: 1,
    fontSize: typography.fontSize.xs,
    lineHeight: 18,
  },
  appInfoCard: {
    borderRadius: borderRadius.md,
    borderWidth: 1,
    padding: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  appInfoTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.xs,
  },
  appInfoText: {
    fontSize: typography.fontSize.xs,
    lineHeight: 18,
    marginBottom: spacing.sm,
  },
  appInfoVersion: {
    fontSize: 10,
    fontWeight: typography.fontWeight.medium,
  },
  prayerCard: {
    borderRadius: borderRadius.md,
    borderWidth: 1,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  prayerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  prayerIcon: {
    fontSize: 16,
  },
  prayerTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  prayerText: {
    fontSize: typography.fontSize.sm,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  savedList: {
    gap: spacing.md,
  },
  savedCard: {
    borderRadius: borderRadius.md,
    borderWidth: 1,
    padding: spacing.md + 2,
  },
  savedCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  savedRefBadge: {
    borderWidth: 1,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 2,
  },
  savedReference: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  savedActionsRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  actionSmallBtn: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionSmallIcon: {
    fontSize: 11,
  },
  savedVerseText: {
    fontSize: typography.fontSize.sm,
    lineHeight: 22,
    fontStyle: 'italic',
    marginBottom: spacing.xs,
  },
  savedTranslation: {
    fontSize: 10,
    marginBottom: spacing.sm,
  },
  readChapterLink: {
    alignSelf: 'flex-start',
    paddingVertical: 2,
  },
  readChapterLinkText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
  },
  emptySavedBox: {
    borderRadius: borderRadius.md,
    borderWidth: 1,
    padding: spacing.xl,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  emptySavedIcon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  emptySavedTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.xs,
  },
  emptySavedText: {
    fontSize: typography.fontSize.xs,
    textAlign: 'center',
    lineHeight: 18,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    marginTop: spacing.xs,
  },
  footerQuote: {
    fontSize: typography.fontSize.xs,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: spacing.md,
  },
  footerRef: {
    fontSize: 11,
    fontWeight: typography.fontWeight.semibold,
    marginTop: spacing.xs,
  },
});
