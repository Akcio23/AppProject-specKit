import { getApiBaseUrl } from './apiClient';
import { User } from '@/types/auth';

/**
 * Normaliza os dados do usuário, transformando rotas relativas de foto em URLs absolutas.
 */
export function normalizeUser(user: User): User {
  if (user.photoUrl && user.photoUrl.startsWith('/')) {
    const baseRoot = getApiBaseUrl().replace(/\/api\/v1\/?$/, '');
    return {
      ...user,
      photoUrl: `${baseRoot}/api/v1${user.photoUrl}`,
    };
  }
  return user;
}
