import { apiRequest } from './apiClient';
import { AuthResult, AuthTokens, LoginInput, RegisterInput } from '@/types/auth';

export const authApi = {
  async register(input: RegisterInput): Promise<AuthResult> {
    return apiRequest<AuthResult>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(input),
      skipAuth: true,
    });
  },

  async login(input: LoginInput): Promise<AuthResult> {
    return apiRequest<AuthResult>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(input),
      skipAuth: true,
    });
  },

  async refresh(refreshToken: string): Promise<AuthTokens> {
    return apiRequest<AuthTokens>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
      skipAuth: true,
    });
  },

  async logout(refreshToken: string): Promise<void> {
    return apiRequest<void>('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
      skipAuth: true,
    });
  },
};
