import { apiClient } from './apiClient';
import { SavedVerse } from '@/types';
import { Preferences } from '@/types/auth';

export interface SavedVersePayload {
  reference: string;
  text: string;
  translation: string;
  savedAt: string;
}

export const accountApi = {
  async getPreferences(): Promise<Preferences> {
    return apiClient.request<Preferences>('/me/preferences', {
      method: 'GET',
    });
  },

  async updatePreferences(dto: Partial<Pick<Preferences, 'theme' | 'translationId'>>): Promise<Preferences> {
    return apiClient.request<Preferences>('/me/preferences', {
      method: 'PUT',
      body: JSON.stringify(dto),
    });
  },

  async getSavedVerses(): Promise<{ items: SavedVerse[] }> {
    return apiClient.request<{ items: SavedVerse[] }>('/me/saved-verses', {
      method: 'GET',
    });
  },

  async saveVerse(id: string, payload: SavedVersePayload): Promise<SavedVerse> {
    return apiClient.request<SavedVerse>(`/me/saved-verses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  async deleteSavedVerse(id: string): Promise<void> {
    await apiClient.request<void>(`/me/saved-verses/${id}`, {
      method: 'DELETE',
    });
  },
};
