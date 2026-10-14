import { memo, useCallback, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Share } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TopicMenu, TopicTabItem } from '@/components/ui';
import {
  VerseOfTheDayCard,
  DevotionalTopics,
  SettingsTranslationList,
} from '@/components/features/bible';
import { useAppStore } from '@/stores/useAppStore';
import { RootStackScreenProps } from '@/navigation/types';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';

type MainTopic = 'devocional' | 'temas' | 'guardados' | 'ajustes';

export const WelcomeScreen = memo(({ navigation }: RootStackScreenProps<'Welcome'>) => {
  const insets = useSafeAreaInsets();
  const { savedVerses, removeSavedVerse } = useAppStore();
  const [activeTopic, setActiveTopic] = useState<MainTopic>('devocional');

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

  const tabs: TopicTabItem<MainTopic>[] = useMemo(
    () => [
      { id: 'devocional', label: 'Devocional', icon: '🕊️' },
      { id: 'temas', label: 'Temas', icon: '✨' },
      {
        id: 'guardados',
        label: 'Guardados',
        icon: '❤️',
        badgeCount: savedVerses.length > 0 ? savedVerses.length : undefined,
      },
      { id: 'ajustes', label: 'Ajustes', icon: '⚙️' },
    ],
    [savedVerses.length],
  );

  const openSearch = useCallback(() => navigation.navigate('BibleSearch'), [navigation]);

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
          paddingTop: insets.top + spacing.sm,
          paddingBottom: insets.bottom + spacing.xs,
        },
      ]}
    >
      {/* Cabeçalho Compacto & Acolhedor */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>BÍBLIA SAGRADA</Text>
          </View>
          <Text style={styles.headerTitle}>{greeting.title}</Text>
          <Text style={styles.headerSubtitle}>{greeting.subtitle}</Text>
        </View>
        <Pressable
          onPress={openSearch}
          style={({ pressed }) => [styles.searchBtn, pressed ? styles.searchBtnPressed : null]}
          accessibilityLabel="Abrir busca da Bíblia"
        >
          <Text style={styles.searchBtnIcon}>🔍</Text>
        </Pressable>
      </View>

      {/* Menu Superior por Tópicos */}
      <TopicMenu
        tabs={tabs}
        activeTab={activeTopic}
        onSelectTab={setActiveTopic}
      />

      {/* Conteúdo Separado por Tópico */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTopic === 'devocional' && (
          <View style={styles.topicPane}>
            {/* Palavra do Dia com amplo espaço para respirar */}
            <VerseOfTheDayCard onReadChapter={openPassage} />

            {/* Cartão de Meditação e Oração Diária */}
            <View style={styles.prayerCard}>
              <View style={styles.prayerHeader}>
                <Text style={styles.prayerIcon}>🙏</Text>
                <Text style={styles.prayerTitle}>Momento de Oração</Text>
              </View>
              <Text style={styles.prayerText}>
                “Senhor, que a Tua palavra habite ricamente em meu coração hoje. Dê-me sabedoria nas decisões, paz em meio às tempestades e amor para com todos os que cruzarem o meu caminho. Amém.”
              </Text>
            </View>

            {/* Rodapé Devocional */}
            <View style={styles.footer}>
              <Text style={styles.footerQuote}>
                “Lâmpada para os meus pés é a tua palavra e luz para o meu caminho.”
              </Text>
              <Text style={styles.footerRef}>Salmos 119:105</Text>
            </View>
          </View>
        )}

        {activeTopic === 'temas' && (
          <View style={styles.topicPane}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>✨ Palavras para Cada Momento</Text>
              <Text style={styles.sectionSubtitle}>
                Selecione uma área do seu coração e leia as Escrituras sagradas
              </Text>
            </View>
            <DevotionalTopics onSelectTopic={openPassage} mode="grid" />
          </View>
        )}

        {activeTopic === 'guardados' && (
          <View style={styles.topicPane}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>❤️ Guardados no Coração</Text>
              <Text style={styles.sectionSubtitle}>
                Versículos que você salvou para meditar e orar a qualquer momento
              </Text>
            </View>

            {savedVerses.length === 0 ? (
              <View style={styles.emptySavedBox}>
                <Text style={styles.emptySavedIcon}>📖</Text>
                <Text style={styles.emptySavedTitle}>Nenhum versículo guardado ainda</Text>
                <Text style={styles.emptySavedText}>
                  Quando encontrar um versículo especial na Palavra do Dia ou na leitura, toque no coração ❤️ para guardá-lo aqui.
                </Text>
              </View>
            ) : (
              <View style={styles.savedList}>
                {savedVerses.map((item) => (
                  <View key={item.reference} style={styles.savedCard}>
                    <View style={styles.savedCardHeader}>
                      <View style={styles.savedRefBadge}>
                        <Text style={styles.savedReference}>{item.reference}</Text>
                      </View>
                      <View style={styles.savedActionsRow}>
                        <Pressable
                          onPress={() => handleShareSaved(item.reference, item.text, item.translation)}
                          hitSlop={8}
                          accessibilityLabel="Compartilhar versículo"
                          style={styles.actionSmallBtn}
                        >
                          <Text style={styles.actionSmallIcon}>📤</Text>
                        </Pressable>
                        <Pressable
                          onPress={() => removeSavedVerse(item.reference)}
                          hitSlop={8}
                          accessibilityLabel="Remover dos favoritos"
                          style={styles.actionSmallBtn}
                        >
                          <Text style={styles.actionSmallIcon}>✕</Text>
                        </Pressable>
                      </View>
                    </View>

                    <Text style={styles.savedVerseText}>“{item.text}”</Text>
                    <Text style={styles.savedTranslation}>{item.translation}</Text>

                    <Pressable
                      onPress={() => openPassage(item.reference)}
                      style={({ pressed }) => [
                        styles.readChapterLink,
                        pressed ? styles.readChapterLinkPressed : null,
                      ]}
                    >
                      <Text style={styles.readChapterLinkText}>Ler passagem completa →</Text>
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
              <Text style={styles.sectionTitle}>⚙️ Versão & Configurações</Text>
              <Text style={styles.sectionSubtitle}>
                Escolha a tradução bíblica para leitura e estudo das Escrituras
              </Text>
            </View>

            <View style={styles.infoBanner}>
              <Text style={styles.infoBannerIcon}>💡</Text>
              <Text style={styles.infoBannerText}>
                A tradução selecionada abaixo é aplicada em todo o app (Palavra do Dia e busca de passagens).
              </Text>
            </View>

            <SettingsTranslationList />

            <View style={styles.appInfoCard}>
              <Text style={styles.appInfoTitle}>📖 Sobre a Bíblia Sagrada Mobile</Text>
              <Text style={styles.appInfoText}>
                Aplicativo devocional desenvolvido com React Native e dados bíblicos fornecidos pela API pública bible-api.com. Feito para inspirar momentos de paz, oração e fé.
              </Text>
              <Text style={styles.appInfoVersion}>Versão 1.0.0 • Domínio Público</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
});

WelcomeScreen.displayName = 'WelcomeScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
    paddingHorizontal: spacing.md,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    marginTop: spacing.xs,
  },
  headerLeft: {
    flex: 1,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceSubtleDark,
    borderColor: colors.borderGold,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
    marginBottom: 4,
  },
  badgeText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 1,
  },
  headerTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimaryDark,
  },
  headerSubtitle: {
    fontSize: typography.fontSize.xs,
    color: colors.textMutedDark,
    marginTop: 2,
  },
  searchBtn: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceDark,
    borderWidth: 1,
    borderColor: colors.borderDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
  searchBtnPressed: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceSubtleDark,
  },
  searchBtnIcon: {
    fontSize: 18,
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
    color: colors.primary,
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: typography.fontSize.xs,
    color: colors.textMutedDark,
    lineHeight: 18,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceDark,
    borderRadius: borderRadius.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
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
    color: colors.textMutedDark,
    lineHeight: 18,
  },
  appInfoCard: {
    backgroundColor: colors.surfaceDark,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.borderDark,
    padding: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  appInfoTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  appInfoText: {
    fontSize: typography.fontSize.xs,
    color: colors.textMutedDark,
    lineHeight: 18,
    marginBottom: spacing.sm,
  },
  appInfoVersion: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: typography.fontWeight.semibold,
  },
  prayerCard: {
    backgroundColor: colors.surfaceDark,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.borderDark,
    padding: spacing.md,
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
    color: colors.primary,
  },
  prayerText: {
    fontSize: typography.fontSize.sm,
    color: colors.textMutedDark,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  savedList: {
    gap: spacing.md,
  },
  savedCard: {
    backgroundColor: colors.surfaceDark,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.borderDark,
    padding: spacing.md,
  },
  savedCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  savedRefBadge: {
    backgroundColor: colors.surfaceSubtleDark,
    borderWidth: 1,
    borderColor: colors.borderGold,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  savedReference: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  savedActionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionSmallBtn: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceSubtleDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionSmallIcon: {
    fontSize: 13,
    color: colors.textMutedDark,
  },
  savedVerseText: {
    fontSize: typography.fontSize.sm,
    color: colors.textPrimaryDark,
    lineHeight: 22,
    fontStyle: 'italic',
    marginBottom: spacing.xs,
  },
  savedTranslation: {
    fontSize: typography.fontSize.xs - 2,
    color: colors.textMutedDark,
    marginBottom: spacing.sm,
  },
  readChapterLink: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
  },
  readChapterLinkPressed: {
    opacity: 0.7,
  },
  readChapterLinkText: {
    fontSize: typography.fontSize.xs,
    color: colors.primary,
    fontWeight: typography.fontWeight.semibold,
  },
  emptySavedBox: {
    backgroundColor: colors.surfaceDark,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.borderDark,
    padding: spacing.xl,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  emptySavedIcon: {
    fontSize: 36,
    marginBottom: spacing.sm,
  },
  emptySavedTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimaryDark,
    marginBottom: spacing.xs,
  },
  emptySavedText: {
    fontSize: typography.fontSize.xs,
    color: colors.textMutedDark,
    textAlign: 'center',
    lineHeight: 18,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderDark,
    marginTop: spacing.xs,
  },
  footerQuote: {
    fontSize: typography.fontSize.xs,
    fontStyle: 'italic',
    color: colors.textMutedDark,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: spacing.md,
  },
  footerRef: {
    fontSize: typography.fontSize.xs - 1,
    fontWeight: typography.fontWeight.semibold,
    color: colors.primary,
    marginTop: spacing.xs,
  },
});
