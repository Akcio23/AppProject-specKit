import { apiClient, API_BASE_URL } from './apiClient';
import { User } from '@/types/auth';

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

  async uploadPhoto(fileUri: string, mimeType = 'image/jpeg'): Promise<User> {
    const formData = new FormData();
    const filename = fileUri.split('/').pop() ?? 'avatar.jpg';

    // Formato padrão do React Native para upload multipart/form-data
    formData.append('file', {
      uri: fileUri,
      name: filename,
      type: mimeType,
    } as unknown as Blob);

    const user = await apiClient.request<User>('/me/photo', {
      method: 'PUT',
      body: formData,
    });
    return this.normalizeUser(user);
  },

  async deletePhoto(): Promise<User> {
    const user = await apiClient.request<User>('/me/photo', {
      method: 'DELETE',
    });
    return this.normalizeUser(user);
  },

  normalizeUser(user: User): User {
    if (user.photoUrl && user.photoUrl.startsWith('/')) {
      // Converte rota relativa da API para URL absoluta acessível no mobile
      const baseRoot = API_BASE_URL.replace(/\/api\/v1\/?$/, '');
      return {
        ...user,
        photoUrl: `${baseRoot}/api/v1${user.photoUrl}`,
      };
    }
    return user;
  },
};
