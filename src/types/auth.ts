export interface User {
  id: string;
  name: string;
  email: string;
  photoUrl: string | null;
  createdAt: string;
}

export interface Preferences {
  theme: 'light' | 'dark' | 'system';
  translationId: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  accessTokenExpiresIn: number;
  refreshToken: string;
}

export interface AuthResult extends AuthTokens {
  user: User;
  preferences: Preferences;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  deviceName?: string;
}

export interface LoginInput {
  email: string;
  password: string;
  deviceName?: string;
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}
