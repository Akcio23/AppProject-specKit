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

export const SignUpScreen = memo(({ navigation }: RootStackScreenProps<'SignUp'>) => {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const signIn = useSessionStore((s) => s.signIn);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Validação em tempo real das regras de senha (FR-005)
  const passwordRules = useMemo(() => {
    return {
      minLength: password.length >= 8,
      hasLetter: /[A-Za-z]/.test(password),
      hasNumber: /\d/.test(password),
    };
  }, [password]);

  const isFormValid = useMemo(() => {
    const isNameValid = name.trim().length >= 2;
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    const isPassValid =
      passwordRules.minLength && passwordRules.hasLetter && passwordRules.hasNumber;
    return isNameValid && isEmailValid && isPassValid;
  }, [name, email, passwordRules]);

  const handleRegister = useCallback(async () => {
    if (!isFormValid || isLoading) return;

    try {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
      // Fallback
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await authApi.register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      await signIn(result);
      navigation.goBack();
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Não foi possível criar a conta. Verifique sua conexão e tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [isFormValid, isLoading, name, email, password, signIn, navigation]);

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

          <Text style={[styles.title, { color: theme.textPrimary }]}>Criar Conta</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Junte-se a nós para ter seus versículos guardados com segurança.
          </Text>
        </View>

        {/* Aviso amigável da regra de visitante (FR-022b, Q1=B) */}
        <View
          style={[
            styles.noticeBox,
            { backgroundColor: theme.surfaceSubtle, borderColor: theme.borderSubtle },
          ]}
        >
          <Text style={styles.noticeIcon}>💡</Text>
          <Text style={[styles.noticeText, { color: theme.textSecondary }]}>
            Seus versículos favoritados como visitante permanecem salvos neste aparelho e não serão
            transferidos para sua nova conta.
          </Text>
        </View>

        <FormError message={errorMessage} />

        <View style={styles.form}>
          <View style={styles.fieldWrapper}>
            <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>NOME COMPLETO</Text>
            <TextField
              value={name}
              onChangeText={setName}
              placeholder="Ex: João da Silva"
              testID="signup-name-input"
            />
          </View>

          <View style={styles.fieldWrapper}>
            <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>E-MAIL</Text>
            <TextField
              value={email}
              onChangeText={setEmail}
              placeholder="seu@email.com"
              testID="signup-email-input"
            />
          </View>

          <PasswordField
            label="SENHA"
            value={password}
            onChangeText={setPassword}
            placeholder="Crie uma senha forte"
            testID="signup-password-input"
          />

          {/* Checklist visual de regras de senha em tempo real */}
          <View style={styles.passwordRulesBox}>
            <Text style={[styles.rulesHeader, { color: theme.textMuted }]}>
              Requisitos da senha:
            </Text>
            <View style={styles.ruleItem}>
              <Text style={passwordRules.minLength ? styles.ruleMet : styles.rulePending}>
                {passwordRules.minLength ? '✓' : '○'} Mínimo de 8 caracteres
              </Text>
            </View>
            <View style={styles.ruleItem}>
              <Text style={passwordRules.hasLetter ? styles.ruleMet : styles.rulePending}>
                {passwordRules.hasLetter ? '✓' : '○'} Pelo menos uma letra
              </Text>
            </View>
            <View style={styles.ruleItem}>
              <Text style={passwordRules.hasNumber ? styles.ruleMet : styles.rulePending}>
                {passwordRules.hasNumber ? '✓' : '○'} Pelo menos um número
              </Text>
            </View>
          </View>

          <Button
            label="Criar Minha Conta"
            onPress={handleRegister}
            disabled={!isFormValid || isLoading}
            loading={isLoading}
            variant="primary"
            size="lg"
            testID="signup-submit-btn"
          />

          <View style={styles.footerRow}>
            <Text style={[styles.footerText, { color: theme.textSecondary }]}>
              Já possui uma conta?{' '}
            </Text>
            <Pressable onPress={() => navigation.replace('SignIn')}>
              <Text style={[styles.linkText, { color: theme.accentText }]}>Entrar agora</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
});

SignUpScreen.displayName = 'SignUpScreen';

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
  passwordRulesBox: {
    marginBottom: spacing.lg,
    gap: 4,
  },
  rulesHeader: {
    fontSize: typography.fontSize.xs - 1,
    fontWeight: typography.fontWeight.medium,
    marginBottom: 2,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ruleMet: {
    fontSize: typography.fontSize.xs,
    color: '#388E3C',
    fontWeight: typography.fontWeight.medium,
  },
  rulePending: {
    fontSize: typography.fontSize.xs,
    color: '#9E9E9E',
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
