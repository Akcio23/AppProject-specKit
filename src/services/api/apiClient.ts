import { Platform } from 'react-native';
import { ApiErrorResponse } from '@/types/auth';

const resolveBaseUrl = (): string => {
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  if (envUrl) {
    if (Platform.OS === 'android' && envUrl.includes('localhost')) {
      return envUrl.replace('localhost', '10.0.2.2');
    }
    return envUrl;
  }
  const defaultHost = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
  return `http://${defaultHost}:3000/api/v1`;
};

export const API_BASE_URL: string = resolveBaseUrl();

export class ApiError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status?: number,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type TokenProvider = () => string | null;
type TokenRefresher = () => Promise<string | null>;
type SessionRevocationHandler = (reason?: string) => void;

let tokenProvider: TokenProvider = () => null;
let tokenRefresher: TokenRefresher = async () => null;
let revocationHandler: SessionRevocationHandler = () => {};

export function configureApiClient(config: {
  getToken: TokenProvider;
  refreshToken: TokenRefresher;
  onRevoked: SessionRevocationHandler;
}) {
  tokenProvider = config.getToken;
  tokenRefresher = config.refreshToken;
  revocationHandler = config.onRevoked;
}

// Single-flight lock para refresh de token simultâneo
let refreshPromise: Promise<string | null> | null = null;

async function executeRefresh(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = tokenRefresher().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
  timeoutMs?: number;
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { skipAuth = false, timeoutMs = 12000, ...fetchOptions } = options;
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers = new Headers(fetchOptions.headers);
  if (!headers.has('Content-Type') && !(fetchOptions.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  headers.set('Accept', 'application/json');

  if (!skipAuth) {
    const token = tokenProvider();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    let response = await fetch(url, {
      ...fetchOptions,
      headers,
      signal: controller.signal,
    });

    // Se receber 401 e a rota não for pública/refresh, tenta rotacionar o token uma única vez
    if (response.status === 401 && !skipAuth && !endpoint.includes('/auth/refresh')) {
      const newToken = await executeRefresh();

      if (newToken) {
        headers.set('Authorization', `Bearer ${newToken}`);
        response = await fetch(url, {
          ...fetchOptions,
          headers,
          signal: controller.signal,
        });
      } else {
        revocationHandler('Sua sessão expirou. Faça login novamente.');
        throw new ApiError('SESSION_REVOKED', 'Sessão encerrada ou expirada.', 401);
      }
    }

    // Se status for 204 No Content
    if (response.status === 204) {
      return null as T;
    }

    let json: unknown;
    try {
      json = await response.json();
    } catch {
      if (!response.ok) {
        throw new ApiError('SERVER_ERROR', 'Erro no servidor.', response.status);
      }
      return null as T;
    }

    if (!response.ok) {
      const errRes = json as ApiErrorResponse;
      throw new ApiError(
        errRes?.error?.code ?? 'REQUEST_FAILED',
        errRes?.error?.message ?? 'Falha na requisição.',
        response.status,
        errRes?.error?.details,
      );
    }

    // Resposta envelopada com { data: T }
    const envelope = json as { data?: T };
    return (envelope?.data !== undefined ? envelope.data : json) as T;
  } catch (error: unknown) {
    if (error instanceof ApiError) throw error;
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError('TIMEOUT', 'O servidor demorou demais para responder.');
    }
    throw new ApiError('NETWORK_ERROR', 'Não foi possível conectar ao servidor. Verifique sua conexão.');
  } finally {
    clearTimeout(timeoutId);
  }
}

export const apiClient = {
  request: apiRequest,
};
