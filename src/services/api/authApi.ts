import { apiRequest } from './apiClient';
import { AuthResult, AuthTokens, LoginInput, RegisterInput } from '@/types/auth';
import { normalizeUser } from './usersApi';

export const authApi = {
  async register(input: RegisterInput): Promise<AuthResult> {
    const res = await apiRequest<AuthResult>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(input),
      skipAuth: true,
    });
    return {
      ...res,
      user: normalizeUser(res.user),
    };
  },

  async login(input: LoginInput): Promise<AuthResult> {
    const res = await apiRequest<AuthResult>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(input),
      skipAuth: true,
    });
    return {
      ...res,
      user: normalizeUser(res.user),
    };
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

  async forgotPassword(email: string): Promise<{ message: string }> {
    return apiRequest<{ message: string }>('/auth/password/forgot', {
      method: 'POST',
      body: JSON.stringify({ email }),
      skipAuth: true,
    });
  },

  async resetPassword(dto: {
    email: string;
    code: string;
    newPassword: string;
  }): Promise<{ message: string }> {
    return apiRequest<{ message: string }>('/auth/password/reset', {
      method: 'POST',
      body: JSON.stringify(dto),
      skipAuth: true,
    });
  },
};
