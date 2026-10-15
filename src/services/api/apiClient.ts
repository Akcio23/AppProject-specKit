import { NativeModules, Platform } from 'react-native';
import { ApiErrorResponse } from '@/types/auth';

const getBundleHost = (): string | null => {
  try {
    const scriptURL: string | undefined = NativeModules?.SourceCode?.scriptURL;
    if (scriptURL) {
      const match = scriptURL.match(/https?:\/\/([^:/]+)/);
      if (match && match[1]) {
        return match[1];
      }
    }
  } catch {
    // fallback
  }
  return null;
};

export const getApiBaseUrl = (): string => {
  // Em modo de desenvolvimento, detecta o IP real da máquina a partir do script do Metro
  if (__DEV__) {
    const bundleHost = getBundleHost();
    if (bundleHost && bundleHost !== 'localhost' && bundleHost !== '127.0.0.1') {
      return `http://${bundleHost}:3000/api/v1`;
    }
  }

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

export const API_BASE_URL: string = getApiBaseUrl();

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

export const getAuthToken: TokenProvider = () => tokenProvider();

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
  const { skipAuth = false, timeoutMs = 30000, ...fetchOptions } = options;
  const url = `${getApiBaseUrl()}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  // Detecção resiliente de FormData no ambiente React Native / Hermes / JSC
  const isFormData =
    Boolean(fetchOptions.body) &&
    (fetchOptions.body instanceof FormData ||
      (typeof fetchOptions.body === 'object' && '_parts' in fetchOptions.body!) ||
      fetchOptions.body?.constructor?.name === 'FormData');

  const headers: Record<string, string> = {
    Accept: 'application/json',
  };

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  // Copia headers adicionais fornecidos
  if (fetchOptions.headers) {
    if (fetchOptions.headers instanceof Headers) {
      fetchOptions.headers.forEach((val, key) => {
        headers[key] = val;
      });
    } else if (Array.isArray(fetchOptions.headers)) {
      fetchOptions.headers.forEach(([key, val]) => {
        headers[key] = val;
      });
    } else {
      Object.assign(headers, fetchOptions.headers);
    }
  }

  // Se for FormData, NUNCA defina Content-Type manualmente para o fetch calcular o boundary multipart!
  if (isFormData) {
    delete headers['Content-Type'];
    delete headers['content-type'];
  }

  if (!skipAuth) {
    const token = tokenProvider();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
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
        headers['Authorization'] = `Bearer ${newToken}`;
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

    const errorMsg = error instanceof Error ? error.message : String(error);
    const isAbort =
      (error instanceof Error && error.name === 'AbortError') ||
      errorMsg.includes('canceled') ||
      errorMsg.includes('FetchRequestCanceledException');

    if (isAbort) {
      throw new ApiError('TIMEOUT', 'A requisição foi cancelada ou excedeu o tempo limite.');
    }

    console.error('[API CLIENT ERROR]', error);
    throw new ApiError(
      'NETWORK_ERROR',
      `Não foi possível conectar ao servidor (${errorMsg}). Verifique sua conexão.`,
    );
  } finally {
    clearTimeout(timeoutId);
  }
}

export const apiClient = {
  request: apiRequest,
};
