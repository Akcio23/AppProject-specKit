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
import { Button, TextField, FormError } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { authApi } from '@/services/api/authApi';
import { ApiError } from '@/services/api/apiClient';
import { RootStackScreenProps } from '@/navigation/types';
import { spacing, typography, borderRadius } from '@/constants/theme';

export const ForgotPasswordScreen = memo(
  ({ navigation }: RootStackScreenProps<'ForgotPassword'>) => {
    const insets = useSafeAreaInsets();
    const { theme } = useTheme();

    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isSent, setIsSent] = useState(false);

    const isEmailValid = useMemo(() => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    }, [email]);

    const handleSendCode = useCallback(async () => {
      if (!isEmailValid || isLoading) return;

      try {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch {
        // Fallback
      }

      setIsLoading(true);
      setErrorMessage(null);

      try {
        await authApi.forgotPassword(email.trim().toLowerCase());
        setIsSent(true);

        // Aguarda 1s para o usuário ler o feedback e navega para a tela de redefinição
        setTimeout(() => {
          navigation.navigate('ResetPassword', { email: email.trim().toLowerCase() });
        }, 1200);
      } catch (err: unknown) {
        if (err instanceof ApiError) {
          setErrorMessage(err.message);
        } else {
          setErrorMessage('Não foi possível enviar o código. Verifique sua conexão.');
        }
      } finally {
        setIsLoading(false);
      }
    }, [email, isEmailValid, isLoading, navigation]);

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

            <Text style={[styles.title, { color: theme.textPrimary }]}>Recuperar Senha</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Informe o e-mail cadastrado para receber um código de 6 dígitos.
            </Text>
          </View>

          {isSent ? (
            <View
              style={[
                styles.successBox,
                { backgroundColor: theme.surfaceSubtle, borderColor: theme.borderSubtle },
              ]}
            >
              <Text style={styles.successIcon}>✉️ ✨</Text>
              <Text style={[styles.successTitle, { color: theme.textPrimary }]}>
                Código enviado!
              </Text>
              <Text style={[styles.successText, { color: theme.textSecondary }]}>
                Verifique sua caixa de entrada e spam. Redirecionando para a tela de redefinição...
              </Text>
            </View>
          ) : (
            <>
              <FormError message={errorMessage} />

              <View style={styles.form}>
                <View style={styles.fieldWrapper}>
                  <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>
                    SEU E-MAIL CADASTRADO
                  </Text>
                  <TextField
                    value={email}
                    onChangeText={setEmail}
                    placeholder="seu@email.com"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    onSubmitEditing={handleSendCode}
                    testID="forgot-email-input"
                  />
                </View>

                <Button
                  label="Enviar Código de 6 Dígitos"
                  onPress={handleSendCode}
                  disabled={!isEmailValid || isLoading}
                  loading={isLoading}
                  variant="primary"
                  size="lg"
                  testID="forgot-submit-btn"
                />

                <View style={styles.footerRow}>
                  <Text style={[styles.footerText, { color: theme.textSecondary }]}>
                    Já possui o código?{' '}
                  </Text>
                  <Pressable
                    onPress={() =>
                      navigation.navigate('ResetPassword', { email: email.trim().toLowerCase() })
                    }
                  >
                    <Text style={[styles.linkText, { color: theme.accentText }]}>
                      Redefinir agora
                    </Text>
                  </Pressable>
                </View>
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    );
  },
);

ForgotPasswordScreen.displayName = 'ForgotPasswordScreen';

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
  },
  successText: {
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  footerText: {
    fontSize: typography.fontSize.sm,
  },
  linkText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
});
