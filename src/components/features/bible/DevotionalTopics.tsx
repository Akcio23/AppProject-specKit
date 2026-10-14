import { memo, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { colors, spacing, borderRadius, typography } from '@/constants/theme';

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
  const handlePress = useCallback(
    (reference: string) => {
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
                pressed ? styles.cardPressed : null,
              ]}
            >
              <View style={styles.iconCircle}>
                <Text style={styles.icon}>{topic.icon}</Text>
              </View>
              <Text style={styles.topicTitle}>{topic.title}</Text>
              <Text numberOfLines={1} style={styles.topicSubtitle}>
                {topic.subtitle}
              </Text>
              <View style={styles.referenceBadge}>
                <Text style={styles.referenceText}>{topic.reference}</Text>
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
            pressed ? styles.cardPressed : null,
          ]}
        >
          <View style={styles.gridHeader}>
            <View style={styles.iconCircle}>
              <Text style={styles.icon}>{topic.icon}</Text>
            </View>
            <View style={styles.referenceBadge}>
              <Text style={styles.referenceText}>{topic.reference}</Text>
            </View>
          </View>
          <Text style={styles.topicTitle}>{topic.title}</Text>
          <Text style={styles.topicSubtitle}>{topic.subtitle}</Text>
          <Text style={styles.readPrompt}>Toque para ler a passagem →</Text>
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
    backgroundColor: colors.surfaceDark,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.borderDark,
    padding: spacing.md,
    width: 168,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 3,
  },
  gridContainer: {
    gap: spacing.md,
    paddingBottom: spacing.lg,
  },
  gridCard: {
    backgroundColor: colors.surfaceDark,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.borderDark,
    padding: spacing.md,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 2,
  },
  gridHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
    borderColor: colors.primary,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceSubtleDark,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderGold,
  },
  icon: {
    fontSize: 20,
  },
  topicTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimaryDark,
    marginBottom: 2,
  },
  topicSubtitle: {
    fontSize: typography.fontSize.xs + 1,
    color: colors.textMutedDark,
    marginBottom: spacing.sm,
    lineHeight: 18,
  },
  referenceBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceSubtleDark,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.borderGold,
  },
  referenceText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.primary,
  },
  readPrompt: {
    fontSize: typography.fontSize.xs,
    color: colors.primary,
    fontWeight: typography.fontWeight.semibold,
    marginTop: spacing.xs,
  },
});
