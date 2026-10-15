import { useMemo, useState, useCallback } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import {
  BibleBook,
  BIBLE_BOOKS_PT,
  filterBibleBooks,
  Testament,
} from '@/constants/bibleBooksPt';
import { borderRadius, spacing, typography } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';

export interface BookPickerModalProps {
  visible: boolean;
  selectedBookId?: string;
  onSelect: (book: BibleBook) => void;
  onClose: () => void;
}

const TABS: { id: Testament; label: string; count: number }[] = [
  { id: 'ALL', label: 'Todos', count: 66 },
  { id: 'OT', label: 'Antigo', count: 39 },
  { id: 'NT', label: 'Novo', count: 27 },
];

export function BookPickerModal({
  visible,
  selectedBookId,
  onSelect,
  onClose,
}: BookPickerModalProps) {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<Testament>('ALL');

  const filteredBooks = useMemo(
    () => filterBibleBooks(BIBLE_BOOKS_PT, search, activeTab),
    [search, activeTab],
  );

  const handleSelectBook = useCallback(
    (book: BibleBook) => {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onSelect(book);
      onClose();
    },
    [onSelect, onClose],
  );

  const handleTabChange = useCallback((tab: Testament) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveTab(tab);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearch('');
  }, []);

  const renderBookItem = ({ item }: { item: BibleBook }) => {
    const isSelected = item.id === selectedBookId;

    return (
      <Pressable
        onPress={() => handleSelectBook(item)}
        style={({ pressed }) => [
          styles.bookItem,
          {
            backgroundColor: isSelected ? theme.accentSoft : theme.surfaceCard,
            borderColor: isSelected ? theme.accent : theme.borderSubtle,
          },
          pressed && styles.bookItemPressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel={`${item.name}, ${item.testament === 'OT' ? 'Antigo Testamento' : 'Novo Testamento'}`}
        accessibilityState={{ selected: isSelected }}
      >
        <View style={styles.bookItemLeft}>
          <View
            style={[
              styles.bookBadge,
              {
                backgroundColor: isSelected
                  ? theme.accent
                  : theme.surfaceSubtle,
              },
            ]}
          >
            <Text
              style={[
                styles.bookBadgeText,
                {
                  color: isSelected ? theme.textPrimary : theme.textSecondary,
                },
              ]}
            >
              {item.id}
            </Text>
          </View>

          <View style={styles.bookInfo}>
            <Text
              style={[
                styles.bookName,
                {
                  color: theme.textPrimary,
                  fontWeight: isSelected
                    ? typography.fontWeight.bold
                    : typography.fontWeight.medium,
                },
              ]}
            >
              {item.name}
            </Text>
            <Text style={[styles.bookOrder, { color: theme.textMuted }]}>
              {item.testament === 'OT' ? 'Antigo Testamento' : 'Novo Testamento'} · Livro {item.order}
            </Text>
          </View>
        </View>

        {isSelected ? (
          <Feather name="check" size={18} color={theme.accent} />
        ) : (
          <Feather name="chevron-right" size={18} color={theme.textMuted} />
        )}
      </Pressable>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable
          style={styles.backdrop}
          onPress={onClose}
          accessibilityLabel="Fechar seleção de livros"
        />

        <View
          style={[
            styles.sheetContainer,
            {
              backgroundColor: theme.background,
              borderColor: theme.borderSubtle,
              paddingBottom: insets.bottom + spacing.sm,
            },
          ]}
        >
          {/* Alça visual de arraste */}
          <View style={styles.handleWrapper}>
            <View
              style={[styles.dragHandle, { backgroundColor: theme.divider }]}
            />
          </View>

          {/* Cabeçalho */}
          <View style={styles.header}>
            <View>
              <Text style={[styles.title, { color: theme.textPrimary }]}>
                Escolha o Livro
              </Text>
              <Text style={[styles.subtitle, { color: theme.textMuted }]}>
                66 livros canônicos em português
              </Text>
            </View>

            <Pressable
              onPress={onClose}
              style={({ pressed }) => [
                styles.closeButton,
                {
                  backgroundColor: theme.surfaceCard,
                  borderColor: theme.borderSubtle,
                },
                pressed && styles.buttonPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Fechar modal"
            >
              <Feather name="x" size={18} color={theme.textPrimary} />
            </Pressable>
          </View>

          {/* Barra de Busca Rápida */}
          <View
            style={[
              styles.searchBar,
              {
                backgroundColor: theme.surfaceCard,
                borderColor: theme.borderSubtle,
              },
            ]}
          >
            <Feather name="search" size={16} color={theme.textMuted} />
            <TextInput
              style={[styles.searchInput, { color: theme.textPrimary }]}
              value={search}
              onChangeText={setSearch}
              placeholder="Filtrar por nome ou sigla (ex: Jo, Mateus)..."
              placeholderTextColor={theme.textMuted}
              autoCapitalize="none"
              autoCorrect={false}
              clearButtonMode="while-editing"
            />
            {search.length > 0 && (
              <Pressable
                onPress={handleClearSearch}
                hitSlop={8}
                accessibilityLabel="Limpar busca"
              >
                <Feather name="x-circle" size={16} color={theme.textMuted} />
              </Pressable>
            )}
          </View>

          {/* Abas por Testamento */}
          <View style={styles.tabsRow}>
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <Pressable
                  key={tab.id}
                  onPress={() => handleTabChange(tab.id)}
                  style={[
                    styles.tabPill,
                    {
                      backgroundColor: isActive
                        ? theme.accent
                        : theme.surfaceCard,
                      borderColor: isActive
                        ? theme.accent
                        : theme.borderSubtle,
                    },
                  ]}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isActive }}
                >
                  <Text
                    style={[
                      styles.tabText,
                      {
                        color: isActive
                          ? theme.textPrimary
                          : theme.textSecondary,
                        fontWeight: isActive
                          ? typography.fontWeight.bold
                          : typography.fontWeight.regular,
                      },
                    ]}
                  >
                    {tab.label} ({tab.count})
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Lista de Livros */}
          <FlatList
            data={filteredBooks}
            keyExtractor={(item) => item.id}
            renderItem={renderBookItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Feather name="info" size={24} color={theme.textMuted} />
                <Text style={[styles.emptyText, { color: theme.textMuted }]}>
                  Nenhum livro encontrado para &quot;{search}&quot;.
                </Text>
              </View>
            }
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  sheetContainer: {
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    maxHeight: '85%',
    minHeight: '60%',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
  },
  handleWrapper: {
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  dragHandle: {
    width: 36,
    height: 4,
    borderRadius: borderRadius.full,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  subtitle: {
    fontSize: typography.fontSize.xs,
    marginTop: 2,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    opacity: 0.7,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs + 2,
    gap: spacing.xs + 2,
    marginBottom: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    paddingVertical: 0,
  },
  tabsRow: {
    flexDirection: 'row',
    gap: spacing.xs + 2,
    marginBottom: spacing.sm,
  },
  tabPill: {
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: spacing.xs + 1,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  tabText: {
    fontSize: typography.fontSize.xs,
  },
  listContent: {
    paddingBottom: spacing.lg,
    gap: spacing.xs + 2,
  },
  bookItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm + 2,
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
  bookItemPressed: {
    opacity: 0.8,
  },
  bookItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  bookBadge: {
    width: 44,
    height: 32,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookBadgeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  bookInfo: {
    flex: 1,
  },
  bookName: {
    fontSize: typography.fontSize.sm + 1,
  },
  bookOrder: {
    fontSize: 11,
    marginTop: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.xs,
  },
  emptyText: {
    fontSize: typography.fontSize.xs,
    textAlign: 'center',
  },
});
