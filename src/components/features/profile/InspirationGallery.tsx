import { memo, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/hooks/useTheme';
import { InspirationGalleryItem } from '@/types';
import { spacing, typography, shadows } from '@/constants/theme';

export interface InspirationGalleryProps {
  items?: InspirationGalleryItem[];
  onPressFeatured?: (item: InspirationGalleryItem) => void;
  onPressItem?: (item: InspirationGalleryItem) => void;
}

const DEFAULT_GALLERY_ITEMS: InspirationGalleryItem[] = [
  {
    id: 'featured-sanctuary',
    title: 'Santuário de Paz & Oração',
    subtitle: 'O Senhor é meu refúgio e fortaleza.',
    reference: 'Salmos 91:2',
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop',
    aspectRatio: 'panoramic',
    tag: 'Destaque',
  },
  {
    id: 'eiffel-dawn',
    title: 'Alvorada de Luz',
    subtitle: 'Tua palavra é lâmpada para os meus pés.',
    reference: 'Salmos 119:105',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=400&auto=format&fit=crop',
    aspectRatio: 'square',
  },
  {
    id: 'pagoda-peace',
    title: 'Serenidade Interior',
    subtitle: 'A paz de Deus excede todo entendimento.',
    reference: 'Filipenses 4:7',
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=400&auto=format&fit=crop',
    aspectRatio: 'square',
  },
  {
    id: 'mountain-majesty',
    title: 'Montanhas Sagradas',
    subtitle: 'Elevo os olhos para os montes.',
    reference: 'Salmos 121:1',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=400&auto=format&fit=crop',
    aspectRatio: 'square',
  },
];

export const InspirationGallery = memo(({
  items = DEFAULT_GALLERY_ITEMS,
  onPressFeatured,
  onPressItem,
}: InspirationGalleryProps) => {
  const { theme } = useTheme();

  const featuredItem = items.find((i) => i.aspectRatio === 'panoramic') || items[0];
  const thumbnailItems = items.filter((i) => i.id !== featuredItem?.id);

  const handleFeaturedPress = useCallback(() => {
    if (!featuredItem) return;
    try {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Fallback
    }
    onPressFeatured?.(featuredItem);
  }, [featuredItem, onPressFeatured]);

  const handleThumbPress = useCallback((item: InspirationGalleryItem) => {
    try {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Fallback
    }
    onPressItem?.(item);
  }, [onPressItem]);

  return (
    <View style={styles.container}>
      {/* Título da Seção */}
      <View style={styles.headerRow}>
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          Galeria
        </Text>
        <Feather name="image" size={16} color={theme.textMuted} />
      </View>

      {/* Card Principal Panorâmico */}
      {featuredItem && (
        <Pressable
          onPress={handleFeaturedPress}
          accessibilityRole="button"
          accessibilityLabel={`Destaque da galeria: ${featuredItem.title}`}
          style={({ pressed }) => [
            styles.featuredCard,
            shadows.soft,
            { backgroundColor: theme.surfaceCard, borderColor: theme.borderSubtle },
            pressed && { opacity: 0.9 },
          ]}
        >
          <Image
            source={{ uri: featuredItem.imageUrl }}
            style={styles.featuredImage}
            contentFit="cover"
            transition={300}
            cachePolicy="memory-disk"
          />
          <View style={styles.featuredOverlay}>
            <View style={styles.featuredTagPill}>
              <Text style={styles.featuredTagText}>
                {featuredItem.reference || 'Inspiração'}
              </Text>
            </View>
            <Text style={styles.featuredTitle} numberOfLines={1}>
              {featuredItem.title}
            </Text>
            <Text style={styles.featuredSubtitle} numberOfLines={1}>
              {featuredItem.subtitle}
            </Text>
          </View>
        </Pressable>
      )}

      {/* Linha de Miniaturas em Carrossel Horizontal */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.thumbnailsScroll}
      >
        {thumbnailItems.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => handleThumbPress(item)}
            accessibilityRole="button"
            accessibilityLabel={`Imagem da galeria: ${item.title}`}
            style={({ pressed }) => [
              styles.thumbnailCard,
              shadows.soft,
              { backgroundColor: theme.surfaceCard, borderColor: theme.borderSubtle },
              pressed && { opacity: 0.8 },
            ]}
          >
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.thumbnailImage}
              contentFit="cover"
              transition={200}
              cachePolicy="memory-disk"
            />
            <View style={styles.thumbnailOverlay}>
              <Text style={styles.thumbnailTitle} numberOfLines={1}>
                {item.title}
              </Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingTop: spacing.xs,
    paddingBottom: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xs,
  },
  sectionTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    letterSpacing: 0.3,
  },
  featuredCard: {
    marginHorizontal: spacing.lg,
    height: 140,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    position: 'relative',
    marginBottom: spacing.md,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.38)',
    justifyContent: 'flex-end',
    padding: spacing.md,
  },
  featuredTagPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginBottom: 4,
  },
  featuredTagText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 0.5,
  },
  featuredTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: typography.fontWeight.bold,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  featuredSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 11,
    marginTop: 2,
  },
  thumbnailsScroll: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  thumbnailCard: {
    width: 96,
    height: 96,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    position: 'relative',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  thumbnailOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    paddingVertical: 3,
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  thumbnailTitle: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: typography.fontWeight.medium,
    textAlign: 'center',
  },
});
