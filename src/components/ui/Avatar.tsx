import { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { useTheme } from '@/hooks/useTheme';
import { typography } from '@/constants/theme';

export interface AvatarProps {
  name: string;
  photoUrl?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const SIZES = {
  sm: { dimension: 32, fontSize: 12 },
  md: { dimension: 44, fontSize: 16 },
  lg: { dimension: 64, fontSize: 24 },
  xl: { dimension: 96, fontSize: 36 },
};

export const Avatar = memo(({ name, photoUrl, size = 'md' }: AvatarProps) => {
  const { theme } = useTheme();
  const config = SIZES[size];

  const initials = name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  if (photoUrl) {
    return (
      <View
        style={[
          styles.container,
          {
            width: config.dimension,
            height: config.dimension,
            borderRadius: config.dimension / 2,
            borderColor: theme.accent,
          },
        ]}
      >
        <Image
          source={{ uri: photoUrl }}
          style={[
            styles.image,
            {
              width: config.dimension,
              height: config.dimension,
              borderRadius: config.dimension / 2,
            },
          ]}
          contentFit="cover"
          transition={200}
          cachePolicy="memory-disk"
        />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          width: config.dimension,
          height: config.dimension,
          borderRadius: config.dimension / 2,
          backgroundColor: theme.accentSoft,
          borderColor: theme.accent,
        },
      ]}
    >
      <Text
        style={[
          styles.initials,
          {
            color: theme.accentText,
            fontSize: config.fontSize,
          },
        ]}
      >
        {initials || '👤'}
      </Text>
    </View>
  );
});

Avatar.displayName = 'Avatar';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  image: {
    backgroundColor: 'transparent',
  },
  initials: {
    fontWeight: typography.fontWeight.bold,
  },
});
