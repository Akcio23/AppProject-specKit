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
import { useSessionStore } from '@/stores/useSessionStore';
import { authApi } from '@/services/api/authApi';
import { ApiError } from '@/services/api/apiClient';
import { RootStackScreenProps } from '@/navigation/types';
import { spacing, typography, borderRadius } from '@/constants/theme';

export const SignInScreen = memo(({ navigation }: RootStackScreenProps<'SignIn'>) => {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const signIn = useSessionStore((s) => s.signIn);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isFormValid = useMemo(() => {
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    const isPassValid = password.length >= 1;
    return isEmailValid && isPassValid;
  }, [email, password]);

  const handleLogin = useCallback(async () => {
    if (!isFormValid || isLoading) return;

    try {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
      // Fallback
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await authApi.login({
        email: email.trim().toLowerCase(),
        password,
      });

      await signIn(result);
      navigation.goBack();
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Não foi possível entrar. Verifique sua conexão e tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [isFormValid, isLoading, email, password, signIn, navigation]);

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
            accessibilityLabel="Fechar formulário"
          >
            <Text style={[styles.closeIcon, { color: theme.textSecondary }]}>✕</Text>
          </Pressable>

          <Text style={[styles.title, { color: theme.textPrimary }]}>Bem-vindo de Volta</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Acesse sua conta para recuperar seus versículos e preferências.
          </Text>
        </View>

        {/* Aviso de favoritos do modo visitante */}
        <View
          style={[
            styles.noticeBox,
            { backgroundColor: theme.surfaceSubtle, borderColor: theme.borderSubtle },
          ]}
        >
          <Text style={styles.noticeIcon}>📖</Text>
          <Text style={[styles.noticeText, { color: theme.textSecondary }]}>
            Ao entrar na sua conta, você visualizará seus favoritos sincronizados. Os favoritos
            salvos sem conta permanecem seguros neste aparelho.
          </Text>
        </View>

        <FormError message={errorMessage} />

        <View style={styles.form}>
          <View style={styles.fieldWrapper}>
            <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>E-MAIL</Text>
            <TextField
              value={email}
              onChangeText={setEmail}
              placeholder="seu@email.com"
              testID="signin-email-input"
            />
          </View>

          <PasswordField
            label="SENHA"
            value={password}
            onChangeText={setPassword}
            placeholder="Sua senha secreta"
            onSubmitEditing={handleLogin}
            testID="signin-password-input"
          />

          <Pressable
            onPress={() => navigation.navigate('ForgotPassword')}
            style={styles.forgotBtn}
            accessibilityLabel="Esqueci minha senha"
          >
            <Text style={[styles.forgotText, { color: theme.accentText }]}>
              Esqueci minha senha
            </Text>
          </Pressable>

          <Button
            label="Entrar na Minha Conta"
            onPress={handleLogin}
            disabled={!isFormValid || isLoading}
            loading={isLoading}
            variant="primary"
            size="lg"
            testID="signin-submit-btn"
          />

          <View style={styles.footerRow}>
            <Text style={[styles.footerText, { color: theme.textSecondary }]}>
              Ainda não tem conta?{' '}
            </Text>
            <Pressable onPress={() => navigation.replace('SignUp')}>
              <Text style={[styles.linkText, { color: theme.accentText }]}>Criar agora</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
});

SignInScreen.displayName = 'SignInScreen';

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
  noticeBox: {
    flexDirection: 'row',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginBottom: spacing.lg,
    gap: spacing.sm,
    alignItems: 'center',
  },
  noticeIcon: {
    fontSize: 16,
  },
  noticeText: {
    flex: 1,
    fontSize: typography.fontSize.xs,
    lineHeight: 18,
  },
  form: {
    gap: spacing.xs,
  },
  fieldWrapper: {
    marginBottom: spacing.md,
  },
  fieldLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.xs,
    letterSpacing: typography.letterSpacing.wide,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    paddingVertical: spacing.xs,
    marginBottom: spacing.md,
  },
  forgotText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  footerText: {
    fontSize: typography.fontSize.sm,
  },
  linkText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
});
