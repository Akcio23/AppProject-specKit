import { create } from 'zustand';
import { AppState } from '@/types';

export const useAppStore = create<AppState>((set) => ({
  counter: 0,
  isDarkMode: true,
  incrementCounter: () => set((state) => ({ counter: state.counter + 1 })),
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  resetCounter: () => set({ counter: 0 }),
}));
