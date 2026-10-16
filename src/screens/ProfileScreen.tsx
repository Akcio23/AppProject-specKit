import { memo, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useSavedVerses } from '@/hooks/useSavedVerses';
import { useSessionStore } from '@/stores/useSessionStore';
import {
  ProfileHero,
  ProfileMetricsRow,
  ProfileSquircleTabs,
  ProfileSettingsPanel,
} from '@/components/features/profile';
import { RootStackScreenProps } from '@/navigation/types';
import { ProfileTabId } from '@/types';
import { spacing, typography, borderRadius } from '@/constants/theme';

export const ProfileScreen = memo(({ navigation }: RootStackScreenProps<'Profile'>) => {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { user, isLoading, uploadPhoto, deletePhoto } = useCurrentUser();
  const { savedVerses } = useSavedVerses();
  const signOut = useSessionStore((s) => s.signOut);

  const [activeTab, setActiveTab] = useState<ProfileTabId>('favorites');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Formatação da data de adesão
  const memberSince = useMemo(() => {
    if (!user?.createdAt) return 'Outubro de 2026';
    try {
      const date = new Date(user.createdAt);
      return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    } catch {
      return 'Outubro de 2026';
    }
  }, [user?.createdAt]);

  // Ações de Foto de Perfil
  const handlePickFromGallery = useCallback(async () => {
    try {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permissão necessária', 'Precisamos de acesso às suas fotos para alterar o avatar.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]?.uri) {
        const asset = result.assets[0];
        setSuccessMessage(null);
        const updated = await uploadPhoto(asset.uri, asset.mimeType ?? 'image/jpeg');
        if (updated) {
          setSuccessMessage('Foto de perfil atualizada!');
          void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      }
    } catch {
      Alert.alert('Erro', 'Não foi possível selecionar a imagem.');
    }
  }, [uploadPhoto]);

  const handleTakePhoto = useCallback(async () => {
    try {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permissão necessária', 'Precisamos de acesso à câmera para tirar sua foto.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]?.uri) {
        const asset = result.assets[0];
        setSuccessMessage(null);
        const updated = await uploadPhoto(asset.uri, asset.mimeType ?? 'image/jpeg');
        if (updated) {
          setSuccessMessage('Foto de perfil atualizada!');
          void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      }
    } catch {
      Alert.alert('Erro', 'Não foi possível capturar a foto.');
    }
  }, [uploadPhoto]);

  const handleDeletePhoto = useCallback(() => {
    Alert.alert('Remover foto', 'Deseja remover sua foto e voltar ao avatar de iniciais?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: async () => {
          setSuccessMessage(null);
          const updated = await deletePhoto();
          if (updated) {
            setSuccessMessage('Foto removida com sucesso!');
            void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }
        },
      },
    ]);
  }, [deletePhoto]);

  const handleAvatarPress = useCallback(() => {
    Alert.alert('Foto de Perfil', 'Escolha como deseja atualizar sua foto:', [
      { text: 'Escolher da Galeria', onPress: handlePickFromGallery },
      { text: 'Tirar Foto com a Câmera', onPress: handleTakePhoto },
      ...(user?.photoUrl ? [{ text: 'Remover Foto', style: 'destructive' as const, onPress: handleDeletePhoto }] : []),
      { text: 'Cancelar', style: 'cancel' },
    ]);
  }, [handlePickFromGallery, handleTakePhoto, handleDeletePhoto, user?.photoUrl]);

  // Ações do menu superior (...)
  const handleOptionsMenu = useCallback(() => {
    Alert.alert('Opções do Perfil', undefined, [
      {
        text: 'Ajustes da Conta & Privacidade',
        onPress: () => setActiveTab('settings'),
      },
      {
        text: 'Sair da Conta',
        style: 'destructive',
        onPress: () => {
          Alert.alert('Sair da conta', 'Tem certeza de que deseja sair?', [
            { text: 'Cancelar', style: 'cancel' },
            {
              text: 'Sair',
              style: 'destructive',
              onPress: async () => {
                navigation.goBack();
                await signOut();
              },
            },
          ]);
        },
      },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  }, [navigation, signOut]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Feedback visual temporário */}
        {successMessage && (
          <View style={[styles.successBanner, { backgroundColor: theme.accentSoft, borderColor: theme.accent }]}>
            <Text style={[styles.successBannerText, { color: theme.accentText }]}>
              ✓ {successMessage}
            </Text>
          </View>
        )}

        {/* Hero: Avatar circular + Nome + Subtítulo + Idioma */}
        <ProfileHero
          name={user?.name ?? 'Leitor da Palavra'}
          photoUrl={user?.photoUrl}
          memberSince={memberSince}
          onPressBack={() => navigation.goBack()}
          onPressOptions={handleOptionsMenu}
          onPressAvatar={handleAvatarPress}
        />

        {/* Barra de Métricas: Salvos | Devocionais | Favoritos */}
        <ProfileMetricsRow
          savedCount={savedVerses.length}
          streakDays={7}
          favoritesCount={Math.min(savedVerses.length, 3)}
          onPressSaved={() => setActiveTab('favorites')}
          onPressDevotionals={() => setActiveTab('favorites')}
          onPressFavorites={() => setActiveTab('favorites')}
        />

        {/* Abas em Squircle: Favoritos | Ajustes */}
        <ProfileSquircleTabs
          activeTab={activeTab}
          onSelectTab={setActiveTab}
        />

        {/* Conteúdo Dinâmico por Aba */}
        {activeTab === 'favorites' && (
          <View style={styles.favoritesSection}>
            <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
              Versículos Salvos ({savedVerses.length})
            </Text>
            {savedVerses.length === 0 ? (
              <View style={[styles.emptyCard, { backgroundColor: theme.surfaceCard, borderColor: theme.borderSubtle }]}>
                <Feather name="bookmark" size={28} color={theme.textMuted} style={{ marginBottom: 8 }} />
                <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>
                  Nenhum versículo salvo ainda
                </Text>
                <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
                  Ao ler a Bíblia, toque no marcador para guardá-los aqui.
                </Text>
              </View>
            ) : (
              savedVerses.map((item) => (
                <Pressable
                  key={item.id}
                  onPress={() => navigation.navigate('BibleSearch', { initialReference: item.reference })}
                  style={({ pressed }) => [
                    styles.verseCard,
                    { backgroundColor: theme.surfaceCard, borderColor: theme.borderSubtle },
                    pressed && { opacity: 0.8 },
                  ]}
                >
                  <View style={styles.verseHeader}>
                    <Text style={[styles.verseRef, { color: theme.textPrimary }]}>
                      {item.reference}
                    </Text>
                    <Feather name="heart" size={14} color={theme.accent} />
                  </View>
                  <Text style={[styles.verseText, { color: theme.textSecondary }]} numberOfLines={2}>
                    {item.text}
                  </Text>
                </Pressable>
              ))
            )}
          </View>
        )}

        {activeTab === 'settings' && (
          <ProfileSettingsPanel
            onSuccessMessage={setSuccessMessage}
            onLoggedOut={() => navigation.goBack()}
          />
        )}

        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="small" color={theme.accent} />
          </View>
        )}
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  successBanner: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.xs,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
  },
  successBannerText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  favoritesSection: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.xs,
  },
  emptyCard: {
    padding: spacing.xl,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 12,
    textAlign: 'center',
  },
  verseCard: {
    padding: spacing.md,
    borderRadius: 16,
    borderWidth: 1,
  },
  verseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  verseRef: {
    fontSize: 13,
    fontWeight: typography.fontWeight.bold,
  },
  verseText: {
    fontSize: 12,
    lineHeight: 18,
  },
  loadingOverlay: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
});
