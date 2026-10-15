import { memo, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { PasswordField, FormError } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useSessionStore } from '@/stores/useSessionStore';
import { spacing, typography, shadows, pastelPalette } from '@/constants/theme';

export interface ProfileSettingsPanelProps {
  onSuccessMessage: (msg: string) => void;
  onLoggedOut: () => void;
}

export const ProfileSettingsPanel = memo(({
  onSuccessMessage,
  onLoggedOut,
}: ProfileSettingsPanelProps) => {
  const { theme } = useTheme();
  const {
    user,
    isLoading,
    updateName,
    deleteAccount,
  } = useCurrentUser();
  const signOut = useSessionStore((s) => s.signOut);

  const [name, setName] = useState<string>(user?.name ?? '');
  const [isEditingName, setIsEditingName] = useState<boolean>(false);

  // Estados de exclusão LGPD
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const isNameChanged = useMemo(() => {
    return name.trim() !== (user?.name ?? '').trim() && name.trim().length >= 2;
  }, [name, user?.name]);

  const memberSince = useMemo(() => {
    if (!user?.createdAt) return 'Outubro de 2026';
    try {
      const date = new Date(user.createdAt);
      return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    } catch {
      return 'Outubro de 2026';
    }
  }, [user?.createdAt]);

  const handleSaveName = useCallback(async () => {
    if (!isNameChanged) {
      setIsEditingName(false);
      return;
    }
    try {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
      // Fallback
    }
    const updated = await updateName(name.trim());
    if (updated) {
      setIsEditingName(false);
      onSuccessMessage('Nome atualizado com sucesso!');
      try {
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {
        // Fallback
      }
    }
  }, [isNameChanged, name, updateName, onSuccessMessage]);

  const handleCancelEdit = useCallback(() => {
    setName(user?.name ?? '');
    setIsEditingName(false);
  }, [user?.name]);

  const handleLogout = useCallback(async () => {
    try {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Fallback
    }
    await signOut();
    onLoggedOut();
  }, [signOut, onLoggedOut]);

  const handleOpenDeleteModal = useCallback(() => {
    setDeletePassword('');
    setDeleteError(null);
    setIsDeleteModalVisible(true);
    try {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
        try {
          void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch {
          // Fallback
        }
        onLoggedOut();
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
  }, [deleteAccount, deletePassword, isDeleting, onLoggedOut]);

  return (
    <View style={styles.container}>
      {/* Card Unificado com Informações em Destaque */}
      <View
        style={[
          styles.mainCard,
          shadows.soft,
          { backgroundColor: theme.surfaceCard, borderColor: theme.borderSubtle },
        ]}
      >
        {/* Linha 1: Nome com Edição Minimalista */}
        <View style={styles.infoRow}>
          <View style={[styles.iconContainer, { backgroundColor: theme.surfaceSubtle }]}>
            <Feather name="user" size={15} color={theme.textSecondary} />
          </View>
          <View style={styles.infoContent}>
            <Text style={[styles.infoLabel, { color: theme.textMuted }]}>Nome</Text>
            {isEditingName ? (
              <TextInput
                value={name}
                onChangeText={setName}
                autoFocus
                style={[
                  styles.inlineInput,
                  { color: theme.textPrimary, borderBottomColor: theme.accent },
                ]}
                placeholder="Seu nome"
                placeholderTextColor={theme.textMuted}
                onSubmitEditing={handleSaveName}
              />
            ) : (
              <Text style={[styles.infoValue, { color: theme.textPrimary }]}>
                {user?.name || 'Pedro Acacio'}
              </Text>
            )}
          </View>

          {isEditingName ? (
            <View style={styles.editActionsRow}>
              <Pressable
                onPress={handleCancelEdit}
                style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.6 }]}
                accessibilityLabel="Cancelar edição"
              >
                <Feather name="x" size={16} color={theme.textMuted} />
              </Pressable>
              <Pressable
                onPress={handleSaveName}
                disabled={!isNameChanged || isLoading}
                style={({ pressed }) => [
                  styles.savePillBtn,
                  {
                    backgroundColor: isNameChanged ? theme.accent : theme.surfaceSubtle,
                    opacity: isNameChanged ? (pressed ? 0.75 : 1) : 0.5,
                  },
                ]}
                accessibilityLabel="Salvar nome"
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color={theme.accentText} />
                ) : (
                  <Feather
                    name="check"
                    size={14}
                    color={isNameChanged ? theme.accentText : theme.textMuted}
                  />
                )}
              </Pressable>
            </View>
          ) : (
            <Pressable
              onPress={() => setIsEditingName(true)}
              style={({ pressed }) => [
                styles.editPencilBtn,
                { backgroundColor: theme.surfaceSubtle },
                pressed && { opacity: 0.6 },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Editar nome"
            >
              <Feather name="edit-2" size={13} color={theme.textSecondary} />
            </Pressable>
          )}
        </View>

        <View style={[styles.divider, { backgroundColor: theme.borderSubtle }]} />

        {/* Linha 2: E-mail */}
        <View style={styles.infoRow}>
          <View style={[styles.iconContainer, { backgroundColor: theme.surfaceSubtle }]}>
            <Feather name="mail" size={15} color={theme.textSecondary} />
          </View>
          <View style={styles.infoContent}>
            <Text style={[styles.infoLabel, { color: theme.textMuted }]}>E-mail</Text>
            <Text style={[styles.infoValue, { color: theme.textPrimary }]} numberOfLines={1}>
              {user?.email || 'pedroacaciioosk8@gmail.com'}
            </Text>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.borderSubtle }]} />

        {/* Linha 3: Membro Desde */}
        <View style={styles.infoRow}>
          <View style={[styles.iconContainer, { backgroundColor: theme.surfaceSubtle }]}>
            <Feather name="calendar" size={15} color={theme.textSecondary} />
          </View>
          <View style={styles.infoContent}>
            <Text style={[styles.infoLabel, { color: theme.textMuted }]}>Membro desde</Text>
            <Text style={[styles.infoValue, { color: theme.textPrimary }]}>
              {memberSince}
            </Text>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.borderSubtle }]} />

        {/* Linha 4: Status da Conta */}
        <View style={styles.infoRow}>
          <View style={[styles.iconContainer, { backgroundColor: theme.surfaceSubtle }]}>
            <Feather name="shield" size={15} color={theme.textSecondary} />
          </View>
          <View style={styles.infoContent}>
            <Text style={[styles.infoLabel, { color: theme.textMuted }]}>Status da Conta</Text>
            <View style={styles.statusRow}>
              <View
                style={[styles.statusDot, { backgroundColor: pastelPalette.successPastel }]}
              />
              <Text style={[styles.statusText, { color: theme.textPrimary }]}>
                Ativa & Sincronizada
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Botão de Logout */}
      <Pressable
        onPress={handleLogout}
        accessibilityRole="button"
        accessibilityLabel="Sair da conta"
        style={({ pressed }) => [
          styles.logoutButton,
          shadows.soft,
          { backgroundColor: theme.surfaceCard, borderColor: theme.borderSubtle },
          pressed && { opacity: 0.7 },
        ]}
      >
        <Feather
          name="log-out"
          size={16}
          color={pastelPalette.errorPastel}
          style={{ marginRight: 8 }}
        />
        <Text style={[styles.logoutText, { color: pastelPalette.errorPastel }]}>
          Sair da Conta
        </Text>
      </Pressable>

      {/* Opção Discreta de Exclusão de Conta (Não óbvia, no rodapé) */}
      <Pressable
        onPress={handleOpenDeleteModal}
        accessibilityRole="button"
        accessibilityLabel="Privacidade e dados da conta"
        style={({ pressed }) => [
          styles.discreetDeleteLink,
          pressed && { opacity: 0.5 },
        ]}
      >
        <Text style={[styles.discreetDeleteText, { color: theme.textMuted }]}>
          Exclusão de conta
        </Text>
      </Pressable>

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
              shadows.modal,
              { backgroundColor: theme.surfaceCard, borderColor: theme.borderSubtle },
            ]}
          >
            <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>
              Excluir Conta Definitivamente?
            </Text>
            <Text style={[styles.modalSubtitle, { color: theme.textSecondary }]}>
              Esta ação é <Text style={{ fontWeight: 'bold' }}>irreversível</Text>. Todos os seus versículos salvos e dados serão apagados imediatamente.
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
                style={[styles.modalActionBtn, { backgroundColor: theme.surfaceSubtle }]}
              >
                <Text style={{ color: theme.textPrimary }}>Cancelar</Text>
              </Pressable>

              <Pressable
                onPress={handleConfirmDelete}
                disabled={!deletePassword.trim() || isDeleting}
                style={[
                  styles.modalActionBtn,
                  {
                    backgroundColor: pastelPalette.errorPastel,
                    opacity: !deletePassword.trim() || isDeleting ? 0.5 : 1,
                  },
                ]}
              >
                {isDeleting ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Excluir</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
  mainCard: {
    borderRadius: 20,
    borderWidth: 1,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  iconContainer: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  inlineInput: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    paddingVertical: 2,
    borderBottomWidth: 1.5,
  },
  editActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconBtn: {
    padding: 6,
  },
  savePillBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editPencilBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    opacity: 0.5,
    marginLeft: 46,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: typography.fontWeight.medium,
  },
  logoutButton: {
    flexDirection: 'row',
    paddingVertical: 14,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  discreetDeleteLink: {
    paddingVertical: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  discreetDeleteText: {
    fontSize: 11,
    textDecorationLine: 'underline',
    letterSpacing: 0.2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    padding: spacing.lg,
    borderWidth: 1,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: typography.fontWeight.bold,
    marginBottom: 6,
  },
  modalSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: spacing.sm,
  },
  modalActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  modalActionBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
