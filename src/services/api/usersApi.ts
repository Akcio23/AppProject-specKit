import * as FileSystem from 'expo-file-system/legacy';
import { apiClient, getApiBaseUrl, ApiError, getAuthToken } from './apiClient';
import { User } from '@/types/auth';
import { normalizeUser } from './userUtils';

export { normalizeUser };

export const usersApi = {
  async getProfile(): Promise<User> {
    const user = await apiClient.request<User>('/me', {
      method: 'GET',
    });
    return this.normalizeUser(user);
  },

  async updateProfile(name: string): Promise<User> {
    const user = await apiClient.request<User>('/me', {
      method: 'PATCH',
      body: JSON.stringify({ name }),
    });
    return this.normalizeUser(user);
  },

  async uploadPhoto(fileUri: string, _mimeType = 'image/jpeg'): Promise<User> {
    const url = `${getApiBaseUrl()}/me/photo`;
    const token = getAuthToken();

    const response = await FileSystem.uploadAsync(url, fileUri, {
      httpMethod: 'POST',
      uploadType: FileSystem.FileSystemUploadType.MULTIPART,
      fieldName: 'file',
      headers: {
        Accept: 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (response.status < 200 || response.status >= 300) {
      let message = 'Falha ao enviar foto.';
      try {
        const errorJson = JSON.parse(response.body);
        message = errorJson?.error?.message ?? message;
      } catch {
        // fallback
      }
      throw new ApiError('UPLOAD_FAILED', message, response.status);
    }

    const json = JSON.parse(response.body);
    const user = (json?.data !== undefined ? json.data : json) as User;
    return this.normalizeUser(user);
  },

  async deletePhoto(): Promise<User> {
    const user = await apiClient.request<User>('/me/photo', {
      method: 'DELETE',
    });
    return normalizeUser(user);
  },

  async deleteAccount(password: string): Promise<void> {
    await apiClient.request<void>('/me', {
      method: 'DELETE',
      body: JSON.stringify({ password }),
    });
  },

  normalizeUser(user: User): User {
    return normalizeUser(user);
  },
};


