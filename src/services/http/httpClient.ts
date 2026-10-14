import { BibleApiError } from '@/types/bible';

export interface GetJsonOptions {
  timeoutMs: number;
  signal?: AbortSignal;
}

/**
 * GET tipado com timeout e mapeamento de erros HTTP → BibleApiError.
 * Retorna `unknown`: a validação do formato fica a cargo do chamador (type guards).
 */
export async function getJson(url: string, { timeoutMs, signal }: GetJsonOptions): Promise<unknown> {
  const controller = new AbortController();
  let timedOut = false;

  const timeoutId = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);

  const onExternalAbort = (): void => controller.abort();
  signal?.addEventListener('abort', onExternalAbort);

  let response: Response;
  try {
    response = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
  } catch (error: unknown) {
    if (timedOut) {
      throw new BibleApiError('TIMEOUT', 'O servidor demorou demais para responder.');
    }
    if (signal?.aborted) {
      throw error; // cancelamento intencional (ex.: TanStack Query) — repassa sem mapear
    }
    throw new BibleApiError('NETWORK', 'Sem conexão com o servidor. Verifique sua internet.');
  } finally {
    clearTimeout(timeoutId);
    signal?.removeEventListener('abort', onExternalAbort);
  }

  if (!response.ok) {
    if (response.status === 404) {
      throw new BibleApiError('NOT_FOUND', 'Referência não encontrada.', 404);
    }
    if (response.status === 429) {
      throw new BibleApiError(
        'RATE_LIMITED',
        'Muitas requisições. Aguarde alguns segundos e tente novamente.',
        429,
      );
    }
    throw new BibleApiError('SERVER', 'O serviço está indisponível no momento.', response.status);
  }

  try {
    return (await response.json()) as unknown;
  } catch {
    throw new BibleApiError('INVALID_RESPONSE', 'Resposta inválida do servidor.', response.status);
  }
}
