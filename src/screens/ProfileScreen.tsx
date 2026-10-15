import { memo, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/hooks/useTheme';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useSessionStore } from '@/stores/useSessionStore';
import { Avatar, TextField, FormError, PasswordField } from '@/components/ui';
import { RootStackScreenProps } from '@/navigation/types';
import { spacing, typography, borderRadius, shadows, pastelPalette } from '@/constants/theme';

export const ProfileScreen = memo(({ navigation }: RootStackScreenProps<'Profile'>) => {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { user, isLoading, error, updateName, uploadPhoto, deletePhoto, deleteAccount } =
    useCurrentUser();
  const signOut = useSessionStore((s) => s.signOut);

  const [name, setName] = useState<string>(user?.name ?? '');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Estados da exclusão de conta (LGPD)
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleOpenDeleteModal = useCallback(() => {
    setDeletePassword('');
    setDeleteError(null);
    setIsDeleteModalVisible(true);
    try {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
      // Fallback
    }
  }, []);

  const handleCloseDeleteModal = useCallback(() => {
    setIsDeleteModalVisible(false);
    setDeletePassword('');
    setDeleteError(null);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!deletePassword.trim() || isDeleting) return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      const ok = await deleteAccount(deletePassword);
      if (ok) {
        setIsDeleteModalVisible(false);
        navigation.goBack();
        try {
          void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch {
          // Fallback
        }
      } else {
        setDeleteError('Senha incorreta. Não foi possível excluir sua conta.');
        try {
          void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        } catch {
          // Fallback
        }
      }
    } catch {
      setDeleteError('Erro ao excluir conta. Verifique sua conexão.');
    } finally {
      setIsDeleting(false);
    }
  }, [deleteAccount, deletePassword, isDeleting, navigation]);

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

        {/* Zona de Privacidade & Exclusão de Conta (LGPD) */}
        <View style={[styles.card, styles.dangerCard, { backgroundColor: theme.surfaceCard, borderColor: theme.borderSubtle }]}>
          <Text style={[styles.sectionTitle, { color: pastelPalette.errorPastel }]}>PRIVACIDADE & LGPD</Text>
          <Text style={[styles.dangerDesc, { color: theme.textSecondary }]}>
            Conforme a Lei Geral de Proteção de Dados (LGPD), você pode solicitar a exclusão definitiva
            de sua conta e de todos os seus dados pessoais (foto, preferências e versículos sincronizados).
          </Text>

          <Pressable
            onPress={handleOpenDeleteModal}
            style={({ pressed }) => [
              styles.deleteAccountBtn,
              { backgroundColor: theme.surfaceSubtle, borderColor: theme.borderSubtle },
              pressed && { opacity: 0.7 },
            ]}
            accessibilityLabel="Excluir minha conta permanentemente"
          >
            <Text style={[styles.deleteAccountBtnText, { color: pastelPalette.errorPastel }]}>
              Excluir Minha Conta Permanentemente ⚠️
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Modal de Confirmação com Senha para Exclusão de Conta */}
      <Modal
        visible={isDeleteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCloseDeleteModal}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              shadows.soft,
              { backgroundColor: theme.surfaceCard, borderColor: theme.borderSubtle },
            ]}
          >
            <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>
              Excluir Conta Definitivamente?
            </Text>
            <Text style={[styles.modalSubtitle, { color: theme.textSecondary }]}>
              Esta ação é <Text style={{ fontWeight: 'bold' }}>irreversível</Text>. Todos os seus
              versículos salvos na nuvem, foto e dados da conta serão apagados imediatamente.
            </Text>

            <FormError message={deleteError} />

            <View style={{ marginVertical: spacing.md }}>
              <PasswordField
                label="CONFIRME SUA SENHA ATUAL"
                value={deletePassword}
                onChangeText={setDeletePassword}
                placeholder="Sua senha secreta"
                onSubmitEditing={handleConfirmDelete}
                testID="delete-account-password-input"
              />
            </View>

            <View style={styles.modalActionsRow}>
              <Pressable
                onPress={handleCloseDeleteModal}
                disabled={isDeleting}
                style={({ pressed }) => [
                  styles.modalCancelBtn,
                  { backgroundColor: theme.surfaceSubtle },
                  pressed && { opacity: 0.7 },
                ]}
              >
                <Text style={[styles.modalCancelText, { color: theme.textPrimary }]}>Cancelar</Text>
              </Pressable>

              <Pressable
                onPress={handleConfirmDelete}
                disabled={!deletePassword.trim() || isDeleting}
                style={({ pressed }) => [
                  styles.modalConfirmBtn,
                  { backgroundColor: pastelPalette.errorPastel },
                  (!deletePassword.trim() || isDeleting) && { opacity: 0.5 },
                  pressed && { opacity: 0.8 },
                ]}
              >
                {isDeleting ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.modalConfirmText}>Sim, Excluir</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
  dangerCard: {
    marginTop: spacing.xs,
    borderLeftWidth: 4,
    borderLeftColor: pastelPalette.errorPastel,
  },
  dangerDesc: {
    fontSize: typography.fontSize.xs,
    lineHeight: 18,
    marginVertical: spacing.xs,
  },
  deleteAccountBtn: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs,
  },
  deleteAccountBtnText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  modalContent: {
    width: '100%',
    maxWidth: 420,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    padding: spacing.xl,
  },
  modalTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.xs,
  },
  modalSubtitle: {
    fontSize: typography.fontSize.xs,
    lineHeight: 18,
    marginBottom: spacing.sm,
  },
  modalActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  modalCancelBtn: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
  },
  modalCancelText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  modalConfirmBtn: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalConfirmText: {
    color: '#FFFFFF',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
});
