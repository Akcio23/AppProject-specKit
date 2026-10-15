import { memo, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/hooks/useTheme';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useSessionStore } from '@/stores/useSessionStore';
import { Avatar, TextField, FormError } from '@/components/ui';
import { RootStackScreenProps } from '@/navigation/types';
import { spacing, typography, borderRadius, shadows, pastelPalette } from '@/constants/theme';

export const ProfileScreen = memo(({ navigation }: RootStackScreenProps<'Profile'>) => {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { user, isLoading, error, updateName, uploadPhoto, deletePhoto } = useCurrentUser();
  const signOut = useSessionStore((s) => s.signOut);

  const [name, setName] = useState<string>(user?.name ?? '');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isNameChanged = useMemo(() => {
    return name.trim() !== (user?.name ?? '').trim() && name.trim().length >= 2;
  }, [name, user?.name]);

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
          setSuccessMessage('Foto de perfil atualizada com sucesso!');
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
        Alert.alert('Permissão necessária', 'Precisamos de acesso à câmera para tirar sua foto de perfil.');
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
          setSuccessMessage('Foto de perfil atualizada com sucesso!');
          void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      }
    } catch {
      Alert.alert('Erro', 'Não foi possível capturar a foto.');
    }
  }, [uploadPhoto]);

  const handleDeletePhoto = useCallback(() => {
    Alert.alert('Remover foto', 'Deseja remover sua foto de perfil e voltar ao avatar de iniciais?', [
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

  const handleSaveName = useCallback(async () => {
    if (!isNameChanged) return;
    setSuccessMessage(null);
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const updated = await updateName(name.trim());
    if (updated) {
      setSuccessMessage('Nome atualizado com sucesso!');
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [isNameChanged, name, updateName]);

  const handleLogout = useCallback(() => {
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
  }, [navigation, signOut]);

  const memberSince = useMemo(() => {
    if (!user?.createdAt) return '';
    try {
      const date = new Date(user.createdAt);
      return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    } catch {
      return '';
    }
  }, [user?.createdAt]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top + spacing.sm }]}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Meu Perfil</Text>
        <Pressable
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [
            styles.closeBtn,
            { backgroundColor: theme.surfaceSubtle, borderColor: theme.borderSubtle },
            pressed && { opacity: 0.7 },
          ]}
          accessibilityLabel="Fechar tela de perfil"
        >
          <Text style={[styles.closeIcon, { color: theme.textSecondary }]}>✕</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Mensagens de Feedback */}
        {error && (
          <View style={styles.feedbackBox}>
            <FormError message={error} />
          </View>
        )}
        {successMessage && (
          <View style={[styles.successBox, { backgroundColor: theme.accentSoft, borderColor: theme.accent }]}>
            <Text style={[styles.successText, { color: theme.accentText }]}>✓ {successMessage}</Text>
          </View>
        )}

        {/* Bloco do Avatar */}
        <View style={styles.avatarSection}>
          <Avatar name={user?.name ?? ''} photoUrl={user?.photoUrl} size="xl" />

          {isLoading ? (
            <ActivityIndicator size="small" color={theme.accent} style={{ marginTop: spacing.md }} />
          ) : (
            <View style={styles.avatarActionsRow}>
              <Pressable
                onPress={handlePickFromGallery}
                style={({ pressed }) => [
                  styles.photoBtn,
                  { backgroundColor: theme.surfaceCard, borderColor: theme.borderSubtle },
                  pressed && { opacity: 0.7 },
                ]}
              >
                <Text style={[styles.photoBtnText, { color: theme.textPrimary }]}>🖼️ Galeria</Text>
              </Pressable>

              <Pressable
                onPress={handleTakePhoto}
                style={({ pressed }) => [
                  styles.photoBtn,
                  { backgroundColor: theme.surfaceCard, borderColor: theme.borderSubtle },
                  pressed && { opacity: 0.7 },
                ]}
              >
                <Text style={[styles.photoBtnText, { color: theme.textPrimary }]}>📷 Câmera</Text>
              </Pressable>

              {user?.photoUrl && (
                <Pressable
                  onPress={handleDeletePhoto}
                  style={({ pressed }) => [
                    styles.photoBtn,
                    { backgroundColor: theme.surfaceSubtle, borderColor: theme.borderSubtle },
                    pressed && { opacity: 0.7 },
                  ]}
                >
                  <Text style={[styles.photoBtnText, { color: pastelPalette.errorPastel }]}>🗑️ Remover</Text>
                </Pressable>
              )}
            </View>
          )}
        </View>

        {/* Edição de Nome */}
        <View style={[styles.card, { backgroundColor: theme.surfaceCard, borderColor: theme.borderSubtle }]}>
          <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>NOME COMPLETO</Text>
          <TextField
            value={name}
            onChangeText={setName}
            placeholder="Seu nome"
          />

          <Pressable
            onPress={handleSaveName}
            disabled={!isNameChanged || isLoading}
            style={({ pressed }) => [
              styles.saveBtn,
              {
                backgroundColor: isNameChanged ? theme.accent : theme.surfaceSubtle,
                borderColor: isNameChanged ? theme.accent : theme.borderSubtle,
                opacity: isNameChanged ? (pressed ? 0.8 : 1) : 0.5,
              },
            ]}
          >
            <Text
              style={[
                styles.saveBtnText,
                { color: isNameChanged ? theme.accentText : theme.textMuted },
              ]}
            >
              Salvar Alterações
            </Text>
          </Pressable>
        </View>

        {/* Informações da Conta */}
        <View style={[styles.card, { backgroundColor: theme.surfaceCard, borderColor: theme.borderSubtle }]}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>DADOS DA CONTA</Text>

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.textMuted }]}>E-mail</Text>
            <Text style={[styles.infoValue, { color: theme.textPrimary }]}>{user?.email}</Text>
          </View>

          {memberSince ? (
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.textMuted }]}>Membro desde</Text>
              <Text style={[styles.infoValue, { color: theme.textPrimary }]}>{memberSince}</Text>
            </View>
          ) : null}
        </View>

        {/* Botão de Logout */}
        <Pressable
          onPress={handleLogout}
          style={({ pressed }) => [
            styles.logoutCard,
            { backgroundColor: theme.surfaceSubtle, borderColor: theme.borderSubtle },
            pressed && { opacity: 0.7 },
          ]}
        >
          <Text style={[styles.logoutCardText, { color: pastelPalette.errorPastel }]}>Sair da Conta 🚪</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
});

ProfileScreen.displayName = 'ProfileScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  headerTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: typography.letterSpacing.tight,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    fontSize: 16,
    fontWeight: typography.fontWeight.bold,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  feedbackBox: {
    marginBottom: spacing.xs,
  },
  successBox: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
  successText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  avatarActionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  photoBtn: {
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  photoBtnText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  card: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    gap: spacing.sm,
    ...shadows.soft,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: typography.letterSpacing.extraWide,
  },
  saveBtn: {
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs,
  },
  saveBtnText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: typography.letterSpacing.extraWide,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  infoLabel: {
    fontSize: typography.fontSize.sm,
  },
  infoValue: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  logoutCard: {
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  logoutCardText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
});
