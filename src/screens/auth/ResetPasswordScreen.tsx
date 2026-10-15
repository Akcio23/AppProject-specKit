import { memo, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Button, PasswordField, TextField, FormError } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { authApi } from '@/services/api/authApi';
import { ApiError } from '@/services/api/apiClient';
import { RootStackScreenProps } from '@/navigation/types';
import { spacing, typography, borderRadius } from '@/constants/theme';

export const ResetPasswordScreen = memo(
  ({ navigation, route }: RootStackScreenProps<'ResetPassword'>) => {
    const insets = useSafeAreaInsets();
    const { theme } = useTheme();

    const [email, setEmail] = useState(route.params?.email ?? '');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Validações de senha em tempo real
    const passwordChecks = useMemo(() => {
      return {
        length: newPassword.length >= 8,
        upper: /[A-Z]/.test(newPassword),
        number: /[0-9]/.test(newPassword),
        special: /[^a-zA-Z0-9]/.test(newPassword),
        match: newPassword.length > 0 && newPassword === confirmPassword,
      };
    }, [newPassword, confirmPassword]);

    const isCodeValid = useMemo(() => /^\d{6}$/.test(code.trim()), [code]);

    const isFormValid = useMemo(() => {
      const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
      const isPassValid =
        passwordChecks.length &&
        passwordChecks.upper &&
        passwordChecks.number &&
        passwordChecks.special &&
        passwordChecks.match;

      return isEmailValid && isCodeValid && isPassValid;
    }, [email, isCodeValid, passwordChecks]);

    const handleResetPassword = useCallback(async () => {
      if (!isFormValid || isLoading) return;

      try {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch {
        // Fallback
      }

      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await authApi.resetPassword({
          email: email.trim().toLowerCase(),
          code: code.trim(),
          newPassword,
        });

        setSuccessMessage(response.message || 'Senha redefinida com sucesso!');

        setTimeout(() => {
          navigation.navigate('SignIn');
        }, 1500);
      } catch (err: unknown) {
        if (err instanceof ApiError) {
          setErrorMessage(err.message);
        } else {
          setErrorMessage('Não foi possível redefinir a senha. Tente novamente.');
        }
      } finally {
        setIsLoading(false);
      }
    }, [email, code, newPassword, isFormValid, isLoading, navigation]);

    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={[styles.screen, { backgroundColor: theme.background }]}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: insets.top + spacing.lg, paddingBottom: insets.bottom + spacing.xl },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Pressable
              onPress={() => navigation.goBack()}
              hitSlop={12}
              style={[styles.closeBtn, { backgroundColor: theme.surfaceSubtle }]}
              accessibilityLabel="Voltar"
            >
              <Text style={[styles.closeIcon, { color: theme.textSecondary }]}>✕</Text>
            </Pressable>

            <Text style={[styles.title, { color: theme.textPrimary }]}>Definir Nova Senha</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Digite o código de 6 dígitos que enviamos por e-mail e crie sua nova senha.
            </Text>
          </View>

          {successMessage ? (
            <View
              style={[
                styles.successBox,
                { backgroundColor: theme.surfaceSubtle, borderColor: theme.borderSubtle },
              ]}
            >
              <Text style={styles.successIcon}>🎉 🔒</Text>
              <Text style={[styles.successTitle, { color: theme.textPrimary }]}>
                {successMessage}
              </Text>
              <Text style={[styles.successText, { color: theme.textSecondary }]}>
                Redirecionando você para a tela de login...
              </Text>
            </View>
          ) : (
            <>
              <FormError message={errorMessage} />

              <View style={styles.form}>
                <View style={styles.fieldWrapper}>
                  <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>E-MAIL</Text>
                  <TextField
                    value={email}
                    onChangeText={setEmail}
                    placeholder="seu@email.com"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    testID="reset-email-input"
                  />
                </View>

                <View style={styles.fieldWrapper}>
                  <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>
                    CÓDIGO DE 6 DÍGITOS
                  </Text>
                  <TextField
                    value={code}
                    onChangeText={setCode}
                    placeholder="123456"
                    keyboardType="number-pad"
                    maxLength={6}
                    testID="reset-code-input"
                  />
                </View>

                <PasswordField
                  label="NOVA SENHA"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Mínimo 8 caracteres"
                  testID="reset-new-password-input"
                />

                {/* Indicadores de requisitos de senha */}
                <View
                  style={[
                    styles.requirementsBox,
                    { backgroundColor: theme.surfaceSubtle, borderColor: theme.borderSubtle },
                  ]}
                >
                  <Text style={[styles.reqTitle, { color: theme.textSecondary }]}>
                    Sua nova senha precisa ter:
                  </Text>
                  <View style={styles.reqList}>
                    <Text
                      style={[
                        styles.reqItem,
                        { color: passwordChecks.length ? theme.success : theme.textMuted },
                      ]}
                    >
                      {passwordChecks.length ? '✓' : '○'} Mínimo de 8 caracteres
                    </Text>
                    <Text
                      style={[
                        styles.reqItem,
                        { color: passwordChecks.upper ? theme.success : theme.textMuted },
                      ]}
                    >
                      {passwordChecks.upper ? '✓' : '○'} Pelo menos uma letra maiúscula
                    </Text>
                    <Text
                      style={[
                        styles.reqItem,
                        { color: passwordChecks.number ? theme.success : theme.textMuted },
                      ]}
                    >
                      {passwordChecks.number ? '✓' : '○'} Pelo menos um número
                    </Text>
                    <Text
                      style={[
                        styles.reqItem,
                        { color: passwordChecks.special ? theme.success : theme.textMuted },
                      ]}
                    >
                      {passwordChecks.special ? '✓' : '○'} Pelo menos um caractere especial (!@#$)
                    </Text>
                  </View>
                </View>

                <PasswordField
                  label="CONFIRMAR NOVA SENHA"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Digite a nova senha novamente"
                  onSubmitEditing={handleResetPassword}
                  testID="reset-confirm-password-input"
                />

                {confirmPassword.length > 0 && !passwordChecks.match ? (
                  <Text style={[styles.matchError, { color: theme.danger }]}>
                    As senhas não coincidem.
                  </Text>
                ) : null}

                <Button
                  label="Redefinir e Salvar Senha"
                  onPress={handleResetPassword}
                  disabled={!isFormValid || isLoading}
                  loading={isLoading}
                  variant="primary"
                  size="lg"
                  testID="reset-submit-btn"
                />
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    );
  },
);

ResetPasswordScreen.displayName = 'ResetPasswordScreen';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
  },
  header: {
    marginBottom: spacing.lg,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    alignSelf: 'flex-start',
  },
  closeIcon: {
    fontSize: 16,
    fontWeight: typography.fontWeight.bold,
  },
  title: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: typography.letterSpacing.tight,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    lineHeight: 20,
  },
  form: {
    gap: spacing.lg,
    marginTop: spacing.sm,
  },
  fieldWrapper: {
    gap: spacing.xs,
  },
  fieldLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    letterSpacing: typography.letterSpacing.wide,
  },
  requirementsBox: {
    borderRadius: borderRadius.md,
    borderWidth: 1,
    padding: spacing.md,
    gap: spacing.xs,
  },
  reqTitle: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: 4,
  },
  reqList: {
    gap: 4,
  },
  reqItem: {
    fontSize: typography.fontSize.xs,
  },
  matchError: {
    fontSize: typography.fontSize.xs,
    marginTop: -spacing.sm,
  },
  successBox: {
    borderRadius: borderRadius.md,
    borderWidth: 1,
    padding: spacing.xl,
    alignItems: 'center',
    textAlign: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  successIcon: {
    fontSize: 36,
    marginBottom: spacing.xs,
  },
  successTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    textAlign: 'center',
  },
  successText: {
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
});
