import { memo, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { spacing, borderRadius, typography, shadows } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';

export interface DevotionalTopicItem {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  reference: string;
}

export const DEVOTIONAL_TOPICS: DevotionalTopicItem[] = [
  {
    id: 'paz',
    icon: '🕊️',
    title: 'Paz Interior',
    subtitle: 'Alívio para a ansiedade e descanso',
    reference: 'Filipenses 4:6-7',
  },
  {
    id: 'protecao',
    icon: '🛡️',
    title: 'Refúgio Seguro',
    subtitle: 'A sombra do Onipotente',
    reference: 'Salmos 91:1-2',
  },
  {
    id: 'esperanca',
    icon: '🌿',
    title: 'Esperança Viva',
    subtitle: 'Planos de paz e futuro abençoado',
    reference: 'Jeremias 29:11',
  },
  {
    id: 'pastor',
    icon: '🐑',
    title: 'O Bom Pastor',
    subtitle: 'O Senhor é meu pastor, nada me faltará',
    reference: 'Salmos 23:1-3',
  },
  {
    id: 'amor',
    icon: '❤️',
    title: 'Amor Divino',
    subtitle: 'O amor é paciente e benigno',
    reference: '1 Coríntios 13:4-7',
  },
  {
    id: 'coragem',
    icon: '🦁',
    title: 'Força & Coragem',
    subtitle: 'Não temas nem te espantes',
    reference: 'Josué 1:9',
  },
  {
    id: 'sabedoria',
    icon: '💡',
    title: 'Sabedoria',
    subtitle: 'Confia no Senhor de todo teu coração',
    reference: 'Provérbios 3:5-6',
  },
  {
    id: 'gratidao',
    icon: '☀️',
    title: 'Coração Grato',
    subtitle: 'Bendize ao Senhor e não esqueças seus bens',
    reference: 'Salmos 103:1-2',
  },
];

interface DevotionalTopicsProps {
  onSelectTopic: (reference: string) => void;
  mode?: 'grid' | 'carousel';
}

export const DevotionalTopics = memo(({ onSelectTopic, mode = 'grid' }: DevotionalTopicsProps) => {
  const { theme } = useTheme();

  const handlePress = useCallback(
    (reference: string) => {
      try {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {
        // Fallback
      }
      onSelectTopic(reference);
    },
    [onSelectTopic],
  );

  if (mode === 'carousel') {
    return (
      <View style={styles.container}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carouselContent}
        >
          {DEVOTIONAL_TOPICS.map((topic) => (
            <Pressable
              key={topic.id}
              onPress={() => handlePress(topic.reference)}
              style={({ pressed }) => [
                styles.carouselCard,
                shadows.soft,
                {
                  backgroundColor: theme.surfaceCard,
                  borderColor: theme.borderSubtle,
                },
                pressed && styles.cardPressed,
              ]}
            >
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: theme.accentSoft, borderColor: theme.accent },
                ]}
              >
                <Text style={styles.icon}>{topic.icon}</Text>
              </View>
              <Text style={[styles.topicTitle, { color: theme.textPrimary }]}>
                {topic.title}
              </Text>
              <Text numberOfLines={1} style={[styles.topicSubtitle, { color: theme.textSecondary }]}>
                {topic.subtitle}
              </Text>
              <View
                style={[
                  styles.referenceBadge,
                  { backgroundColor: theme.surfaceSubtle, borderColor: theme.borderSubtle },
                ]}
              >
                <Text style={[styles.referenceText, { color: theme.textPrimary }]}>
                  {topic.reference}
                </Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.gridContainer}>
      {DEVOTIONAL_TOPICS.map((topic) => (
        <Pressable
          key={topic.id}
          onPress={() => handlePress(topic.reference)}
          style={({ pressed }) => [
            styles.gridCard,
            shadows.soft,
            {
              backgroundColor: theme.surfaceCard,
              borderColor: theme.borderSubtle,
            },
            pressed && styles.cardPressed,
          ]}
        >
          <View style={styles.gridHeader}>
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: theme.accentSoft, borderColor: theme.accent },
              ]}
            >
              <Text style={styles.icon}>{topic.icon}</Text>
            </View>
            <View
              style={[
                styles.referenceBadge,
                { backgroundColor: theme.accentSoft, borderColor: theme.accent },
              ]}
            >
              <Text style={[styles.referenceText, { color: theme.accentText }]}>
                {topic.reference}
              </Text>
            </View>
          </View>
          <Text style={[styles.topicTitle, { color: theme.textPrimary }]}>
            {topic.title}
          </Text>
          <Text style={[styles.topicSubtitle, { color: theme.textSecondary }]}>
            {topic.subtitle}
          </Text>
          <Text style={[styles.readPrompt, { color: theme.textMuted }]}>
            Ler passagem →
          </Text>
        </Pressable>
      ))}
    </View>
  );
});

DevotionalTopics.displayName = 'DevotionalTopics';

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  carouselContent: {
    paddingVertical: spacing.xs,
    gap: spacing.sm + 2,
  },
  carouselCard: {
    borderRadius: borderRadius.md,
    borderWidth: 1,
    padding: spacing.md,
    width: 168,
  },
  gridContainer: {
    gap: spacing.sm + 4,
    paddingBottom: spacing.lg,
  },
  gridCard: {
    borderRadius: borderRadius.md,
    borderWidth: 1,
    padding: spacing.md + 2,
  },
  gridHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  cardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.985 }],
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  icon: {
    fontSize: 18,
  },
  topicTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    marginBottom: 2,
  },
  topicSubtitle: {
    fontSize: typography.fontSize.xs + 1,
    marginBottom: spacing.sm,
    lineHeight: 18,
  },
  referenceBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  referenceText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  readPrompt: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    marginTop: spacing.xs,
  },
});
