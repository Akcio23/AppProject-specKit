import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';
import { PrismaService } from '@/prisma/prisma.service';

export interface GeneratedTokens {
  refreshToken: string;
  sessionId: string;
}

@Injectable()
export class SessionsService {
  private readonly logger = new Logger(SessionsService.name);

  constructor(private readonly prisma: PrismaService) {}

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private generateOpaqueToken(): string {
    return crypto.randomBytes(32).toString('base64url');
  }

  /**
   * Cria uma nova sessão para o usuário após login ou cadastro.
   */
  async createSession(userId: string, deviceName?: string): Promise<GeneratedTokens> {
    const rawToken = this.generateOpaqueToken();
    const tokenHash = this.hashToken(rawToken);

    const session = await this.prisma.session.create({
      data: {
        userId,
        refreshTokenHash: tokenHash,
        deviceName: deviceName ?? null,
      },
    });

    return {
      refreshToken: rawToken,
      sessionId: session.id,
    };
  }

  /**
   * Rotaciona o refresh token para a sessão.
   * Se um token anterior for apresentado, detecta reuso (roubo de credencial)
   * e invalida a sessão inteira imediatamente.
   */
  async rotateSession(oldRefreshToken: string): Promise<GeneratedTokens & { userId: string }> {
    const tokenHash = this.hashToken(oldRefreshToken);

    // 1. Tenta encontrar a sessão ativa pelo hash atual
    const currentSession = await this.prisma.session.findUnique({
      where: { refreshTokenHash: tokenHash },
    });

    if (currentSession) {
      if (currentSession.revokedAt) {
        throw new UnauthorizedException('Sessão revogada.');
      }

      // Rotação legítima
      const newRawToken = this.generateOpaqueToken();
      const newTokenHash = this.hashToken(newRawToken);

      await this.prisma.session.update({
        where: { id: currentSession.id },
        data: {
          previousTokenHash: tokenHash,
          refreshTokenHash: newTokenHash,
          lastUsedAt: new Date(),
        },
      });

      return {
        refreshToken: newRawToken,
        sessionId: currentSession.id,
        userId: currentSession.userId,
      };
    }

    // 2. Se não achou pelo token atual, checa se foi usado o previous_token_hash (REUSO DETECTADO)
    const reusedSession = await this.prisma.session.findFirst({
      where: { previousTokenHash: tokenHash },
    });

    if (reusedSession) {
      this.logger.warn(
        `[ALERTA DE SEGURANÇA] Tentativa de reuso de token detectada para sessão ${reusedSession.id} do usuário ${reusedSession.userId}. Revogando sessão.`,
      );

      await this.prisma.session.update({
        where: { id: reusedSession.id },
        data: {
          revokedAt: new Date(),
          revokedReason: 'token_reuse',
        },
      });

      throw new UnauthorizedException('Sessão revogada por suspeita de reutilização de credenciais.');
    }

    throw new UnauthorizedException('Token de atualização inválido ou inexistente.');
  }

  /**
   * Revoga uma sessão específica (Logout manual).
   */
  async revokeSession(refreshToken: string): Promise<void> {
    const tokenHash = this.hashToken(refreshToken);

    const session = await this.prisma.session.findUnique({
      where: { refreshTokenHash: tokenHash },
    });

    if (session && !session.revokedAt) {
      await this.prisma.session.update({
        where: { id: session.id },
        data: {
          revokedAt: new Date(),
          revokedReason: 'logout',
        },
      });
    }
  }

  /**
   * Revoga todas as sessões ativas de um usuário (Reset de senha ou exclusão de conta).
   */
  async revokeAllUserSessions(userId: string, reason: string): Promise<void> {
    await this.prisma.session.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
        revokedReason: reason,
      },
    });
  }
}
