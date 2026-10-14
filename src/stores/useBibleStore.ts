import { create } from 'zustand';
import { DEFAULT_TRANSLATION_ID } from '@/constants/bible';
import { BibleState } from '@/types/bible';

export const useBibleStore = create<BibleState>((set) => ({
  translationId: DEFAULT_TRANSLATION_ID,
  setTranslationId: (translationId) => set({ translationId }),
}));
