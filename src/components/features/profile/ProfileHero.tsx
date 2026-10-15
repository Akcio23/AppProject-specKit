import { memo, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Avatar } from '@/components/ui/Avatar';
import { LanguagePillSelector } from '@/components/ui/LanguagePillSelector';
import { useTheme } from '@/hooks/useTheme';
import { spacing, typography, shadows } from '@/constants/theme';

export interface ProfileHeroProps {
  name: string;
  email?: string;
  photoUrl?: string | null;
  subtitle?: string;
  memberSince?: string;
  onPressBack?: () => void;
  onPressOptions?: () => void;
  onPressAvatar?: () => void;
}

export const ProfileHero = memo(({
  name,
  photoUrl,
  subtitle = 'Buscador da Palavra & Discípulo',
  memberSince,
  onPressBack,
  onPressOptions,
  onPressAvatar,
}: ProfileHeroProps) => {
  const { theme } = useTheme();

  const handleBack = useCallback(() => {
    try {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Fallback
    }
    onPressBack?.();
  }, [onPressBack]);

  const handleOptions = useCallback(() => {
    try {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Fallback
    }
    onPressOptions?.();
  }, [onPressOptions]);

  const handleAvatar = useCallback(() => {
    try {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Fallback
    }
    onPressAvatar?.();
  }, [onPressAvatar]);

  return (
    <View style={styles.container}>
      {/* Barra de Ações Superior (Voltar e Opções ...) */}
      <View style={styles.topBar}>
        <Pressable
          onPress={handleBack}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          style={({ pressed }) => [
            styles.iconButton,
            pressed && { opacity: 0.6 },
          ]}
        >
          <Feather name="arrow-left" size={22} color={theme.textPrimary} />
        </Pressable>

        <Pressable
          onPress={handleOptions}
          accessibilityRole="button"
          accessibilityLabel="Opções de perfil e conta"
          style={({ pressed }) => [
            styles.iconButton,
            pressed && { opacity: 0.6 },
          ]}
        >
          <Feather name="more-horizontal" size={22} color={theme.textPrimary} />
        </Pressable>
      </View>

      {/* Avatar Central com Halo */}
      <Pressable
        onPress={handleAvatar}
        accessibilityRole="button"
        accessibilityLabel="Alterar foto de perfil"
        style={({ pressed }) => [
          styles.avatarWrapper,
          pressed && { opacity: 0.85 },
        ]}
      >
        <View
          style={[
            styles.avatarRing,
            shadows.soft,
            {
              borderColor: theme.borderSubtle,
              backgroundColor: theme.surfaceCard,
            },
          ]}
        >
          <Avatar name={name || 'Usuário'} photoUrl={photoUrl} size="xl" />
        </View>
      </Pressable>

      {/* Nome do Usuário */}
      <Text
        style={[styles.userName, { color: theme.textPrimary }]}
        numberOfLines={1}
      >
        {name || 'Nome do Usuário'}
      </Text>

      {/* Subtítulo / Bio & Data */}
      <Text style={[styles.userSubtitle, { color: theme.textSecondary }]}>
        {subtitle}
      </Text>

      {memberSince ? (
        <Text style={[styles.memberSinceText, { color: theme.textMuted }]}>
          Membro desde {memberSince}
        </Text>
      ) : null}

      {/* Seletor Minimalista de Idioma */}
      <View style={styles.languageContainer}>
        <LanguagePillSelector compact />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
  },
  topBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarWrapper: {
    marginBottom: spacing.sm,
  },
  avatarRing: {
    padding: 4,
    borderRadius: 60,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontSize: 22,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: -0.3,
    marginBottom: 4,
    textAlign: 'center',
  },
  userSubtitle: {
    fontSize: typography.fontSize.sm,
    lineHeight: 18,
    textAlign: 'center',
    marginBottom: 2,
  },
  memberSinceText: {
    fontSize: typography.fontSize.xs,
    marginBottom: spacing.xs,
  },
  languageContainer: {
    marginTop: spacing.sm,
  },
});
